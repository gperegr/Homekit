(() => {
  const ROOM_NAMES = new Set([
    "Banheiro", "Cozinha", "Escritório", "Quarto", "Quarto de visitas",
    "Sala", "Varanda", "Área externa", "Área de serviço", "Lavanderia",
    "Hall", "Corredor", "Garagem", "Jardim", "Entrada", "Outro"
  ]);
  const STATUS = /off[\s-]?line|online|pausad|ativad|desativad|desligad|ligad|standby|idle|unavailable|indisponível/i;
  let queued = false;

  const THEME = `
    :host, html, body { font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text",Inter,"Segoe UI",sans-serif!important; }
    [data-homehub-room-nav] { box-sizing:border-box!important; flex:0 0 210px!important; width:210px!important; min-width:210px!important; max-width:210px!important; }
    [data-homehub-room-nav] button,[data-homehub-room-nav] [role="button"] { min-height:46px!important; border-radius:16px!important; font-size:14px!important; }
    [data-homehub-room-title] { font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",Inter,sans-serif!important; font-size:clamp(20px,1.5vw,26px)!important; font-weight:650!important; letter-spacing:-.035em!important; }
    [data-homehub-room-grid] { display:grid!important; grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr))!important; gap:16px!important; align-items:stretch!important; }
    [data-homehub-card] { box-sizing:border-box!important; position:relative!important; min-height:104px!important; width:100%!important; max-width:none!important; border-radius:25px!important; padding:16px 18px!important; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,sans-serif!important; font-size:15px!important; letter-spacing:-.01em!important; transition:transform .18s ease,box-shadow .2s ease!important; }
    [data-homehub-card]:hover { transform:translateY(-2px)!important; }
    [data-homehub-card] [data-homehub-original-icon] { visibility:hidden!important; }
    [data-homehub-card]::before { content:""!important; position:absolute!important; z-index:1!important; left:17px!important; top:50%!important; width:25px!important; height:25px!important; transform:translateY(-50%)!important; background-color:currentColor!important; -webkit-mask:var(--homehub-icon) center/contain no-repeat!important; mask:var(--homehub-icon) center/contain no-repeat!important; pointer-events:none!important; }
    [data-homehub-card][data-homehub-kind="light"] { --homehub-icon:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M9 18h6m-5 3h4m-2-19a7 7 0 0 0-4 12c.7.6 1 1.4 1 2h6c0-.7.3-1.4 1-2A7 7 0 0 0 12 2Z' stroke='black' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }
    [data-homehub-card][data-homehub-kind="climate"] { --homehub-icon:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2v20M4 7l16 10M4 17 20 7m-8 1 3-3m-3 11 3 3m-3-11L9 5m3 11-3 3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round'/%3E%3C/svg%3E"); }
    [data-homehub-card][data-homehub-kind="media"] { --homehub-icon:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='3' y='4' width='18' height='14' rx='2' fill='none' stroke='black' stroke-width='1.7'/%3E%3Cpath d='M8 21h8m-4-3v3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round'/%3E%3C/svg%3E"); }
    [data-homehub-card][data-homehub-kind="plug"] { --homehub-icon:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M9 3v6m6-6v6M6 9h12v3a6 6 0 0 1-12 0V9Zm6 9v3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }
    [data-homehub-card][data-homehub-kind="security"] { --homehub-icon:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect x='4' y='10' width='16' height='11' rx='2' fill='none' stroke='black' stroke-width='1.7'/%3E%3Cpath d='M8 10V7a4 4 0 0 1 8 0v3m-4 4v3' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round'/%3E%3C/svg%3E"); }
    [data-homehub-card][data-homehub-kind="default"] { --homehub-icon:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='m3 11 9-8 9 8M5 10v10h14V10m-9 10v-6h4v6' fill='none' stroke='black' stroke-width='1.7' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); }
    @media(max-width:700px) { [data-homehub-room-grid]{grid-template-columns:1fr!important;gap:12px!important} [data-homehub-card]{min-height:88px!important} }
  `;

  function roots() {
    const found = [];
    const visit = root => {
      if (!root) return;
      found.push(root);
      const nodes = root.querySelectorAll?.("*") || [];
      for (const node of nodes) if (node.shadowRoot) visit(node.shadowRoot);
    };
    visit(document);
    return found;
  }

  function style(root) {
    if (root.querySelector?.("style[data-homehub-theme]")) return;
    const el = document.createElement("style");
    el.dataset.homehubTheme = "";
    el.textContent = THEME;
    if (root.nodeType === Node.DOCUMENT_NODE) (root.head || root.documentElement).appendChild(el);
    else root.appendChild(el);
  }

  function label(el) {
    return (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim();
  }

  function visible(el) {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function allElements(root) {
    return [...(root.querySelectorAll?.("*") || [])];
  }

  function findRoomTitles(root) {
    const titles = [];
    for (const el of allElements(root)) {
      const text = label(el);
      if (!ROOM_NAMES.has(text) || !visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.left < 280 || r.width > 360 || r.height > 80) continue;
      titles.push({ el, text, top: r.top, left: r.left });
    }
    // In the screenshot, room names appear once in the room menu and once above
    // each device group. Keep the occurrence furthest into the content area.
    const byName = new Map();
    for (const title of titles) {
      const previous = byName.get(title.text);
      if (!previous || title.left > previous.left) byName.set(title.text, title);
    }
    return [...byName.values()].sort((a, b) => a.top - b.top);
  }

  function markRoomNav(root) {
    const entries = [];
    for (const el of allElements(root)) {
      if (!ROOM_NAMES.has(label(el)) || !visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.left < 150 || r.left > 520 || r.width > 320 || r.height > 90) continue;
      let item = el;
      for (let i = 0; i < 5 && item.parentElement; i++) {
        if (item.matches('button,[role="button"],[tabindex="0"]')) break;
        item = item.parentElement;
      }
      if (item.matches('button,[role="button"],[tabindex="0"]')) entries.push(item);
    }
    const unique = [...new Set(entries)];
    if (unique.length < 3) return;
    let common = unique[0];
    while (common && !unique.every(item => common.contains(item))) common = common.parentElement;
    if (common && common !== root && common !== document.documentElement) {
      const bounds = common.getBoundingClientRect();
      if (bounds.width >= 250 && bounds.width <= 700 && bounds.height > 220) {
        common.setAttribute("data-homehub-room-nav", "");
      }
    }
  }

  function kindOf(text) {
    if (/lâmp|lamp|luz|light/i.test(text)) return "light";
    if (/ar[- ]?condicionado|clima|ventil|aquec|termostat|temperature/i.test(text)) return "climate";
    if (/tv|televis|som|speaker|caixa de som|media/i.test(text)) return "media";
    if (/tomada|plug|roteador|cafeteira|exaustor|interruptor/i.test(text)) return "plug";
    if (/câmera|camera|fechadura|porta|alarme|lock/i.test(text)) return "security";
    return "default";
  }

  function findCards(root) {
    const selector = 'button,[role="button"],[tabindex="0"],[class*="card"],[class*="Card"],[class*="device"],[class*="Device"]';
    const cards = [];
    for (const el of root.querySelectorAll?.(selector) || []) {
      if (!visible(el)) continue;
      const text = label(el);
      if (!text || text.length > 190 || !STATUS.test(text)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 150 || r.width > 650 || r.height < 54 || r.height > 230) continue;
      if (ROOM_NAMES.has(text)) continue;
      const clickable = el.matches('button,[role="button"],[tabindex="0"]') || getComputedStyle(el).cursor === "pointer";
      if (!clickable) continue;
      cards.push({ el, text, top: r.top, area: r.width * r.height });
    }
    // Nested wrappers can all match. Keep the largest clickable candidate at
    // nearly identical coordinates so each physical device receives one style.
    cards.sort((a, b) => b.area - a.area);
    const chosen = [];
    for (const card of cards) {
      const r = card.el.getBoundingClientRect();
      const duplicate = chosen.some(other => {
        const o = other.el.getBoundingClientRect();
        const overlapW = Math.max(0, Math.min(r.right, o.right) - Math.max(r.left, o.left));
        const overlapH = Math.max(0, Math.min(r.bottom, o.bottom) - Math.max(r.top, o.top));
        return overlapW * overlapH / Math.min(r.width * r.height, o.width * o.height) > .86;
      });
      if (!duplicate) chosen.push(card);
    }
    return chosen;
  }

  function markGrid(cards) {
    if (cards.length < 2) return;
    let parent = cards[0].el.parentElement;
    while (parent && parent !== document.body) {
      const cardSet = new Set(cards.map(card => card.el));
      const direct = [...parent.children].filter(child => cardSet.has(child));
      if (direct.length === cards.length && parent.children.length <= cards.length + 2) {
        parent.setAttribute("data-homehub-room-grid", "");
        return;
      }
      parent = parent.parentElement;
    }
  }

  function markIcon(card, kind) {
    const icons = card.el.querySelectorAll("svg,md-icon,mat-icon,ha-icon,[role=img]");
    let chosen = null;
    const cardRect = card.el.getBoundingClientRect();
    for (const icon of icons) {
      const r = icon.getBoundingClientRect();
      if (r.width < 10 || r.width > 52 || r.height < 10 || r.height > 52) continue;
      if (r.left > cardRect.left + cardRect.width * .42) continue;
      if (!chosen || r.left < chosen.getBoundingClientRect().left) chosen = icon;
    }
    if (chosen) chosen.setAttribute("data-homehub-original-icon", "");
    card.el.setAttribute("data-homehub-kind", kind);
  }

  function scan() {
    queued = false;
    const allRooms = [];
    const allCards = [];
    for (const root of roots()) {
      style(root);
      observe(root);
      const rooms = findRoomTitles(root);
      const cards = findCards(root);
      markRoomNav(root);
      allRooms.push(...rooms);
      allCards.push(...cards);
      for (const room of rooms) room.el.setAttribute("data-homehub-room-title", "");
      for (const card of cards) {
        card.el.setAttribute("data-homehub-card", "");
        markIcon(card, kindOf(card.text));
      }
    }

    // Apply the responsive grid to groups of cards immediately below a room
    // heading when their page order makes the grouping unambiguous.
    const byRoomName = new Map();
    for (const room of allRooms) {
      const prev = byRoomName.get(room.text);
      if (!prev || room.left > prev.left) byRoomName.set(room.text, room);
    }
    const rooms = [...byRoomName.values()].sort((a, b) => a.top - b.top);
    if (!rooms.length) return;
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      const nextTop = rooms[i + 1]?.top ?? Infinity;
      const group = allCards.filter(card => card.top > room.top && card.top < nextTop);
      if (group.length > 1) markGrid(group);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    setTimeout(scan, 250);
  }

  function observe(root) {
    if (!root || root.__homeHubObserver) return;
    try {
      Object.defineProperty(root, "__homeHubObserver", { value: true });
      new MutationObserver(schedule).observe(root, { childList: true, subtree: true, characterData: true });
    } catch (_) { /* Some browser-managed roots cannot be observed. */ }
  }

  const boot = setInterval(() => {
    if (!document.documentElement) return;
    clearInterval(boot);
    observe(document.documentElement);
    scan();
  }, 80);
})();
