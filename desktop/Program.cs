using System;
using System.IO;
using System.IO.Compression;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;
using System.Windows.Forms;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

internal static class Program {
    internal static string BundleRoot;
    internal static bool Testing;
    internal static string Profile;
    private static Mutex instance;
    [DllImport("user32.dll")] private static extern bool SetProcessDpiAwarenessContext(IntPtr context);
    [DllImport("kernel32.dll", CharSet = CharSet.Unicode, SetLastError = true)] private static extern bool SetDllDirectory(string path);

    [STAThread]
    private static void Main(string[] args) {
        try {
            Testing = args.Contains("--test");
            string customProfile = args.FirstOrDefault(a => a.StartsWith("--profile="));
            Profile = customProfile == null ? Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ".v5-atlas", "profile") : Path.GetFullPath(customProfile.Substring(10));
            bool created;
            instance = new Mutex(true, Testing ? "V5Atlas.Test." + Guid.NewGuid().ToString("N") : "V5Atlas.Desktop", out created);
            if (!created) return;
            try { SetProcessDpiAwarenessContext(new IntPtr(-4)); } catch (EntryPointNotFoundException) { }
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            ExtractBundle();
            SetDllDirectory(BundleRoot);
            AppDomain.CurrentDomain.AssemblyResolve += delegate(object sender, ResolveEventArgs ev) {
                string name = new AssemblyName(ev.Name).Name;
                if (name != "Microsoft.Web.WebView2.Core" && name != "Microsoft.Web.WebView2.WinForms") return null;
                // These two assemblies are shipped inside our content bundle.
                // Loading their bytes avoids treating a portable/network drive
                // as a remote .NET assembly source.
                return Assembly.Load(File.ReadAllBytes(Path.Combine(BundleRoot, name + ".dll")));
            };
            StartHost();
        } catch (Exception error) {
            string message = "V5 Atlas 无法启动 / Could not start V5 Atlas.\n\n" + error.Message;
            if (error.ToString().Contains("WebView2")) message += "\n\n请确认系统已安装 Microsoft Edge WebView2 运行时。\nPlease make sure Microsoft Edge WebView2 Runtime is installed.";
            Fail("bootstrap",error);
            if (!Testing) MessageBox.Show(message, "V5 Atlas", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    internal static void Fail(string stage,Exception error) {
        Environment.ExitCode=1;
        try { File.AppendAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory,"V5Atlas-startup.log"),DateTime.UtcNow.ToString("O")+" "+stage+"\r\n"+error+"\r\n"); } catch { }
    }

    [MethodImpl(MethodImplOptions.NoInlining)]
    private static void StartHost() { Application.Run(new AtlasForm()); }

    private static void ExtractBundle() {
        Assembly asm = Assembly.GetExecutingAssembly();
        string bundleId;
        using (StreamReader reader = new StreamReader(asm.GetManifestResourceStream("atlas.bundle-id"))) bundleId = reader.ReadToEnd().Trim();
        BundleRoot = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, ".v5-atlas", "bundles", bundleId);
        string marker = Path.Combine(BundleRoot, ".complete");
        if (File.Exists(marker) && File.Exists(Path.Combine(BundleRoot, "app", "index.html"))) return;
        Directory.CreateDirectory(BundleRoot);
        using (Stream stream = asm.GetManifestResourceStream("atlas.bundle"))
        using (ZipArchive archive = new ZipArchive(stream, ZipArchiveMode.Read)) {
            foreach (ZipArchiveEntry entry in archive.Entries) {
                string target = Path.GetFullPath(Path.Combine(BundleRoot, entry.FullName));
                if (!target.StartsWith(BundleRoot + Path.DirectorySeparatorChar, StringComparison.OrdinalIgnoreCase)) throw new InvalidDataException("Invalid resource path.");
                if (entry.FullName.EndsWith("/")) { Directory.CreateDirectory(target); continue; }
                Directory.CreateDirectory(Path.GetDirectoryName(target));
                using (Stream input = entry.Open())
                using (FileStream output = File.Create(target)) input.CopyTo(output);
            }
        }
        File.WriteAllText(marker, bundleId);
    }
}

internal sealed class AtlasForm : Form {
    private readonly WebView2 view = new WebView2();
    private const string Origin = "https://v5-atlas.local";
    private readonly JavaScriptSerializer json = new JavaScriptSerializer();
    private CancellationTokenSource updateCancellation;

