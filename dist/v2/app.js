import {rooms,styles,styleById,collections,collectionById,artworkFor,artworkOptions,artworkById,hasCollection,viewLabel,exportName,litCount,ALL_ON,stateName,parseHash,serializeHash} from './catalog.js';
import {createRenderer,pngBlob} from './renderer.js';
import {zipFiles} from './zip.js';
import {favoriteItems,favoritesPersist,isFavorite,toggleFavorite,onFavoritesChanged} from './favorites.js';
import {registerHomeTool} from './mcp.js';

const $=id=>document.getElementById(id);
const art=$('art'),artWrap=art.parentElement,image=$('home-image'),hits=$('hits'),labelsHost=$('labels');
const sceneSheet=$('scene-sheet'),moreSheet=$('more-sheet'),gallery=$('gallery'),favorites=$('favorites');
const SVG='http://www.w3.org/2000/svg';

// Room glyphs: one consistent 1.6px stroke set (the data file's icons are too dense at 17px).
const glyphs={
 living:'M4 12.5V9.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M3 12.5h18v5H3ZM5.5 17.5v2m13-2v2',
 kitchen:'M4.5 10.5h15v5.5a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3ZM3 10.5h18M9.5 7.5c0-1.5 1-1.5 1-3m4 3c0-1.5 1-1.5 1-3',
 bedroom:'M3 19v-8.5h18V19M3 15.5h18M6 10.5V6h12v4.5M9.5 10.5V8h5v2.5',
 hallway:'M3.5 4.5h7v7h-7ZM14.5 7.5h6v7h-6ZM3.5 15h7v4.5h-7Z',
 study:'M3.5 5h17v10.5h-17ZM9 20h6m-3-4.5V20'
};
const icon=d=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
// "Original" also names a collection, so the style shows as Isometric.
const styleTab=item=>item.id==='original'?'Isometric':item.tab;

// Preferences are per browser; the view itself lives in the URL hash like the original app.
const PREFS_KEY='home-dashboard:v2:prefs',WALL_KEY='home-dashboard:v2:wall';
const prefs=(()=>{try{return {labels:true,auto:false,...JSON.parse(localStorage.getItem(PREFS_KEY)||'{}')};}catch{return {labels:true,auto:false};}})();
const savePrefs=()=>{try{localStorage.setItem(PREFS_KEY,JSON.stringify(prefs));}catch{}};
const clockTime=()=>{const h=new Date().getHours();return h>=7&&h<19?'day':'night';};
// Following the clock is stored as a preference; a link's &auto=1 turns it on for this visit only.
let auto=prefs.auto;
function setAuto(value){auto=value;prefs.auto=value;savePrefs();}

let selection={collection:'original',style:'original',time:'day',state:ALL_ON};
let displayed={...selection},failed=null,drawVersion=0;
const rendererCache=new Map(),imageUrls=new Map();
const paths=new Map(),rings=new Map(),tiles=new Map(),labels=new Map();

// Live regions inside an open modal are the only ones assistive tech can hear.
function announce(text){const open=document.querySelector('dialog[open]');(open?.querySelector('.live')||$('announce')).textContent=text;}

function readHash(){
 const view=parseHash();if(!view)return null;
 if(new URLSearchParams(location.hash.slice(1)).get('auto')==='1')auto=true;
 if(auto){const now=clockTime();if(now!==view.time){view.time=now;delete view.artworkId;}}
 return view;
}
selection=readHash()||(auto?{...selection,time:clockTime()}:selection);

