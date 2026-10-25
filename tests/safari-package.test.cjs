const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {execFileSync}=require('node:child_process');
const root=path.join(__dirname,'..');
const folder=path.join(root,'safari-extension');
const manifest=JSON.parse(fs.readFileSync(path.join(folder,'manifest.json'),'utf8'));

test('Safari: manifesto, permissão do Google Home e recursos empacotados',()=>{
  assert.equal(manifest.manifest_version,3);
  assert.equal(manifest.browser_specific_settings.safari.strict_min_version,'17.0');
  assert.deepEqual(manifest.permissions,['storage']);
  assert.deepEqual(manifest.host_permissions.sort(),['https://home.google.com/*','https://api.open-meteo.com/*','https://geocoding-api.open-meteo.com/*'].sort());
  assert.deepEqual(manifest.content_scripts[0].matches,['https://home.google.com/*']);
  const resources=['manifest.json',manifest.background.service_worker,...manifest.content_scripts.flatMap(item=>[...item.js,...item.css]),...Object.values(manifest.icons)];
  const archive=path.join(root,'dist',`HomeHub-Safari-${manifest.version}.zip`);
  const entries=execFileSync('/usr/bin/unzip',['-Z1',archive],{encoding:'utf8'}).trim().split('\n');
  assert.deepEqual(entries.sort(),resources.sort());
  for(const name of resources){
    const packed=execFileSync('/usr/bin/unzip',['-p',archive,name]);
    assert.deepEqual(packed,fs.readFileSync(path.join(folder,name)));
  }
});
test('Safari: cópias comuns não divergem da fonte',()=>{
  for(const file of ['content.js','widgets.js','weather-worker.js','theme.css','widgets.css','ambient.css']){
    assert.equal(fs.readFileSync(path.join(folder,file),'utf8'),fs.readFileSync(path.join(root,'chrome-extension',file),'utf8'),file);
  }
});
test('Safari: áreas seguras e recursos visuais WebKit estão presentes',()=>{
  const style=fs.readFileSync(path.join(folder,'safari.css'),'utf8');
  assert.match(style,/env\(safe-area-inset-bottom/);
  assert.match(style,/-webkit-backdrop-filter/);
  assert.match(style,/pointer:coarse/);
  assert.match(style,/\.hh-ambient-exit/);
});