    internal AtlasForm() {
        Text = "V5 Atlas · VEX V5 C++ API";
        ClientSize = new Size(1440, 920);
        MinimumSize = new Size(920, 680);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = Color.FromArgb(248, 249, 244);
        Icon = new Icon(Assembly.GetExecutingAssembly().GetManifestResourceStream("atlas.icon"));
        view.Dock = DockStyle.Fill;
        view.DefaultBackgroundColor = BackColor;
        Controls.Add(view);
        FormClosing += delegate { if(updateCancellation!=null)updateCancellation.Cancel(); };
    }

    protected override async void OnLoad(EventArgs e) {
        base.OnLoad(e);
        try {
            var options = new CoreWebView2EnvironmentOptions();
            options.AdditionalBrowserArguments = "--disable-background-networking --disable-component-update" + (Program.Testing ? " --remote-debugging-port=9336" : "");
            CoreWebView2Environment environment = await CoreWebView2Environment.CreateAsync(null, Program.Profile, options);
            await view.EnsureCoreWebView2Async(environment);
            CoreWebView2 core = view.CoreWebView2;
            core.Settings.AreDevToolsEnabled = Program.Testing;
            core.Settings.IsStatusBarEnabled = false;
            core.Settings.AreHostObjectsAllowed = false;
            core.Settings.IsPasswordAutosaveEnabled = false;
            core.Settings.IsGeneralAutofillEnabled = false;
            core.SetVirtualHostNameToFolderMapping("v5-atlas.local", Path.Combine(Program.BundleRoot, "app"), CoreWebView2HostResourceAccessKind.DenyCors);
            core.AddWebResourceRequestedFilter("*", CoreWebView2WebResourceContext.All);
            core.WebResourceRequested += delegate(object sender, CoreWebView2WebResourceRequestedEventArgs ev) {
                Uri uri;
                if (!Uri.TryCreate(ev.Request.Uri, UriKind.Absolute, out uri) || uri.Scheme != "https" || uri.Host != "v5-atlas.local") {
                    ev.Response = environment.CreateWebResourceResponse(new MemoryStream(), 403, "Offline mode", "Content-Type: text/plain");
                }
            };
            core.NavigationStarting += delegate(object sender, CoreWebView2NavigationStartingEventArgs ev) {
                Uri uri;
                if (!Uri.TryCreate(ev.Uri, UriKind.Absolute, out uri) || uri.Scheme != "https" || uri.Host != "v5-atlas.local") ev.Cancel = true;
            };
            core.NewWindowRequested += delegate(object sender, CoreWebView2NewWindowRequestedEventArgs ev) { ev.Handled = true; };
            core.PermissionRequested += delegate(object sender, CoreWebView2PermissionRequestedEventArgs ev) { ev.State = CoreWebView2PermissionState.Deny; };
            core.DownloadStarting += delegate(object sender, CoreWebView2DownloadStartingEventArgs ev) { ev.Cancel = true; };
            core.WebMessageReceived += OnWebMessage;
            await core.AddScriptToExecuteOnDocumentCreatedAsync(@"
                document.addEventListener('DOMContentLoaded',()=>document.documentElement.dataset.nativeFrame='true');
                const send=(action,url)=>window.chrome.webview.postMessage(JSON.stringify({action,url}));
                const pending=new Map();let sequence=0;
                window.chrome.webview.addEventListener('message',event=>{
                  const message=event.data;if(!message||typeof message!=='object')return;
                  const request=pending.get(message.requestId);if(!request)return;
                  if(message.type==='docs:progress'){request.progress?.(message.progress);}
                  if(message.type==='docs:result'){clearTimeout(request.timer);pending.delete(message.requestId);request.resolve(message.result);}
                });
                window.atlasDesktop=Object.freeze({
                  minimize:()=>send('minimize'),maximize:()=>send('maximize'),close:()=>send('close'),
                  checkDocUpdates:progress=>new Promise((resolve,reject)=>{
                    const requestId='update-'+(++sequence);
                    const timer=setTimeout(()=>{pending.delete(requestId);send('docs:cancel');reject(new Error('timeout'));},140000);
                    pending.set(requestId,{resolve,reject,progress,timer});
                    window.chrome.webview.postMessage(JSON.stringify({action:'docs:check',requestId}));
                  }),
                  cancelDocUpdateCheck:()=>send('docs:cancel'),
                  openSource:url=>{let ok=false;try{const u=new URL(url);ok=u.protocol==='https:'&&u.hostname==='api.vex.com'&&u.pathname.startsWith('/v5/');}catch{}if(ok)send('source',url);return Promise.resolve(ok);}
                });
            ");
            core.Navigate(Origin + "/index.html");
        } catch (Exception error) {
            Program.Fail("webview",error);
            if (!Program.Testing) MessageBox.Show("无法打开离线文档 / Unable to open offline documents.\n\n" + error.Message + "\n\n错误详情已保存在程序旁的 V5Atlas-startup.log。", "V5 Atlas", MessageBoxButtons.OK, MessageBoxIcon.Error);
            Close();
        }
    }

    private async void OnWebMessage(object sender, CoreWebView2WebMessageReceivedEventArgs ev) {
        Uri source;
        if (!Uri.TryCreate(ev.Source, UriKind.Absolute, out source) || source.Scheme!="https" || source.Host != "v5-atlas.local") return;
        try {
            var message = json.Deserialize<Dictionary<string, object>>(ev.TryGetWebMessageAsString());
            string action = message.ContainsKey("action") ? message["action"] as string : null;
            switch (action) {
                case "minimize": WindowState = FormWindowState.Minimized; break;
                case "maximize": WindowState = WindowState == FormWindowState.Maximized ? FormWindowState.Normal : FormWindowState.Maximized; break;
                case "close": Close(); break;
                case "docs:cancel": if(updateCancellation!=null)updateCancellation.Cancel();break;
                case "docs:check":
                    string requestId=message.ContainsKey("requestId")?message["requestId"] as string:null;
                    if(string.IsNullOrEmpty(requestId)||requestId.Length>80)break;
                    await CheckDocumentationAsync(requestId);break;
                case "source":
                    string url = message.ContainsKey("url") ? message["url"] as string : null;
                    Uri target;
                    if (url != null && Uri.TryCreate(url, UriKind.Absolute, out target) && target.Scheme == "https" && target.Host == "api.vex.com" && target.AbsolutePath.StartsWith("/v5/")) Process.Start(new ProcessStartInfo(target.ToString()) { UseShellExecute = true });
                    break;
            }
        } catch (Exception error) { Debug.WriteLine(error); }
    }

    private void PostUpdateMessage(object message) {
        if(!IsDisposed&&!Disposing&&view.CoreWebView2!=null)view.CoreWebView2.PostWebMessageAsJson(json.Serialize(message));
    }
    private async Task CheckDocumentationAsync(string requestId) {
        if(updateCancellation!=null) {
            PostUpdateMessage(new {type="docs:result",requestId=requestId,result=new DocumentationUpdateResult {status="error",errorCode="busy"}});return;
        }
        updateCancellation=new CancellationTokenSource();
        var userCancellation=updateCancellation;
        DocumentationUpdateResult result;
        try {
            var snapshot=json.Deserialize<DocumentationSnapshot>(File.ReadAllText(Path.Combine(Program.BundleRoot,"app","docs","update-manifest.json")));
            var progress=new Progress<DocumentationProgress>(value=>{
                PostUpdateMessage(new {type="docs:progress",requestId=requestId,progress=value});
            });
            using(var deadline=CancellationTokenSource.CreateLinkedTokenSource(userCancellation.Token))
            using(var fetcher=new OfficialDocumentationFetcher()) {
                deadline.CancelAfter(TimeSpan.FromSeconds(120));
                result=await new DocumentationUpdateChecker(fetcher).CheckAsync(snapshot,progress,deadline.Token);
                if(result.status=="cancelled"&&!userCancellation.IsCancellationRequested) { result.status="error";result.errorCode="timeout"; }
            }
        }catch(Exception error) {
            Debug.WriteLine(error);result=new DocumentationUpdateResult {status="error",errorCode=error is IOException?"invalid-snapshot":"network"};
        }finally { updateCancellation=null;userCancellation.Dispose(); }
        PostUpdateMessage(new {type="docs:result",requestId=requestId,result=result});
    }
}
