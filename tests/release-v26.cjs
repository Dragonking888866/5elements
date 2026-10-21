const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
for(const file of ['release-v25.cjs','assets-v26.cjs']){const r=cp.spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit'});if(r.status!==0)process.exitCode=1}
const root=path.join(__dirname,'..'),prior=JSON.parse(fs.readFileSync(path.join(root,'QA-v25-automated.json'),'utf8')),assets=JSON.parse(fs.readFileSync(path.join(root,'QA-v26-assets.json'),'utf8')),tests=[...prior.tests,...assets.tests],failures=tests.filter(t=>!t.pass).length;
fs.writeFileSync(path.join(root,'QA-v26-automated.json'),JSON.stringify({version:'26.0.0',tests,failures,supersededLegacyChecks:prior.supersededLegacyChecks,fixtureChanges:'Historical fixtures omit assetsSchema26 when constructing an old save; contemporary socket fixtures receive independent IDs. Current namespace assertions use V26. Old drawer assertions now verify the unified hero center. No business regression was skipped for V26.'},null,2));
console.log(`${tests.length-failures}/${tests.length} V26 checks passed.`);if(failures||tests.length!==397)process.exitCode=1;

