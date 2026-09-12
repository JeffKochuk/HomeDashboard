import {artworkById} from './artworks.js';
const KEY='home-dashboard:favorites:v1';
let items=[],persistent=true;
const listeners=new Set();
function parse(text){
 try{const value=JSON.parse(text);if(value?.version!==1||!Array.isArray(value.items))return [];
  const seen=new Set();return value.items.filter(item=>{
   if(!item||!artworkById(item.artworkId)||!Number.isInteger(item.state)||item.state<0||item.state>31)return false;
   const key=`${item.artworkId}:${item.state}`;if(seen.has(key))return false;seen.add(key);return true;
  }).slice(0,1024).map(({artworkId,state})=>({artworkId,state}));
 }catch{return [];}
}
try{items=parse(localStorage.getItem(KEY));}catch{persistent=false;}
const notify=()=>listeners.forEach(fn=>fn());
export const favoriteItems=()=>items.map(item=>({...item}));
export const favoritesPersist=()=>persistent;
export const isFavorite=(artworkId,state)=>items.some(i=>i.artworkId===artworkId&&i.state===state);
export function toggleFavorite(artworkId,state){
 if(!artworkById(artworkId)||!Number.isInteger(state)||state<0||state>31)return;
 if(isFavorite(artworkId,state))items=items.filter(i=>i.artworkId!==artworkId||i.state!==state);
 else items.unshift({artworkId,state});
 try{localStorage.setItem(KEY,JSON.stringify({version:1,items}));persistent=true;}catch{persistent=false;}
 notify();
}
export const onFavoritesChanged=fn=>{listeners.add(fn);return()=>listeners.delete(fn);};
addEventListener('storage',event=>{
 try{if(event.storageArea!==localStorage)return;}catch{return;}
 if(event.key===KEY||event.key===null){items=event.key===null?[]:parse(event.newValue);notify();}
});
