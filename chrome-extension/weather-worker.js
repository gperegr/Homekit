'use strict';

const WEATHER_KEY='homehub.weather.location';
const CACHE_KEY='homehub.weather.cache';
const CACHE_TTL=20*60*1000;
const pendingForecasts=new Map();

function validLocation(value) {
  if(!value||typeof value.name!=='string'||!value.name.trim()||value.name.length>120||
     !Number.isFinite(value.latitude)||Math.abs(value.latitude)>90||
     !Number.isFinite(value.longitude)||Math.abs(value.longitude)>180)throw Error('Selecione uma cidade válida.');
  return {
    name:value.name.trim(),latitude:value.latitude,longitude:value.longitude,
    region:typeof value.region==='string'?value.region.slice(0,120):'',
    country:typeof value.country==='string'?value.country.slice(0,120):''
  };
}
function locationKey(location) {return `${location.latitude.toFixed(4)},${location.longitude.toFixed(4)}`;}
async function requestJson(url) {
  const response=await fetch(url,{credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('O serviço de previsão está indisponível. Tente novamente.');
  const body=await response.json();
  if(body.error)throw Error('O serviço não conseguiu processar esta consulta.');
  return body;
}
async function searchCities(query) {
  if(typeof query!=='string'||query.trim().length<2||query.length>100)throw Error('Digite pelo menos duas letras do nome da cidade.');
  const url=new URL('https://geocoding-api.open-meteo.com/v1/search');
  url.search=new URLSearchParams({name:query.trim(),count:'6',language:'pt',format:'json'});
  const response=await requestJson(url);
  return (Array.isArray(response.results)?response.results:[]).filter(item=>Number.isFinite(item.latitude)&&Number.isFinite(item.longitude)&&typeof item.name==='string').map(item=>validLocation({
    name:item.name,latitude:item.latitude,longitude:item.longitude,region:item.admin1||'',country:item.country||''
  }));
}
function sanitizeForecast(data) {
  if(!data.current||!Number.isFinite(data.current.temperature_2m)||!Number.isFinite(data.current.time)||!Number.isFinite(data.current.weather_code))throw Error('O serviço retornou dados incompletos.');
  let timeZone=typeof data.timezone==='string'?data.timezone:'UTC';
  try{new Intl.DateTimeFormat('pt-BR',{timeZone}).format();}catch(_){timeZone='UTC';}
  const number=value=>Number.isFinite(value)?value:null;
  const current={
    time:data.current.time,temperature:number(data.current.temperature_2m),
    feelsLike:number(data.current.apparent_temperature),code:data.current.weather_code,
    isDay:data.current.is_day===1,humidity:number(data.current.relative_humidity_2m),wind:number(data.current.wind_speed_10m)
  };
  const hourly=[];
  for(let i=0;i<Math.min(data.hourly?.time?.length||0,160);i++) {
    const time=data.hourly.time[i],temperature=data.hourly.temperature_2m?.[i];
    if(Number.isFinite(time)&&Number.isFinite(temperature))hourly.push({
      time,temperature,code:number(data.hourly.weather_code?.[i]),
      precipitation:number(data.hourly.precipitation_probability?.[i]),isDay:data.hourly.is_day?.[i]===1
    });
  }
  const daily=[];
  for(let i=0;i<Math.min(data.daily?.time?.length||0,5);i++) {
    if(Number.isFinite(data.daily.time[i]))daily.push({
      time:data.daily.time[i],max:number(data.daily.temperature_2m_max?.[i]),
      min:number(data.daily.temperature_2m_min?.[i]),code:number(data.daily.weather_code?.[i])
    });
  }
  return {current,hourly,daily,timeZone,fetchedAt:Date.now(),stale:false};
}
async function forecastFor(location,force=false) {
  const key=locationKey(location);
  const stored=await chrome.storage.local.get(CACHE_KEY);
  const cache=stored[CACHE_KEY];
  const matching=cache?.key===key&&cache.forecast?.current&&Number.isFinite(cache.forecast.fetchedAt)?cache.forecast:null;
  const age=matching?Date.now()-matching.fetchedAt:Infinity;
  if(matching&&age>=0&&age<(force?60*1000:CACHE_TTL))return {...matching,stale:false};
  if(pendingForecasts.has(key))return pendingForecasts.get(key);
  const task=(async()=>{
    try {
      const url=new URL('https://api.open-meteo.com/v1/forecast');
      url.search=new URLSearchParams({
        latitude:String(location.latitude),longitude:String(location.longitude),
        current:'temperature_2m,apparent_temperature,is_day,weather_code,relative_humidity_2m,wind_speed_10m',
        hourly:'temperature_2m,precipitation_probability,weather_code,is_day',
        daily:'weather_code,temperature_2m_max,temperature_2m_min',
        timezone:'auto',timeformat:'unixtime',forecast_days:'5',temperature_unit:'celsius',wind_speed_unit:'kmh'
      });
      const forecast=sanitizeForecast(await requestJson(url));
      await chrome.storage.local.set({[CACHE_KEY]:{key,forecast}});return forecast;
    } catch(error) {
      if(matching)return {...matching,stale:true};
      throw error;
    }
  })();
  pendingForecasts.set(key,task);
  try{return await task;}finally{pendingForecasts.delete(key);}
}
async function weatherState(force=false) {
  const saved=await chrome.storage.local.get(WEATHER_KEY);
  if(!saved[WEATHER_KEY])return {location:null,forecast:null};
  const location=validLocation(saved[WEATHER_KEY]);
  try{return {location,forecast:await forecastFor(location,force)};}
  catch(_){return {location,forecast:null,error:'Não foi possível atualizar o tempo. Verifique sua conexão e tente novamente.'};}
}
async function handleWeather(message) {
  switch(message.action) {
    case 'init':return weatherState();
    case 'refresh':return weatherState(true);
    case 'search':return {locations:await searchCities(message.query)};
    case 'select': {
      const location=validLocation(message.location);
      await chrome.storage.local.set({[WEATHER_KEY]:location});return weatherState();
    }
    default:throw Error('Consulta inválida.');
  }
}
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
  if(message?.namespace!=='homehub-weather'||sender.id!==chrome.runtime.id)return false;
  try{if(new URL(sender.url).origin!=='https://home.google.com')return false;}catch(_){return false;}
  handleWeather(message).then(data=>sendResponse({ok:true,data})).catch(error=>sendResponse({
    ok:false,error:error?.name==='TimeoutError'?'A consulta demorou mais que o esperado. Tente novamente.':['TypeError','SyntaxError','AbortError'].includes(error?.name)?'Não foi possível acessar o serviço de previsão. Verifique sua conexão e tente novamente.':error?.message||'Não foi possível consultar o tempo.'
  }));
  return true;
});
