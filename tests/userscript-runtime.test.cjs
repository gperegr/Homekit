const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const adapter=fs.readFileSync(path.join(root,'scripts/userscript-runtime.js'),'utf8');
const worker=fs.readFileSync(path.join(root,'chrome-extension/weather-worker.js'),'utf8')
  .replace('const extensionApi=globalThis.browser||globalThis.chrome;',
    'const extensionApi=homeHubUserscriptApi;const fetch=homeHubUserscriptFetch;');
const location={name:'São Paulo',latitude:-23.55,longitude:-46.63};
function harness(handler){
  const data={},requests=[];
  const time=Math.floor(Date.now()/1000);
  const forecast={timezone:'America/Sao_Paulo',current:{time,temperature_2m:21,weather_code:3,is_day:0},hourly:{time:[time+3600],temperature_2m:[20]},daily:{time:[time],temperature_2m_max:[23],temperature_2m_min:[18]}};
  const context=vm.createContext({URL,URLSearchParams,AbortSignal,DOMException,Intl,Date,Map,Math,Number,Error,TypeError,
    location:{origin:'https://home.google.com',href:'https://home.google.com/home/test/devices'},
    GM:{
      async getValue(key){return data[key];},async setValue(key,value){data[key]=value;},
      xmlHttpRequest(request){
        requests.push(request);
        const handle={aborted:false,abort(){this.aborted=true;request.onabort();}};
        if(handler)handler(request,handle);
        else queueMicrotask(()=>request.onload({status:200,finalUrl:request.url,response:
          request.url.includes('geocoding-api')?{results:[{name:'São Paulo',latitude:-23.55,longitude:-46.63}]}:forecast}));
        return handle;
      }
    }
  });
  vm.runInContext(adapter+'\n(()=>{'+worker+'})();',context);
  const send=vm.runInContext('message=>homeHubUserscriptApi.runtime.sendMessage(message)',context);
  const fetch=vm.runInContext('(url,options)=>homeHubUserscriptFetch(url,options)',context);
  return {context,data,requests,fetch,send(action,values={}){return send({namespace:'homehub-weather',action,...values});}};
}
test('userscript: inicia sem rede, busca cidade e persiste previsão em GM',async()=>{
  const app=harness();assert.equal((await app.send('init')).data.location,null);assert.equal(app.requests.length,0);
  const found=await app.send('search',{query:'São Paulo'});assert.equal(found.data.locations[0].name,'São Paulo');
  assert.equal((await app.send('select',{location})).data.forecast.current.temperature,21);
  assert.equal((await app.send('init')).data.location.name,'São Paulo');assert.equal(app.requests.length,2);
  assert.equal(app.data['homehub.weather.location'].name,'São Paulo');
  for(const request of app.requests){assert.equal(request.anonymous,true);assert.equal(request.method,'GET');assert.equal(request.timeout,12000);}
});
test('userscript: rejeita outras origens, serviços e ações',async()=>{
  const app=harness();
  for(const url of ['https://evil.example/','http://api.open-meteo.com/','https://api.open-meteo.com.evil.example/','https://api.open-meteo.com:8443/','https://user:pass@api.open-meteo.com/']){
    await assert.rejects(app.fetch(url),/não autorizado/);
  }
  assert.equal(app.requests.length,0);
  app.context.location.origin='https://accounts.google.com';await assert.rejects(app.send('init'),/Abra o Google Home/);
  app.context.location.origin='https://home.google.com';assert.equal((await app.send('bad-action')).ok,false);
});
test('userscript: timeout e cancelamento concluem a consulta',async()=>{
  const app=harness(()=>{});
  const pending=app.fetch('https://api.open-meteo.com/v1/forecast');app.requests[0].ontimeout();
  await assert.rejects(pending,{name:'TimeoutError'});
  const controller=new AbortController();const canceled=app.fetch('https://api.open-meteo.com/v1/forecast',{signal:controller.signal});controller.abort();
  await assert.rejects(canceled,{name:'AbortError'});
});
test('userscript: recusa resposta redirecionada para fora do serviço',async()=>{
  const app=harness(request=>queueMicrotask(()=>request.onload({status:200,finalUrl:'https://evil.example/',response:{}})));
  await assert.rejects(app.fetch('https://api.open-meteo.com/v1/forecast'),/Redirecionamento/);
});
test('userscript: falha mantém o cache com indicação de dados salvos',async()=>{
  const app=harness();await app.send('select',{location});app.data['homehub.weather.cache'].forecast.fetchedAt-=30*60*1000;
  app.context.GM.xmlHttpRequest=request=>{queueMicrotask(()=>request.onerror());return {abort(){}};};
  const response=await app.send('refresh');assert.equal(response.ok,true);assert.equal(response.data.forecast.stale,true);
});
test('bundle: só roda no Google Home e inclui código sem dependências remotas',()=>{
  const bundle=fs.readFileSync(path.join(root,'dist/HomeHub-Android.user.js'),'utf8');
  const metadata=bundle.slice(0,bundle.indexOf('// ==/UserScript=='));
  assert.deepEqual([...metadata.matchAll(/^\/\/ @match\s+(.*)$/gm)].map(match=>match[1]),['https://home.google.com/*']);
  assert.deepEqual([...metadata.matchAll(/^\/\/ @connect\s+(.*)$/gm)].map(match=>match[1]),['api.open-meteo.com','geocoding-api.open-meteo.com']);
  assert.doesNotMatch(metadata,/@require|unsafeWindow|@connect\s+\*/);
  assert.match(bundle,/__homeHubUserscriptLoaded/);assert.match(bundle,/const runtime=homeHubUserscriptApi.runtime/);
  new vm.Script(bundle);
});
