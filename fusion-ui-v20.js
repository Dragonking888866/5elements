'use strict';

let fusionChoice20={main:null,sub:null,mode:'upgrade'};
let fusionPicker20={role:'main',query:'',quality:-1,move:'all',page:0};
let fusionScreen20=null, fusionMessage20='';
const fusionHead20=title=>`<div class="fusion-panel-head20"><div><small>灵契整备 · 远征已暂停</small><h2>${title}</h2></div><button data-close>返回 / Esc</button></div>`;
const fusionName20=p=>p?PETS[p.type].name:'未选择灵宠';
const fusionNum20=n=>Number(n||0).toLocaleString('zh-CN',{maximumFractionDigits:1});
const fusionPct20=n=>(n*100).toFixed(2)+'%';
const fusionSigned20=n=>(n>=0?'+':'')+(n*100).toFixed(2)+' 个百分点';
function fusionCurrentPet20(role){const p=S?.pets.find(p=>p.id===fusionChoice20[role]);return p?fusionSnapshot20(p):null}
function fusionSkill20(p){return PETS[p.type].ability==='breath'?'五行喷息':PETS[p.type].ability==='pulse'?'灵息波动':PETS[p.type].flight?'俯冲扑击':'迅猛扑击'}
function chooseDefaults20(){
  const pets=S.pets.filter(p=>!p.locked10&&!p.favorite10).slice().sort((a,b)=>quality8(b)-quality8(a)||b.lv-a.lv);
  const counts=new Map();for(const p of pets)counts.set(quality8(p),(counts.get(quality8(p))||0)+1);
  if(!pets.some(p=>p.id===fusionChoice20.main))fusionChoice20.main=(pets.find(p=>quality8(p)<6&&counts.get(quality8(p))>=2)||pets.find(p=>quality8(p)<6)||pets[0])?.id??null;
  const a=pets.find(p=>p.id===fusionChoice20.main);
  if(!pets.some(p=>p.id===fusionChoice20.sub&&p.id!==a?.id))fusionChoice20.sub=pets.find(p=>p.id!==a?.id&&quality8(p)===quality8(a))?.id??null;
}
function fusionPetCard20(p,role){
  const source=role==='main'?'主灵宠':'副灵宠',snap=p?fusionSnapshot20(p):null;
  const owner=p?S.heroes.findIndex(h=>h.pet===p.id):-1;
  return `<article class="fusion-pet-card20 ${p?'':'empty20'}" style="--pet-quality:${QUALITIES8[snap?.quality||0][1]}">
    <div class="fusion-card-head20"><b>${source}</b><small>${p?'#'+p.id:'空的灵契槽'}</small></div>
    <button class="fusion-pet-select20" data-pick-fusion20="${role}" aria-label="选择${source}">
      <canvas id="fusionPetCanvas20-${role}" width="280" height="150" aria-label="${p?escapeHTML(fusionName20(p))+'动态形象':'选择灵宠'}"></canvas>
      <span class="fusion-pet-select-label20">${p?'更换灵宠':'点击选择灵宠'}</span>
    </button>
    <h3>${escapeHTML(fusionName20(p))}</h3>
    ${p?`<p class="fusion-quality20">${qualityBadge8(snap.quality)} <span>Lv.${p.lv}</span> <span>${WX.names[snap.element]}行 · ${PETS[p.type].flight?'飞行':'陆地'}</span></p>
      <b class="fusion-score20">战斗力 ${fusionNum20(snap.score)}</b>
      <div class="fusion-source-stats20"><span>生命 <b>${fusionNum20(snap.power.hp)}</b></span><span>攻击 <b>${fusionNum20(snap.power.atk)}</b></span><span>智力 <b>${fusionNum20(snap.power.int)}</b></span><span>护甲 <b>${fusionNum20(snap.power.armor)}</b></span></div>
      <p class="fusion-skills20">主动：${fusionSkill20(p)}<br>被动：${snap.skills.map(escapeHTML).join('、')||'尚未觉醒'}</p>
      ${owner>=0?`<small class="fusion-owner20">${HEROES[owner].name}的骑宠${role==='sub'?' · 副宠结算后将卸下':''}</small>`:''}`:'<p>同品质的两只不同个体，一级即可融合。</p>'}
  </article>`;
}
function fusionOddsMarkup20(p,legal){
  const tone=fusionRateTone20(p.success),d=p.breakdown20;
  return `<section class="fusion-odds20 ${tone}" aria-label="融合成功率与加成来源">
    <h3>最终融合成功率</h3><strong id="fusionRate20">${legal?fusionPct20(p.success):'—'}</strong>
    <span>${legal?({high:'成功率较高',good:'成功率适中',risk:'请谨慎合契',low:'高风险合契'})[tone]:'请先放入合法的灵契材料'}</span>
    <dl><div><dt>基础成功率</dt><dd>${fusionPct20(d.base)}</dd></div>
      <div><dt>全队共享幸运加成</dt><dd>${fusionSigned20(d.luck)}</dd></div>
      <div><dt>五行神石保底</dt><dd>${p.godstone17?fusionSigned20(d.godstone):'未生效'}</dd></div></dl>
    <details><summary>查看完整概率计算</summary><dl>
      <div><dt>五行${{same:'同源',sheng:'相生',ke:'相克'}[p.relation]}</dt><dd>${fusionSigned20(d.relation)}</dd></div>
      <div><dt>灵时加成</dt><dd>${fusionSigned20(d.phase)}</dd></div><div><dt>失败保护</dt><dd>${fusionSigned20(d.pity)}</dd></div>
      <div><dt>阶段上限修正</dt><dd>${fusionSigned20(d.cap)}</dd></div>
      ${Math.abs(d.experience)>1e-9?`<div><dt>体验模式加成</dt><dd>${fusionSigned20(d.experience)}</dd></div>`:''}
      </dl><p>共享幸运 ${fusionNum20(p.luck)} · ${p.playerCount}位角色<br>幸运倍率 ×${p.luckyFactor.toFixed(4)}${p.godstone17?' · 当前神石主持，至少70%':''}</p></details>
  </section>`;
}
function fusionTargetMarkup20(a,b,p,projected){
  if(!projected)return '<section class="fusion-target20"><h3>品质进化预览</h3><p>放入两只同品质灵宠后，显示下一品质及真实属性收益。</p></section>';
  const before=fusionSnapshot20(a),range=n=>Math.abs(n.max-n.min)<1e-8?fusionNum20(n.min):fusionNum20(n.min)+'—'+fusionNum20(n.max);
  return `<section class="fusion-target20" style="--target-quality:${QUALITIES8[p.targetQuality][1]}">
    <small>成功后的品质</small><h3>${QUALITIES8[p.targetQuality][0]}<span>Lv.${p.level}</span></h3>
    <p>${p.mode==='upgrade'?'保留主宠种族与身份':'异变合体 · '+projected.possibilities.length+'种可能'} · 战力 ${range(projected.score)}</p>
    <table><thead><tr><th>主要属性</th><th>当前主宠</th><th>成功后${p.mode==='mutation'?'范围':''}</th></tr></thead><tbody>
      ${[['hp','生命'],['atk','攻击'],['int','智力'],['armor','护甲']].map(([key,name])=>`<tr><td>${name}</td><td>${fusionNum20(before.power[key])}</td><td>${range(projected.power[key])}</td></tr>`).join('')}
    </tbody></table><p>保证保留／获得：${projected.guaranteedSkills.map(escapeHTML).join('、')||'当前技能传承'}${p.mode==='mutation'?'<br>主动技能随实际新物种确定。':''}</p>
    ${p.mode==='mutation'?`<details><summary>查看可能的新物种</summary><div class="fusion-pool20">${projected.possibilities.map(p=>`<span>${escapeHTML(fusionName20(p))}</span>`).join('')}</div></details>`:''}
  </section>`;
}
function fusionSignature20(a,b,p){return JSON.stringify([S.worldId10,S.revision10,S.active,a?.id,b?.id,p.mode,p.success,p.cost,quality8(a),quality8(b),a?.lv,b?.lv,p.valid])}

