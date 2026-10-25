const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
const path=require('node:path');

const source=fs.readFileSync(path.join(__dirname,'../chrome-extension/weather-worker.js'),'utf8');
const location={name:'São Paulo',latitude:-23.55,longitude:-46.63,region:'São Paulo',country:'Brasil'};
const locationKey='homehub.weather.location';
const cacheKey='homehub.weather.cache';
function forecast() {
  const time=Math.floor(Date.now()/1000);
  return {timezone:'America/Sao_Paulo',current:{time,temperature_2m:24,apparent_temperature:25,is_day:1,weather_code:2,relative_humidity_2m:65,wind_speed_10m:11},hourly:{time:[time+3600],temperature_2m:[23],weather_code:[3],precipitation_probability:[20],is_day:[1]},daily:{time:[time],temperature_2m_max:[27],temperature_2m_min:[18],weather_code:[2]}};
}
function worker(fetcher=async()=>({ok:true,json:async()=>forecast()})) {
  let listener;const data={},requests=[];
  const context={URL,URLSearchParams,AbortSignal,Intl,Date,Map,Math,Number,Error,
    fetch:async(url,options)=>{requests.push({url:String(url),options});return fetcher(url,options);},
    chrome:{runtime:{id:'homehub-test',onMessage:{addListener(fn){listener=fn;}}},storage:{local:{
      async get(key){return {[key]:data[key]};},async set(values){Object.assign(data,values);}
    }}}
  };
  vm.runInNewContext(source,context,{filename:'weather-worker.js'});
  return {data,requests,send(action,values={},sender={id:'homehub-test',url:'https://home.google.com/home/test/devices'}){
    return new Promise(resolve=>{const result=listener({namespace:'homehub-weather',action,...values},sender,resolve);if(result===false)resolve({ignored:true});});
  }};
}

test('sem cidade selecionada não faz consulta externa',async()=>{
  const app=worker();const response=await app.send('init');
  assert.equal(response.ok,true);assert.equal(response.data.location,null);assert.equal(app.requests.length,0);
});
test('busca cidades em português e normaliza resultados',async()=>{
  const app=worker(async()=>({ok:true,json:async()=>({results:[{name:'São Paulo',latitude:-23.55,longitude:-46.63,admin1:'São Paulo',country:'Brasil'}]})}));
  const response=await app.send('search',{query:'São Paulo'});
  assert.equal(response.ok,true);assert.equal(response.data.locations[0].region,'São Paulo');
  const url=new URL(app.requests[0].url);assert.equal(url.hostname,'geocoding-api.open-meteo.com');assert.equal(url.searchParams.get('name'),'São Paulo');assert.equal(url.searchParams.get('language'),'pt');
});
test('persiste cidade, consulta previsão e reutiliza cache sem credenciais',async()=>{
  const app=worker();const first=await app.send('select',{location});const second=await app.send('init');
  assert.equal(first.data.forecast.current.temperature,24);assert.equal(first.data.forecast.daily[0].max,27);
  assert.equal(second.data.forecast.stale,false);assert.equal(app.data[locationKey].name,'São Paulo');assert.equal(app.requests.length,1);
  assert.equal(app.requests[0].options.credentials,'omit');assert.equal(app.requests[0].options.referrerPolicy,'no-referrer');
  const url=new URL(app.requests[0].url);assert.equal(url.hostname,'api.open-meteo.com');assert.equal(url.searchParams.get('timeformat'),'unixtime');assert.equal(url.searchParams.get('timezone'),'auto');
});
test('duas abas compartilham a mesma consulta em andamento',async()=>{
  let finish;const app=worker(()=>new Promise(resolve=>{finish=resolve;}));app.data[locationKey]=location;
  const first=app.send('init'),second=app.send('init');await new Promise(resolve=>setImmediate(resolve));
  assert.equal(app.requests.length,1);finish({ok:true,json:async()=>forecast()});
  const responses=await Promise.all([first,second]);assert.equal(responses.every(response=>response.ok&&response.data.forecast.current.temperature===24),true);
});
test('falha de rede mantém dados salvos com marcação explícita de desatualizados',async()=>{
  let fail=false;const app=worker(async()=>{if(fail)throw new TypeError('network');return {ok:true,json:async()=>forecast()};});
  await app.send('select',{location});app.data[cacheKey].forecast.fetchedAt-=25*60*1000;const savedAt=app.data[cacheKey].forecast.fetchedAt;fail=true;
  const response=await app.send('refresh');assert.equal(response.data.forecast.stale,true);assert.equal(response.data.forecast.fetchedAt,savedAt);assert.equal(response.data.forecast.current.temperature,24);
});
test('erro sem cache informa indisponibilidade e preserva a cidade escolhida',async()=>{
  const app=worker(async()=>{throw new TypeError('network');});const response=await app.send('select',{location});
  assert.equal(response.data.location.name,location.name);assert.equal(response.data.forecast,null);assert.match(response.data.error,/atualizar o tempo/);
});
test('recusa mensagens de outras origens e de outras extensões',async()=>{
  const app=worker();
  assert.equal((await app.send('init',{}, {id:'homehub-test',url:'https://home.google.com.evil.example/'})).ignored,true);
  assert.equal((await app.send('init',{}, {id:'other-extension',url:'https://home.google.com/'})).ignored,true);
  assert.equal(app.requests.length,0);
});
test('recusa coordenadas inválidas e ações arbitrárias',async()=>{
  const app=worker();const bad=await app.send('select',{location:{...location,latitude:100}});
  assert.equal(bad.ok,false);assert.equal(app.data[locationKey],undefined);assert.equal(app.requests.length,0);
  const action=await app.send('fetch',{url:'https://example.com/'});assert.equal(action.ok,false);assert.equal(app.requests.length,0);
});
