'use strict';
// Cache only within a single synchronous update/render. Panels and save previews always compute fresh.
// Level, pet growth, haste expiration, phase boundaries and transactions invalidate the entry.
let statWindow11=null;
const statCompute11=stats;stats=function(i){if(!statWindow11||!S)return statCompute11(i);const h=S.heroes[i],p=petOf(i),a=actors[i],key=[h.lv,h.job,h.pet,p?.lv,p?.quality,(a?.hasteTime10||0)>0,a?.haste10,luckRevision10,Math.floor(S.played/180)].join(':');const old=statWindow11.get(i);if(old?.key===key)return {...old.value};const value=statCompute11(i);statWindow11.set(i,{key,value});return {...value}};
function sceneHint11(){if(!S||menu||currentMap()!==0)return;const n=sceneNpcs11().find(n=>dist(active(),n)<155),c=SCENES11.chests.find(c=>c.map===0&&!S.treasure11.includes(c.id)&&dist(active(),c)<145);$('#hint').textContent=n?'点击人物 / F进入 '+n.name:c?'点击 / F开启探险宝箱':safePoint11(active())?'青禾安全营地 · 向东探索溪林，或菜单查看探索地图':'沿古道探索宝箱与精英；红色预警出现后及时走位。'}
const simulationBeforeCache11=update;update=function(dt){const before=statWindow11;statWindow11=new Map();try{simulationBeforeCache11(dt);sceneHint11()}finally{statWindow11=before}};
let renderScale11=.9;
const resizeBeforeQuality11=resizeWorld;resizeWorld=function(){resizeBeforeQuality11();renderScale11=S?.fxQuality==='low'?.72:S?.fxQuality==='high'?1:.9;canvas.width=Math.round(VW*renderScale11);canvas.height=Math.round(VH*renderScale11)};
const beginBeforeQuality11=begin;begin=function(...args){const result=beginBeforeQuality11(...args);resizeWorld();return result};
const rendererBeforeCache11=draw;draw=function(){const before=statWindow11;statWindow11=new Map();g.save();g.scale(renderScale11,renderScale11);try{if(menu){fpsWindow11.at=0;fpsWindow11.frames=0}return rendererBeforeCache11()}finally{g.restore();statWindow11=before}};
