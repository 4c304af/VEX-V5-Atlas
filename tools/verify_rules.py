"""Verify the pinned manual, complete rule-number coverage and offline original pages."""
from pathlib import Path
import json,hashlib,re
root=Path(__file__).resolve().parents[1];folder=root/'public/rules'
manual=json.loads((folder/'catalog.json').read_text(encoding='utf-8'))
baseline=json.loads((root/'sources/rules-manifest.json').read_text(encoding='utf-8'))
assert hashlib.sha256((folder/'manual.pdf').read_bytes()).hexdigest()==baseline['sha256']==manual['sha256']
assert manual['version']==baseline['version'] and len(manual['groups'])==12
expected={'game':{'SC':8,'SG':13,'S':5,'G':5,'GG':18},'skills':{'RSC':5},'robot':{'R':28},'tournament':{'T':24},'vex-u':{'VUG':6,'VURS':3,'VUT':6,'VUR':15},'vex-ai':{'VAISC':2,'VAIG':5,'VAIRS':4,'VAIT':5,'VAIRM':3}}
for group,prefixes in expected.items():
    actual=[d['code'] for d in manual['documents'] if d['group']==group and d['code']]
    wanted={prefix+str(n) for prefix,count in prefixes.items() for n in range(1,count+1)}
    assert len(actual)==len(set(actual)) and set(actual)==wanted,(group,set(actual)^wanted)
pages=set()
for doc in manual['documents']:
    assert re.search('[\u4e00-\u9fff]',doc['zhTitle']) and re.search('[\u4e00-\u9fff]',doc['summary'])
    assert doc['blocks'] and all(b['en'].strip() for b in doc['blocks'])
    for page in doc['pages']:
        assert (folder/'pages'/f'{page}.jpg').is_file();pages.add(page)
assert pages==set(range(5,149))
print('PASS: 12 sections, 155 numbered rules, 167 entries with Chinese editorial, 144 offline original pages and pinned PDF SHA-256.')
