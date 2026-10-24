const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {run,test,finish}=require('./v10-harness.cjs');run(require('./service-fixture-v27.cjs'));
const specs=JSON.parse(fs.readFileSync(path.join(__dirname,'../PALETTES-v40.json'),'utf8').replace(/^\uFEFF/,''));
for(const p of specs){
 test('40-MATERIAL-'+p.type+' '+p.name+'独立透明材质及旧资源保留',()=>{
  const row=JSON.parse(run(`JSON.stringify(ultimatePet35(${p.type}))`)),b=fs.readFileSync(path.join(__dirname,'..',row.art)),old=fs.readFileSync(path.join(__dirname,'../assets',p.source));
  if(b.readUInt32BE(0)!==0x89504e47||b[25]!==6)throw Error('需RGBA PNG');
  if(b.readUInt32BE(16)!==old.readUInt32BE(16)||b.readUInt32BE(20)!==old.readUInt32BE(20))throw Error('动作图尺寸改变');
  if(crypto.createHash('sha256').update(b).digest('hex')===crypto.createHash('sha256').update(old).digest('hex'))throw Error('美术未更新');
  if(row.name!==p.name||row.material40.type!==p.type||row.material40.colors.join(',')!==p.colors.join(','))throw Error('材质映射错误');
  run(`assert(petPortrait8(${p.type}).includes(ultimatePet35(${p.type}).art))`);
 });
}
test('40-POOL 公开十兽、隐藏祖兽与五行数量不变',()=>run(`assert.equal(ULTIMATE_PETS35.length,10);assert.equal(CHAOS_PET36.type,113);for(let e=0;e<5;e++)assert.equal(ULTIMATE_PETS35.filter(d=>d.element===e).length,2);assert(!ULTIMATE_PETS35.some(d=>d.type===113));assert.equal(DIVINE_MATERIALS40.length,11)`));
test('40-RIG 四行动作选择与朝向根节点不被材质模块修改',()=>run(`assert(begin(fresh('材质回归',0)));closeAllWindows19();const a=active();for(const m of DIVINE_MATERIALS40){const d=ultimatePet35(m.type),p=addPet(m.type,false,6);S.heroes[0].pet=p.id;for(const face of [-1,1])for(const row of [0,1,2,3]){Object.assign(a,{x:900,y:700,face,visualFace11:face,motion:row===1?60:0,gait:1.3,petAct11:row===2?{t:.3,duration:.7}:null,mythCast35:row===3?{row:3,max:2,t:1}:null});const actual=mountRigPose32(m.type,a),state=mythSpriteState35(a,d);d.art=m.previousArt;const old=mountRigPose32(m.type,a);d.art=m.art;assert.equal(actual.saddleX,old.saddleX);assert.equal(actual.saddleY,old.saddleY);assert.equal(actual.pitch,old.pitch);assert.equal(actual.bob,old.bob);assert.equal(state.row,row);drawMount(m.type,a,false);drawMount(m.type,a,true);assert.equal(a.x,900);assert.equal(a.y,700);assert.equal(a.face,face)}}`));
test('40-STATS 外观切换不改变战力、伤害半径或实例ID，存档可往返',()=>run(`assert(begin(fresh('存档保护',0)));closeAllWindows19();for(const m of DIVINE_MATERIALS40){const p=addPet(m.type,false,6);S.heroes[0].pet=p.id;const before=JSON.stringify(stats(0)),id=p.id,d=ultimatePet35(m.type);d.art=m.previousArt;assert.equal(JSON.stringify(stats(0)),before);d.art=m.art;assert.equal(p.id,id)}assert(saveGame(false));const pets=JSON.stringify(S.pets);assert(begin(readSave()));assert.equal(JSON.stringify(S.pets),pets);assert(validateSave(S));assert(!JSON.stringify(S).includes('material40'));assert.equal(SAVE_KEY,'wuxing-chronicles-v31')`));
test('40-NORENDER 每帧无新增滤镜、画布、粒子或根节点操作',()=>{const s=fs.readFileSync(path.join(__dirname,'../divine-materials-v40.js'),'utf8');if(/getImageData|createElement|drawImage|\.filter\s*=|screenShake\s*=|cam\.\w+\s*=|a\.face\s*=|a\.x\s*=/.test(s))throw Error('材质层引入了帧开销或动作变更')});
test('40-BOTH 正式与沙盒均接入新材质且保留V39分层',()=>{for(const name of ['runtime.js','runtime-sandbox.js']){const s=fs.readFileSync(path.join(__dirname,'..',name),'utf8');if(!s.includes('const DIVINE_MATERIALS40=')||!s.includes('destination-out'))throw Error('缺少新材质或旧遮挡层')}});
const r=finish();fs.writeFileSync(path.join(__dirname,'../QA-v40-materials.json'),JSON.stringify({version:'40.0.0',...r},null,2));