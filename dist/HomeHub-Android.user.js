// ==UserScript==
// @name         HomeHub — Google Home
// @namespace    https://github.com/gperegr/Homekit
// @version      0.8.2.2
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
// @downloadURL  https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.user.js
// @updateURL    https://raw.githubusercontent.com/gperegr/Homekit/main/dist/HomeHub-Android.meta.js
// ==/UserScript==

(async()=>{
'use strict';
if(location.origin!=='https://home.google.com'||window.top!==window.self)return;
if(globalThis.__homeHubUserscriptLoaded)return;
await GM.addStyle("/* Home Hub. All changes to the Google page are scoped to the devices view. */\nhtml[data-homehub-active] {\n  --hh-font:-apple-system,BlinkMacSystemFont,\"SF Pro Display\",\"SF Pro Text\",\"Segoe UI\",sans-serif;\n  --hh-ink:#202938; --hh-muted:#718096; --hh-faint:#8a96a8;\n  --hh-sidebar:rgba(255,255,255,.50); --hh-card:rgba(255,255,255,.57);\n  --hh-on:#fff; --hh-line:rgba(255,255,255,.82); --hh-selected:rgba(255,255,255,.85);\n  --hh-chip:rgba(255,255,255,.22);\n  --hh-glint:rgba(255,255,255,.58);--hh-rim:rgba(255,255,255,.72);\n  --hh-shadow:0 8px 28px rgba(58,79,116,.055); --hh-accent:#087aff;\n  color-scheme:light!important;\n  background:#eaf0fa!important;\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] {\n  --hh-ink:#f2f3f7; --hh-muted:#b0b7c6; --hh-faint:#929dad;\n  --hh-sidebar:rgba(23,27,35,.88); --hh-card:rgba(35,41,53,.88);\n  --hh-on:#293442; --hh-line:rgba(207,219,244,.12); --hh-selected:rgba(134,169,221,.14);\n  --hh-chip:rgba(37,43,55,.72);\n  --hh-glint:rgba(214,230,255,.085);--hh-rim:rgba(226,235,255,.12);\n  --hh-shadow:0 8px 24px rgba(0,0,0,.18);--hh-accent:#8bbaff;\n  color-scheme:dark!important;\n  background:#101217!important;\n}\nhtml[data-homehub-active],html[data-homehub-active] body {\n  width:100%!important;height:100%!important;margin:0!important;overflow:hidden!important;\n  font-family:var(--hh-font)!important;\n}\nhtml[data-homehub-active] body {\n  background:\n    radial-gradient(ellipse at 5% 5%,rgba(255,188,212,.55),transparent 43%),\n    radial-gradient(ellipse at 95% 20%,rgba(163,200,255,.55),transparent 49%),\n    radial-gradient(ellipse at 55% 100%,rgba(239,221,192,.38),transparent 45%),#edf1f9!important;\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] body {\n  background:\n    radial-gradient(ellipse at 8% 0%,rgba(102,82,130,.15),transparent 48%),\n    radial-gradient(ellipse at 100% 30%,rgba(53,86,126,.17),transparent 52%),\n    radial-gradient(ellipse at 48% 100%,rgba(94,75,96,.08),transparent 46%),#101217!important;\n}\nhtml[data-homehub-active] body::before {\n  content:\"\";position:fixed;inset:-40px;z-index:0;pointer-events:none;\n  background:radial-gradient(ellipse at 18% 16%,rgba(255,196,224,.22),transparent 50%),radial-gradient(ellipse at 82% 55%,rgba(137,187,255,.20),transparent 48%);\n  transform:translate3d(var(--hh-scene-x,0px),var(--hh-scene-y,0px),0);\n  transition:transform .55s cubic-bezier(.2,.75,.25,1);\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] body::before {\n  background:radial-gradient(ellipse at 18% 16%,rgba(153,127,184,.035),transparent 50%),radial-gradient(ellipse at 82% 55%,rgba(101,146,195,.045),transparent 48%);\n}\nhtml[data-homehub-active] ghw-root,\nhtml[data-homehub-active] ghw-home,\nhtml[data-homehub-active] ghw-home > main,\nhtml[data-homehub-active] ghw-navigation-rail,\nhtml[data-homehub-active] ghw-navigation-rail > mat-sidenav-container,\nhtml[data-homehub-active] ghw-navigation-rail > mat-sidenav-container > mat-sidenav-content,\nhtml[data-homehub-active] .main-content-wrapper {\n  display:block!important;position:static!important;box-sizing:border-box!important;\n  width:100%!important;max-width:none!important;min-width:0!important;height:100%!important;\n  margin:0!important;padding:0!important;transform:none!important;border:0!important;\n  border-radius:0!important;background:transparent!important;overflow:hidden!important;\n}\nhtml[data-homehub-active] ghw-toolbar,\nhtml[data-homehub-active] ghw-navigation-rail > mat-sidenav-container > mat-sidenav,\nhtml[data-homehub-active] ghw-navigation-rail .rail,\nhtml[data-homehub-active] ghw-devices > :not(.devices-container),\nhtml[data-homehub-active] ghw-devices .devices-container > mat-sidenav {\n  display:none!important;\n}\nhtml[data-homehub-active] ghw-devices {\n  display:block!important;position:fixed!important;inset:194px 36px 16px!important;\n  width:auto!important;max-width:none!important;min-width:0!important;height:auto!important;\n  margin:0!important;padding:0!important;border:0!important;background:transparent!important;\n  z-index:2!important;overflow:hidden!important;\n}\nhtml[data-homehub-active] ghw-devices > .devices-container,\nhtml[data-homehub-active] ghw-devices .devices-container > mat-sidenav-content {\n  display:block!important;position:relative!important;box-sizing:border-box!important;\n  width:100%!important;max-width:none!important;min-width:0!important;height:100%!important;\n  margin:0!important;padding:0!important;background:transparent!important;transform:none!important;\n  border:0!important;border-radius:0!important;\n}\nhtml[data-homehub-active] ghw-devices .devices-container > mat-sidenav-content {\n  overflow:auto!important;overflow-x:hidden!important;scrollbar-width:thin;\n  scrollbar-color:rgba(100,118,149,.25) transparent;\n}\nhtml[data-homehub-active] ghw-devices .spaces-container {\n  display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;\n  align-content:start!important;align-items:stretch!important;gap:14px!important;\n  box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:1073px!important;\n  margin:0 auto!important;padding:3px 5px 136px 2px!important;\n}\nhtml[data-homehub-active] ghw-devices .spaces-container > .space,\nhtml[data-homehub-active] ghw-devices .space > .tile-container,\nhtml[data-homehub-active] ghw-devices .tile-container > .tile-column {\n  display:contents!important;\n}\nhtml[data-homehub-active] ghw-devices .space > h2 {display:none!important;}\nhtml[data-homehub-active] ghw-devices .spaces-container ghw-device-tile {\n  display:block!important;position:relative!important;box-sizing:border-box!important;\n  width:auto!important;min-width:0!important;max-width:none!important;height:164px!important;aspect-ratio:auto;\n  min-height:0!important;margin:0!important;padding:0!important;grid-column:auto!important;\n}\nhtml[data-homehub-active] ghw-devices ghw-device-tile[data-homehub-hidden=\"true\"] {display:none!important;}\nhtml[data-homehub-active] ghw-devices .device-tile,\nhtml[data-homehub-active] ghw-devices .device-tile > *,\nhtml[data-homehub-active] ghw-devices .on-off-tile-container {\n  display:block!important;position:relative!important;box-sizing:border-box!important;\n  width:100%!important;min-width:0!important;max-width:none!important;height:100%!important;\n  min-height:0!important;margin:0!important;padding:0!important;\n  background:transparent!important;border:0!important;box-shadow:none!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card] {\n  --hh-tile-ink:var(--hh-ink);--hh-tile-muted:var(--hh-muted);--hh-device-accent:#367dd3;\n  display:flex!important;flex-direction:column!important;align-items:flex-start!important;\n  justify-content:space-between!important;gap:10px!important;position:relative!important;\n  box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:none!important;\n  height:100%!important;min-height:0!important;margin:0!important;padding:16px!important;\n  border:1px solid var(--hh-line)!important;border-radius:23px!important;overflow:hidden!important;\n  background:var(--hh-card)!important;color:var(--hh-tile-ink)!important;opacity:1!important;\n  box-shadow:var(--hh-shadow)!important;backdrop-filter:blur(24px) saturate(170%);\n  font-family:var(--hh-font)!important;text-align:left!important;\n  transition:transform .2s ease,box-shadow .2s ease,background .2s ease!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card].active {\n  --hh-tile-ink:#273143;--hh-tile-muted:#788397;\n  background:var(--hh-on)!important;border-color:rgba(255,255,255,.96)!important;\n  box-shadow:0 9px 24px rgba(57,79,113,.075)!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-kind=\"light\"] {--hh-device-accent:#dca12a!important;}\nhtml[data-homehub-active] ghw-devices [data-homehub-kind=\"vacuum\"] {--hh-device-accent:#39a48e!important;}\nhtml[data-homehub-active] ghw-devices [data-homehub-card]:hover:not([aria-disabled=\"true\"]) {\n  box-shadow:0 12px 30px rgba(50,70,110,.12)!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card]::before {\n  content:\"\"!important;position:absolute!important;inset:0!important;z-index:1!important;\n  border-radius:inherit!important;pointer-events:none!important;\n  background:radial-gradient(240px circle at var(--hh-glass-x,50%) var(--hh-glass-y,10%),var(--hh-glint),transparent 72%)!important;\n  opacity:var(--hh-glass-visible,0)!important;transition:opacity .25s ease!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card]::after {\n  content:\"\"!important;position:absolute!important;inset:0!important;z-index:3!important;\n  border-radius:inherit!important;pointer-events:none!important;\n  box-shadow:inset 1px 1px 1px var(--hh-rim),inset -1px -1px 1px rgba(255,255,255,.09)!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card]:focus-visible {outline:3px solid #1686ff!important;outline-offset:2px!important;}\nhtml[data-homehub-active] ghw-devices [data-homehub-card] .icon {\n  display:grid!important;place-items:center!important;position:relative!important;z-index:2!important;\n  flex:0 0 58px!important;box-sizing:border-box!important;width:58px!important;height:58px!important;\n  padding:0!important;margin:0!important;border-radius:50%!important;\n  background:rgba(121,141,168,.11)!important;color:var(--hh-tile-muted)!important;opacity:1!important;\n  transform:translate3d(var(--hh-depth-x,0px),var(--hh-depth-y,0px),0)!important;\n  transition:transform .22s cubic-bezier(.2,.75,.25,1)!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card].active .icon {\n  color:#fff!important;background:var(--hh-device-accent)!important;\n  box-shadow:0 3px 12px color-mix(in srgb,var(--hh-device-accent) 22%,transparent)!important;\n}\n.homehub-symbol,.homehub-room-label {display:none;}\nhtml[data-homehub-active] ghw-devices .icon[data-homehub-symbol] > mat-icon {display:none!important;}\nhtml[data-homehub-active] .homehub-symbol {display:block!important;width:38px!important;height:38px!important;pointer-events:none!important;}\nhtml[data-homehub-active] ghw-devices [data-homehub-card] .content {\n  display:flex!important;flex-direction:column!important;align-items:flex-start!important;\n  justify-content:flex-end!important;position:relative!important;z-index:2!important;\n  flex:none!important;box-sizing:border-box!important;width:100%!important;min-width:0!important;\n  height:auto!important;margin:0!important;padding:0!important;gap:3px!important;\n  color:var(--hh-tile-ink)!important;opacity:1!important;text-align:left!important;\n  transform:translate3d(calc(var(--hh-depth-x,0px) * .35),calc(var(--hh-depth-y,0px) * .35),0)!important;\n  transition:transform .28s cubic-bezier(.2,.75,.25,1)!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-interacting] .icon,\nhtml[data-homehub-active] ghw-devices [data-homehub-interacting] .content {transform:none!important;transition:none!important;}\nhtml[data-homehub-active] ghw-devices [data-homehub-card] .content .title {\n  display:block!important;box-sizing:border-box!important;width:100%!important;max-width:100%!important;\n  min-width:0!important;margin:0!important;padding:0!important;overflow:hidden!important;\n  text-overflow:ellipsis!important;white-space:nowrap!important;font-family:var(--hh-font)!important;\n  font-size:14px!important;line-height:1.2!important;font-weight:600!important;\n  letter-spacing:-.025em!important;color:var(--hh-tile-ink)!important;opacity:1!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card] .content .subtitle,\nhtml[data-homehub-active] ghw-devices [data-homehub-card] .content > span,\nhtml[data-homehub-active] ghw-devices [data-homehub-card] .content .subtitle span {\n  margin:0!important;padding:0!important;font-family:var(--hh-font)!important;font-size:11.5px!important;\n  line-height:1.25!important;font-weight:450!important;color:var(--hh-tile-muted)!important;opacity:1!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card].offline .content .title {color:var(--hh-muted)!important;}\nhtml[data-homehub-active] ghw-devices .homehub-room-label {\n  display:block!important;position:absolute!important;top:20px!important;right:15px!important;\n  max-width:calc(100% - 94px)!important;z-index:2!important;font-family:var(--hh-font)!important;\n  font-size:10px!important;line-height:1.25!important;font-weight:500!important;\n  color:var(--hh-tile-muted)!important;text-align:right!important;pointer-events:none!important;\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card] .state-overlay {opacity:0!important;pointer-events:none!important;}\nhtml[data-homehub-active] ghw-devices [data-homehub-card] > .slider {background:rgba(220,161,42,.075)!important;}\nhtml[data-homehub-active] ghw-devices .fake-expand-button-container {display:none!important;}\nhtml[data-homehub-active] ghw-devices .expand-button-container {\n  position:absolute!important;right:6px!important;top:5px!important;bottom:auto!important;\n  width:28px!important;height:28px!important;padding:0!important;z-index:4!important;background:transparent!important;\n}\nhtml[data-homehub-active] ghw-devices .expand-button-container button {width:28px!important;height:28px!important;padding:2px!important;}\nhtml[data-homehub-active] ghw-devices .expand-button[data-homehub-symbol] > mat-icon {display:none!important;}\nhtml[data-homehub-active] ghw-devices .expand-button {display:grid!important;place-items:center!important;background:transparent!important;color:var(--hh-muted)!important;}\nhtml[data-homehub-active] ghw-devices .expand-button .homehub-symbol {width:18px!important;height:18px!important;}\nhtml[data-homehub-active] ghw-devices [data-homehub-group=\"true\"] .homehub-room-label {right:38px!important;}\nhtml[data-homehub-active] ghw-devices .homehub-native-status {font-family:var(--hh-font)!important;font-size:11px!important;line-height:1.25!important;color:var(--hh-tile-muted)!important;}\nhtml[data-homehub-active] ghw-devices .expand-button-container + .homehub-room-label {right:42px!important;}\n\n/* Extension navigation. Native dialogs remain above this layer. */\n#homehub-ui {font-family:-apple-system,BlinkMacSystemFont,\"SF Pro Display\",\"SF Pro Text\",\"Segoe UI\",sans-serif!important;color:var(--hh-ink,#202938);}\n#homehub-ui * {box-sizing:border-box;}\n#homehub-ui button {font:inherit;cursor:pointer;color:inherit;border:0;background:none;}\n#homehub-ui button:focus-visible {outline:3px solid #087aff;outline-offset:3px;}\n#homehub-ui svg {display:block;width:20px;height:20px;flex-shrink:0;}\n#homehub-ui .hh-dock {\n  position:fixed;z-index:40;left:50%;bottom:24px;transform:translateX(-50%);\n  display:flex;align-items:center;gap:5px;width:max-content;max-width:calc(100vw - 48px);\n  padding:7px;border:1px solid var(--hh-line);border-radius:36px;\n  background:linear-gradient(140deg,rgba(255,255,255,.16),transparent 48%),var(--hh-sidebar);\n  box-shadow:inset 1px 1px 1px var(--hh-rim),inset -1px -1px 1px rgba(255,255,255,.10),0 16px 44px rgba(31,51,85,.18),0 3px 10px rgba(31,51,85,.06);\n  backdrop-filter:blur(36px) saturate(185%);\n}\n#homehub-ui .hh-dock::before {\n  content:\"\";position:absolute;inset:0;border-radius:inherit;pointer-events:none;\n  background:radial-gradient(340px circle at var(--hh-glass-x,50%) var(--hh-glass-y,10%),var(--hh-glint),transparent 75%);\n  opacity:calc(var(--hh-glass-visible,0) * .5);transition:opacity .3s;\n}\n#homehub-ui .hh-dock > * {position:relative;z-index:1;}\n#homehub-ui .hh-rooms {display:flex;align-items:center;gap:4px;overflow:auto;min-width:0;scrollbar-width:none;}\n#homehub-ui .hh-nav {\n  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;\n  flex:0 0 103px;min-width:88px;height:68px;padding:7px 9px;border-radius:28px;\n  text-align:center;font-size:11px;font-weight:500;color:var(--hh-muted);\n  transition:background .2s,color .2s,height .2s;\n}\n#homehub-ui .hh-dock > .hh-nav {flex:0 0 103px;}\n#homehub-ui .hh-nav > svg {width:27px;height:27px;opacity:.9;}\n#homehub-ui .hh-nav .hh-button-label {display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n#homehub-ui .hh-room-icon {\n  --hh-room-color:#70869f;display:grid;place-items:center;flex:0 0 31px;width:35px;height:31px;\n  border-radius:11px;color:var(--hh-room-color);background:color-mix(in srgb,var(--hh-room-color) 9%,transparent);\n  box-shadow:inset 0 1px 0 rgba(255,255,255,.35);transition:transform .2s ease,background .2s ease;\n}\n#homehub-ui .hh-room-icon svg {width:27px;height:27px;opacity:1;}\n#homehub-ui .hh-room-icon[data-room-kind=\"bathroom\"] {--hh-room-color:#5d98b2;}\n#homehub-ui .hh-room-icon[data-room-kind=\"kitchen\"] {--hh-room-color:#ba8b53;}\n#homehub-ui .hh-room-icon[data-room-kind=\"office\"] {--hh-room-color:#708ac1;}\n#homehub-ui .hh-room-icon[data-room-kind=\"bedroom\"] {--hh-room-color:#967bb5;}\n#homehub-ui .hh-room-icon[data-room-kind=\"guest\"] {--hh-room-color:#aa83ab;}\n#homehub-ui .hh-room-icon[data-room-kind=\"living\"] {--hh-room-color:#6a9a89;}\n#homehub-ui .hh-room-icon[data-room-kind=\"garden\"] {--hh-room-color:#6a9b69;}\n#homehub-ui .hh-room-icon[data-room-kind=\"laundry\"] {--hh-room-color:#629da6;}\n#homehub-ui .hh-nav:hover .hh-room-icon {transform:translateY(-2px);}\n#homehub-ui .hh-nav[aria-pressed=\"true\"] .hh-room-icon {background:color-mix(in srgb,var(--hh-room-color) 15%,transparent);}\nhtml[data-homehub-theme=\"dark\"] #homehub-ui .hh-room-icon {filter:brightness(1.23) saturate(.9);box-shadow:inset 0 1px 0 rgba(255,255,255,.10);}\n#homehub-ui .hh-nav[aria-pressed=\"true\"] {background:var(--hh-selected);color:var(--hh-ink);box-shadow:inset 0 1px 1px var(--hh-rim),0 2px 7px rgba(50,70,100,.04);font-weight:600;}\n#homehub-ui .hh-nav:hover {background:var(--hh-selected);}\n#homehub-ui .hh-nav[aria-pressed=\"true\"] > svg {color:#087aff;}\n#homehub-ui .hh-count {display:none;}\n#homehub-ui .hh-dock-actions {display:flex;align-items:center;flex-shrink:0;margin-left:2px;padding-left:6px;border-left:1px solid color-mix(in srgb,var(--hh-muted) 16%,transparent);}\n#homehub-ui .hh-original {display:grid;place-items:center;width:42px;height:52px;border-radius:22px;color:var(--hh-muted);}\n#homehub-ui .hh-original:hover {background:var(--hh-selected);}\n#homehub-ui .hh-original svg {width:19px;height:19px;}\n#homehub-ui .hh-original .hh-button-label {display:none;}\n#homehub-ui .hh-header {position:fixed;left:38px;right:38px;top:32px;z-index:20;display:flex;align-items:center;gap:12px;}\n#homehub-ui .hh-heading {flex:1;min-width:0;}\n#homehub-ui .hh-eyebrow {display:flex;align-items:center;gap:8px;min-width:0;color:var(--hh-muted);}\n#homehub-ui .hh-eyebrow > svg {width:16px;height:16px;color:#df9c65;}\n#homehub-ui .hh-home-name {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:600;max-width:200px;}\n#homehub-ui .hh-eyebrow-separator {opacity:.45;}\n#homehub-ui .hh-date {font-size:11px;font-weight:450;text-transform:none;}\n#homehub-ui h1 {margin:7px 0 6px;font-size:34px;font-weight:650;letter-spacing:-.055em;line-height:1.1;}\n#homehub-ui .hh-summary {font-size:12px;color:var(--hh-muted);line-height:1.4;}\n#homehub-ui .hh-theme,#homehub-ui .hh-tool-button {\n  display:grid;place-items:center;flex:0 0 40px;width:40px;height:40px;border-radius:50%;\n  background:var(--hh-sidebar);border:1px solid var(--hh-line);box-shadow:inset 0 1px 0 var(--hh-rim);\n  backdrop-filter:blur(16px) saturate(170%);\n}\n#homehub-ui .hh-theme,#homehub-ui .hh-chip {position:relative;isolation:isolate;}\n#homehub-ui .hh-theme::before,#homehub-ui .hh-chip::before {\n  content:\"\";position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;\n  background:radial-gradient(100px circle at var(--hh-glass-x,50%) var(--hh-glass-y,0%),var(--hh-glint),transparent 80%);\n  opacity:var(--hh-glass-visible,0);transition:opacity .2s;\n}\n#homehub-ui .hh-theme svg,#homehub-ui .hh-tool-button svg {width:18px;height:18px;}\n#homehub-ui .hh-categories {position:fixed;left:38px;right:38px;top:140px;z-index:20;display:flex;gap:9px;overflow:auto;scrollbar-width:none;padding:2px 0 6px;}\n#homehub-ui .hh-chip {display:flex;align-items:center;gap:7px;flex-shrink:0;min-height:36px;border:1px solid transparent;padding:8px 14px;border-radius:19px;font-size:12px;font-weight:550;color:var(--hh-muted);background:var(--hh-chip);backdrop-filter:blur(16px) saturate(170%);box-shadow:inset 0 1px 0 var(--hh-rim);}\n#homehub-ui .hh-chip svg {width:18px;height:18px;}\n#homehub-ui .hh-chip[aria-pressed=\"true\"] {background:var(--hh-selected);border-color:var(--hh-line);color:var(--hh-ink);box-shadow:0 3px 8px rgba(50,70,100,.025);}\n#homehub-ui .hh-chip-count {opacity:.55;font-size:10px;}\n#homehub-ui .hh-empty {position:fixed;left:36px;right:36px;top:530px;text-align:center;font-size:14px;color:var(--hh-muted);}\n#homehub-ui .hh-empty[hidden] {display:none;}\n#homehub-ui .hh-restore {display:none;position:fixed;right:20px;bottom:20px;z-index:9999;padding:12px 18px;background:#fff;color:#273143;border:1px solid #d9e0eb;border-radius:24px;font-size:13px;box-shadow:0 6px 25px rgba(0,0,0,.15);}\n#homehub-ui[data-original=\"true\"] > :not(.hh-restore) {display:none!important;}\n#homehub-ui[data-original=\"true\"] .hh-restore {display:block;}\nhtml[data-homehub-dock=\"compact\"] #homehub-ui .hh-dock {border-radius:31px;}\nhtml[data-homehub-dock=\"compact\"] #homehub-ui .hh-nav {flex-basis:58px;min-width:58px;height:50px;padding:7px;border-radius:24px;}\nhtml[data-homehub-dock=\"compact\"] #homehub-ui .hh-nav .hh-button-label {display:none;}\nhtml[data-homehub-dock=\"compact\"] #homehub-ui .hh-dock > .hh-nav {flex-basis:58px;}\nhtml[data-homehub-dock=\"compact\"] #homehub-ui .hh-original {height:44px;}\n@media(max-width:1050px) {\n  #homehub-ui .hh-header,#homehub-ui .hh-categories {left:26px;right:26px;}\n  html[data-homehub-active] ghw-devices {left:24px!important;right:24px!important;}\n  #homehub-ui .hh-empty {left:24px;right:24px;}\n}\n@media(max-width:760px) {\n  #homehub-ui .hh-header {left:20px;right:20px;top:24px;gap:7px;}\n  #homehub-ui h1 {font-size:26px;}\n  #homehub-ui .hh-date,#homehub-ui .hh-eyebrow-separator {display:none;}\n  #homehub-ui .hh-home-name {font-size:11px;max-width:145px;}\n  #homehub-ui .hh-summary {font-size:10px;}\n  #homehub-ui .hh-theme,#homehub-ui .hh-tool-button {width:34px;height:34px;flex-basis:34px;}\n  #homehub-ui .hh-categories {left:20px;right:20px;top:130px;}\n  html[data-homehub-active] ghw-devices {inset:184px 18px 12px!important;}\n  html[data-homehub-active] ghw-devices .spaces-container {grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:11px!important;padding-bottom:124px!important;}\n  html[data-homehub-active] ghw-devices .spaces-container ghw-device-tile {height:164px!important;aspect-ratio:auto;}\n  html[data-homehub-active] ghw-devices [data-homehub-card] .icon {width:52px!important;height:52px!important;flex-basis:52px!important;}\n  html[data-homehub-active] .homehub-symbol {width:34px!important;height:34px!important;}\n  #homehub-ui .hh-dock {bottom:18px;max-width:calc(100vw - 28px);padding:6px;gap:3px;}\n  #homehub-ui .hh-nav,#homehub-ui .hh-dock > .hh-nav {flex-basis:82px;min-width:82px;height:62px;padding:6px;font-size:10px;}\n  #homehub-ui .hh-original {width:32px;height:46px;}\n  #homehub-ui .hh-original svg {width:17px;height:17px;}\n  #homehub-ui .hh-empty {left:18px;right:18px;}\n}\n@media(prefers-reduced-motion:reduce) {\n  html[data-homehub-active] body::before {transform:none!important;transition:none!important;}\n  html[data-homehub-active] ghw-devices [data-homehub-card],\n  html[data-homehub-active] ghw-devices [data-homehub-card] .icon,\n  html[data-homehub-active] ghw-devices [data-homehub-card] .content,\n  #homehub-ui .hh-room-icon,#homehub-ui .hh-nav {transform:none!important;transition:none!important;}\n  html[data-homehub-active] ghw-devices [data-homehub-card]::before,\n  #homehub-ui .hh-dock::before,#homehub-ui .hh-chip::before,#homehub-ui .hh-theme::before {opacity:0!important;transition:none!important;}\n}\n\n/* Expanded groups keep their native controls and join the square grid as one band. */\nhtml[data-homehub-active] ghw-devices ghw-device-tile:has(> .expanded-group > *) {\n  display:grid!important;grid-template-columns:subgrid!important;grid-column:1/-1!important;\n  gap:14px!important;height:auto!important;aspect-ratio:auto!important;\n  border-radius:26px;background:color-mix(in srgb,var(--hh-card) 45%,transparent);\n  box-shadow:0 0 0 5px color-mix(in srgb,var(--hh-card) 45%,transparent);\n}\nhtml[data-homehub-active] ghw-devices ghw-device-tile:has(> .expanded-group > *) > .device-tile,\nhtml[data-homehub-active] ghw-devices .expanded-group .group-child {\n  width:100%!important;height:164px!important;min-height:0!important;aspect-ratio:auto!important;\n  min-width:0!important;margin:0!important;padding:0!important;display:block!important;\n}\nhtml[data-homehub-active] ghw-devices .expanded-group {\n  display:contents!important;\n}\n@media (min-width:761px) and (max-width:900px) {\n  html[data-homehub-active] ghw-devices .spaces-container {grid-template-columns:repeat(2,minmax(0,1fr))!important;}\n}\n\nhtml[data-homehub-active] ghw-devices ghw-device-tile:has(> .expanded-group > *) > .device-tile .expand-button .homehub-symbol {transform:rotate(180deg);}\n\n@media(max-width:760px) {\n  html[data-homehub-active] ghw-devices ghw-device-tile:has(> .expanded-group > *) {gap:11px!important;}\n}\n\n/* Keep the dashboard at a comfortable size even on wide/fullscreen displays. */\n#homehub-ui .hh-header,#homehub-ui .hh-categories {max-width:1066px;margin-left:auto;margin-right:auto;}\n@media(max-width:760px) {\n  html[data-homehub-active] ghw-devices .spaces-container ghw-device-tile,\n  html[data-homehub-active] ghw-devices ghw-device-tile:has(> .expanded-group > *) > .device-tile,\n  html[data-homehub-active] ghw-devices .expanded-group .group-child {height:148px!important;aspect-ratio:auto!important;}\n  html[data-homehub-active] ghw-devices .spaces-container ghw-device-tile:has(> .expanded-group > *) {height:auto!important;}\n}\n@media(max-width:900px) {\n  html[data-homehub-active] ghw-devices .spaces-container {max-width:533px!important;}\n  #homehub-ui .hh-header,#homehub-ui .hh-categories {max-width:526px;}\n}\n@media(max-width:760px) {\n  html[data-homehub-active] ghw-devices .spaces-container {max-width:530px!important;}\n  #homehub-ui .hh-header,#homehub-ui .hh-categories {max-width:523px;}\n}\n\n/* Night appearance: quiet graphite surfaces, readable labels and tinted active states. */\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] ghw-devices [data-homehub-card].active {\n  --hh-tile-ink:#f3f6fb;--hh-tile-muted:#b6c7de;\n  background:linear-gradient(145deg,#2b3b51,#25303f)!important;\n  border-color:rgba(147,183,235,.27)!important;\n  box-shadow:inset 0 1px 0 rgba(210,228,255,.07),0 8px 24px rgba(0,0,0,.2)!important;\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] ghw-devices [data-homehub-kind=\"light\"].active {\n  --hh-tile-muted:#dbcba7;\n  background:linear-gradient(145deg,#3d372b,#2f3031)!important;\n  border-color:rgba(235,197,119,.29)!important;\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] ghw-devices [data-homehub-kind=\"light\"].active .icon {\n  background:#e9c579!important;color:#262115!important;\n  box-shadow:0 3px 18px rgba(233,197,121,.14)!important;\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] ghw-devices [data-homehub-kind=\"vacuum\"].active {\n  --hh-tile-muted:#b2d4c9;\n  background:linear-gradient(145deg,#263f3b,#253133)!important;\n  border-color:rgba(118,194,168,.24)!important;\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] ghw-devices [data-homehub-card]:hover:not([aria-disabled=\"true\"]) {\n  box-shadow:0 10px 30px rgba(0,0,0,.26),inset 0 0 0 1px rgba(198,215,243,.1)!important;\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] ghw-devices [data-homehub-card].offline .icon {color:#919baa!important;background:rgba(158,174,201,.07)!important;}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] #homehub-ui .hh-dock {\n  background:linear-gradient(145deg,rgba(255,255,255,.045),transparent 55%),var(--hh-sidebar);\n  box-shadow:inset 0 1px 0 rgba(225,235,255,.1),0 18px 50px rgba(0,0,0,.38);\n}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] #homehub-ui .hh-nav[aria-pressed=\"true\"] {color:#edf4ff;}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] #homehub-ui .hh-nav[aria-pressed=\"true\"] > svg {color:#8bbaff;}\nhtml[data-homehub-active][data-homehub-theme=\"dark\"] #homehub-ui .hh-chip[aria-pressed=\"true\"] {color:#dfebff;border-color:rgba(149,183,235,.24);}\n\n/* Clock, Weather and collapsible navigation for Home Hub. */\n#homehub-widgets {display:none;}\nhtml[data-homehub-active] #homehub-widgets {\n  display:grid;grid-column:1/-1;grid-template-columns:subgrid;gap:14px;\n  align-items:stretch;box-sizing:border-box;min-width:0;margin:0 0 6px;padding:0;\n  font-family:var(--hh-font);color:var(--hh-ink);\n}\n#homehub-widgets *,#homehub-weather-dialog * {box-sizing:border-box;}\n#homehub-widgets button,#homehub-weather-dialog button,#homehub-weather-dialog input {font:inherit;}\n#homehub-widgets button {cursor:pointer;color:inherit;border:0;background:none;}\n#homehub-widgets button:focus-visible,#homehub-weather-dialog :focus-visible {outline:3px solid #2e9bff;outline-offset:3px;}\n#homehub-widgets button:disabled {cursor:default;opacity:.55;}\n#homehub-widgets .hhw-clock,#homehub-widgets .hhw-weather,#homehub-widgets .hhw-calendar {\n  position:relative;isolation:isolate;overflow:hidden;min-width:0;min-height:0;aspect-ratio:1;\n  border:1px solid rgba(255,255,255,.6);border-radius:27px;\n  box-shadow:0 8px 26px rgba(44,66,106,.08),inset 1px 1px 1px rgba(255,255,255,.65);\n}\n#homehub-widgets .hhw-clock {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:9px;padding:13px 18px;background:rgba(255,255,255,.94);color:#242532;}\n#homehub-widgets .hhw-clock::before {\n  content:\"\";position:absolute;inset:0;border-radius:inherit;pointer-events:none;\n  background:radial-gradient(240px circle at var(--hh-glass-x,50%) var(--hh-glass-y,10%),rgba(237,230,252,.35),transparent 72%);\n  opacity:var(--hh-glass-visible,0);transition:opacity .25s;\n}\n#homehub-widgets .hhw-clock-face {display:block;width:76%;max-width:180px;height:auto;aspect-ratio:1;flex-shrink:0;position:relative;}\n#homehub-widgets .hhw-clock-tick {stroke:#d8d3e7;stroke-width:1.5;stroke-linecap:round;}\n#homehub-widgets .hhw-clock-tick-major {stroke:#b7aecf;stroke-width:2;stroke-linecap:round;}\n#homehub-widgets .hhw-clock-number {font-family:var(--hh-font);font-size:18px;font-weight:600;letter-spacing:-.6px;fill:#8d82b0;}\n#homehub-widgets .hhw-hand-hour,#homehub-widgets .hhw-hand-minute {stroke:#17181d;filter:drop-shadow(0 1px 1px rgba(0,0,0,.15));}\n#homehub-widgets .hhw-hand-second {stroke:#9b8db9;}\n#homehub-widgets .hhw-clock-caption {position:relative;display:flex;align-items:center;justify-content:space-between;gap:15px;width:100%;max-width:174px;font-size:10px;font-weight:500;color:#8a829d;}\n#homehub-widgets .hhw-clock-digital {font-variant-numeric:tabular-nums;font-size:12px;font-weight:600;color:#74688e;}\n#homehub-widgets .hhw-weather {\n  grid-column:span 2;aspect-ratio:auto;container-type:inline-size;\n  display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;gap:5px;\n  padding:18px 23px 12px;color:#fff;\n  background:linear-gradient(145deg,#3a4859,#263343);border-color:rgba(223,235,255,.25);\n  box-shadow:inset 0 1px 1px rgba(255,255,255,.13),0 9px 24px rgba(20,31,48,.14);\n}\n#homehub-widgets .hhw-weather[data-weather=\"clear\"],#homehub-widgets .hhw-weather[data-weather=\"partly\"] {background:linear-gradient(145deg,#6489ad,#3d617f);}\n#homehub-widgets .hhw-weather[data-weather=\"cloudy\"],#homehub-widgets .hhw-weather[data-weather=\"fog\"] {background:linear-gradient(145deg,#526172,#354455);}\n#homehub-widgets .hhw-weather[data-weather=\"rain\"],#homehub-widgets .hhw-weather[data-weather=\"storm\"],#homehub-widgets .hhw-weather[data-day=\"night\"] {background:linear-gradient(145deg,#343f4d,#25313f);}\n#homehub-widgets .hhw-weather[data-weather=\"snow\"] {background:linear-gradient(145deg,#758b9f,#50667d);}\n#homehub-widgets .hhw-weather::before {content:\"\";position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 35% 0,rgba(255,255,255,.055),transparent 72%);}\n#homehub-widgets .hhw-weather > * {position:relative;z-index:1;}\n#homehub-widgets .hhw-weather-top {display:flex;align-items:center;min-width:0;}\n#homehub-widgets .hhw-city {display:flex;align-items:center;gap:5px;min-width:0;max-width:calc(100% - 65px);padding:0!important;font-size:21px;font-weight:600;letter-spacing:-.025em;text-align:left;}\n#homehub-widgets .hhw-city > span {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\n#homehub-widgets .hhw-city svg {width:15px;height:15px;flex-shrink:0;}\n#homehub-widgets .hhw-weather-top .hhw-refresh {position:absolute;top:auto;right:0;transform:translateY(27px);display:grid;place-items:center;width:22px;height:22px;padding:4px!important;border-radius:50%;opacity:0;background:rgba(255,255,255,.1);}\n#homehub-widgets .hhw-weather:hover .hhw-refresh,#homehub-widgets .hhw-refresh:focus-visible,#homehub-widgets .hhw-weather[aria-busy=\"true\"] .hhw-refresh {opacity:.8;}\n#homehub-widgets .hhw-refresh svg {width:14px;height:14px;}\n#homehub-widgets .hhw-now {position:static;display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:0;margin:0;}\n#homehub-widgets .hhw-current {min-width:0;}\n#homehub-widgets .hhw-temperature {font-size:clamp(44px,14cqw,76px);font-weight:220;line-height:1;letter-spacing:-4px;}\n#homehub-widgets .hhw-current-sky {display:flex;flex-direction:column;align-items:flex-end;min-width:0;margin:0;padding-top:21px;max-width:57%;}\n#homehub-widgets .hhw-current-sky > .hhw-weather-icon {position:absolute;top:17px;right:23px;width:42px;height:42px;}\n#homehub-widgets .hhw-condition {font-size:20px;font-weight:500;line-height:1.15;text-align:right;letter-spacing:-.025em;}\n#homehub-widgets .hhw-weather-icon {display:block;flex-shrink:0;}\n#homehub-widgets .hhw-hours {display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;padding:3px 0 0;border:0;}\n#homehub-widgets .hhw-hour {display:flex;flex-direction:column;align-items:center;gap:5px;min-width:0;}\n#homehub-widgets .hhw-hour-label {font-size:14px;font-weight:550;opacity:.66;}\n#homehub-widgets .hhw-hour .hhw-weather-icon {width:32px;height:32px;}\n#homehub-widgets .hhw-hour b {font-size:19px;font-weight:600;line-height:1.15;letter-spacing:-.035em;}\n#homehub-widgets .hhw-weather-footer {display:flex;justify-content:space-between;gap:10px;margin-top:2px;font-size:8px;line-height:1.2;opacity:.6;}\n#homehub-widgets .hhw-weather-footer a {color:inherit;text-decoration:none;}\n#homehub-widgets .hhw-weather-footer a:hover {text-decoration:underline;}\n#homehub-widgets .hhw-weather-setup {grid-row:2/-1;display:flex;align-items:center;justify-content:center;gap:20px;min-height:0;}\n#homehub-widgets .hhw-weather-setup > .hhw-weather-icon {width:70px;height:70px;}\n#homehub-widgets .hhw-weather-setup h3 {margin:0 0 6px;font-size:20px;font-weight:550;letter-spacing:-.03em;}\n#homehub-widgets .hhw-weather-setup p {font-size:11px;line-height:1.5;max-width:240px;margin:0;opacity:.8;}\n#homehub-widgets .hhw-choose-city {display:inline-block;margin-top:12px;padding:8px 12px;border:1px solid rgba(255,255,255,.25);border-radius:11px;font-size:11px;font-weight:550;background:rgba(255,255,255,.13);}\n#homehub-widgets .hhw-weather-error {font-size:10px;opacity:.85;margin:0 0 3px;}\n\n#homehub-weather-dialog {width:min(430px,calc(100vw - 32px));max-height:calc(100vh - 48px);padding:28px;border:1px solid var(--hh-line,rgba(255,255,255,.5));border-radius:27px;background:rgba(247,249,253,.96);color:var(--hh-ink,#202938);font-family:var(--hh-font,sans-serif);box-shadow:0 30px 100px rgba(14,32,63,.2);backdrop-filter:blur(30px);}\nhtml[data-homehub-theme=\"dark\"] #homehub-weather-dialog {background:rgba(30,42,64,.97);}\n#homehub-weather-dialog::backdrop {background:rgba(19,34,56,.25);backdrop-filter:blur(8px);}\n#homehub-weather-dialog h2 {margin:0 30px 7px 0;font-size:23px;font-weight:650;line-height:1.15;letter-spacing:-.04em;}\n#homehub-weather-dialog .hhw-city-intro {margin:0 0 22px;font-size:12px;line-height:1.5;color:var(--hh-muted);}\n#homehub-weather-dialog .hhw-dialog-close {position:absolute;top:14px;right:14px;display:grid;place-items:center;width:28px;height:28px;padding:0;border:0;border-radius:50%;background:rgba(126,142,166,.1);color:var(--hh-muted);font-size:22px;line-height:1;cursor:pointer;}\n#homehub-weather-dialog label {display:block;font-size:11px;font-weight:600;margin-bottom:7px;}\n#homehub-weather-dialog .hhw-search-row {display:flex;gap:8px;}\n#homehub-weather-dialog input {min-width:0;flex:1;padding:11px 12px;border:1px solid rgba(133,151,177,.25);border-radius:12px;background:rgba(255,255,255,.25);color:inherit;font-size:13px;}\n#homehub-weather-dialog .hhw-primary {padding:10px 15px;border:0;border-radius:12px;background:#1384f6;color:#fff;font-size:12px;font-weight:600;cursor:pointer;}\n#homehub-weather-dialog .hhw-primary:disabled {opacity:.5;cursor:default;}\n#homehub-weather-dialog .hhw-search-status {font-size:11px;line-height:1.5;color:var(--hh-muted);margin:13px 0 8px;min-height:16px;}\n#homehub-weather-dialog .hhw-city-results {display:flex;flex-direction:column;gap:4px;}\n#homehub-weather-dialog .hhw-city-result {display:flex;flex-direction:column;gap:4px;padding:11px 12px;text-align:left;border:0;border-radius:12px;background:rgba(130,151,180,.06);color:inherit;cursor:pointer;}\n#homehub-weather-dialog .hhw-city-result:hover {background:rgba(100,150,220,.13);}\n#homehub-weather-dialog .hhw-city-result strong {font-size:13px;font-weight:600;}\n#homehub-weather-dialog .hhw-city-result span {font-size:10px;color:var(--hh-muted);}\n#homehub-weather-dialog .hhw-city-attribution {font-size:9px;line-height:1.4;color:var(--hh-faint);margin:20px 0 0;}\n#homehub-weather-dialog .hhw-city-attribution a {color:inherit;}\n\n#homehub-widgets .hhw-calendar {display:flex;flex-direction:column;padding:16px 16px 12px;background:var(--hh-card);backdrop-filter:blur(24px) saturate(160%);}\n#homehub-widgets .hhw-calendar-header {display:flex;align-items:center;justify-content:space-between;gap:5px;margin-bottom:9px;}\n#homehub-widgets .hhw-calendar-month {min-width:0;padding:0;font-size:15px;font-weight:650;letter-spacing:-.03em;line-height:1.3;color:#ed675e;text-transform:capitalize;white-space:nowrap;}\n#homehub-widgets .hhw-calendar-actions {display:flex;gap:3px;flex-shrink:0;}\n#homehub-widgets .hhw-calendar-arrow {display:grid;place-items:center;width:21px;height:24px;padding:2px;border-radius:8px;color:var(--hh-muted);}\n#homehub-widgets .hhw-calendar-arrow:hover {background:rgba(128,145,169,.10);}\n#homehub-widgets .hhw-calendar-arrow svg {width:13px;height:13px;}\n#homehub-widgets .hhw-calendar-prev svg {transform:rotate(90deg);}\n#homehub-widgets .hhw-calendar-next svg {transform:rotate(-90deg);}\n#homehub-widgets .hhw-calendar-grid {display:grid;grid-template-columns:repeat(7,minmax(0,1fr));flex:1;min-height:0;grid-template-rows:17px repeat(6,minmax(0,1fr));gap:1px 0;text-align:center;align-items:center;}\n#homehub-widgets .hhw-calendar-weekday {font-size:9px;font-weight:600;color:var(--hh-faint);height:17px;}\n#homehub-widgets .hhw-calendar-day {display:block;width:22px;height:22px;line-height:22px;margin:auto;border-radius:50%;font-size:11px;font-weight:500;font-variant-numeric:tabular-nums;}\n#homehub-widgets .hhw-calendar-day.is-outside {opacity:.3;}\n#homehub-widgets .hhw-calendar-day.is-today {background:#f36960;color:white;opacity:1;font-weight:650;box-shadow:0 2px 7px rgba(227,87,78,.15);}\n#homehub-widgets .hhw-calendar-footer {padding-top:8px;margin-top:6px;border-top:1px solid color-mix(in srgb,var(--hh-muted) 12%,transparent);font-size:9px;line-height:1.3;color:var(--hh-muted);}\n@media(max-width:900px) {\n  #homehub-widgets .hhw-clock {grid-column:1;grid-row:1;}\n  #homehub-widgets .hhw-calendar {grid-column:2;grid-row:1;}\n}\n@media(max-width:760px) {\n  html[data-homehub-active] #homehub-widgets {gap:11px;}\n  #homehub-widgets .hhw-clock {padding:10px;gap:5px;}\n  #homehub-widgets .hhw-clock-face {width:82%;}\n  #homehub-widgets .hhw-clock-caption {font-size:8px;gap:5px;}\n  #homehub-widgets .hhw-clock-digital {font-size:10px;}\n  #homehub-widgets .hhw-calendar {padding:10px 8px 8px;}\n  #homehub-widgets .hhw-calendar-month {font-size:10px;}\n  #homehub-widgets .hhw-calendar-header {gap:0;margin-bottom:3px;}\n  #homehub-widgets .hhw-calendar-actions {gap:0;}\n  #homehub-widgets .hhw-calendar-arrow {width:16px;height:18px;padding:1px;}\n  #homehub-widgets .hhw-calendar-grid {grid-template-rows:12px repeat(6,minmax(0,1fr));gap:0;}\n  #homehub-widgets .hhw-calendar-weekday {font-size:8px;height:12px;}\n  #homehub-widgets .hhw-calendar-day {width:17px;height:17px;line-height:17px;font-size:9px;}\n  #homehub-widgets .hhw-calendar-footer {font-size:7px;margin-top:3px;padding-top:4px;}\n}\n@media(prefers-reduced-motion:reduce) {\n  #homehub-widgets .hhw-clock::before {opacity:0!important;transition:none!important;}\n}\n/* Intrinsic weather text must not stretch the square tracks. */\n#homehub-widgets .hhw-clock,#homehub-widgets .hhw-calendar {width:100%;align-self:start;}\n@media(max-width:900px) {\n  html[data-homehub-active] #homehub-widgets {grid-template-rows:repeat(2,minmax(0,1fr));}\n}\n\n@media(max-width:380px) {\n  #homehub-widgets .hhw-calendar-day {width:13px;height:13px;line-height:13px;font-size:8px;}\n  #homehub-widgets .hhw-calendar-footer {display:none;}\n  #homehub-widgets .hhw-calendar-month {font-size:9px;}\n  #homehub-widgets .hhw-calendar-arrow {width:13px;}\n}\n\n@media(max-width:900px) {\n  #homehub-widgets .hhw-weather {grid-column:1/-1;grid-row:2;}\n}\n@media(max-width:760px) {\n  #homehub-widgets .hhw-weather {padding:11px 14px 8px;gap:3px;}\n  #homehub-widgets .hhw-city {font-size:16px;}\n  #homehub-widgets .hhw-city svg {width:12px;height:12px;}\n  #homehub-widgets .hhw-temperature {font-size:clamp(36px,14cqw,54px);letter-spacing:-2px;}\n  #homehub-widgets .hhw-condition {font-size:14px;}\n  #homehub-widgets .hhw-current-sky {padding-top:12px;}\n  #homehub-widgets .hhw-current-sky > .hhw-weather-icon {width:30px;height:30px;top:10px;right:14px;}\n  #homehub-widgets .hhw-hour-label {font-size:10px;}\n  #homehub-widgets .hhw-hour .hhw-weather-icon {width:23px;height:23px;}\n  #homehub-widgets .hhw-hour b {font-size:14px;}\n  #homehub-widgets .hhw-hour {gap:2px;}\n  #homehub-widgets .hhw-hours {padding-top:1px;gap:3px;}\n  #homehub-widgets .hhw-weather-footer {font-size:7px;margin-top:1px;}\n  #homehub-widgets .hhw-weather-setup {gap:12px;}\n  #homehub-widgets .hhw-weather-setup > .hhw-weather-icon {width:50px;height:50px;}\n  #homehub-widgets .hhw-weather-setup h3 {font-size:16px;}\n  #homehub-widgets .hhw-weather-setup p {font-size:10px;}\n  #homehub-widgets .hhw-choose-city {margin-top:6px;}\n}\n@media(pointer:coarse) {\n  #homehub-widgets .hhw-weather-top .hhw-refresh {opacity:.5;transform:translateY(22px);}\n}\n@media(max-width:380px) {\n  #homehub-widgets .hhw-weather {padding:8px 11px 6px;gap:2px;}\n  #homehub-widgets .hhw-city {font-size:13px;}\n  #homehub-widgets .hhw-temperature {font-size:36px;}\n  #homehub-widgets .hhw-condition {font-size:12px;}\n  #homehub-widgets .hhw-hour .hhw-weather-icon {width:18px;height:18px;}\n  #homehub-widgets .hhw-hour-label {font-size:9px;}\n  #homehub-widgets .hhw-hour b {font-size:12px;}\n}\n\n/* Widgets share the same night palette as the accessories. */\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-clock,\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-calendar {\n  background:linear-gradient(145deg,rgba(42,48,62,.96),rgba(28,33,43,.96));\n  border-color:var(--hh-line);box-shadow:inset 0 1px 0 var(--hh-rim),var(--hh-shadow);color:var(--hh-ink);\n}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-clock-tick {stroke:#4f596d;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-clock-tick-major {stroke:#8893a9;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-clock-number {fill:#c2c9da;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-hand-hour,\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-hand-minute {stroke:#f1f3fa;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-hand-second {stroke:#eea49c;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-clock-caption {color:#a8b3c9;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-clock-digital {color:#e0e5f2;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-calendar-month {color:#ffa095;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-calendar-day.is-today {background:#e6a198;color:#241e20;box-shadow:none;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-calendar-day.is-outside {opacity:.4;}\nhtml[data-homehub-theme=\"dark\"] #homehub-widgets .hhw-weather {border-color:rgba(187,205,233,.2);box-shadow:inset 0 1px 0 rgba(225,235,255,.09),var(--hh-shadow);}\nhtml[data-homehub-theme=\"dark\"] #homehub-weather-dialog {background:#202631;border-color:var(--hh-line);box-shadow:0 28px 90px rgba(0,0,0,.5);}\nhtml[data-homehub-theme=\"dark\"] #homehub-weather-dialog input {background:#171d27;border-color:#4c5c74;}\nhtml[data-homehub-theme=\"dark\"] #homehub-weather-dialog .hhw-city-result {background:rgba(146,167,197,.06);}\nhtml[data-homehub-theme=\"dark\"] #homehub-weather-dialog .hhw-city-result:hover {background:rgba(146,177,223,.14);}\n\n#homehub-ambient {\n  position:fixed;inset:0;box-sizing:border-box;width:100vw;height:100dvh;\n  max-width:none;max-height:none;margin:0;padding:0;border:0;overflow:hidden;\n  background:linear-gradient(145deg,rgba(9,17,34,.38),rgba(14,27,52,.48));\n  color:#fff;font-family:var(--hh-font,-apple-system,BlinkMacSystemFont,sans-serif);\n  backdrop-filter:blur(48px) saturate(155%);\n}\n#homehub-ambient[open] {display:flex;align-items:center;justify-content:center;}\n#homehub-ambient::backdrop {background:rgba(7,14,28,.18);}\n#homehub-ambient::before {\n  content:\"\";position:absolute;inset:-10%;pointer-events:none;\n  background:radial-gradient(ellipse at 18% 22%,rgba(156,121,191,.14),transparent 50%),radial-gradient(ellipse at 80% 74%,rgba(99,154,213,.14),transparent 50%);\n}\n#homehub-ambient .hh-ambient-core {position:relative;display:flex;flex-direction:column;align-items:center;max-width:calc(100% - 40px);padding-bottom:25px;text-align:center;}\n#homehub-ambient .hh-ambient-time {font-size:clamp(96px,15vw,196px);font-weight:200;letter-spacing:-.065em;line-height:1.05;font-variant-numeric:tabular-nums;text-shadow:0 5px 45px rgba(0,0,0,.06);}\n#homehub-ambient .hh-ambient-date {margin-top:20px;font-size:clamp(17px,2.3vw,28px);font-weight:450;line-height:1.4;letter-spacing:-.02em;opacity:.91;}\n#homehub-ambient .hh-ambient-weather {display:flex;align-items:center;justify-content:center;gap:10px;margin-top:24px;font-size:clamp(16px,1.8vw,23px);font-weight:450;line-height:1.4;opacity:.85;}\n#homehub-ambient .hhw-weather-icon {display:block;width:38px;height:38px;flex-shrink:0;}\n#homehub-ambient .hh-ambient-location {font-size:12px;font-weight:450;margin-top:4px;line-height:1.5;opacity:.5;}\n#homehub-ambient .hh-ambient-hint {position:absolute;bottom:38px;left:20px;right:20px;text-align:center;font-size:11px;line-height:1.5;letter-spacing:.015em;opacity:.42;}\n#homehub-ambient .hh-ambient-exit {position:absolute;z-index:2;right:30px;top:26px;display:grid;place-items:center;box-sizing:border-box;width:40px;height:40px;padding:0;border:1px solid rgba(255,255,255,.18);border-radius:50%;background:rgba(255,255,255,.08);color:rgba(255,255,255,.8);font:300 28px/1 var(--hh-font,sans-serif);cursor:pointer;}\n#homehub-ambient .hh-ambient-exit:focus-visible {outline:2px solid #fff;outline-offset:4px;}\n@media(max-width:760px) {\n  #homehub-ambient .hh-ambient-core {padding-bottom:20px;}\n  #homehub-ambient .hh-ambient-date {margin-top:16px;max-width:300px;}\n  #homehub-ambient .hh-ambient-weather {margin-top:20px;gap:7px;}\n  #homehub-ambient .hhw-weather-icon {width:30px;height:30px;}\n  #homehub-ambient .hh-ambient-hint {font-size:10px;bottom:30px;}\n}\n\n/* Safari/iOS: preserve glass and keep controls clear of the screen edges. */\nhtml[data-homehub-active] #homehub-ui .hh-dock {\n  bottom:calc(24px + env(safe-area-inset-bottom,0px));\n  -webkit-backdrop-filter:blur(36px) saturate(185%);\n}\nhtml[data-homehub-active] ghw-devices [data-homehub-card],\n#homehub-widgets .hhw-calendar {\n  -webkit-backdrop-filter:blur(24px) saturate(170%);\n}\n#homehub-ambient[open] {-webkit-backdrop-filter:blur(48px) saturate(155%);}\n#homehub-ambient .hh-ambient-exit {\n  top:calc(24px + env(safe-area-inset-top,0px));\n  right:calc(24px + env(safe-area-inset-right,0px));\n}\n#homehub-ambient .hh-ambient-hint {bottom:calc(38px + env(safe-area-inset-bottom,0px));}\nhtml[data-homehub-active] ghw-devices .spaces-container {\n  padding-bottom:calc(136px + env(safe-area-inset-bottom,0px))!important;\n}\n@media(max-width:760px) {\n  html[data-homehub-active] #homehub-ui .hh-dock {bottom:calc(18px + env(safe-area-inset-bottom,0px));}\n  html[data-homehub-active] ghw-devices .spaces-container {padding-bottom:calc(124px + env(safe-area-inset-bottom,0px))!important;}\n}\n@media(pointer:coarse) {\n  html[data-homehub-active] ghw-devices .expand-button-container {\n    width:44px!important;height:44px!important;top:2px!important;right:2px!important;\n  }\n  html[data-homehub-active] ghw-devices .expand-button-container button {width:44px!important;height:44px!important;}\n  html[data-homehub-active] ghw-devices [data-homehub-group=\"true\"] .homehub-room-label {right:50px!important;}\n}\n/* WebKit needs an explicit inline size for aspect-ratio grid items behind display:contents. */\nhtml[data-homehub-active] ghw-devices .spaces-container ghw-device-tile {width:100%!important;}\nhtml[data-homehub-active] ghw-devices .devices-container > mat-sidenav-content {scrollbar-gutter:stable;}\n#homehub-widgets .hhw-weather {height:auto;align-self:stretch;}\n/* Independent tracks avoid stale subgrid row heights when rotating/resizing Safari. */\nhtml[data-homehub-active] #homehub-widgets {grid-template-columns:repeat(4,minmax(0,1fr));}\n@media(max-width:900px) {\n  html[data-homehub-active] #homehub-widgets {grid-template-columns:repeat(2,minmax(0,1fr));}\n}\nhtml[data-homehub-active] ghw-devices .spaces-container {container-type:inline-size;}\nhtml[data-homehub-active] #homehub-widgets {\n  height:calc((100cqw - 42px)/4);\n  grid-template-rows:minmax(0,1fr);\n}\n@media(max-width:900px) {\n  html[data-homehub-active] #homehub-widgets {height:100cqw;grid-template-rows:repeat(2,minmax(0,1fr));}\n}\n\n/* Android-only layout. CSS pixels follow the browser viewport, not the panel's physical resolution. */\nhtml[data-homehub-android][data-homehub-active] {\n  --hh-a-top:env(safe-area-inset-top,0px);--hh-a-bottom:env(safe-area-inset-bottom,0px);\n}\nhtml[data-homehub-android][data-homehub-active] ghw-devices .devices-container > mat-sidenav-content {overscroll-behavior-y:contain;scroll-padding-bottom:110px;}\nhtml[data-homehub-android][data-homehub-active] #homehub-ui .hh-header {display:flex;gap:8px;}\nhtml[data-homehub-android] #homehub-ui .hh-tools-toggle,\nhtml[data-homehub-android] #homehub-ui .hh-fullscreen-toggle {width:48px;height:48px;flex:0 0 48px;touch-action:manipulation;}\nhtml[data-homehub-android][data-homehub-summary=\"collapsed\"] #homehub-widgets {display:none!important;}\nhtml[data-homehub-android][data-homehub-active][data-homehub-theme=\"dark\"] ghw-devices [data-homehub-card]:not(.active) {background:#222833!important;}\nhtml[data-homehub-android][data-homehub-active][data-homehub-theme=\"light\"] ghw-devices [data-homehub-card]:not(.active) {background:#f6f7fb!important;}\nhtml[data-homehub-android][data-homehub-active] ghw-devices [data-homehub-card] {backdrop-filter:none;-webkit-backdrop-filter:none;}\nhtml[data-homehub-android] #homehub-ui button {touch-action:manipulation;}\nhtml[data-homehub-android] #homehub-phone-tools {\n  width:min(420px,calc(100vw - 24px));max-height:calc(100dvh - 32px - env(safe-area-inset-bottom,0px));\n  margin:auto auto calc(12px + env(safe-area-inset-bottom,0px));padding:18px;\n  border:1px solid var(--hh-line);border-radius:28px;background:#f4f6fc;color:var(--hh-ink);\n  font-family:var(--hh-font);box-shadow:0 24px 80px #0005;overflow:auto;overscroll-behavior:contain;\n}\nhtml[data-homehub-android][data-homehub-theme=\"dark\"] #homehub-phone-tools {background:#202631;}\nhtml[data-homehub-android] #homehub-phone-tools::backdrop {background:#11182780;backdrop-filter:blur(8px);}\nhtml[data-homehub-android] #homehub-phone-tools .hh-phone-tools-heading {display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}\nhtml[data-homehub-android] #homehub-phone-tools h2 {font-size:19px;font-weight:650;letter-spacing:-.03em;margin:0;}\nhtml[data-homehub-android] #homehub-phone-tools .hh-phone-close {width:48px;height:48px;border-radius:50%;font-size:26px;color:var(--hh-muted);}\nhtml[data-homehub-android] #homehub-phone-tools .hh-phone-action {\n  display:flex!important;align-items:center;justify-content:flex-start;gap:14px;\n  width:100%!important;height:54px!important;min-height:54px;flex:none;padding:0 14px!important;margin:5px 0;\n  border-radius:16px!important;border:1px solid var(--hh-line);background:var(--hh-chip);color:var(--hh-ink);text-align:left;\n  font-size:14px;font-weight:550;box-shadow:none;\n}\nhtml[data-homehub-android] #homehub-phone-tools .hh-phone-action > svg {width:22px;height:22px;flex-shrink:0;}\nhtml[data-homehub-android] #homehub-phone-tools :focus-visible {outline:3px solid var(--hh-accent);outline-offset:2px;}\nhtml[data-homehub-android] #homehub-weather-dialog {border-radius:26px;width:min(430px,calc(100vw - 24px));max-height:calc(100dvh - 32px - env(safe-area-inset-bottom,0px));padding:24px;}\nhtml[data-homehub-android] #homehub-weather-dialog input {font-size:16px;min-height:48px;}\nhtml[data-homehub-android] #homehub-weather-dialog .hhw-primary {min-height:48px;}\nhtml[data-homehub-android] #homehub-weather-dialog .hhw-dialog-close {width:44px;height:44px;top:8px;right:8px;}\nhtml[data-homehub-android] #homehub-weather-dialog .hhw-city-result {min-height:60px;}\n\n@media(max-width:600px) {\n  html[data-homehub-android] #homehub-ui .hh-header {left:16px;right:16px;top:calc(10px + var(--hh-a-top,0px));max-width:520px;}\n  html[data-homehub-android] #homehub-ui .hh-home-name {font-size:11px;max-width:145px;}\n  html[data-homehub-android] #homehub-ui h1 {font-size:27px;line-height:1.1;margin:4px 0;}\n  html[data-homehub-android] #homehub-ui .hh-summary {font-size:11px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\n  html[data-homehub-android] #homehub-ui .hh-categories {left:16px;right:16px;top:calc(84px + var(--hh-a-top,0px));gap:7px;}\n  html[data-homehub-android] #homehub-ui .hh-chip {min-height:44px;padding:9px 12px;font-size:12px;}\n  html[data-homehub-android][data-homehub-active] ghw-devices {inset:calc(138px + var(--hh-a-top,0px)) 12px 0!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices .spaces-container {gap:10px!important;max-width:530px!important;padding:0 2px calc(106px + var(--hh-a-bottom,0px))!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices .spaces-container ghw-device-tile,\n  html[data-homehub-android][data-homehub-active] ghw-devices ghw-device-tile:has(> .expanded-group > *) > .device-tile,\n  html[data-homehub-android][data-homehub-active] ghw-devices .expanded-group .group-child {height:138px!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices .spaces-container ghw-device-tile:has(> .expanded-group > *) {height:auto!important;gap:10px!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices [data-homehub-card] {border-radius:22px!important;padding:13px!important;gap:8px!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices [data-homehub-card] .icon {width:46px!important;height:46px!important;flex-basis:46px!important;}\n  html[data-homehub-android][data-homehub-active] .homehub-symbol {width:30px!important;height:30px!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices [data-homehub-card] .content .title {font-size:14px!important;line-height:1.2!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices [data-homehub-card] .content .subtitle,\n  html[data-homehub-android][data-homehub-active] ghw-devices [data-homehub-card] .content > span {font-size:12px!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices .homehub-room-label {top:14px!important;right:12px!important;font-size:10px!important;}\n  html[data-homehub-android][data-homehub-active] #homehub-widgets {height:auto!important;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto 164px;gap:10px;margin-bottom:2px;}\n  html[data-homehub-android] #homehub-widgets .hhw-clock,\n  html[data-homehub-android] #homehub-widgets .hhw-calendar {grid-row:1;height:auto;aspect-ratio:1;border-radius:24px;padding:9px;}\n  html[data-homehub-android] #homehub-widgets .hhw-clock {gap:3px;}\n  html[data-homehub-android] #homehub-widgets .hhw-clock-face {width:86%;max-width:128px;}\n  html[data-homehub-android] #homehub-widgets .hhw-clock-caption {font-size:9px;width:100%;gap:5px;}\n  html[data-homehub-android] #homehub-widgets .hhw-clock-digital {font-size:12px;}\n  html[data-homehub-android] #homehub-widgets .hhw-calendar-header {min-height:28px;margin-bottom:3px;gap:2px;}\n  html[data-homehub-android] #homehub-widgets .hhw-calendar-month {font-size:11px;white-space:normal;text-align:left;line-height:1.15;}\n  html[data-homehub-android] #homehub-widgets .hhw-calendar-arrow {width:28px;height:28px;}\n  html[data-homehub-android] #homehub-widgets .hhw-calendar-day {width:18px;height:18px;line-height:18px;font-size:10.5px;}\n  html[data-homehub-android] #homehub-widgets .hhw-calendar-footer {display:none;}\n  html[data-homehub-android] #homehub-widgets .hhw-weather {grid-row:2;grid-column:1/-1;height:164px;min-height:0;aspect-ratio:auto;padding:11px 15px 8px;gap:3px;border-radius:24px;}\n  html[data-homehub-android] #homehub-widgets .hhw-city {font-size:17px;max-width:calc(100% - 110px);}\n  html[data-homehub-android] #homehub-widgets .hhw-temperature {font-size:44px;}\n  html[data-homehub-android] #homehub-widgets .hhw-condition {font-size:14px;}\n  html[data-homehub-android] #homehub-widgets .hhw-hour-label {font-size:10px;}\n  html[data-homehub-android] #homehub-widgets .hhw-hour b {font-size:15px;}\n  html[data-homehub-android] #homehub-widgets .hhw-hour .hhw-weather-icon {width:24px;height:24px;}\n  html[data-homehub-android] #homehub-widgets .hhw-weather-top .hhw-refresh {width:44px;height:44px;top:-8px;right:36px;transform:none;background:none;opacity:.65;}\n  html[data-homehub-android] #homehub-ui .hh-dock {bottom:calc(10px + var(--hh-a-bottom,0px));max-width:calc(100vw - 16px);border-radius:29px;padding:6px;gap:3px;}\n  html[data-homehub-android] #homehub-ui .hh-nav,\n  html[data-homehub-android] #homehub-ui .hh-dock > .hh-nav {flex-basis:66px;min-width:66px;height:56px;padding:5px;font-size:10px;gap:3px;border-radius:23px;}\n  html[data-homehub-android] #homehub-ui .hh-dock > .hh-nav {flex-basis:60px;min-width:60px;}\n  html[data-homehub-android] #homehub-ui .hh-nav > svg {width:24px;height:24px;}\n  html[data-homehub-android] #homehub-ui .hh-room-icon {width:28px;height:26px;flex-basis:26px;}\n  html[data-homehub-android] #homehub-ui .hh-room-icon svg {width:24px;height:24px;}\n  html[data-homehub-android] #homehub-ui .hh-rooms {scroll-snap-type:x proximity;overscroll-behavior-x:contain;}\n  html[data-homehub-android] #homehub-ui .hh-rooms > * {scroll-snap-align:start;}\n  html[data-homehub-android] #homehub-ui .hh-original {width:44px;height:48px;}\n  html[data-homehub-android][data-homehub-dock=\"compact\"] #homehub-ui .hh-nav {flex-basis:48px;min-width:48px;height:48px;}\n}\n@media(orientation:landscape) and (max-height:500px) and (min-width:601px) {\n  html[data-homehub-android] #homehub-ui .hh-header {left:max(18px,env(safe-area-inset-left,0px));right:max(18px,env(safe-area-inset-right,0px));top:calc(6px + var(--hh-a-top,0px));max-width:1066px;}\n  html[data-homehub-android] #homehub-ui .hh-eyebrow {display:none;}\n  html[data-homehub-android] #homehub-ui h1 {font-size:23px;margin:0 0 4px;}\n  html[data-homehub-android] #homehub-ui .hh-summary {font-size:11px;}\n  html[data-homehub-android] #homehub-ui .hh-categories {left:18px;right:18px;top:calc(61px + var(--hh-a-top,0px));max-width:1066px;}\n  html[data-homehub-android] #homehub-ui .hh-chip {min-height:40px;padding:8px 12px;}\n  html[data-homehub-android][data-homehub-active] ghw-devices {inset:calc(110px + var(--hh-a-top,0px)) max(12px,env(safe-area-inset-right,0px)) 0 max(12px,env(safe-area-inset-left,0px))!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices .spaces-container {max-width:1073px!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:10px!important;padding-bottom:calc(92px + var(--hh-a-bottom,0px))!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices .spaces-container ghw-device-tile,\n  html[data-homehub-android][data-homehub-active] ghw-devices ghw-device-tile:has(> .expanded-group > *) > .device-tile,\n  html[data-homehub-android][data-homehub-active] ghw-devices .expanded-group .group-child {height:132px!important;}\n  html[data-homehub-android][data-homehub-active] ghw-devices .spaces-container ghw-device-tile:has(> .expanded-group > *) {height:auto!important;gap:10px!important;}\n  html[data-homehub-android][data-homehub-active] #homehub-widgets {grid-template-columns:repeat(4,minmax(0,1fr));grid-template-rows:minmax(0,1fr);gap:10px;height:calc((100cqw - 30px)/4);}\n  html[data-homehub-android] #homehub-widgets .hhw-clock {grid-column:1;grid-row:1;}\n  html[data-homehub-android] #homehub-widgets .hhw-weather {grid-column:2/4;grid-row:1;}\n  html[data-homehub-android] #homehub-widgets .hhw-calendar {grid-column:4;grid-row:1;}\n  html[data-homehub-android] #homehub-ui .hh-dock {bottom:calc(6px + var(--hh-a-bottom,0px));padding:5px;border-radius:26px;}\n  html[data-homehub-android] #homehub-ui .hh-nav,\n  html[data-homehub-android] #homehub-ui .hh-dock > .hh-nav {flex-basis:72px;min-width:72px;height:48px;padding:4px;font-size:10px;gap:2px;}\n  html[data-homehub-android] #homehub-ui .hh-room-icon {height:22px;flex-basis:22px;}\n  html[data-homehub-android] #homehub-ui .hh-room-icon svg {width:23px;height:23px;}\n  html[data-homehub-android] #homehub-ui .hh-original {width:44px;height:44px;}\n}\n");
globalThis.__homeHubUserscriptLoaded=true;
// Android presentation controls; real Google device controls stay in their original DOM.
const homeHubPhonePreferences=await GM.getValue('homehub.android.preferences',{});
try{
  for(const [key,allowed] of Object.entries({theme:['light','dark'],dock:['expanded','compact']})){
    if(!sessionStorage.getItem('homehub.'+key)&&allowed.includes(homeHubPhonePreferences?.[key])){
      sessionStorage.setItem('homehub.'+key,homeHubPhonePreferences[key]);
    }
  }
}catch(_){}
document.documentElement.setAttribute('data-homehub-android','');
function homeHubStartPhoneUi(){
  const root=document.documentElement;
  const shortLandscape=matchMedia('(orientation:landscape) and (max-height:500px) and (min-width:601px)');
  let summary=['expanded','collapsed'].includes(homeHubPhonePreferences?.summary)?homeHubPhonePreferences.summary:'auto';
  let ui,dialog,menu,summaryButton,frame=0,lastSaved='';
  const ns='http://www.w3.org/2000/svg';
  function svg(path){
    const image=document.createElementNS(ns,'svg');image.setAttribute('viewBox','0 0 24 24');image.setAttribute('aria-hidden','true');
    const drawing=document.createElementNS(ns,'path');drawing.setAttribute('d',path);drawing.setAttribute('fill','none');
    drawing.setAttribute('stroke','currentColor');drawing.setAttribute('stroke-width','1.8');drawing.setAttribute('stroke-linecap','round');drawing.setAttribute('stroke-linejoin','round');image.append(drawing);return image;
  }
  function label(button,text){
    let span=button.querySelector(':scope > .hh-phone-action-label');
    if(!span){span=document.createElement('span');span.className='hh-phone-action-label';button.append(span);}
    if(span.textContent!==text)span.textContent=text;
  }
  function save(){
    const value={theme:root.dataset.homehubTheme,dock:root.dataset.homehubDock,summary};
    const signature=JSON.stringify(value);
    if(signature===lastSaved)return;lastSaved=signature;
    GM.setValue('homehub.android.preferences',value).catch(()=>{});
  }
  function applySummary(){
    const collapsed=summary==='collapsed'||(summary==='auto'&&shortLandscape.matches);
    root.dataset.homehubSummary=collapsed?'collapsed':'expanded';
    if(summaryButton){
      summaryButton.setAttribute('aria-expanded',String(!collapsed));
      label(summaryButton,collapsed?'Mostrar relógio, calendário e Tempo':'Recolher relógio, calendário e Tempo');
    }
  }
  function mount(host){
    ui=host;
    const header=ui.querySelector('.hh-header');if(!header)return;
    dialog=document.createElement('dialog');dialog.id='homehub-phone-tools';dialog.setAttribute('aria-labelledby','homehub-phone-tools-title');
    const heading=document.createElement('div');heading.className='hh-phone-tools-heading';
    const title=document.createElement('h2');title.id='homehub-phone-tools-title';title.textContent='Opções da casa';
    const close=document.createElement('button');close.type='button';close.className='hh-phone-close';close.setAttribute('aria-label','Fechar opções');close.textContent='×';close.addEventListener('click',()=>dialog.close());
    heading.append(title,close);dialog.append(heading);
    summaryButton=document.createElement('button');summaryButton.type='button';summaryButton.className='hh-phone-action hh-summary-toggle';summaryButton.setAttribute('aria-controls','homehub-widgets');
    summaryButton.append(svg('M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'));
    summaryButton.addEventListener('click',()=>{summary=root.dataset.homehubSummary==='collapsed'?'expanded':'collapsed';applySummary();save();});
    dialog.append(summaryButton);ui.append(dialog);
    menu=document.createElement('button');menu.type='button';menu.className='hh-tool-button hh-tools-toggle';menu.setAttribute('aria-label','Opções da casa');menu.setAttribute('aria-haspopup','dialog');menu.setAttribute('aria-controls',dialog.id);
    menu.append(svg('M5 12h.01M12 12h.01M19 12h.01'));menu.addEventListener('click',()=>{applySummary();if(!dialog.open)dialog.showModal();});header.append(menu);
    // Close before the existing action handler runs, especially before opening the ambient dialog.
    dialog.addEventListener('click',event=>{if(event.target.closest('.hh-phone-action'))dialog.close();},true);
    dialog.addEventListener('click',event=>{
      if(event.target!==dialog)return;
      const box=dialog.getBoundingClientRect();
      if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
    });
  }
  function sync(){
    frame=0;
    const host=document.querySelector('#homehub-ui');if(!host)return;
    if(host!==ui||!menu?.isConnected)mount(host);
    if(!dialog)return;
    const overviewLabel=ui.querySelector('.hh-dock > .hh-nav .hh-button-label');
    if(overviewLabel&&overviewLabel.textContent!=='Casa')overviewLabel.textContent='Casa';
    for(const selector of ['.hh-theme','.hh-ambient-toggle','.hh-dock-toggle']){
      const button=ui.querySelector(selector);if(!button)continue;
      button.classList.add('hh-phone-action');
      if(button.parentElement!==dialog)dialog.append(button);
      if(selector==='.hh-theme')label(button,root.dataset.homehubTheme==='dark'?'Usar aparência clara':'Usar aparência escura');
      if(selector==='.hh-dock-toggle')label(button,root.dataset.homehubDock==='compact'?'Mostrar nomes dos cômodos':'Compactar barra de cômodos');
      if(selector==='.hh-ambient-toggle'){
        label(button,'Relógio em tela cheia');
        button.title='Relógio em tela cheia';button.setAttribute('aria-label','Relógio em tela cheia');
      }
    }
    if((host.hidden||!root.hasAttribute('data-homehub-active'))&&dialog.open)dialog.close();
    applySummary();save();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['data-homehub-active','data-homehub-theme','data-homehub-dock','hidden']});
  shortLandscape.addEventListener('change',applySummary);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden||!root.hasAttribute('data-homehub-active'))return;
    schedule();
    // Refresh old weather after a long screen-off interval; never send a device command on wake.
    GM.getValue('homehub.weather.cache').then(cache=>{
      if(cache?.forecast?.fetchedAt&&Date.now()-cache.forecast.fetchedAt>20*60*1000){
        const refresh=document.querySelector('#homehub-widgets .hhw-refresh');
        if(refresh&&!refresh.disabled)refresh.click();
      }
    }).catch(()=>{});
  });
  sync();
}

