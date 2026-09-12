import {rooms,WIDTH,HEIGHT,polygonPath,roomGeometry} from './rooms.js';
import {assetPath} from './styles.js';
const canvas = (width=WIDTH) => Object.assign(document.createElement('canvas'),{width,height:Math.round(width*HEIGHT/WIDTH)});

async function load(src){const image=new Image();image.src=src;await image.decode();return image;}

const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
function illumination(image){
  const c=canvas(),ctx=c.getContext('2d',{willReadFrequently:true});
  ctx.filter='blur(10px)';ctx.drawImage(image,0,0,WIDTH,HEIGHT);
  return ctx.getImageData(0,0,WIDTH,HEIGHT).data;
}
// Transfer broad illumination only. The master supplies every spatial detail;
// generated all-off references never replace furniture, outlines, or texture.
export async function createRenderer(style,time){
  const paths=rooms.map(room=>new Path2D(polygonPath(roomGeometry(room,style).points)));
  const [original,reference]=await Promise.all([
    load(assetPath(style,time)),load(`./assets/styles/${style}-${time}-off.png`)
  ]);
  const source=canvas(),ctx=source.getContext('2d',{willReadFrequently:true});
  ctx.drawImage(original,0,0,WIDTH,HEIGHT);
  const off=ctx.getImageData(0,0,WIDTH,HEIGHT);
  const bright=illumination(original),dim=illumination(reference);
  // Daylight remains bright; night retains readable ambient light. Gain limits
  // prevent halo artifacts where a generated reference slightly shifts an edge.
  const ceiling=time==='day'?.96:.78;
  for(let i=0;i<off.data.length;i+=4){
    // Allow blue to rise as warm electric light gives way to cool ambient light.
    // Cap luminance, rather than individual channels, to avoid green lamp cores.
    const gain=[0,1,2].map(ch=>clamp(dim[i+ch]/Math.max(16,bright[i+ch]),.08,2.5));
    const before=.2126*bright[i]+.7152*bright[i+1]+.0722*bright[i+2];
    const after=.2126*bright[i]*gain[0]+.7152*bright[i+1]*gain[1]+.0722*bright[i+2]*gain[2];
    const limit=Math.min(1,ceiling*before/Math.max(1,after));
    for(let ch=0;ch<3;ch++){
      off.data[i+ch]*=gain[ch]*limit;
    }
  }
  const dark=canvas();dark.getContext('2d').putImageData(off,0,0);
  return {render(state,width=WIDTH){
    if(!Number.isInteger(state)||state<0||state>31)throw new Error('Invalid lighting state.');
    const result=canvas(width),out=result.getContext('2d');
    out.scale(result.width/WIDTH,result.height/HEIGHT);out.drawImage(source,0,0);
    rooms.forEach((room,i)=>{if(!(state&room.bit)){out.save();out.clip(paths[i]);out.drawImage(dark,0,0);out.restore();}});
    return result;
  }};
}
export const pngBlob = canvas => new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image export failed.')),'image/png'));
