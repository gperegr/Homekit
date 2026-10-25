(() => {
  const STYLE = `
    ghw-devices .devices-container > mat-sidenav[data-homehub-rooms] {
      box-sizing:border-box!important;
      width:220px!important;
      min-width:220px!important;
      max-width:220px!important;
      flex:0 0 220px!important;
      border-radius:0 26px 26px 0!important;
      overflow:hidden!important;
    }
    ghw-devices .devices-container > mat-sidenav-content[data-homehub-content] {
      margin-left:220px!important;
    }
    ghw-devices .devices-container > mat-sidenav[data-homehub-rooms] .mat-mdc-list-item {
      min-height:48px!important;
      border-radius:15px!important;
      margin:3px 10px!important;
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,"Segoe UI",sans-serif!important;
    }
    ghw-devices .spaces-container[data-homehub-spaces] {
      box-sizing:border-box!important;
      width:100%!important;
      max-width:1640px!important;
      margin-inline:auto!important;
      padding:18px clamp(20px,3vw,48px) 52px!important;
    }
    ghw-devices .spaces-container > .space[data-homehub-space] {
      margin:0 0 30px!important;
    }
    ghw-devices .space[data-homehub-space] > h2 {
      margin:8px 0 16px!important;
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",Inter,"Segoe UI",sans-serif!important;
      font-size:clamp(21px,1.55vw,27px)!important;
      line-height:1.15!important;
      font-weight:650!important;
      letter-spacing:-.035em!important;
    }
    ghw-devices .space > .tile-container[data-homehub-grid] {
      display:grid!important;
      grid-template-columns:repeat(auto-fill,minmax(min(100%,248px),1fr))!important;
      align-items:stretch!important;
      gap:15px!important;
      width:100%!important;
    }
    ghw-devices .tile-container[data-homehub-grid] > .tile-column {
      display:contents!important;
    }
    ghw-devices .tile-container[data-homehub-grid] ghw-device-tile,
    ghw-devices .tile-container[data-homehub-grid] .device-tile {
      display:block!important;
      box-sizing:border-box!important;
      width:100%!important;
      min-width:0!important;
      height:100%!important;
    }
    ghw-devices .device-tile button.on-off-tile,
    ghw-devices .device-tile button.media-tile,
    ghw-devices .device-tile button[class*="slider-"],
    ghw-devices .device-tile .generic-tile {
      box-sizing:border-box!important;
      display:flex!important;
      align-items:center!important;
      gap:15px!important;
      width:100%!important;
      min-height:106px!important;
      height:100%!important;
      padding:17px 19px!important;
      border-radius:24px!important;
      font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,"Segoe UI",sans-serif!important;
      transition:transform .18s ease,box-shadow .2s ease!important;
    }
    ghw-devices .device-tile button.on-off-tile:hover,
    ghw-devices .device-tile button.media-tile:hover,
    ghw-devices .device-tile button[class*="slider-"]:hover,
    ghw-devices .device-tile .generic-tile:hover {
      transform:translateY(-2px)!important;
    }
    ghw-devices .device-tile .icon {
      display:grid!important;
      place-items:center!important;
      flex:0 0 42px!important;
      width:42px!important;
      height:42px!important;
      border-radius:50%!important;
      background:rgba(127,139,160,.12)!important;
    }
    ghw-devices .device-tile mat-icon[data-homehub-icon] {
      display:block!important;
      overflow:visible!important;
      width:25px!important;
      height:25px!important;
      font-size:0!important;
      line-height:0!important;
    }
    ghw-devices .device-tile mat-icon[data-homehub-icon]::after {
      content:""!important;
      display:block!important;
      width:25px!important;
      height:25px!important;
      background:currentColor!important;
      -webkit-mask:var(--homehub-mask) center/contain no-repeat!important;
      mask:var(--homehub-mask) center/contain no-repeat!important;
    }
    ghw-devices mat-icon[data-homehub-icon="light"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 12c.7.6 1 1.4 1 2h6c0-.7.3-1.4 1-2A7 7 0 0 0 12 2Z' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }
    ghw-devices mat-icon[data-homehub-icon="coffee"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M5 9h12v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V9Zm12 2h2a2 2 0 1 1 0 4h-2M8 3v3m4-3v3m4-3v3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }
    ghw-devices mat-icon[data-homehub-icon="speaker"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='6' y='2.5' width='12' height='19' rx='2' fill='none' stroke='black' stroke-width='1.7'/%3E%3Ccircle cx='12' cy='16' r='2.6' fill='none' stroke='black' stroke-width='1.7'/%3E%3Cpath d='M12 7v.01' stroke='black' stroke-width='2.2' stroke-linecap='round'/%3E%3C/svg%3E"); }
    ghw-devices mat-icon[data-homehub-icon="media"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='3' y='4' width='18' height='14' rx='2' fill='none' stroke='black' stroke-width='1.7'/%3E%3Cpath d='M8 21h8m-4-3v3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round'/%3E%3C/svg%3E"); }
    ghw-devices mat-icon[data-homehub-icon="climate"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2v20M4 7l16 10M4 17 20 7m-8 1 3-3m-3 11 3 3m-3-11L9 5m3 11-3 3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round'/%3E%3C/svg%3E"); }
    ghw-devices mat-icon[data-homehub-icon="plug"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 3v6m6-6v6M6 9h12v3a6 6 0 0 1-12 0V9Zm6 9v3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }
    ghw-devices mat-icon[data-homehub-icon="camera"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M3 7h11a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3zM16 11l5-3v8l-5-3z' fill='none' stroke='black' stroke-width='1.7' stroke-linejoin='round'/%3E%3C/svg%3E"); }
    ghw-devices mat-icon[data-homehub-icon="vacuum"] { --homehub-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='8.5' fill='none' stroke='black' stroke-width='1.7'/%3E%3Ccircle cx='12' cy='12' r='2' fill='none' stroke='black' stroke-width='1.7'/%3E%3Cpath d='M8 18h8' stroke='black' stroke-width='1.7' stroke-linecap='round'/%3E%3C/svg%3E"); }
    ghw-devices .device-tile .content { min-width:0!important; text-align:left!important; }
    ghw-devices .device-tile .content .title { font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,"Segoe UI",sans-serif!important; font-size:15px!important; line-height:1.2!important; font-weight:600!important; letter-spacing:-.02em!important; }
    ghw-devices .device-tile .content .subtitle { font-size:12px!important; line-height:1.25!important; }
    @media(max-width:900px) {
      ghw-devices .devices-container > mat-sidenav[data-homehub-rooms] { width:180px!important;min-width:180px!important;max-width:180px!important;flex-basis:180px!important; }
      ghw-devices .devices-container > mat-sidenav-content[data-homehub-content] { margin-left:180px!important; }
      ghw-devices .space > .tile-container[data-homehub-grid] { grid-template-columns:repeat(auto-fill,minmax(min(100%,220px),1fr))!important; }
    }
    @media(max-width:620px) {
      ghw-devices .devices-container > mat-sidenav[data-homehub-rooms] { width:76px!important;min-width:76px!important;max-width:76px!important;flex-basis:76px!important; }
      ghw-devices .devices-container > mat-sidenav-content[data-homehub-content] { margin-left:76px!important; }
      ghw-devices .devices-container > mat-sidenav[data-homehub-rooms] .mat-mdc-list-item-title { display:none!important; }
      ghw-devices .space > .tile-container[data-homehub-grid] { grid-template-columns:1fr!important; }
    }
  `;

  const ICONS = new Map([
    ["lightbulb", "light"], ["light_group", "light"], ["light_mode", "light"],
    ["coffee", "coffee"], ["coffee_maker", "coffee"],
    ["speaker", "speaker"], ["speaker_group", "speaker"], ["volume_up", "speaker"],
    ["tv", "media"], ["tv_remote", "media"], ["desktop_windows", "media"], ["monitor", "media"],
    ["ac_unit", "climate"], ["mode_fan", "climate"], ["air", "climate"], ["thermostat", "climate"],
    ["power", "plug"], ["power_settings_new", "plug"], ["electrical_services", "plug"], ["outlet", "plug"],
    ["videocam", "camera"], ["camera", "camera"], ["doorbell", "camera"],
    ["vacuum", "vacuum"], ["robot_vacuum", "vacuum"]
  ]);

  let updateQueued = false;
  let styleAdded = false;

  function ensureStyle() {
    if (styleAdded || !document.head) return;
    const style = document.createElement("style");
    style.dataset.homehubGoogleHome = "";
    style.textContent = STYLE;
    document.head.appendChild(style);
    styleAdded = true;
  }

  function apply() {
    updateQueued = false;
    ensureStyle();
    const app = document.querySelector("ghw-devices");
    if (!app) return;

    const drawer = app.querySelector(".devices-container > mat-sidenav");
    const content = app.querySelector(".devices-container > mat-sidenav-content");
    const spaces = app.querySelector(".spaces-container");
    if (drawer) drawer.setAttribute("data-homehub-rooms", "");
    if (content) content.setAttribute("data-homehub-content", "");
    if (spaces) spaces.setAttribute("data-homehub-spaces", "");

    for (const space of app.querySelectorAll(".spaces-container > .space")) {
      space.setAttribute("data-homehub-space", "");
      const grid = space.querySelector(":scope > .tile-container");
      if (grid) grid.setAttribute("data-homehub-grid", "");
      for (const tile of space.querySelectorAll(".tile-column > ghw-device-tile")) {
        tile.setAttribute("data-homehub-tile", "");
      }
    }

    for (const icon of app.querySelectorAll(".device-tile mat-icon")) {
      const name = (icon.textContent || "").trim().toLowerCase();
      const kind = ICONS.get(name);
      if (kind && icon.getAttribute("data-homehub-icon") !== kind) {
        icon.setAttribute("data-homehub-icon", kind);
      }
    }
  }

  function schedule() {
    if (updateQueued) return;
    updateQueued = true;
    setTimeout(apply, 180);
  }

  function start() {
    ensureStyle();
    new MutationObserver(schedule).observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
    apply();
  }

  if (document.documentElement) start();
  else document.addEventListener("DOMContentLoaded", start, { once: true });
})();