// Runs only inside the userscript manager's sandbox, never on Google sign-in pages.
let homeHubWeatherListener;
const homeHubUserscriptApi={
  storage:{local:{
    async get(key){return {[key]:await GM.getValue(key)};},
    async set(values){for(const [key,value] of Object.entries(values))await GM.setValue(key,value);}
  }},
  runtime:{
    id:'homehub-userscript',
    onMessage:{addListener(listener){homeHubWeatherListener=listener;}},
    sendMessage(message){
      return new Promise((resolve,reject)=>{
        if(location.origin!=='https://home.google.com'||!homeHubWeatherListener){
          reject(Error('Abra o Google Home para usar o HomeHub.'));return;
        }
        try{
          const accepted=homeHubWeatherListener(message,{id:'homehub-userscript',url:location.href},resolve);
          if(accepted!==true)reject(Error('Consulta não autorizada.'));
        }catch(error){reject(error);}
      });
    }
  }
};
function homeHubUserscriptFetch(input,options={}){
  const url=new URL(String(input));
  if(url.protocol!=='https:'||url.username||url.password||
    !['https://api.open-meteo.com','https://geocoding-api.open-meteo.com'].includes(url.origin)){
    return Promise.reject(Error('Serviço de previsão não autorizado.'));
  }
  return new Promise((resolve,reject)=>{
    let settled=false,request;
    const finish=(error,value)=>{
      if(settled)return;settled=true;
      options.signal?.removeEventListener('abort',abort);
      if(error)reject(error);else resolve(value);
    };
    const abort=()=>{
      request?.abort?.();finish(options.signal.reason||new DOMException('Consulta cancelada.','AbortError'));
    };
    if(options.signal?.aborted){abort();return;}
    options.signal?.addEventListener('abort',abort,{once:true});
    try{
      request=GM.xmlHttpRequest({
        method:'GET',url:url.href,anonymous:true,timeout:12000,responseType:'json',
        onload(response){
          // Do not consume a response redirected outside the fixed weather services.
          if(response.finalUrl){
            try{
              const final=new URL(response.finalUrl);
              if(!['https://api.open-meteo.com','https://geocoding-api.open-meteo.com'].includes(final.origin)){
                finish(Error('Redirecionamento de previsão não autorizado.'));return;
              }
            }catch(error){finish(error);return;}
          }
          finish(null,{ok:response.status>=200&&response.status<300,
            async json(){return typeof response.response==='string'?JSON.parse(response.response):response.response;}});
        },
        onerror(){finish(new TypeError('Falha na conexão com a previsão.'));},
        ontimeout(){finish(new DOMException('Tempo limite da previsão.','TimeoutError'));},
        onabort(){finish(new DOMException('Consulta cancelada.','AbortError'));}
      });
    }catch(error){finish(error);}
  });
}