function fusionPanel20(){
  if(!S)return;
  chooseDefaults20();characterSheet13=false;
  panelContext7={key:'petFusion20',args:[]};
  const a=S.pets.find(p=>p.id===fusionChoice20.main),b=S.pets.find(p=>p.id===fusionChoice20.sub);
  const p=petFusionPreview10(a,b,fusionChoice20.mode),projected=fusionProjected20(a,b,p);
  const legal=!!a&&!!b&&a.id!==b.id&&quality8(a)===quality8(b)&&quality8(a)<6&&!a.locked10&&!b.locked10&&!a.favorite10&&!b.favorite10;
  fusionScreen20={signature:fusionSignature20(a,b,p),quote:quote10()};
  const free=resourceFree17(),cost=free?0:p.cost;
  showDialog(fusionHead20('万灵合契 · 灵宠进化')+`
    <nav class="fusion-nav20"><button id="fusionBag20">灵宠包裹 ${S.pets.length}/1000</button><button id="fusionHistory20">融合记录</button>${S.lastFusion20?'<button id="fusionLast20">最近结果</button>':''}</nav>
    <div class="fusion-heading20"><div><small>SPIRIT COVENANT</small><h3>同品质相遇，向更高一阶进化</h3></div><div class="fusion-mode20" aria-label="合契方式"><button data-fusion-mode20="upgrade" aria-pressed="${fusionChoice20.mode==='upgrade'}">主宠升品</button><button data-fusion-mode20="mutation" aria-pressed="${fusionChoice20.mode==='mutation'}">异变合体</button></div></div>
    <div class="fusion-mobile-rate20 ${p.valid?fusionRateTone20(p.success):'low invalid20'}" role="status"><span>${p.valid?'最终融合成功率':'融合条件'}</span><strong>${p.valid?fusionPct20(p.success):escapeHTML(p.reason)}</strong></div>
    <div class="fusion-layout20"><section class="fusion-workbench20">
      <div class="fusion-pair20">${fusionPetCard20(a,'main')}<span class="fusion-plus20" aria-hidden="true">＋</span>${fusionPetCard20(b,'sub')}</div>
      <div class="fusion-direction20" aria-hidden="true">↓</div>
      <div id="fusionScene20" class="fusion-scene20 idle20"><canvas id="fusionCanvas20" width="640" height="300" aria-label="动态五行融合魔法阵"></canvas><span class="fusion-scene-caption20">五行聚灵 · 万灵合契</span></div>
    </section><div class="fusion-preview20">
      ${fusionOddsMarkup20(p,legal)}${fusionTargetMarkup20(a,b,p,projected)}
      <section class="fusion-payment20"><h3>本次消耗</h3><p><b>${fusionNum20(cost)}</b> 金币 + 副灵宠</p><small>余额 ${fusionNum20(S.gold)} / 储备 ${fusionNum20(S.goldReserve10)}</small>${free?`<p>体验模式免消耗；标准费用 ${fusionNum20(p.cost)} 金币。</p>`:'<p>失败保留主宠，副宠与本次金币消耗。无额外催化材料。</p>'}</section>
      <p id="fusionWarning20" class="fusion-warning20 ${p.valid?'ready20':''}" role="status">${escapeHTML(p.reason||'材料就绪 · 成功后品质提升一阶')}</p>
      <button id="fusionBegin20" class="primary fusion-begin20" ${p.valid?'':'disabled'}>支付 ${fusionNum20(cost)} 金币并融合</button>
      <p id="fusionMessage20" role="status">${escapeHTML(fusionMessage20)}</p>
    </div></div>`);
  $('#dialog').classList.add('fusion-dialog20');
  for(const button of $('#dialog').querySelectorAll('[data-pick-fusion20]'))button.onclick=()=>fusionPickerPanel20(button.dataset.pickFusion20);
  for(const button of $('#dialog').querySelectorAll('[data-fusion-mode20]'))button.onclick=()=>{fusionChoice20.mode=button.dataset.fusionMode20;fusionMessage20='';fusionPanel20()};
  $('#fusionBag20').onclick=()=>petsPanel();$('#fusionHistory20').onclick=fusionHistoryPanel20;
  if(S.lastFusion20)$('#fusionLast20').onclick=()=>fusionResultPanel20(S.lastFusion20,true);
  $('#fusionBegin20').onclick=startFusion20;
  startFusionFx20();
}

