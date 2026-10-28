"""Exercise the actual packaged WKWebView host, including a full process restart."""
from pathlib import Path
import hashlib
import json
import platform
import shutil
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def fingerprints(folder):
    return {str(p.relative_to(folder)): hashlib.sha256(p.read_bytes()).hexdigest()
            for p in folder.rglob('*') if p.is_file()}


def main():
    if platform.system() != 'Darwin':
        raise SystemExit('The native macOS smoke test must run on a Mac.')
    app = ROOT / 'build/macos/V5 Atlas.app'
    executable = app / 'Contents/MacOS/V5Atlas'
    before = fingerprints(app.parent)
    with tempfile.TemporaryDirectory(prefix='v5atlas-macos-test-') as temporary:
        folder = Path(temporary)
        for phase in ('first', 'restart'):
            output = folder / (phase + '.json')
            subprocess.run([str(executable), '--smoke-test', str(output), '--test-phase', phase,
                            '--profile=' + str(folder / 'user-data')], check=True, timeout=110)
            result = json.loads(output.read_text(encoding='utf-8'))
            if output.with_suffix('.png').exists():
                screenshots = ROOT / 'screenshots'
                screenshots.mkdir(exist_ok=True)
                shutil.copy2(output.with_suffix('.png'), screenshots / ('macos-' + phase + '.png'))
            assert result.get('ok'), result
            print('PASS native WKWebView:', phase, result)
    assert before == fingerprints(app.parent), 'Startup wrote into or beside the application bundle'
    print('PASS universal native startup, offline corpus/search, clipboard, bilingual C++, colors/bookmarks after process restart, and unchanged application directory')


if __name__ == '__main__':
    main()
