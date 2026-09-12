import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

export const ROOMS = [
 {id:'living',name:'Living room',detail:'Floor lamp & table lamp',floor:'down',icon:'sofa',pin:[-5.05,.55,2.28]},
 {id:'kitchen',name:'Kitchen & dining',detail:'Counter & dining lights',floor:'down',icon:'kitchen',pin:[1.5,.45,2.28]},
 {id:'bedroom',name:'Bedroom',detail:'Two bedside lamps',floor:'up',icon:'bed',pin:[-5.35,4,2.25]},
 {id:'gallery',name:'Stair gallery',detail:'Warm gallery sconces',floor:'both',icon:'stairs',pin:[-2.5,3.95,2.25]},
 {id:'study',name:'Study',detail:'Desk & reading lamps',floor:'up',icon:'desk',pin:[4.8,4,2.25]},
];

export function buildHome(scene) {
 const root=new THREE.Group(); scene.add(root);
 const floors={down:new THREE.Group(),up:new THREE.Group()}; root.add(floors.down,floors.up);
 const rooms=Object.fromEntries(ROOMS.map(r=>[r.id,{...r,on:false,fade:0,lights:[],glows:[],materials:[],meshes:[]}]));
 const picks=[]; let group=floors.down,room='living';
 const mats=new Map(), geometries=new Map();
 const color={wall:'#e3dcc9',trim:'#f2ead9',wood:'#bb8853',oak:'#c89b61',dark:'#262b2e',linen:'#eae2cc',teal:'#5c797b',leaf:'#476746',brass:'#a77d44'};
 function material(c,opts={}) {const key=room+c+JSON.stringify(opts);if(!mats.has(key)){const m=new THREE.MeshStandardMaterial({color:c,roughness:.82,...opts});mats.set(key,m);rooms[room].materials.push(m);}return mats.get(key);}
 function mesh(geo,mat,x,y,z){const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;m.userData.room=room;group.add(m);rooms[room].meshes.push(m);picks.push(m);return m;}
 function box(x,y,z,w,h,d,c,r=0){let key=[w,h,d,r].join();if(!geometries.has(key))geometries.set(key,r?new RoundedBoxGeometry(w,h,d,2,Math.min(r,w/3,h/3,d/3)):new THREE.BoxGeometry(w,h,d));return mesh(geometries.get(key),material(c),x,y,z);}
 function cyl(x,y,z,rt,rb,h,c,n=20){return mesh(new THREE.CylinderGeometry(rt,rb,h,n),material(c),x,y,z);}
 function ball(x,y,z,rx,ry,rz,c){const m=mesh(new THREE.SphereGeometry(1,12,8),material(c),x,y,z);m.scale.set(rx,ry,rz);return m;}
 function rod(a,b,r,c){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);const m=cyl(...av.clone().add(bv).multiplyScalar(.5).toArray(),r,r,d.length(),c,8);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
 function zone(id,floor){room=id;group=floors[floor];}
 function floorRect(x,z,w,d,y){box(x,y-.17,z,w,.28,d,color.wall,.04);box(x,y-.02,z,w-.06,.045,d-.04,color.wood);for(let i=0;i<Math.ceil(d/.22);i++){const zz=z-d/2+i*.22+.1;if(zz>=z+d/2)continue;for(let j=0;j<4;j++){const len=w/4;box(x-w/2+len*(j+.5),y+.008,zz,len-.012,.014,.208,['#b88652','#c79a66','#c18f59','#b88a59'][(i+j)%4]);}}}
 function wall(x,z,w,d,y,h){box(x,y+h/2,z,w,h,d,color.wall,.025);box(x,y+.095,z+(d<w?.115:0),w,.12,d+.02,color.trim);}
 function frame(x,y,z,w,h,c,variant=0){box(x,y,z,w,h,.055,variant%3===0?'#544131':'#b69260',.025);box(x,y,z+.034,w-.075,h-.075,.015,'#ece3cc');box(x,y,z+.048,w-.15,h-.15,.014,c);const art=material(variant%2?'#344f5a':'#b88d56');const sun=mesh(new THREE.CircleGeometry(w*.12,24),art,x+w*.14,y+h*.14,z+.063);if(variant%2===0){box(x,y-h*.18,z+.065,w-.17,h*.16,.01,'#58716b');}else{const m=mesh(new THREE.CircleGeometry(w*.22,20),material('#d9ab70'),x,y,z+.065);m.scale.y=.8;}return sun;}
 function plant(x,y,z,s=1,pot='#aa8060',trailing=false){cyl(x,y+.2*s,z,.19*s,.145*s,.38*s,pot);cyl(x,y+.398*s,z,.177*s,.177*s,.018*s,'#382b22');for(let i=0;i<7;i++){const a=i*2.4,h=(.55+(i%3)*.14)*s;const xx=x+Math.sin(a)*.18*s,zz=z+Math.cos(a)*.18*s;rod([x,y+.36*s,z],[xx,y+h,zz],.012*s,'#506244');const leaf=ball(xx+Math.sin(a)*.09*s,y+h,zz+Math.cos(a)*.09*s,.09*s,.28*s,.06*s,['#476548','#6c8052','#35563e'][i%3]);leaf.rotation.z=Math.sin(a)*.8;leaf.rotation.x=Math.cos(a)*.65;}if(trailing)for(let i=0;i<9;i++)ball(x+Math.sin(i*1.8)*.12*s,y+.23*s-i*.08*s,z+.19*s,.055*s,.08*s,.04*s,'#4e6e42');}
 function rug(x,y,z,w,d,base,accent){box(x,y+.027,z,w,.033,d,base,.025);for(let i=0;i<5;i++){const m=box(x-w*.38+i*w*.19,y+.046,z+(i%2?-.1:.1),w*.15,.008,d*.82,accent,.01);m.rotation.y=i%2?.28:-.28;}for(const zz of [z-d/2,z+d/2])for(let i=0;i<25;i++)box(x-w/2+i*w/25,y+.027,zz,w/45,.015,.08,'#bcac8b');}
 function lamp(x,y,z,height=1.6,scale=1){cyl(x,y+.045,z,.18*scale,.2*scale,.08,color.brass);cyl(x,y+height/2,z,.027,.027,height,color.brass,12);const shadeMat=material('#d7cbae',{emissive:'#ffce83',emissiveIntensity:0,side:THREE.DoubleSide});const shade=mesh(new THREE.CylinderGeometry(.23*scale,.33*scale,.38*scale,32,1,true),shadeMat,x,y+height,z);shade.castShadow=false;rooms[room].glows.push(shadeMat);const cap=cyl(x,y+height-.195*scale,z,.31*scale,.31*scale,.012,'#f0dfbd');cap.castShadow=false;addLight(x,y+height-.1,z,22*scale,5.5, true);return shade;}
 function addLight(x,y,z,intensity=20,distance=5,shadow=false){const l=new THREE.PointLight('#ffd6a0',0,distance,2);l.position.set(x,y,z);l.castShadow=shadow;l.shadow.mapSize.set(256,256);l.shadow.bias=-.004;l.shadow.normalBias=.03;l.shadow.camera.near=.1;group.add(l);rooms[room].lights.push({light:l,intensity});}
 function sconce(x,y,z){box(x,y,z,.16,.25,.09,color.brass,.03);const mat=material('#eeddbc',{emissive:'#ffc56f',emissiveIntensity:0});const bulb=mesh(new THREE.SphereGeometry(.13,20,16),mat,x,y,z+.1);bulb.castShadow=false;rooms[room].glows.push(mat);addLight(x,y,z+.24,17,4,true);}
 function windowBack(x,y,z,w,h){box(x,y,z,w+.13,h+.13,.11,color.trim,.02);const glass=material('#304f6a',{emissive:'#325476',emissiveIntensity:.25,roughness:.22});mesh(new THREE.BoxGeometry(w,h,.018),glass,x,y,z+.065);box(x,y,z+.095,.04,h,.03,color.trim);box(x,y,z+.095,w,.035,.03,color.trim);box(x,y-h/2,z+.16,w+.22,.075,.28,color.trim);for(let side of [-1,1]){for(let i=0;i<4;i++)cyl(x+side*(w/2+.08)+i*.045,y,z+.16,.035,.035,h+.23,color.teal,10);}rod([x-w*.7,y+h/2+.13,z+.14],[x+w*.7,y+h/2+.13,z+.14],.018,color.brass);}
 function sideWindow(x,y,z,w,h){box(x,y,z,.09,h+.13,w+.13,color.trim);box(x-.06,y,z,.02,h,w,'#345570');box(x-.08,y,z,.02,.035,w,color.trim);box(x-.08,y,z,.02,h,.035,color.trim);for(let side of [-1,1])for(let i=0;i<4;i++)cyl(x-.18,y,z+side*(w/2+.1)+i*.04,.035,.035,h+.16,color.teal,10);}

 // The connected cutaway: the upper study extends beyond the lower kitchen.
 zone('living','down');floorRect(-4.8,0,4.4,4.6,.1);wall(-4.8,-2.3,4.4,.16,.1,3.35);wall(-7.04,0,.16,4.76,.1,3.4);
 zone('kitchen','down');floorRect(.55,0,6.3,4.6,.1);wall(.55,-2.3,6.3,.16,.1,3.35);wall(3.77,0,.16,4.76,.1,3.35);
 zone('bedroom','up');wall(-7.04,0,.16,4.76,3.5,3.27);floorRect(-5.4,0,3.2,4.6,3.65);wall(-5.4,-2.3,3.2,.16,3.65,3.12);wall(-3.77,.1,.14,4.5,3.65,2.6);
 zone('gallery','up');floorRect(-2.2,1.4,3.2,1.8,3.65);floorRect(-.53,-.9,.3,2.8,3.65);wall(-2.2,-2.3,3.2,.16,3.65,3.12);
 // Bathrooms are omitted from the smart-home model; the gallery connects to the study.
 floorRect(1.15,0,3.5,4.6,3.65);wall(1.15,-2.3,3.5,.16,3.65,3.12);
 zone('study','up');floorRect(4.95,0,4.1,4.6,3.65);wall(4.95,-2.3,4.1,.16,3.65,3.12);wall(2.92,-.25,.14,4.1,3.65,2.9);wall(7.04,0,.16,4.76,3.65,3.12);

 // Living room: a soft sectional, warm timber, gallery wall and plants.
 zone('living','down');windowBack(-6.24,2.15,-2.19,1.07,1.46);rug(-4.97,.12,.85,3.35,2.35,'#967a60','#ae654c');
 box(-5.07,.48,-.4,3.26,.58,1.16,color.linen,.15);box(-5.07,.99,-.91,3.28,.82,.29,'#e5d9c3',.13);for(let i=0;i<3;i++)box(-6.1+i*1.03,.83,-.36,.98,.22,.92,'#f0e5ce',.11);
 box(-3.69,.46,.6,.92,.55,1.7,color.linen,.15);box(-3.69,.8,.75,.93,.2,1.52,'#f0e5ce',.11);box(-6.62,.84,-.35,.27,.62,1.18,'#e5d9c3',.1);box(-3.32,.67,.52,.19,.5,1.87,'#e5d9c3',.09);
 for(const [x,z,c,a] of [[-6.12,-.62,'#a56863',-.14],[-5.65,-.67,'#c7a553',.16],[-4.25,-.61,'#657f8d',-.1],[-3.65,-.4,'#b47c71',.1]]){const p=box(x,1.12,z,.45,.46,.17,c,.1);p.rotation.z=a;p.rotation.x=-.14;}
 const coffee=mesh(new THREE.CylinderGeometry(.65,.7,.12,3,1),material('#68462e'),-5.25,.55,1.09);coffee.rotation.y=.3;coffee.scale.z=.9;for(let i=0;i<3;i++){let a=i*2.094+.3;rod([-5.25+Math.sin(a)*.43,.14,1.09+Math.cos(a)*.43],[-5.25+Math.sin(a)*.35,.52,1.09+Math.cos(a)*.35],.05,'#66452d');}box(-5.35,.64,1.1,.38,.05,.3,'#d3c4a2');plant(-5.3,.68,1.1,.43,'#dfd8be');lamp(-6.58,.14,-1.5,1.8,1.1);
 box(-6.61,.58,1.23,.5,.82,1.45,color.oak,.04);box(-6.61,1.46,1.18,.09,1.05,1.38,color.dark,.025);box(-6.55,1.46,1.18,.02,.92,1.25,'#1c2a32');plant(-6.62,1.01,1.97,.4,'#c19a6c');lamp(-6.56,1.01,.64,.56,.58);
 for(let i=0;i<13;i++){const x=-5.3+(i%5)*.51,y=1.65+Math.floor(i/5)*.61;frame(x,y,-2.185,.37+(i%3)*.09,.41+(i%2)*.12,['#a56d49','#7b9a9b','#283e49','#b9a176','#ad7060'][i%5],i);}

 // The stair turns after three steps, then follows the art wall to the hall.
 zone('gallery','down');sconce(-1.93,2.62,-2.06);for(let i=0;i<3;i++){box(-2.78,.18+i*.2,1.09-i*.32,.91,.2,.34,color.dark);box(-2.78,.29+i*.2,1.09-i*.32,.94,.055,.35,color.oak);}box(-2.78,.76,-.25,.95,.18,1.13,color.dark);box(-2.78,.875,-.25,1,.055,1.17,color.oak);
 for(let i=0;i<12;i++){const x=-2.55+i*.18,y=.98+i*.226;box(x,y,-1.02,.21,.17,1.04,color.dark);box(x,y+.11,-1.02,.235,.06,1.075,color.oak);}rod([-2.74,.72,-.47],[-.47,3.55,-.47],.055,color.dark);rod([-2.8,1.76,-.43],[-.39,4.58,-.43],.035,color.dark);for(let i=0;i<5;i++){const x=-2.7+i*.53,y=1+i*.64;rod([x,y,-.43],[x,y+.85,-.43],.026,color.dark);}for(let n=1;n<3;n++)rod([-2.8,.97+n*.24,-.43],[-.39,3.8+n*.24,-.43],.01,color.dark);plant(-2.25,.16,-1.91,.86,'#c5b899');plant(-1.86,.16,-1.84,.55,'#d7c9ad');
 zone('gallery','up');for(let i=0;i<5;i++)rod([-3.65+i*.74,3.65,.43],[-3.65+i*.74,4.55,.43],.027,color.dark);rod([-3.65,4.55,.43],[-.69,4.55,.43],.035,color.dark);for(let n=1;n<3;n++)rod([-3.65,3.65+n*.28,.43],[-.69,3.65+n*.28,.43],.012,color.dark);rug(-.1,3.67,1.59,5.3,.71,'#824f38','#c28e54');plant(-3.43,3.67,1.59,.65,'#9c815b');sconce(-2.6,5.67,-2.07);
 frame(-2.06,5.62,-2.19,1.16,1.25,'#202d30',3);const mandala=mesh(new THREE.TorusGeometry(.41,.013,6,64),material('#cc873d'),-2.06,5.62,-2.08);for(let i=0;i<16;i++){const a=i*Math.PI/8;rod([-2.06,5.62,-2.069],[-2.06+Math.sin(a)*.41,5.62+Math.cos(a)*.41,-2.069],.004,'#cc873d');}frame(-.99,5.7,-2.19,.37,.42,'#975c47',1);frame(-.99,5.12,-2.19,.37,.42,'#ae775a',1);
 frame(.4,5.76,-2.19,.8,.62,'#798272',2);frame(1.85,5.79,-2.19,.77,.58,'#859491',2);sconce(1.12,5.61,-2.07);plant(2.5,3.67,-1.84,.62,'#c0bfa4');

 // Bedroom: teal textiles, layered ivory bedding and two small warm lamps.
 zone('bedroom','up');windowBack(-5.67,5.68,-2.19,1.15,1.48);rug(-5.43,3.67,.23,2.5,3.36,'#aba291','#8b8c7d');box(-5.35,4.03,.01,1.99,.4,2.84,color.oak,.075);box(-5.35,4.3,.04,1.96,.28,2.73,'#ece5d5',.14);box(-5.35,4.51,.31,2.03,.21,2.1,'#eee8d8',.15);box(-5.35,4.55,-1.39,2.12,1.15,.16,color.teal,.1);for(const x of [-5.83,-4.89]){const p=box(x,4.64,-.91,.81,.2,.6,'#f8f0df',.14);p.rotation.x=.12;}box(-5.35,4.66,.84,2.04,.12,.76,'#657f7b',.055);const cushion=ball(-5.35,4.91,-.48,.26,.27,.13,'#527774');cushion.rotation.x=-.1;
 for(const x of [-6.61,-4.07]){box(x,4.07,-.96,.45,.69,.51,color.oak,.03);box(x,4.11,-.69,.39,.23,.018,'#c99e68');ball(x,4.1,-.66,.03,.03,.02,color.brass);lamp(x,4.43,-.96,.51,.62);}plant(-6.57,3.68,1.38,.8,'#a28665');frame(-4.76,6,-2.19,.71,.53,'#59757d',2);

 // Office with the monitor, plant cabinet, books and an oversized beanbag.
 zone('study','up');sideWindow(6.91,5.48,.32,2.46,1.82);rug(5.01,3.67,.48,3.45,2.77,'#bcb5a2','#798b8a');box(4.01,4.67,-1.54,1.76,.13,1.1,color.oak,.03);box(4.7,4.14,-1.53,.45,.96,.86,'#e3e1d5',.035);for(let i=0;i<3;i++){box(4.7,3.89+i*.28,-1.087,.41,.23,.018,'#f0eadc');box(4.7,3.9+i*.28,-1.065,.1,.025,.012,color.dark);}for(const x of [3.22,4.7])rod([x,3.7,-1.84],[x,4.6,-1.84],.035,color.dark);box(3.84,5.14,-1.68,.94,.61,.055,color.dark,.02);box(3.84,5.14,-1.646,.86,.53,.01,'#192c34');box(3.84,4.79,-1.67,.07,.21,.06,color.dark);box(3.84,4.755,-1.67,.36,.025,.2,color.dark);box(3.81,4.75,-1.2,.58,.026,.19,'#374444',.02);ball(4.25,4.765,-1.2,.055,.023,.085,'#343d3d');lamp(4.5,4.76,-1.76,.61,.62);
 cyl(3.93,4.08,-.56,.055,.055,.55,'#444d4c');box(3.93,4.38,-.54,.62,.16,.6,'#7e8883',.09);box(3.93,4.76,-.27,.61,.68,.1,'#7e8883',.06);for(let i=0;i<5;i++){let a=i*1.256;rod([3.93,3.82,-.56],[3.93+Math.cos(a)*.42,3.8,-.56+Math.sin(a)*.42],.024,'#424b49');ball(3.93+Math.cos(a)*.42,3.76,-.56+Math.sin(a)*.42,.055,.055,.055,'#252c2b');}
 box(5.49,4.82,-1.8,1.27,2.29,.67,color.oak,.035);box(5.49,4.82,-1.445,.022,2.17,.02,'#8f714e');for(const x of [5.37,5.61])box(x,4.83,-1.424,.018,.26,.02,color.brass);box(6.41,4.83,-1.79,.59,2.3,.66,'#e0ddc9',.025);for(let i=0;i<4;i++){let y=3.85+i*.55;box(6.41,y,-1.78,.54,.045,.58,color.oak);for(let j=0;j<5;j++){const c=['#49616c','#ae7b51','#dbd4b9','#835849','#3f5352'][j];const book=box(6.21+j*.085,y+.2,-1.7,.065,.3+(j%2)*.09,.32,c);book.rotation.z=j===3?.11:0;}}
 for(let i=0;i<5;i++)plant(5.02+i*.34,5.99,-1.81,.48+(i%2)*.18,['#a28664','#d4cab1','#7f8c69'][i%3],i%2===0);plant(3.27,4.76,-1.92,.5,'#959678');plant(3.34,3.68,1.41,.84,'#c0bfa4');plant(6.58,3.68,1.66,.75,'#c4bda4');plant(6.65,5.46,.79,.48,'#ac9d75',true);ball(6.07,4.02,.8,.61,.46,.58,'#294650');ball(6.25,4.15,1.08,.32,.28,.15,'#c69a40');lamp(6.79,3.71,-.07,1.66,.8);frame(3.85,5.91,-2.185,.76,.6,'#798272',2);frame(4.75,5.97,-2.185,.57,.5,'#a19475',1);

 // Compact L-shaped kitchen and a four-seat dining table, as in the image.
 zone('kitchen','down');for(let i=0;i<3;i++){const x=.12+i*.79;box(x,.6,-1.86,.76,.96,.75,'#e8e5d7',.025);box(x,1.12,-1.85,.81,.11,.83,'#303a39',.02);box(x,2.34,-2.0,.77,.95,.48,'#e6e5d8',.025);box(x+.19,2.31,-1.747,.019,.24,.025,'#8b8d83');box(x+.21,.61,-1.465,.021,.28,.03,'#a0a094');}
 box(.16,1.184,-1.84,.61,.022,.46,'#8e9990',.05);box(.16,1.199,-1.84,.52,.019,.37,'#394b48',.025);rod([.16,1.2,-2.06],[.16,1.54,-2.06],.022,'#b7bdb1');rod([.16,1.54,-2.06],[.16,1.54,-1.88],.022,'#b7bdb1');box(2.66,.64,-1.84,.75,1.09,.8,'#313b3b',.025);box(2.66,.58,-1.421,.65,.6,.018,'#172726',.02);box(2.66,.99,-1.4,.48,.04,.04,'#a2a39a');box(2.56,.68,-1.368,.21,.47,.023,'#bf944c');for(let i=0;i<4;i++)cyl(2.45+(i%2)*.34,1.203,-2.02+Math.floor(i/2)*.32,.106,.106,.018,'#151f20');box(2.66,2.14,-2.01,.78,.5,.5,'#e1e0d3',.03);box(2.66,2.08,-1.744,.61,.28,.02,'#2a3432');
 box(3.14,1.26,-.77,.91,2.35,.89,'#a8ada4',.04);box(3.14,1.59,-.308,.84,1.5,.032,'#bec1b5',.02);box(3.14,.61,-.308,.84,.4,.035,'#b6baaf',.02);box(2.84,1.52,-.27,.03,.45,.035,'#56625b');for(let i=0;i<7;i++)box(3.05+(i%3)*.15,1.22+Math.floor(i/3)*.28,-.277,.08,.12,.008,['#c79b62','#759187','#dfd0a4'][i%3]);plant(3.12,2.46,-.77,.66,'#c9b58a');plant(-.38,1.2,-1.98,.42,'#9da780');
 rug(1.37,.12,1.02,2.28,1.98,'#a28f6c','#807b5c');box(1.39,1.0,1.05,1.76,.11,1.11,color.oak,.025);for(const x of [.68,2.1])for(const z of [.65,1.47])rod([x,.18,z],[x,1,z],.045,color.oak);for(const [x,z,a] of [[1.16,.25,0],[1.24,1.88,Math.PI],[.28,1.05,-Math.PI/2],[2.47,1.06,Math.PI/2]]){const cg=new THREE.Group();group.add(cg);const old=group;group=cg;box(0,.62,0,.5,.11,.48,'#dedccd',.07);box(0,.98,-.2,.5,.68,.085,'#e7e1ce',.06);for(const xx of [-.18,.18])for(const zz of [-.16,.16])rod([xx,.18,zz],[xx,.59,zz],.03,color.oak);group=old;cg.position.set(x,0,z);cg.rotation.y=a;}plant(1.38,1.07,1.04,.34,'#637d75');cyl(1.77,1.16,1.06,.05,.05,.18,'#d8c7a2');
 box(3.15,.71,1.46,.65,1.2,.65,color.oak,.025);for(let i=0;i<2;i++)box(3.15,.37+i*.42,1.46,.62,.04,.6,'#c69b62');plant(3.12,1.32,1.49,.53,'#ad9974');sconce(1.36,2.82,-2.01);addLight(1.39,2.3,1.05,17,4.4,false);

 return {root,floors,rooms,picks};
}
