using System;
using System.IO;
using System.IO.Compression;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Diagnostics;

internal sealed class PackageFile { public string name {get;set;} public long size {get;set;} public string sha256 {get;set;} }
internal sealed class DocumentPackage { public int format {get;set;} public string minimumAppVersion {get;set;} public string snapshotId {get;set;} public string snapshotDate {get;set;} public int documentCount {get;set;} public PackageFile[] files {get;set;} }
internal sealed class LibraryEntry { public string id {get;set;} public string key {get;set;} public string title {get;set;} public string zhTitle {get;set;} }
internal sealed class LibraryCatalog { public string snapshotId {get;set;} public LibraryEntry[] documents {get;set;} }
internal sealed class LibraryPage { public string id {get;set;} public string en {get;set;} public string zh {get;set;} }
internal sealed class ReleaseAsset { public string name {get;set;} public string browser_download_url {get;set;} public string digest {get;set;} public long size {get;set;} }
internal sealed class ReleaseInfo { public string tag_name {get;set;} public bool draft {get;set;} public bool prerelease {get;set;} public ReleaseAsset[] assets {get;set;} }
internal sealed class AutoUpdatePart { public string status="skipped"; public string version; public string error; }
internal sealed class AutoUpdateResult { public AutoUpdatePart documents=new AutoUpdatePart(); public AutoUpdatePart application=new AutoUpdatePart(); public string checkedAt=DateTime.UtcNow.ToString("O"); }
internal sealed class StagedApplication { public string target; public string oldHash; public string newHash; public string version; }

internal static class UpdateFiles {
    internal static readonly JavaScriptSerializer Json=new JavaScriptSerializer {MaxJsonLength=32*1024*1024};
    internal static string Hash(byte[] bytes) { using(var sha=SHA256.Create())return BitConverter.ToString(sha.ComputeHash(bytes)).Replace("-","").ToLowerInvariant(); }
    internal static string HashFile(string path) { using(var sha=SHA256.Create())using(var stream=File.OpenRead(path))return BitConverter.ToString(sha.ComputeHash(stream)).Replace("-","").ToLowerInvariant(); }
    internal static bool IsHash(string value) { return value!=null&&Regex.IsMatch(value,"^[a-f0-9]{64}$"); }
    internal static Version VersionOf(string text) { Version value; if(text==null||!Regex.IsMatch(text,@"^v?\d+\.\d+\.\d+$")||!Version.TryParse(text.TrimStart('v'),out value))throw new InvalidDataException("invalid-version");return value; }
    internal static void AtomicText(string target,string text) {
        Directory.CreateDirectory(Path.GetDirectoryName(target));string temp=target+"."+Guid.NewGuid().ToString("N")+".tmp";
        File.WriteAllText(temp,text);
        if(File.Exists(target))File.Replace(temp,target,target+".previous",true);else File.Move(temp,target);
    }
}

