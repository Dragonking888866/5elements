from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import json,base64,threading
root=Path(__file__).resolve().parents[2]
def handler(v):
 class Handler(SimpleHTTPRequestHandler):
  def __init__(self,*a,**k):super().__init__(*a,directory=str(root/'web') if (root/'web').exists() else str(root),**k)
  def log_message(self,*a):pass
  def do_POST(self):
   if self.path!='/capture':return self.send_error(404)
   obj=json.loads(self.rfile.read(int(self.headers['Content-Length'])));out=root/'验收';out.mkdir(exist_ok=True);(out/Path(obj['name']).name).write_bytes(base64.b64decode(obj['data'].split(',')[-1]));self.send_response(200);self.end_headers();self.wfile.write(b'ok')
  def do_GET(self):
   if self.path.split('?')[0]=='/qa.html':data=((root/'web/index.html' if (root/'web').exists() else root/'index.html')).read_text('utf8').replace('</body>','<script src="qa40.js"></script></body>').encode('utf8');mime='text/html;charset=utf8'
   elif self.path.split('?')[0]=='/qa40.js':data=(root/'tests/ui/qa40.js').read_bytes();mime='text/javascript;charset=utf8'
   else:return super().do_GET()
   self.send_response(200);self.send_header('Content-Type',mime);self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(data)));self.end_headers();self.wfile.write(data)
 return Handler
ThreadingHTTPServer(('127.0.0.1',8740),handler(40)).serve_forever()

