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
