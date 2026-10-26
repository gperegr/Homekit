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
