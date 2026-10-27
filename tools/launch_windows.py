from pathlib import Path
import json,subprocess
root=Path(__file__).resolve().parents[1]
version=json.loads((root/'package.json').read_text(encoding='utf-8'))['version']
subprocess.Popen([str(root/'release'/f'V5-Astra-{version}-Windows-x64.exe')],cwd=root/'release')
