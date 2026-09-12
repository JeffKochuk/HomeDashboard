// Catalog for /v2: the same rooms, styles and artworks as the original app,
// with asset paths resolved from this folder and thumbnails for the picker.
import {styles,styleById} from './styles.js';
import {rooms,WIDTH,HEIGHT,roomGeometry,stateKey,stateName,stateFile} from './rooms.js';
import {geminiArtworks} from './gemini-artworks.js';
export {styles,styleById,rooms,WIDTH,HEIGHT,stateKey,stateName};

export const collections=[{id:'original',name:'Original'},{id:'gemini',name:'Gemini'}];
export const collectionById=id=>collections.find(c=>c.id===id);
export const times=[{id:'day',name:'Day'},{id:'night',name:'Night'}];

// Artwork paths are written for the original app at the site root ("./assets/…").
// From /v2/ the same files live one level up.
const fromRoot=path=>path.replace(/^\.\//,'../');
const thumbFor=path=>path.replace(/^\.\/assets\//,'./thumbs/').replace(/\.[a-z]+$/i,'.jpg');

const originals=styles.flatMap(style=>times.map(({id:time})=>{
 const on=`./assets/styles/${style.id}-${time}.png`;
 return {
  id:`original/${style.id}/${time}/v1`,collection:'original',style:style.id,time,width:WIDTH,height:HEIGHT,
  on,off:`./assets/styles/${style.id}-${time}-off.png`,
  regions:Object.fromEntries(rooms.map(room=>{const g=roomGeometry(room,style.id);return [room.id,{polygons:[g.points],label:g.label}];})),
  provenance:{provider:style.id==='original'&&time==='day'?'User-supplied reference':'OpenAI image generation',geometryVersion:'original-v1'}
 };
}));
export const artworks=[...originals,...geminiArtworks].map(a=>({...a,on:fromRoot(a.on),off:fromRoot(a.off),thumb:thumbFor(a.on)}));
export const artworkById=id=>artworks.find(a=>a.id===id);
export const artworkOptions=view=>artworks.filter(a=>a.collection===(view.collection||'original')&&a.style===view.style&&a.time===view.time);
export const artworkFor=view=>{const options=artworkOptions(view);return options.find(a=>a.id===view.artworkId)||options[0];};
export const hasCollection=(collection,view)=>Boolean(artworkFor({...view,collection}));
export const viewLabel=view=>{const a=artworkFor(view);return `${styleById(view.style).name} · ${view.time==='day'?'Day':'Night'}${a?.variantLabel?' · '+a.variantLabel:''}`;};
export const exportName=(state,view)=>{const a=artworkFor(view);return stateFile(state,view.style,view.time,view.collection).replace('.png',`${a.variant?'-'+a.variant:''}.png`);};

export const litCount=state=>rooms.filter(r=>state&r.bit).length;
export const ALL_ON=31;

// URL hash: identical to the original app so links open the same view in both.
// "#lights=10110&style=…" or the legacy five-bit "#10110" (living, kitchen, bedroom, hallway, study).
const bitsToState=bits=>rooms.reduce((s,r,i)=>s+(bits[i]==='1'?r.bit:0),0);
export function parseHash(hash=location.hash){
 const text=hash.replace(/^#/,'');
 if(/^[01]{5}$/.test(text))return {collection:'original',style:'original',time:'day',state:bitsToState(text)};
 const params=new URLSearchParams(text);
 const view={collection:params.get('collection')||'original',style:params.get('style'),time:params.get('time')},lights=params.get('lights');
 if(!view.style||!artworkFor(view)||!/^[01]{5}$/.test(lights||''))return null;
 const artworkId=params.get('artwork')||undefined;
 if(artworkId&&!artworkOptions(view).some(a=>a.id===artworkId))return null;
 return {...view,artworkId,state:bitsToState(lights)};
}
export function serializeHash(view){
 const params=new URLSearchParams({collection:view.collection,style:view.style,time:view.time,lights:stateKey(view.state)});
 // Write the resolved id so a stale artworkId can never produce an unreadable link.
 if(view.artworkId){const artwork=artworkFor(view);if(artwork)params.set('artwork',artwork.id);}
 return `#${params}`;
}