// --- Renderer and image cache -----------------------------------------------
// Two masters stay in memory; the displayed one is never evicted by gallery or
// favorites previews. Builds run one at a time and a build nobody wants any
// more (the user moved on) is skipped instead of blocking the main thread.
let buildChain=Promise.resolve();
function getRenderer(view,wanted=()=>true){
 const key=artworkFor(view).id;
 if(rendererCache.has(key)){const cached=rendererCache.get(key);rendererCache.delete(key);rendererCache.set(key,cached);return cached;}
 const promise=buildChain.then(()=>{
  if(!wanted()||rendererCache.get(key)!==promise)throw new Error('Superseded.');
  return createRenderer(artworkFor(view));
 }).catch(error=>{if(rendererCache.get(key)===promise)rendererCache.delete(key);throw error;});
 buildChain=promise.catch(()=>{});
 rendererCache.set(key,promise);
 const pinned=artworkFor(displayed)?.id;
 for(const k of rendererCache.keys()){if(rendererCache.size<=2)break;if(k!==pinned)rendererCache.delete(k);}
 return promise;
}
async function getImageUrl(view,wanted){
 const artwork=artworkFor(view);
 if(view.state===ALL_ON)return artwork.on;
 const key=`${artwork.id}-${view.state}`;
 if(imageUrls.has(key))return imageUrls.get(key);
 const renderer=await getRenderer(view,wanted),blob=await pngBlob(renderer.render(view.state));
 if(imageUrls.has(key))return imageUrls.get(key);
 const url=URL.createObjectURL(blob);imageUrls.set(key,url);
 while(imageUrls.size>6){const oldest=imageUrls.keys().next().value;URL.revokeObjectURL(imageUrls.get(oldest));imageUrls.delete(oldest);}
 return url;
}

// --- Wall color: trimmed mean of the artwork's edge ring, clamped to a band --
const WALL_OVERRIDES={};
const wallCache=new Map();
const linear=c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;};
const relLum=([r,g,b])=>.2126*linear(r)+.7152*linear(g)+.0722*linear(b);
function hueSat([r,g,b]){
 r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min,l=(max+min)/2;
 const s=d===0?0:d/(1-Math.abs(2*l-1));let h=0;
 if(d){if(max===r)h=((g-b)/d)%6;else if(max===g)h=(b-r)/d+2;else h=(r-g)/d+4;h=(h*60+360)%360;}
 return [h,s];
}
function sampleWall(img,id){
 if(WALL_OVERRIDES[id])return WALL_OVERRIDES[id];
 if(wallCache.has(id))return wallCache.get(id);
 const w=48,h=32,canvas=Object.assign(document.createElement('canvas'),{width:w,height:h}),ctx=canvas.getContext('2d',{willReadFrequently:true});
 ctx.drawImage(img,0,0,w,h);const data=ctx.getImageData(0,0,w,h).data,ring=[];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(y>1&&y<h-2&&x>1&&x<w-2)continue;const o=(y*w+x)*4;ring.push([data[o],data[o+1],data[o+2]]);}
 ring.sort((a,b)=>relLum(a)-relLum(b));const cut=Math.floor(ring.length*.1),kept=ring.slice(cut,ring.length-cut);
 const mean=[0,1,2].map(ch=>kept.reduce((sum,p)=>sum+p[ch],0)/kept.length);
 const mode=relLum(mean)>.22?'light':'dark',[hue,sat]=hueSat(mean);
 const wall=`hsl(${Math.round(hue)} ${Math.round(Math.min(sat*.6,.3)*100)}% ${mode==='light'?92:13}%)`;
 const result={wall,mode};wallCache.set(id,result);return result;
}
function applyWall({wall,mode},artworkId){
 const root=document.documentElement;root.dataset.mode=mode;root.style.setProperty('--wall',wall);
 $('theme-color').content=wall;try{localStorage.setItem(WALL_KEY,`${wall}|${mode}|${artworkId}`);}catch{}
}

