using System;
using System.IO;
using System.Linq;
using System.Threading;
using System.Diagnostics;
using System.Reflection;

internal static class AutoUpdateTests {
    private static void Assert(bool condition,string message) {if(!condition)throw new Exception(message);}
    private static void Reject(Action action,string name) {try{action();throw new Exception("Accepted "+name);}catch(InvalidDataException) {Console.WriteLine("PASS reject "+name);}}
    private static int Main(string[] args) {
        string root=args[0],fixtures=args[1],bundled=args[2];Directory.CreateDirectory(root);
        var store=new DocumentationStore(root,bundled,"1.1.0");string baseline=store.Snapshot(store.ActiveRoot);
        Assert(store.ActiveRoot==bundled,"Expected embedded fallback");
        foreach(string name in new[]{"traversal","hash","empty-translation","missing","future","older","duplicate"}) {
            Reject(()=>store.Install(File.ReadAllBytes(Path.Combine(fixtures,name+".zip")),CancellationToken.None),name);
            Assert(store.Snapshot(store.ActiveRoot)==baseline,"Rejected package changed the library");
        }
        var cancelled=new CancellationTokenSource();cancelled.Cancel();
        try{store.Install(File.ReadAllBytes(Path.Combine(fixtures,"added.zip")),cancelled.Token);throw new Exception("Ignored cancellation");}catch(OperationCanceledException) {Console.WriteLine("PASS cancelled install keeps library");}
        Assert(store.Install(File.ReadAllBytes(Path.Combine(fixtures,"added.zip")),CancellationToken.None),"Did not install new page");
        var catalog=UpdateFiles.Json.Deserialize<LibraryCatalog>(File.ReadAllText(Path.Combine(store.ActiveRoot,"catalog.json")));
        Assert(catalog.documents.Length==67&&catalog.documents.Any(d=>d.id=="Smart_Port_Devices/Atlas_Test_Sensor"),"New page not indexed");
        Assert(!store.Install(File.ReadAllBytes(Path.Combine(fixtures,"added.zip")),CancellationToken.None),"Installed unchanged snapshot");
        string first=store.ActiveRoot;
        var reopened=new DocumentationStore(root,bundled,"1.1.0");Assert(reopened.ActiveRoot==first,"Update lost after reopen");
        Assert(store.Install(File.ReadAllBytes(Path.Combine(fixtures,"modified.zip")),CancellationToken.None),"Modified page not installed");
        File.WriteAllText(Path.Combine(store.ActiveRoot,"Smart_Port_Devices--Atlas_Test_Sensor.json"),"corrupt");
        Assert(store.ActiveRoot==first,"Did not recover previous complete library");
        Console.WriteLine("PASS added/modified bilingual pages, unchanged snapshot, persistence and corrupt-library fallback");
        Assert(!Directory.GetDirectories(Path.Combine(root,"documents"),"staging-*").Any(),"Leaked staging files");
        Assert(ReleaseTransport.Allowed(new Uri("https://github.com/4c304af/offline-vexv5cpp-api/releases/download/v1.2.0/app.exe"),false),"Trusted asset blocked");
        Assert(!ReleaseTransport.Allowed(new Uri("http://github.com/4c304af/offline-vexv5cpp-api/releases/download/x"),false),"HTTP allowed");
        Assert(!ReleaseTransport.Allowed(new Uri("https://github.com/other/project/releases/download/x"),false),"Foreign repo allowed");
        Assert(!ReleaseTransport.Allowed(new Uri("https://evil.example/app.exe"),true),"Foreign redirect allowed");
        Assert(!ReleaseTransport.Allowed(new Uri("https://release-assets.githubusercontent.com/x"),false),"Unsolicited CDN URL allowed");
        Console.WriteLine("PASS trusted HTTPS download boundary");
        var updater=new AutomaticUpdater(root,bundled,"1.1.0",Assembly.GetExecutingAssembly().Location);Assert(updater.ReadyVersion()==null,"Unexpected application update");
        Console.WriteLine("PASS no unverified application can be restarted");return 0;
    }
}