(()=>{
'use strict';

const extensionApi=homeHubUserscriptApi;
const fetch=homeHubUserscriptFetch;

const WEATHER_KEY='homehub.weather.location';
const CACHE_KEY='homehub.weather.cache';
const CACHE_TTL=20*60*1000;
const pendingForecasts=new Map();

function validLocation(value) {
  if(!value||typeof value.name!=='string'||!value.name.trim()||value.name.length>120||
     !Number.isFinite(value.latitude)||Math.abs(value.latitude)>90||
     !Number.isFinite(value.longitude)||Math.abs(value.longitude)>180)throw Error('Selecione uma cidade válida.');
  return {
    name:value.name.trim(),latitude:value.latitude,longitude:value.longitude,
    region:typeof value.region==='string'?value.region.slice(0,120):'',
    country:typeof value.country==='string'?value.country.slice(0,120):''
  };
}
function locationKey(location) {return `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;}
async function requestJson(url) {
  const response=await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('O serviço de previsão está indisponível. Tente novamente.');
  const body=await response.json();
  if(body.error)throw Error('O serviço não conseguiu processar esta consulta.');
  return body;
}
async function searchCities(query) {
  if(typeof query!=='string'||query.trim().length<2||query.length>100)throw Error('Digite pelo menos duas letras do nome da cidade.');
  const url=new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search=new URLSearchParams({name:query.trim(),count:'6',language:'pt',format:'json'});
  const response=await requestJson(url);
  return (Array.isArray(response.results)?response.results:[]).filter(item=>Number.isFinite(item.latitude)&&Number.isFinite(item.longitude)&&typeof item.name==='string').map(item=>validLocation({
    name:item.name,latitude:item.latitude,longitude:item.longitude,region:item.admin1||'',country:item.country||''
  }));
}
function sanitizeForecast(data) {
  if(!data.current||!Number.isFinite(data.current.temperature_2m)||!Number.isFinite(data.current.time)||!Number.isFinite(data.current.weather_code))throw Error('O serviço retornou dados incompletos.');
  let timeZone=typeof data.timezone==='string'?data.timezone:'UTC';
  try{new Intl.DateTimeFormat('pt-BR',{timeZone}).format();}catch(_){timeZone='UTC';}
  const number=value=>Number.isFinite(value)?value:null;
  const current={
    time:data.current.time,temperature:number(data.current.temperature_2m),
    feelsLike:number(data.current.apparent_temperature),code:data.current.weather_code,
    isDay:data.current.is_day===1,humidity:number(data.current.relative_humidity_2m),wind:number(data.current.wind_speed_10m)
  };
  const hourly=[];
  for(let i=0;i<Math.min(data.hourly?.time?.length||0,160);i++) {
    const time=data.hourly.time[i],temperature=data.hourly.temperature_2m?.[i];
    if(Number.isFinite(time)&&Number.isFinite(temperature))hourly.push({
      time,temperature,code:number(data.hourly.weather_code?.[i]),
      precipitation:number(data.hourly.precipitation_probability?.[i]),isDay:data.hourly.is_day?.[i]===1
    });
  }
  const daily=[];
  for(let i=0;i<Math.min(data.daily?.time?.length||0,5);i++) {
    if(Number.isFinite(data.daily.time[i]))daily.push({
      time:data.daily.time[i],max:number(data.daily.temperature_2m_max?.[i]),
      min:number(data.daily.temperature_2m_min?.[i]),code:number(data.daily.weather_code?.[i])
    });
  }
  return {current,hourly,daily,timeZone,fetchedAt:Date.now(),stale:false};
}
async function forecastFor(location,force=false) {
  const key=locationKey(location);
  const stored=await extensionApi.storage.local.get(CACHE_KEY);
  const cache=stored[CACHE_KEY];
  const matching=cache?.key===key&&cache.forecast?.current&&Number.isFinite(cache.forecast.fetchedAt)?cache.forecast:null;
  const age=matching?Date.now()-matching.fetchedAt:Infinity;
  if(matching&&age>=0&&age<(force?60*1000:CACHE_TTL))return {...matching,stale:false};
  if(pendingForecasts.has(key))return pendingForecasts.get(key);
  const task=(async()=>{
    try {
      const url=new URL('https://api.open-meteo.com/v1/forecast');
      url.search=new URLSearchParams({
        latitude:String(location.latitude),longitude:String(location.longitude),
        current:'temperature_2m,apparent_temperature,is_day,weather_code,relative_humidity_2m,wind_speed_10m',
        hourly:'temperature_2m,precipitation_probability,weather_code,is_day',
        daily:'weather_code,temperature_2m_max,temperature_2m_min',
        timezone:'auto',timeformat:'unixtime',forecast_days:'5',temperature_unit:'celsius',wind_speed_unit:'kmh'
      });
      const forecast=sanitizeForecast(await requestJson(url));
      await extensionApi.storage.local.set({[CACHE_KEY]:{key,forecast}});return forecast;
    } catch(error) {
      if(matching)return {...matching,stale:true};
      throw error;
    }
  })();
  pendingForecasts.set(key,task);
  try{return await task;}finally{pendingForecasts.delete(key);}
}
async function weatherState(force=false) {
  const saved=await extensionApi.storage.local.get(WEATHER_KEY);
  if(!saved[WEATHER_KEY])return {location:null,forecast:null};
  const location=validLocation(saved[WEATHER_KEY]);
  try{return {location,forecast:await forecastFor(location,force)};}
  catch(_){return {location,forecast:null,error:'Não foi possível atualizar o tempo. Verifique sua conexão e tente novamente.'};}
}
async function handleWeather(message) {
  switch(message.action) {
    case 'init':return weatherState();
    case 'refresh':return weatherState(true);
    case 'search':return {locations:await searchCities(message.query)};
    case 'select': {
      const location=validLocation(message.location);
      await extensionApi.storage.local.set({[WEATHER_KEY]:location});return weatherState();
    }
    default:throw Error('Consulta inválida.');
  }
}
extensionApi.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if(message?.namespace!=='homehub-weather'||sender.id!==extensionApi.runtime.id)return false;
  try{if(new URL(sender.url).origin!=='https://home.google.com')return false;}catch(_){return false;}
  handleWeather(message).then(data=>sendResponse({ok:true,data})).catch(error=>sendResponse({
    ok:false,error:error?.name==='TimeoutError'?'A consulta demorou mais que o esperado. Tente novamente.':['TypeError','SyntaxError','AbortError'].includes(error?.name)?'Não foi possível acessar o serviço de previsão. Verifique sua conexão e tente novamente.':error?.message||'Não foi possível consultar o tempo.'
  }));
  return true;
});

})();
(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const REFRESH=20*60*1000;
  const IDLE_DELAY=0;

  function svgNode(tag,attrs={}) {
    const element=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))element.setAttribute(key,value);
    return element;
  }
  function condition(code,isDay=true) {
    if(code===0)return {kind:isDay?'clear':'night',label:isDay?'Céu limpo':'Noite limpa'};
    if(code===1)return {kind:isDay?'clear':'night',label:'Predominantemente limpo'};
    if(code===2)return {kind:'partly',label:'Parcialmente nublado'};
    if(code===3)return {kind:'cloudy',label:'Nublado'};
    if(code===45||code===48)return {kind:'fog',label:'Nevoeiro'};
    if([71,73,75,77,85,86].includes(code))return {kind:'snow',label:'Neve'};
    if(code>=95)return {kind:'storm',label:'Tempestade'};
    if(code>=51&&code<=57)return {kind:'rain',label:'Garoa'};
    if(code>=61&&code<=67)return {kind:'rain',label:'Chuva'};
    if(code>=80&&code<=82)return {kind:'rain',label:'Pancadas de chuva'};
    return {kind:'cloudy',label:'Condição não informada'};
  }
  function weatherIcon(code,isDay=true) {
    const {kind}=condition(code,isDay);
    const svg=svgNode('svg',{viewBox:'0 0 64 64','aria-hidden':'true',class:'hhw-weather-icon'});
    const sun=(cx,cy,r)=>{
      const group=svgNode('g',{fill:'none',stroke:'#ffe28b','stroke-width':'2.6','stroke-linecap':'round'});
      group.append(svgNode('circle',{cx,cy,r,fill:'#ffe28b',stroke:'none'}));
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4;
        group.append(svgNode('line',{x1:cx+Math.cos(a)*(r+4),y1:cy+Math.sin(a)*(r+4),x2:cx+Math.cos(a)*(r+8),y2:cy+Math.sin(a)*(r+8)}));
      }
      svg.append(group);
    };
    if(kind==='clear')sun(32,31,12);
    else if(kind==='night')svg.append(svgNode('path',{d:'M43 44A21 21 0 0 1 22 13a21 21 0 1 0 21 31Z',fill:'#f6f7fa'}));
    else {
      if(kind==='partly'&&isDay)sun(22,22,9);
      if(!isDay&&['partly','rain','storm'].includes(kind))svg.append(svgNode('path',{d:'M32 28A14 14 0 0 1 19 10a14 14 0 1 0 13 18Z',fill:'#f6f7fa'}));
      svg.append(svgNode('path',{d:'M17 44a10 10 0 0 1-1-20 15 15 0 0 1 29-2 11 11 0 1 1 3 22Z',fill:kind==='storm'?'#d9e5f2':'#f1f6fc'}));
      if(kind==='rain')for(const x of [22,33,44])svg.append(svgNode('path',{d:`m${x} 49-3 7`,stroke:'#38d3f4','stroke-width':'2.7','stroke-linecap':'round'}));
      if(kind==='snow')for(const x of [22,33,44])svg.append(svgNode('path',{d:`M${x} 49v8m-3-6 6 4m-6 0 6-4`,stroke:'#d5e8ff','stroke-width':'1.6','stroke-linecap':'round'}));
      if(kind==='storm')svg.append(svgNode('path',{d:'m34 43-8 12h7l-1 7 10-13h-7l2-6Z',fill:'#ffe08a'}));
      if(kind==='fog')svg.append(svgNode('path',{d:'M14 50h36M19 56h26',stroke:'#e1eaf4','stroke-width':'3','stroke-linecap':'round'}));
    }
    return svg;
  }

  function create({node,symbol}) {
    let active=false,clockTimer=0,refreshTimer=0,idleTimer=0,initialized=false,weatherSequence=0,searchSequence=0,lastActivity=Date.now();
    let lastState={location:null,forecast:null},pending=false;
    let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1),calendarToday='';
    const root=node('section',{id:'homehub-widgets','aria-label':'Relógio, tempo e calendário'});
    const clock=node('section',{class:'hhw-clock','aria-label':'Relógio local'});
    const face=svgNode('svg',{viewBox:'0 0 200 200',role:'img',class:'hhw-clock-face'});
    const ticks=svgNode('g');
    for(let i=0;i<60;i++) {
      const major=i%5===0,a=i*Math.PI/30;
      ticks.append(svgNode('line',{
        x1:100+Math.sin(a)*(major?87:91),y1:100-Math.cos(a)*(major?87:91),
        x2:100+Math.sin(a)*96,y2:100-Math.cos(a)*96,
        class:major?'hhw-clock-tick-major':'hhw-clock-tick'
      }));
    }
    face.append(ticks);
    for(let i=1;i<=12;i++){
      const a=i*Math.PI/6,label=svgNode('text',{x:100+Math.sin(a)*74,y:100-Math.cos(a)*74+6,'text-anchor':'middle',class:'hhw-clock-number'});
      label.textContent=String(i);face.append(label);
    }
    const hands={};
    for(const [name,length,width] of [['hour',43,6.5],['minute',65,5],['second',83,1.25]]){
      const group=svgNode('g',{'data-hand':name});
      group.append(svgNode('line',{x1:100,y1:name==='second'?119:106,x2:100,y2:100-length,'stroke-width':width,'stroke-linecap':'round',class:'hhw-hand-'+name}));
      hands[name]=group;face.append(group);
    }
    face.append(svgNode('circle',{cx:100,cy:100,r:4,fill:'#242532'}),svgNode('circle',{cx:100,cy:100,r:2,fill:'#b3a9d0'}));
    const digital=node('span',{class:'hhw-clock-digital'});
    clock.append(face,node('div',{class:'hhw-clock-caption'},[node('span',{},['Hora local']),digital]));
    const weather=node('section',{class:'hhw-weather','aria-label':'Previsão do tempo'});
    const calendar=node('section',{class:'hhw-calendar','aria-label':'Calendário'});
    const previous=node('button',{class:'hhw-calendar-arrow hhw-calendar-prev',type:'button','aria-label':'Mês anterior'},[symbol('chevron')]);
    const next=node('button',{class:'hhw-calendar-arrow hhw-calendar-next',type:'button','aria-label':'Próximo mês'},[symbol('chevron')]);
    const monthLabel=node('button',{class:'hhw-calendar-month',type:'button',title:'Voltar ao mês atual'});
    const calendarDays=node('div',{class:'hhw-calendar-grid',role:'grid','aria-label':'Dias do mês'});
    const calendarFooter=node('div',{class:'hhw-calendar-footer'});
    calendar.append(node('div',{class:'hhw-calendar-header'},[monthLabel,node('div',{class:'hhw-calendar-actions'},[previous,next])]),calendarDays,calendarFooter);
    previous.addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);renderCalendar();});
    next.addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);renderCalendar();});
    monthLabel.addEventListener('click',()=>{const now=new Date();calendarMonth=new Date(now.getFullYear(),now.getMonth(),1);renderCalendar();});
    root.append(clock,weather,calendar);

    const ambient=node('dialog',{id:'homehub-ambient','aria-label':'Protetor de tela: hora, data e tempo'});
    const ambientTime=node('div',{class:'hh-ambient-time'});
    const ambientDate=node('div',{class:'hh-ambient-date'});
    const ambientWeather=node('div',{class:'hh-ambient-weather'});
    const ambientLocation=node('div',{class:'hh-ambient-location'});
    const ambientExit=node('button',{class:'hh-ambient-exit',type:'button','aria-label':'Sair do protetor de tela'},['×']);
    ambient.append(ambientExit,node('div',{class:'hh-ambient-core'},[ambientTime,ambientDate,ambientWeather,ambientLocation]),node('div',{class:'hh-ambient-hint'},['Clique ou pressione uma tecla para voltar']));
    ambient.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();closeAmbient();},true);
    ambient.addEventListener('keydown',event=>{
      if(!event.metaKey&&!event.ctrlKey&&!event.altKey)event.preventDefault();
      event.stopImmediatePropagation();closeAmbient();
    },true);
    ambient.addEventListener('cancel',event=>{event.preventDefault();closeAmbient();});
    ambient.addEventListener('close',()=>{document.documentElement.removeAttribute('data-homehub-ambient');armIdle();});
    document.body.append(ambient);

    const dialog=node('dialog',{id:'homehub-weather-dialog','aria-labelledby':'hhw-location-title'});
    const close=node('button',{class:'hhw-dialog-close',type:'button','aria-label':'Fechar'},['×']);
    close.addEventListener('click',()=>dialog.close());
    const heading=node('h2',{id:'hhw-location-title'},['O tempo na sua cidade']);
    const input=node('input',{id:'hhw-city-input',type:'search',placeholder:'Ex.: São Paulo',autocomplete:'off',required:'',minlength:'2',maxlength:'100'});
    const searchButton=node('button',{class:'hhw-primary',type:'submit'},['Buscar']);
    const form=node('form',{class:'hhw-city-form'},[node('label',{for:'hhw-city-input'},['Buscar cidade']),node('div',{class:'hhw-search-row'},[input,searchButton])]);
    const searchStatus=node('p',{class:'hhw-search-status',role:'status'});
    const results=node('div',{class:'hhw-city-results'});
    const attribution=node('p',{class:'hhw-city-attribution'},[document.createTextNode('Localidades: '),node('a',{href:'https://www.geonames.org/',target:'_blank',rel:'noopener noreferrer'},['GeoNames']),document.createTextNode(' via Open-Meteo')]);
    dialog.append(close,heading,node('p',{class:'hhw-city-intro'},['Escolha a localização para a previsão externa.']),form,searchStatus,results,attribution);
    dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
    document.body.append(dialog);

    function setText(element,value){if(element.textContent!==value)element.textContent=value;}
    function renderCalendar() {
      const now=new Date(),year=calendarMonth.getFullYear(),month=calendarMonth.getMonth();
      calendarToday=`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      setText(monthLabel,new Intl.DateTimeFormat('pt-BR',{month:'long'}).format(calendarMonth)+' '+year);
      calendarDays.replaceChildren();
      const weekdays=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
      for(const name of weekdays)calendarDays.append(node('span',{class:'hhw-calendar-weekday',role:'columnheader','aria-label':name},[name.slice(0,1).toUpperCase()]));
      const firstDay=new Date(year,month,1).getDay();
      for(let i=0;i<42;i++) {
        const day=new Date(year,month,i-firstDay+1),outside=day.getMonth()!==month;
        const isToday=day.getFullYear()===now.getFullYear()&&day.getMonth()===now.getMonth()&&day.getDate()===now.getDate();
        const attrs={class:'hhw-calendar-day'+(outside?' is-outside':'')+(isToday?' is-today':''),role:'gridcell','aria-label':new Intl.DateTimeFormat('pt-BR',{dateStyle:'full'}).format(day),'data-in-month':String(!outside)};
        if(isToday)attrs['aria-current']='date';
        calendarDays.append(node('span',attrs,[String(day.getDate())]));
      }
      setText(calendarFooter,new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(now));
    }
    function armIdle() {
      clearTimeout(idleTimer);
      if(IDLE_DELAY>0&&active&&!document.hidden&&!ambient.open)idleTimer=setTimeout(checkIdle,Math.max(100,IDLE_DELAY-(Date.now()-lastActivity)));
    }
    function hasBlockingOverlay() {
      if(document.querySelector('dialog[open]'))return true;
      return [...document.querySelectorAll('.cdk-overlay-container .cdk-overlay-pane')].some(pane=>{
        if(pane.matches('.mat-mdc-tooltip-panel')||pane.querySelector('[role="tooltip"],.mat-mdc-tooltip'))return false;
        const bounds=pane.getBoundingClientRect();return bounds.width>0&&bounds.height>0;
      });
    }
    function checkIdle() {
      if(!active||document.hidden||ambient.open)return;
      if(Date.now()-lastActivity<IDLE_DELAY){armIdle();return;}
      if(hasBlockingOverlay()){lastActivity=Date.now();armIdle();return;}
      showAmbient();
    }
    function showAmbient() {
      if(!active||document.hidden||ambient.open||hasBlockingOverlay())return;
      clearTimeout(idleTimer);tickClock();renderAmbientWeather();ambient.showModal();
      document.documentElement.setAttribute('data-homehub-ambient','');
    }
    function closeAmbient() {
      document.documentElement.removeAttribute('data-homehub-ambient');
      if(ambient.open){lastActivity=Date.now();ambient.close();armIdle();}
    }
    function renderAmbientWeather() {
      const {location,forecast}=lastState;
      ambientWeather.replaceChildren();
      if(!location){ambientWeather.append(node('span',{},['Configure o Tempo para exibir a temperatura']));setText(ambientLocation,'');return;}
      if(!forecast){ambientWeather.append(node('span',{},['Tempo indisponível']));setText(ambientLocation,location.name);return;}
      const current=forecast.current,description=condition(current.code,current.isDay);
      ambientWeather.append(weatherIcon(current.code,current.isDay),node('span',{},[temp(current.temperature)+' · '+description.label]));
      setText(ambientLocation,location.name+(forecast.stale?' · dados salvos':''));
    }
    function tickClock() {
      clearTimeout(clockTimer);
      if(!active||document.hidden)return;
      const now=new Date(),seconds=now.getSeconds()+now.getMilliseconds()/1000,minutes=now.getMinutes()+seconds/60,hours=now.getHours()%12+minutes/60;
      hands.hour.setAttribute('transform',`rotate(${hours*30} 100 100)`);
      hands.minute.setAttribute('transform',`rotate(${minutes*6} 100 100)`);
      hands.second.setAttribute('transform',`rotate(${seconds*6} 100 100)`);
      const time=now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
      setText(digital,time);face.setAttribute('aria-label','Hora local: '+time);
      setText(ambientTime,time);setText(ambientDate,new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(now));
      if(calendarToday!==`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`)renderCalendar();
      clockTimer=setTimeout(tickClock,1000-Date.now()%1000);
    }
    async function api(action,values={}) {
      const runtime=homeHubUserscriptApi.runtime;
      if(!runtime?.id||!runtime.sendMessage)throw Error('Recarregue a extensão para ativar o Tempo.');
      const response=await runtime.sendMessage({namespace:'homehub-weather',action,...values});
      if(!response?.ok)throw Error(response?.error||'Não foi possível consultar o serviço de previsão.');
      return response.data;
    }
    function temp(value){return Number.isFinite(value)?Math.round(value)+'°':'—';}
    function localTime(value,timeZone){return new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone}).format(new Date(value));}
    function showCityDialog() {
      ++searchSequence;searchButton.disabled=false;results.replaceChildren();setText(searchStatus,'');input.value='';
      if(!dialog.open)dialog.showModal();input.focus();
    }
    function weatherButton(className,label,icon,action) {
      const button=node('button',{class:className,type:'button','aria-label':label,title:label},[symbol(icon)]);
      button.addEventListener('click',action);return button;
    }
    function renderWeather() {
      renderAmbientWeather();
      const {location,forecast,error}=lastState;
      weather.replaceChildren();weather.setAttribute('aria-busy',String(pending));
      const city=node('button',{class:'hhw-city',type:'button',title:'Escolher cidade'},[node('span',{},[location?.name||'Tempo']),svgNode('svg',{viewBox:'0 0 24 24','aria-hidden':'true',class:'hhw-location-arrow'})]);
      city.querySelector('svg').append(svgNode('path',{d:'M21 3 14 21l-3-8-8-3Z',fill:'currentColor'}));
      city.addEventListener('click',showCityDialog);
      const refresh=weatherButton('hhw-refresh','Atualizar previsão','refresh',()=>loadWeather('refresh'));
      refresh.disabled=pending||!location;
      weather.append(node('div',{class:'hhw-weather-top'},[city,refresh]));
      if(!location) {
        weather.dataset.state='setup';weather.dataset.weather='partly';weather.dataset.day='day';
        const choose=node('button',{class:'hhw-choose-city',type:'button'},['Escolher cidade']);choose.addEventListener('click',showCityDialog);
        weather.append(node('div',{class:'hhw-weather-setup'},[weatherIcon(2,true),node('div',{},[node('h3',{},['O tempo por perto']),node('p',{},['Temperatura e previsão para a cidade que você escolher.']),choose])]));
        if(error)weather.append(node('p',{class:'hhw-weather-error',role:'status'},[error]));
        return;
      }
      if(!forecast) {
        weather.dataset.state=pending?'loading':'error';weather.dataset.weather='cloudy';weather.dataset.day='day';
        const retry=node('button',{class:'hhw-choose-city',type:'button'},[pending?'Consultando…':'Tentar novamente']);retry.disabled=pending;retry.addEventListener('click',()=>loadWeather('refresh'));
        weather.append(node('div',{class:'hhw-weather-setup'},[weatherIcon(3,true),node('div',{},[node('h3',{},[pending?'Buscando a previsão':'Tempo indisponível']),node('p',{},[error||'Aguardando a consulta ao serviço de previsão.']),retry])]));return;
      }
      weather.dataset.state='ready';
      const current=forecast.current,description=condition(current.code,current.isDay);
      weather.dataset.weather=description.kind;weather.dataset.day=current.isDay?'day':'night';
      weather.setAttribute('aria-label',`Previsão externa em ${location.name}: ${temp(current.temperature)}, ${description.label}`);
      const now=node('div',{class:'hhw-now'},[
        node('div',{class:'hhw-current'},[node('div',{class:'hhw-temperature'},[temp(current.temperature)])]),
        node('div',{class:'hhw-current-sky'},[weatherIcon(current.code,current.isDay),node('div',{class:'hhw-condition'},[description.label])])
      ]);
      weather.append(now);
      const hours=node('div',{class:'hhw-hours','aria-label':'Previsão para as próximas horas'});
      const upcoming=forecast.hourly.filter(hour=>hour.time>current.time).slice(0,5);
      for(const hour of [{...current,now:true},...upcoming]) {
        const label=hour.now?'Agora':new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',hourCycle:'h23',timeZone:forecast.timeZone}).format(new Date(hour.time*1000));
        hours.append(node('div',{class:'hhw-hour'},[node('span',{class:'hhw-hour-label'},[label]),weatherIcon(hour.code,hour.isDay),node('b',{},[temp(hour.temperature)])]));
      }
      const updated=pending?'Atualizando…':forecast.stale?'Dados salvos · '+new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:forecast.timeZone}).format(new Date(forecast.fetchedAt)):'Atualizado às '+localTime(forecast.fetchedAt,forecast.timeZone);
      weather.append(hours,node('div',{class:'hhw-weather-footer'},[node('span',{role:'status'},[updated]),node('a',{href:'https://open-meteo.com/',target:'_blank',rel:'noopener noreferrer'},['Open-Meteo'])]));
    }
    function scheduleRefresh() {
      clearTimeout(refreshTimer);
      if(active&&!document.hidden&&lastState.location)refreshTimer=setTimeout(()=>loadWeather('init'),REFRESH);
    }
    async function loadWeather(action,values={}) {
      const sequence=++weatherSequence;pending=true;renderWeather();
      try {
        const state=await api(action,values);
        if(sequence!==weatherSequence)return;
        lastState=state;
      } catch(error) {
        if(sequence!==weatherSequence)return;
        lastState={...lastState,error:error.message};
        if(lastState.forecast)lastState={...lastState,forecast:{...lastState.forecast,stale:true}};
      } finally {
        if(sequence===weatherSequence){pending=false;renderWeather();scheduleRefresh();}
      }
    }
    form.addEventListener('submit',async event=>{
      event.preventDefault();const query=input.value.trim();if(query.length<2)return;
      const sequence=++searchSequence;searchButton.disabled=true;results.replaceChildren();setText(searchStatus,'Buscando cidades…');
      try {
        const response=await api('search',{query});if(sequence!==searchSequence)return;
        setText(searchStatus,response.locations.length?'Selecione uma cidade:':'Nenhuma cidade encontrada. Tente outro nome.');
        for(const location of response.locations) {
          const details=[location.region,location.country].filter(Boolean).join(' · ');
          const item=node('button',{class:'hhw-city-result',type:'button'},[node('strong',{},[location.name]),node('span',{},[details])]);
          item.addEventListener('click',()=>{dialog.close();lastState={location,forecast:null};loadWeather('select',{location});});results.append(item);
        }
      } catch(error){if(sequence===searchSequence)setText(searchStatus,error.message);}
      finally{if(sequence===searchSequence)searchButton.disabled=false;}
    });
    function setActive(value) {
      if(active===value)return;active=value;
      clearTimeout(clockTimer);clearTimeout(refreshTimer);clearTimeout(idleTimer);
      if(!active){if(dialog.open)dialog.close();closeAmbient();return;}
      lastActivity=Date.now();tickClock();armIdle();
      if(!initialized){initialized=true;loadWeather('init');}
      else if(lastState.location&&(!lastState.forecast||Date.now()-lastState.forecast.fetchedAt>REFRESH))loadWeather('init');
      else scheduleRefresh();
    }
    document.addEventListener('visibilitychange',()=>{
      clearTimeout(clockTimer);clearTimeout(refreshTimer);clearTimeout(idleTimer);
      if(active&&!document.hidden){lastActivity=Date.now();tickClock();armIdle();if(lastState.location&&(!lastState.forecast||Date.now()-lastState.forecast.fetchedAt>REFRESH))loadWeather('init');else scheduleRefresh();}
    });
    const noteActivity=()=>{if(active&&!ambient.open)lastActivity=Date.now();};
    for(const event of ['pointermove','pointerdown','keydown','wheel'])document.addEventListener(event,noteActivity,{passive:true,capture:true});
    document.addEventListener('scroll',noteActivity,{passive:true,capture:true});
    renderCalendar();renderWeather();
    return {attach(parent){if(parent&&root.parentElement!==parent)parent.prepend(root);},setActive,showAmbient};
  }
  globalThis.HomeHubWidgets={create};
})();

