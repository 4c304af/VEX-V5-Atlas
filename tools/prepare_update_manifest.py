"""Hash normalized official sources, so Windows line endings do not look like updates."""
from pathlib import Path
import hashlib,json

root=Path(__file__).resolve().parents[1]
snapshot=json.loads((root/'sources/manifest.json').read_text(encoding='utf-8'))
catalog=json.loads((root/'public/docs/catalog.json').read_text(encoding='utf-8'))
titles={entry['id']:entry['zhTitle'] for entry in catalog['documents']}
documents=[]
for entry in snapshot['documents']:
    source=(root/'sources/en'/(entry['id']+'.md')).read_bytes()
    if hashlib.sha256(source).hexdigest()!=entry['sha256']:
        raise ValueError('Snapshot source changed; reimport/rebuild the corpus before packaging: '+entry['id'])
    text=source.decode('utf-8-sig').replace('\r\n','\n').replace('\r','\n')
    documents.append({'id':entry['id'],'title':entry['title'],'zhTitle':titles[entry['id']],
                      'sha256':hashlib.sha256(text.encode('utf-8')).hexdigest()})
target=root/'public/docs/update-manifest.json'
snapshot_id=hashlib.sha256(json.dumps(documents,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode('utf-8')).hexdigest()
target.write_text(json.dumps({'schemaVersion':1,'snapshotId':snapshot_id,'snapshotDate':snapshot['snapshotDate'],
                             'documents':documents},ensure_ascii=False,indent=2),encoding='utf-8')
catalog['snapshotId']=snapshot_id
(root/'public/docs/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False),encoding='utf-8')
print('Prepared normalized update baseline:',len(documents),'C++ documents')
