using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

internal sealed class SnapshotDocument {
    public string id { get; set; }
    public string title { get; set; }
    public string zhTitle { get; set; }
    public string sha256 { get; set; }
}
internal sealed class DocumentationSnapshot {
    public int schemaVersion { get; set; }
    public string snapshotId { get; set; }
    public string snapshotDate { get; set; }
    public List<SnapshotDocument> documents { get; set; }
}
internal sealed class DocumentationChange {
    public string id { get; set; }
    public string title { get; set; }
    public string zhTitle { get; set; }
    public string kind { get; set; }
    public string source { get; set; }
}
internal sealed class DocumentationFailure {
    public string id { get; set; }
    public string title { get; set; }
    public string code { get; set; }
}
internal sealed class DocumentationProgress {
    public string phase { get; set; }
    public int completed { get; set; }
    public int total { get; set; }
}
internal sealed class DocumentationUpdateResult {
    public string status { get; set; }
    public string checkedAt { get; set; }
    public string snapshotDate { get; set; }
    public string snapshotId { get; set; }
    public int total { get; set; }
    public int checkedCount { get; set; }
    public string errorCode { get; set; }
    public List<DocumentationChange> changes { get; set; }
    public List<DocumentationFailure> failures { get; set; }
    internal DocumentationUpdateResult() {
        checkedAt=DateTime.UtcNow.ToString("o");
        changes=new List<DocumentationChange>();failures=new List<DocumentationFailure>();
    }
}

internal sealed class DocumentationFetchException : Exception {
    internal readonly string Code;
    internal DocumentationFetchException(string code) : base(code) { Code=code; }
}
internal interface IDocumentationFetcher {
    Task<string> GetAsync(string url,CancellationToken cancellation);
}

// Only this explicit update check can access the network. The document viewer
// remains restricted to local resources and never sends reading history.
internal sealed class OfficialDocumentationFetcher : IDocumentationFetcher,IDisposable {
    private readonly HttpClient client;
    internal OfficialDocumentationFetcher() {
        ServicePointManager.SecurityProtocol |= SecurityProtocolType.Tls12;
        var handler=new HttpClientHandler {
            AllowAutoRedirect=false,
            AutomaticDecompression=DecompressionMethods.GZip|DecompressionMethods.Deflate,
            UseProxy=true,Proxy=WebRequest.GetSystemWebProxy()
        };
        client=new HttpClient(handler) { Timeout=Timeout.InfiniteTimeSpan };
        client.DefaultRequestHeaders.UserAgent.ParseAdd("V5Astra/1.0.2 (manual-documentation-check)");
        client.DefaultRequestHeaders.CacheControl=new System.Net.Http.Headers.CacheControlHeaderValue { NoCache=true };
    }
    private static bool Allowed(Uri uri) {
        return uri.Scheme=="https" && uri.Host=="api.vex.com" && uri.IsDefaultPort &&
            (uri.AbsolutePath=="/v5/searchindex.js" ||
             uri.AbsolutePath.StartsWith("/v5/_sources/home/cpp/",StringComparison.Ordinal) && uri.AbsolutePath.EndsWith(".md.txt",StringComparison.Ordinal));
    }
    public async Task<string> GetAsync(string url,CancellationToken cancellation) {
        Uri uri=new Uri(url);
        using(var timeout=CancellationTokenSource.CreateLinkedTokenSource(cancellation)) {
            timeout.CancelAfter(TimeSpan.FromSeconds(22));
            try {
                for(int redirects=0;redirects<4;redirects++) {
                    if(!Allowed(uri))throw new DocumentationFetchException("redirect-blocked");
                    using(var response=await client.GetAsync(uri,HttpCompletionOption.ResponseHeadersRead,timeout.Token).ConfigureAwait(false)) {
                        int status=(int)response.StatusCode;
                        if(status>=300&&status<400) {
                            if(response.Headers.Location==null)throw new DocumentationFetchException("redirect-blocked");
                            uri=new Uri(uri,response.Headers.Location);continue;
                        }
                        if(!response.IsSuccessStatusCode)throw new DocumentationFetchException("http-"+status);
                        const int limit=8*1024*1024;
                        if(response.Content.Headers.ContentLength>limit)throw new DocumentationFetchException("invalid-content");
                        using(var stream=await response.Content.ReadAsStreamAsync().ConfigureAwait(false))
                        using(var buffer=new MemoryStream()) {
                            byte[] chunk=new byte[16384];int count;
                            while((count=await stream.ReadAsync(chunk,0,chunk.Length,timeout.Token).ConfigureAwait(false))>0) {
                                if(buffer.Length+count>limit)throw new DocumentationFetchException("invalid-content");
                                buffer.Write(chunk,0,count);
                            }
                            return new UTF8Encoding(false,true).GetString(buffer.ToArray());
                        }
                    }
                }
                throw new DocumentationFetchException("redirect-blocked");
            }catch(OperationCanceledException) {
                if(cancellation.IsCancellationRequested)throw;
                throw new DocumentationFetchException("timeout");
            }catch(HttpRequestException) { throw new DocumentationFetchException("network"); }
             catch(IOException) { throw new DocumentationFetchException("network"); }
             catch(DecoderFallbackException) { throw new DocumentationFetchException("invalid-content"); }
        }
    }
    public void Dispose() { client.Dispose(); }
}