// --- Rendering the chosen view -------------------------------------------
const polygonPath=points=>`M${points.map(p=>p.join(',')).join('L')}Z`;
function commitArtwork(view,url,decoded){
 const artwork=artworkFor(view);
 image.src=url;image.width=artwork.width;image.height=artwork.height;
 image.alt=`${viewLabel(view)}. ${stateName(view.state)}.`;
 image.dataset.artwork=artwork.id;image.dataset.state=String(view.state);
 artWrap.style.setProperty('--ratio',`${artwork.width}/${artwork.height}`);
 hits.setAttribute('viewBox',`0 0 ${artwork.width} ${artwork.height}`);
 for(const room of rooms){
  const region=artwork.regions[room.id],d=region.polygons.map(polygonPath).join('');
  paths.get(room.id).setAttribute('d',d);rings.get(room.id).setAttribute('d',d);
  const label=labels.get(room.id);label.style.left=`${100*region.label[0]/artwork.width}%`;label.style.top=`${100*region.label[1]/artwork.height}%`;
 }
 try{applyWall(sampleWall(decoded,artwork.id),artwork.id);}catch{}
 fitSheet();
}
function sync(){
 const {state,style,time,collection}=selection,count=litCount(state),artwork=artworkFor(selection);
 for(const room of rooms){
  const on=Boolean(state&room.bit);
  const tile=tiles.get(room.id);tile.setAttribute('aria-checked',String(on));tile.querySelector('.state-text').textContent=on?'On':'Off';
  paths.get(room.id).setAttribute('aria-checked',String(on));
  labels.get(room.id).dataset.on=String(on);
 }
 $('status').textContent=count===0?'No lights on':`${count} of 5 lights on`;
 $('all-on').setAttribute('aria-disabled',String(state===ALL_ON));$('all-off').setAttribute('aria-disabled',String(state===0));
 $('time-day').setAttribute('aria-pressed',String(time==='day'));$('time-night').setAttribute('aria-pressed',String(time==='night'));
 $('time-seg').dataset.auto=String(auto);$('time-seg').title=auto?'Following the clock':'';
 $('scene-name').textContent=styleTab(styleById(style));$('scene-thumb').src=artwork.thumb;
 $('scene-chip').setAttribute('aria-label',`Change the art style. Now ${viewLabel(selection)}${collection==='gemini'?', Gemini collection':''}.`);
 document.title=count===5?'Home · all lights on':count===0?'Home · lights off':`Home · ${count} of 5 on`;
 history.replaceState(null,'',serializeHash(selection)+(auto?'&auto=1':''));
 $('v1-link').href=`../${serializeHash(selection)}`;
 gallery.querySelectorAll('.state-card').forEach(card=>card.setAttribute('aria-pressed',String(Number(card.dataset.state)===state)));
 if(sceneSheet.open)renderScene();
 $('labels-toggle').setAttribute('aria-checked',String(prefs.labels));labelsHost.hidden=!prefs.labels;
 $('auto-toggle').setAttribute('aria-checked',String(auto));
 syncFavorite();
}
function showError(message){$('error').hidden=false;$('error-text').textContent=message;announce(message);}
async function choose(update){
 const next={...selection,...update};
 if(['collection','style','time'].some(key=>update[key]!==undefined&&update[key]!==selection[key])&&!Object.hasOwn(update,'artworkId'))delete next.artworkId;
 const target=artworkFor(next);
 if(!target||!Number.isInteger(next.state)||next.state<0||next.state>ALL_ON)throw new Error('Choose a valid style, time, and lighting combination.');
 // Any explicit time that disagrees with the clock stops following it.
 if(update.time!==undefined&&auto&&update.time!==clockTime()){setAuto(false);toast('Following the clock is off.');}
 const viewChanged=artworkFor(selection)?.id!==target.id,wanted=()=>artworkFor(selection).id===target.id;
 selection=next;const version=++drawVersion;sync();
 art.setAttribute('aria-busy','true');
 let announced=false;
 const timer=setTimeout(()=>{if(version!==drawVersion)return;$('progress').hidden=false;if(viewChanged){announce(`Loading ${viewLabel(next)}`);announced=true;}},180);
 if(viewChanged){clearGallery();if(gallery.open)gallery.close();}
 try{
  const url=await getImageUrl(next,wanted),decoded=new Image();decoded.src=url;await decoded.decode();
  if(version!==drawVersion)return false;
  commitArtwork(next,url,decoded);
  displayed={...next};failed=null;$('error').hidden=true;
  if(announced)announce(`${viewLabel(next)} loaded`);
  // Warm the renderer so the first room toggle on this artwork is quick.
  getRenderer(next,wanted).catch(()=>{});
  return true;
 }catch{
  if(version===drawVersion){failed={...next};selection={...displayed};sync();showError('That view could not load. Your previous view is still here.');}
  return false;
 }finally{clearTimeout(timer);if(version===drawVersion){art.setAttribute('aria-busy','false');$('progress').hidden=true;}}
}
const toggleRoom=room=>choose({state:selection.state^room.bit});

