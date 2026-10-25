#!/bin/zsh
set -eu
task_script_dir="$(cd -- "$(dirname -- "$0")" && pwd)"
task_root="$(dirname -- "$task_script_dir")"
task_dir="$task_root/safari-extension"
task_developer="${DEVELOPER_DIR:-}"
if [[ -z "$task_developer" && -d /Applications/Xcode.app/Contents/Developer ]]; then
  task_developer=/Applications/Xcode.app/Contents/Developer
fi
if [[ -n "$task_developer" ]]; then export DEVELOPER_DIR="$task_developer"; fi
task_tool=''
for task_candidate in safari-web-extension-packager safari-web-extension-converter; do
  if /usr/bin/xcrun --find "$task_candidate" >/dev/null 2>&1; then
    task_tool="$task_candidate"
    break
  fi
done
if [[ -z "$task_tool" ]]; then
  print -u2 'Xcode completo não encontrado. Instale-o pela App Store e abra-o uma vez.'
  print -u2 'Alternativa: envie dist/HomeHub-Safari-0.8.0.zip ao Safari Web Extension Packager no App Store Connect.'
  exit 1
fi
task_output="$task_root/apple-build"
if [[ -e "$task_output" ]]; then
  print -u2 'apple-build já existe. Abra o projeto existente; o Safari usa os arquivos desta pasta por referência.'
  exit 1
fi
/usr/bin/xcrun "$task_tool" "$task_dir" \
  --project-location "$task_output" \
  --app-name HomeHub \
  --bundle-identifier com.gperegr.homehub \
  --swift --no-prompt
