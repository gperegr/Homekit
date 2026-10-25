(() => {
  'use strict';
  const paths = {
    home:'m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9',
    room:'M5 21V3h13v18M18 21h3M5 21H2M13 12h.01',
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
    chevron:'m7 10 5 5 5-5',
    other:'M5 5h14v14H5zM9 9h6v6H9z'
  };
  const categories = [
    ['all','Todos','grid'],['light','Iluminação','light'],['plug','Tomadas','plug'],
    ['media','Mídia','media'],['security','Segurança','lock'],['climate','Clima','climate'],['other','Outros','other']
  ];
  const memory = {enabled:true,theme:'light',room:null,category:'all',roomSignature:'',categorySignature:''};
  try {memory.enabled=sessionStorage.getItem('homehub.original')!=='1';memory.theme=sessionStorage.getItem('homehub.theme')||'light';} catch (_) {}
  let ui=null,refs={},queued=false,records=[];

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
    const result=node('button',{class:className,type:'button'},[symbol(kind),node('span',{},[label])]);
    result.addEventListener('click',action);return result;
  }
  function save(key,value) {try{sessionStorage.setItem(key,value);}catch(_) {}}
  function toggleOriginal(enabled) {
    memory.enabled=enabled;save('homehub.original',enabled?'0':'1');render();
  }
  function refreshView() {
    render();document.querySelector('ghw-devices .devices-container > mat-sidenav-content')?.scrollTo({top:0});
  }
  function makeUi() {
    ui=node('div',{id:'homehub-ui'});
    const sidebar=node('aside',{class:'hh-sidebar','aria-label':'Navegação da casa'});
    const brandIcon=node('span',{class:'hh-brand-icon'},[symbol('home')]);
    refs.house=node('div',{class:'hh-brand-name'},['Minha Casa']);
    sidebar.append(node('div',{class:'hh-brand'},[brandIcon,node('div',{},[refs.house,node('div',{class:'hh-brand-sub'},['SEUS ACESSÓRIOS'])])]));
    refs.overview=button('hh-nav','Visão geral','grid',()=>{memory.room=null;memory.category='all';refreshView();});
    sidebar.append(refs.overview,node('div',{class:'hh-section-label'},['CÔMODOS']));
    refs.rooms=node('nav',{class:'hh-rooms','aria-label':'Cômodos'});sidebar.append(refs.rooms);
    const original=button('hh-original','Ver Google Home','external',()=>toggleOriginal(false));
    sidebar.append(node('div',{class:'hh-sidebar-bottom'},[original]));
    const header=node('header',{class:'hh-header'});
    refs.date=node('div',{class:'hh-date'},[new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(new Date())]);
    refs.title=node('h1',{},['Visão geral']);refs.summary=node('div',{class:'hh-summary'});
    refs.mobile=node('select',{class:'hh-mobile-room','aria-label':'Selecionar cômodo'});
    refs.mobile.addEventListener('change',()=>{memory.room=refs.mobile.value||null;memory.category='all';refreshView();});
    header.append(node('div',{class:'hh-heading'},[refs.date,refs.title,refs.summary,refs.mobile]));
    refs.theme=node('button',{class:'hh-theme',type:'button','aria-label':'Alternar aparência'});
    refs.theme.addEventListener('click',()=>{memory.theme=memory.theme==='dark'?'light':'dark';save('homehub.theme',memory.theme);render();});header.append(refs.theme);
    refs.categories=node('nav',{class:'hh-categories','aria-label':'Categorias de acessórios'});
    refs.empty=node('div',{class:'hh-empty',role:'status'},['Nenhum acessório nesta categoria.']);refs.empty.hidden=true;
    const restore=node('button',{class:'hh-restore',type:'button'},['Ativar Home Hub']);restore.addEventListener('click',()=>toggleOriginal(true));
    ui.append(sidebar,header,refs.categories,refs.empty,restore);document.body.append(ui);
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
    ui.dataset.original=String(!memory.enabled);
    if(!memory.enabled)return;
    const rooms=[...new Set(records.map(record=>record.room))];
    if(memory.room&&!rooms.includes(memory.room))memory.room=null;
    const roomSignature=JSON.stringify(rooms.map(name=>[name,records.filter(r=>r.room===name).length]));
    if(memory.roomSignature!==roomSignature) {
      memory.roomSignature=roomSignature;
      refs.rooms.replaceChildren();refs.mobile.replaceChildren(node('option',{value:''},['Visão geral']));
      for(const room of rooms) {
        const count=records.filter(record=>record.room===room).length;
        const entry=button('hh-nav',room,'room',()=>{memory.room=room;memory.category='all';refreshView();});
        entry.dataset.room=room;entry.append(node('span',{class:'hh-count'},[String(count)]));refs.rooms.append(entry);
        refs.mobile.append(node('option',{value:room},[room]));
      }
    }
    refs.overview.setAttribute('aria-pressed',String(!memory.room));
    for(const entry of refs.rooms.children)entry.setAttribute('aria-pressed',String(entry.dataset.room===memory.room));
    refs.mobile.value=memory.room||'';
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
    if(!app) {document.documentElement.removeAttribute('data-homehub-active');if(ui)ui.hidden=true;return;}
    if(!document.body)return;
    if(!ui)makeUi();ui.hidden=false;
    const house=document.querySelector('ghw-toolbar .home-nav');
    if(house) {
      const clone=house.cloneNode(true);clone.querySelectorAll('mat-icon,svg,script').forEach(n=>n.remove());
      const name=clone.textContent.replace(/\s+/g,' ').trim();if(name&&name.length<60)text(refs.house,name);
    }
    records=collect(app);render();
  }
  function schedule(changes) {
    if(changes?.every(change=>{const el=change.target.nodeType===1?change.target:change.target.parentElement;return el?.closest('#homehub-ui,.homehub-symbol,.homehub-room-label');}))return;
    if(queued)return;queued=true;setTimeout(apply,100);
  }
  function start() {
    new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','aria-disabled']});apply();
  }
  if(document.documentElement)start();else document.addEventListener('DOMContentLoaded',start,{once:true});
})();