// --- Build the image overlays and the board -------------------------------
const hover=(room,on)=>{paths.get(room.id).classList.toggle('is-hovered',on);tiles.get(room.id).classList.toggle('is-hovered',on);};
for(const room of rooms){
 const ring=document.createElementNS(SVG,'path');ring.setAttribute('class','room-ring');ring.setAttribute('aria-hidden','true');
 const path=document.createElementNS(SVG,'path');
 path.setAttribute('class','room');path.setAttribute('role','switch');path.setAttribute('tabindex','0');path.setAttribute('aria-label',`${room.name} light`);path.dataset.room=room.id;
 const press=()=>{if(!matchMedia('(prefers-reduced-motion:reduce)').matches){path.classList.remove('flash');void path.getBBox();path.classList.add('flash');}toggleRoom(room);};
 path.addEventListener('click',press);
 path.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();press();}});
 path.addEventListener('pointerenter',()=>tiles.get(room.id)?.classList.add('is-hovered'));
 path.addEventListener('pointerleave',()=>tiles.get(room.id)?.classList.remove('is-hovered'));
 hits.append(ring,path);paths.set(room.id,path);rings.set(room.id,ring);
 // Markers are indicators: a lit dot on phones, a named pill on larger screens.
 const label=document.createElement('button');label.className='label';label.tabIndex=-1;label.setAttribute('aria-hidden','true');label.innerHTML=`<span>${room.name}</span>`;
 label.onclick=()=>toggleRoom(room);label.onpointerenter=()=>hover(room,true);label.onpointerleave=()=>hover(room,false);
 labelsHost.append(label);labels.set(room.id,label);
}
for(const floor of ['Upstairs','Downstairs']){
 const eyebrow=document.createElement('div');eyebrow.className='eyebrow';eyebrow.textContent=floor;$('board').append(eyebrow);
 for(const room of rooms.filter(r=>r.floor===floor)){
  const tile=document.createElement('button');tile.className=`tile${floor==='Downstairs'?' wide':''}`;tile.setAttribute('role','switch');tile.setAttribute('aria-label',`${room.name} light, ${floor.toLowerCase()}`);
  tile.innerHTML=`<span class="name">${icon(glyphs[room.id])}<span>${room.name}</span></span><span class="state"><span class="pip" aria-hidden="true"></span><span class="state-text">On</span></span>`;
  tile.onclick=()=>toggleRoom(room);tile.onpointerenter=()=>paths.get(room.id).classList.add('is-hovered');tile.onpointerleave=()=>paths.get(room.id).classList.remove('is-hovered');
  $('board').append(tile);tiles.set(room.id,tile);
 }
}
$('all-on').onclick=()=>{if($('all-on').getAttribute('aria-disabled')!=='true')choose({state:ALL_ON});};
$('all-off').onclick=()=>{if($('all-off').getAttribute('aria-disabled')!=='true')choose({state:0});};
$('time-day').onclick=()=>choose({time:'day'});$('time-night').onclick=()=>choose({time:'night'});
$('retry').onclick=()=>choose(failed||selection);

// --- Sheets and dialogs ----------------------------------------------------
function closeOnBackdrop(dialog){
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.querySelectorAll('[data-close]').forEach(button=>button.onclick=()=>dialog.close());
}
[sceneSheet,moreSheet,gallery,favorites].forEach(closeOnBackdrop);
addEventListener('keydown',event=>{if(event.key==='Escape')document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());});
// The style sheet stops above the artwork so the house is visible while browsing.
function fitSheet(){
 const rect=art.getBoundingClientRect();
 sceneSheet.style.setProperty('--sheet-max',`${Math.max(240,Math.round(innerHeight-rect.bottom-10))}px`);
}
addEventListener('resize',fitSheet);