// Only release metadata and assets from this public repository are accepted.
internal sealed class ReleaseTransport : IDisposable {
    internal const string Repository="4c304af/VEX-V5-Atlas";
    internal const string LegacyRepository="4c304af/offline-vexv5cpp-api";
    private readonly HttpClient client;
    internal ReleaseTransport() {
        System.Net.ServicePointManager.SecurityProtocol|=System.Net.SecurityProtocolType.Tls12;
        client=new HttpClient(new HttpClientHandler {AllowAutoRedirect=false,UseProxy=true});
        client.Timeout=TimeSpan.FromMinutes(3);client.DefaultRequestHeaders.UserAgent.ParseAdd("V5Atlas/1.1.0");
        client.DefaultRequestHeaders.TryAddWithoutValidation("Accept","application/vnd.github+json");
    }
    internal static bool Allowed(Uri uri,bool redirected) {
        if(uri.Scheme!="https"||!uri.IsDefaultPort||!string.IsNullOrEmpty(uri.UserInfo))return false;
        if(uri.Host=="api.github.com")return uri.AbsolutePath.StartsWith("/repos/"+Repository+"/releases/",StringComparison.Ordinal)
            || !redirected&&uri.AbsolutePath.StartsWith("/repos/"+LegacyRepository+"/releases/",StringComparison.Ordinal);
        if(uri.Host=="github.com")return new[]{Repository,LegacyRepository}.Any(repo=>uri.AbsolutePath.StartsWith("/"+repo+"/releases/download/",StringComparison.Ordinal));
        return redirected&&(uri.Host=="release-assets.githubusercontent.com"||uri.Host=="objects.githubusercontent.com");
    }
    internal async Task<byte[]> GetAsync(string url,long limit,CancellationToken token) {
        Uri uri=new Uri(url);
        for(int redirects=0;redirects<5;redirects++) {
            if(!Allowed(uri,redirects>0))throw new InvalidDataException("untrusted-download");
            using(var response=await client.GetAsync(uri,HttpCompletionOption.ResponseHeadersRead,token)) {
                int status=(int)response.StatusCode;
                if(status>=300&&status<400) { if(response.Headers.Location==null)throw new IOException("redirect");uri=new Uri(uri,response.Headers.Location);continue; }
                response.EnsureSuccessStatusCode();
                if(response.Content.Headers.ContentLength>limit)throw new InvalidDataException("package-too-large");
                using(var input=await response.Content.ReadAsStreamAsync())using(var output=new MemoryStream()) {
                    byte[] buffer=new byte[65536];int count;
                    while((count=await input.ReadAsync(buffer,0,buffer.Length,token))>0) { if(output.Length+count>limit)throw new InvalidDataException("package-too-large");await output.WriteAsync(buffer,0,count,token); }
                    return output.ToArray();
                }
            }
        }
        throw new IOException("redirect-limit");
    }
    internal async Task<ReleaseInfo> ReleaseAsync(string endpoint,CancellationToken token) {
        byte[] bytes=null;
        try {bytes=await GetAsync("https://api.github.com/repos/"+Repository+"/releases/"+endpoint,2*1024*1024,token);}
        catch(HttpRequestException) { }
        if(bytes==null)bytes=await GetAsync("https://api.github.com/repos/"+LegacyRepository+"/releases/"+endpoint,2*1024*1024,token);
        var release=UpdateFiles.Json.Deserialize<ReleaseInfo>(System.Text.Encoding.UTF8.GetString(bytes));
        if(release==null||release.draft||release.assets==null)throw new InvalidDataException("invalid-release");return release;
    }
    internal async Task<byte[]> AssetAsync(ReleaseAsset asset,long limit,CancellationToken token) {
        if(asset==null||asset.size<=0||asset.size>limit||asset.digest==null||!asset.digest.StartsWith("sha256:")||!UpdateFiles.IsHash(asset.digest.Substring(7)))throw new InvalidDataException("missing-checksum");
        byte[] bytes=await GetAsync(asset.browser_download_url,limit,token);
        if(bytes.LongLength!=asset.size||UpdateFiles.Hash(bytes)!=asset.digest.Substring(7))throw new InvalidDataException("checksum-mismatch");return bytes;
    }
    public void Dispose() { client.Dispose(); }
}

