// Run the packaged host with the current non-elevated token and real deny ACLs.
import {spawn,spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const root=path.resolve(import.meta.dirname,'..');
const version=JSON.parse(readFileSync(path.join(root,'package.json'),'utf8')).version;
const fixture=path.join(root,'build','permissions-'+Date.now());mkdirSync(fixture,{recursive:true});
const helper=path.join(fixture,'Acl.cs'),acl=path.join(fixture,'Acl.exe');
writeFileSync(helper,`using System;using System.IO;using System.Security.AccessControl;using System.Security.Principal;
class Acl {static int Main(string[] a){
var identity=WindowsIdentity.GetCurrent();
if(a[0]=="token"){Console.WriteLine(new WindowsPrincipal(identity).IsInRole(WindowsBuiltInRole.Administrator)?"elevated":"standard");return 0;}
var security=Directory.GetAccessControl(a[1]);
if(a[0]=="deny"){
Console.WriteLine(security.GetSecurityDescriptorSddlForm(AccessControlSections.Access));
security.AddAccessRule(new FileSystemAccessRule(identity.User,a[2]=="read"?FileSystemRights.ReadData:FileSystemRights.Write,AccessControlType.Deny));
}else security.SetSecurityDescriptorSddlForm(a[2],AccessControlSections.Access);
Directory.SetAccessControl(a[1],security);return 0;}}`);
let result=spawnSync('C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe',['/nologo','/target:exe','/out:'+acl,helper],{encoding:'utf8'});
assert.equal(result.status,0,result.stdout+result.stderr);
const command=(...args)=>{const r=spawnSync(acl,args,{encoding:'utf8'});assert.equal(r.status,0,r.stdout+r.stderr);return r.stdout.trim();};
assert.equal(command('token'),'standard','This regression test must run without administrator privileges');
const app=path.join(fixture,'read-only-application');mkdirSync(app);
const exe=path.join(app,`V5-Atlas-${version}-Windows-x64.exe`);copyFileSync(path.join(root,'release',path.basename(exe)),exe);
const legacy=path.join(app,'.v5-atlas','profile');mkdirSync(legacy,{recursive:true});
writeFileSync(path.join(legacy,'preferences'),'preserve-old-settings');
const blocked=path.join(fixture,'blocked-user-data');mkdirSync(blocked);
const restrictions=[];
const deny=(target,right)=>restrictions.push([target,command('deny',target,right)]);
const delay=ms=>new Promise(r=>setTimeout(r,ms));
let child,browser;
async function close(){
  if(browser){const page=browser.contexts()[0].pages()[0];await page.evaluate(()=>window.atlasDesktop.close()).catch(()=>{});await browser.close().catch(()=>{});browser=null;}
  for(let attempt=0;attempt<30&&child?.exitCode===null;attempt++)await delay(100);
  if(child?.exitCode===null){child.kill();await delay(300);}
  // WebView child processes can outlive the form briefly and still own its debug port.
  for(let attempt=0;attempt<50;attempt++){
    try{await fetch('http://127.0.0.1:9336/json/version',{signal:AbortSignal.timeout(500)});await delay(100);}
    catch{return;}
  }
  throw Error('Previous WebView debug server did not close');
}
try{
  deny(app,'write');deny(legacy,'read');deny(blocked,'write');
  for(const [name,userRoot,recovered] of [['legacy',path.join(fixture,'clean-user-data'),false],['blocked',blocked,true]]){
    child=spawn(exe,['--test','--user-root='+userRoot],{windowsHide:true,stdio:'ignore'});
    let lastError;
    for(let attempt=0;attempt<70;attempt++){
      try{browser=await chromium.connectOverCDP('http://127.0.0.1:9336',{timeout:2000});break;}catch(error){lastError=error;assert.equal(child.exitCode,null,'Standard-user host exited before opening');await delay(350);}
    }
    assert(browser,'Standard-user debug connection failed: '+lastError?.message);
    const page=browser.contexts()[0].pages()[0];
    await page.locator('.hero h1').waitFor({timeout:25000});
    assert.equal(await page.evaluate(()=>window.atlasDesktop.storageRecovered),true);
    assert.equal(await page.locator('.startup-storage-notice').count(),1);
    await page.evaluate(()=>location.hash='#rules/section-game~SC');
    await page.locator('.rule-card').first().waitFor();
    assert.equal(await page.locator('.rule-card').count(),8);
    await close();
    const active=recovered?userRoot+' User':userRoot;
    assert(existsSync(path.join(active,'profile','EBWebView')),'WebView profile was not created in writable user storage');
    assert(existsSync(path.join(active,'bundles')),'Bundled content was not extracted to user storage');
    assert.equal(existsSync(path.join(active,'V5Atlas-startup.log')),true);
    assert.equal(readdirSync(active).some(name=>name.startsWith('migration-')),false);
    console.log('PASS standard-user packaged startup: '+name+' directory inaccessible; offline section reading works');
  }
  assert.deepEqual(readdirSync(app).sort(),['.v5-atlas',path.basename(exe)].sort(),'Startup wrote next to the executable');
}finally{
  await close();
  for(const [target,sddl] of restrictions.reverse())command('restore',target,sddl);
}
assert.equal(readFileSync(path.join(legacy,'preferences'),'utf8'),'preserve-old-settings');
console.log('PASS old data and executable directory preserved; test ACLs restored');
