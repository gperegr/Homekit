"""Update only web resources in the already installed, locally signed Mac app."""
import json
import plistlib
import shutil
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
source = root / 'safari-extension'
app = Path.home() / 'Applications/HomeHub.app'
extension = app / 'Contents/PlugIns/HomeHub Extension.appex'
app_info = app / 'Contents/Info.plist'
extension_info = extension / 'Contents/Info.plist'
for file, expected in [(app_info, 'com.gperegr.homehub'),
                       (extension_info, 'com.gperegr.homehub.Extension')]:
    with file.open('rb') as stream:
        info = plistlib.load(stream)
    if info.get('CFBundleIdentifier') != expected:
        raise SystemExit('O aplicativo instalado não corresponde ao HomeHub local.')

manifest = json.loads((source / 'manifest.json').read_text())
files = {'manifest.json', manifest['background']['service_worker'], *manifest['icons'].values()}
for script in manifest['content_scripts']:
    files.update(script['js'] + script['css'])
for name in files:
    if Path(name).is_absolute() or '..' in Path(name).parts:
        raise SystemExit('Caminho inválido no manifesto.')
    if not (source / name).is_file():
        raise SystemExit('Recurso ausente: ' + name)
resources = extension / 'Contents/Resources'
for name in sorted(files):
    destination = resources / name
    destination.parent.mkdir(parents=True, exist_ok=True)
    # copyfile avoids bringing Finder metadata into a signed bundle.
    shutil.copyfile(source / name, destination)

for file in [extension_info, app_info]:
    with file.open('rb') as stream:
        info = plistlib.load(stream)
    info['CFBundleVersion'] = str(int(info['CFBundleVersion']) + 1)
    with file.open('wb') as stream:
        plistlib.dump(info, stream)

for bundle in [extension, app]:
    subprocess.run(['/usr/bin/codesign', '--force', '--sign', '-',
                    '--preserve-metadata=entitlements,identifier', str(bundle)], check=True)
subprocess.run(['/usr/bin/codesign', '--verify', '--deep', '--strict', str(app)], check=True)
subprocess.run(['/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister',
                '-f', str(app)], check=True)
subprocess.run(['/usr/bin/pluginkit', '-a', str(extension)], check=True)
print(f'HomeHub Safari {manifest["version"]} atualizado e registrado em {app}')
