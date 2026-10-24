if(location.hostname!=='127.0.0.1'||location.port!=='8739')throw Error('仅限隔离验收端口8739');
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
const coverageRows39=[];
async function keyframes39(types=ULTIMATES39.map(d=>d.type)){
 panel39.hidden=true;oldBackend39=false;
 for(const type of types){const montage=document.createElement('canvas'),mc=montage.getContext('2d');montage.width=1280;montage.height=1152;await fixture39(type);const f=castQA39();let peak={coverage:0,age:0};
  for(const age of [1.3,1.6,2,2.5,3]){advanceQA39(age);const v=measureCoverage39(f);if(v.coverage>peak.coverage)peak={...v,age}}
  coverageRows39.push({type,pet:PETS[type].name,skill:f.spec39.name,...peak});
  // A fresh real cast is used for each frame so charge -> impact is never rewound.
  for(const [j,age]of [.3,.8,peak.age,1.45,4.25].entries()){
   await fixture39(type);const f2=castQA39();advanceQA39(age);await snapQA39('V39-'+type+'-'+j+'-'+['蓄力','释放','最大范围','命中','消散'][j]+'.png');
   mc.fillStyle='#101e29';mc.fillRect(j%2*640,Math.floor(j/2)*384,640,384);mc.drawImage(canvas,0,0,canvas.width,canvas.height,j%2*640,Math.floor(j/2)*384+24,640,360);mc.fillStyle='#f1ddad';mc.font='15px system-ui';mc.fillText(PETS[type].name+' · '+['蓄力','释放','最大范围','命中','消散'][j]+' '+age+'s',j%2*640+10,Math.floor(j/2)*384+18)
  }
  await saveQA39('V39-'+type+'-五阶段实际地图.png',montage.toDataURL());
 }
 await jsonQA39('V39-究极技能覆盖实测.json',coverageRows39);panel39.hidden=false;output39.textContent='完成 '+types.length+' 只灵兽五阶段真实地图与覆盖率';
}
button39('三个标杆五阶段验收',()=>keyframes39([110,108,107]));button39('其余八兽五阶段验收',()=>keyframes39([103,104,105,106,109,111,112,113]));
button39('七品质同镜头实测',async()=>{panel39.hidden=true;const rows=[],cv=document.createElement('canvas'),cx=cv.getContext('2d');cv.width=1280;cv.height=1536;for(let q=0;q<7;q++){await fixture39(11,q);const f=castQA39();let peak={coverage:0,age:0};const hit=f.windup15+f.travel15;for(let age=hit+.1;age<=hit+f.profile15.sustain;age+=.12){advanceQA39(age);const r=measureCoverage39(f);if(r.coverage>peak.coverage)peak={...r,age}}rows.push({q,quality:QUALITIES8[q][0],...peak});await fixture39(11,q);castQA39();advanceQA39(peak.age);await snapQA39('V39-品质'+q+'-实际地图.png');cx.fillStyle='#102332';cx.fillRect(q%2*640,Math.floor(q/2)*384,640,384);cx.drawImage(canvas,0,0,canvas.width,canvas.height,q%2*640,Math.floor(q/2)*384+24,640,360);cx.fillStyle='#ead8ab';cx.font='15px system-ui';cx.fillText(QUALITIES8[q][0]+' · 可见覆盖 '+(peak.coverage*100).toFixed(1)+'% · 伤害半径 '+peak.damageRadius,q%2*640+10,Math.floor(q/2)*384+18)}await saveQA39('V39-七品质固定镜头.png',cv.toDataURL());await jsonQA39('V39-七品质覆盖实测.json',rows);panel39.hidden=false;output39.textContent=JSON.stringify(rows)});
button39('新旧同帧真实对照',async()=>{await fixture39(110);const f=castQA39();advanceQA39(1.65);panel39.hidden=true;oldBackend39=true;drawStillQA39();await snapQA39('V38-同场景龙炎基线.png');oldBackend39=false;drawStillQA39();await snapQA39('V39-同场景龙炎新演出.png');panel39.hidden=false;output39.textContent='固定英雄地图镜头分辨率，两个渲染器同帧截图完成'});
function average39(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:0}
function percentile39(a,p){const b=a.slice().sort((a,b)=>a-b);return b[Math.min(b.length-1,Math.floor(b.length*p))]||0}
const performanceRows39=[];
async function benchQA39(multiple=false,old=false,quality='high',record=false){await fixture39(110,6,multiple,quality);oldBackend39=old;closeAllWindows19();panel39.hidden=true;stressQA39=true;drawSamples39=[];updateSamples39=[];paintTimes39=[];activePaints39=[];const before={...fxMetrics39},heapBefore=performance.memory?.usedJSHeapSize||null;castQA39(multiple);let chunks=[],rec,stream;if(record){stream=canvas.captureStream(24);rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'});rec.ondataavailable=e=>chunks.push(e.data);rec.start()}
 holdQA39=false;const start=performance.now(),rafs=[];let last=start;await new Promise(resolve=>{function tick(t){rafs.push(t-last);last=t;if(t-start<12000)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)});holdQA39=true;stressQA39=false;const elapsed=performance.now()-start,intervals=paintTimes39.slice(1).map((v,i)=>v-paintTimes39[i]),label=(innerWidth>1024?'电脑':'手机')+'-'+(multiple?'五英雄五宠两支援':'单宠')+'-'+quality+'-'+(old?'V38':'V39')+(record?'-录屏':'');
 const row={label,recording:record,visibility:document.visibilityState,targetFps:settings11().fps,viewport:[innerWidth,innerHeight],worldViewport:[VW,VH],canvas:[canvas.width,canvas.height],dpr:devicePixelRatio,elapsedMs:elapsed,rafFps:1000/average39(rafs),paintFps:paintTimes39.length*1000/elapsed,p95FrameMs:percentile39(intervals,.95),onePercentLowFps:1000/percentile39(intervals,.99),drawMeanMs:average39(drawSamples39),drawP95Ms:percentile39(drawSamples39,.95),updateMeanMs:average39(updateSamples39),paintedFrames:paintTimes39.length,heapBefore,heapAfter:performance.memory?.usedJSHeapSize||null,fxPaintMeanMs:(fxMetrics39.paintMs-before.paintMs)/Math.max(1,fxMetrics39.paints-before.paints),fxPaints:fxMetrics39.paints-before.paints,fxCacheReuses:fxMetrics39.reuses-before.reuses,fxSurfacePeakBytes:fxMetrics39.peakBytes,liveLayers:liveSurfaces39.size,pool:surfacePool39.length,cameraShake:screenShake,saveValid:validateSave(S),remainingQueue:impactQueue11.length};
 const activeIntervals=activePaints39.slice(1).map((v,i)=>v.at-activePaints39[i].at);Object.assign(row,{activeCastFrames:activePaints39.length,activeCastFps:1000/average39(activeIntervals),activeP95FrameMs:percentile39(activeIntervals,.95),activeDrawMeanMs:average39(activePaints39.map(v=>v.cost))});
 await snapQA39('V39-'+label+'.png');performanceRows39.push(row);await jsonQA39('V39-'+label+'-性能.json',row);await jsonQA39('V39-性能汇总.json',performanceRows39);
 if(rec){await new Promise(resolve=>{rec.onstop=resolve;rec.stop()});stream.getTracks().forEach(t=>t.stop());const data=await new Promise(resolve=>{const r=new FileReader;r.onload=()=>resolve(r.result);r.readAsDataURL(new Blob(chunks,{type:'video/webm'}))});await saveQA39('V39-'+label+'.webm',data)}oldBackend39=false;panel39.hidden=false;output39.textContent=JSON.stringify(row);
}
button39('电脑性能四组对照',async()=>{for(const multi of [false,true])for(const old of [true,false])await benchQA39(multi,old)});
button39('手机中低画质对照',async()=>{for(const quality of ['medium','low'])for(const old of [true,false])await benchQA39(true,old,quality)});
button39('祖兽完整实战录屏',async()=>{await fixture39(113);oldBackend39=false;panel39.hidden=true;castQA39();const stream=canvas.captureStream(24),chunks=[],rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'});rec.ondataavailable=e=>chunks.push(e.data);rec.start();stressQA39=true;holdQA39=false;await new Promise(resolve=>{const t=performance.now();function frame(n){if(n-t>7000)resolve();else requestAnimationFrame(frame)}requestAnimationFrame(frame)});holdQA39=true;stressQA39=false;await new Promise(resolve=>{rec.onstop=resolve;rec.stop()});stream.getTracks().forEach(t=>t.stop());const data=await new Promise(resolve=>{const r=new FileReader;r.onload=()=>resolve(r.result);r.readAsDataURL(new Blob(chunks,{type:'video/webm'}))});await saveQA39('V39-混沌祖兽-完整实际战斗.webm',data);panel39.hidden=false;output39.textContent='祖兽实际战斗录屏完成'});
button39('手机龙炎实际界面',async()=>{await fixture39(110,6,false,'medium');castQA39();advanceQA39(1.65);panel39.hidden=true;await snapQA39('V39-手机横屏-龙炎实际界面.png')});
panel39.append(output39);const toggleQA39=document.createElement('button');toggleQA39.textContent='验收工具39';toggleQA39.style.cssText='position:fixed;top:4px;left:45%;z-index:51000';toggleQA39.onclick=()=>panel39.hidden=!panel39.hidden;document.body.append(toggleQA39);
window.addEventListener('error',e=>{holdQA39=true;output39.textContent='ERROR '+e.message;panel39.hidden=false});actualDrawQA39();

button39('全量最终视觉验收',async()=>{coverageRows39.length=0;await keyframes39()});
async function recordSkillQA39(type,multiple=false){
 await fixture39(type,6,multiple);oldBackend39=false;panel39.hidden=true;castQA39(multiple);const stream=canvas.captureStream(24),chunks=[],rec=new MediaRecorder(stream,{mimeType:'video/webm;codecs=vp9'});rec.ondataavailable=e=>chunks.push(e.data);rec.start();stressQA39=true;holdQA39=false;
 await new Promise(resolve=>{const t=performance.now();function frame(n){if(n-t>7000)resolve();else requestAnimationFrame(frame)}requestAnimationFrame(frame)});holdQA39=true;stressQA39=false;await new Promise(resolve=>{rec.onstop=resolve;rec.stop()});stream.getTracks().forEach(t=>t.stop());const data=await new Promise(resolve=>{const r=new FileReader;r.onload=()=>resolve(r.result);r.readAsDataURL(new Blob(chunks,{type:'video/webm'}))});await saveQA39('V39-'+(multiple?'五宠混战':type)+'-完整实际战斗.webm',data);
}
button39('十一兽与混战实战录屏',async()=>{for(const d of ULTIMATES39)await recordSkillQA39(d.type);await recordSkillQA39(110,true);panel39.hidden=false;output39.textContent='十一种终极技能与五宠混战，共十二段实际游戏录屏完成'});


