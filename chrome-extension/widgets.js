(() => {
  'use strict';
  const NS='http://www.w3.org/2000/svg';
  const REFRESH=20*60*1000;
  const IDLE_DELAY=60*1000;

  function svgNode(tag,attrs={}) {
    const element=document.createElementNS(NS,tag);
    for(const [key,value] of Object.entries(attrs))element.setAttribute(key,value);
    return element;
  }
  function condition(code,isDay=true) {
    if(code===0)return {kind:isDay?'clear':'night',label:isDay?'Céu limpo':'Noite limpa'};
    if(code===1)return {kind:isDay?'clear':'night',label:'Predominantemente limpo'};
    if(code===2)return {kind:'partly',label:'Parcialmente nublado'};
    if(code===3)return {kind:'cloudy',label:'Nublado'};
    if(code===45||code===48)return {kind:'fog',label:'Nevoeiro'};
    if([71,73,75,77,85,86].includes(code))return {kind:'snow',label:'Neve'};
    if(code>=95)return {kind:'storm',label:'Tempestade'};
    if(code>=51&&code<=57)return {kind:'rain',label:'Garoa'};
    if(code>=61&&code<=67)return {kind:'rain',label:'Chuva'};
    if(code>=80&&code<=82)return {kind:'rain',label:'Pancadas de chuva'};
    return {kind:'cloudy',label:'Condição não informada'};
  }
  function weatherIcon(code,isDay=true) {
    const {kind}=condition(code,isDay);
    const svg=svgNode('svg',{viewBox:'0 0 64 64','aria-hidden':'true',class:'hhw-weather-icon'});
    const sun=(cx,cy,r)=>{
      const group=svgNode('g',{fill:'none',stroke:'#ffe28b','stroke-width':'2.6','stroke-linecap':'round'});
      group.append(svgNode('circle',{cx,cy,r,fill:'#ffe28b',stroke:'none'}));
      for(let i=0;i<8;i++){
        const a=i*Math.PI/4;
        group.append(svgNode('line',{x1:cx+Math.cos(a)*(r+4),y1:cy+Math.sin(a)*(r+4),x2:cx+Math.cos(a)*(r+8),y2:cy+Math.sin(a)*(r+8)}));
      }
      svg.append(group);
    };
    if(kind==='clear')sun(32,31,12);
    else if(kind==='night')svg.append(svgNode('path',{d:'M43 44A21 21 0 0 1 22 13a21 21 0 1 0 21 31Z',fill:'#f7e5b8'}));
    else {
      if(kind==='partly'&&isDay)sun(22,22,9);
      if(kind==='partly'&&!isDay)svg.append(svgNode('path',{d:'M32 28A14 14 0 0 1 19 10a14 14 0 1 0 13 18Z',fill:'#f7e5b8'}));
      svg.append(svgNode('path',{d:'M17 44a10 10 0 0 1-1-20 15 15 0 0 1 29-2 11 11 0 1 1 3 22Z',fill:kind==='storm'?'#d9e5f2':'#f1f6fc'}));
      if(kind==='rain')for(const x of [22,33,44])svg.append(svgNode('path',{d:`m${x} 49-3 7`,stroke:'#a9d5ff','stroke-width':'2.7','stroke-linecap':'round'}));
      if(kind==='snow')for(const x of [22,33,44])svg.append(svgNode('path',{d:`M${x} 49v8m-3-6 6 4m-6 0 6-4`,stroke:'#d5e8ff','stroke-width':'1.6','stroke-linecap':'round'}));
      if(kind==='storm')svg.append(svgNode('path',{d:'m34 43-8 12h7l-1 7 10-13h-7l2-6Z',fill:'#ffe08a'}));
      if(kind==='fog')svg.append(svgNode('path',{d:'M14 50h36M19 56h26',stroke:'#e1eaf4','stroke-width':'3','stroke-linecap':'round'}));
    }
    return svg;
  }

  function create({node,symbol}) {
    let active=false,clockTimer=0,refreshTimer=0,idleTimer=0,initialized=false,weatherSequence=0,searchSequence=0,lastActivity=Date.now();
    let lastState={location:null,forecast:null},pending=false;
    let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1),calendarToday='';
    const root=node('section',{id:'homehub-widgets','aria-label':'Relógio, tempo e calendário'});
    const clock=node('section',{class:'hhw-clock','aria-label':'Relógio local'});
    const face=svgNode('svg',{viewBox:'0 0 200 200',role:'img',class:'hhw-clock-face'});
    const ticks=svgNode('g');
    for(let i=0;i<60;i++) {
      const major=i%5===0,a=i*Math.PI/30;
      ticks.append(svgNode('line',{
        x1:100+Math.sin(a)*(major?87:91),y1:100-Math.cos(a)*(major?87:91),
        x2:100+Math.sin(a)*96,y2:100-Math.cos(a)*96,
        class:major?'hhw-clock-tick-major':'hhw-clock-tick'
      }));
    }
    face.append(ticks);
    for(let i=1;i<=12;i++){
      const a=i*Math.PI/6,label=svgNode('text',{x:100+Math.sin(a)*74,y:100-Math.cos(a)*74+6,'text-anchor':'middle',class:'hhw-clock-number'});
      label.textContent=String(i);face.append(label);
    }
    const hands={};
    for(const [name,length,width] of [['hour',43,6.5],['minute',65,5],['second',83,1.25]]){
      const group=svgNode('g',{'data-hand':name});
      group.append(svgNode('line',{x1:100,y1:name==='second'?119:106,x2:100,y2:100-length,'stroke-width':width,'stroke-linecap':'round',class:'hhw-hand-'+name}));
      hands[name]=group;face.append(group);
    }
    face.append(svgNode('circle',{cx:100,cy:100,r:4,fill:'#242532'}),svgNode('circle',{cx:100,cy:100,r:2,fill:'#b3a9d0'}));
    const digital=node('span',{class:'hhw-clock-digital'});
    clock.append(face,node('div',{class:'hhw-clock-caption'},[node('span',{},['Hora local']),digital]));
    const weather=node('section',{class:'hhw-weather','aria-label':'Previsão do tempo'});
    const calendar=node('section',{class:'hhw-calendar','aria-label':'Calendário'});
    const previous=node('button',{class:'hhw-calendar-arrow hhw-calendar-prev',type:'button','aria-label':'Mês anterior'},[symbol('chevron')]);
    const next=node('button',{class:'hhw-calendar-arrow hhw-calendar-next',type:'button','aria-label':'Próximo mês'},[symbol('chevron')]);
    const monthLabel=node('button',{class:'hhw-calendar-month',type:'button',title:'Voltar ao mês atual'});
    const calendarDays=node('div',{class:'hhw-calendar-grid',role:'grid','aria-label':'Dias do mês'});
    const calendarFooter=node('div',{class:'hhw-calendar-footer'});
    calendar.append(node('div',{class:'hhw-calendar-header'},[monthLabel,node('div',{class:'hhw-calendar-actions'},[previous,next])]),calendarDays,calendarFooter);
    previous.addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);renderCalendar();});
    next.addEventListener('click',()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);renderCalendar();});
    monthLabel.addEventListener('click',()=>{const now=new Date();calendarMonth=new Date(now.getFullYear(),now.getMonth(),1);renderCalendar();});
    root.append(clock,weather,calendar);

    const ambient=node('dialog',{id:'homehub-ambient','aria-label':'Protetor de tela: hora, data e tempo'});
    const ambientTime=node('div',{class:'hh-ambient-time'});
    const ambientDate=node('div',{class:'hh-ambient-date'});
    const ambientWeather=node('div',{class:'hh-ambient-weather'});
    const ambientLocation=node('div',{class:'hh-ambient-location'});
    const ambientExit=node('button',{class:'hh-ambient-exit',type:'button','aria-label':'Sair do protetor de tela'},['×']);
    ambient.append(ambientExit,node('div',{class:'hh-ambient-core'},[ambientTime,ambientDate,ambientWeather,ambientLocation]),node('div',{class:'hh-ambient-hint'},['Clique ou pressione uma tecla para voltar']));
    ambient.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();closeAmbient();},true);
    ambient.addEventListener('keydown',event=>{
      if(!event.metaKey&&!event.ctrlKey&&!event.altKey)event.preventDefault();
      event.stopImmediatePropagation();closeAmbient();
    },true);
    ambient.addEventListener('cancel',event=>{event.preventDefault();closeAmbient();});
    ambient.addEventListener('close',()=>{document.documentElement.removeAttribute('data-homehub-ambient');armIdle();});
    document.body.append(ambient);

    const dialog=node('dialog',{id:'homehub-weather-dialog','aria-labelledby':'hhw-location-title'});
    const close=node('button',{class:'hhw-dialog-close',type:'button','aria-label':'Fechar'},['×']);
    close.addEventListener('click',()=>dialog.close());
    const heading=node('h2',{id:'hhw-location-title'},['O tempo na sua cidade']);
    const input=node('input',{id:'hhw-city-input',type:'search',placeholder:'Ex.: São Paulo',autocomplete:'off',required:'',minlength:'2',maxlength:'100'});
    const searchButton=node('button',{class:'hhw-primary',type:'submit'},['Buscar']);
    const form=node('form',{class:'hhw-city-form'},[node('label',{for:'hhw-city-input'},['Buscar cidade']),node('div',{class:'hhw-search-row'},[input,searchButton])]);
    const searchStatus=node('p',{class:'hhw-search-status',role:'status'});
    const results=node('div',{class:'hhw-city-results'});
    const attribution=node('p',{class:'hhw-city-attribution'},[document.createTextNode('Localidades: '),node('a',{href:'https://www.geonames.org/',target:'_blank',rel:'noopener noreferrer'},['GeoNames']),document.createTextNode(' via Open-Meteo')]);
    dialog.append(close,heading,node('p',{class:'hhw-city-intro'},['Escolha a localização para a previsão externa.']),form,searchStatus,results,attribution);
    dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
    document.body.append(dialog);

    function setText(element,value){if(element.textContent!==value)element.textContent=value;}
    function renderCalendar() {
      const now=new Date(),year=calendarMonth.getFullYear(),month=calendarMonth.getMonth();
      calendarToday=`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
      setText(monthLabel,new Intl.DateTimeFormat('pt-BR',{month:'long'}).format(calendarMonth)+' '+year);
      calendarDays.replaceChildren();
      const weekdays=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
      for(const name of weekdays)calendarDays.append(node('span',{class:'hhw-calendar-weekday',role:'columnheader','aria-label':name},[name.slice(0,1).toUpperCase()]));
      const firstDay=new Date(year,month,1).getDay();
      for(let i=0;i<42;i++) {
        const day=new Date(year,month,i-firstDay+1),outside=day.getMonth()!==month;
        const isToday=day.getFullYear()===now.getFullYear()&&day.getMonth()===now.getMonth()&&day.getDate()===now.getDate();
        const attrs={class:'hhw-calendar-day'+(outside?' is-outside':'')+(isToday?' is-today':''),role:'gridcell','aria-label':new Intl.DateTimeFormat('pt-BR',{dateStyle:'full'}).format(day),'data-in-month':String(!outside)};
        if(isToday)attrs['aria-current']='date';
        calendarDays.append(node('span',attrs,[String(day.getDate())]));
      }
      setText(calendarFooter,new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(now));
    }
    function armIdle() {
      clearTimeout(idleTimer);
      if(active&&!document.hidden&&!ambient.open)idleTimer=setTimeout(checkIdle,Math.max(100,IDLE_DELAY-(Date.now()-lastActivity)));
    }
    function hasBlockingOverlay() {
      if(document.querySelector('dialog[open]'))return true;
      return [...document.querySelectorAll('.cdk-overlay-container .cdk-overlay-pane')].some(pane=>{
        if(pane.matches('.mat-mdc-tooltip-panel')||pane.querySelector('[role="tooltip"],.mat-mdc-tooltip'))return false;
        const bounds=pane.getBoundingClientRect();return bounds.width>0&&bounds.height>0;
      });
    }
    function checkIdle() {
      if(!active||document.hidden||ambient.open)return;
      if(Date.now()-lastActivity<IDLE_DELAY){armIdle();return;}
      if(hasBlockingOverlay()){lastActivity=Date.now();armIdle();return;}
      showAmbient();
    }
    function showAmbient() {
      if(!active||document.hidden||ambient.open||hasBlockingOverlay())return;
      clearTimeout(idleTimer);tickClock();renderAmbientWeather();ambient.showModal();
      document.documentElement.setAttribute('data-homehub-ambient','');
    }
    function closeAmbient() {
      document.documentElement.removeAttribute('data-homehub-ambient');
      if(ambient.open){lastActivity=Date.now();ambient.close();armIdle();}
    }
    function renderAmbientWeather() {
      const {location,forecast}=lastState;
      ambientWeather.replaceChildren();
      if(!location){ambientWeather.append(node('span',{},['Configure o Tempo para exibir a temperatura']));setText(ambientLocation,'');return;}
      if(!forecast){ambientWeather.append(node('span',{},['Tempo indisponível']));setText(ambientLocation,location.name);return;}
      const current=forecast.current,description=condition(current.code,current.isDay);
      ambientWeather.append(weatherIcon(current.code,current.isDay),node('span',{},[temp(current.temperature)+' · '+description.label]));
      setText(ambientLocation,location.name+(forecast.stale?' · dados salvos':''));
    }
    function tickClock() {
      clearTimeout(clockTimer);
      if(!active||document.hidden)return;
      const now=new Date(),seconds=now.getSeconds()+now.getMilliseconds()/1000,minutes=now.getMinutes()+seconds/60,hours=now.getHours()%12+minutes/60;
      hands.hour.setAttribute('transform',`rotate(${hours*30} 100 100)`);
      hands.minute.setAttribute('transform',`rotate(${minutes*6} 100 100)`);
      hands.second.setAttribute('transform',`rotate(${seconds*6} 100 100)`);
      const time=now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
      setText(digital,time);face.setAttribute('aria-label','Hora local: '+time);
      setText(ambientTime,time);setText(ambientDate,new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(now));
      if(calendarToday!==`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`)renderCalendar();
      clockTimer=setTimeout(tickClock,1000-Date.now()%1000);
    }
    async function api(action,values={}) {
      if(!globalThis.chrome?.runtime?.id||!chrome.runtime.sendMessage)throw Error('Recarregue a extensão para ativar o Tempo.');
      const response=await chrome.runtime.sendMessage({namespace:'homehub-weather',action,...values});
      if(!response?.ok)throw Error(response?.error||'Não foi possível consultar o serviço de previsão.');
      return response.data;
    }
    function temp(value){return Number.isFinite(value)?Math.round(value)+'°':'—';}
    function localTime(value,timeZone){return new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone}).format(new Date(value));}
    function showCityDialog() {
      ++searchSequence;searchButton.disabled=false;results.replaceChildren();setText(searchStatus,'');input.value='';
      if(!dialog.open)dialog.showModal();input.focus();
    }
    function weatherButton(className,label,icon,action) {
      const button=node('button',{class:className,type:'button','aria-label':label,title:label},[symbol(icon)]);
      button.addEventListener('click',action);return button;
    }
    function renderWeather() {
      renderAmbientWeather();
      const {location,forecast,error}=lastState;
      weather.replaceChildren();weather.setAttribute('aria-busy',String(pending));
      const city=node('button',{class:'hhw-city',type:'button',title:'Escolher cidade'},[node('span',{},[location?.name||'Tempo']),symbol('chevron')]);
      city.addEventListener('click',showCityDialog);
      const refresh=weatherButton('hhw-refresh','Atualizar previsão','refresh',()=>loadWeather('refresh'));
      refresh.disabled=pending||!location;
      weather.append(node('div',{class:'hhw-weather-top'},[city,refresh]));
      if(!location) {
        weather.dataset.state='setup';weather.dataset.weather='partly';weather.dataset.day='day';
        const choose=node('button',{class:'hhw-choose-city',type:'button'},['Escolher cidade']);choose.addEventListener('click',showCityDialog);
        weather.append(node('div',{class:'hhw-weather-setup'},[weatherIcon(2,true),node('div',{},[node('h3',{},['O tempo por perto']),node('p',{},['Temperatura e previsão para a cidade que você escolher.']),choose])]));
        if(error)weather.append(node('p',{class:'hhw-weather-error',role:'status'},[error]));
        return;
      }
      if(!forecast) {
        weather.dataset.state=pending?'loading':'error';weather.dataset.weather='cloudy';weather.dataset.day='day';
        const retry=node('button',{class:'hhw-choose-city',type:'button'},[pending?'Consultando…':'Tentar novamente']);retry.disabled=pending;retry.addEventListener('click',()=>loadWeather('refresh'));
        weather.append(node('div',{class:'hhw-weather-setup'},[weatherIcon(3,true),node('div',{},[node('h3',{},[pending?'Buscando a previsão':'Tempo indisponível']),node('p',{},[error||'Aguardando a consulta ao serviço de previsão.']),retry])]));return;
      }
      weather.dataset.state='ready';
      const current=forecast.current,description=condition(current.code,current.isDay),today=forecast.daily[0];
      weather.dataset.weather=description.kind;weather.dataset.day=current.isDay?'day':'night';
      weather.setAttribute('aria-label',`Previsão externa em ${location.name}: ${temp(current.temperature)}, ${description.label}`);
      const now=node('div',{class:'hhw-now'},[
        node('div',{class:'hhw-current'},[node('div',{class:'hhw-temperature'},[temp(current.temperature)]),node('div',{class:'hhw-condition'},[description.label]),node('div',{class:'hhw-range'},[`Máx. ${temp(today?.max)} · Mín. ${temp(today?.min)}`])]),
        node('div',{class:'hhw-current-sky'},[weatherIcon(current.code,current.isDay),node('div',{class:'hhw-feels-like'},[`Sensação de ${temp(current.feelsLike)}`])])
      ]);
      weather.append(now);
      const hours=node('div',{class:'hhw-hours','aria-label':'Previsão para as próximas horas'});
      const upcoming=forecast.hourly.filter(hour=>hour.time>current.time).slice(0,5);
      for(const hour of [{...current,now:true},...upcoming]) {
        const label=hour.now?'Agora':new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',hourCycle:'h23',timeZone:forecast.timeZone}).format(new Date(hour.time*1000))+'h';
        hours.append(node('div',{class:'hhw-hour'},[node('span',{class:'hhw-hour-label'},[label]),weatherIcon(hour.code,hour.isDay),node('b',{},[temp(hour.temperature)])]));
      }
      const updated=pending?'Atualizando…':forecast.stale?'Dados salvos · '+new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',timeZone:forecast.timeZone}).format(new Date(forecast.fetchedAt)):'Atualizado às '+localTime(forecast.fetchedAt,forecast.timeZone);
      weather.append(hours,node('div',{class:'hhw-weather-footer'},[node('span',{role:'status'},[updated]),node('a',{href:'https://open-meteo.com/',target:'_blank',rel:'noopener noreferrer'},['Open-Meteo'])]));
    }
    function scheduleRefresh() {
      clearTimeout(refreshTimer);
      if(active&&!document.hidden&&lastState.location)refreshTimer=setTimeout(()=>loadWeather('init'),REFRESH);
    }
    async function loadWeather(action,values={}) {
      const sequence=++weatherSequence;pending=true;renderWeather();
      try {
        const state=await api(action,values);
        if(sequence!==weatherSequence)return;
        lastState=state;
      } catch(error) {
        if(sequence!==weatherSequence)return;
        lastState={...lastState,error:error.message};
        if(lastState.forecast)lastState={...lastState,forecast:{...lastState.forecast,stale:true}};
      } finally {
        if(sequence===weatherSequence){pending=false;renderWeather();scheduleRefresh();}
      }
    }
    form.addEventListener('submit',async event=>{
      event.preventDefault();const query=input.value.trim();if(query.length<2)return;
      const sequence=++searchSequence;searchButton.disabled=true;results.replaceChildren();setText(searchStatus,'Buscando cidades…');
      try {
        const response=await api('search',{query});if(sequence!==searchSequence)return;
        setText(searchStatus,response.locations.length?'Selecione uma cidade:':'Nenhuma cidade encontrada. Tente outro nome.');
        for(const location of response.locations) {
          const details=[location.region,location.country].filter(Boolean).join(' · ');
          const item=node('button',{class:'hhw-city-result',type:'button'},[node('strong',{},[location.name]),node('span',{},[details])]);
          item.addEventListener('click',()=>{dialog.close();lastState={location,forecast:null};loadWeather('select',{location});});results.append(item);
        }
      } catch(error){if(sequence===searchSequence)setText(searchStatus,error.message);}
      finally{if(sequence===searchSequence)searchButton.disabled=false;}
    });
    function setActive(value) {
      if(active===value)return;active=value;
      clearTimeout(clockTimer);clearTimeout(refreshTimer);clearTimeout(idleTimer);
      if(!active){if(dialog.open)dialog.close();closeAmbient();return;}
      lastActivity=Date.now();tickClock();armIdle();
      if(!initialized){initialized=true;loadWeather('init');}
      else if(lastState.location&&(!lastState.forecast||Date.now()-lastState.forecast.fetchedAt>REFRESH))loadWeather('init');
      else scheduleRefresh();
    }
    document.addEventListener('visibilitychange',()=>{
      clearTimeout(clockTimer);clearTimeout(refreshTimer);clearTimeout(idleTimer);
      if(active&&!document.hidden){lastActivity=Date.now();tickClock();armIdle();if(lastState.location&&(!lastState.forecast||Date.now()-lastState.forecast.fetchedAt>REFRESH))loadWeather('init');else scheduleRefresh();}
    });
    const noteActivity=()=>{if(active&&!ambient.open)lastActivity=Date.now();};
    for(const event of ['pointermove','pointerdown','keydown','wheel'])document.addEventListener(event,noteActivity,{passive:true,capture:true});
    document.addEventListener('scroll',noteActivity,{passive:true,capture:true});
    renderCalendar();renderWeather();
    return {attach(parent){if(parent&&root.parentElement!==parent)parent.prepend(root);},setActive,showAmbient};
  }
  globalThis.HomeHubWidgets={create};
})();
