import {rooms,WIDTH,HEIGHT,polygonPath,stateKey,stateName,stateFile} from './rooms.js';
import {createRenderer,pngBlob} from './lighting-renderer.js';
let state=31,displayedState=31,renderer,drawVersion=0,galleryReady=false;
const $=id=>document.getElementById(id), image=$('home-image'), urls=new Map(), buffers=new Map();
const initialHash=location.hash.slice(1);if(/^[01]{5}$/.test(initialHash))state=rooms.reduce((s,r,i)=>s+(initialHash[i]==='1'?r.bit:0),0);
function reportError(message){$('lighting-error').hidden=false;$('lighting-error-message').textContent=message;$('announcement').textContent=message;}
const ready=createRenderer().then(r=>{renderer=r;return r;}).catch(error=>{reportError('The lighting images could not load. Please try again.');throw error;});
ready.catch(()=>{});
$('retry-lighting').onclick=()=>location.reload();
const paths=new Map(),switches=new Map(),labels=new Map();
for(const floor of ['Upstairs','Downstairs']){
 const group=document.createElement('div');group.className='room-group';group.innerHTML=`<div class="floor-label">${floor}</div>`;
 rooms.filter(room=>room.floor===floor).forEach(room=>{
  const button=document.createElement('button');button.className='room-control';button.setAttribute('role','switch');button.setAttribute('aria-label',`${room.name} light`);button.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${room.icon}"/></svg><span class="room-copy"><span class="room-name">${room.name}</span><span class="room-status">On</span></span><span class="switch" aria-hidden="true"></span>`;button.onclick=()=>setState(state^room.bit);group.append(button);switches.set(room.id,button);
 });$('room-controls').append(group);
}
rooms.forEach(room=>{
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',polygonPath(room.points));path.setAttribute('class','room-hit');path.setAttribute('role','switch');path.setAttribute('tabindex','0');path.setAttribute('aria-label',`${room.name} in the picture`);path.dataset.room=room.id;path.addEventListener('click',()=>setState(state^room.bit));path.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setState(state^room.bit);}});$('room-hit-areas').append(path);paths.set(room.id,path);
 const label=document.createElement('button');label.className='room-label';label.textContent=room.name;label.style.left=`${room.label[0]/WIDTH*100}%`;label.style.top=`${room.label[1]/HEIGHT*100}%`;label.setAttribute('aria-label',`Toggle ${room.name.toLowerCase()} light`);label.onclick=()=>setState(state^room.bit);label.onpointerenter=()=>path.classList.add('is-hovered');label.onpointerleave=()=>path.classList.remove('is-hovered');$('room-labels').append(label);labels.set(room.id,label);
});
async function getBlob(value){if(!buffers.has(value)){await ready;buffers.set(value,pngBlob(renderer.render(value)));}return buffers.get(value);}
async function getUrl(value){if(!urls.has(value)){const blob=await getBlob(value);if(!urls.has(value))urls.set(value,URL.createObjectURL(blob));}return urls.get(value);}
function syncControls(){
 const count=rooms.filter(r=>state&r.bit).length;
 for(const room of rooms){const on=Boolean(state&room.bit);switches.get(room.id).setAttribute('aria-checked',String(on));switches.get(room.id).querySelector('.room-status').textContent=on?'On':'Off';paths.get(room.id).setAttribute('aria-checked',String(on));labels.get(room.id).setAttribute('aria-pressed',String(on));}
 $('light-count').textContent=`${count} of 5 on`;$('state-description').textContent=count===5?'Every room, glowing.':count===0?'A quiet home. All lights off.':`${stateName(state)} ${count===1?'is':'are'} lit.`;
 image.alt=`Watercolor cutaway of your home. ${stateName(state)}${count>0&&count<5?' lit; all other room lights off':''}.`;
 history.replaceState(null,'',`#${stateKey(state)}`);
 if(galleryReady)document.querySelectorAll('.state-card').forEach(card=>card.setAttribute('aria-pressed',String(Number(card.dataset.state)===state)));
}
async function setState(value){
 if(!Number.isInteger(value)||value<0||value>31)throw new Error('Choose a valid lighting combination.');
 state=value;const version=++drawVersion;syncControls();
 try{const url=value===31?'./assets/watercolor-original.jpeg':await getUrl(value);const preload=new Image();preload.src=url;await preload.decode();if(version===drawVersion){image.src=url;image.dataset.state=String(value);displayedState=value;if(renderer)$('lighting-error').hidden=true;}}catch{if(version===drawVersion){state=displayedState;syncControls();reportError('Could not load the lighting. Your last image is still shown. Please try again.');}return false;}return true;
}
$('all-on').onclick=()=>setState(31);$('all-off').onclick=()=>setState(0);
$('show-labels').onclick=()=>{const hidden=!$('room-labels').hidden;$('room-labels').hidden=hidden;$('show-labels').setAttribute('aria-pressed',String(!hidden));};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
$('download-current').onclick=async()=>{try{const snapshot=state;download(await getBlob(snapshot),stateFile(snapshot));}catch{reportError('Image could not be saved. Please try again.');}};
$('browse-states').onclick=async()=>{
 $('states-dialog').showModal();if(galleryReady)return;galleryReady=true;
 for(let value=31;value>=0;value--){const card=document.createElement('button');card.className='state-card';card.dataset.state=value;card.setAttribute('aria-pressed',String(value===state));card.setAttribute('aria-label',`Select ${stateName(value).toLowerCase()}`);card.innerHTML=`<img width="1024" height="682" alt="${stateName(value)}"><span><b>${value===0?'All lights off':value===31?'All lights on':`${rooms.filter(r=>value&r.bit).length} lights on`}</b>${value===0?'Only the moonlight.':stateName(value)}</span>`;card.onclick=()=>{setState(value);$('states-dialog').close();};$('states-grid').append(card);getUrl(value).then(url=>{card.querySelector('img').src=url;}).catch(()=>{card.querySelector('img').alt='Image unavailable';});}
};
$('close-states').onclick=()=>$('states-dialog').close();$('states-dialog').onclick=event=>{if(event.target===$('states-dialog')){const rect=$('states-dialog').getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)$('states-dialog').close();}};
// A small standards-compliant ZIP writer: PNG files are already compressed.
const crcTable=Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(data){let crc=0xffffffff;for(const byte of data)crc=crcTable[(crc^byte)&255]^(crc>>>8);return(crc^0xffffffff)>>>0;}
function header(length){const bytes=new Uint8Array(length),view=new DataView(bytes.buffer);return {bytes,u16:(o,v)=>view.setUint16(o,v,true),u32:(o,v)=>view.setUint32(o,v,true)};}
export function zipFiles(files){const body=[],directory=[];let offset=0,centralSize=0;for(const file of files){const name=new TextEncoder().encode(file.name),data=file.data,crc=crc32(data),local=header(30);local.u32(0,0x04034b50);local.u16(4,20);local.u16(6,0x800);local.u32(14,crc);local.u32(18,data.length);local.u32(22,data.length);local.u16(26,name.length);body.push(local.bytes,name,data);const central=header(46);central.u32(0,0x02014b50);central.u16(4,20);central.u16(6,20);central.u16(8,0x800);central.u32(16,crc);central.u32(20,data.length);central.u32(24,data.length);central.u16(28,name.length);central.u32(42,offset);directory.push(central.bytes,name);offset+=30+name.length+data.length;centralSize+=46+name.length;}const end=header(22);end.u32(0,0x06054b50);end.u16(8,files.length);end.u16(10,files.length);end.u32(12,centralSize);end.u32(16,offset);return new Blob([...body,...directory,end.bytes],{type:'application/zip'});}
$('download-all').onclick=async()=>{const button=$('download-all');button.disabled=true;try{const files=[];for(let value=0;value<32;value++){button.textContent=`Preparing images ${value+1} / 32…`;files.push({name:stateFile(value),data:new Uint8Array(await(await getBlob(value)).arrayBuffer())});await new Promise(resolve=>setTimeout(resolve,0));}const manifest={width:WIDTH,height:HEIGHT,bit_order:rooms.map(r=>r.name),states:Array.from({length:32},(_,value)=>({file:stateFile(value),lights:Object.fromEntries(rooms.map(r=>[r.name,Boolean(value&r.bit)]))}))};files.push({name:'lighting-manifest.json',data:new TextEncoder().encode(JSON.stringify(manifest,null,2))});download(zipFiles(files),'home-all-32-lighting-combinations.zip');$('announcement').textContent='All 32 images are ready to download.';}catch{reportError('The images could not be downloaded. Please try again.');}finally{button.innerHTML='Download all 32 images <span>↓</span>';button.disabled=false;}};
addEventListener('hashchange',()=>{const key=location.hash.slice(1);if(/^[01]{5}$/.test(key))setState(rooms.reduce((s,r,i)=>s+(key[i]==='1'?r.bit:0),0));});
const context=document.modelContext;if(context?.registerTool){const lifecycle=new AbortController();addEventListener('pagehide',()=>lifecycle.abort(),{once:true});try{Promise.resolve(context.registerTool({name:'set_room_lights',title:'Set home lights',description:'Set the five room lights shown in the watercolor home.',inputSchema:{type:'object',properties:Object.fromEntries(rooms.map(r=>[r.id,{type:'boolean'}])),additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){if(!input||Array.isArray(input)||typeof input!=='object'||Object.entries(input).some(([key,value])=>!rooms.some(r=>r.id===key)||typeof value!=='boolean'))throw new Error('Provide room names with true or false values.');let next=state;for(const room of rooms)if(room.id in input)next=input[room.id]?next|room.bit:next&~room.bit;if(!await setState(next))throw new Error('Lighting image unavailable.');return Object.fromEntries(rooms.map(r=>[r.id,Boolean(state&r.bit)]));}},{signal:lifecycle.signal})).catch(()=>{});}catch{}}
setState(state);
