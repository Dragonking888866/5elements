'use strict';
const maskSurface39=document.createElement('canvas');maskSurface39.width=maskSurface39.height=640;
const maskContext39=maskSurface39.getContext('2d');
function eraseUnits39(c){
 c.globalCompositeOperation='destination-out';c.fillStyle='#000';
 for(const a of actors)if(owned(a.i)&&a.hp>0&&a.map19===currentMap()){
  ellipse39(c,a.x,a.y-68,24,67,'#000');const p=petOf(a.i),o=p&&petOrigin11(a),h=p&&(ultimatePet35(p.type)?.height||130);
  if(o)ellipse39(c,o.x,o.y-h*.43,h*.43,h*.42,'#000');
 }
 for(const e of enemies)if(e.map===currentMap()&&!e.dead&&seen11(e,100))c.fillRect(e.x-40,e.y-(e.boss?145:90),80,19);
 c.globalCompositeOperation='source-over';
}
function compositeLayer39(c,layer){
 const b=layer.bounds,cv=layer.canvas,mc=maskContext39;
 mc.setTransform(1,0,0,1,0,0);mc.clearRect(0,0,640,640);mc.globalAlpha=1;mc.globalCompositeOperation='source-over';mc.drawImage(cv,0,0);
 mc.save();mc.scale(layer.scale,layer.scale);mc.translate(-b.x,-b.y);eraseUnits39(mc);mc.restore();
 c.drawImage(maskSurface39,0,0,cv.width,cv.height,b.x,b.y,b.w,b.h);fxMetrics39.composites++;
}
function mouthAim39(f,target){
 const a=actors[f.i15],p=petOf(f.i15),o=petOrigin11(a),d=ultimatePet35(p.type);
 const following=o!==a,face=following&&a.petAct11&&target?(target.x>=o.x?1:-1):(o.face||a.face||1);
 const proxy=following?{...a,motion:o.motion,gait:o.gait,face}:a;
 const pose=mountRigPose32(p.type,proxy),anchors={tiger:[.36,-.54],lion:[.32,-.60],dragon:[.34,-.65],fox:[.35,-.49],turtle:[.38,-.34],bird:[.20,-.65],heavy:[.33,-.58]};
 let m;if(d){const uv=anchors[d.kind]||anchors.heavy;m={x:o.x+uv[0]*d.height*pose.scale*face,y:o.y+uv[1]*d.height*pose.scale+pose.bob}}
 else{const local=petLocalMouth15(p.type,proxy,v7MountState(p.type,proxy)),s=fxProfile15(p,a.i).scale;m={x:o.x+local.x*face*s,y:o.y+local.y*s}}
 return{...m,face};
}
function streamGeometry39(f,m,c){
 const s=f.spec39,dx=c.x-m.x,dy=c.y-35-m.y,distance=Math.hypot(dx,dy),forward=Math.max(36,Math.abs(dx));
 const angle=Math.atan2(clamp(dy,-forward*1.5,forward*1.5),forward*m.face);
 const length=Math.max(65,distance)+(s.unique&&s.scene==='inferno'?s.w*.28:Math.min(100,s.w*.11));
 return{angle,length,width:[32,48,67,94,130,178,245][s.q]*(s.unique?1.12:1)};
}
function drawJet39(c,f,m,at,b){
 const s=f.spec39,phase=presentationPhase39(f),pal=PALETTES39[s.family],age=f.age15;
 if(phase==='charge'){
  const u=clamp(age/f.windup15,0,1);alpha39(c,b.alpha,()=>{
   const glow=c.createRadialGradient(m.x,m.y,1,m.x,m.y,9+u*26);glow.addColorStop(0,pal[3]);glow.addColorStop(.3,pal[2]+'bb');glow.addColorStop(1,pal[1]+'00');ellipse39(c,m.x,m.y,10+u*28,10+u*28,glow);
   for(let j=0;j<4+Math.min(6,s.q);j++){const a=j*2.399+age*6,r=(1-u)*48+8;path39(c,[[m.x+Math.cos(a)*r,m.y+Math.sin(a)*r*.5],[m.x+Math.cos(a)*r*.7,m.y+Math.sin(a)*r*.35]],pal[2],1.3)}
  });return;
 }
 if(age>f.windup15+f.travel15+f.profile15.sustain)return;
 if(['claw','bell','fox','mountains','prison','chaos'].includes(s.scene))return;
 const geo=streamGeometry39(f,m,at),reach=clamp((age-f.windup15)/f.travel15,0,1),end=clamp((f.windup15+f.travel15+f.profile15.sustain-age)/.3,0,1),L=geo.length*reach,frame=atlasFrame39(f,false);
 c.save();c.translate(m.x,m.y);c.rotate(geo.angle);c.globalAlpha*=b.alpha*end;
 if(s.family==='fire'){
  // The sprite's tapered left edge is the mouth. It remains attached every rendered frame.
  atlas39(c,'fire',frame,L*.5,0,L,geo.width,.94);
  if(s.q>=4)atlas39(c,'fire',4+Math.floor(age*14)%8,L*.7,Math.sin(age*9)*geo.width*.04,L*.65,geo.width*.64,.28);
 }else if(s.family==='water'){
  const grad=c.createLinearGradient(0,-geo.width*.4,0,geo.width*.4);grad.addColorStop(0,'#b6f2ff00');grad.addColorStop(.25,'#64d6ee88');grad.addColorStop(.5,'#ebffffe0');grad.addColorStop(.72,'#318bbbaa');grad.addColorStop(1,'#1e77b600');
  c.fillStyle=grad;c.beginPath();c.moveTo(0,-4);c.bezierCurveTo(L*.3,-geo.width*.18,L*.7,-geo.width*.44,L,-geo.width*.4);c.lineTo(L,geo.width*.4);c.bezierCurveTo(L*.7,geo.width*.3,L*.3,geo.width*.14,0,4);c.fill();
  for(let j=0;j<b.motes;j++){const u=(j/b.motes+age*1.2)%1,x=u*L,y=Math.sin(j*2.4+age*5)*geo.width*u*.3;path39(c,[[x-20,y],[x,y]],'#dbffffbb',1.5)}
 }else if(s.family==='ice'){
  const grad=c.createLinearGradient(0,0,L,0);grad.addColorStop(0,'#e0ffff00');grad.addColorStop(.35,'#b5edffb0');grad.addColorStop(1,'#d9f9ff20');
  path39(c,[[0,-2],[L,-geo.width*.46],[L,geo.width*.46],[0,2]],grad,1,true);
  for(let j=0;j<b.motes;j++){const u=(j/b.motes+age*.8)%1,x=u*L,y=Math.sin(j*2.4)*geo.width*u*.36;sword39(c,x,y,5+u*12,Math.PI/2,PALETTES39.ice,.75)}
 }else if(s.family==='wood'){
  for(let j=0;j<3+Math.min(5,s.q);j++){c.strokeStyle=pal[j%2+1]+'bb';c.lineWidth=2+j%3;c.beginPath();c.moveTo(0,0);c.bezierCurveTo(L*.32,Math.sin(age*4+j)*geo.width*.2,L*.75,Math.cos(j)*geo.width*.35,L,Math.sin(j*2.4)*geo.width*.4);c.stroke()}
  for(let j=0;j<b.motes;j++){const u=(j/b.motes+age*.6)%1;ellipse39(c,L*u,Math.sin(j*2.4+age)*geo.width*u*.35,3+u*3,8+u*5,pal[2]+'bb',age+j)}
 }else if(s.family==='wind')atlas39(c,'wind',frame,L*.72,0,geo.width*1.9,L*.7,.6,Math.PI/2);
 else for(let j=0;j<4+Math.min(s.q,4);j++){const u=(age+j*.17)%1;sword39(c,L*u,Math.sin(j)*geo.width*u*.3,12+s.q*6,Math.PI/2,pal,.9)}
 c.restore();
}
function renderLayer39(f,at,b){
 const bounds=composition39(f,at),layer=acquireSurface39(f,bounds,b),ready=atlasNames39(f.spec39).map(key=>imageReady39(mythImage35(FX_ATLASES39[key]))?1:0).join('');
 const key=[Math.floor(f.age15*b.rate),b.detail,b.alpha,Math.round(at.x/2),Math.round(at.y/2),ready].join(':');
 if(layer.key===key){fxMetrics39.reuses++;return layer}
 const started=performance.now(),ctx=layer.ctx;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,layer.canvas.width,layer.canvas.height);ctx.save();ctx.scale(layer.scale,layer.scale);ctx.translate(-bounds.x,-bounds.y);ctx.translate(at.x,at.y);paintField39(ctx,f,bounds,b);ctx.restore();layer.key=key;
 fxMetrics39.paints++;fxMetrics39.paintMs+=performance.now()-started;
 let bytes=maskSurface39.width*maskSurface39.height*4;for(const v of liveSurfaces39.values())bytes+=v.canvas.width*v.canvas.height*4;fxMetrics39.peakBytes=Math.max(fxMetrics39.peakBytes,bytes);
 f.render39=layer;return layer;
}
function paintCast39(c,f,mask=true){
 const p=f.token15,target=castTarget38(p),m=mouthAim39(f,target),charge=f.spec39.hidden&&f.age15<f.windup15;
 const at=charge?{x:m.x,y:m.y+45}:f.center38||{x:target?.x??f.tx,y:target?.y??f.ty+35},bounds=composition39(f,at);
 if(!visibleSkill38(bounds)&&!seen11(m,150)){fxMetrics39.culled++;petMetrics38.culled++;return}
 const b=budget39(f);fxStats15.large=Math.min(b.mobile?1:2,petFx.filter(v=>v.cast39&&v.t>0&&v.q15>=4).length);
 if(f.age15>=f.windup15||charge){const layer=renderLayer39(f,at,b);if(mask)compositeLayer39(c,layer);else c.drawImage(layer.canvas,layer.bounds.x,layer.bounds.y,layer.bounds.w,layer.bounds.h)}
 drawJet39(c,f,m,at,b);
 if(f.hit38){const fade=clamp((f.max-f.age15)/.6,0,1),pal=PALETTES39[f.spec39.family];alpha39(c,.35*fade,()=>{
  c.setLineDash([5,10]);ring39(c,at.x,at.y,f.skill38.radius,f.skill38.radius,pal[2],1.25);c.setLineDash([]);
 })}
 if(f.spec39.hidden){const chapters=f.age15<f.windup15?'天地寂静':f.age15<f.windup15+f.travel15?'五行逆转':f.age15<f.windup15+f.travel15+1.4?'鸿蒙裂界':'归墟余波';c.save();c.font='600 16px serif';c.fillStyle='#eadcb6';c.textAlign='center';c.globalAlpha=.8;c.fillText(chapters,at.x,at.y-bounds.H*.73);c.restore()}
}
const drawPetBefore39=drawPetEffect;
const battleSurface39=document.createElement('canvas'),battleContext39=battleSurface39.getContext('2d');
function visibleCast39(f){const target=castTarget38(f.token15),at=f.center38||{x:target?.x??f.tx,y:target?.y??f.ty+35};return visibleSkill38(composition39(f,at))||seen11(mouthAim39(f,target),150)}
function paintBattle39(c,all){
 const mobile=fxMobile38(),limited=S?.fxQuality==='low'||fxPrefs15.quality==='low'||fxPrefs15.adaptive!==false&&detailLatch39;
 const resolution=mobile?448:limited?512:768,scale=Math.min(resolution/VW,resolution/VH),w=Math.max(1,Math.round(VW*scale)),h=Math.max(1,Math.round(VH*scale));
 if(battleSurface39.width!==w||battleSurface39.height!==h){battleSurface39.width=w;battleSurface39.height=h}
 const bc=battleContext39;bc.setTransform(1,0,0,1,0,0);bc.globalAlpha=1;bc.globalCompositeOperation='source-over';bc.clearRect(0,0,w,h);bc.save();bc.scale(scale,scale);bc.translate(-cam.x,-cam.y);
 // A single shared-mask upload avoids mutating a source canvas between five main-canvas blits.
 for(const f of all.slice().sort((a,b)=>(a.i15===S.active)-(b.i15===S.active)))paintCast39(bc,f,false);
 eraseUnits39(bc);bc.restore();c.drawImage(battleSurface39,cam.x,cam.y,VW,VH);
 fxMetrics39.composites++;fxMetrics39.peakBytes=Math.max(fxMetrics39.peakBytes,w*h*4+maskSurface39.width*maskSurface39.height*4+[...liveSurfaces39.values()].reduce((sum,l)=>sum+l.canvas.width*l.canvas.height*4,0));
}
drawPetEffect=function(f){
 if(!f.cast39)return drawPetBefore39(f);if(f.t<=0||!castValid38(f.token15))return;
 if(!visibleCast39(f)){fxMetrics39.culled++;petMetrics38.culled++;return}
 const all=petFx.filter(v=>v.cast39&&v.t>0&&castValid38(v.token15)&&visibleCast39(v));if(all.length>1&&f!==all[0])return;
 const started=performance.now();petMetrics38.draws+=all.length||1;fxMetrics39.frames+=all.length||1;g.save();try{if(all.length>1)paintBattle39(g,all);else paintCast39(g,f)}finally{g.restore();petMetrics38.drawMs+=performance.now()-started}
};
// Coverage samples the actual composed effect mask at a fixed viewport, including the moving jet.
const coverageSurface39=document.createElement('canvas');coverageSurface39.width=640;coverageSurface39.height=360;
function measureCoverage39(f,threshold=12){
 const cv=coverageSurface39,ctx=cv.getContext('2d'),s=cv.width/VW;cv.height=Math.max(1,Math.round(VH*s));
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,cv.width,cv.height);ctx.save();ctx.scale(s,s);ctx.translate(-cam.x,-cam.y);paintCast39(ctx,f);ctx.restore();
 const data=ctx.getImageData(0,0,cv.width,cv.height).data;let visible=0,core=0;for(let n=3;n<data.length;n+=4){if(data[n]>=threshold)visible++;if(data[n]>=48)core++}
 return{coverage:visible/(cv.width*cv.height),core:core/(cv.width*cv.height),threshold,maskResolution:[cv.width,cv.height],viewport:[VW,VH],damageRadius:f.skill38.radius,scene:f.spec39.scene};
};
const updateBeforeCompositor39=update;update=function(dt){updateBeforeCompositor39(dt);sweepSurfaces39()};
// V11 throttled the inner scene while later FX wrappers still painted over the old frame.
// Gate the complete existing draw chain so terrain, actors, hazards and translucent FX refresh together.
const sceneDrawBefore39=draw;
draw=function(){const now=performance.now(),interval=1000/settings11().fps;if(lastRender11&&now-lastRender11<interval-1)return;return sceneDrawBefore39()};
