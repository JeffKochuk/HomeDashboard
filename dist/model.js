import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

export const ROOMS = [
 {id:'living',name:'Living room',detail:'Warm living-room lamps',floor:'down',icon:'sofa',pin:[-5.05,.55,2.28]},
 {id:'kitchen',name:'Kitchen & dining',detail:'Counter & dining lights',floor:'down',icon:'kitchen',pin:[1.5,.45,2.28]},
 {id:'bedroom',name:'Bedroom',detail:'Soft bedside light',floor:'up',icon:'bed',pin:[-5.35,4,2.25]},
 {id:'gallery',name:'Stair gallery',detail:'Warm gallery sconces',floor:'both',icon:'stairs',pin:[-.55,3.95,2.25]},
 {id:'study',name:'Study',detail:'Desk & reading lamps',floor:'up',icon:'desk',pin:[4.8,4,2.25]},
];

export function buildHome(scene, referenceTexture=null) {
 const root=new THREE.Group(); scene.add(root);
 const floors={down:new THREE.Group(),up:new THREE.Group()}; root.add(floors.down,floors.up);
 const rooms=Object.fromEntries(ROOMS.map(r=>[r.id,{...r,on:false,fade:0,lights:[],glows:[],materials:[],meshes:[]}]));
 const picks=[]; let group=floors.down,room='living';
 const mats=new Map(), geometries=new Map();
 const color={wall:'#eee2d3',trim:'#f7eee3',wood:'#c58e60',oak:'#d3a273',dark:'#262b2e',linen:'#eae2cc',teal:'#5c797b',leaf:'#476746',brass:'#a77d44'};
 function material(c,opts={}) {const key=room+c+JSON.stringify(opts);if(!mats.has(key)){const m=new THREE.MeshStandardMaterial({color:c,roughness:.82,...opts});mats.set(key,m);rooms[room].materials.push(m);}return mats.get(key);}
 function mesh(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;m.userData.room=room;group.add(m);rooms[room].meshes.push(m);picks.push(m);return m;}
 function box(x,y,z,w,h,d,c,r=0){let key=[w,h,d,r].join();if(!geometries.has(key))geometries.set(key,r?new RoundedBoxGeometry(w,h,d,3,Math.min(r,w/3,h/3,d/3)):new THREE.BoxGeometry(w,h,d));return mesh(geometries.get(key),material(c),x,y,z);}
 function cyl(x,y,z,rt,rb,h,c,n=20){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),material(c),x,y,z);}
 function ball(x,y,z,rx,ry,rz,c){const m=mesh(new THREE.SphereGeometry(1,12,8),material(c),x,y,z);m.scale.set(rx,ry,rz);return m;}
 function rod(a,b,r,c){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);const m=cyl(...av.clone().add(bv).multiplyScalar(.5).toArray(),r,r,d.length(),c,8);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
 function zone(id,floor){room=id;group=floors[floor];}
 function floorRect(x,z,w,d,y){box(x,y-.17,z,w,.28,d,color.wall,.04);box(x,y-.02,z,w-.06,.045,d-.04,color.wood);for(let i=0;i<Math.ceil(d/.22);i++){const zz=z-d/2+i*.22+.1;if(zz>=z+d/2)continue;for(let j=0;j<4;j++){const len=w/4;box(x-w/2+len*(j+.5),y+.008,zz,len-.012,.014,.208,['#b88652','#c79a66','#c18f59','#b88a59'][(i+j)%4]);}}}
 function wall(x,z,w,d,y,h){box(x,y+h/2,z,w,h,d,color.wall,.025);box(x,y+.095,z+(d<w?.115:0),w,.12,d+.02,color.trim);}
 function frame(x,y,z,w,h,c,variant=0){box(x,y,z,w,h,.055,variant%3===0?'#544131':'#b69260',.025);box(x,y,z+.034,w-.075,h-.075,.015,'#ece3cc');box(x,y,z+.048,w-.15,h-.15,.014,c);const art=material(variant%2?'#344f5a':'#b88d56');const sun=mesh(new THREE.CircleGeometry(w*.12,24),art,x+w*.14,y+h*.14,z+.063);if(variant%2===0){box(x,y-h*.18,z+.065,w-.17,h*.16,.01,'#58716b');}else{const m=mesh(new THREE.CircleGeometry(w*.22,20),material('#d9ab70'),x,y,z+.065);m.scale.y=.8;}return sun;}
 function leafGeometry(){
  if(geometries.has('leaf'))return geometries.get('leaf');
  const v=[],uv=[],indices=[];
  for(let i=0;i<=10;i++){const t=i/10,spread=Math.sin(Math.PI*t)**.7*.23;for(const side of [-1,0,1]){v.push(side*spread,t,.13*Math.sin(Math.PI*t)+.11*t*t-Math.abs(side)*.065*Math.sin(Math.PI*t));uv.push((side+1)/2,t);}}
  for(let i=0;i<10;i++)for(let j=0;j<2;j++){const a=i*3+j;indices.push(a,a+3,a+1,a+1,a+3,a+4);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();geometries.set('leaf',g);return g;
 }
 function plant(x,y,z,s=1,pot='#b8a48c',trailing=false){
  cyl(x,y+.19*s,z,.19*s,.137*s,.36*s,pot,24);cyl(x,y+.36*s,z,.20*s,.20*s,.055*s,pot,24);cyl(x,y+.39*s,z,.176*s,.176*s,.016*s,'#382b22');
  for(let i=0;i<11;i++){const a=i*2.4,height=(.40+(i%4)*.11)*s,spread=(.16+(i%3)*.08)*s;const xx=x+Math.sin(a)*spread,zz=z+Math.cos(a)*spread;rod([x,y+.37*s,z],[xx,y+height+.1*s,zz],.009*s,'#536448');
   for(let j=0;j<2;j++){const lm=mesh(leafGeometry(),material(['#47613c','#73814a','#4c6d40','#858b52'][i%4],{side:THREE.DoubleSide,roughness:.65}),xx,y+height-j*.15*s,zz);lm.scale.set(s*.65,s*(.36+(i%3)*.11),s*.65);lm.rotation.set(.3+Math.cos(a)*.7,a,Math.sin(a)*.9+(j?-.5:.25));}
  }
  if(trailing)for(let strand=0;strand<3;strand++)for(let i=0;i<9;i++){const xx=x+(strand-1)*.09*s+Math.sin(i*1.6)*.05*s,yy=y+.28*s-i*.092*s,zz=z+.20*s;ball(xx,yy,zz,.05*s,.07*s,.027*s,'#507145');if(i)rod([xx,yy,zz],[xx,yy+.1*s,zz],.006*s,'#506c40');}
 }
 function rug(x,y,z,w,d,palette){
  box(x,y+.025,z,w,.035,d,'#c6ac94',.022);
  const nx=12,nz=8,vertices=[],colors=[],uv=[];
  const jitter=(i,j)=>Math.sin(i*127.1+j*311.7)*.32;
  const point=(i,j)=>[x-w/2+w*(i+(i>0&&i<nx?jitter(i,j):0))/nx,z-d/2+d*(j+(j>0&&j<nz?jitter(j+3,i):0))/nz];
  for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const a=point(i,j),b=point(i+1,j),c=point(i,j+1),d1=point(i+1,j+1);for(const [k,tri] of [[0,[a,c,b]],[1,[b,c,d1]]]){const col=new THREE.Color(palette[Math.abs(Math.floor(Math.sin(i*3.1+j*5.7+k*8.9)*137))%palette.length]);for(const [xx,zz]of tri){vertices.push(xx,y+.046,zz);colors.push(col.r,col.g,col.b);uv.push((xx-x)/w+.5,(zz-z)/d+.5);}}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.computeVertexNormals();mesh(g,material('#ffffff',{vertexColors:true,roughness:1}),0,0,0);
 }
 function photoFrame(x,y,z,w,h,quad,border='#92663e'){
  box(x,y,z,w,h,.065,border,.016);box(x,y,z+.039,w-.065,h-.065,.014,'#f1e9dc');
  if(!referenceTexture){box(x,y,z+.055,w-.14,h-.14,.014,'#52656b');return;}
  const g=new THREE.PlaneGeometry(w-.13,h-.13);const uvs=g.attributes.uv;quad.forEach(([px,py],i)=>uvs.setXY(i,px/1536,1-py/1024));
  const key=room+'photo';if(!mats.has(key))mats.set(key,new THREE.MeshStandardMaterial({map:referenceTexture,roughness:.88}));mesh(g,mats.get(key),x,y,z+.055);
 }
 function softBox(x,y,z,w,h,d,c){const g=new RoundedBoxGeometry(w,h,d,5,Math.min(w,h,d)*.36);const a=g.attributes.position;for(let i=0;i<a.count;i++){const px=a.getX(i),py=a.getY(i),pz=a.getZ(i);const wave=.012*Math.sin(px*24+pz*10)*Math.cos(pz*16);a.setY(i,py+wave*(1-Math.abs(px)/(w*.55)));}g.computeVertexNormals();return mesh(g,material(c),x,y,z);}
 function duvet(x,y,z,w,d){const g=new THREE.PlaneGeometry(w,d,64,76),a=g.attributes.position;for(let i=0;i<a.count;i++){const xx=a.getX(i),zz=-a.getY(i),u=xx/(w/2),v=zz/(d/2);const side=Math.max(0,(Math.abs(u)-.79)/.21),foot=Math.max(0,(v-.76)/.24);const fold=.055*Math.sin(u*7+v*3)+.034*Math.sin(v*9-u*4)+.014*Math.sin(u*18+v*10);const drop=.42*Math.sin(side*Math.PI/2)+.27*Math.sin(foot*Math.PI/2);a.setXYZ(i,xx,y+fold-drop,z+zz+.018*Math.sin(u*12)*foot);}g.computeVertexNormals();return mesh(g,material('#f4eadd',{side:THREE.DoubleSide,roughness:1}),x,0,0);}
 function lamp(x,y,z,height=1.6,scale=1){cyl(x,y+.045,z,.18*scale,.2*scale,.08,color.brass);cyl(x,y+height/2,z,.027,.027,height,color.brass,12);const shadeMat=material('#d7cbae',{emissive:'#ffce83',emissiveIntensity:0,side:THREE.DoubleSide});const shade=mesh(new THREE.CylinderGeometry(.23*scale,.33*scale,.38*scale,32,1,true),shadeMat,x,y+height,z);shade.castShadow=false;rooms[room].glows.push(shadeMat);const cap=cyl(x,y+height-.195*scale,z,.31*scale,.31*scale,.012,'#f0dfbd');cap.castShadow=false;addLight(x,y+height-.1,z,22*scale,5.5, true);return shade;}
 function addLight(x,y,z,intensity=20,distance=5,shadow=false){const l=new THREE.PointLight('#ffd6a0',0,distance,2);l.position.set(x,y,z);l.castShadow=shadow;l.shadow.mapSize.set(256,256);l.shadow.bias=-.004;l.shadow.normalBias=.03;l.shadow.camera.near=.1;group.add(l);rooms[room].lights.push({light:l,intensity});}
 function sconce(x,y,z){box(x,y,z,.16,.25,.09,color.brass,.03);const mat=material('#eeddbc',{emissive:'#ffc56f',emissiveIntensity:0});const bulb=mesh(new THREE.SphereGeometry(.13,20,16),mat,x,y,z+.1);bulb.castShadow=false;rooms[room].glows.push(mat);addLight(x,y,z+.24,17,4,true);}
 function windowBack(x,y,z,w,h){box(x,y,z,w+.13,h+.13,.11,color.trim,.02);const glass=material('#304f6a',{emissive:'#325476',emissiveIntensity:.25,roughness:.22});mesh(new THREE.BoxGeometry(w,h,.018),glass,x,y,z+.065);box(x,y,z+.095,.04,h,.03,color.trim);box(x,y,z+.095,w,.035,.03,color.trim);box(x,y-h/2,z+.16,w+.22,.075,.28,color.trim);for(let side of [-1,1]){for(let i=0;i<4;i++)cyl(x+side*(w/2+.08)+i*.045,y,z+.16,.035,.035,h+.23,color.teal,10);}rod([x-w*.7,y+h/2+.13,z+.14],[x+w*.7,y+h/2+.13,z+.14],.018,color.brass);}
 function sideWindow(x,y,z,w,h){box(x,y,z,.09,h+.13,w+.13,color.trim);box(x-.06,y,z,.02,h,w,'#345570');box(x-.08,y,z,.02,.035,w,color.trim);box(x-.08,y,z,.02,h,.035,color.trim);for(let side of [-1,1])for(let i=0;i<4;i++)cyl(x-.18,y,z+side*(w/2+.1)+i*.04,.035,.035,h+.16,color.teal,10);}

 // Open dollhouse shell from the supplied reference. No left exterior walls.
 zone('living','down');floorRect(-4.8,0,4.4,4.6,.1);wall(-4.8,-2.3,4.4,.16,.1,3.5);
 zone('kitchen','down');floorRect(.55,0,6.3,4.6,.1);wall(.55,-2.3,6.3,.16,.1,3.5);wall(3.77,-.35,.16,4.06,.1,3.5);
 zone('bedroom','up');floorRect(-5.4,0,3.2,4.6,3.8);wall(-5.4,-2.3,3.2,.16,3.8,3.02);
 // Bedroom divider with a framed, open doorway.
 wall(-3.77,-1.59,.13,1.42,3.8,2.68);wall(-3.77,1.27,.13,2.04,3.8,2.68);box(-3.77,6.35,-.32,.13,.28,1.12,color.wall);
 for(const z of [-.91,.28])box(-3.68,5.12,z,.075,2.64,.07,color.trim);box(-3.68,6.4,-.32,.075,.09,1.25,color.trim);box(-3.72,5.05,-.86,.07,2.5,.74,color.oak).rotation.y=-.62;
 zone('gallery','up');floorRect(-.45,1.46,6.7,1.68,3.8);floorRect(-3.43,-.30,.74,1.85,3.8);floorRect(2.3,-.84,1.2,2.92,3.8);wall(-.45,-2.3,6.7,.16,3.8,3.02);
 zone('study','up');floorRect(4.95,0,4.1,4.6,3.8);wall(4.95,-2.3,4.1,.16,3.8,3.02);wall(7.04,0,.16,4.76,3.8,3.02);
 wall(2.92,-1.77,.14,1.06,3.8,2.87);wall(2.92,1.35,.14,1.9,3.8,2.87);box(2.92,6.49,-.42,.14,.35,1.78,color.wall);
 for(const z of [-1.2,.43])box(2.83,5.15,z,.065,2.7,.07,color.trim);box(2.83,6.51,-.39,.065,.09,1.71,color.trim);

 // Deep ivory sectional with a low right-hand chaise.
 zone('living','down');rug(-4.79,.12,1.02,3.63,2.34,['#c89c83','#d3aa92','#b77a62','#dcbba4','#e4c8b1','#6d7d7b','#a86d5f']);
 box(-4.92,.36,-.7,3.1,.4,1.13,'#d5c4ad',.09);softBox(-4.92,.88,-1.16,3.14,.93,.3,'#f0e7d8');
 for(let i=0;i<3;i++){softBox(-5.93+i*1.01,.68,-.58,.98,.24,1.06,'#f7eee0');softBox(-5.93+i*1.01,1.0,-1.06,.95,.67,.3,'#f4eadd');}
 box(-3.84,.34,.42,1.01,.4,2.48,'#d4c5b0',.12);softBox(-3.84,.65,.68,1.04,.24,1.92,'#f4ebdc');
 softBox(-6.5,.74,-.6,.25,.71,1.35,'#f0e6d5');softBox(-3.26,.74,-.61,.24,.72,1.31,'#f0e6d5');
 for(const [x,z,c,a]of [[-6.03,-.9,'#be8174',-.15],[-5.63,-.91,'#d8a057',.2],[-4.44,-.89,'#64848e',-.17],[-4.02,-.74,'#b57d70',.15]]){const p=softBox(x,1.13,z,.43,.48,.18,c);p.rotation.z=a;p.rotation.x=-.18;}
 const coffee=mesh(new THREE.CylinderGeometry(.7,.73,.1,3,1),material('#9b5f35'),-5.14,.55,.94);coffee.rotation.y=.26;coffee.scale.z=.91;
 for(let i=0;i<3;i++){const a=i*2.094+.26;rod([-5.14+Math.sin(a)*.46,.16,.94+Math.cos(a)*.43],[-5.14+Math.sin(a)*.36,.51,.94+Math.cos(a)*.35],.045,'#865333');}
 box(-5.24,.62,.92,.38,.045,.29,'#e8dcc8',.012);box(-5.21,.652,.91,.34,.025,.27,'#b8c3b5');plant(-5.13,.67,.91,.4,'#eee5d5');
 // Small lamps provide the evening states without adding a furniture suite.
 lamp(-6.43,.13,-1.82,1.6,.78);box(-6.58,.47,.39,.42,.64,.43,color.oak,.04);lamp(-6.58,.81,.39,.45,.55);

 // Three approach steps, a right turn, and one continuous main flight.
 zone('gallery','down');
 for(let i=0;i<3;i++){const z=.48-i*.37,y=.24+i*.205;box(-2.64,y,z,1.06,.23,.38,color.dark);box(-2.64,y+.14,z,1.1,.065,.4,color.oak);}
 box(-2.64,.83,-1.3,1.12,.18,1.69,color.dark);box(-2.64,.948,-1.3,1.17,.055,1.72,color.oak);
 const stepCount=17,stepRun=.27,startX=-2.64,firstTop=1.1,stepRise=(3.8-firstTop)/(stepCount-1);
 for(let i=0;i<stepCount;i++){const x=startX+i*stepRun,top=firstTop+i*stepRise;box(x,top-.16,-1.52,.26,.26,1.35,color.dark);box(x,top-.033,-1.52,.277,.066,1.39,color.oak);}
 for(const z of [-2.16,-.88]){rod([-2.84,.82,z],[1.80,3.71,z],.055,color.dark);rod([-2.72,1.85,z],[1.80,4.72,z],.035,color.dark);for(let i=0;i<7;i++){const x=-2.64+i*.72,y=1.1+i*.45;rod([x,y,z],[x,y+.87,z],.027,color.dark);}for(let i=1;i<=3;i++)rod([-2.72,1.1+i*.185,z],[1.80,3.97+i*.185,z],.009,color.dark);}
 plant(-1.63,.13,-.26,1.05,'#d2c5a9');plant(-1.24,.14,-.61,.62,'#e0d5ba');sconce(-.6,2.94,-2.09);
 // Gallery rail follows the full opening, with an open exit at the study end.
 zone('gallery','up');for(let i=0;i<6;i++)rod([-3.61+i*1.02,3.8,.56],[-3.61+i*1.02,4.69,.56],.029,color.dark);rod([-3.64,4.7,.56],[1.58,4.7,.56],.037,color.dark);for(let i=1;i<=3;i++)rod([-3.64,3.8+i*.215,.56],[1.58,3.8+i*.215,.56],.009,color.dark);
 for(const z of [-1.19,-.32,.55])rod([-3.06,3.8,z],[-3.06,4.69,z],.027,color.dark);rod([-3.06,4.7,-1.22],[-3.06,4.7,.56],.035,color.dark);for(let i=1;i<=3;i++)rod([-3.06,3.8+i*.215,-1.22],[-3.06,3.8+i*.215,.56],.009,color.dark);
 plant(2.42,3.82,-1.84,.7,'#c4b8a3');sconce(-2.49,5.84,-2.07);sconce(1.21,6.44,-2.07);
 // Picture planes sample the user's reference artwork, preserving its character.
 const art={blue:[[581,269],[621,261],[581,300],[621,292]],manuscript:[[653,279],[725,263],[654,363],[725,349]],portrait:[[698,187],[738,176],[699,244],[738,233]],sea:[[764,150],[810,140],[764,177],[810,167]],tree:[[838,135],[929,119],[838,176],[929,160]],land:[[760,202],[804,194],[760,225],[804,218]],small:[[822,209],[865,200],[822,230],[865,222]],wide:[[889,188],[929,180],[889,207],[929,199]]};
 photoFrame(-2.25,5.27,-2.18,.73,.58,art.blue,'#292e2d');photoFrame(-1.18,4.88,-2.18,1.02,1.46,art.manuscript,'#35332b');photoFrame(-1.08,5.93,-2.18,.4,.49,art.small,'#302f2a');photoFrame(-.37,6.04,-2.18,.65,.94,art.portrait);
 photoFrame(.41,6.37,-2.18,.71,.56,art.sea,'#e4e1d9');photoFrame(1.55,6.4,-2.18,1.22,.67,art.tree,'#242a2a');photoFrame(.34,5.76,-2.18,.62,.49,art.land,'#e1d9c7');photoFrame(1.2,5.8,-2.18,.74,.47,art.small,'#e0dbcf');photoFrame(2.08,5.87,-2.18,.64,.46,art.wide,'#e0dbcf');photoFrame(.34,5.21,-2.18,.63,.48,art.wide,'#dbd8cc');photoFrame(1.05,5.23,-2.18,.36,.43,art.portrait);photoFrame(1.77,5.18,-2.18,.78,.49,art.land,'#282e28');
 zone('gallery','down');photoFrame(-3.04,2.55,-2.18,.63,1.05,art.portrait);photoFrame(-2.28,2.89,-2.18,.32,.37,art.small,'#e0d8c8');photoFrame(-2.22,2.36,-2.18,.45,.34,art.blue,'#d3808c');photoFrame(-2.2,1.94,-2.18,.46,.35,art.wide,'#d9d6cb');photoFrame(-.88,2.92,-2.18,.55,.64,art.land,'#e0d5c0');
 const plate=cyl(-1.56,2.66,-2.1,.32,.32,.035,'#153b42',48);plate.rotation.x=Math.PI/2;for(let i=0;i<18;i++){const a=i*Math.PI/9;const m=ball(-1.56+Math.sin(a)*.2,2.66+Math.cos(a)*.2,-2.06,.052,.086,.015,i%2?'#d9822d':'#338a8b');m.rotation.z=-a;}const mandala=mesh(new THREE.TorusGeometry(.118,.035,8,32),material('#db8734'),-1.56,2.66,-2.04);

 // Sparse low wooden bed, one plant and loosely draped ivory bedding.
 zone('bedroom','up');box(-5.43,4.01,.03,1.82,.3,2.8,'#bc8b61',.065);box(-5.43,4.39,-1.36,1.88,.56,.13,'#b88b61',.035);softBox(-5.43,4.2,.04,1.79,.23,2.73,'#efe9dd');duvet(-5.43,4.41,.24,2.07,2.55);
 const pillow=softBox(-5.48,4.43,-1.03,1.16,.21,.59,'#faf1e5');pillow.rotation.y=.04;pillow.rotation.x=-.1;
 plant(-6.52,3.82,-1.22,.96,'#d4c9b4');box(-4.25,4.02,-1.4,.4,.35,.42,'#c49467',.035);lamp(-4.25,4.215,-1.4,.45,.52);addLight(-5.43,5.6,-.15,7,4.2,false);

 // Plant-filled study, keeping its desk, cabinet, bookcase and navy beanbag.
 zone('study','up');sideWindow(6.91,5.55,.3,2.46,1.87);rug(5.05,3.82,.44,3.53,2.8,['#edcfb6','#ead7c6','#e3c6b3','#b0c4c5','#8da8b2','#dca58e','#f0dfcb']);
 box(3.98,4.79,-1.55,1.82,.13,1.1,color.oak,.035);box(4.68,4.27,-1.53,.45,.96,.86,'#ece6d9',.035);for(let i=0;i<3;i++){box(4.68,4.02+i*.28,-1.086,.41,.23,.02,'#f1e8da');box(4.68,4.03+i*.28,-1.064,.1,.025,.012,color.dark);}for(const x of [3.2,4.73])for(const z of [-1.9,-1.14])rod([x,3.84,z],[x,4.73,z],.03,color.dark);
 box(3.83,5.27,-1.68,.98,.62,.06,'#28302f',.024);box(3.83,5.27,-1.64,.89,.53,.013,'#182b2e');box(3.83,4.91,-1.66,.075,.21,.07,color.dark);box(3.83,4.865,-1.66,.36,.026,.2,color.dark);box(3.81,4.87,-1.2,.57,.024,.2,'#303c3b',.012);ball(4.22,4.89,-1.2,.055,.025,.078,'#34403d');lamp(4.47,4.87,-1.86,.61,.64);
 cyl(3.95,4.2,-.54,.05,.05,.5,'#505654');softBox(3.95,4.51,-.52,.64,.15,.59,'#969c95');box(3.95,4.93,-.23,.62,.76,.095,'#9ca29c',.075);for(const x of [3.59,4.31]){rod([x,4.49,-.62],[x,4.76,-.62],.019,'#6d7670');box(x,4.77,-.53,.065,.035,.4,'#b1b5ab',.015);}for(let i=0;i<5;i++){const a=i*1.256;rod([3.95,3.97,-.54],[3.95+Math.cos(a)*.43,3.95,-.54+Math.sin(a)*.43],.022,'#444a48');ball(3.95+Math.cos(a)*.43,3.91,-.54+Math.sin(a)*.43,.05,.05,.05,'#272e2b');}
 box(5.48,4.97,-1.8,1.29,2.29,.69,'#d0a070',.035);box(5.48,4.97,-1.44,.018,2.2,.015,'#ae8154');for(const x of [5.35,5.6])box(x,4.97,-1.419,.016,.28,.025,'#9a7046');box(6.43,4.98,-1.79,.61,2.3,.67,'#ece6d8',.025);
 for(let i=0;i<4;i++){const y=3.99+i*.55;box(6.43,y,-1.77,.56,.043,.59,color.oak);for(let j=0;j<5;j++){const b=box(6.22+j*.09,y+.18,-1.68,.069,.29+(j%3)*.035,.34,['#466773','#b67953','#d8cfb9','#3b7475','#574e42'][j]);b.rotation.z=j===3?.12:0;}}
 for(let i=0;i<6;i++)plant(4.94+i*.32,6.13,-1.8,.43+(i%3)*.1,['#afb296','#c9bda5','#5b7060'][i%3],i%2===0);plant(3.18,4.86,-1.89,.47,'#b1baa2');plant(3.31,3.82,1.26,.97,'#cec8b5');plant(6.67,3.82,1.59,.69,'#d4c4a7');plant(6.72,5.34,.67,.48,'#b9a76e',true);
 for(const z of [-.56,.61])rod([6.78,6.66,z],[6.78,5.49,z],.009,'#9d8a5a');
 ball(6.05,4.16,.69,.67,.46,.62,'#2c4654');for(let i=0;i<7;i++){const a=i*Math.PI/3.5;const seam=rod([6.05,4.58,.69],[6.05+Math.sin(a)*.55,4.01,.69+Math.cos(a)*.5],.006,'#243d4a');}
 const mustard=softBox(6.24,4.24,1.18,.57,.5,.16,'#db9a59');mustard.rotation.z=-.27;mustard.rotation.x=-.22;lamp(6.8,3.83,-.32,1.65,.76);photoFrame(3.85,6.04,-2.18,.75,.57,art.portrait);plant(3.14,5.97,-2.01,.4,'#bb9963');

 // Compact kitchen: laundry tower, white cabinets, right-hand cooking run.
 zone('kitchen','down');wall(.21,-1.47,.14,1.73,.1,3.5);
 box(.65,1.44,-1.8,.74,2.64,.91,'#eee9df',.04);
 for(const y of [.8,1.92]){box(.65,y,-1.32,.68,1.01,.045,'#f5efe6',.03);const bezel=mesh(new THREE.TorusGeometry(.239,.035,12,40),material('#afb4b0',{metalness:.6,roughness:.28}),.65,y-.02,-1.275);const glass=mesh(new THREE.CircleGeometry(.21,36),material('#233338',{metalness:.25,roughness:.12}),.65,y-.02,-1.263);mesh(new THREE.TorusGeometry(.155,.008,6,32),material('#6f8484'),.65,y-.02,-1.251);box(.65,y+.37,-1.275,.59,.09,.016,'#c9c8be');cyl(.84,y+.37,-1.24,.027,.027,.026,'#4c5552',16).rotation.x=Math.PI/2;box(.52,y+.37,-1.251,.16,.042,.014,'#2a3330');}
 for(let i=0;i<2;i++){const x=1.47+i*.83;box(x,.64,-1.83,.79,1.02,.8,'#ede8dc',.024);box(x,1.2,-1.82,.84,.105,.86,'#293532',.02);box(x,2.52,-2.02,.8,.89,.46,'#f0e9dd',.024);box(x+.23,2.52,-1.774,.017,.24,.025,'#aaa79a');box(x+.21,.65,-1.406,.018,.26,.025,'#a3a69c');}
 box(1.46,.65,-1.403,.71,.89,.027,'#a9b1aa',.018);box(1.46,1.02,-1.377,.58,.04,.03,'#4a5752');box(2.21,1.259,-1.85,.59,.015,.45,'#919e95',.045);box(2.21,1.27,-1.85,.48,.016,.35,'#2d423d',.035);rod([2.21,1.29,-2.08],[2.21,1.6,-2.08],.021,'#bec5b9');rod([2.21,1.6,-2.08],[2.21,1.6,-1.87],.021,'#bec5b9');
 const cooking=new THREE.Group();group.add(cooking);const parent=group;group=cooking;
 box(0,.67,0,.76,1.11,.78,'#343a36',.025);box(0,.61,.405,.66,.65,.026,'#202c2b',.02);box(0,1.0,.431,.55,.043,.04,'#a1a399');box(-.12,.68,.454,.25,.49,.022,'#cf995d');box(0,1.24,0,.8,.07,.82,'#222e2a',.016);for(let i=0;i<4;i++)cyl(-.17+(i%2)*.34,1.28,-.18+Math.floor(i/2)*.36,.11,.11,.014,'#101b19');group=parent;cooking.position.set(3.24,0,-1.31);cooking.rotation.y=-Math.PI/2;
 box(3.24,1.44,-.2,.9,2.63,.86,'#a8b2aa',.045);box(3.24,1.8,.249,.84,1.72,.026,'#b8beb2',.015);box(3.24,.65,.249,.84,.49,.026,'#aeb7ab',.015);box(2.94,1.7,.28,.025,.5,.025,'#59675f');for(let i=0;i<8;i++)box(3.03+(i%3)*.16,1.2+Math.floor(i/3)*.29,.269,.075,.1,.013,['#cc9270','#668f90','#ede0be'][i%3]);plant(3.2,2.79,-.19,.64,'#bdac8f');plant(1.28,1.27,-2.05,.4,'#a8b594');box(3.0,3.09,-2.02,1.27,.1,.47,color.trim,.025);plant(2.8,3.14,-2.06,.47,'#c8bda3');plant(3.42,.13,.75,.87,'#c6b698');
 // Two chairs only, tucked into the front-right dining corner.
 box(2.49,.91,1.56,1.5,.11,.91,'#d6a178',.035);for(const x of [1.87,3.1])for(const z of [1.23,1.9])rod([x,.16,z],[x,.86,z],.035,color.oak);
 function chair(x,z,a){const cg=new THREE.Group();group.add(cg);const old=group;group=cg;softBox(0,.55,0,.46,.115,.44,'#ede4d5');softBox(0,.87,-.19,.47,.62,.085,'#e9decb');for(const xx of [-.17,.17])for(const zz of [-.16,.16])rod([xx,.15,zz],[xx,.51,zz],.025,color.oak);group=old;cg.position.set(x,0,z);cg.rotation.y=a;}
 chair(2.36,.9,0);chair(1.62,1.55,Math.PI/2);plant(2.7,.975,1.51,.28,'#7d8c78');cyl(2.98,1.04,1.57,.055,.055,.13,'#e9d7b6');sconce(1.82,3.12,-2.08);addLight(2.51,2.38,1.5,17,4.6,false);
 return {root,floors,rooms,picks};
}