function startFusion20(){
  if(!S||!menu||panelContext7?.key!=='petFusion20'||fusionFx20.receipt)return null;
  const a=S.pets.find(p=>p.id===fusionChoice20.main),b=S.pets.find(p=>p.id===fusionChoice20.sub);
  const p=petFusionPreview10(a,b,fusionChoice20.mode);
  if(!p.valid){fusionMessage20=p.reason;fusionPanel20();return null;}
  if(!fusionScreen20||fusionScreen20.signature!==fusionSignature20(a,b,p)){
    fusionMessage20='材料、主持角色或成功率已变化。预览已更新，请再次确认。';fusionPanel20();return null;
  }
  $('#fusionBegin20').disabled=true;
  const result=fusePets(a.id,b.id,cryptoRoll10,fusionChoice20.mode,fusionScreen20.quote);
  if(!result){fusionMessage20=operationMessage22();fusionPanel20();return null;}
  fusionMessage20='';fusionResultPanel20(result.receipt20);return result;
}

function fusionPickerPanel20(role='main'){
  if(!S||!['main','sub'].includes(role))return;
  fusionPicker20.role=role;panelContext7={key:'fusionPicker20',args:[role]};
  showDialog(fusionHead20('选择'+(role==='main'?'主灵宠':'副灵宠'))+`
    <div class="fusion-picker-filters20"><label>名称<input id="fusionSearch20" placeholder="麒麟、神龙、青牛…" value="${escapeHTML(fusionPicker20.query)}"></label><label>品质<select id="fusionQuality20"><option value="-1">全部品质</option>${QUALITIES8.map((q,i)=>`<option value="${i}">${q[0]}</option>`).join('')}</select></label><label>行动<select id="fusionMove20"><option value="all">空陆全部</option><option value="air">飞行</option><option value="land">陆地</option></select></label></div>
    <p>选择两只同品质、不同个体的灵宠。不同品质仍可查看，但放入后不能执行融合；锁定和收藏的灵宠受到保护。</p><div id="fusionPickerGrid20" class="fusion-picker-grid20"></div>
    <nav class="fusion-picker-pager20"><button id="fusionPrev20">上一页</button><b id="fusionPage20"></b><button id="fusionNext20">下一页</button><button id="fusionPickBack20">返回合契台</button></nav>`);
  $('#dialog').classList.add('fusion-dialog20','fusion-picker-dialog20');
  $('#fusionQuality20').value=String(fusionPicker20.quality);$('#fusionMove20').value=fusionPicker20.move;
  const render=()=>{
    const {query,quality,move}=fusionPicker20;
    const list=S.pets.filter(p=>fusionName20(p).includes(query)&&(quality<0||quality8(p)===quality)&&(move==='all'||(PETS[p.type].flight?'air':'land')===move)).slice().sort((a,b)=>quality8(b)-quality8(a)||b.lv-a.lv||petScore10(b)-petScore10(a));
    const pages=Math.max(1,Math.ceil(list.length/18));fusionPicker20.page=clamp(fusionPicker20.page,0,pages-1);
    $('#fusionPickerGrid20').innerHTML=list.slice(fusionPicker20.page*18,fusionPicker20.page*18+18).map(p=>`<button data-pet-choice20="${p.id}" style="--pet-quality:${QUALITIES8[quality8(p)][1]}" ${p.locked10||p.favorite10?'disabled':''}>${petPortrait8(p.type)}<strong>${escapeHTML(fusionName20(p))}</strong><small>${QUALITIES8[quality8(p)][0]} · Lv.${p.lv}</small><small>战力 ${fusionNum20(petScore10(p))} · #${p.id}</small>${p.locked10||p.favorite10?'<span>已保护</span>':''}</button>`).join('')||'<p>没有匹配灵宠，请调整筛选条件或先去收集。</p>';
    $('#fusionPage20').textContent=(fusionPicker20.page+1)+' / '+pages;
    $('#fusionPrev20').disabled=fusionPicker20.page===0;$('#fusionNext20').disabled=fusionPicker20.page>=pages-1;
    for(const button of $('#dialog').querySelectorAll('[data-pet-choice20]'))button.onclick=()=>{
      const p=S.pets.find(p=>p.id===+button.dataset.petChoice20);if(!p||p.locked10||p.favorite10)return;
      fusionChoice20[role]=p.id;
      if(role==='main'&&fusionChoice20.sub===p.id)fusionChoice20.sub=null;
      fusionMessage20='';fusionPanel20();
    };
  };
  $('#fusionSearch20').oninput=()=>{fusionPicker20.query=$('#fusionSearch20').value.trim();fusionPicker20.page=0;render()};
  $('#fusionQuality20').onchange=()=>{fusionPicker20.quality=+$('#fusionQuality20').value;fusionPicker20.page=0;render()};
  $('#fusionMove20').onchange=()=>{fusionPicker20.move=$('#fusionMove20').value;fusionPicker20.page=0;render()};
  $('#fusionPrev20').onclick=()=>{fusionPicker20.page--;render()};$('#fusionNext20').onclick=()=>{fusionPicker20.page++;render()};$('#fusionPickBack20').onclick=fusionPanel20;render();
}

