"""Create a versioned, data-only document package for in-app synchronization."""
from pathlib import Path
import hashlib,json,re,zipfile
ROOT=Path(__file__).resolve().parents[1]
docs=ROOT/'public/docs'
catalog=json.loads((docs/'catalog.json').read_text(encoding='utf-8'))
baseline=json.loads((docs/'update-manifest.json').read_text(encoding='utf-8'))
assert catalog['snapshotId']==baseline['snapshotId']
names={'catalog.json','update-manifest.json'}
for entry in catalog['documents']:
    name=entry['key']+'.json';names.add(name)
    page=json.loads((docs/name).read_text(encoding='utf-8'))
    for media in re.findall(r'\./docs/(media/[A-Za-z0-9_.-]+)',page['en']+page['zh']):names.add(media)
files=[{'name':name,'size':(docs/name).stat().st_size,'sha256':hashlib.sha256((docs/name).read_bytes()).hexdigest()} for name in sorted(names)]
manifest={'format':1,'minimumAppVersion':'1.1.0','snapshotId':baseline['snapshotId'],
          'snapshotDate':baseline['snapshotDate'],'documentCount':len(catalog['documents']),'files':files}
release=ROOT/'release';release.mkdir(exist_ok=True)
target=release/'V5-Astra-documents.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    def put(name,data):
        info=zipfile.ZipInfo(name,date_time=(2020,1,1,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED
        info.external_attr=0o100644<<16
        archive.writestr(info,data,compresslevel=9)
    put('package-manifest.json',json.dumps(manifest,ensure_ascii=False,sort_keys=True).encode('utf-8'))
    for name in sorted(names):put(name,(docs/name).read_bytes())
digest=hashlib.sha256(target.read_bytes()).hexdigest()
(release/'documents-SHA256SUMS.txt').write_text(digest+'  '+target.name+'\n',encoding='utf-8')
print('Document package:',len(catalog['documents']),'pages;',len(names),'files;',digest)
