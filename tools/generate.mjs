import fs from 'node:fs';
import path from 'node:path';
import {root,loadCatalog,projections} from './catalog.mjs';
const check=process.argv.includes('--check');
for (const [name,content] of Object.entries(projections(loadCatalog()))) {
    const file=path.join(root,name);
    if (check) {if (!fs.existsSync(file) || fs.readFileSync(file,'utf8')!==content) throw new Error(`${name}: projeção desatualizada; execute npm run generate`);}
    else fs.writeFileSync(file,content);
}
console.log(check?'Catálogo e projeções coerentes.':'Projeções geradas.');
