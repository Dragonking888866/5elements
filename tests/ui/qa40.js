if(location.hostname!=='127.0.0.1'||location.port!=='8740')throw Error('仅限隔离验收端口8740');
'use strict';
const panel39=document.createElement('section');panel39.style.cssText='position:fixed;z-index:50000;bottom:0;left:0;right:0;padding:8px;background:#132936;color:white;font:12px monospace;max-height:27vh;overflow:auto';document.body.append(panel39);
const output39=document.createElement('output');let holdQA39=true,stressQA39=false,oldBackend39=false,drawSamples39=[],updateSamples39=[],paintTimes39=[],activePaints39=[],fixedCam39=null;
const actualDrawQA39=draw,actualUpdateQA39=update,newBackend39=drawPetEffect;
drawPetEffect=function(f){return(oldBackend39?drawPetBefore39:newBackend39)(f)};
draw=function(){if(holdQA39)return;const before=lastRender11,t=performance.now();actualDrawQA39();const elapsed=performance.now()-t;if(lastRender11!==before){drawSamples39.push(elapsed);const now=performance.now();paintTimes39.push(now);if(petFx.some(f=>f.cast38&&f.t>0))activePaints39.push({at:now,cost:elapsed})}};
update=function(dt){if(holdQA39)return;if(stressQA39&&menu==='pause')closeAllWindows19();const t=performance.now();actualUpdateQA39(dt);if(fixedCam39)Object.assign(cam,fixedCam39);updateSamples39.push(performance.now()-t)};
function button39(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=async()=>{output39.textContent='正在执行：'+label;try{await fn()}catch(e){holdQA39=true;panel39.hidden=false;output39.textContent=e.stack}};panel39.append(b)}
async function saveQA39(name,data){await fetch('/capture',{method:'POST',body:JSON.stringify({name,data})})}
async function jsonQA39(name,obj){return saveQA39(name,'data:application/json;base64,'+btoa(unescape(encodeURIComponent(JSON.stringify(obj,null,2)))))}
function assertQA39(v){if(!v)throw Error(operationMessage22()||'验收操作失败')}
async function imageQA39(path){const im=mythImage35(path);if(!im.complete)await new Promise((r,j)=>{im.addEventListener('load',r,{once:true});im.addEventListener('error',j,{once:true})});if(!im.naturalWidth)throw Error('Missing '+path)}
async function fixture39(type=110,q=6,multiple=false,quality='high'){
 holdQA39=true;keys.clear();clearStick();destination=null;assertQA39(await begin(fresh('V39隔离视觉验收',0)));closeAllWindows19();
 assertQA39(await commit17('qa39-fixture',quote10(),()=>{S.heroes.forEach(h=>{h.unlocked=true;h.lv=70;syncHeroGrowth23(h);h.pet=null});S.gold=1e8;S.ingots=1e7;S.map=1;S.active=0;S.fxQuality=quality;for(const d of RECRUITS18.slice(0,2)){const r=S.recruits18.find(r=>r.id===d.id)||unlockRecruit18(d.id);r.lv=20;r.deployed=multiple}return true}));
 fxPrefs15=cleanFxPrefs15({quality:quality==='low'?'low':quality==='medium'?'medium':'ultra',intensity:1,opacity:.55,shake:false,adaptive:false});
 petFx.forEach(releaseSurface39);petFx=[];impactQueue11=[];mythBurns35.length=0;recruitActors18=[];detailLatch39=false;
 const pets=actors.map(a=>addPet(multiple?[110,108,107,109,111][a.i]:type,false,q));
 for(const a of actors){const p=S.pets.find(p=>p.id===pets[a.i].id);p.lv=70;S.heroes[a.i].pet=p.id;S.heroes[a.i].petVisual11='follow';Object.assign(a,{x:900+(multiple?a.i%3*55:0),y:700+(multiple?Math.floor(a.i/3)*60:0),map19:multiple||!a.i?1:0,hp:stats(a.i).hp,mp:stats(a.i).mp,petCd:0,petAct11:null,mythCast35:null,face:1,visualFace11:1,path:[],attack:0,order:{kind:'hold'},combatOrder:'passive',motion:0});a.companion11={x:a.x-60,y:a.y+48,map:1,gait:0,motion:0,face:1,path:[],plan:999}}
 const e=makeEnemy(0,false,1100,700,'qa39-target');Object.assign(e,{map:1,hp:1e9,max:1e9,attack:999,root:999,cast:999,home:{x:1100,y:700}});enemies=[e];selectUnits([0]);resizeWorld();fixedCam39={x:1100-VW*.55,y:700-VH*.64};Object.assign(cam,fixedCam39);
 await Promise.all([...Object.values(FX_ATLASES39),...new Set((multiple?[110,108,107,109,111]:[type]).map(t=>ultimatePet35(t)?.art).filter(Boolean)),...(multiple?RECRUITS18.slice(0,2).map(d=>SUPPORT_ART37[d.id].file):[])].map(imageQA39));closeAllWindows19();
 // Warm the real scene and its ordinary hero/equipment caches before measuring.
 actualDrawQA39();await new Promise(r=>requestAnimationFrame(r));actualDrawQA39();return e;
}
function castQA39(multiple=false){for(const a of actors)if(a.map19===1){assertQA39(petAbility(a.i,true));a.order={kind:'hold'};a.combatOrder='passive'}return petFx.find(f=>f.cast39&&f.i15===0)}
function drawStillQA39(){lastRender11=0;actualDrawQA39()}
function advanceQA39(age){let f=petFx.find(f=>f.cast39&&f.i15===0),current=f?.age15||0;for(let n=current;n<age;n+=.02)tickImpacts11(Math.min(.02,age-n));for(const f of petFx)if(f.cast39){f.age15=age;f.t=Math.max(.01,f.max-age)}for(const a of actors){if(a.petAct11)a.petAct11.t=age;if(a.mythCast35)a.mythCast35.t=a.mythCast35.max-age}visualClock11=4+age;Object.assign(cam,fixedCam39);drawStillQA39()}
async function snapQA39(name){await saveQA39(name,canvas.toDataURL())}

