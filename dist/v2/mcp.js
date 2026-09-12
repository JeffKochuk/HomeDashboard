// Optional WebMCP registration (document.modelContext). Feature-detected; invisible in the UI.
import {rooms,styles,collections,collectionById,styleById} from './catalog.js';
export function registerHomeTool(getSelection,choose){
 const context=document.modelContext;
 if(!context?.registerTool)return;
 const lifecycle=new AbortController();addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
 const lightProperties=Object.fromEntries(rooms.map(r=>[r.id,{type:'boolean'}]));
 const tool={name:'set_home_view',title:'Set home style and lights',description:'Choose an artwork style, day or night, and room lights in the home dashboard.',
  inputSchema:{type:'object',properties:{collection:{type:'string',enum:collections.map(c=>c.id)},style:{type:'string',enum:styles.map(s=>s.id)},time:{type:'string',enum:['day','night']},lights:{type:'object',properties:lightProperties,additionalProperties:false}},additionalProperties:false},
  annotations:{readOnlyHint:false,untrustedContentHint:false},
  async execute(input){
   if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['collection','style','time','lights'].includes(k)))throw new Error('Provide a style, time, or room lights.');
   if(input.collection!==undefined&&!collectionById(input.collection))throw new Error('Unknown collection.');
   if(input.style!==undefined&&!styleById(input.style))throw new Error('Unknown style.');
   if(input.time!==undefined&&!['day','night'].includes(input.time))throw new Error('Unknown time.');
   if(input.lights!==undefined&&(!input.lights||typeof input.lights!=='object'||Array.isArray(input.lights)||Object.entries(input.lights).some(([key,value])=>!rooms.some(r=>r.id===key)||typeof value!=='boolean')))throw new Error('Lights must map room names to true or false.');
   const selection=getSelection(),next={...selection};
   if(['collection','style','time'].some(key=>input[key]!==undefined&&input[key]!==selection[key]))delete next.artworkId;
   for(const key of ['collection','style','time'])if(input[key]!==undefined)next[key]=input[key];
   for(const room of rooms)if(input.lights&&room.id in input.lights)next.state=input.lights[room.id]?next.state|room.bit:next.state&~room.bit;
   if(!await choose(next))throw new Error('View was not loaded.');
   const now=getSelection();
   return {...now,lights:Object.fromEntries(rooms.map(r=>[r.id,Boolean(now.state&r.bit)]))};
  }};
 try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}
}
