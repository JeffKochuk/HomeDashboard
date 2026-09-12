export const styles = [
  {id:'original',name:'Original isometric',tab:'Original',color:'#d0ad79'},
  {id:'watercolor',name:'Watercolor',tab:'Watercolor',color:'#89b6c6'},
  {id:'ghibli',name:'Ghibli',tab:'Ghibli',color:'#96b579'},
  {id:'abstract',name:'Abstract shapes & colors',tab:'Abstract',color:'#e48c78'},
  {id:'synthwave',name:'Synthwave',tab:'Synthwave',color:'#db8feb'},
  {id:'dali',name:'Dalí',tab:'Dalí',color:'#d7b35f'},
  {id:'ink',name:'Japanese ink-on-silk',tab:'Japanese ink',color:'#b6b2a2'},
  {id:'papercut',name:'Layered papercut',tab:'Papercut',color:'#e3a879'}
];
export const styleById = id => styles.find(style=>style.id===id);
export const assetPath = (style,time) => `./assets/styles/${style}-${time}.png`;
export const selectionKey = selection => `${selection.style}-${selection.time}`;
export const selectionLabel = selection => `${styleById(selection.style).name} · ${selection.time==='day'?'Day':'Night'}`;
