"""Download an auditable snapshot of the official VEX V5 C++ reference."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests, json, hashlib, time

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
    raw = get(BASE + 'searchindex.js')
    idx = json.loads(raw[raw.index('(')+1:raw.rindex(')')])
    entries = [(n, t) for n, t in zip(idx['docnames'], idx['titles']) if n.startswith('home/cpp/')]
    dest = ROOT / 'sources' / 'en'
    dest.mkdir(parents=True, exist_ok=True)
    def download(entry):
        name, title = entry
        path = name.removeprefix('home/cpp/')
        file = dest / (path + '.md')
        if not file.exists():
            content = get(BASE + '_sources/' + name + '.md.txt')
            if '<html' in content[:300].lower(): raise ValueError('Unexpected HTML: ' + name)
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
    (ROOT / 'sources' / 'manifest.json').write_text(json.dumps({
        'snapshotDate': '2026-10-26', 'origin': BASE + 'home/cpp/index.html',
        'documents': docs
    }, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Official snapshot ready:', len(docs), 'documents')

if __name__ == '__main__': main()
