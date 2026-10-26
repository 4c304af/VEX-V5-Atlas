"""Verify the committed corpus, source hashes, code integrity, and local media."""
from pathlib import Path
from collections import Counter
from html.parser import HTMLParser
import hashlib,json

ROOT=Path(__file__).resolve().parents[1]
class InspectHTML(HTMLParser):
    def __init__(self):
        super().__init__();self.code=[];self.images=[];self.current=None
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag=='code':self.current=[]
        if tag=='img':self.images.append(attrs.get('src',''))
    def handle_startendtag(self,tag,attrs):self.handle_starttag(tag,attrs)
    def handle_data(self,text):
        if self.current is not None:self.current.append(text)
    def handle_endtag(self,tag):
        if tag=='code' and self.current is not None:
            self.code.append(''.join(self.current));self.current=None

manifest=json.loads((ROOT/'sources/manifest.json').read_text(encoding='utf-8'))
catalog=json.loads((ROOT/'public/docs/catalog.json').read_text(encoding='utf-8'))
assert {d['id'] for d in manifest['documents']}=={d['id'] for d in catalog['documents']},'Catalog coverage differs from the official snapshot'
media=set();examples=0
for entry in manifest['documents']:
    source=ROOT/'sources/en'/(entry['id']+'.md')
    assert hashlib.sha256(source.read_bytes()).hexdigest()==entry['sha256'],f"Original source hash changed: {entry['id']}"
    doc=json.loads((ROOT/'public/docs'/(entry['id'].replace('/','--')+'.json')).read_text(encoding='utf-8'))
    assert doc['id']==entry['id']
    en=InspectHTML();en.feed(doc['en']);zh=InspectHTML();zh.feed(doc['zh'])
    assert Counter(en.code)==Counter(zh.code),f"Translated code differs: {entry['id']}"
    for image in en.images+zh.images:
        assert image.startswith('./docs/media/'),f'Remote image in offline corpus: {image}'
        assert (ROOT/'public'/image.removeprefix('./')).is_file(),f'Missing local image: {image}'
        media.add(image)
    examples+=len(en.code)
print(f'PASS: {len(manifest["documents"])} source hashes, {examples} preserved code fragments, {len(media)} local images.')
