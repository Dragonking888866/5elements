const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
for(const file of ['release-v23.cjs','ownership-v24.cjs']){const r=cp.spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit'});if(r.status!==0)process.exitCode=1}
const root=path.join(__dirname,'..'),prior=JSON.parse(fs.readFileSync(path.join(root,'QA-v23-automated.json'),'utf8')),ownership=JSON.parse(fs.readFileSync(path.join(root,'QA-v24-ownership.json'),'utf8'));
const tests=[...prior.tests,...ownership.tests],failures=tests.filter(t=>!t.pass).length;
fs.writeFileSync(path.join(root,'QA-v24-automated.json'),JSON.stringify({version:'25.0.0',tests,failures,supersededLegacyChecks:prior.supersededLegacyChecks},null,2));
console.log(`${tests.length-failures}/${tests.length} V24 checks passed.`);if(failures||tests.length!==329)process.exitCode=1;
