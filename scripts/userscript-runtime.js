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
