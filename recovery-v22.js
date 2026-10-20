'use strict';
// One durable transaction path for every versioned subsystem. No validation is disabled.
let operationError22=null,persistExpectation22=null,persistFailure22=null;
const diagnostics22=[];
const ERRORS22={busy:'上一笔操作仍在结算，请稍候。',stale:'另一标签页已保存更新。请在菜单「存档诊断」载入最新进度后重试。',quote:'预览已经变化，请重新确认。',duplicate:'这笔操作已结算，请勿重复提交。',validation:'存档数据校验未通过，请打开「存档诊断」查看具体模块。',quota:'浏览器存储空间不足，请先导出存档，再释放本网站存储空间。',storage:'浏览器禁止或无法写入存档，请检查网站存储权限并导出进度。',verify:'存档回读不一致，尚不能确认结算，请导出当前进度并重新载入。',condition:'材料、金币、容量或配方条件已变化，请重新查看预览。',random:'随机数生成失败，请重试。'};
function error22(code,kind,detail='',retained=true){operationError22={code,kind,detail:String(detail).slice(0,180),retained};const row={at:Date.now(),code,kind,revision:S?.revision10??0,detail:operationError22.detail};diagnostics22.unshift(row);diagnostics22.length=Math.min(40,diagnostics22.length);console.warn('[五行战记结算]',JSON.stringify(row));return false}
function operationMessage22(){const e=operationError22;if(!e)return '操作条件已变化，请重新选择材料。';return (e.code==='condition'&&e.detail&&e.detail!=='preconditions'?e.detail:ERRORS22[e.code]||ERRORS22.condition)+(e.detail&&e.code==='validation'?' 模块：'+e.detail:'')+(e.retained?' 本次未扣除资源。':' 请先保留并导出当前存档。')}
function storageCode22(e){return e?.name==='QuotaExceededError'||e?.code===22||e?.code===1014?'quota':'storage'}
function validationPath22(v){const layers=[['角色/基础库存',originalValidate],['五行/移动命令',validateBeforeSystems10],['永久成长/物品',validateBefore17],['七品质/资源',validateBefore18],['职业天赋/支援',validBefore19],['关卡/灵宠融合记录',validateBeforeGems21],['宝石品质/熔炼记录',typeof validateBeforeCodes16==='function'?validateBeforeCodes16:validateBefore22]];for(const[name,fn]of layers)try{if(!fn(v))return name}catch{return name}return '口令档或版本结构'}
function persistSave22(announce=false){
 persistFailure22=null;if(!S)return false;let text,previous;
 try{if(!validateSave(S)){persistFailure22='validation';error22('validation','save',validationPath22(S),true);return false}text=JSON.stringify(S);previous=localStorage.getItem(SAVE_KEY);
  if(persistExpectation22&&persistExpectation22.key===SAVE_KEY&&previous!==persistExpectation22.raw){persistFailure22='stale';error22('stale','save','revision changed',true);return false}
  // localStorage replaces a single key atomically. Keep the previous valid snapshot separately.
  if(previous&&previous!==text){let prior;try{prior=JSON.parse(previous)}catch{}if(prior&&validateSave(prior))localStorage.setItem(SAVE_KEY+':backup22',previous)}
  localStorage.setItem(SAVE_KEY,text);
  if(localStorage.getItem(SAVE_KEY)!==text){persistFailure22='verify';error22('verify','save','read-back mismatch',false);return false}
  notice='已核验保存';if(announce)logMessage('进度已保存并回读核验。');return true;
 }catch(e){persistFailure22=storageCode22(e);let retained=false;try{retained=localStorage.getItem(SAVE_KEY)===previous}catch{}error22(persistFailure22,'save',e?.name||'StorageError',retained);notice=operationMessage22();if(announce)logMessage(notice);return false}
}
function atomicOperation22(kind,request,operation){
 operationError22=null;if(!S||busy10)return error22('busy',kind);
 let disk;try{disk=localStorage.getItem(SAVE_KEY)}catch(e){return error22(storageCode22(e),kind,e.name)}
 if(!diskMatches10()) {staleMessage10();return error22('stale',kind,'world or revision changed')}
 staleSave10=false;
 const token=request?.token||quote10().token;
 if(typeof token!=='string'||token.length>100||S.receipts10.includes(token))return error22('duplicate',kind);
 if(request?.revision!==undefined&&request.revision!==S.revision10)return error22('quote',kind);
 const before=clone10(S),runtime=actors.map(a=>clone10(a)),supports=clone10(recruitActors18),flags=typeof codeFlags16==='function'?codeFlags16():null;
 busy10=true;persistExpectation22={key:SAVE_KEY,raw:disk};let result,committed=false;
 try{
  if(!validateSave(S))throw Object.assign(Error(validationPath22(S)),{code22:'validation'});
  result=operation();if(!result)throw Object.assign(Error(operationError22?.detail||'preconditions'),{code22:operationError22?.code||'condition'});
  if(!validateSave(S))throw Object.assign(Error(validationPath22(S)),{code22:'validation'});
  S.revision10++;S.receipts10.unshift(token);S.receipts10=S.receipts10.slice(0,160);invalidateLuck10();
  const written=saveGame(false),saved=persistedSystems10();
  if(written===false||!saved||saved.worldId10!==S.worldId10||saved.revision10!==S.revision10)throw Object.assign(Error('durable save failed'),{code22:persistFailure22||'verify'});
  committed=true;
 }catch(e){
  const priorError=operationError22;let retained=true;
  // Never overwrite a newer tab. A successful write is not reported as an uncommitted rollback.
  try{const raw=localStorage.getItem(SAVE_KEY);if(raw!==disk&&raw!==null){const next=JSON.parse(raw);if(next.worldId10===S.worldId10&&next.revision10===S.revision10&&next.receipts10?.includes(token)){S=next;committed=true}else if(raw!==disk)retained=false}}catch{retained=false}
  if(!committed){S=before;for(let n=0;n<actors.length;n++){for(const key of Object.keys(actors[n]))delete actors[n][key];Object.assign(actors[n],runtime[n])}recruitActors18=supports;if(flags&&typeof codeState16!=='undefined')Object.assign(codeState16,flags);invalidateLuck10();error22(e.code22||'condition',kind,priorError?.detail||e.message,retained);logMessage(operationMessage22());return false}
 }finally{busy10=false;persistExpectation22=null}
 // Presentation failures after durable commit must never roll back or re-charge the transaction.
 if(committed){for(const a of actors){a.hp=Math.min(a.hp,stats(a.i).hp);a.mp=Math.min(a.mp,stats(a.i).mp)}try{refreshBars()}catch(e){console.warn('[五行战记界面刷新]',e.name)}return result||true}return false;
}
const talentBudgetBefore22=talentBudget18;
talentBudget18=h=>Math.min(100,Math.max(talentBudgetBefore22(h),h.talentEarned22||0));
function migrate22(data){
 const v=migrate19(migrateGems21(migrateSystems10(data)));const notes=[];
 for(const h of v.heroes){if(h.talent23){h.talentEarned22=h.talent23.earned;continue}const earned=Math.max(talentBudgetBefore22(h),(h.tree18||[]).reduce((a,b)=>a+b,0),h.talentEarned22||0);h.talentEarned22=earned}
 if(v.systems22!==1){
  for(const gem of allStoredGems21(v))if(gemValidBefore21(gem)&&!gem.heritage21&&gem.level!==GEM_RULES21.codec[gem.quality]){gem.heritage21=gem.quality+1;gem.quality=Math.max(gem.quality,legacyGemQuality21(gem.level));notes.push('旧入口宝石编码兼容')}
  // Invalid historical presentation receipts are archived, never used to recreate or delete items.
  if(!fusionReceiptValid20(v.lastFusion20,v.worldId10)){v.receiptArchive22??={};v.receiptArchive22.pet=v.lastFusion20;v.lastFusion20=null;notes.push('灵宠历史记录归档')}
  if(!gemReceiptValid21(v.lastGemForge21,v.worldId10)){v.receiptArchive22??={};v.receiptArchive22.gem=v.lastGemForge21;v.lastGemForge21=null;notes.push('宝石历史记录归档')}
  v.systems22=1;v.migration22={at:Date.now(),notes:[...new Set(notes)]};
 }
 v.difficulty22??='normal';v.bossClaims22??=[];return v;
}
const validateBefore22=validateSave;
validateSave=function(v){try{if(!validateBefore22(v)){if(!v||v.systems22!==undefined)return false;const candidate=migrate22(v);if(!validateBefore22(candidate))return false;return candidate.heroes.every(h=>int10(h.talentEarned22,0,100))}if(v.systems22===undefined)return true;return v.systems22===1&&['normal','hard','nightmare'].includes(v.difficulty22)&&v.heroes.every(h=>int10(h.talentEarned22,0,100))&&Array.isArray(v.bossClaims22)&&v.bossClaims22.length<=120&&new Set(v.bossClaims22).size===v.bossClaims22.length&&v.bossClaims22.every(k=>/^(normal|hard|nightmare):(?:[0-9]|10):[\w-]{1,60}$/.test(k))}catch{return false}};
const freshBefore22=fresh;fresh=function(...args){return migrate22(freshBefore22(...args))};
const beginBefore22=begin;begin=function(data){const next=migrate22(data);if(!validateSave(next))throw Error('存档不能通过校验：'+validationPath22(next)+'；原文件未修改。');const r=beginBefore22(next);operationError22=null;return r};
const saveBaseBefore22=saveGame;
saveGame=function(...args){const before=S?.revision10;const r=saveBaseBefore22(...args);if(r===false&&S&&before!==undefined)S.revision10=before;return r};
const readBefore22=readSave;
readSave=function(){const direct=readBefore22();if(direct)return direct;for(const key of [SAVE_KEY,...Array.from({length:6},(_,n)=>'wuxing-chronicles-v'+(22-n))])for(const suffix of ['',':backup22'])try{const raw=localStorage.getItem(key+suffix);if(!raw)continue;const v=migrate22(JSON.parse(raw));if(validateSave(v))return v}catch{}return null};
function saveDiagnosticsPanel22(){panelContext7={key:'diagnostics22',args:[]};const e=operationError22;showDialog(panelHead('存档诊断与安全恢复')+`<p>本游戏使用本浏览器的单机存档；没有服务器同步。普通档与口令档分开保存。</p><p class="diagnostic-status22">${escapeHTML(e?operationMessage22():'当前存档'+(validateSave(S)?'校验通过':'需要检查')+' · 版本 '+S.revision10)}</p><div class="actions"><button id="exportCurrent22">导出当前进度</button><button id="reloadLatest22">载入本档最新保存</button><button id="recoverBackup22">从本档上次有效保存恢复</button></div><p>载入前会保留当前进度副本；上次保存可能落后一次操作。跨标签页冲突时请保留一个游戏标签。</p><div class="diagnostic-log22">${diagnostics22.map(row=>`<p>${escapeHTML(row.kind)} · ${escapeHTML(row.code)} · rev ${row.revision}<br>${escapeHTML(row.detail)}</p>`).join('')||'<p>本次会话没有结算错误。</p>'}</div><p id="recoveryStatus22" role="status"></p>`);$('#exportCurrent22').onclick=()=>exportSave(S);const restore=backup=>{try{const raw=localStorage.getItem(SAVE_KEY+(backup?':backup22':'')),data=raw&&migrate22(JSON.parse(raw));if(!data||!validateSave(data))throw Error('所选保存未通过校验');localStorage.setItem(SAVE_KEY+':before-recovery22',JSON.stringify(S));begin(data);closeAllWindows19();logMessage('已载入核验后的进度；恢复前副本已保留。')}catch(e){$('#recoveryStatus22').textContent='未恢复：'+e.message}};$('#reloadLatest22').onclick=()=>restore(false);$('#recoverBackup22').onclick=()=>restore(true)}
panelTargets7.diagnostics22=saveDiagnosticsPanel22;
const menuBefore22=realmMenuPanel;realmMenuPanel=function(){menuBefore22();$('#dialog').insertAdjacentHTML('beforeend','<div class="actions"><button id="diagnostics22">存档诊断 / 安全恢复</button><button id="difficulty22">Boss 难度</button></div>');$('#diagnostics22').onclick=saveDiagnosticsPanel22;$('#difficulty22').onclick=difficultyPanel22};
$('#realmMenu').onclick=realmMenuPanel;$('#menuBtn').onclick=realmMenuPanel;
const fusePetChecked22=fusePets;fusePets=function(a,b,source=cryptoRoll10,mode='upgrade',request){const p=petFusionPreview10(S.pets.find(p=>p.id===a),S.pets.find(p=>p.id===b),mode);if(!p.valid){error22('condition','pet-fusion',p.reason);return null}return fusePetChecked22(a,b,source,mode,request)};
const fuseGemChecked22=fuseGems10;fuseGems10=function(materials,source=cryptoRoll10,request){const p=gemFusionPreview10(materials);if(!p.valid)return error22('condition','gem-fusion',p.reason);return fuseGemChecked22(materials,source,request)};
const divineChecked22=refineDivine17;refineDivine17=function(materials,source=cryptoRoll10,request){const p=divinePreview17(materials);if(!p.valid)return error22('condition','divine-forge21',p.reason);return divineChecked22(materials,source,request)};
const introRecoveryBefore22=intro;intro=function(){introRecoveryBefore22();const h=$('#dialog').querySelector('h2');if(h)h.textContent='五行战记 · 星途初醒 V24';const resume=$('#continue');if(resume)resume.onclick=()=>{const previous=SAVE_KEY;let latest;try{if(typeof executeCode16==='function')SAVE_KEY='wuxing-chronicles-v24';latest=readSave()}finally{SAVE_KEY=previous}if(latest)begin(latest);else logMessage('未找到可核验的存档，请保留原文件并使用导入或备份恢复。')}};
// New UI controls must join the same cross-tab Web Lock as legacy equipment controls.
document.addEventListener('click',event=>{if(replayLockedClick10||!navigator.locks?.request)return;const b=event.target?.closest?.('button');if(!b)return;const ids=['fusionBegin20','gemForgeBegin21','divineBegin21','socketCommit21','socketRemove21','smithDo17','recommend22','resetPoints22','resetTalents23','gemBuy21','repeatQuest18'];const targeted=ids.includes(b.id)||['point22','talent22','gemBuy19','deploy18','buy18','quest18','difficulty22'].some(k=>b.dataset[k]!==undefined);if(!targeted)return;event.preventDefault();event.stopImmediatePropagation();navigator.locks.request('wuxing-v10-save',{mode:'exclusive'},()=>{if(!b.isConnected)return;if(!diskMatches10()){error22('stale','ui-lock22');logMessage(operationMessage22());let line=$('#dialog').querySelector('#operationNotice22');if(!line){line=document.createElement('p');line.id='operationNotice22';line.className='diagnostic-status22';line.setAttribute('role','status');$('#dialog').appendChild(line)}line.textContent=operationMessage22();return}replayLockedClick10=true;try{b.click()}finally{replayLockedClick10=false}}).catch(e=>{error22('storage','ui-lock22',e.name);logMessage(operationMessage22())})},true);
