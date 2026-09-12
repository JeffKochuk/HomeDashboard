import {rooms,WIDTH,HEIGHT,polygonPath} from './rooms.js';
const canvas = () => Object.assign(document.createElement('canvas'),{width:WIDTH,height:HEIGHT});
async function load(src){const image=new Image();image.src=src;await image.decode();return image;}
const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
// Transfer only broad illumination, never generated furniture/edges/texture.
// Source pixels remain spatially registered, with the exterior left untouched.
export async function createRenderer(){
  const [original,reference]=await Promise.all([load('./assets/watercolor-original.jpeg'),load('./assets/watercolor-unlit-reference.png')]);
  const source=canvas(), sourceCtx=source.getContext('2d',{willReadFrequently:true});sourceCtx.drawImage(original,0,0,WIDTH,HEIGHT);
  const originalData=sourceCtx.getImageData(0,0,WIDTH,HEIGHT);
  function blurred(image){const c=canvas(),ctx=c.getContext('2d',{willReadFrequently:true});ctx.filter='blur(14px)';ctx.drawImage(image,0,0,WIDTH,HEIGHT);return ctx.getImageData(0,0,WIDTH,HEIGHT).data;}
  const bright=blurred(original), dim=blurred(reference);
  const offData=new ImageData(new Uint8ClampedArray(originalData.data),WIDTH,HEIGHT);
  for(let i=0;i<offData.data.length;i+=4){
    // Gain is low frequency. Clamp prevents bright edge halos from the reference.
    for(let ch=0;ch<3;ch++){
      const gain=clamp(dim[i+ch]/Math.max(16,bright[i+ch]),[.16,.20,.28][ch],[.53,.61,.76][ch]);
      offData.data[i+ch]=originalData.data[i+ch]*gain;
    }
  }
  const dark=canvas();dark.getContext('2d').putImageData(offData,0,0);
  const layers=rooms.map(room=>{
    const layer=canvas(),ctx=layer.getContext('2d');
    ctx.save();ctx.clip(new Path2D(polygonPath(room.points)));ctx.drawImage(dark,0,0);ctx.restore();return layer;
  });
  return {render(state){
    if(!Number.isInteger(state)||state<0||state>31)throw new Error('Invalid lighting state.');
    const result=canvas(),ctx=result.getContext('2d');ctx.drawImage(source,0,0);
    rooms.forEach((room,i)=>{if(!(state&room.bit))ctx.drawImage(layers[i],0,0);});
    return result;
  }};
}
export const pngBlob = canvas => new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Image export failed.')),'image/png'));
