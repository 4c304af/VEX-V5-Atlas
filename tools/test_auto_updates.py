"""Exercise transactional data packages and the real replacement helper in isolation."""
from pathlib import Path
import hashlib,json,subprocess,zipfile,copy,os,time,uuid
ROOT=Path(__file__).resolve().parents[1]
CSC='C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe'
BUILD=ROOT/'build'/('auto-update-test-'+uuid.uuid4().hex);BUILD.mkdir(parents=True)
fixtures=BUILD/'fixtures';fixtures.mkdir()

def make_fixture(kind):
    with zipfile.ZipFile(ROOT/'release/V5-Astra-documents.zip') as z:files={n:z.read(n) for n in z.namelist() if n!='package-manifest.json'}
    catalog=json.loads(files['catalog.json']);baseline=json.loads(files['update-manifest.json'])
    entry=copy.deepcopy(catalog['documents'][0]);entry.update(id='Smart_Port_Devices/Atlas_Test_Sensor',key='Smart_Port_Devices--Atlas_Test_Sensor',title='Atlas Test Sensor',zhTitle='更新测试传感器',group='Smart_Port_Devices',intro='New documentation from a data-only update.',zhIntro='通过独立文档更新包加入的新文档。',headings=[],text='Atlas Test Sensor uniqueSyncToken',zhText='更新测试传感器 uniqueSyncToken')
    entry['source']='https://api.vex.com/v5/home/cpp/'+entry['id']+'.html'
    catalog['documents'].append(entry)
    baseline['documents'].append({k:entry[k] for k in ['id','title','zhTitle','sha256']})
    page={'id':entry['id'],'en':'<h1>Atlas Test Sensor</h1><p>uniqueSyncToken</p><pre><code>sensor.read();</code></pre>','zh':'<h1>更新测试传感器</h1><p>uniqueSyncToken</p><pre><code>sensor.read();</code></pre>','headings':[]}
    if kind=='modified':page['zh']=page['zh'].replace('uniqueSyncToken','uniqueSyncToken modified')
    if kind=='empty-translation':page['zh']=''
    snapshot=hashlib.sha256(('fixture-'+kind).encode()).hexdigest()
    for item in [catalog,baseline]:item.update(snapshotId=snapshot,snapshotDate='2020-01-01' if kind=='older' else '2026-10-27')
    files['catalog.json']=json.dumps(catalog,ensure_ascii=False).encode();files['update-manifest.json']=json.dumps(baseline,ensure_ascii=False).encode()
    files[entry['key']+'.json']=json.dumps(page,ensure_ascii=False).encode()
    manifest={'format':1,'minimumAppVersion':'999.0.0' if kind=='future' else '1.1.0','snapshotId':snapshot,'snapshotDate':baseline['snapshotDate'],'documentCount':67,'files':[{'name':name,'size':len(data),'sha256':hashlib.sha256(data).hexdigest()} for name,data in sorted(files.items())]}
    if kind=='hash':files[entry['key']+'.json']+=b' '
    if kind=='traversal':files['../escape.json']=b'{}'
    if kind=='missing':del files[entry['key']+'.json']
    if kind=='duplicate':manifest['files'].append(manifest['files'][0])
    with zipfile.ZipFile(fixtures/(kind+'.zip'),'w',zipfile.ZIP_DEFLATED) as z:
        z.writestr('package-manifest.json',json.dumps(manifest))
        for name,data in files.items():z.writestr(name,data)
for kind in ['added','modified','traversal','hash','empty-translation','missing','future','older','duplicate']:make_fixture(kind)
refs=['/reference:'+r for r in ['System.Net.Http.dll','System.Web.Extensions.dll','System.IO.Compression.dll','System.IO.Compression.FileSystem.dll']]
exe=BUILD/'AutoUpdateTests.exe'
subprocess.run([CSC,'/nologo','/nowarn:0649','/target:exe','/out:'+str(exe),*refs,str(ROOT/'desktop/AutoUpdates.cs'),str(ROOT/'desktop/DocumentationUpdates.cs'),str(ROOT/'tests/AutoUpdateTests.cs')],check=True)
subprocess.run([str(exe),str(BUILD/'data'),str(fixtures),str(ROOT/'public/docs')],check=True)

# Native WebView test starts with a valid installed update and no network dependency.
installer=BUILD/'InstallFixture.cs';installer.write_text('using System.IO;using System.Threading;class InstallFixture {static void Main(string[] a){new DocumentationStore(a[0],a[1],"1.1.0").Install(File.ReadAllBytes(a[2]),CancellationToken.None);}}')
install=BUILD/'InstallFixture.exe'
subprocess.run([CSC,'/nologo','/nowarn:0649','/target:exe','/out:'+str(install),*refs,str(ROOT/'desktop/AutoUpdates.cs'),str(ROOT/'desktop/DocumentationUpdates.cs'),str(installer)],check=True)
(ROOT/'build/auto-update-fixture.json').write_text(json.dumps({'installer':str(install),'package':str(fixtures/'added.zip')}))

# Apply the new binary after an old process exits. Only files in this random build folder are touched.
app=BUILD/'replacement';folder=app/'.v5-atlas/updates/1.2.0';folder.mkdir(parents=True)
target=app/'V5Atlas.exe';old=BUILD/'Old.cs';old.write_text('using System.Threading;class Old {static void Main(){Thread.Sleep(15000);}}')
subprocess.run([CSC,'/nologo','/target:exe','/out:'+str(target),str(old)],check=True)
helper=BUILD/'ReplacementHelper.cs';helper.write_text('using System.Reflection;using System.IO;[assembly: AssemblyFileVersion("1.2.0.0")]class Helper {static int Main(string[] a){try{if(a.Length>0)AutomaticUpdater.Apply(int.Parse(a[0].Substring(15)));else File.WriteAllText(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory,"updated.txt"),"1.2.0");return 0;}catch(System.Exception e){File.WriteAllText(Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory,"error.txt"),e.ToString());return 1;}}}')
staged=folder/'app.exe'
subprocess.run([CSC,'/nologo','/nowarn:0649','/target:exe','/out:'+str(staged),*refs,str(ROOT/'desktop/AutoUpdates.cs'),str(ROOT/'desktop/DocumentationUpdates.cs'),str(helper)],check=True)
hashfile=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
metadata={'target':str(target),'oldHash':hashfile(target),'newHash':hashfile(staged),'version':'1.2.0'}
(folder/'stage.json').write_text(json.dumps(metadata))
process=subprocess.Popen([str(target)],creationflags=subprocess.CREATE_NO_WINDOW)
replacement=subprocess.Popen([str(staged),'--apply-update='+str(process.pid)],creationflags=subprocess.CREATE_NO_WINDOW)
time.sleep(.3);process.terminate();process.wait(timeout=10);replacement.wait(timeout=55)
assert replacement.returncode==0,'Replacement helper failed: '+(folder/'error.txt').read_text()
for _ in range(40):
    if (app/'updated.txt').exists():break
    time.sleep(.1)
assert (app/'updated.txt').read_text()=='1.2.0'
assert hashfile(target)==metadata['newHash'] and hashfile(app/'V5Atlas.exe.previous')==metadata['oldHash']
print('PASS actual process exit, executable replacement, restart and old-binary backup')
