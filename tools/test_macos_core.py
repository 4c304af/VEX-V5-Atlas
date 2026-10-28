"""Compile and test native macOS document storage with adversarial offline fixtures."""
from pathlib import Path
import copy
import hashlib
import json
import platform
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def fixture(folder, kind):
    docs = ROOT / 'public/docs'
    catalog = json.loads((docs / 'catalog.json').read_text(encoding='utf-8'))
    baseline = json.loads((docs / 'update-manifest.json').read_text(encoding='utf-8'))
    files = {str(p.relative_to(docs)).replace('\\', '/'): p.read_bytes() for p in docs.rglob('*') if p.is_file()}
    entry = copy.deepcopy(catalog['documents'][0])
    entry.update(id='Smart_Port_Devices/Atlas_Mac_Test', key='Smart_Port_Devices--Atlas_Mac_Test', title='Mac Test', zhTitle='Mac 测试页面')
    catalog['documents'].append(entry)
    baseline['documents'].append({key: entry[key] for key in ('id', 'title', 'zhTitle', 'sha256')})
    snapshot = hashlib.sha256(kind.encode()).hexdigest()
    for value in (catalog, baseline):
        value.update(snapshotId=snapshot, snapshotDate='2000-01-01' if kind == 'older' else '2099-01-01')
    files['catalog.json'] = json.dumps(catalog, ensure_ascii=False).encode()
    files['update-manifest.json'] = json.dumps(baseline, ensure_ascii=False).encode()
    files[entry['key'] + '.json'] = json.dumps({'id': entry['id'], 'en': '<p>New page</p>',
                                               'zh': '' if kind == 'empty-translation' else '<p>新增页面</p>'}).encode()
    manifest = {'format': 1, 'minimumAppVersion': '999.0.0' if kind == 'future' else '1.1.0',
                'snapshotId': snapshot, 'snapshotDate': baseline['snapshotDate'], 'documentCount': len(catalog['documents']),
                'files': [{'name': name, 'size': len(data), 'sha256': hashlib.sha256(data).hexdigest()} for name, data in sorted(files.items())]}
    if kind == 'hash':
        files[entry['key'] + '.json'] += b' '
    if kind == 'traversal':
        files['../escape.json'] = b'{}'
    if kind == 'missing':
        del files[entry['key'] + '.json']
    if kind == 'duplicate':
        manifest['files'].append(manifest['files'][0])
    with zipfile.ZipFile(folder / (kind + '.zip'), 'w', zipfile.ZIP_DEFLATED) as archive:
        archive.writestr('package-manifest.json', json.dumps(manifest))
        for name, data in files.items():
            archive.writestr(name, data)


def main():
    if platform.system() != 'Darwin':
        raise SystemExit('The native macOS core tests must run on a Mac.')
    with tempfile.TemporaryDirectory(prefix='v5atlas-core-test-') as temporary:
        folder = Path(temporary)
        for kind in ('added', 'modified', 'traversal', 'hash', 'empty-translation', 'missing', 'future', 'older', 'duplicate'):
            fixture(folder, kind)
        binary = folder / 'MacCoreTests'
        subprocess.run(['xcrun', 'swiftc', '-swift-version', '5', '-parse-as-library', '-framework', 'CryptoKit',
                        str(ROOT / 'desktop/macos/Library.swift'), str(ROOT / 'tests/MacCoreTests.swift'), '-o', str(binary)], check=True)
        subprocess.run([str(binary), str(folder / 'user-data'), str(ROOT / 'public/docs'), str(folder)], check=True)


if __name__ == '__main__':
    main()
