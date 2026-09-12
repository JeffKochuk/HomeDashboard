import {rooms,polygonPath} from './rooms.js';
async function load(src){const image=new Image();image.src=src;await image.decode();return image;}
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));

// Every lighting state retains the selected starter's geometry and fine detail.
// The generated off reference supplies only a broad illumination field.
export async function createRenderer(artwork){
 if(!artwork)throw new Error('Artwork is unavailable.');
 const {width:widthFull,height:heightFull,time}=artwork;
 const canvas=(width=widthFull)=>Object.assign(document.createElement('canvas'),{width,height:Math.round(width*heightFull/widthFull)});
 const paths=rooms.map(room=>new Path2D(artwork.regions[room.id].polygons.map(polygonPath).join('')));
 const [original,reference]=await Promise.all([load(artwork.on),load(artwork.off)]);
 if(original.naturalWidth!==widthFull||original.naturalHeight!==heightFull)throw new Error('Artwork dimensions do not match its registered size.');
 if(Math.abs((reference.naturalWidth/reference.naturalHeight)/(widthFull/heightFull)-1)>.01)throw new Error('Lighting reference aspect ratio does not match the artwork.');
 const source=canvas(),ctx=source.getContext('2d',{willReadFrequently:true});ctx.drawImage(original,0,0);
 const off=ctx.getImageData(0,0,widthFull,heightFull);
 function illumination(image){const c=canvas(),x=c.getContext('2d',{willReadFrequently:true});x.filter=`blur(${10*widthFull/1536}px)`;x.drawImage(image,0,0,widthFull,heightFull);return x.getImageData(0,0,widthFull,heightFull).data;}
 const bright=illumination(original),dim=illumination(reference),ceiling=time==='day'?.96:.78;
 for(let i=0;i<off.data.length;i+=4){
  const gain=[0,1,2].map(ch=>clamp(dim[i+ch]/Math.max(16,bright[i+ch]),.08,2.5));
  const before=.2126*bright[i]+.7152*bright[i+1]+.0722*bright[i+2];
  const after=.2126*bright[i]*gain[0]+.7152*bright[i+1]*gain[1]+.0722*bright[i+2]*gain[2];
  const limit=Math.min(1,ceiling*before/Math.max(1,after));
  for(let ch=0;ch<3;ch++)off.data[i+ch]*=gain[ch]*limit;
 }
 const dark=canvas();dark.getContext('2d').putImageData(off,0,0);
 return {width:widthFull,height:heightFull,render(state,width=widthFull){
  if(!Number.isInteger(state)||state<0||state>31)throw new Error('Invalid lighting state.');
  const result=canvas(width),out=result.getContext('2d');out.scale(result.width/widthFull,result.height/heightFull);out.drawImage(source,0,0);
  rooms.forEach((room,i)=>{if(!(state&room.bit)){out.save();out.clip(paths[i]);out.drawImage(dark,0,0);out.restore();}});
  return result;
 }};
}
export const pngBlob=canvas=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image export failed.')),'image/png'));
