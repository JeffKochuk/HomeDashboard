import {rooms,WIDTH,HEIGHT,polygonPath,stateKey,stateName,stateFile,roomGeometry} from './rooms.js';
import {styles,styleById,assetPath,selectionKey,selectionLabel} from './styles.js';
import {createRenderer,pngBlob} from './lighting-renderer.js';
import {zipFiles} from './zip.js';

const $=id=>document.getElementById(id);
const image=$('home-image');
const rendererCache=new Map(),imageUrls=new Map();
const paths=new Map(),switches=new Map(),labels=new Map(),tabs=new Map();
let selection={style:'original',time:'day',state:31};
let displayed={...selection},failedSelection=null,drawVersion=0,galleryVersion=0;
let galleryUrls=[];
function parseHash(){
 const hash=location.hash.slice(1);
 if(/^[01]{5}$/.test(hash))return {...selection,state:rooms.reduce((s,r,i)=>s+(hash[i]==='1'?r.bit:0),0)};
 const params=new URLSearchParams(hash),style=params.get('style'),time=params.get('time'),lights=params.get('lights');
 if(!styleById(style)||!['day','night'].includes(time)||!/^[01]{5}$/.test(lights||''))return null;
 return {style,time,state:rooms.reduce((s,r,i)=>s+(lights[i]==='1'?r.bit:0),0)};
}
selection=parseHash()||selection;
function reportError(message){$('lighting-error').hidden=false;$('lighting-error-message').textContent=message;$('announcement').textContent=message;}
function getRenderer(view){
 const key=selectionKey(view);
 if(rendererCache.has(key)){const cached=rendererCache.get(key);rendererCache.delete(key);rendererCache.set(key,cached);return cached;}
 const promise=createRenderer(view.style,view.time).catch(error=>{if(rendererCache.get(key)===promise)rendererCache.delete(key);throw error;});
 rendererCache.set(key,promise);
 // Keep only two masters in memory, even when exploring all sixteen views.
 while(rendererCache.size>2)rendererCache.delete(rendererCache.keys().next().value);
 return promise;
}
async function getImageUrl(view){
 if(view.state===31){await getRenderer(view);return assetPath(view.style,view.time);}
 const key=`${selectionKey(view)}-${view.state}`;
 if(imageUrls.has(key))return imageUrls.get(key);
 const renderer=await getRenderer(view),blob=await pngBlob(renderer.render(view.state));
 if(imageUrls.has(key))return imageUrls.get(key);
 const url=URL.createObjectURL(blob);imageUrls.set(key,url);
 while(imageUrls.size>6){const oldest=imageUrls.keys().next().value;URL.revokeObjectURL(imageUrls.get(oldest));imageUrls.delete(oldest);}
 return url;
}
function syncControls(){
 const {state,style,time}=selection,count=rooms.filter(r=>state&r.bit).length;
 for(const room of rooms){
  const on=Boolean(state&room.bit);
  switches.get(room.id).setAttribute('aria-checked',String(on));
  switches.get(room.id).querySelector('.room-status').textContent=on?'On':'Off';
  paths.get(room.id).setAttribute('aria-checked',String(on));
  labels.get(room.id).setAttribute('aria-pressed',String(on));
  const geometry=roomGeometry(room,style);paths.get(room.id).setAttribute('d',polygonPath(geometry.points));
  labels.get(room.id).style.left=`${geometry.label[0]/WIDTH*100}%`;labels.get(room.id).style.top=`${geometry.label[1]/HEIGHT*100}%`;
 }
 for(const item of styles){const active=item.id===style;tabs.get(item.id).setAttribute('aria-selected',String(active));tabs.get(item.id).tabIndex=active?0:-1;}
 $('time-day').setAttribute('aria-pressed',String(time==='day'));
 $('time-night').setAttribute('aria-pressed',String(time==='night'));
 $('art-panel').setAttribute('aria-labelledby',`style-${style}`);
 $('art-title').textContent=selectionLabel(selection).toUpperCase();
 $('light-count').textContent=`${count} of 5 on`;
 $('state-description').textContent=count===5?'Every room, glowing.':count===0?(time==='day'?'Just daylight. All lights off.':'A quiet home. All lights off.'):`${stateName(state)} ${count===1?'is':'are'} lit.`;
 image.alt=`${selectionLabel(selection)}. ${stateName(state)}${count>0&&count<5?' lit; other room lights off':''}.`;
 const hash=new URLSearchParams({style,time,lights:stateKey(state)}).toString();history.replaceState(null,'',`#${hash}`);
 document.querySelectorAll('.state-card').forEach(card=>card.setAttribute('aria-pressed',String(Number(card.dataset.state)===state)));
}
async function choose(update){
 const next={...selection,...update};
 if(!styleById(next.style)||!['day','night'].includes(next.time)||!Number.isInteger(next.state)||next.state<0||next.state>31)throw new Error('Choose a valid style, time, and lighting combination.');
 const changedView=selectionKey(selection)!==selectionKey(next);
 selection=next;const version=++drawVersion;syncControls();
 $('home-art').setAttribute('aria-busy','true');
 $('art-loading').textContent=`Loading ${selectionLabel(next).toLowerCase()}…`;
 const loadingTimer=setTimeout(()=>{if(version===drawVersion)$('art-loading').hidden=false;},180);
 if(changedView){clearGallery();if($('states-dialog').open)$('states-dialog').close();}
 try{
  const url=await getImageUrl(next),preload=new Image();preload.src=url;await preload.decode();
  if(version!==drawVersion)return false;
  image.src=url;image.dataset.state=String(next.state);image.dataset.style=next.style;image.dataset.time=next.time;
  displayed={...next};failedSelection=null;$('lighting-error').hidden=true;
  return true;
 }catch{
  if(version===drawVersion){failedSelection={...next};selection={...displayed};syncControls();reportError('This view could not load. Your previous view is still here. Try again.');}
  return false;
 }finally{clearTimeout(loadingTimer);if(version===drawVersion){$('home-art').setAttribute('aria-busy','false');$('art-loading').hidden=true;}}
}

