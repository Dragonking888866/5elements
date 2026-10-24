'use strict';
// Reusable, resolution-bounded layers replace hundreds of immediate translucent primitives per frame.
const FX_ATLASES39={fire:'assets/fx-dragonfire-v39.png',water:'assets/fx-ocean-v39.png',ice:'assets/fx-glacier-v39.png',wind:'assets/fx-cyclone-v39.png',claw:'assets/fx-claw-v39.png',bell:'assets/fx-bell-v39.png',tree:'assets/fx-tree-v39.png',earth:'assets/fx-earth-v39.png',chaos:'assets/fx-chaos-v39.png'};
const SCENE_ATLAS39={claw:'claw',bell:'bell',tree:'tree',grove:'tree',mountains:'earth',shards:'earth',chaos:'chaos'};
function atlasNames39(spec){return [...new Set([spec.family,SCENE_ATLAS39[spec.scene],spec.scene==='ocean'?'wind':null].filter(k=>FX_ATLASES39[k]))]}
const warmedPetTypes39=new Set();
function warmPetImages39(p){if(!p||warmedPetTypes39.has(p.type))return;warmedPetTypes39.add(p.type);for(const key of atlasNames39(petVisualSpec39(p)))mythImage35(FX_ATLASES39[key])}
const surfacePool39=[],liveSurfaces39=new Map();
const fxMetrics39={frames:0,paints:0,reuses:0,culled:0,paintMs:0,composites:0,peakBytes:0,created:0,returned:0};
const PALETTES39={...PET_PALETTE38,wood:['#123d35','#3e9872','#9fe6b0','#edffd4']};
let detailLatch39=false;
function budget39(f){
 const mobile=fxMobile38(),requested=Math.max(0,FX_QUALITY15.indexOf(fxPrefs15.quality));
 if(fpsWindow11.fps>0&&fpsWindow11.fps<25)detailLatch39=true;else if(fpsWindow11.fps>36)detailLatch39=false;
 const quality=Math.min(requested,S?.fxQuality==='low'?0:3,fxPrefs15.adaptive!==false&&detailLatch39?1:3);
 const rank=petFx.filter(x=>x.cast39&&x.t>0).sort((a,b)=>(b.i15===S.active)-(a.i15===S.active)||b.q15-a.q15).indexOf(f);
 const primary=rank<(mobile?1:2),detail=primary?Math.min(quality,mobile?1:3):0;
 return{primary,mobile,detail,rate:primary?(mobile?18:24):10,resolution:primary?(mobile?448:640):320,
  motes:primary?[7,12,18,24][detail]:5,alpha:(primary?1:.62)*Math.min(.72,fxPrefs15.opacity+.12)};
}
function composition39(f,c){
 const s=f.spec39,fit=Math.max(.52,Math.min(1,VW/1280*1.23,VH/720*1.35))*Math.sqrt(fxPrefs15.intensity);
 const W=s.w*fit,H=s.h*fit;
 return{x:c.x-W*.55,y:c.y-H*.86,w:W*1.1,h:H*1.16,W,H,cx:c.x,cy:c.y,fit};
}
function acquireSurface39(f,bounds,b){
 sweepSurfaces39();
 let layer=liveSurfaces39.get(f);
 if(!layer){const cv=surfacePool39.pop()||document.createElement('canvas');layer={canvas:cv,ctx:cv.getContext('2d'),key:null};liveSurfaces39.set(f,layer);fxMetrics39.created++}
 const W=Math.max(64,Math.round(Math.min(b.resolution,bounds.w))),H=Math.max(64,Math.round(W*bounds.h/bounds.w));
 if(layer.canvas.width!==W||layer.canvas.height!==H){layer.canvas.width=W;layer.canvas.height=H;layer.key=null}
 layer.bounds=bounds;layer.scale=W/bounds.w;return layer;
}
function releaseSurface39(f){const layer=liveSurfaces39.get(f);if(!layer)return;liveSurfaces39.delete(f);layer.key=null;if(surfacePool39.length<8)surfacePool39.push(layer.canvas);fxMetrics39.returned++}
const recycleBefore39=recycleCast15;recycleCast15=function(f){releaseSurface39(f);return recycleBefore39(f)};
function sweepSurfaces39(){for(const f of liveSurfaces39.keys())if(!petFx.includes(f)||f.t<=0||!S||!castValid38(f.token15))releaseSurface39(f)}
function alpha39(c,a,fn){c.save();c.globalAlpha*=clamp(a,0,1);fn();c.restore()}
function ellipse39(c,x,y,rx,ry,color,rotation=0){c.fillStyle=color;c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rotation,0,Math.PI*2);c.fill()}
function path39(c,points,color,width=1,fill=false){c.beginPath();points.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));if(fill){c.closePath();c.fillStyle=color;c.fill()}else{c.strokeStyle=color;c.lineWidth=width;c.stroke()}}
function ring39(c,x,y,rx,ry,color,width=1,start=0,end=Math.PI*2){c.beginPath();c.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),0,start,end);c.strokeStyle=color;c.lineWidth=width;c.stroke()}
function imageReady39(im){return im.complete&&im.naturalWidth>0}
function atlas39(c,kind,frame,x,y,w,h,alpha=1,rotation=0){
 const im=mythImage35(FX_ATLASES39[kind]);if(!imageReady39(im))return false;
 const col=clamp(Math.floor(frame),0,15)%4,row=Math.floor(clamp(Math.floor(frame),0,15)/4),sw=im.naturalWidth/4,sh=im.naturalHeight/4;
 c.save();c.translate(x,y);c.rotate(rotation);c.globalAlpha*=alpha;c.drawImage(im,col*sw,row*sh,sw,sh,-w*.5,-h*.5,w,h);c.restore();return true;
}
function atlasFrame39(f,loop=true){
 const t=f.age15-f.windup15;if(t<0)return 0;
 if(t<f.travel15)return Math.min(3,Math.floor(t/f.travel15*4));
 const after=t-f.travel15;if(after<f.profile15.sustain)return 4+Math.floor(after*(motionPrefs34.reduced?5:11))%8;
 return loop?12+clamp(Math.floor((after-f.profile15.sustain)/f.profile15.tail*4),0,3):11;
}
function ghost39(c,type,x,y,height,t,alpha=.22,row=3){
 const d=ultimatePet35(type);if(!d)return;const im=mythImage35(d.art);if(!imageReady39(im))return;
 const frame=Math.floor(t*5)%4,sw=im.naturalWidth/4,sh=im.naturalHeight/4,sy=d.atlasRows36?d.atlasRows36[row]/1254*im.naturalHeight:sh*row,
  ey=d.atlasRows36?d.atlasRows36[row+1]/1254*im.naturalHeight:sy+sh,fh=ey-sy,w=height*sw/sh;
 alpha39(c,alpha,()=>c.drawImage(im,frame*sw,sy,sw,fh,x-w/2,y-height+(sh-fh)*height/sh,w,fh*height/sh));
}

const beginBeforeFX39=begin;begin=function(...args){const result=beginBeforeFX39(...args);const warm=()=>{if(S)for(const h of S.heroes)warmPetImages39(S.pets.find(p=>p.id===h.pet))};if(result&&typeof result.then==='function')result.then(warm);else if(result)warm();return result};

