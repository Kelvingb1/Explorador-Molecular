import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {root} from './catalog.mjs';
export function serve(port=5500) {
    const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.gif':'image/gif'};
    return http.createServer((request,response)=>{
        let file;
        try {file=path.resolve(root,'.'+decodeURIComponent(new URL(request.url,'http://localhost').pathname));} catch {response.writeHead(400).end();return;}
        if (!file.startsWith(root+path.sep)) {if(file===root)file=path.join(root,'index.html');else {response.writeHead(403).end();return;}}
        if (fs.existsSync(file)&&fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
        if(!fs.existsSync(file)||!fs.statSync(file).isFile()){response.writeHead(404).end();return;}
        response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(response);
    }).listen(port,'127.0.0.1');
}
if (process.argv[1]?.endsWith('/serve.mjs') || process.argv[1]?.endsWith('\\serve.mjs')) {serve();console.log('Explorador: http://localhost:5500/index.html');}
