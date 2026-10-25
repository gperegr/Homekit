import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=fileURLToPath(new URL('../',import.meta.url));
const source=path.join(root,'chrome-extension');
const target=path.join(root,'safari-extension');
const manifest=JSON.parse(await readFile(path.join(source,'manifest.json'),'utf8'));
manifest.name='Home Hub — Safari';
manifest.description='Sua casa no Safari: acessórios, cômodos, relógio, calendário e previsão do tempo.';
manifest.browser_specific_settings={safari:{strict_min_version:'17.0'}};
manifest.icons=Object.fromEntries([48,96,128,256,512,1024].map(size=>[size,`icons/icon-${size}.png`]));
manifest.host_permissions=[...new Set(['https://home.google.com/*',...manifest.host_permissions])];
for(const script of manifest.content_scripts)script.css.push('safari.css');
await mkdir(target,{recursive:true});
const files=[...new Set(manifest.content_scripts.flatMap(script=>[...script.js,...script.css]).filter(file=>file!=='safari.css')),
  manifest.background.service_worker];
for(const file of files)await copyFile(path.join(source,file),path.join(target,file));
await writeFile(path.join(target,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
// Only runtime resources go into the distributable. No account data or test fixtures.
const resources=['manifest.json',...files,'safari.css',...Object.values(manifest.icons)];
for(const file of resources)await readFile(path.join(target,file));
const distribution=path.join(root,'dist');
await mkdir(distribution,{recursive:true});
const zipPath=path.join(distribution,`HomeHub-Safari-${manifest.version}.zip`);
// zip updates existing archives; delete only this generated artifact first.
const {rm}=await import('node:fs/promises');
await rm(zipPath,{force:true});
execFileSync('/usr/bin/zip',['-q','-X',zipPath,...resources],{cwd:target});
console.log(`Safari ${manifest.version}: ${target}\nPacote: ${zipPath}`);
