import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=file=>readFile(path.join(root,file),'utf8');
const manifest=JSON.parse(await read('chrome-extension/manifest.json'));
const version=manifest.version+'.4';
const download='https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.user.js';
const metadata=`// ==UserScript==
// @name         HomeHub — Google Home
// @namespace    https://github.com/gperegr/Homekit
// @version      ${version}
// @description  Interface HomeHub com relógio, calendário, Tempo e aparelhos do Google Home.
// @match        https://home.google.com/*
// @run-at       document-end
// @noframes
// @sandbox      DOM
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @connect      api.open-meteo.com
// @connect      geocoding-api.open-meteo.com
// @homepageURL  https://github.com/gperegr/Homekit
// @downloadURL  ${download}
// @updateURL    https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.meta.js
// ==/UserScript==
`;
const apiLine='const extensionApi=globalThis.browser||globalThis.chrome;';
const runtimeLine='const runtime=(globalThis.browser||globalThis.chrome)?.runtime;';
let worker=await read('chrome-extension/weather-worker.js');
let widgets=await read('chrome-extension/widgets.js');
if(!worker.includes(apiLine)||!widgets.includes(runtimeLine))throw Error('A API comum mudou; revise o adaptador userscript.');
worker=worker.replace(apiLine,'const extensionApi=homeHubUserscriptApi;\nconst fetch=homeHubUserscriptFetch;');
widgets=widgets.replace(runtimeLine,'const runtime=homeHubUserscriptApi.runtime;');
// Android's real display timeout replaces the automatic in-page ambient overlay.
const idleLine='const IDLE_DELAY=60*1000;';
const armLine='if(active&&!document.hidden&&!ambient.open)idleTimer=';
if(!widgets.includes(idleLine)||!widgets.includes(armLine))throw Error('O temporizador comum mudou; revise o modo Android.');
widgets=widgets.replace('attach(parent){','attach(parent){parent=document.querySelector("#homehub-dashboard")||parent;');
widgets=widgets.replace(idleLine,'const IDLE_DELAY=0;')
  .replace(armLine,'if(IDLE_DELAY>0&&active&&!document.hidden&&!ambient.open)idleTimer=');
let content=await read('chrome-extension/content.js');
const motionStartup='});startMotion();apply();';
if(!content.includes(motionStartup))throw Error('O início dos efeitos mudou; revise o perfil Android.');
content=content.replace(motionStartup,'});apply();')
  .replace('#homehub-ui,#homehub-widgets','#homehub-ui,#homehub-dashboard,#homehub-scroll-heading,#homehub-widgets');
const css=(await Promise.all(['theme.css','widgets.css','ambient.css'].map(file=>read('chrome-extension/'+file))))
  .concat(await read('safari-extension/safari.css'),await read('android/phone.css'))
  .join('\n').replaceAll('#homehub-ui',':is(#homehub-ui,#homehub-scroll-heading)');
const bundle=metadata+`\n(async()=>{\n'use strict';
if(location.origin!=='https://home.google.com'||window.top!==window.self)return;
if(globalThis.__homeHubUserscriptLoaded)return;
await GM.addStyle(${JSON.stringify(css)});
globalThis.__homeHubUserscriptLoaded=true;
${await read('scripts/userscript-phone.js')}
${await read('scripts/userscript-runtime.js')}
(()=>{\n${worker}\n})();
${widgets}
${content}
${await read('scripts/userscript-fullscreen.js')}
homeHubStartPhoneUi();
})();\n`;
await mkdir(path.join(root,'dist'),{recursive:true});
await writeFile(path.join(root,'dist/HomeHub-Android.user.js'),bundle);
await writeFile(path.join(root,'dist/HomeHub-Android.meta.js'),metadata);
console.log(`HomeHub Android userscript ${version}: ${Buffer.byteLength(bundle)} bytes`);