function renderScene(){
 const {collection,style,time}=selection;
 const seg=$('collection-seg'),grid=$('style-grid'),chips=$('version-chips');
 // Rebuilding drops focus; put it back on the checked control of the same group.
 const active=document.activeElement,host=[seg,grid,chips].find(el=>el.contains(active));
 seg.replaceChildren(...collections.map(item=>{
  const button=document.createElement('button');button.textContent=item.name;button.setAttribute('aria-pressed',String(item.id===collection));button.disabled=!hasCollection(item.id,selection);
  button.onclick=()=>choose({collection:item.id});return button;
 }));
 grid.replaceChildren(...styles.map(item=>{
  const view={collection,style:item.id,time},artwork=artworkFor(view),options=artworkOptions(view),active=item.id===style;
  const button=document.createElement('button');button.className='style-opt';button.setAttribute('role','radio');button.setAttribute('aria-checked',String(active));button.tabIndex=active?0:-1;button.dataset.style=item.id;
  button.setAttribute('aria-label',`${item.name}${options.length>1?`, ${options.length} versions`:''}`);
  button.innerHTML=`<img src="${artwork?.thumb||''}" alt="" loading="lazy" width="120" height="80"><span class="style-name">${styleTab(item)}</span>${options.length>1?`<span class="badge" aria-hidden="true">${options.length}</span>`:''}`;
  button.disabled=!artwork;button.onclick=()=>choose({style:item.id});
  return button;
 }));
 const options=artworkOptions(selection),current=artworkFor(selection);
 $('versions').hidden=options.length<2;
 chips.replaceChildren(...options.map(option=>{
  const chip=document.createElement('button');chip.className='chip';chip.setAttribute('role','radio');chip.setAttribute('aria-checked',String(option.id===current.id));chip.textContent=option.variantLabel||'Current';
  chip.onclick=()=>choose({artworkId:option.id});return chip;
 }));
 if(host){const next=host.querySelector('[aria-checked=true]:not([disabled]),[aria-pressed=true]:not([disabled])')||grid.querySelector('[aria-checked=true]');next?.focus({preventScroll:true});}
}
// Arrow keys move focus between styles; Enter or Space selects (same as the original tabs).
$('style-grid').addEventListener('keydown',event=>{
 const items=[...$('style-grid').querySelectorAll('.style-opt')],index=items.indexOf(document.activeElement);if(index<0)return;
 const columns=getComputedStyle($('style-grid')).gridTemplateColumns.split(' ').length;let target;
 if(event.key==='ArrowRight')target=(index+1)%items.length;if(event.key==='ArrowLeft')target=(index+items.length-1)%items.length;
 if(event.key==='ArrowDown')target=Math.min(items.length-1,index+columns);if(event.key==='ArrowUp')target=Math.max(0,index-columns);
 if(event.key==='Home')target=0;if(event.key==='End')target=items.length-1;
 if(target!==undefined){event.preventDefault();items.forEach(item=>item.tabIndex=-1);items[target].tabIndex=0;items[target].focus();}
});
$('scene-chip').onclick=()=>{renderScene();fitSheet();sceneSheet.showModal();$('style-grid').querySelector('[aria-checked=true]')?.focus();};
$('more-btn').onclick=()=>{syncFavorite();moreSheet.showModal();};

// Markers and the clock.
$('labels-toggle').onclick=()=>{prefs.labels=!prefs.labels;savePrefs();sync();};
$('auto-toggle').onclick=()=>{setAuto(!auto);if(auto)choose({time:clockTime()});else sync();};
setInterval(()=>{if(auto&&clockTime()!==selection.time)choose({time:clockTime()});},60000);