internal sealed class DocumentationUpdateChecker {
    private const string BaseUrl="https://api.vex.com/v5/";
    private readonly IDocumentationFetcher fetcher;
    internal DocumentationUpdateChecker(IDocumentationFetcher fetcher) { this.fetcher=fetcher; }
    internal static string CanonicalHash(string text) {
        text=text.TrimStart('\ufeff').Replace("\r\n","\n").Replace("\r","\n");
        using(var hash=SHA256.Create())return BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(text))).Replace("-","").ToLowerInvariant();
    }
    private static bool ValidId(string id) { return id!=null&&Regex.IsMatch(id,@"^[A-Za-z0-9_-]+(?:/[A-Za-z0-9_-]+)*$"); }
    private static List<SnapshotDocument> ParseIndex(string raw) {
        raw=raw.TrimStart('\ufeff').Trim();
        var match=Regex.Match(raw,@"\ASearch\.setIndex\s*\((.*)\)\s*;?\s*\z",RegexOptions.Singleline);
        if(!match.Success)throw new DocumentationFetchException("invalid-index");
        try {
            var serializer=new JavaScriptSerializer { MaxJsonLength=8*1024*1024 };
            var index=serializer.Deserialize<Dictionary<string,object>>(match.Groups[1].Value);
            var names=(index["docnames"] as System.Collections.IEnumerable).Cast<object>().ToArray();
            var titles=(index["titles"] as System.Collections.IEnumerable).Cast<object>().ToArray();
            if(names.Length!=titles.Length)throw new FormatException();
            var result=new List<SnapshotDocument>();var seen=new HashSet<string>(StringComparer.Ordinal);
            for(int i=0;i<names.Length;i++) {
                string name=names[i] as string;
                if(name==null)throw new FormatException();
                if(!name.StartsWith("home/cpp/",StringComparison.Ordinal))continue;
                string id=name.Substring(9);string title=titles[i] as string;
                if(!ValidId(id)||string.IsNullOrWhiteSpace(title)||!seen.Add(id))throw new FormatException();
                result.Add(new SnapshotDocument { id=id,title=WebUtility.HtmlDecode(title) });
            }
            if(!seen.Contains("index"))throw new FormatException();
            return result;
        }catch(DocumentationFetchException) { throw; }
         catch(Exception error) {
            if(!(error is ArgumentException||error is InvalidOperationException||error is KeyNotFoundException||error is InvalidCastException||error is FormatException))throw;
            throw new DocumentationFetchException("invalid-index");
        }
    }
    private static DocumentationChange Change(SnapshotDocument entry,string kind) {
        return new DocumentationChange { id=entry.id,title=entry.title,zhTitle=entry.zhTitle,kind=kind,
            source=BaseUrl+"home/cpp/"+entry.id+".html" };
    }
    internal async Task<DocumentationUpdateResult> CheckAsync(DocumentationSnapshot snapshot,IProgress<DocumentationProgress> progress,CancellationToken cancellation) {
        var result=new DocumentationUpdateResult { snapshotDate=snapshot.snapshotDate,snapshotId=snapshot.snapshotId };
        try {
            if(snapshot.schemaVersion!=1||snapshot.documents==null||snapshot.documents.Count==0||snapshot.documents.Any(d=>!ValidId(d.id)||!Regex.IsMatch(d.sha256??"",@"^[a-f0-9]{64}$")))
                throw new DocumentationFetchException("invalid-snapshot");
            var baseline=snapshot.documents.ToDictionary(d=>d.id,StringComparer.Ordinal);
            if(progress!=null)progress.Report(new DocumentationProgress {phase="index"});
            var remote=ParseIndex(await fetcher.GetAsync(BaseUrl+"searchindex.js",cancellation).ConfigureAwait(false));
            result.total=remote.Count;
            var remoteIds=new HashSet<string>(remote.Select(d=>d.id),StringComparer.Ordinal);
            var changes=new ConcurrentBag<DocumentationChange>();var failures=new ConcurrentBag<DocumentationFailure>();
            foreach(var missing in snapshot.documents.Where(d=>!remoteIds.Contains(d.id)))changes.Add(Change(missing,"removed"));
            int completed=0,checkedCount=0;
            using(var gate=new SemaphoreSlim(4)) {
                var tasks=remote.Select(async entry=>{
                    await gate.WaitAsync(cancellation).ConfigureAwait(false);
                    try {
                        SnapshotDocument original;
                        baseline.TryGetValue(entry.id,out original);
                        if(original==null)changes.Add(Change(entry,"added"));
                        string content=await fetcher.GetAsync(BaseUrl+"_sources/home/cpp/"+entry.id+".md.txt",cancellation).ConfigureAwait(false);
                        if(content.TrimStart('\ufeff',' ','\r','\n','\t').StartsWith("<",StringComparison.Ordinal)||!Regex.IsMatch(content,@"(?m)^#\s+\S"))
                            throw new DocumentationFetchException("invalid-content");
                        if(original!=null&&(CanonicalHash(content)!=original.sha256||entry.title!=original.title)) {
                            entry.zhTitle=original.zhTitle;changes.Add(Change(entry,"modified"));
                        }
                        Interlocked.Increment(ref checkedCount);
                    }catch(DocumentationFetchException error) {
                        failures.Add(new DocumentationFailure {id=entry.id,title=entry.title,code=error.Code});
                    }finally {
                        int done=Interlocked.Increment(ref completed);gate.Release();
                        if(progress!=null)progress.Report(new DocumentationProgress {phase="documents",completed=done,total=remote.Count});
                    }
                });
                await Task.WhenAll(tasks).ConfigureAwait(false);
            }
            result.checkedCount=checkedCount;
            result.changes=changes.OrderBy(d=>d.kind,StringComparer.Ordinal).ThenBy(d=>d.id,StringComparer.Ordinal).ToList();
            result.failures=failures.OrderBy(d=>d.id,StringComparer.Ordinal).ToList();
            result.status=failures.Count>0?"partial":changes.Count>0?"updates":"current";
        }catch(OperationCanceledException) { result.status="cancelled"; }
         catch(DocumentationFetchException error) { result.status="error";result.errorCode=error.Code; }
         catch(Exception error) {
            if(!(error is IOException||error is ArgumentException||error is InvalidOperationException))throw;
            result.status="error";result.errorCode="invalid-snapshot";
        }
        result.checkedAt=DateTime.UtcNow.ToString("o");return result;
    }
}
