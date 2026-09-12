// Stable bit order in the app, exports, and manifest.
export const rooms = [
  {id:'living',name:'Living room',bit:1,floor:'Downstairs',points:[[139,560],[776,473],[651,610],[569,698],[607,756],[673,852],[136,947],[32,738],[137,716]],label:[330,903],icon:'M3 12V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M5 17v3m14-3v3M2 12h4v4h12v-4h4v7H2Z'},
  {id:'kitchen',name:'Kitchen',bit:2,floor:'Downstairs',points:[[776,473],[1087,429],[1108,765],[673,852],[607,756],[569,698],[651,610]],label:[978,793],icon:'M4 3h16v18H4ZM4 9h16M8 5v2m0 5v4'},
  {id:'bedroom',name:'Bedroom',bit:4,floor:'Upstairs',points:[[87,197],[353,173],[429,301],[432,492],[116,535],[31,382],[86,375]],label:[258,491],icon:'M3 18v3m18-3v3M3 12V5h18v7M2 12h20v6H2ZM6 8h4m4 0h4'},
  {id:'hallway',name:'Hallway',bit:8,floor:'Upstairs',points:[[353,173],[964,89],[1053,204],[1060,389],[1060,406],[432,492],[429,301]],label:[723,427],icon:'M4 21V3h16v18M9 21V8h7v13M12 14h1'},
  {id:'study',name:'Study',bit:16,floor:'Upstairs',points:[[964,89],[1387,25],[1488,172],[1493,349],[1060,419],[1060,389],[1053,204]],label:[1282,384],icon:'M3 3h18v12H3ZM8 20h8m-4-5v5M2 23h20'}
];
export const WIDTH=1536, HEIGHT=1024;
export const stateKey = state => rooms.map(room => state & room.bit ? '1' : '0').join('');
export const stateName = state => state === 31 ? 'All lights on' : state === 0 ? 'All lights off' : rooms.filter(room=>state & room.bit).map(room=>room.name).join(', ');
export const stateFile = (state, style, time, collection='original') => `${collection}-${style}-${time}-${stateKey(state)}.png`;
export const polygonPath = points => `M${points.map(p=>p.join(',')).join('L')}Z`;

// Sparse ink uses a thinner slab and lower drawn floor edges than the 3D master.
// Use its own registered boundaries for both interaction and compositing.
const inkGeometry = {
 living:{points:[[139,579],[776,491],[651,632],[574,715],[607,789],[673,892],[136,969],[32,768],[137,746]],label:[330,934]},
 kitchen:{points:[[776,491],[1096,454],[1108,831],[673,892],[607,789],[574,715],[651,632]],label:[978,823]},
 bedroom:{points:[[81,199],[345,173],[429,301],[432,512],[110,558],[31,400],[80,391]],label:[258,531]},
 hallway:{points:[[345,173],[964,89],[1053,223],[1060,421],[432,512],[429,301]],label:[723,461]},
 study:{points:[[964,89],[1387,25],[1509,170],[1493,359],[1060,441],[1060,421],[1053,223]],label:[1282,397]}
};
export const roomGeometry = (room,style) => {
 if(style==='ink')return inkGeometry[room.id];
 // The synthwave light strips straddle the ceiling edge by a few pixels.
 if(style==='synthwave'&&['hallway','study'].includes(room.id))return {...room,points:room.points.map(([x,y],i)=>[x,y-(i<2?6:0)])};
 return room;
};