// --- Toast, saving and exporting -------------------------------------------
let toastTimer;
function toast(message){const el=$('toast');el.textContent=message;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{el.hidden=true;},3200);announce(message);}
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
$('save-image').onclick=async()=>{
 const view={...displayed};moreSheet.close();
 try{const renderer=await getRenderer(view);download(await pngBlob(renderer.render(view.state)),exportName(view.state,view));}
 catch{showError('The image could not be saved. Please try again.');}
};
$('download-all').onclick=async()=>{
 const button=$('download-all'),status=$('download-status'),view={...displayed};if(button.disabled)return;button.disabled=true;
 try{
  const renderer=await getRenderer(view),files=[];
  for(let value=0;value<32;value++){
   status.textContent=`${value+1} / 32`;
   files.push({name:exportName(value,view),data:new Uint8Array(await(await pngBlob(renderer.render(value))).arrayBuffer())});
   await new Promise(resolve=>setTimeout(resolve,0));
  }
  const artwork=artworkFor(view);
  const manifest={schema_version:2,collection:collectionById(view.collection).name,artwork_id:artwork.id,provenance:artwork.provenance,style:styleById(view.style).name,time:view.time,width:renderer.width,height:renderer.height,bit_order:rooms.map(r=>r.name),states:Array.from({length:32},(_,state)=>({file:exportName(state,view),lights:Object.fromEntries(rooms.map(r=>[r.name,Boolean(state&r.bit)]))}))};
  files.push({name:'lighting-manifest.json',data:new TextEncoder().encode(JSON.stringify(manifest,null,2))});
  download(zipFiles(files),`${view.collection}-${view.style}-${view.time}${artwork.variant?'-'+artwork.variant:''}-all-32.zip`);
  moreSheet.close();toast(`All 32 images of ${viewLabel(view)} are ready.`);
 }catch{moreSheet.close();showError('The images could not be downloaded. Please try again.');}
 finally{status.textContent='ZIP';button.disabled=false;}
};

// --- Gallery of all 32 states ----------------------------------------------
let galleryVersion=0,galleryUrls=[];
function clearGallery(){galleryVersion++;galleryUrls.forEach(url=>URL.revokeObjectURL(url));galleryUrls=[];$('gallery-grid').replaceChildren();}
$('gallery-open').onclick=async()=>{
 moreSheet.close();clearGallery();const version=galleryVersion,view={...selection};
 $('gallery-caption').textContent=`${viewLabel(view)}. Choose one to set the lights.`;gallery.showModal();
 try{
  const renderer=await getRenderer(view);
  for(let value=31;value>=0;value--){
   if(version!==galleryVersion)return;
   const card=document.createElement('button');card.className='state-card';card.dataset.state=value;card.setAttribute('aria-pressed',String(value===selection.state));card.setAttribute('aria-label',`Set ${stateName(value).toLowerCase()}`);
   const count=litCount(value);
   card.innerHTML=`<img width="320" height="${Math.round(320*renderer.height/renderer.width)}" alt=""><span><b>${value===0?'All off':value===31?'All on':`${count} ${count===1?'light':'lights'} on`}</b>${value===0?(view.time==='day'?'Daylight only':'Night ambience'):value===31?'Every room lit':stateName(value)}</span>`;
   card.onclick=()=>{choose({...view,state:value});gallery.close();};$('gallery-grid').append(card);
   const blob=await pngBlob(renderer.render(value,320));if(version!==galleryVersion)return;
   const url=URL.createObjectURL(blob);galleryUrls.push(url);card.querySelector('img').src=url;
  }
 }catch{if(version===galleryVersion){const msg=document.createElement('p');msg.className='gallery-msg';msg.textContent='These previews could not load. Close and try again.';$('gallery-grid').replaceChildren(msg);}}
};
gallery.addEventListener('close',clearGallery);