(() => {
  'use strict';
  const paths = {
    home:'m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9',
    room:'M5 21V3h13v18M18 21h3M5 21H2M13 12h.01',
    bathroom:'M3 12h18M5 12v3a5 5 0 0 0 5 5h4a5 5 0 0 0 5-5v-3M6 12V6a3 3 0 0 1 5.4-1.8L13 6m-2 2 4-4M7 20v2m10-2v2',
    kitchen:'M6 3v7M3.5 3v4.5a2.5 2.5 0 0 0 5 0V3M6 10v11M18 3c-2.5 2.5-3.5 5.2-3.5 8H18V3Zm0 8v10',
    office:'M4 3h16v12H4zM12 15v5m-4 0h8M7 6h10',
    bedroom:'M3 18V6m18 12v-5a2 2 0 0 0-2-2H3m0 7h18M5 18v3m14-3v3M6 11V7h5v4m2 0V7h5v4',
    guest:'M3 18V9m18 9v-5H3m0 5h18M5 18v3m14-3v3M6 13V9h5v4m2 0V9h5v4M16 2l.8 1.7L19 4.5l-2.2.8L16 7l-.8-1.7-2.2-.8 2.2-.8Z',
    living:'M5 11V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4M3 13a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v6H3v-6Zm3 6v2m12-2v2',
    garden:'M5 20C4 10 10 4 20 3c0 10-5 16-14 16M4 21l10-10',
    laundry:'M4 3h16v18H4zM8 6h.01M12 6h4M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8m-3.5 4c2-2 5 2 7 0',
    garage:'m3 10 9-7 9 7M5 9v12h14V9M8 21v-8h8v8M8 16h8m-8 3h8',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    light:'M9 18h6m-5 3h4M12 2a6.5 6.5 0 0 0-4 11.6c.8.7 1 1.4 1 2.4h6c0-1 .2-1.7 1-2.4A6.5 6.5 0 0 0 12 2Z',
    plug:'M9 3v6m6-6v6M6 9h12v3a6 6 0 0 1-12 0V9Zm6 9v3',
    media:'M3 4h18v14H3zM8 21h8m-4-3v3',
    speaker:'M6 3h12v18H6zM12 7v.01M12 17a3 3 0 1 0 0-.01',
    camera:'M3 7h12v10H3zM15 11l6-3v8l-6-3',
    climate:'M12 2v20M4 7l16 10M4 17 20 7m-8 1 3-3m-3 11 3 3m-3-11L9 5m3 11-3 3',
    coffee:'M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Zm13 1h2a2.5 2.5 0 0 1 0 5h-2M8 3v3m4-3v3',
    vacuum:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4M8 18h8',
    lock:'M5 10h14v11H5zM8 10V7a4 4 0 0 1 8 0v3m-4 4v3',
    sun:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5',
    moon:'M20 15a8 8 0 0 1-11-11 8.5 8.5 0 1 0 11 11Z',
    external:'M14 3h7v7m0-7L10 14M10 3H3v18h18v-7',
    dock:'M3 4h18v16H3zM3 15h18M7 17.5h2m2 0h2m2 0h2',
    ambient:'M18 15a7 7 0 0 1-9-9 7.5 7.5 0 1 0 9 9Zm.5-12 .6 1.5L21 5l-1.9.5-.6 1.5-.6-1.5L16 5l1.9-.5ZM15 9l.4.9 1.1.4-1.1.3-.4 1-.4-1-1.1-.3 1.1-.4Z',
    refresh:'M20 7v5h-5M4 17v-5h5M6.1 7a7 7 0 0 1 11.5-1L20 9M4 15l2.4 3a7 7 0 0 0 11.5-1',
    chevron:'m7 10 5 5 5-5',
    other:'M5 5h14v14H5zM9 9h6v6H9z'
  };
  const categories = [
    ['all','Todos','grid'],['light','Iluminação','light'],['plug','Tomadas','plug'],
    ['media','Mídia','media'],['security','Segurança','lock'],['climate','Clima','climate'],['other','Outros','other']
  ];
  const memory = {enabled:true,theme:'light',dock:'expanded',room:null,category:'all',roomSignature:'',categorySignature:''};
  try {memory.enabled=sessionStorage.getItem('homehub.original')!=='1';memory.theme=sessionStorage.getItem('homehub.theme')||'light';memory.dock=sessionStorage.getItem('homehub.dock')==='compact'?'compact':'expanded';} catch (_) {}
  let ui=null,refs={},queued=false,records=[],widgets=null;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
  const motion={surface:null,frame:0,event:null,pressed:false,interacting:null};

  function roomKind(name) {
    const value=name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    if(/visita|hospede|guest/.test(value))return 'guest';
    if(/banheiro|lavabo|bath/.test(value))return 'bathroom';
    if(/cozinha|jantar|kitchen|dining/.test(value))return 'kitchen';
    if(/escritorio|office|estudio|study/.test(value))return 'office';
    if(/quarto|suite|bedroom/.test(value))return 'bedroom';
    if(/lavanderia|servico|laundry/.test(value))return 'laundry';
    if(/varanda|jardim|extern|terraco|garden|balcon/.test(value))return 'garden';
    if(/garagem|garage/.test(value))return 'garage';
    if(/sala|living|estar/.test(value))return 'living';
    return 'room';
  }

  function resetSurface() {
    if(!motion.surface)return;
    motion.surface.style.setProperty('--hh-glass-visible','0');
    motion.surface.style.setProperty('--hh-depth-x','0px');
    motion.surface.style.setProperty('--hh-depth-y','0px');
    motion.surface=null;
  }
  function resetMotion() {
    if(motion.frame)cancelAnimationFrame(motion.frame);
    motion.frame=0;motion.event=null;resetSurface();
    document.documentElement.style.setProperty('--hh-scene-x','0px');
    document.documentElement.style.setProperty('--hh-scene-y','0px');
  }
  function moveGlass() {
    motion.frame=0;
    const event=motion.event;
    if(!event||!memory.enabled||reducedMotion.matches||!finePointer.matches||motion.pressed)return;
    const root=document.documentElement;
    root.style.setProperty('--hh-scene-x',((event.x/innerWidth-.5)*12).toFixed(2)+'px');
    root.style.setProperty('--hh-scene-y',((event.y/innerHeight-.5)*9).toFixed(2)+'px');
    const surface=event.target?.closest('[data-homehub-card],#homehub-ui .hh-dock,#homehub-ui .hh-chip,#homehub-ui .hh-theme,#homehub-widgets .hhw-clock,#homehub-widgets .hhw-weather,#homehub-widgets .hhw-calendar');
    if(motion.surface!==surface){resetSurface();motion.surface=surface;}
    if(!surface)return;
    const rect=surface.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const x=Math.max(0,Math.min(1,(event.x-rect.left)/rect.width));
    const y=Math.max(0,Math.min(1,(event.y-rect.top)/rect.height));
    surface.style.setProperty('--hh-glass-x',(x*100).toFixed(1)+'%');
    surface.style.setProperty('--hh-glass-y',(y*100).toFixed(1)+'%');
    surface.style.setProperty('--hh-glass-visible','1');
    surface.style.setProperty('--hh-depth-x',((x-.5)*5).toFixed(2)+'px');
    surface.style.setProperty('--hh-depth-y',((y-.5)*5).toFixed(2)+'px');
  }
  function startMotion() {
    document.addEventListener('pointermove',event=>{
      if(event.pointerType!=='mouse'||!memory.enabled||!document.documentElement.hasAttribute('data-homehub-active')||document.getElementById('homehub-ambient')?.open||reducedMotion.matches||!finePointer.matches||motion.pressed)return;
      motion.event={x:event.clientX,y:event.clientY,target:event.target};
      if(!motion.frame)motion.frame=requestAnimationFrame(moveGlass);
    },{passive:true});
    document.addEventListener('pointerdown',event=>{
      motion.pressed=true;resetMotion();
      motion.interacting=event.target.closest?.('[data-homehub-card]')||null;
      motion.interacting?.setAttribute('data-homehub-interacting','');
    },{passive:true,capture:true});
    const release=()=>{motion.pressed=false;motion.interacting?.removeAttribute('data-homehub-interacting');motion.interacting=null;};
    document.addEventListener('pointerup',release,{passive:true,capture:true});
    document.addEventListener('pointercancel',release,{passive:true,capture:true});
    document.addEventListener('pointerout',event=>{if(!event.relatedTarget)resetMotion();},{passive:true});
    window.addEventListener('blur',()=>{release();resetMotion();});
    document.addEventListener('visibilitychange',()=>{if(document.hidden){release();resetMotion();}});
    reducedMotion.addEventListener('change',resetMotion);finePointer.addEventListener('change',resetMotion);
  }

  function node(tag,attrs={},children=[]) {
    const element=document.createElement(tag);
    for(const [key,value] of Object.entries(attrs)) element.setAttribute(key,value);
    for(const child of children) element.append(typeof child==='string'?document.createTextNode(child):child);
    return element;
  }
  function symbol(kind) {
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    for(const [key,value] of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.65','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(key,value);
    const path=document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',paths[kind]||paths.other);svg.append(path);return svg;
  }
  function text(element,value) {if(element.textContent!==value)element.textContent=value;}
  function button(className,label,kind,action) {
    const result=node('button',{class:className,type:'button','aria-label':label,title:label},[symbol(kind),node('span',{class:'hh-button-label'},[label])]);
    result.addEventListener('click',action);return result;
  }
  function save(key,value) {try{sessionStorage.setItem(key,value);}catch(_) {}}
  function toggleOriginal(enabled) {
    memory.enabled=enabled;if(!enabled)resetMotion();save('homehub.original',enabled?'0':'1');render();
  }
  function refreshView() {
    render();document.querySelector('ghw-devices .devices-container > mat-sidenav-content')?.scrollTo({top:0});
  }
  function makeUi() {
    ui=node('div',{id:'homehub-ui'});
    const dock=node('nav',{id:'homehub-dock',class:'hh-dock','aria-label':'Navegação dos cômodos'});
    refs.overview=button('hh-nav','Visão geral','grid',()=>{memory.room=null;memory.category='all';refreshView();});
    refs.rooms=node('div',{class:'hh-rooms'});dock.append(refs.overview,refs.rooms);
    const original=button('hh-original','Ver Google Home','external',()=>toggleOriginal(false));
    dock.append(node('div',{class:'hh-dock-actions'},[original]));
    const header=node('header',{class:'hh-header'});
    refs.date=node('div',{class:'hh-date'},[new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(new Date())]);
    refs.house=node('span',{class:'hh-home-name'},['Minha Casa']);
    refs.title=node('h1',{},['Visão geral']);refs.summary=node('div',{class:'hh-summary'});
    const eyebrow=node('div',{class:'hh-eyebrow'},[symbol('home'),refs.house,node('span',{class:'hh-eyebrow-separator'},['·']),refs.date]);
    header.append(node('div',{class:'hh-heading'},[eyebrow,refs.title,refs.summary]));
    refs.dockToggle=node('button',{class:'hh-tool-button hh-dock-toggle',type:'button','aria-label':'Compactar barra de cômodos','aria-controls':'homehub-dock'},[symbol('dock')]);
    refs.dockToggle.addEventListener('click',()=>{memory.dock=memory.dock==='compact'?'expanded':'compact';save('homehub.dock',memory.dock);render();});
    refs.ambientToggle=node('button',{class:'hh-tool-button hh-ambient-toggle',type:'button','aria-label':'Ativar protetor de tela',title:'Protetor de tela · automático após 1 min sem interação'},[symbol('ambient')]);
    refs.ambientToggle.addEventListener('click',()=>{resetMotion();widgets?.showAmbient();});
    header.append(refs.dockToggle,refs.ambientToggle);
    refs.theme=node('button',{class:'hh-theme',type:'button','aria-label':'Alternar aparência'});
    refs.theme.addEventListener('click',()=>{memory.theme=memory.theme==='dark'?'light':'dark';save('homehub.theme',memory.theme);render();});header.append(refs.theme);
    refs.categories=node('nav',{class:'hh-categories','aria-label':'Categorias de acessórios'});
    refs.empty=node('div',{class:'hh-empty',role:'status'},['Nenhum acessório nesta categoria.']);refs.empty.hidden=true;
    const restore=node('button',{class:'hh-restore',type:'button'},['Ativar Home Hub']);restore.addEventListener('click',()=>toggleOriginal(true));
    ui.append(dock,header,refs.categories,refs.empty,restore);document.body.append(ui);
    widgets=globalThis.HomeHubWidgets?.create({node,symbol})||null;
  }
  function typeOf(card,iconText) {
    if(card.matches('.LIGHT,.slider-LIGHT')||/light|bulb|lamp/.test(iconText))return ['light','light'];
    if(card.classList.contains('COFFEE_MAKER')||/coffee/.test(iconText))return ['plug','coffee'];
    if(card.classList.contains('SPEAKER')||/speaker|volume/.test(iconText))return ['media','speaker'];
    if(card.classList.contains('TV')||/tv|monitor|desktop/.test(iconText))return ['media','media'];
    if(/camera|videocam|doorbell/.test(iconText))return ['security','camera'];
    if(/lock/.test(iconText)||card.classList.contains('LOCK'))return ['security','lock'];
    if(/fan|climate|thermostat|ac_unit/.test(iconText))return ['climate','climate'];
    if(card.classList.contains('VACUUM')||/vacuum/.test(iconText))return ['other','vacuum'];
    if(card.classList.contains('SWITCH')||/plug|power|outlet|switch/.test(iconText))return ['plug','plug'];
    return ['other','other'];
  }
  function collect(app) {
    const result=[];
    for(const space of app.querySelectorAll('.spaces-container > .space')) {
      const room=space.querySelector(':scope > h2')?.textContent.trim()||'Outros';
      for(const tile of space.querySelectorAll('.tile-column > ghw-device-tile')) {
        const card=tile.querySelector('.device-tile .on-off-tile,.device-tile .media-tile,.device-tile .generic-tile');
        if(!card)continue;
        const expand=tile.querySelector('.expand-button');
        let category,primaryKind;
        for(const item of tile.querySelectorAll('.on-off-tile,.media-tile,.generic-tile')) {
          const icon=item.querySelector('.icon');
          const iconText=(icon?.querySelector('mat-icon')?.textContent||'').trim().toLowerCase();
          const [itemCategory,itemKind]=typeOf(item,iconText);
          if(item===card){category=itemCategory;primaryKind=itemKind;}
          const kind=itemKind;
          item.dataset.homehubCard='';item.dataset.homehubKind=kind;
          if(icon) {
            icon.dataset.homehubSymbol='';
            const old=icon.querySelector('.homehub-symbol');
            if(!old||old.dataset.kind!==kind) {
              old?.remove();const svg=symbol(kind);svg.classList.add('homehub-symbol');svg.dataset.kind=kind;icon.append(svg);
            }
          }
          if(expand&&item===card) {
            item.dataset.homehubGroup='true';expand.dataset.homehubSymbol='';
            if(!expand.querySelector('.homehub-symbol')){const arrow=symbol('chevron');arrow.classList.add('homehub-symbol');expand.append(arrow);}
          }
          let roomLabel=item.querySelector(':scope > .homehub-room-label');
          if(!roomLabel){roomLabel=node('span',{class:'homehub-room-label','aria-hidden':'true'});item.append(roomLabel);}
          text(roomLabel,room);
          const content=item.querySelector('.content');
          if(content&&!content.querySelector('.subtitle,span:not(.homehub-native-status)')&&!content.querySelector('.homehub-native-status')) {
            content.append(node('span',{class:'homehub-native-status'},[item.classList.contains('readonly')?'Sem controles disponíveis':'Disponível']));
          }
        }
        const offline=card.classList.contains('offline');
        result.push({tile,card,room,category,kind:primaryKind,offline,on:card.classList.contains('active')&&!offline});
      }
    }
    return result;
  }
  function render() {
    if(!ui)return;
    document.documentElement.toggleAttribute('data-homehub-active',memory.enabled);
    document.documentElement.dataset.homehubTheme=memory.theme;
    document.documentElement.dataset.homehubDock=memory.dock;
    ui.dataset.original=String(!memory.enabled);
    widgets?.setActive(memory.enabled);
    const dockLabel=memory.dock==='compact'?'Expandir barra de cômodos':'Compactar barra de cômodos';
    refs.dockToggle.setAttribute('aria-label',dockLabel);refs.dockToggle.title=dockLabel;
    refs.dockToggle.setAttribute('aria-expanded',String(memory.dock!=='compact'));
    if(!memory.enabled)return;
    const rooms=[...new Set(records.map(record=>record.room))];
    if(memory.room&&!rooms.includes(memory.room))memory.room=null;
    const roomSignature=JSON.stringify(rooms.map(name=>[name,records.filter(r=>r.room===name).length]));
    if(memory.roomSignature!==roomSignature) {
      memory.roomSignature=roomSignature;
      refs.rooms.replaceChildren();
      for(const room of rooms) {
        const count=records.filter(record=>record.room===room).length;
        const kind=roomKind(room);
        const entry=button('hh-nav',room,kind,()=>{memory.room=room;memory.category='all';refreshView();});
        const glyph=entry.querySelector('svg');
        const badge=node('span',{class:'hh-room-icon','data-room-kind':kind},[glyph]);entry.prepend(badge);
        entry.dataset.room=room;entry.append(node('span',{class:'hh-count'},[String(count)]));refs.rooms.append(entry);
      }
    }
    refs.overview.setAttribute('aria-pressed',String(!memory.room));
    for(const entry of refs.rooms.children)entry.setAttribute('aria-pressed',String(entry.dataset.room===memory.room));
    text(refs.title,memory.room||'Visão geral');
    const inRoom=records.filter(record=>!memory.room||record.room===memory.room);
    const inUse=inRoom.filter(record=>record.on).length;
    const offline=inRoom.filter(record=>record.offline).length;
    text(refs.summary,`${inRoom.length} acessórios${inUse?' · '+inUse+' em uso':''}${offline?' · '+offline+' off-line':''}`);
    const themeIcon=memory.theme==='dark'?'sun':'moon';
    if(refs.theme.dataset.icon!==themeIcon){refs.theme.replaceChildren(symbol(themeIcon));refs.theme.dataset.icon=themeIcon;}
    const shownCategories=categories.filter(([key])=>key==='all'||inRoom.some(record=>record.category===key));
    if(!shownCategories.some(([key])=>key===memory.category))memory.category='all';
    const categorySignature=JSON.stringify(shownCategories.map(([key])=>[key,inRoom.filter(r=>key==='all'||r.category===key).length]));
    if(memory.categorySignature!==categorySignature) {
      memory.categorySignature=categorySignature;refs.categories.replaceChildren();
      for(const [key,label,icon] of shownCategories) {
        const count=inRoom.filter(record=>key==='all'||record.category===key).length;
        const chip=button('hh-chip',label,icon,()=>{memory.category=key;refreshView();});chip.dataset.category=key;
        chip.append(node('span',{class:'hh-chip-count'},[String(count)]));refs.categories.append(chip);
      }
    }
    for(const chip of refs.categories.children)chip.setAttribute('aria-pressed',String(chip.dataset.category===memory.category));
    let visible=0;
    for(const record of records) {
      const show=(!memory.room||record.room===memory.room)&&(memory.category==='all'||record.category===memory.category);
      record.tile.dataset.homehubHidden=String(!show);if(show)visible++;
    }
    text(refs.empty,records.length?'Nenhum acessório nesta categoria.':'Aguardando os acessórios do Google Home…');refs.empty.hidden=visible>0;
  }
  function apply() {
    queued=false;
    const app=document.querySelector('ghw-devices');
    if(!app) {document.documentElement.removeAttribute('data-homehub-active');resetMotion();widgets?.setActive(false);if(ui)ui.hidden=true;return;}
    if(!document.body)return;
    if(!ui)makeUi();ui.hidden=false;
    widgets?.attach(app.querySelector('.spaces-container'));
    const house=document.querySelector('ghw-toolbar .home-nav');
    if(house) {
      const clone=house.cloneNode(true);clone.querySelectorAll('mat-icon,svg,script').forEach(n=>n.remove());
      const name=clone.textContent.replace(/\s+/g,' ').trim();if(name&&name.length<60)text(refs.house,name);
    }
    records=collect(app);render();
  }
  function schedule(changes) {
    if(changes?.every(change=>{const el=change.target.nodeType===1?change.target:change.target.parentElement;return el?.closest('#homehub-ui,#homehub-widgets,#homehub-weather-dialog,#homehub-ambient,.homehub-symbol,.homehub-room-label');}))return;
    if(queued)return;queued=true;setTimeout(apply,100);
  }
  function start() {
    new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','aria-disabled']});startMotion();apply();
  }
  if(document.documentElement)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
})();

// Fullscreen is a browser presentation mode. Android controls kiosk protection and display power.
(() => {
  let button;
  const ns='http://www.w3.org/2000/svg';
  function update(){
    if(!button)return;
    const active=!!document.fullscreenElement;
    const label=active?'Sair da tela cheia':'Entrar em tela cheia';
    button.title=label;button.setAttribute('aria-label',label);
    button.setAttribute('aria-pressed',String(active));
  }
  function attach(){
    if(button?.isConnected)return;
    const header=document.querySelector('#homehub-ui .hh-header');
    if(!header)return;
    button=document.createElement('button');button.className='hh-tool-button hh-fullscreen-toggle';button.type='button';
    const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
    const path=document.createElementNS(ns,'path');path.setAttribute('d','M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5');
    path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.8');path.setAttribute('stroke-linecap','round');
    svg.append(path);button.append(svg);
    button.addEventListener('click',async()=>{
      try{
        if(document.fullscreenElement)await document.exitFullscreen();
        else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'});
        else throw Error('Tela cheia indisponível.');
      }catch(_){
        let message=document.querySelector('#homehub-fullscreen-status');
        if(!message){
          message=document.createElement('div');message.id='homehub-fullscreen-status';message.setAttribute('role','status');
          message.style.cssText='position:fixed;z-index:100;left:20px;right:20px;bottom:120px;max-width:430px;margin:auto;padding:14px 18px;border-radius:16px;background:#253043;color:#fff;font:13px/1.5 sans-serif;box-shadow:0 8px 30px #0004';
          document.body.append(message);
        }
        message.textContent='O Firefox não liberou a tela cheia. Toque no botão novamente; se continuar, confira as permissões de tela cheia do navegador.';
        setTimeout(()=>message.remove(),7000);
      }
      update();
    });
    header.insertBefore(button,header.querySelector('.hh-theme'));update();
  }
  document.addEventListener('fullscreenchange',update);
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)return;
    const ambient=document.querySelector('#homehub-ambient');
    if(ambient?.open)ambient.close();
  });
  new MutationObserver(attach).observe(document.documentElement,{childList:true,subtree:true});
  attach();
})();

homeHubStartPhoneUi();
})();
