"""Prepare the pinned Microsoft WebView2 build SDK; no system installation."""
from pathlib import Path
import hashlib,time,urllib.request,zipfile

ROOT=Path(__file__).resolve().parents[1]
VERSION='1.0.2903.40'
SHA256='ef128016dd1e51c59178c827ed5b8aa3322c57afa8675d930f8109505542ad74'
ARCHIVE=ROOT/'build/webview2/package.nupkg'
SDK=ROOT/'build/webview2/sdk'
FILES=[
    'lib/net462/Microsoft.Web.WebView2.Core.dll',
    'lib/net462/Microsoft.Web.WebView2.WinForms.dll',
    'runtimes/win-x64/native/WebView2Loader.dll',
]

def main():
    if not ARCHIVE.exists() or hashlib.sha256(ARCHIVE.read_bytes()).hexdigest()!=SHA256:
        urls=[f'https://www.nuget.org/api/v2/package/Microsoft.Web.WebView2/{VERSION}',
              f'https://api.nuget.org/v3-flatcontainer/microsoft.web.webview2/{VERSION}/microsoft.web.webview2.{VERSION}.nupkg']
        last_error=None
        for attempt in range(4):
            try:
                request=urllib.request.Request(urls[attempt%len(urls)],headers={'User-Agent':'V5Astra-build/1.0.2'})
                with urllib.request.urlopen(request,timeout=60) as response:data=response.read(20*1024*1024)
                if hashlib.sha256(data).hexdigest()!=SHA256:raise ValueError('WebView2 SDK checksum mismatch')
                ARCHIVE.parent.mkdir(parents=True,exist_ok=True);ARCHIVE.write_bytes(data)
                break
            except Exception as error:
                last_error=error
                if attempt==3:raise RuntimeError('Could not prepare the verified WebView2 SDK') from last_error
                time.sleep(attempt+1)
    with zipfile.ZipFile(ARCHIVE) as archive:
        for name in FILES:
            target=SDK/name;target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(archive.read(name))
    print(f'WebView2 build SDK {VERSION}: checksum verified; x64 SDK prepared.')

if __name__=='__main__':main()