// --- Favorites ---------------------------------------------------------------
// Thumbnails are kept for the life of the dialog so removing one row does not
// blank the others; they are revoked when the dialog closes.
let favVersion=0,favObserver=null;
const favUrls=new Map();
const favoriteTarget=()=>({artworkId:artworkFor(selection).id,state:selection.state});
function syncFavorite(){
 const {artworkId,state}=favoriteTarget(),saved=isFavorite(artworkId,state),count=favoriteItems().length;
 $('fav-toggle').setAttribute('aria-pressed',String(saved));$('fav-toggle-label').textContent=saved?'Favorited':'Favorite this view';
 $('fav-count').textContent=count?String(count):'';
 $('favorites-note').textContent=favoritesPersist()?'Saved in this browser.':'Kept for this visit only; browser storage is unavailable.';
}
function clearFavorites(){favVersion++;favObserver?.disconnect();favUrls.forEach(url=>URL.revokeObjectURL(url));favUrls.clear();$('fav-list').replaceChildren();}
function renderFavorites(){
 const list=$('fav-list'),rows=[...list.querySelectorAll('.fav-row')],focusedRow=rows.findIndex(row=>row.contains(document.activeElement));
 favVersion++;favObserver?.disconnect();list.replaceChildren();
 const version=favVersion,items=favoriteItems();syncFavorite();
 if(!items.length){
  const empty=document.createElement('div');empty.className='fav-empty';
  const text=document.createElement('span');text.textContent='Nothing saved yet.';
  const save=document.createElement('button');save.className='text-btn';save.textContent='Save this view';save.onclick=()=>{announce('Saved to favorites');const t=favoriteTarget();toggleFavorite(t.artworkId,t.state);};
  empty.append(text,save);list.append(empty);
  if(focusedRow>=0)favorites.querySelector('[data-close]').focus({preventScroll:true});
  return;
 }
 let queue=Promise.resolve();
 favObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;favObserver.unobserve(entry.target);
  queue=queue.then(async()=>{if(version!==favVersion)return;const row=entry.target,key=`${row.dataset.artwork}-${row.dataset.state}`,artwork=artworkById(row.dataset.artwork),view={collection:artwork.collection,style:artwork.style,time:artwork.time,artworkId:artwork.id,state:Number(row.dataset.state)};
   try{const renderer=await getRenderer(view),blob=await pngBlob(renderer.render(view.state,320));if(version!==favVersion)return;const url=URL.createObjectURL(blob);favUrls.set(key,url);row.querySelector('img').src=url;}catch{}
  });
 }},{root:favorites,rootMargin:'120px'});
 for(const item of items){
  const artwork=artworkById(item.artworkId),view={collection:artwork.collection,style:artwork.style,time:artwork.time,artworkId:artwork.id,state:item.state},key=`${artwork.id}-${item.state}`;
  const row=document.createElement('div');row.className='fav-row';row.dataset.artwork=artwork.id;row.dataset.state=String(item.state);
  const open=document.createElement('button');open.className='fav-open';open.setAttribute('aria-label',`Open ${viewLabel(view)}, ${stateName(item.state).toLowerCase()}`);
  open.innerHTML=`<img width="96" height="64" alt=""><span><b>${viewLabel(view)}${artwork.collection==='gemini'?' · Gemini':''}</b>${stateName(item.state)}</span>`;
  open.onclick=()=>{choose(view);favorites.close();};
  const remove=document.createElement('button');remove.className='fav-remove';remove.setAttribute('aria-label',`Remove ${viewLabel(view)} from favorites`);remove.innerHTML='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  remove.onclick=()=>{announce(`Removed ${viewLabel(view)} from favorites`);toggleFavorite(artwork.id,item.state);};
  row.append(open,remove);list.append(row);
  if(favUrls.has(key))open.querySelector('img').src=favUrls.get(key);else favObserver.observe(row);
 }
 if(focusedRow>=0){const removes=list.querySelectorAll('.fav-remove');removes[Math.min(focusedRow,removes.length-1)]?.focus({preventScroll:true});}
}
$('fav-toggle').onclick=()=>{const t=favoriteTarget();toggleFavorite(t.artworkId,t.state);};
$('fav-open').onclick=()=>{moreSheet.close();renderFavorites();favorites.showModal();};
favorites.addEventListener('close',clearFavorites);
onFavoritesChanged(()=>{syncFavorite();if(favorites.open)renderFavorites();});

addEventListener('hashchange',()=>{const next=readHash();if(next)choose(next);});
registerHomeTool(()=>selection,choose);
syncFavorite();
choose(selection);
