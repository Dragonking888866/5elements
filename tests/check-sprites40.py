from PIL import Image
from pathlib import Path
import numpy as np,json,hashlib
r=Path(__file__).resolve().parents[1];spec=json.loads((r/'PALETTES-v40.json').read_text('utf-8-sig'));rows=[]
for p in spec:
 old=r/'assets'/p['source'];new=r/'assets'/f"divine-pet-{p['index']}-v40.png"
 if not new.exists():raise RuntimeError('未生成 '+str(new))
 a=Image.open(old).convert('RGBA');b=Image.open(new).convert('RGBA');assert a.size==b.size==(1254,1254)
 aa=np.array(a);bb=np.array(b);frames=[]
 for y in range(4):
  for x in range(4):
   box=(slice(round(y*1254/4),round((y+1)*1254/4)),slice(round(x*1254/4),round((x+1)*1254/4)))
   m=aa[box][:,:,3]>192;n=bb[box][:,:,3]>192
   oy,ox=np.nonzero(m);ny,nx=np.nonzero(n);assert len(nx)>1000
   frames.append({'row':y,'frame':x,'sourceBodyRetained':float((m&n).sum()/m.sum()),'opaqueIoU':float((m&n).sum()/(m|n).sum()),'centroidShiftPx':float(np.hypot(ox.mean()-nx.mean(),oy.mean()-ny.mean()))})
 # Alpha thresholds measure opacity as well as shape; retain metrics for human review.
 # They do not prove bone alignment. Fixed-camera map and riding frames are mandatory.
 # Alpha centroid is not a saddle anchor. Do not infer rig positions from changing translucent glow.
 rows.append({'type':p['type'],'name':p['name'],'size':a.size,'rgba':True,'transparentPixels':int((bb[:,:,3]==0).sum()),'originalSHA256':hashlib.sha256(old.read_bytes()).hexdigest(),'editedSHA256':hashlib.sha256(new.read_bytes()).hexdigest(),'frames':frames})
(r/'QA-v40-sprite-layout.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),'utf8');print(json.dumps({'beasts':len(rows),'frames':sum(len(x['frames'])for x in rows),'minimumIoU':min(f['opaqueIoU']for x in rows for f in x['frames']),'maximumCentroidShiftPx':max(f['centroidShiftPx']for x in rows for f in x['frames'])}))