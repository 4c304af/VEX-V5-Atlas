"""Verify startup storage and migration without touching the user's real profile."""
from pathlib import Path
import subprocess
import uuid

root = Path(__file__).resolve().parents[1]
build = root / 'build' / ('storage-test-' + uuid.uuid4().hex)
build.mkdir(parents=True)
exe = build / 'StorageTests.exe'
subprocess.run(['C:/Windows/Microsoft.NET/Framework64/v4.0.30319/csc.exe',
                '/nologo', '/target:exe', '/out:' + str(exe),
                str(root / 'desktop/StoragePaths.cs'), str(root / 'tests/StorageTests.cs')], check=True)
subprocess.run([str(exe), str(build / 'data')], check=True)
