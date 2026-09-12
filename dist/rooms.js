// Stable bit order in the app, exports, and manifest.
export const rooms = [
  {id:'living',name:'Living room',bit:1,floor:'Downstairs',points:[[95,379],[477,318],[373,439],[381,469],[399,514],[418,569],[80,633],[28,506],[91,489]],label:[225,591],icon:'M3 12V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3M5 17v3m14-3v3M2 12h4v4h12v-4h4v7H2Z'},
  {id:'kitchen',name:'Kitchen',bit:2,floor:'Downstairs',points:[[477,318],[716,287],[731,374],[741,534],[418,569],[399,514],[381,469],[373,439]],label:[648,526],icon:'M4 3h16v18H4ZM4 9h16M8 5v2m0 5v4'},
  {id:'bedroom',name:'Bedroom',bit:4,floor:'Upstairs',points:[[58,134],[239,112],[287,203],[287,331],[78,368],[40,282]],label:[163,344],icon:'M3 18v3m18-3v3M3 12V5h18v7M2 12h20v6H2ZM6 8h4m4 0h4'},
  {id:'hallway',name:'Hallway',bit:8,floor:'Upstairs',points:[[239,112],[645,60],[696,145],[704,271],[287,331],[287,203]],label:[487,294],icon:'M4 21V3h16v18M9 21V8h7v13M12 14h1'},
  {id:'study',name:'Study',bit:16,floor:'Upstairs',points:[[645,60],[923,17],[994,115],[999,251],[727,284],[704,271],[696,145]],label:[824,253],icon:'M3 3h18v12H3ZM8 20h8m-4-5v5M2 23h20'}
];
export const WIDTH=1024, HEIGHT=682;
export const stateKey = state => rooms.map(room => state & room.bit ? '1' : '0').join('');
export const stateName = state => state === 31 ? 'All lights on' : state === 0 ? 'All lights off' : rooms.filter(room=>state & room.bit).map(room=>room.name).join(', ');
export const stateFile = state => `home-${stateKey(state)}.png`;
export const polygonPath = points => `M${points.map(p=>p.join(',')).join('L')}Z`;