const types40=DIVINE_MATERIALS40.map(d=>d.type),checks40=[];
function palette40(old){for(const m of DIVINE_MATERIALS40)ultimatePet35(m.type).art=old?m.previousArt:m.art}
function caption40(cx,label,x,y){cx.fillStyle='#10232e';cx.fillRect(x,y,640,26);cx.fillStyle='#e4dcc4';cx.font='15px system-ui';cx.fillText(label,x+12,y+19)}
async function compare40(){panel39.hidden=true;for(const type of types40){palette40(false);await fixture39(type);const d=ultimatePet35(type),m=d.material40;await imageQA39(m.previousArt);const cv=document.createElement('canvas');cv.width=1280;cv.height=1492;const cx=cv.getContext('2d');
 for(const [j,old]of [true,false].entries()){palette40(old);visualClock11=4;drawStillQA39();await snapQA39('V40-'+type+'-'+(old?'修改前':'新配色')+'-实际地图.png');cx.drawImage(canvas,0,0,canvas.width,canvas.height,0,j*746+26,1280,720);caption40(cx,(old?'V39 原配色':'V40 新材质')+' · '+d.name,0,j*746)}
 // Real map renders enlarged by layout only in the evidence image; game camera stays fixed.
 palette40(false);drawStillQA39();await saveQA39('V40-'+type+'-地图前后对照.png',cv.toDataURL());checks40.push({type,name:d.name,art:d.art,viewport:[innerWidth,innerHeight],world:[VW,VH],camera:{...cam},image:[mythImage35(d.art).naturalWidth,mythImage35(d.art).naturalHeight],saddle:mountRigPose32(type,actors[0]).saddleY,saveValid:validateSave(S)});
 }palette40(false);await jsonQA39('V40-地图配色验收.json',checks40);panel39.hidden=false;output39.textContent='十一兽实际地图新旧配色对照完成';}
