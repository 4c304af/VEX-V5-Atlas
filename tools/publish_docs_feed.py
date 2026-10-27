"""Publish the data-only documentation feed from GitHub Actions."""
from pathlib import Path
import os,requests,hashlib
ROOT=Path(__file__).resolve().parents[1]
repo=os.environ['GITHUB_REPOSITORY'];token=os.environ['GITHUB_TOKEN']
s=requests.Session();s.headers.update({'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'})
base='https://api.github.com/repos/'+repo
r=s.get(base+'/releases/tags/documentation-latest',timeout=40)
if r.status_code==404:
    r=s.post(base+'/releases',json={'tag_name':'documentation-latest','target_commitish':'main',
        'name':'Automatic bilingual documentation','body':'Automatically compiled VEX V5 C++ documentation. Data only; downloaded by V5 Atlas 1.1.0 or newer.',
        'prerelease':True,'draft':False,'make_latest':'false'},timeout=40)
r.raise_for_status();release=r.json()
upload=release['upload_url'].split('{')[0]
assert upload.startswith('https://uploads.github.com/repos/'+repo+'/releases/')
for name in ['V5-Atlas-documents.zip','documents-SHA256SUMS.txt']:
    digest='sha256:'+hashlib.sha256((ROOT/'release'/name).read_bytes()).hexdigest()
    asset=next((a for a in release['assets'] if a['name']==name),None)
    if asset and asset.get('digest')==digest:
        print('Documentation asset unchanged:',name);continue
    if asset:
        r=s.delete(base+'/releases/assets/'+str(asset['id']),timeout=40);r.raise_for_status()
    with (ROOT/'release'/name).open('rb') as stream:r=s.post(upload,params={'name':name},data=stream,headers={'Content-Type':'application/octet-stream'},timeout=120)
    r.raise_for_status();print('Published documentation asset:',name)
