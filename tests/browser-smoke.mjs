// Execute após: npm install --no-save playwright@1.62.1 && npx playwright install chromium
import assert from 'node:assert/strict';
import {serve} from '../tools/serve.mjs';
const {chromium}=await import('playwright');
const server=serve(0);await new Promise(resolve=>server.once('listening',resolve));
let browser;
try {
    browser=await chromium.launch();
    const base=`http://127.0.0.1:${server.address().port}/index.html`;
    for(const mobile of [false,true]){
        const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1280,height:900},reducedMotion:'reduce'});
        const page=await context.newPage();
        // Bloqueio real da CDN: ficha e seleção continuam funcionando.
        await page.route('https://cdnjs.cloudflare.com/**',route=>route.abort());
        const errors=[];page.on('pageerror',error=>errors.push(error));
        await page.goto(base+'?composto=H2SO4');
        await page.waitForSelector('#painel-estrutura-2d .atomo-2d');
        assert.match(await page.locator('#titulo-molecula').textContent(),/Sulfúrico/);
        assert.equal(await page.locator('.atomo-2d').count(),7);
        await page.selectOption('#seletor-composto','NH3');
        assert.equal(new URL(page.url()).searchParams.get('composto'),'NH3');
        assert.equal(await page.locator('.atomo-2d').count(),4);
        await page.locator('.atomo-2d').first().focus();await page.keyboard.press('Enter');
        assert.match(await page.locator('.detalhe-2d').textContent(),/Nitrogênio/);
        assert.equal(await page.locator('#rotacao').isDisabled(),true);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow horizontal');
        assert.deepEqual(errors,[]);
        await page.goto(base+'?composto=__proto__');assert.match(await page.locator('#titulo-molecula').textContent(),/Amônia/);
        await context.close();
    }
    // Biblioteca real: rede e WebGL precisam estar disponíveis para esta etapa.
    const page=await browser.newPage();await page.goto(base+'?composto=NH4Cl');
    await page.waitForFunction(()=>document.getElementById('visualizador').dataset.state==='ready',{},{timeout:30000});
    assert.equal(await page.locator('#rotacao').isDisabled(),false);
    await page.selectOption('#seletor-composto','H2SO4');assert.equal(await page.locator('#visualizador').getAttribute('data-state'),'ready');
    await page.locator('#restaurar').click();
    console.log('Browser smoke: desktop/mobile, fallback, teclado, URL e 3D real passaram.');
} finally {await browser?.close();server.close();}
