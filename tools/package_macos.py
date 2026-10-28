"""Build a native universal macOS app, ZIP, and drag-to-Applications DMG."""
from pathlib import Path
import hashlib
import json
import os
import plistlib
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
MINIMUM = '12.0'


def run(*args):
    subprocess.run([str(arg) for arg in args], check=True, cwd=ROOT)


def package():
    if sys.platform != 'darwin':
        raise SystemExit('macOS packaging requires a Mac with Xcode Command Line Tools. Use the macOS build GitHub Actions workflow from Windows.')
    if not (ROOT / 'dist/index.html').is_file():
        raise SystemExit('Run npm run build first.')
    metadata = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
    version, name = metadata['version'], metadata['productName']
    build = ROOT / 'build/macos'
    build.mkdir(parents=True, exist_ok=True)
    release = ROOT / 'release'
    release.mkdir(exist_ok=True)
    app = build / (name + '.app')
    # This fixed build output belongs to this script; never remove a user-installed app.
    if app.exists():
        shutil.rmtree(app)
    executable = app / 'Contents/MacOS/V5Atlas'
    resources = app / 'Contents/Resources'
    executable.parent.mkdir(parents=True)
    resources.mkdir(parents=True)
    sdk = subprocess.check_output(['xcrun', '--sdk', 'macosx', '--show-sdk-path'], text=True).strip()
    sources = [ROOT / 'desktop/macos/Library.swift', ROOT / 'desktop/macos/Main.swift']
    binaries = []
    for arch in ('arm64', 'x86_64'):
        binary = build / ('V5Atlas-' + arch)
        run('xcrun', 'swiftc', '-swift-version', '5', '-parse-as-library', '-O', '-sdk', sdk,
            '-target', f'{arch}-apple-macos{MINIMUM}', '-framework', 'AppKit', '-framework', 'WebKit',
            '-framework', 'CryptoKit', *sources, '-o', binary)
        binaries.append(binary)
    run('lipo', '-create', *binaries, '-output', executable)
    executable.chmod(0o755)
    info = {
        'CFBundleName': name, 'CFBundleDisplayName': name, 'CFBundleExecutable': 'V5Atlas',
        'CFBundleIdentifier': 'com.4c304af.v5atlas', 'CFBundlePackageType': 'APPL',
        'CFBundleShortVersionString': version, 'CFBundleVersion': version,
        'CFBundleIconFile': 'V5Atlas', 'LSMinimumSystemVersion': MINIMUM,
        'NSHighResolutionCapable': True, 'NSPrincipalClass': 'NSApplication',
        'NSSupportsAutomaticTermination': False,
        'NSHumanReadableCopyright': f'Publisher: {metadata["author"]}. See THIRD_PARTY_NOTICES.md.',
    }
    (app / 'Contents/Info.plist').write_bytes(plistlib.dumps(info, sort_keys=True))
    shutil.copytree(ROOT / 'dist', resources / 'app')
    for file in ('bridge.js', 'smoke-test.js'):
        shutil.copy2(ROOT / 'desktop/macos' / file, resources / file)
    shutil.copy2(ROOT / 'THIRD_PARTY_NOTICES.md', resources / 'THIRD_PARTY_NOTICES.md')
    # Render the existing project icon with AppKit, then create the standard Retina iconset.
    icon = build / 'icon-1024.png'
    run('xcrun', 'swift', ROOT / 'tools/macos_icon.swift', icon)
    iconset = build / 'V5Atlas.iconset'
    iconset.mkdir(exist_ok=True)
    for size in (16, 32, 128, 256, 512):
        for scale in (1, 2):
            suffix = '@2x' if scale == 2 else ''
            run('sips', '-z', size * scale, size * scale, icon, '--out', iconset / f'icon_{size}x{size}{suffix}.png')
    run('iconutil', '-c', 'icns', iconset, '-o', resources / 'V5Atlas.icns')
    # Ad-hoc signing makes the universal binary valid on Apple Silicon. Developer ID
    # signing/notarization can be added when the publisher supplies Apple credentials.
    run('codesign', '--force', '--deep', '--sign', '-', app)
    run('codesign', '--verify', '--deep', '--strict', app)
    run('lipo', executable, '-verify_arch', 'arm64', 'x86_64')
    stem = f'V5-Atlas-{version}-macOS-universal'
    archive, dmg = release / (stem + '.zip'), release / (stem + '.dmg')
    if archive.exists():
        archive.unlink()
    run('ditto', '-c', '-k', '--keepParent', app, archive)
    image = build / 'disk-image'
    if image.exists():
        shutil.rmtree(image)
    image.mkdir()
    run('ditto', app, image / app.name)
    os.symlink('/Applications', image / 'Applications')
    (image / '安装说明.txt').write_text(
        '将 V5 Atlas 拖入 Applications（应用程序）后运行。\n'
        '支持 macOS 12 及以上，Apple Silicon / Intel。\n'
        '此构建尚未经过 Apple 公证。如系统拦截，请在系统设置 → 隐私与安全性中允许打开。\n'
        '数据保存在用户 Library 中，不会写入应用旁。\n', encoding='utf-8')
    run('hdiutil', 'create', '-volname', name, '-srcfolder', image, '-ov', '-format', 'UDZO', dmg)
    sums = ''.join(hashlib.sha256(file.read_bytes()).hexdigest() + '  ' + file.name + '\n' for file in (dmg, archive))
    (release / 'macOS-SHA256SUMS.txt').write_text(sums, encoding='utf-8')
    print(f'Built {app}\nDistribution: {dmg}\nDistribution: {archive}')


if __name__ == '__main__':
    package()
