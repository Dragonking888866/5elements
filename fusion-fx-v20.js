'use strict';

let fusionFx20={generation:0,raf:0,running:false,receipt:null,start:0,elapsed:0,lastFrame:0,phase:'idle',skip:false};
let fusionDisplayPet20=null, fusionDisplayOwner20=-1;
const petLookupBeforeDisplay20=petOf;
petOf=function(i){return fusionDisplayPet20 && i===fusionDisplayOwner20 ? fusionDisplayPet20 : petLookupBeforeDisplay20(i)};

function fusionReduced20(){return !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches}
function stopFusionFx20(){
  fusionFx20.generation++;
  if(fusionFx20.raf && typeof cancelAnimationFrame==='function')cancelAnimationFrame(fusionFx20.raf);
  fusionFx20.raf=0;fusionFx20.running=false;
}
function fusionCanvas20(canvas,w,h){
  if(!canvas?.getContext)return null;
  const density=Math.min(2,window.devicePixelRatio||1);
  if(canvas.width!==Math.round(w*density)||canvas.height!==Math.round(h*density)){
    canvas.width=Math.round(w*density);canvas.height=Math.round(h*density);
  }
  const ctx=canvas.getContext('2d');ctx.setTransform(density,0,0,density,0,0);ctx.clearRect(0,0,w,h);return ctx;
}
function fusionGlow20(ctx,x,y,r,color,strength=.5){
  const glow=ctx.createRadialGradient(x,y,0,x,y,r);
  glow.addColorStop(0,color);glow.addColorStop(.25,color+'88');glow.addColorStop(1,color+'00');
  ctx.save();ctx.globalAlpha=strength;ctx.fillStyle=glow;ctx.fillRect(x-r,y-r,r*2,r*2);ctx.restore();
}
function fusionRing20(ctx,x,y,r,t,color,major=false,broken=false){
  ctx.save();ctx.translate(x,y);ctx.scale(1,.37);ctx.rotate(t);ctx.strokeStyle=color;
  ctx.lineWidth=major?2.2:1;ctx.globalAlpha=major?.8:.4;
  for(let j=0;j<(broken?12:1);j++){
    const start=broken?j*Math.PI/6:0,end=broken?start+.24:Math.PI*2;
    ctx.beginPath();ctx.arc(0,0,r,start,end);ctx.stroke();
  }
  if(major){
    ctx.beginPath();for(let j=0;j<5;j++){const a=-Math.PI/2+j*Math.PI*.8;const x=Math.cos(a)*r*.82,y=Math.sin(a)*r*.82;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.stroke();
    for(let j=0;j<16;j++){
      const a=j*Math.PI/8;ctx.save();ctx.rotate(a);ctx.translate(r+10,0);
      ctx.beginPath();ctx.moveTo(-3,-6);ctx.lineTo(3,0);ctx.lineTo(-3,6);ctx.lineTo(-3,-6);ctx.stroke();ctx.restore();
    }
  }ctx.restore();
}
function drawFusionModel20(ctx,snap,x,y,scale,clock,energy=0){
  if(!snap||!PETS[snap.type])return;
  const old={g,renderClock,visualClock11,pet:fusionDisplayPet20,owner:fusionDisplayOwner20};
  g=ctx;renderClock=clock;visualClock11=clock;fusionDisplayOwner20=S.active;
  fusionDisplayPet20={...snap,element10:snap.element};
  const air=!!PETS[snap.type].flight;
  try{
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    const color=QUALITIES8[snap.quality][1];
    fusionGlow20(ctx,0,-55,84,color,.12+snap.quality*.025);
    if(snap.quality>=4){fusionRing20(ctx,0,5,45+snap.quality*2,clock*.4,color,true);}
    const cycle=(clock%4)/4,proxy={i:S.active,x:0,y:0,face:1,motion:air?22:5,gait:clock*2.2,
      petAnim:cycle<.3?1.1-cycle*3.2:0,petMode:energy>.3?'roar':'idle',petAct11:null};
    drawMount(snap.type,proxy,false);drawMount(snap.type,proxy,true);
    ctx.restore();
  }finally{g=old.g;renderClock=old.renderClock;visualClock11=old.visualClock11;fusionDisplayPet20=old.pet;fusionDisplayOwner20=old.owner}
}
function drawFusionScene20(ctx,state,clock){
  const {a,b,receipt,elapsed,duration}=state;
  const q=receipt?.result?.quality??(a?Math.min(6,a.quality+1):1);
  const color=QUALITIES8[q][1],t=receipt?clamp(elapsed/duration,0,1):0;
  const success=receipt?.success??true,phase=receipt?fusionPhase20(elapsed,duration):'idle';
  const advanced=q>=4, reduced=fusionReduced20(),cx=320,cy=226;
  const bg=ctx.createRadialGradient(cx,177,0,cx,177,290);
  bg.addColorStop(0,'#1f3b43');bg.addColorStop(.6,'#0d1d2c');bg.addColorStop(1,'#07101b');
  ctx.fillStyle=bg;ctx.fillRect(0,0,640,300);
  // A bounded star field and three independently rotating rune rings.
  const stars=reduced?12:advanced?45:26;
  for(let j=0;j<stars;j++){
    const x=(j*137+23)%640,y=(j*71+17)%270;
    ctx.globalAlpha=.12+(.5+.5*Math.sin(clock*1.4+j))*.28;ctx.fillStyle=j%3?color:'#d7eaff';
    ctx.fillRect(x,y,j%5===0?2:1,j%5===0?2:1);
  }ctx.globalAlpha=1;
  fusionGlow20(ctx,cx,cy-10,170,color,phase==='converge'?.62:.2);
  const broken=!!receipt&&!success&&t>.61;
  fusionRing20(ctx,cx,cy,128,clock*.22,color,true,broken);
  fusionRing20(ctx,cx,cy,157,-clock*.17,color,false,broken);
  fusionRing20(ctx,cx,cy,102,clock*.34,color,false,broken);
  if(phase==='idle'){
    fusionGlow20(ctx,cx,168,50,color,.35);
    ctx.fillStyle='#eddfa9';ctx.textAlign='center';ctx.font='bold 28px serif';ctx.fillText('☯',cx,178);
    for(let j=0;j<5;j++){
      const angle=clock*.5+j*Math.PI*2/5,x=cx+Math.cos(angle)*115,y=cy+Math.sin(angle)*40;
      fusionGlow20(ctx,x,y-7,20,WX.colors[j],.5);
    }return;
  }
  if(t<.61){
    const merge=clamp((t-.15)/.46,0,1),distance=170*(1-merge),alpha=1-clamp((t-.42)/.19,0,1);
    ctx.globalAlpha=alpha;
    drawFusionModel20(ctx,a,cx-distance,223,.82,clock,merge);
    drawFusionModel20(ctx,b,cx+distance,223,.82,clock+.6,merge);
    ctx.globalAlpha=1;
    for(let side=-1;side<=1;side+=2){
      const el=side<0?a?.element:b?.element,col=WX.colors[el]||color;
      for(let j=0;j<(reduced?4:20);j++){
        const travel=(clock*1.2+j/20)%1,x=cx+side*170*(1-travel),y=161+Math.sin(travel*Math.PI*2+j*.3)*22;
        ctx.beginPath();ctx.strokeStyle=col;ctx.globalAlpha=.25+travel*.5;ctx.lineWidth=1+travel*2;
        ctx.moveTo(x+side*12,y-3);ctx.lineTo(x,y);ctx.stroke();
      }
    }ctx.globalAlpha=1;
    fusionGlow20(ctx,cx,151,20+merge*80,color,.35+merge*.4);
    ctx.fillStyle='#fff1c9';ctx.globalAlpha=.65;ctx.beginPath();ctx.arc(cx,151,5+merge*16,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    return;
  }
  const reveal=clamp((t-.61)/.18,0,1);
  if(success){
    const beam=ctx.createLinearGradient(0,0,0,cy);beam.addColorStop(0,color+'00');beam.addColorStop(.4,color+'33');beam.addColorStop(1,color+'aa');
    ctx.save();ctx.globalAlpha=(advanced?.65:.36)*(1-clamp((t-.86)/.14,0,1)*.5);
    ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(cx-55,0);ctx.lineTo(cx+55,0);ctx.lineTo(cx+91,cy);ctx.lineTo(cx-91,cy);ctx.closePath();ctx.fill();ctx.restore();
    const count=reduced?10:Math.min(144,40+q*16);
    for(let j=0;j<count;j++){
      const angle=j*2.39996,travel=clamp((t-.61)/.39,0,1),speed=28+(j%11)*14;
      const x=cx+Math.cos(angle)*speed*travel,y=170+Math.sin(angle)*speed*travel*.6-travel*25;
      ctx.save();ctx.globalAlpha=(1-travel*.7)*(.4+(j%3)*.2);ctx.fillStyle=j%4?color:'#fff4cf';
      ctx.translate(x,y);ctx.rotate(clock+j);ctx.fillRect(-1,-3,2,6);ctx.fillRect(-3,-1,6,2);ctx.restore();
    }
    if(q>=5)for(let ring=0;ring<3;ring++)fusionRing20(ctx,cx,cy,82+ring*21,clock*(ring%2?-.7:.5),ring%2?'#fff1aa':color,true);
    ctx.save();ctx.globalAlpha=reveal;const lift=(1-reveal)*30;
    drawFusionModel20(ctx,receipt.result,cx,230-lift,.9+Math.sin(reveal*Math.PI)*.15,clock,1-reveal);
    ctx.restore();
  }else{
    const fade=1-clamp((t-.61)/.25,0,1);
    fusionGlow20(ctx,cx,151,90,'#d5a1d7',fade*.5);
    for(let j=0;j<(reduced?8:30);j++){
      const angle=j*2.399,travel=clamp((t-.61)/.39,0,1);
      ctx.globalAlpha=(1-travel)*.55;ctx.strokeStyle='#b7a4b7';ctx.beginPath();
      ctx.moveTo(cx+Math.cos(angle)*travel*155,177+Math.sin(angle)*travel*60);
      ctx.lineTo(cx+Math.cos(angle)*(travel*155+6),183+Math.sin(angle)*travel*60);ctx.stroke();
    }ctx.globalAlpha=1;
    drawFusionModel20(ctx,a,cx,235,.93,clock,0);
  }
}

function revealFusion20(){fusionFx20.skip=true;fusionFx20.elapsed=1e9;updateFusionResult20(true)}
function updateFusionResult20(force=false){
  const fx=fusionFx20;if(!fx.receipt)return;
  const duration=fusionDuration20(fx.receipt.result?.quality??fx.receipt.sources[0].quality,fx.receipt.success,fusionReduced20());
  const phase=force?'result':fusionPhase20(fx.elapsed,duration);
  const changed=phase!==fx.phase;fx.phase=phase;
  const labels={charge:'第一阶段 · 灵契蓄力',converge:'第二阶段 · 五行汇聚',reveal:fx.receipt.success?'第三阶段 · 灵宠新生':'第三阶段 · 灵光消散',result:fx.receipt.success?'融合成功 · 品质进阶':'融合失败 · 主宠归来'};
  const phaseNode=$('#fusionPhase20');if(phaseNode)phaseNode.textContent=labels[phase]||'';
  const reveal=phase==='reveal'||phase==='result',node=$('#fusionOutcome20');
  if(node){node.classList.toggle('revealed20',reveal);node.setAttribute('aria-hidden',String(!reveal));}
  const stage=$('#fusionScene20');if(stage)stage.dataset.phase=phase;
  if(changed&&phase==='reveal'){
    if(fx.receipt.success){tone(523,.13,'triangle');tone(784,.18,'sine');tone(fx.receipt.result.quality>=4?1046:880,.25,'triangle');}
    else{tone(146,.25,'triangle');tone(98,.17,'sine');}
    stage?.classList.toggle('fusion-shake20',fx.receipt.success&&fx.receipt.result.quality>=4&&fxPrefs15.shake&&!fusionReduced20());
  }
}
function startFusionFx20(receipt=null,replay=false){
  stopFusionFx20();const generation=fusionFx20.generation;
  Object.assign(fusionFx20,{running:true,receipt,start:performance.now(),elapsed:0,lastFrame:0,phase:receipt?'charge':'idle',skip:false});
  const root=$('#dialog');
  const paint=now=>{
    const fx=fusionFx20;if(generation!==fx.generation||!fx.running||!S||!menu||!['petFusion20','petResult20'].includes(panelContext7?.key)){if(generation===fx.generation)fx.running=false;return;}
    if(document.visibilityState==='hidden'){fx.raf=requestAnimationFrame(paint);return;}
    const interval=mobileViewport13()?1000/24:1000/30;
    if(now-fx.lastFrame<interval){fx.raf=requestAnimationFrame(paint);return;}
    fx.lastFrame=now;fx.elapsed=fx.skip?1e9:Math.max(0,now-fx.start);
    const clock=now/1000;
    if(receipt)updateFusionResult20();
    const a=receipt?.sources[0]||fusionCurrentPet20('main'),b=receipt?.sources[1]||fusionCurrentPet20('sub');
    for(const [role,pet]of [['main',a],['sub',b]]){
      const cv=root.querySelector('#fusionPetCanvas20-'+role);
      if(cv&&pet){const ctx=fusionCanvas20(cv,280,150);if(ctx)drawFusionModel20(ctx,pet,140,145,.8,clock+(role==='sub'?.7:0));}
    }
    const arena=root.querySelector('#fusionCanvas20');
    if(arena){const ctx=fusionCanvas20(arena,640,300);if(ctx)drawFusionScene20(ctx,{a,b,receipt,elapsed:fx.elapsed,duration:fusionDuration20(receipt?.result?.quality??a?.quality??0,receipt?.success??true,fusionReduced20())},clock);}
    // End expensive ceremony bursts; a calm, throttled creature idle remains after the result.
    if(receipt&&fx.phase==='result'&&fx.elapsed>6000)fx.lastFrame=now+90;
    fx.raf=requestAnimationFrame(paint);
  };
  fusionFx20.raf=requestAnimationFrame(paint);
}
