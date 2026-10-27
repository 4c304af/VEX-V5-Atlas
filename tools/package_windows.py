"""Produce a single Windows executable with embedded documents and host SDK."""
from pathlib import Path
import hashlib, zipfile, subprocess, json

ROOT=Path(__file__).resolve().parents[1]
sdk=ROOT/'build/webview2/sdk'
core=sdk/'lib/net462/Microsoft.Web.WebView2.Core.dll'
forms=sdk/'lib/net462/Microsoft.Web.WebView2.WinForms.dll'
loader=sdk/'runtimes/win-x64/native/WebView2Loader.dll'
assert all(p.exists() for p in [core,forms,loader]),'Run npm run setup:windows first (see README).'
icon=ROOT/'desktop/icon.ico'
build=ROOT/'build';build.mkdir(exist_ok=True)
release=ROOT/'release';release.mkdir(exist_ok=True)
bundle=build/'atlas-content.zip'
with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for file in sorted((ROOT/'dist').rglob('*')):
        if file.is_file():archive.write(file,'app/'+file.relative_to(ROOT/'dist').as_posix())
    for file in [core,forms,loader]:archive.write(file,file.name)
bundle_id=hashlib.sha256(bundle.read_bytes()).hexdigest()[:20]
(build/'bundle-id.txt').write_text(bundle_id,encoding='utf-8')
package=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))
version=package['version']
exe=release/f'V5-Astra-{version}-Windows-x64.exe'
(build/'AssemblyInfo.cs').write_text(
    'using System.Reflection;\n'
    f'[assembly: AssemblyTitle({json.dumps(package["productName"])})]\n'
    f'[assembly: AssemblyProduct({json.dumps(package["productName"])})]\n'
    f'[assembly: AssemblyCompany({json.dumps(package["author"])})]\n'
    f'[assembly: AssemblyVersion("{version}.0")]\n'
    f'[assembly: AssemblyFileVersion("{version}.0")]\n',encoding='utf-8')
csc=Path('C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe')
args=[str(csc),'/nologo','/target:winexe','/platform:x64','/optimize+',
      '/out:'+str(exe),'/win32icon:'+str(icon),
      '/win32manifest:'+str(ROOT/'desktop/app.manifest'),
      '/reference:System.Windows.Forms.dll','/reference:System.Drawing.dll',
      '/reference:System.IO.Compression.dll','/reference:System.IO.Compression.FileSystem.dll',
      '/reference:System.Web.Extensions.dll','/reference:'+str(core),'/reference:'+str(forms),
      '/reference:System.Net.Http.dll',
      '/resource:'+str(bundle)+',atlas.bundle','/resource:'+str(build/'bundle-id.txt')+',atlas.bundle-id',
      '/resource:'+str(icon)+',atlas.icon',str(ROOT/'desktop/Program.cs'),str(ROOT/'desktop/StoragePaths.cs'),str(ROOT/'desktop/DocumentationUpdates.cs'),str(ROOT/'desktop/AutoUpdates.cs'),str(build/'AssemblyInfo.cs')]
subprocess.run(args,check=True,cwd=ROOT)
digest=hashlib.sha256(exe.read_bytes()).hexdigest()
(release/'SHA256SUMS.txt').write_text(digest+'  '+exe.name+'\n',encoding='utf-8')
print('Built single-file desktop app:',exe,round(exe.stat().st_size/1024/1024,2),'MiB')
print('Bundle:',bundle_id)
