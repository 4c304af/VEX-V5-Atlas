using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

internal sealed class FakeDocumentationFetcher : IDocumentationFetcher {
    internal Dictionary<string,string> Pages=new Dictionary<string,string>();
    internal Dictionary<string,string> Failures=new Dictionary<string,string>();
    internal List<string> Requests=new List<string>();
    public Task<string> GetAsync(string url,CancellationToken cancellation) {
        cancellation.ThrowIfCancellationRequested();
        lock(Requests)Requests.Add(url);
        string path=url.Replace("https://api.vex.com/v5/","");
        if(Failures.ContainsKey(path))throw new DocumentationFetchException(Failures[path]);
        if(!Pages.ContainsKey(path))throw new Exception("Unexpected request: "+path);
        return Task.FromResult(Pages[path]);
    }
}
internal static class DocumentationUpdateTests {
    private const string Root="---\ntitle: C++\n---\n# C++\n\nOfficial C++ API reference.\n";
    private const string Motor="---\ntitle: Motor\n---\n# Motor\n\nUse motor.spin(forward).\n";
    private static void Assert(bool condition,string name) { if(!condition)throw new Exception(name); }
    private static SnapshotDocument Document(string id,string title,string source) {
        string hash;
        using(var sha=SHA256.Create())hash=BitConverter.ToString(sha.ComputeHash(Encoding.UTF8.GetBytes(source))).Replace("-","").ToLowerInvariant();
        return new SnapshotDocument {id=id,title=title,sha256=hash,zhTitle=title=="Motor"?"电机":"C++"};
    }
    private static DocumentationSnapshot Snapshot(params SnapshotDocument[] docs) {
        return new DocumentationSnapshot {schemaVersion=1,snapshotId=new string('a',64),snapshotDate="2026-10-26",documents=docs.ToList()};
    }
    private static string Index(params string[] pairs) {
        var names=new List<string>();var titles=new List<string>();
        for(int i=0;i<pairs.Length;i+=2){names.Add("home/cpp/"+pairs[i]);titles.Add(pairs[i+1]);}
        names.Add("home/python/index");titles.Add("Python");
        return "Search.setIndex("+new JavaScriptSerializer().Serialize(new {docnames=names,titles=titles})+");";
    }
    private static FakeDocumentationFetcher Fetcher() {
        var f=new FakeDocumentationFetcher();
        f.Pages["searchindex.js"]=Index("index","C++","Motors/Motor","Motor");
        f.Pages["_sources/home/cpp/index.md.txt"]=Root;
        f.Pages["_sources/home/cpp/Motors/Motor.md.txt"]=Motor;
        return f;
    }
    private static Task<DocumentationUpdateResult> Check(FakeDocumentationFetcher f,DocumentationSnapshot snapshot) {
        return new DocumentationUpdateChecker(f).CheckAsync(snapshot,null,CancellationToken.None);
    }
    private static async Task Run() {
        var baseline=Snapshot(Document("index","C++",Root),Document("Motors/Motor","Motor",Motor));
        var serializer=new JavaScriptSerializer();
        baseline=serializer.Deserialize<DocumentationSnapshot>(serializer.Serialize(baseline));
        var f=Fetcher();f.Pages["_sources/home/cpp/Motors/Motor.md.txt"]="\ufeff"+Motor.Replace("\n","\r\n");
        var r=await Check(f,baseline);
        Assert(r.status=="current"&&r.checkedCount==2&&r.changes.Count==0,"Unchanged sources, BOM/CRLF normalization, C++ filtering, and manifest roundtrip: "+serializer.Serialize(r));
        Console.WriteLine("PASS equivalent sources and canonical line endings");

        f=Fetcher();f.Pages["searchindex.js"]=Index("index","C++","Motors/Motor","Motor","Sensors/New","New sensor");
        f.Pages["_sources/home/cpp/Motors/Motor.md.txt"]=Motor+"New overload: spin(reverse).\n";
        f.Pages["_sources/home/cpp/Sensors/New.md.txt"]="# New sensor\n\nA newly documented sensor.\n";
        r=await Check(f,Snapshot(baseline.documents[0],baseline.documents[1],Document("Sensors/Old","Old sensor","# Old sensor\n")));
        Assert(r.status=="updates"&&r.changes.Count==3&&new HashSet<string>(r.changes.Select(c=>c.kind)).SetEquals(new[]{"added","modified","removed"}),"Simultaneous added, modified, removed pages");
        Assert(r.changes.First(c=>c.kind=="modified").zhTitle=="电机","Chinese label retained");
        Console.WriteLine("PASS added, modified, and removed sources");

        f=Fetcher();f.Failures["_sources/home/cpp/Motors/Motor.md.txt"]="http-404";
        r=await Check(f,baseline);
        Assert(r.status=="partial"&&r.checkedCount==1&&r.failures.Count==1&&r.changes.Count==0,"A failed indexed page is unknown, not removed or current");
        Console.WriteLine("PASS partial failure does not report current or removed");

        f=Fetcher();f.Pages["_sources/home/cpp/Motors/Motor.md.txt"]="<!DOCTYPE html><html><h1>Just a moment</h1></html>";
        r=await Check(f,baseline);
        Assert(r.status=="partial"&&r.failures[0].code=="invalid-content"&&r.changes.Count==0,"Challenge HTML is not a changed document");
        Console.WriteLine("PASS HTML challenge rejected");

        foreach(string index in new[]{"<html>Access denied</html>",Index("Motors/Motor","Motor"),Index("index","C++","../bad","Bad")}) {
            f=Fetcher();f.Pages["searchindex.js"]=index;r=await Check(f,baseline);
            Assert(r.status=="error"&&r.errorCode=="invalid-index"&&r.changes.Count==0&&f.Requests.Count==1,"Invalid or unsafe indexes must not produce removals");
        }
        Console.WriteLine("PASS invalid, incomplete, and unsafe index rejection");

        f=Fetcher();f.Failures["searchindex.js"]="http-403";r=await Check(f,baseline);
        Assert(r.status=="error"&&r.errorCode=="http-403"&&r.changes.Count==0,"Network denial is not current");
        var cancelled=new CancellationTokenSource();cancelled.Cancel();
        r=await new DocumentationUpdateChecker(Fetcher()).CheckAsync(baseline,null,cancelled.Token);
        Assert(r.status=="cancelled","Explicit cancellation");
        Console.WriteLine("PASS network denial and cancellation");

        f=Fetcher();f.Pages["searchindex.js"]=Index("index","C++","Motors/Motor","Renamed motor");r=await Check(f,baseline);
        Assert(r.status=="updates"&&r.changes.Count==1&&r.changes[0].kind=="modified","A title-only change is detected");
        Console.WriteLine("PASS title-only update detection");
    }
    private static int Main() {
        try {Run().GetAwaiter().GetResult();return 0;}catch(Exception error){Console.Error.WriteLine(error);return 1;}
    }
}