function fusionResultPanel20(receipt=S?.lastFusion20,replay=false){
  if(!S||!receipt||!fusionReceiptValid20(receipt,S.worldId10))return false;
  const r=clone10(receipt),pet=r.result||r.sources[0],q=pet.quality;
  panelContext7={key:'petResult20',args:[r,replay]};characterSheet13=false;
  const newSkills=r.success?r.result.skills.filter(s=>!r.sources[0].skills.includes(s)):[];
  const kept=S.pets.some(p=>p.id===r.sources[0].id),ownedResult=r.success&&S.pets.some(p=>p.id===r.result.id&&quality8(p)===r.result.quality);
  const loss=r.free?'本次为体验免消耗：主宠、副宠与金币均未扣除。':r.success?'主副灵契已合成新契，实际消耗 '+fusionNum20(r.cost)+' 金币。':'主灵宠已完整保留，副灵宠及本次 '+fusionNum20(r.cost)+' 金币已消耗。';
  showDialog(fusionHead20(replay?'最近一次合契 · 演出回顾':'万灵合契 · 命运交汇')+`
    <section class="fusion-result20 ${r.success?'success20':'failure20'} tier20-${q}" style="--result-quality:${QUALITIES8[q][1]}">
      <div class="fusion-result-header20"><small>${replay?'已保存结果 · 回顾不再扣费':'结算已保存 · 可随时关闭或跳过演出'}</small><h3 id="fusionPhase20" aria-live="polite">第一阶段 · 灵契蓄力</h3></div>
      <div id="fusionScene20" class="fusion-scene20" data-phase="charge"><canvas id="fusionCanvas20" width="640" height="300" aria-label="${r.success?'灵宠品质进阶演出':'融合失败、主宠归来演出'}"></canvas><span class="fusion-scene-caption20">${!r.success?'灵契散去 · 主宠归来':q>=6?'天命归一':q>=5?'万象神临':q>=4?'传说降世':'灵契新生'}</span></div>
      <div id="fusionOutcome20" class="fusion-outcome20" aria-hidden="true" role="status">
        <h2>${r.success?'✨ 融合成功！':'融合失败！'}</h2>
        <h3>${r.success?'恭喜获得：'+QUALITIES8[q][0]+'品质灵宠！':'灵光消散 · 主宠安然归来'}</h3>
        <p class="fusion-result-name20">${escapeHTML(fusionName20(pet))} <span>Lv.${pet.lv} · ${WX.names[pet.element]}行</span></p>
        <p class="fusion-result-loss20">${loss}</p>
        ${r.success?`<div class="fusion-result-stats20">${[['hp','生命'],['atk','攻击'],['int','智力'],['armor','护甲']].map(([key,name])=>`<article><small>${name}</small><b>${fusionNum20(pet.power[key])}</b><span>${fusionNum20(r.sources[0].power[key])} → ${fusionNum20(pet.power[key])}</span></article>`).join('')}</div><p class="fusion-result-skills20">新获得技能：${newSkills.map(escapeHTML).join('、')||'已有技能保留，品质与基础能力已提升'}<br>主动：${fusionSkill20(pet)} · 全部被动：${pet.skills.map(escapeHTML).join('、')||'暂无'}</p>`:`<p>保留主宠：${escapeHTML(fusionName20(pet))} · ${QUALITIES8[q][0]} · Lv.${pet.lv}<br>本次真实成功率 ${fusionPct20(r.successRate)}；失败保护已按原规则累计。</p>`}
        ${replay&&!ownedResult&&r.success?'<small>这是当次获得的形象；该灵宠可能已在后续培养或融合中变化。</small>':''}
        ${replay&&!kept&&!r.success?'<small>这是当次保留的主宠；当前包裹状态可能已经变化。</small>':''}
      </div>
      <nav class="fusion-result-actions20"><button id="fusionSkip20">跳过演出 / 查看结果</button><button id="fusionConfirm20" class="primary">确认 · 查看灵宠包裹</button><button id="fusionAgain20">继续融合</button></nav>
    </section>`);
  $('#dialog').classList.add('fusion-dialog20','fusion-result-dialog20');
  $('#fusionSkip20').onclick=revealFusion20;$('#fusionConfirm20').onclick=()=>petsPanel();$('#fusionAgain20').onclick=()=>{fusionMessage20='';fusionPanel20()};
  startFusionFx20(r,replay);return true;
}
function fusionHistoryPanel20(){
  panelContext7={key:'fusionHistory20',args:[]};showDialog(panelHead('灵宠合契 · 已保存记录')+historyMarkup10('pet-fusion')+'<button id="fusionHistoryBack20">返回合契台</button>');$('#fusionHistoryBack20').onclick=fusionPanel20;
}

