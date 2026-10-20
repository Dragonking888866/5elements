'use strict';

// Preserve the authoritative probability before optional single-player/lab overrides.
const probabilityBeforeTrace20 = probability10;
probability10 = function(...args) {
  const p = probabilityBeforeTrace20(...args);
  return {...p, naturalSuccess20:p.success, naturalCap20:p.cap};
};

const petPreviewBefore20 = petFusionPreview10;
petFusionPreview10 = function(a, b, mode='upgrade') {
  const p = petPreviewBefore20(a,b,mode);
  const reason = !a || !b ? '请选择主灵宠和副灵宠。'
    : a.id === b.id ? '主宠与副宠必须是两个不同个体。'
    : quality8(a) !== quality8(b) ? '品质不同，无法融合！'
    : quality8(a) >= RULES10.pet.maxQuality ? '已达极其稀有品质，不能继续普通融合。'
    : [a,b].some(pet=>pet.locked10 || pet.favorite10) ? '灵宠已锁定或收藏，请先解除保护。'
    : !['upgrade','mutation'].includes(mode) ? '请选择有效的合契方式。' : p.reason;
  const base = RULES10.pet.base[p.quality] || 0;
  const natural = p.naturalSuccess20 ?? clamp(p.base*p.luckyFactor+p.otherBonus,0,p.cap);
  const god = p.godstone17 ? Math.max(natural,RULES17.divine.floor) : natural;
  const luck = p.base*(p.luckyFactor-1);
  const breakdown20 = {
    base, relation:p.base-base, luck, phase:p.phaseBonus||0, pity:p.pity||0,
    cap:natural-(p.base+luck+(p.phaseBonus||0)+(p.pity||0)),
    godstone:god-natural, experience:p.success-god,
    natural, final:p.success
  };
  return {...p, valid:p.valid && !reason, reason, breakdown20};
};
fusionOdds = petFusionPreview10;

const fusePetsBefore20 = fusePets;
fusePets = function(idA,idB,source=cryptoRoll10,mode='upgrade',request) {
  if (!S) return null;
  const a=S.pets.find(p=>p.id===idA), b=S.pets.find(p=>p.id===idB);
  if (!petFusionPreview10(a,b,mode).valid) return null;
  return fusePetsBefore20(idA,idB,source,mode,request);
};

const FUSION_POWER_KEYS20 = ['hp','atk','int','armor','all','speed','crit'];
function fusionSnapshot20(p) {
  if (!p) return null;
  const power=petPower10(p);
  return {
    id:p.id, type:p.type, quality:quality8(p), lv:p.lv, element:petElement10(p),
    score:petScore10(p), power:Object.fromEntries(FUSION_POWER_KEYS20.map(k=>[k,power[k]||0])),
    skills:petSkills10(p)
  };
}

// Called inside the existing transaction, before its validation and durable save.
function recordFusionReceipt20(a,b,pet,odds,success,mode,consumed) {
  const free=resourceFree17();
  const receipt={
    version:1, at:Date.now(), success, hero:S.active, mode,
    sources:[fusionSnapshot20(a),fusionSnapshot20(b)], result:fusionSnapshot20(pet),
    cost:free?0:odds.cost, consumed:free?[]:consumed.slice(),
    successRate:odds.success, free, world:S.worldId10
  };
  S.lastFusion20=receipt;
  return clone10(receipt);
}

function fusionSnapshotValid20(p) {
  return !!p && int10(p.id,1,1e9) && int10(p.type,0,PETS.length-1)
    && int10(p.quality,0,6) && int10(p.lv,1,150) && int10(p.element,0,4)
    && finite10(p.score,0,1e9) && p.power && !Array.isArray(p.power)
    && Object.keys(p.power).length===FUSION_POWER_KEYS20.length
    && FUSION_POWER_KEYS20.every(k=>finite10(p.power[k],0,1e9))
    && Array.isArray(p.skills) && p.skills.length<=8
    && new Set(p.skills).size===p.skills.length
    && p.skills.every(s=>typeof s==='string' && s.length<=60);
}
function fusionReceiptValid20(r,world) {
  if (r === undefined || r === null) return true;
  if (!r || r.version!==1 || !finite10(r.at,0,1e14) || typeof r.success!=='boolean'
    || !int10(r.hero,0,4) || !['upgrade','mutation'].includes(r.mode) || r.world!==world
    || !int10(r.cost,0,1e9) || !finite10(r.successRate,0,1) || typeof r.free!=='boolean'
    || !Array.isArray(r.sources) || r.sources.length!==2 || !r.sources.every(fusionSnapshotValid20)
    || r.sources[0].id===r.sources[1].id || r.sources[0].quality!==r.sources[1].quality
    || r.sources[0].quality>=6 || !Array.isArray(r.consumed) || r.consumed.length>2
    || new Set(r.consumed).size!==r.consumed.length
    || r.consumed.some(id=>!r.sources.some(p=>p.id===id))) return false;
  if (r.free && (r.cost || r.consumed.length)) return false;
  if (!r.free && (r.consumed.length!==(r.success?2:1)
    || !r.consumed.includes(r.sources[1].id)
    || r.success && !r.consumed.includes(r.sources[0].id))) return false;
  return r.success ? fusionSnapshotValid20(r.result) && r.result.quality===r.sources[0].quality+1
    && (r.mode!=='upgrade' || r.result.id===r.sources[0].id && r.result.type===r.sources[0].type)
    : r.result===null;
}
const validateBeforeFusion20=validateSave;
validateSave=function(v) {
  return validateBeforeFusion20(v) && fusionReceiptValid20(v.lastFusion20,v.worldId10);
};

function fusionRateTone20(rate) {
  return rate>=.8?'high':rate>=.5?'good':rate>=.2?'risk':'low';
}
function fusionDuration20(q,success=true,reduced=false) {
  if (reduced) return 160;
  return success ? [1600,1800,2100,2500,3200,3800,4400][clamp(q,0,6)] : 2100;
}
function fusionPhase20(elapsed,duration) {
  const t=clamp(elapsed/Math.max(1,duration),0,1);
  return t<.35?'charge':t<.61?'converge':t<.79?'reveal':'result';
}
function fusionProjected20(a,b,p) {
  if (!a || !b || a.id===b.id || quality8(a)!==quality8(b) || quality8(a)>=6) return null;
  const pool=p.mode==='upgrade'?[a.type]:mutationPool10(a,b,p.targetQuality);
  const possibilities=pool.map(type=>fusionSnapshot20(buildFusionPet10(a,b,p,type,p.mode)));
  if (!possibilities.length) return null;
  return {
    possibilities, sample:possibilities[0],
    power:Object.fromEntries(FUSION_POWER_KEYS20.map(key=>[key,{
      min:Math.min(...possibilities.map(p=>p.power[key])),
      max:Math.max(...possibilities.map(p=>p.power[key]))
    }])),
    score:{min:Math.min(...possibilities.map(p=>p.score)),max:Math.max(...possibilities.map(p=>p.score))},
    guaranteedSkills:possibilities[0].skills.filter(s=>possibilities.every(p=>p.skills.includes(s)))
  };
}
