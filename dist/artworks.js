import {styles,styleById} from './styles.js';
import {rooms,WIDTH,HEIGHT,roomGeometry} from './rooms.js';
import {geminiArtworks} from './gemini-artworks.js';

export const collections=[{id:'original',name:'Original set'},{id:'gemini',name:'Gemini set'}];
export const collectionById=id=>collections.find(c=>c.id===id);
const originals=styles.flatMap(style=>['day','night'].map(time=>({
 id:`original/${style.id}/${time}/v1`,collection:'original',style:style.id,time,
 width:WIDTH,height:HEIGHT,
 on:`./assets/styles/${style.id}-${time}.png`,off:`./assets/styles/${style.id}-${time}-off.png`,
 regions:Object.fromEntries(rooms.map(room=>{const g=roomGeometry(room,style.id);return [room.id,{polygons:[g.points],label:g.label}];})),
 provenance:{provider:style.id==='original'&&time==='day'?'User-supplied reference':'OpenAI image generation',geometryVersion:'original-v1'}
})));
export const artworks=[...originals,...geminiArtworks];
export const artworkById=id=>artworks.find(a=>a.id===id);
export const artworkOptions=view=>artworks.filter(a=>a.collection===(view.collection||'original')&&a.style===view.style&&a.time===view.time);
export const artworkFor=view=>{const options=artworkOptions(view);return options.find(a=>a.id===view.artworkId)||options[0];};
export const selectionKey=view=>artworkFor(view)?.id;
export const assetPath=view=>artworkFor(view).on;
export const selectionLabel=view=>`${collectionById(view.collection||'original').name} · ${styleById(view.style).name} · ${view.time==='day'?'Day':'Night'}${artworkFor(view)?.variantLabel?' · '+artworkFor(view).variantLabel:''}`;
export const availableCollection=(collection,view)=>Boolean(artworkFor({...view,collection}));
