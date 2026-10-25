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
        const icon=card.querySelector('.icon');
        const iconText=(icon?.querySelector('mat-icon')?.textContent||'').trim().toLowerCase();
        const [category,kind]=typeOf(card,iconText);
        card.dataset.homehubCard='';card.dataset.homehubKind=kind;
        if(icon) {
          icon.dataset.homehubSymbol='';
          const old=icon.querySelector('.homehub-symbol');
          if(!old||old.dataset.kind!==kind) {
            old?.remove();const svg=symbol(kind);svg.classList.add('homehub-symbol');svg.dataset.kind=kind;icon.append(svg);
          }
        }
        const expand=tile.querySelector('.expand-button');
        if(expand) {
          card.dataset.homehubGroup='true';expand.dataset.homehubSymbol='';
          if(!expand.querySelector('.homehub-symbol')){const arrow=symbol('chevron');arrow.classList.add('homehub-symbol');expand.append(arrow);}
        }
        let roomLabel=card.querySelector(':scope > .homehub-room-label');
        if(!roomLabel){roomLabel=node('span',{class:'homehub-room-label','aria-hidden':'true'});card.append(roomLabel);}
        text(roomLabel,room);
        const content=card.querySelector('.content');
        if(content&&!content.querySelector('.subtitle,span:not(.homehub-native-status)')&&!content.querySelector('.homehub-native-status')) {
          content.append(node('span',{class:'homehub-native-status'},[card.classList.contains('readonly')?'Sem controles disponíveis':'Disponível']));
        }
        const offline=card.classList.contains('offline');
        result.push({tile,card,room,category,kind,offline,on:card.classList.contains('active')&&!offline});
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
