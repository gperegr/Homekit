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
const homeHubDashboard=document.createElement('main');
homeHubDashboard.id='homehub-dashboard';homeHubDashboard.setAttribute('aria-label','Painel da casa');
document.body.append(homeHubDashboard);

function homeHubStartPhoneUi(){
  const root=document.documentElement;
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
    const value={theme:root.dataset.homehubTheme,dock:root.dataset.homehubDock,effects};
    const signature=JSON.stringify(value);
    if(signature===lastSaved)return;lastSaved=signature;
    GM.setValue('homehub.android.preferences',value).catch(()=>{});
  }
  function applyEffects(){
    root.dataset.homehubEffects=effects;
    if(effectsButton)effectsButton.setAttribute('aria-pressed',String(effects==='reduced'));
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
    dialog.append(effectsButton);ui.append(dialog);
    pager=document.createElement('nav');pager.id='homehub-pages';pager.setAttribute('aria-label','Telas da casa');
    for(const [name,text] of [['dashboard','Painel'],['devices','Aparelhos']]){
      const button=document.createElement('button');button.type='button';button.dataset.screen=name;
      button.textContent=text;button.addEventListener('click',()=>showScreen(name));pager.append(button);
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
    applyEffects();save();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(sync);}
  new MutationObserver(changes=>{
    if(changes.every(change=>{
      const target=change.target.nodeType===1?change.target:change.target.parentElement;
      if(change.type==='attributes')return target!==root&&target!==ui;
      return !!target?.closest('#homehub-widgets,[data-homehub-card],.homehub-symbol,.homehub-room-label');
    }))return;
    schedule();
  }).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['data-homehub-active','data-homehub-theme','data-homehub-dock','hidden']});
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
  let touch,suppressClickUntil=0;
  document.addEventListener('touchstart',event=>{
    if(!root.hasAttribute('data-homehub-active')||event.touches.length!==1||document.querySelector('dialog[open]'))return;
    if(event.target.closest('button,input,a,.hh-rooms,.hh-categories'))return;
    const point=event.touches[0];touch={x:point.clientX,y:point.clientY,time:performance.now()};
  },{passive:true});
  document.addEventListener('touchend',event=>{
    if(!touch)return;const start=touch;touch=null;const point=event.changedTouches[0];if(!point)return;
    const dx=point.clientX-start.x,dy=point.clientY-start.y;
    if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.5||performance.now()-start.time>800)return;
    suppressClickUntil=performance.now()+400;
    if(dx>0&&screen==='dashboard')showScreen('devices');
    else if(dx<0&&screen==='devices')showScreen('dashboard');
    else if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&effects!=='reduced'){
      const panel=screen==='dashboard'?homeHubDashboard:document.querySelector('ghw-devices');
      panel?.animate([{translate:'0'},{translate:(Math.sign(dx)*18)+'px'},{translate:'0'}],{duration:260,easing:'ease-out'});
    }
  },{passive:true});
  document.addEventListener('click',event=>{if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}},true);
  document.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
  document.addEventListener('keydown',event=>{
    if(event.target.closest('input,textarea,button')||document.querySelector('dialog[open]'))return;
    if(event.key==='ArrowRight')showScreen('devices');if(event.key==='ArrowLeft')showScreen('dashboard');
  });
  sync();
}

