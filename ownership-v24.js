'use strict';
// A save has one active page. Compare against the last durable snapshot, never
// against the live revision (transactions advance it before they reach storage).
const checkpoints24=new Map();
let lockDepth24=0,paused24=false,initializing24=false,queuedTick24=false,tickTime24=0,queuedSave24=false,branchCreating24=false;
const isolated24=typeof initSandbox15==='function';
const ownerKey24=key=>'wuxing-owner24:'+key;
function owner24(key=SAVE_KEY){try{return JSON.parse(localStorage.getItem(ownerKey24(key))||'null')}catch{return null}}
function owns24(key=SAVE_KEY){if(isolated24)return true;if(branchCreating24&&key===SAVE_KEY&&!localStorage.getItem(key)&&!owner24(key)){localStorage.setItem(ownerKey24(key),JSON.stringify({session:session10,world:S.worldId10,at:Date.now()}));checkpoints24.set(key,null)}return owner24(key)?.session===session10}
function held24(){return lockDepth24>0||replayLockedClick10}
function locked24(fn){if(isolated24||held24()||!navigator.locks?.request){lockDepth24++;try{return fn()}finally{lockDepth24--}}return navigator.locks.request('wuxing-v10-save',{mode:'exclusive'},()=>{lockDepth24++;try{return fn()}finally{lockDepth24--}})}
function current24(key,world){return !!S&&SAVE_KEY===key&&S.worldId10===world&&owns24(key)&&!paused24}
const matchesBefore24=diskMatches10;
diskMatches10=function(){if(loading10||!S||isolated24)return true;if(!owns24())return false;try{const raw=localStorage.getItem(SAVE_KEY);return checkpoints24.has(SAVE_KEY)?raw===checkpoints24.get(SAVE_KEY):!raw||matchesBefore24()}catch{return false}};
function pauseConflict24(){
 if(!S||initializing24||isolated24)return;staleSave10=true;keys.clear();joystickVector.x=0;joystickVector.y=0;paused24=true;
 notice=owns24()?'保存内容已变化，此页已暂停。可直接在此页载入最新进度。':'此页已暂停：另一页面正在使用此存档。';
 if(menu==='ownership24')return;
 showDialog('<h2>远征已安全暂停</h2><p role="alert">'+notice+'</p><p>暂停页面不会继续自动保存，也不会扣除本次操作的资源。点击下方按钮即可在这里接续最新保存，无需返回标题。</p><div class="actions"><button id="resumeHere24" class="primary">在此页继续最新进度</button><button id="exportPaused24">导出此页进度</button></div><p>同一存档同时由一个页面操作；正常远征和独立口令档分别管理。</p>','ownership24');
 $('#resumeHere24').onclick=()=>locked24(()=>{try{const raw=localStorage.getItem(SAVE_KEY),data=raw&&JSON.parse(raw);if(!data||!validateSave(data))throw Error('最新保存无法校验，请先导出进度。');return begin(data)}catch(e){notice=e.message;logMessage(notice);return false}});
 $('#exportPaused24').onclick=()=>exportSave(S);
}
staleMessage10=pauseConflict24;
ERRORS22.stale='存档已在另一页面更新，此页已暂停。请点击「在此页继续最新进度」，无需返回标题。';
// This final persistence boundary also protects menu/autosaves, not just trades.
const persistBefore24=persistSave22;
persistSave22=function(...args){
 if(isolated24)return persistBefore24(...args);
 if(!initializing24&&!owns24()){persistFailure22='stale';error22('stale','save','inactive page');pauseConflict24();return false}
 const key=SAVE_KEY,previous=persistExpectation22;
 if(!previous&&checkpoints24.has(key))persistExpectation22={key,raw:checkpoints24.get(key)};
 try{const result=persistBefore24(...args);if(result)checkpoints24.set(key,localStorage.getItem(key));return result}finally{persistExpectation22=previous}
};
const initializeBefore24=initializeSession23;
initializeSession23=function(mode,data){
 if(!isolated24&&!held24()&&navigator.locks?.request)return locked24(()=>initializeSession23(mode,data));
 let key=SAVE_KEY;if(typeof executeCode16==='function')key=data?.codes16?.used?(data.branchStorage17?.replace(/^wuxing-codes-v(?:1[789]|2[0123456789]):/,'wuxing-codes-v29:')||'wuxing-codes-v29:'+encodeURIComponent(data.worldId10)):'wuxing-chronicles-v29';
 let oldOwner,oldCheckpoint,claimed=false;
 try{
  oldOwner=localStorage.getItem(ownerKey24(key));oldCheckpoint=checkpoints24.get(key);
  const raw=localStorage.getItem(key);
  // Continue reads under the write lock, even when the title was opened earlier.
  if(mode==='CONTINUE_GAME'&&raw){const latest=JSON.parse(raw);if(validateSave(latest))data=latest}
  if(!isolated24){localStorage.setItem(ownerKey24(key),JSON.stringify({session:session10,world:data?.worldId10,at:Date.now()}));claimed=true}
  checkpoints24.set(key,raw);initializing24=true;paused24=false;
  const ok=initializeBefore24(mode,data);
  if(!ok)throw Error(session23.error||'初始化未完成');
  return true;
 }catch(e){
  paused24=false;
  if(claimed&&owns24(key)){try{if(oldOwner)localStorage.setItem(ownerKey24(key),oldOwner);else localStorage.removeItem(ownerKey24(key))}catch{}}
  if(oldCheckpoint===undefined)checkpoints24.delete(key);else checkpoints24.set(key,oldCheckpoint);
  if(session23.phase!=='failed'){session23.ready=false;session23.phase='failed';session23.error=e.message;showDialog('<h2>未能接续远征</h2><p>'+escapeHTML(e.message)+'</p><button id="retrySession23">重新初始化本次远征</button>','initialization23');$('#retrySession23').onclick=()=>initializeSession23(mode,data)}
  return false;
 }finally{initializing24=false}
};
const saveBefore24=saveGame;
saveGame=function(...args){
 if(isolated24||initializing24||initDepth23||rewardDepth23)return saveBefore24(...args);
 if(!S||!owns24()||paused24){if(S&&session23.ready)pauseConflict24();return false}
 if(!held24()&&!busy10&&navigator.locks?.request){
  const key=SAVE_KEY,world=S.worldId10;if(!queuedSave24){queuedSave24=true;locked24(()=>{queuedSave24=false;if(current24(key,world))saveGame(...args)}).catch(e=>{queuedSave24=false;error22('storage','queued-save24',e.name)})}
  return false;
 }
 return saveBefore24(...args);
};
const atomicBefore24=atomicOperation22;
atomicOperation22=function(...args){if(!isolated24&&(!owns24()||paused24)){pauseConflict24();return error22('stale',args[0],'inactive page')}return atomicBefore24(...args)};
// New command branches start empty, while the original normal snapshot remains
// untouched. Register each branch independently instead of sharing a page lockout.
if(typeof executeCode16==='function'){
 const codeBefore24=executeCode16;executeCode16=function(raw){
  const command=String(raw).trim().toLowerCase();if(!['help','/help','帮助','/status'].includes(command)&&(!owns24()||paused24))return {ok:false,text:'此页已暂停，请先在此页继续最新进度。'};
  const originalKey=SAVE_KEY,before=localStorage.getItem(originalKey);let r;
  try{branchCreating24=true;r=codeBefore24(raw);return r}finally{branchCreating24=false;if(SAVE_KEY!==originalKey){if(!localStorage.getItem(ownerKey24(SAVE_KEY)))localStorage.setItem(ownerKey24(SAVE_KEY),JSON.stringify({session:session10,world:S.worldId10,at:Date.now()}));checkpoints24.set(SAVE_KEY,localStorage.getItem(SAVE_KEY));if(localStorage.getItem(originalKey)!==before)checkpoints24.set(originalKey,localStorage.getItem(originalKey))}}
 };
}
// The economy code can create a new branch within a transaction. Only an empty,
// new branch may be claimed here; existing saves always require explicit Continue.
function discardBranch24(key,previous){if(key!==previous&&!localStorage.getItem(key)&&owner24(key)?.session===session10){localStorage.removeItem(ownerKey24(key));checkpoints24.delete(key)}}
const matchOwned24=diskMatches10;
diskMatches10=function(){if(!isolated24&&S?.codes16?.used&&!owns24()&&!localStorage.getItem(SAVE_KEY)&&!owner24()){localStorage.setItem(ownerKey24(SAVE_KEY),JSON.stringify({session:session10,world:S.worldId10,at:Date.now()}));checkpoints24.set(SAVE_KEY,null)}return matchOwned24()};
// Run simulation mutations/rewards under the same lock as menu transactions.
// Rendering remains on requestAnimationFrame; coalesce a delayed tick to 100ms.
const updateBefore24=update;
update=function(dt){
 if(!S||menu||isolated24)return updateBefore24(dt);
 if(!owns24()||paused24){pauseConflict24();return}
 if(held24()||!navigator.locks?.request)return updateBefore24(dt);
 tickTime24=Math.min(.1,tickTime24+dt);if(queuedTick24)return;
 const key=SAVE_KEY,world=S.worldId10;queuedTick24=true;
 locked24(()=>{queuedTick24=false;const elapsed=tickTime24;tickTime24=0;if(current24(key,world)&&!menu)updateBefore24(elapsed)}).catch(e=>{queuedTick24=false;tickTime24=0;error22('storage','simulation24',e.name)});
};
// A chest can also be activated by touching the map, outside the simulation tick.
const treasureBefore24=openTreasure11;const pendingChests24=new Set();
openTreasure11=function(id,request){if(isolated24||held24()||!navigator.locks?.request)return treasureBefore24(id,request);if(pendingChests24.has(id))return false;const key=SAVE_KEY,world=S?.worldId10;pendingChests24.add(id);return locked24(()=>current24(key,world)&&treasureBefore24(id,request)).finally(()=>pendingChests24.delete(id))};
// Start/continue, codes, panel closing and manual saves use the same write queue.
document.addEventListener('click',event=>{if(isolated24||held24()||!navigator.locks?.request)return;const b=event.target?.closest?.('button');if(!b||b.disabled)return;event.preventDefault();event.stopImmediatePropagation();locked24(()=>{if(b.isConnected!==false)b.click()}).catch(e=>{error22('storage','ui24',e.name);logMessage(operationMessage22())})},true);
window.addEventListener('storage',e=>{if(!S||isolated24||initializing24)return;if(e.key===ownerKey24()&&!owns24()||e.key===SAVE_KEY&&!diskMatches10())pauseConflict24()});
// Do not lose a save on mobile backgrounding. The owner/snapshot checks still
// apply; returning to a superseded page opens the same-page handoff immediately.
window.addEventListener('focus',()=>{if(S&&session23.ready&&!owns24())pauseConflict24()});

if(window.receiveNativeSave)window.receiveNativeSave=async function(text){try{const data=prepareImport25(JSON.parse(text));if(S)localStorage.setItem(SAVE_KEY+":before-native24",JSON.stringify(S));if(await begin(data)){closeAllWindows19();logMessage("已导入并核验存档。")}}catch{logMessage("存档格式无效，当前进度未被替换。")}};