for(const style of styles){
 const button=document.createElement('button');button.className='style-tab';button.id=`style-${style.id}`;button.setAttribute('role','tab');button.setAttribute('aria-controls','art-panel');button.setAttribute('aria-label',style.name);button.style.setProperty('--style-color',style.color);button.textContent=style.tab;
 button.onclick=()=>choose({style:style.id});
 button.onkeydown=event=>{const index=styles.findIndex(s=>s.id===style.id);let target;
  if(event.key==='ArrowRight')target=(index+1)%styles.length;
  if(event.key==='ArrowLeft')target=(index+styles.length-1)%styles.length;
  if(event.key==='Home')target=0;if(event.key==='End')target=styles.length-1;
  if(target!==undefined){event.preventDefault();const next=tabs.get(styles[target].id);next.focus();next.scrollIntoView({block:'nearest',inline:'nearest'});}
 };
 $('style-tabs').append(button);tabs.set(style.id,button);
}
for(const floor of ['Upstairs','Downstairs']){
 const group=document.createElement('div');group.className='room-group';group.innerHTML=`<div class="floor-label">${floor}</div>`;
 rooms.filter(room=>room.floor===floor).forEach(room=>{
  const button=document.createElement('button');button.className='room-control';button.setAttribute('role','switch');button.setAttribute('aria-label',`${room.name} light`);
  button.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${room.icon}"/></svg><span class="room-copy"><span class="room-name">${room.name}</span><span class="room-status">On</span></span><span class="switch" aria-hidden="true"></span>`;
  button.onclick=()=>choose({state:selection.state^room.bit});group.append(button);switches.set(room.id,button);
 });$('room-controls').append(group);
}
rooms.forEach(room=>{
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',polygonPath(room.points));path.setAttribute('class','room-hit');path.setAttribute('role','switch');path.setAttribute('tabindex','0');path.setAttribute('aria-label',`${room.name} in the picture`);path.dataset.room=room.id;
 path.addEventListener('click',()=>choose({state:selection.state^room.bit}));path.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();choose({state:selection.state^room.bit});}});
 $('room-hit-areas').append(path);paths.set(room.id,path);
 const label=document.createElement('button');label.className='room-label';label.textContent=room.name;label.style.left=`${room.label[0]/WIDTH*100}%`;label.style.top=`${room.label[1]/HEIGHT*100}%`;label.setAttribute('aria-label',`Toggle ${room.name.toLowerCase()} light`);
 label.onclick=()=>choose({state:selection.state^room.bit});label.onpointerenter=()=>path.classList.add('is-hovered');label.onpointerleave=()=>path.classList.remove('is-hovered');$('room-labels').append(label);labels.set(room.id,label);
});
$('time-day').onclick=()=>choose({time:'day'});$('time-night').onclick=()=>choose({time:'night'});
$('all-on').onclick=()=>choose({state:31});$('all-off').onclick=()=>choose({state:0});
$('retry-lighting').onclick=()=>choose(failedSelection||selection);
$('show-labels').onclick=()=>{const hidden=!$('room-labels').hidden;$('room-labels').hidden=hidden;$('show-labels').setAttribute('aria-pressed',String(!hidden));};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
$('download-current').onclick=async()=>{const view={...selection};try{const renderer=await getRenderer(view);download(await pngBlob(renderer.render(view.state)),stateFile(view.state,view.style,view.time));}catch{reportError('Image could not be saved. Please try again.');}};
function clearGallery(){galleryVersion++;galleryUrls.forEach(url=>URL.revokeObjectURL(url));galleryUrls=[];$('states-grid').replaceChildren();}
$('browse-states').onclick=async()=>{
 clearGallery();const version=galleryVersion,view={...selection};
 $('gallery-caption').textContent=`${selectionLabel(view)}. Choose an image to set your lights.`;$('states-dialog').showModal();
 try{
  const renderer=await getRenderer(view);
  for(let value=31;value>=0;value--){
   if(version!==galleryVersion)return;
   const card=document.createElement('button');card.className='state-card';card.dataset.state=value;card.setAttribute('aria-pressed',String(value===selection.state));card.setAttribute('aria-label',`Select ${stateName(value).toLowerCase()}`);
   card.innerHTML=`<img width="320" height="213" alt="${stateName(value)}"><span><b>${value===0?'All lights off':value===31?'All lights on':`${rooms.filter(r=>value&r.bit).length} lights on`}</b>${value===0?(view.time==='day'?'Only the daylight.':'Only the night ambience.'):stateName(value)}</span>`;
   card.onclick=()=>{choose({...view,state:value});$('states-dialog').close();};$('states-grid').append(card);
   const blob=await pngBlob(renderer.render(value,320));if(version!==galleryVersion)return;
   const url=URL.createObjectURL(blob);galleryUrls.push(url);card.querySelector('img').src=url;
  }
 }catch{if(version===galleryVersion){$('states-grid').textContent='These previews could not load. Close this window and try again.';}}
};
$('close-states').onclick=()=>$('states-dialog').close();
$('states-dialog').addEventListener('close',clearGallery);
$('states-dialog').onclick=event=>{if(event.target===$('states-dialog')){const r=$('states-dialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('states-dialog').close();}};
$('download-all').onclick=async()=>{
 const button=$('download-all'),view={...selection};button.disabled=true;
 try{
  const renderer=await getRenderer(view),files=[];
  for(let value=0;value<32;value++){
   button.textContent=`Preparing images ${value+1} / 32…`;
   files.push({name:stateFile(value,view.style,view.time),data:new Uint8Array(await(await pngBlob(renderer.render(value))).arrayBuffer())});
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  const manifest={style:styleById(view.style).name,time:view.time,width:WIDTH,height:HEIGHT,bit_order:rooms.map(r=>r.name),states:Array.from({length:32},(_,state)=>({file:stateFile(state,view.style,view.time),lights:Object.fromEntries(rooms.map(r=>[r.name,Boolean(state&r.bit)]))}))};
  files.push({name:'lighting-manifest.json',data:new TextEncoder().encode(JSON.stringify(manifest,null,2))});
  download(zipFiles(files),`${view.style}-${view.time}-all-32.zip`);$('announcement').textContent=`All 32 ${selectionLabel(view)} images are ready to download.`;
 }catch{reportError('The images could not be downloaded. Please try again.');}
 finally{button.innerHTML='Download all 32 images <span>↓</span>';button.disabled=false;}
};
addEventListener('hashchange',()=>{const next=parseHash();if(next)choose(next);});

const context=document.modelContext;
if(context?.registerTool){
 const lifecycle=new AbortController();addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 const lightProperties=Object.fromEntries(rooms.map(r=>[r.id,{type:'boolean'}]));
 const tool={name:'set_home_view',title:'Set home style and lights',description:'Choose an artwork style, day or night, and room lights in the home dashboard.',inputSchema:{type:'object',properties:{style:{type:'string',enum:styles.map(s=>s.id)},time:{type:'string',enum:['day','night']},lights:{type:'object',properties:lightProperties,additionalProperties:false}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){
  if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['style','time','lights'].includes(k)))throw new Error('Provide a style, time, or room lights.');
  if(input.style!==undefined&&!styleById(input.style))throw new Error('Unknown style.');if(input.time!==undefined&&!['day','night'].includes(input.time))throw new Error('Unknown time.');
  if(input.lights!==undefined&&(!input.lights||typeof input.lights!=='object'||Array.isArray(input.lights)||Object.entries(input.lights).some(([key,value])=>!rooms.some(r=>r.id===key)||typeof value!=='boolean')))throw new Error('Lights must map room names to true or false.');
  const next={...selection};if(input.style!==undefined)next.style=input.style;if(input.time!==undefined)next.time=input.time;
  for(const room of rooms)if(input.lights&&room.id in input.lights)next.state=input.lights[room.id]?next.state|room.bit:next.state&~room.bit;
  if(!await choose(next))throw new Error('View was not loaded.');
  return {...selection,lights:Object.fromEntries(rooms.map(r=>[r.id,Boolean(selection.state&r.bit)]))};
 }};
 try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
}
choose(selection);