// All legacy entry points use the same panel; no obsolete dropdown fusion remains reachable.
fusionPanel17=fusionPanel20;petFusionPanel10=fusionPanel20;fusionPanel=fusionPanel20;fusionPanel8=fusionPanel20;fusionPanel9=fusionPanel20;
for(const key of ['petFusion20','petFusion17','petFusion10','fusion','fusion8','fusion9'])panelTargets7[key]=fusionPanel20;
panelTargets7.petResult20=fusionResultPanel20;panelTargets7.fusionPicker20=fusionPickerPanel20;panelTargets7.fusionHistory20=fusionHistoryPanel20;

const showBeforeFusion20=showDialog;
showDialog=function(...args){stopFusionFx20();const result=showBeforeFusion20(...args);$('#dialog').classList.remove('fusion-dialog20','fusion-result-dialog20','fusion-picker-dialog20');return result};
const closeTopBeforeFusion20=closeTopWindow19;
closeTopWindow19=function(){
  stopFusionFx20();const result=closeTopBeforeFusion20();
  if(menu&&panelContext7?.key==='petFusion20')startFusionFx20();
  else if(menu&&panelContext7?.key==='petResult20')startFusionFx20(panelContext7.args[0],true);
  return result;
};
closeDialog=closeTopWindow19;
const closeAllBeforeFusion20=closeAllWindows19;
closeAllWindows19=function(){stopFusionFx20();return closeAllBeforeFusion20()};
const beginBeforeFusion20=begin;
begin=function(...args){stopFusionFx20();fusionChoice20={main:null,sub:null,mode:'upgrade'};fusionScreen20=null;fusionMessage20='';return beginBeforeFusion20(...args)};