button39('十一兽地图配色对照',compare40);
async function poses40(){panel39.hidden=true;palette40(false);const states=['待机','移动','攻击','施法'];for(const type of types40){const cv=document.createElement('canvas');cv.width=1280;cv.height=1536;const cx=cv.getContext('2d');for(const riding of [false,true])for(let k=0;k<4;k++){await fixture39(type);const a=actors[0];S.heroes[0].petVisual11=riding?'ride':'follow';a.face=a.visualFace11=k%2?-1:1;a.companion11.face=a.face;a.motion=a.companion11.motion=k===1?80:0;a.gait=a.companion11.gait=1.3;a.petAct11=k===2?{t:.3,duration:.7,target:'qa39-target'}:null;a.mythCast35=k===3?{row:3,t:1,max:2}:null;visualClock11=4;drawStillQA39();const j=(riding?4:0)+k;cx.drawImage(canvas,0,0,canvas.width,canvas.height,j%2*640,Math.floor(j/2)*384+24,640,360);caption40(cx,PETS[type].name+' · '+(riding?'骑乘':'随行')+' · '+states[k],j%2*640,Math.floor(j/2)*384);if(riding&&k===2)await snapQA39('V40-'+type+'-骑乘攻击实际地图.png')}
 await saveQA39('V40-'+type+'-四行与骑乘.png',cv.toDataURL());}panel39.hidden=false;output39.textContent='十一兽，四行动作、随行与骑乘，共88个真实地图状态完成';}
button39('十一兽四行动作骑乘',poses40);
button39('图鉴包裹融合投影核对',async()=>{palette40(false);await fixture39(106);const rows=[];for(const type of types40){const d=ultimatePet35(type),html=petPortrait8(type);if(!html.includes(d.art))throw Error('Portrait stale '+type);rows.push({type,portraitUsesNewArt:true});if(type!==113){mythCodex35('pet',type);if(!$('#dialog').innerHTML.includes(d.art))throw Error('Codex stale '+type)}}closeAllWindows19();castQA39();advanceQA39(1.8);await snapQA39('V40-九尾技能与新材质实际地图.png');await jsonQA39('V40-各入口资源一致性.json',rows);mythCodex35('pet',106);panel39.hidden=false;output39.textContent='图鉴、包裹、融合结果和地图共用新资源，十一个类型检查通过'});
async function perf40(old=false,quality='high'){palette40(old);await fixture39(110,6,true,quality);await Promise.all(DIVINE_MATERIALS40.map(m=>imageQA39(old?m.previousArt:m.art)));closeAllWindows19();panel39.hidden=true;stressQA39=true;drawSamples39=[];paintTimes39=[];activePaints39=[];updateSamples39=[];const heap=performance.memory?.usedJSHeapSize||null;castQA39(true);holdQA39=false;const start=performance.now();await new Promise(r=>{function tick(t){if(t-start<8000)requestAnimationFrame(tick);else r()}requestAnimationFrame(tick)});holdQA39=true;stressQA39=false;const elapsed=performance.now()-start,ints=paintTimes39.slice(1).map((v,i)=>v-paintTimes39[i]);const row={palette:old?'V39':'V40',quality,viewport:[innerWidth,innerHeight],visibility:document.visibilityState,elapsedMs:elapsed,paintFps:paintTimes39.length*1000/elapsed,p95FrameMs:percentile40(ints,.95),drawMeanMs:average40(drawSamples39),drawP95Ms:percentile40(drawSamples39,.95),heapBefore:heap,heapAfter:performance.memory?.usedJSHeapSize||null,saveValid:validateSave(S),cameraShake:screenShake};await jsonQA39('V40-性能-'+innerWidth+'-'+quality+'-'+row.palette+'.json',row);panel39.hidden=false;output39.textContent=JSON.stringify(row);palette40(false)}
function average40(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:0}function percentile40(a,p){return a.slice().sort((a,b)=>a-b)[Math.min(a.length-1,Math.floor(a.length*p))]||0}
button39('配色前后五宠性能对照',async()=>{await perf40(true,innerWidth>1024?'high':'medium');await perf40(false,innerWidth>1024?'high':'medium')});
button39('手机地图与骑乘截图',async()=>{palette40(false);await fixture39(107,6,false,'medium');S.heroes[0].petVisual11='ride';drawStillQA39();panel39.hidden=true;await snapQA39('V40-手机-'+innerWidth+'x'+innerHeight+'-玄鼋骑乘.png');output39.textContent='手机实际地图骑乘截图完成 '+innerWidth+'×'+innerHeight});
panel39.append(output39);window.addEventListener('error',e=>{holdQA39=true;panel39.hidden=false;output39.textContent=e.stack||e.message});actualDrawQA39();

button39('首组白虎九尾地图检查',async()=>{await fixture39(106);drawStillQA39();output39.textContent='首组资源载入完成';});

button39('单页图鉴实际检查',async()=>{await fixture39(106);mythCodex35('pet',106);panel39.hidden=true;});
