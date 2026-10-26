from pathlib import Path
import subprocess
root=Path(__file__).resolve().parents[1]
exe=root/'build/DocumentationUpdateTests.exe'
exe.parent.mkdir(parents=True,exist_ok=True)
subprocess.run(['C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe','/nologo','/target:exe','/platform:x64',
                '/out:'+str(exe),'/reference:System.Net.Http.dll','/reference:System.Web.Extensions.dll',
                str(root/'desktop/DocumentationUpdates.cs'),str(root/'tests/DocumentationUpdateTests.cs')],check=True)
subprocess.run([str(exe)],check=True)