internal sealed class DocumentationStore {
    private readonly string root,bundled,appVersion;
    internal DocumentationStore(string dataRoot,string bundledRoot,string version) {root=Path.Combine(dataRoot,"documents");bundled=bundledRoot;appVersion=version;}
    internal string ActiveRoot {
        get {
            // Prefer the embedded corpus if it is newer than a previously downloaded one.
            foreach(string pointer in new[]{"active.json","active.json.previous"})try {
                string id=UpdateFiles.Json.Deserialize<string>(File.ReadAllText(Path.Combine(root,pointer)));
                if(!UpdateFiles.IsHash(id))continue;
                string path=Path.Combine(root,"datasets",id);
                if(!File.Exists(Path.Combine(path,".complete")))continue;
                var selected=UpdateFiles.Json.Deserialize<DocumentPackage>(File.ReadAllText(Path.Combine(path,"package-manifest.json")));
                var baseline=UpdateFiles.Json.Deserialize<DocumentationSnapshot>(File.ReadAllText(Path.Combine(bundled,"update-manifest.json")));
                if(UpdateFiles.VersionOf(selected.minimumAppVersion)>UpdateFiles.VersionOf(appVersion)||string.CompareOrdinal(selected.snapshotDate,baseline.snapshotDate)<0)return bundled;
                Validate(path,selected,CancellationToken.None);return path;
            }catch { }
            return bundled;
        }
    }
    internal string Snapshot(string path) { return UpdateFiles.Json.Deserialize<LibraryCatalog>(File.ReadAllText(Path.Combine(path,"catalog.json"))).snapshotId; }
    private static bool SafeName(string name) {
        return name!=null&&(Regex.IsMatch(name,@"^[A-Za-z0-9_-]+\.json$")||Regex.IsMatch(name,@"^media/[A-Za-z0-9_-]+\.(png|jpg|jpeg|gif|webp|svg)$"));
    }
    private static void Validate(string path,DocumentPackage manifest,CancellationToken token) {
        if(manifest==null||manifest.format!=1||!UpdateFiles.IsHash(manifest.snapshotId)||manifest.documentCount<1||manifest.documentCount>2000||manifest.files==null||manifest.files.Length>6000)throw new InvalidDataException("invalid-package");
        var names=new HashSet<string>(StringComparer.OrdinalIgnoreCase);long total=0;
        foreach(var file in manifest.files) {
            token.ThrowIfCancellationRequested();
            if(!SafeName(file.name)||!names.Add(file.name)||!UpdateFiles.IsHash(file.sha256)||file.size<0||file.size>16*1024*1024||(total+=file.size)>128*1024*1024)throw new InvalidDataException("invalid-file");
            string target=Path.Combine(path,file.name.Replace('/',Path.DirectorySeparatorChar));
            if(!File.Exists(target)||new FileInfo(target).Length!=file.size||UpdateFiles.HashFile(target)!=file.sha256)throw new InvalidDataException("checksum-mismatch");
        }
        if(!names.Contains("catalog.json")||!names.Contains("update-manifest.json"))throw new InvalidDataException("incomplete-package");
        var catalog=UpdateFiles.Json.Deserialize<LibraryCatalog>(File.ReadAllText(Path.Combine(path,"catalog.json")));
        var baseline=UpdateFiles.Json.Deserialize<DocumentationSnapshot>(File.ReadAllText(Path.Combine(path,"update-manifest.json")));
        if(catalog.snapshotId!=manifest.snapshotId||baseline.snapshotId!=manifest.snapshotId||baseline.snapshotDate!=manifest.snapshotDate||catalog.documents.Length!=manifest.documentCount||baseline.documents.Count!=manifest.documentCount)throw new InvalidDataException("incomplete-library");
        var ids=new HashSet<string>();var keys=new HashSet<string>();
        foreach(var entry in catalog.documents) {
            if(string.IsNullOrWhiteSpace(entry.id)||!ids.Add(entry.id)||!keys.Add(entry.key)||!names.Contains(entry.key+".json")||string.IsNullOrWhiteSpace(entry.title)||string.IsNullOrWhiteSpace(entry.zhTitle))throw new InvalidDataException("invalid-catalog");
            var page=UpdateFiles.Json.Deserialize<LibraryPage>(File.ReadAllText(Path.Combine(path,entry.key+".json")));
            if(page.id!=entry.id||string.IsNullOrWhiteSpace(page.en)||string.IsNullOrWhiteSpace(page.zh))throw new InvalidDataException("incomplete-translation");
        }
    }
    internal bool Install(byte[] zip,CancellationToken token) {
        Directory.CreateDirectory(root);string staging=Path.Combine(root,"staging-"+Guid.NewGuid().ToString("N"));Directory.CreateDirectory(staging);
        try {
            using(var stream=new MemoryStream(zip))using(var archive=new ZipArchive(stream,ZipArchiveMode.Read)) {
                if(archive.Entries.Count>6001)throw new InvalidDataException("too-many-files");
                var names=new HashSet<string>(StringComparer.OrdinalIgnoreCase);long total=0;
                foreach(var entry in archive.Entries) {
                    token.ThrowIfCancellationRequested();
                    if((entry.FullName!="package-manifest.json"&&!SafeName(entry.FullName))||!names.Add(entry.FullName)||entry.Length>16*1024*1024||(total+=entry.Length)>128*1024*1024)throw new InvalidDataException("invalid-archive");
                    string file=Path.Combine(staging,entry.FullName.Replace('/',Path.DirectorySeparatorChar));Directory.CreateDirectory(Path.GetDirectoryName(file));
                    using(var input=entry.Open())using(var output=File.Create(file)) {byte[] buffer=new byte[65536];int count;long written=0;while((count=input.Read(buffer,0,buffer.Length))>0) {token.ThrowIfCancellationRequested();written+=count;if(written>entry.Length)throw new InvalidDataException("invalid-size");output.Write(buffer,0,count);}}
                }
            }
            var manifest=UpdateFiles.Json.Deserialize<DocumentPackage>(File.ReadAllText(Path.Combine(staging,"package-manifest.json")));
            if(UpdateFiles.VersionOf(manifest.minimumAppVersion)>UpdateFiles.VersionOf(appVersion))throw new InvalidDataException("app-update-required");
            Validate(staging,manifest,token);
            if(Directory.GetFiles(staging,"*",SearchOption.AllDirectories).Length!=manifest.files.Length+1)throw new InvalidDataException("unexpected-files");
            string active=ActiveRoot;
            if(manifest.snapshotId==Snapshot(active))return false;
            var old=UpdateFiles.Json.Deserialize<DocumentationSnapshot>(File.ReadAllText(Path.Combine(active,"update-manifest.json")));
            if(string.CompareOrdinal(manifest.snapshotDate,old.snapshotDate)<0)throw new InvalidDataException("older-snapshot");
            token.ThrowIfCancellationRequested();
            File.WriteAllText(Path.Combine(staging,".complete"),manifest.snapshotId);
            string datasets=Path.Combine(root,"datasets");Directory.CreateDirectory(datasets);string destination=Path.Combine(datasets,manifest.snapshotId);
            if(Directory.Exists(destination))Validate(destination,manifest,token);else Directory.Move(staging,destination);
            UpdateFiles.AtomicText(Path.Combine(root,"active.json"),UpdateFiles.Json.Serialize(manifest.snapshotId));return true;
        } finally {
            // This random staging path is owned by this store and never points at an active dataset.
            if(Path.GetFullPath(staging).StartsWith(Path.GetFullPath(root)+Path.DirectorySeparatorChar,StringComparison.OrdinalIgnoreCase)&&Path.GetFileName(staging).StartsWith("staging-")&&Directory.Exists(staging))Directory.Delete(staging,true);
        }
    }
}

