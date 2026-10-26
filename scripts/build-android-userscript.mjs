import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const read=file=>readFile(path.join(root,file),'utf8');
const manifest=JSON.parse(await read('chrome-extension/manifest.json'));
const download='https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.user.js';
const metadata=`// ==UserScript==
// @name         HomeHub — Google Home
// @namespace    https://github.com/gperegr/Homekit
// @version      ${manifest.version}
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
const css=(await Promise.all(['theme.css','widgets.css','ambient.css'].map(file=>read('chrome-extension/'+file))))
  .concat(await read('safari-extension/safari.css')).join('\n');
const bundle=metadata+`\n(async()=>{\n'use strict';
if(location.origin!=='https://home.google.com'||window.top!==window.self)return;
if(globalThis.__homeHubUserscriptLoaded)return;
await GM.addStyle(${JSON.stringify(css)});
globalThis.__homeHubUserscriptLoaded=true;
${await read('scripts/userscript-runtime.js')}
(()=>{\n${worker}\n})();
${widgets}
${await read('chrome-extension/content.js')}
})();\n`;
await mkdir(path.join(root,'dist'),{recursive:true});
await writeFile(path.join(root,'dist/HomeHub-Android.user.js'),bundle);
await writeFile(path.join(root,'dist/HomeHub-Android.meta.js'),metadata);
console.log(`HomeHub Android userscript ${manifest.version}: ${Buffer.byteLength(bundle)} bytes`);
