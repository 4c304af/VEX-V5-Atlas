"""Optional live check against this project's public GitHub releases."""
from pathlib import Path
import subprocess,uuid
root=Path(__file__).resolve().parents[1];build=root/'build'/('live-release-'+uuid.uuid4().hex);build.mkdir(parents=True)
source=build/'LiveRelease.cs'
source.write_text('''using System;using System.IO;using System.Threading;
class LiveRelease { static int Main(string[] a) {try{
 Directory.CreateDirectory(a[0]);string target=Path.Combine(a[0],"old.exe");File.WriteAllText(target,"isolated test target");
 var updater=new AutomaticUpdater(a[0],a[1],"1.0.0",target);
 var result=updater.RunAsync(false,true,new Progress<string>(p=>Console.WriteLine(p)),CancellationToken.None).GetAwaiter().GetResult();
 if(result.application.status!="ready"||updater.ReadyVersion()!=result.application.version)throw new Exception("Download not ready: "+result.application.error);
 var reopened=new AutomaticUpdater(a[0],a[1],"1.0.0",target);if(reopened.ReadyVersion()!=result.application.version)throw new Exception("Stage not persisted");
 File.AppendAllText(target,"changed");if(reopened.ReadyVersion()!=null)throw new Exception("Changed target was accepted");
 Console.WriteLine("PASS live verified application download, staged version "+result.application.version+", persistence and changed-target rejection");return 0;
 }catch(Exception e){Console.WriteLine(e);return 1;} } }''',encoding='utf-8')
exe=build/'LiveRelease.exe'
subprocess.run(['C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe','/nologo','/target:exe','/out:'+str(exe),*['/reference:'+r for r in ['System.Net.Http.dll','System.Web.Extensions.dll','System.IO.Compression.dll','System.IO.Compression.FileSystem.dll']],str(root/'desktop/AutoUpdates.cs'),str(root/'desktop/DocumentationUpdates.cs'),str(source)],check=True)
subprocess.run([str(exe),str(build/'data'),str(root/'public/docs')],check=True,timeout=240)
