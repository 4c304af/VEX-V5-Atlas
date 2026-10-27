"""Download an auditable snapshot of the official VEX V5 C++ reference."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests, json, hashlib, time, argparse, re
from datetime import datetime,timezone,timedelta

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://api.vex.com/v5/'

def get(url):
    for attempt in range(4):
        try:
            r = requests.get(url, timeout=45)
            r.raise_for_status()
            r.encoding = 'utf-8-sig'
            return r.text
        except Exception:
            if attempt == 3: raise
            time.sleep(attempt + 1)

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--refresh',action='store_true');args=parser.parse_args()
    manifest_file=ROOT/'sources/manifest.json'
    previous=json.loads(manifest_file.read_text(encoding='utf-8')) if manifest_file.exists() else None
    raw = get(BASE + 'searchindex.js')
    idx = json.loads(raw[raw.index('(')+1:raw.rindex(')')])
    if len(idx['docnames'])!=len(idx['titles']):raise ValueError('Invalid index')
    entries = [(n, t) for n, t in zip(idx['docnames'], idx['titles']) if n.startswith('home/cpp/')]
    if not entries or len(entries)>2000 or 'home/cpp/index' not in [n for n,t in entries]:raise ValueError('Incomplete C++ index')
    if len({n for n,t in entries})!=len(entries):raise ValueError('Duplicate document')
    if any(not re.fullmatch(r'home/cpp/[A-Za-z0-9_-]+(?:/[A-Za-z0-9_-]+)*',n) or not t.strip() for n,t in entries):raise ValueError('Invalid source path or title')
    dest = ROOT / 'sources' / 'en'
    dest.mkdir(parents=True, exist_ok=True)
    def download(entry):
        name, title = entry
        path = name.removeprefix('home/cpp/')
        file = dest / (path + '.md')
        if args.refresh or not file.exists():
            content = get(BASE + '_sources/' + name + '.md.txt')
            if '<html' in content[:300].lower() or not re.search(r'^#\s+\S',content,re.M): raise ValueError('Unexpected source: ' + name)
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text(content, encoding='utf-8')
        return {'id': path, 'title': title, 'source': BASE + name + '.html',
                'sha256': hashlib.sha256(file.read_bytes()).hexdigest()}
    docs = []
    with ThreadPoolExecutor(max_workers=6) as pool:
        for future in as_completed([pool.submit(download, entry) for entry in entries]):
            docs.append(future.result())
            print(f'Downloaded {len(docs)}/{len(entries)}', flush=True)
    docs.sort(key=lambda x: x['id'])
    changed=not previous or previous['documents']!=docs
    date=datetime.now(timezone(timedelta(hours=8))).date().isoformat() if changed else previous['snapshotDate']
    (ROOT / 'sources' / 'manifest.json').write_text(json.dumps({
        'snapshotDate': date, 'origin': BASE + 'home/cpp/index.html',
        'documents': docs
    }, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Official snapshot ready:', len(docs), 'documents')

if __name__ == '__main__': main()