internal sealed class AutomaticUpdater {
    private readonly string root,version,target;
    internal readonly DocumentationStore Store;
    internal AutomaticUpdater(string dataRoot,string bundled,string appVersion,string executable) {root=dataRoot;version=appVersion;target=executable;Store=new DocumentationStore(root,bundled,version);}
    private string ReadyFile { get {return Path.Combine(root,"updates","ready.json");} }
    internal string ReadyVersion() { try {var stage=UpdateFiles.Json.Deserialize<StagedApplication>(File.ReadAllText(ReadyFile));string file=Path.Combine(root,"updates",stage.version,"app.exe");if(UpdateFiles.VersionOf(stage.version)>UpdateFiles.VersionOf(version)&&stage.target==target&&stage.newHash==UpdateFiles.HashFile(file)&&stage.oldHash==UpdateFiles.HashFile(target))return stage.version;}catch { }return null; }
    internal async Task<AutoUpdateResult> RunAsync(bool documents,bool application,IProgress<string> progress,CancellationToken token) {
        var result=new AutoUpdateResult();
        using(var transport=new ReleaseTransport()) {
            if(documents)try {
                progress.Report("documents:check");var release=await transport.ReleaseAsync("tags/documentation-latest",token);
                if(release.tag_name!="documentation-latest")throw new InvalidDataException("invalid-feed");
                var asset=release.assets.SingleOrDefault(a=>a.name=="V5-Atlas-documents.zip");
                // Asset digest lets unchanged feeds be skipped without downloading the package.
                string receipt=Path.Combine(root,"documents","receipt.json");
                string fingerprint=asset==null?null:asset.digest+":"+Store.Snapshot(Store.ActiveRoot);
                if(fingerprint!=null&&File.Exists(receipt)&&File.ReadAllText(receipt)==fingerprint)result.documents.status="current";
                else {
                    progress.Report("documents:download");byte[] zip=await transport.AssetAsync(asset,48*1024*1024,token);
                    progress.Report("documents:verify");bool changed=await Task.Run(()=>Store.Install(zip,token),token);
                    UpdateFiles.AtomicText(receipt,asset.digest+":"+Store.Snapshot(Store.ActiveRoot));
                    result.documents.status=changed?"updated":"current";
                }
            }catch(Exception error) {result.documents.status=token.IsCancellationRequested?"cancelled":"error";result.documents.error=error is InvalidDataException?error.Message:"network";}
            if(application&&!token.IsCancellationRequested)try {
                progress.Report("application:check");string ready=ReadyVersion();
                var release=await transport.ReleaseAsync("latest",token);var latest=UpdateFiles.VersionOf(release.tag_name);
                if(release.prerelease)throw new InvalidDataException("invalid-release");
                if(latest<=UpdateFiles.VersionOf(version))result.application.status="current";
                else {
                    string next=latest.ToString(3);result.application.version=next;
                    if(ready!=next) {
                        var asset=release.assets.SingleOrDefault(a=>a.name=="V5-Atlas-"+next+"-Windows-x64.exe");progress.Report("application:download");
                        byte[] bytes=await transport.AssetAsync(asset,64*1024*1024,token);
                        if(bytes.Length<2||bytes[0]!='M'||bytes[1]!='Z')throw new InvalidDataException("invalid-executable");
                        string folder=Path.Combine(root,"updates",next);Directory.CreateDirectory(folder);
                        string exe=Path.Combine(folder,"app.exe");File.WriteAllBytes(exe,bytes);
                        if(FileVersionInfo.GetVersionInfo(exe).FileVersion!=next+".0")throw new InvalidDataException("version-mismatch");
                        var stage=new StagedApplication {target=target,oldHash=UpdateFiles.HashFile(target),newHash=UpdateFiles.Hash(bytes),version=next};
                        UpdateFiles.AtomicText(ReadyFile,UpdateFiles.Json.Serialize(stage));
                        File.WriteAllText(Path.Combine(folder,"stage.json"),UpdateFiles.Json.Serialize(stage));
                    }
                    result.application.status="ready";
                }
            }catch(Exception error) {result.application.status=token.IsCancellationRequested?"cancelled":"error";result.application.error=error is InvalidDataException?error.Message:"network";string ready=ReadyVersion();if(ready!=null){result.application.status="ready";result.application.version=ready;}}
        }
        return result;
    }
    internal bool Restart() {
        string ready=ReadyVersion();if(ready==null)return false;
        Process.Start(new ProcessStartInfo(Path.Combine(root,"updates",ready,"app.exe"),"--apply-update="+Process.GetCurrentProcess().Id) {UseShellExecute=false,CreateNoWindow=true,WindowStyle=ProcessWindowStyle.Hidden});return true;
    }
    // Runs before loading WebView2, from the verified staged executable itself.
    internal static bool IsUpdateLocation(string data,string target,string localData) {
        string directory=Path.GetDirectoryName(Path.GetFullPath(target));
        return string.Equals(Path.GetFullPath(data),Path.Combine(localData,"V5 Atlas"),StringComparison.OrdinalIgnoreCase)
            || string.Equals(Path.GetFullPath(data),Path.Combine(directory,".v5-atlas"),StringComparison.OrdinalIgnoreCase);
    }
    internal static void Apply(int processId) {
        string self=System.Reflection.Assembly.GetExecutingAssembly().Location;string folder=Path.GetDirectoryName(self);
        var stage=UpdateFiles.Json.Deserialize<StagedApplication>(File.ReadAllText(Path.Combine(folder,"stage.json")));
        string data=Path.GetFullPath(Path.Combine(folder,"..",".."));
        if(!IsUpdateLocation(data,stage.target,Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData))||Path.GetFileName(Path.GetDirectoryName(folder))!="updates"||Path.GetFileName(folder)!=stage.version||UpdateFiles.VersionOf(stage.version)==null||FileVersionInfo.GetVersionInfo(self).FileVersion!=stage.version+".0"||Path.GetExtension(stage.target)!=".exe"||UpdateFiles.HashFile(self)!=stage.newHash||UpdateFiles.HashFile(stage.target)!=stage.oldHash)throw new InvalidDataException("invalid-update-stage");
        try {using(var process=Process.GetProcessById(processId)) {if(!string.Equals(process.MainModule.FileName,stage.target,StringComparison.OrdinalIgnoreCase))throw new InvalidDataException("wrong-process");if(!process.WaitForExit(45000))return;}}catch(ArgumentException) { }
        string temp=stage.target+".next",backup=stage.target+".previous";
        if(UpdateFiles.HashFile(stage.target)!=stage.oldHash)throw new InvalidDataException("target-changed");
        // Wait for the old process's OS handles to close, then replace on the same volume.
        for(int attempt=0;attempt<30;attempt++)try {File.Copy(self,temp,true);File.Replace(temp,stage.target,backup,true);break;}catch(IOException) {if(attempt==29)throw;Thread.Sleep(200);}
        try {Process.Start(new ProcessStartInfo(stage.target) {UseShellExecute=false,CreateNoWindow=true});}
        catch {File.Copy(backup,stage.target,true);throw;}
    }
}
