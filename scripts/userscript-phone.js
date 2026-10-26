// Android presentation controls; real Google device controls stay in their original DOM.
const homeHubPhonePreferences=await GM.getValue('homehub.android.preferences',{});
try{
  for(const [key,allowed] of Object.entries({theme:['light','dark'],dock:['expanded','compact']})){
    if(!sessionStorage.getItem('homehub.'+key)&&allowed.includes(homeHubPhonePreferences?.[key])){
      sessionStorage.setItem('homehub.'+key,homeHubPhonePreferences[key]);
    }
  }
}catch(_){}
const homeHubInteraction={active:false,until:0};
document.documentElement.setAttribute('data-homehub-android','');
const homeHubDashboard=document.createElement('main');
homeHubDashboard.id='homehub-dashboard';homeHubDashboard.setAttribute('aria-label','Painel da casa');
document.body.append(homeHubDashboard);

function homeHubStartPhoneUi(){
  const root=document.documentElement;
  const hiddenBars={rooms:homeHubPhonePreferences?.hiddenBars?.rooms===true,categories:homeHubPhonePreferences?.hiddenBars?.categories===true};
  const barButtons={};
  let effects=homeHubPhonePreferences?.effects==='reduced'?'reduced':'balanced';
  let ui,dialog,menu,effectsButton,header,categories,scrollHeading,frame=0,lastSaved='';
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
    const value={theme:root.dataset.homehubTheme,dock:root.dataset.homehubDock,effects,hiddenBars};
    const signature=JSON.stringify(value);
    if(signature===lastSaved)return;lastSaved=signature;
    GM.setValue('homehub.android.preferences',value).catch(()=>{});
  }
  function applyEffects(){
    root.dataset.homehubEffects=effects;
    if(effectsButton)effectsButton.setAttribute('aria-pressed',String(effects==='reduced'));
  }
  function applyBars(){
    for(const [key,name] of [['rooms','cômodos'],['categories','categorias']]){
      root.setAttribute('data-homehub-hide-'+key,String(hiddenBars[key]));
      const button=barButtons[key];
      if(button){label(button,(hiddenBars[key]?'Mostrar':'Ocultar')+' barra de '+name);button.setAttribute('aria-pressed',String(hiddenBars[key]));}
    }
  }
  let screen='dashboard',pager;
  function showScreen(next){
    screen=next;root.dataset.homehubScreen=screen;
    const devices=document.querySelector('ghw-devices');
    for(const [element,hidden] of [[homeHubDashboard,screen!=='dashboard'],[devices,screen!=='devices']]){
      if(element){element.inert=hidden&&root.hasAttribute('data-homehub-active');element.setAttribute('aria-hidden',String(hidden&&root.hasAttribute('data-homehub-active')));}
    }
    categories?.toggleAttribute('inert',screen!=='devices');
    if(pager)for(const button of pager.children)button.setAttribute('aria-current',String(button.dataset.screen===screen));
  }
  function moveHeading(){
    const scroller=document.querySelector('ghw-devices .devices-container > mat-sidenav-content');
    if(header&&header.parentElement!==ui)ui.append(header);
    if(root.hasAttribute('data-homehub-active')&&scroller){
      if(!scrollHeading){scrollHeading=document.createElement('div');scrollHeading.id='homehub-scroll-heading';}
      if(scrollHeading.parentElement!==scroller)scroller.prepend(scrollHeading);
      if(categories&&categories.parentElement!==scrollHeading)scrollHeading.append(categories);
    }else{if(categories&&categories.parentElement!==ui)ui.append(categories);scrollHeading?.remove();}
    showScreen(screen);
  }
  function mount(host){
    ui=host;
    header=ui.querySelector('.hh-header')||header;if(!header)return;
    categories=ui.querySelector('.hh-categories')||categories;
    dialog=document.createElement('dialog');dialog.id='homehub-phone-tools';dialog.setAttribute('aria-labelledby','homehub-phone-tools-title');
    const heading=document.createElement('div');heading.className='hh-phone-tools-heading';
    const title=document.createElement('h2');title.id='homehub-phone-tools-title';title.textContent='Opções da casa';
    const close=document.createElement('button');close.type='button';close.className='hh-phone-close';close.setAttribute('aria-label','Fechar opções');close.textContent='×';close.addEventListener('click',()=>dialog.close());
    heading.append(title,close);dialog.append(heading);
    effectsButton=document.createElement('button');effectsButton.type='button';effectsButton.className='hh-phone-action hh-effects-toggle';
    effectsButton.append(svg('m12 3 2.3 6.7L21 12l-6.7 2.3L12 21l-2.3-6.7L3 12l6.7-2.3Z'));
    label(effectsButton,'Reduzir efeitos visuais');
    effectsButton.addEventListener('click',()=>{effects=effects==='reduced'?'balanced':'reduced';applyEffects();save();});
    dialog.append(effectsButton);
    for(const [key,path] of [['rooms','M3 10 12 3l9 7M5 9v12h14V9M9 21v-8h6v8'],['categories','M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z']]){
      const button=document.createElement('button');button.type='button';button.className='hh-phone-action hh-hide-'+key;
      button.setAttribute('aria-controls',key==='rooms'?'homehub-dock':'homehub-scroll-heading');
      button.append(svg(path));button.addEventListener('click',()=>{hiddenBars[key]=!hiddenBars[key];applyBars();save();});
      barButtons[key]=button;dialog.append(button);
    }
    applyBars();ui.append(dialog);
    pager=document.createElement('nav');pager.id='homehub-pages';pager.setAttribute('aria-label','Telas da casa');
    for(const [name,text] of [['dashboard','Painel'],['devices','Aparelhos']]){
      const button=document.createElement('button');button.type='button';button.dataset.screen=name;
      button.setAttribute('aria-label',text);button.addEventListener('click',()=>showScreen(name));pager.append(button);
    }
    ui.append(pager);
    ui.querySelector('.hh-dock')?.addEventListener('click',()=>showScreen('devices'));

    menu=document.createElement('button');menu.type='button';menu.className='hh-tool-button hh-tools-toggle';menu.setAttribute('aria-label','Opções da casa');menu.setAttribute('aria-haspopup','dialog');menu.setAttribute('aria-controls',dialog.id);
    menu.append(svg('M5 12h.01M12 12h.01M19 12h.01'));menu.addEventListener('click',()=>{if(!dialog.open)dialog.showModal();});header.append(menu);
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
    if(host!==ui||!dialog)mount(host);
    if(!dialog)return;
    moveHeading();
    const overviewLabel=ui.querySelector('.hh-dock > .hh-nav .hh-button-label');
    if(overviewLabel&&overviewLabel.textContent!=='Casa')overviewLabel.textContent='Casa';
    for(const selector of ['.hh-theme','.hh-ambient-toggle','.hh-dock-toggle','.hh-fullscreen-toggle']){
      const button=ui.querySelector(selector)||header?.querySelector(selector);if(!button)continue;
      const visible=selector==='.hh-theme'||selector==='.hh-ambient-toggle';
      button.classList.toggle('hh-phone-action',!visible);
      const parent=visible?header:dialog;if(button.parentElement!==parent)parent.append(button);
      if(selector==='.hh-fullscreen-toggle')label(button,document.fullscreenElement?'Sair da tela cheia':'Entrar em tela cheia');

      if(selector==='.hh-theme')label(button,root.dataset.homehubTheme==='dark'?'Usar aparência clara':'Usar aparência escura');
      if(selector==='.hh-dock-toggle')label(button,root.dataset.homehubDock==='compact'?'Mostrar nomes dos cômodos':'Compactar barra de cômodos');
      if(selector==='.hh-ambient-toggle'){
        label(button,'Relógio em tela cheia');
        button.title='Relógio em tela cheia';button.setAttribute('aria-label','Relógio em tela cheia');
      }
    }
    if((host.hidden||!root.hasAttribute('data-homehub-active'))&&dialog.open)dialog.close();
    applyEffects();applyBars();save();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
  new MutationObserver(changes=>{
    if(changes.some(change=>{
      if(change.type==='attributes')return (change.target===root||change.target===ui)&&change.oldValue!==change.target.getAttribute(change.attributeName);
      return [...change.addedNodes,...change.removedNodes].some(node=>node.nodeType===1&&
        (node.matches('#homehub-ui,ghw-devices,mat-sidenav-content,.devices-container')||node.querySelector('#homehub-ui,ghw-devices,mat-sidenav-content,.devices-container')));
    }))schedule();
  }).observe(root,{childList:true,subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['data-homehub-active','data-homehub-theme','data-homehub-dock','hidden']});
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
  let touch,suppressClickUntil=0,dragFrame=0;
  const settling=new Set();
  function paintDrag(){
    dragFrame=0;if(!touch?.horizontal)return;
    const dx=touch.offset;
    homeHubDashboard.style.transform='translateX('+((touch.screen==='devices'?touch.width:0)+dx)+'px)';
    if(touch.devices)touch.devices.style.transform='translateX('+((touch.screen==='dashboard'?-touch.width:0)+dx)+'px)';
  }
  function finishDrag(cancelled=false){
    if(!touch)return;
    const drag=touch;touch=null;
    homeHubInteraction.active=false;homeHubInteraction.until=performance.now()+80;
    drag.card?.removeAttribute('data-homehub-pressed');
    if(drag.moved||(cancelled&&drag.card))suppressClickUntil=performance.now()+500;
    if(dragFrame){cancelAnimationFrame(dragFrame);dragFrame=0;}
    if(!drag.horizontal)return;
    const forward=drag.screen==='dashboard'?1:-1;
    const velocity=performance.now()-drag.lastTime<90?drag.velocity:0;
    const advance=!cancelled&&(drag.dx*forward>drag.width*.23||
      (drag.dx*forward>24&&velocity*forward>.45));
    const next=advance?(drag.screen==='dashboard'?'devices':'dashboard'):drag.screen;
    showScreen(next);
    const reduced=effects==='reduced'||matchMedia('(prefers-reduced-motion:reduce)').matches;
    // Explicit start/end transforms avoid forcing a layout read on release.
    for(const [panel,start,end] of [[homeHubDashboard,(drag.screen==='devices'?drag.width:0)+drag.offset,next==='devices'?drag.width:0],
      [drag.devices,(drag.screen==='dashboard'?-drag.width:0)+drag.offset,next==='dashboard'?-drag.width:0]]){
      if(!panel)continue;
      if(!reduced&&Math.abs(start-end)>.5){
        const animation=panel.animate([{transform:'translateX('+start+'px)'},{transform:'translateX('+end+'px)'}],
          {duration:220,easing:'cubic-bezier(.2,.8,.25,1)'});
        settling.add(animation);animation.finished.catch(()=>{}).finally(()=>settling.delete(animation));
      }
      panel.style.removeProperty('transform');
    }
    root.removeAttribute('data-homehub-dragging');
  }
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='touch'||!event.isPrimary){if(touch)finishDrag(true);return;}
    suppressClickUntil=0;
    if(!root.hasAttribute('data-homehub-active')||document.querySelector('dialog[open]'))return;
    if(event.target.closest('input,textarea,select,a,[contenteditable=true],.hh-rooms,.hh-categories')||
      (event.target.closest('button')&&!event.target.closest('[data-homehub-card]')))return;
    for(const animation of settling)animation.cancel();settling.clear();
    const card=event.target.closest('[data-homehub-card]');
    if(card){event.stopPropagation();card.setAttribute('data-homehub-pressed','');}
    homeHubInteraction.active=true;
    touch={id:event.pointerId,x:event.clientX,y:event.clientY,lastX:event.clientX,lastTime:performance.now(),
      velocity:0,dx:0,offset:0,card,moved:false,vertical:false,width:innerWidth,screen,devices:document.querySelector('ghw-devices')};
  },{passive:true,capture:true});
  document.addEventListener('pointermove',event=>{
    if(!touch||event.pointerId!==touch.id)return;
    if(touch.card)event.stopPropagation();
    const dx=event.clientX-touch.x,dy=event.clientY-touch.y;
    if(touch.vertical)return;
    if(!touch.horizontal){
      if(Math.max(Math.abs(dx),Math.abs(dy))<8)return;
      touch.moved=true;touch.card?.removeAttribute('data-homehub-pressed');suppressClickUntil=performance.now()+500;
      if(Math.abs(dx)<Math.abs(dy)*1.25){touch.vertical=true;return;}
      touch.horizontal=true;root.setAttribute('data-homehub-dragging','');
    }
    event.stopPropagation();
    const now=performance.now(),elapsed=now-touch.lastTime;
    if(elapsed>0)touch.velocity=(event.clientX-touch.lastX)/elapsed;
    touch.lastX=event.clientX;touch.lastTime=now;touch.dx=dx;
    const direction=touch.screen==='dashboard'?1:-1;
    touch.offset=dx*direction<0?dx*.18:Math.sign(dx)*Math.min(Math.abs(dx),touch.width);
    if(!dragFrame)dragFrame=requestAnimationFrame(paintDrag);
  },{passive:true,capture:true});
  document.addEventListener('pointerup',event=>{
    if(!touch||event.pointerId!==touch.id)return;
    if(touch.card||touch.horizontal)event.stopPropagation();finishDrag();
  },{passive:true,capture:true});
  document.addEventListener('pointercancel',event=>{if(event.pointerId===touch?.id)finishDrag(true);},{passive:true,capture:true});
  // All touch listeners are passive: native vertical scrolling never waits for a cancellable JS handler.
  for(const type of ['touchstart','touchmove','touchend'])document.addEventListener(type,event=>{
    if(root.hasAttribute('data-homehub-active')&&event.target.closest('[data-homehub-card]')&&
      !event.target.closest('input,textarea,select,[contenteditable=true]'))event.stopPropagation();
  },{passive:true,capture:true});
  document.addEventListener('scroll',event=>{
    if(event.target?.closest?.('ghw-devices'))homeHubInteraction.until=performance.now()+100;
  },{passive:true,capture:true});
  window.addEventListener('resize',()=>finishDrag(true));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)finishDrag(true);});
  document.addEventListener('click',event=>{if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}},true);
  document.addEventListener('keydown',event=>{
    if(event.target.closest('input,textarea,button')||document.querySelector('dialog[open]'))return;
    if(event.key==='ArrowRight')showScreen('devices');if(event.key==='ArrowLeft')showScreen('dashboard');
  });
  sync();
}

