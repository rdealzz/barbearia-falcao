import { chromium } from 'playwright';
const BASE='http://localhost:3100';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await b.newContext();
const p = await ctx.newPage();
// logado como cliente para cobrir as áreas internas
await p.goto(`${BASE}/entrar`); await p.fill('#email','cliente@falcao.com'); await p.fill('#password','falcao123');
await p.click('button[type=submit]'); await p.waitForURL('**/conta');

const pages = ['/','/sobre','/servicos','/galeria','/barbeiros','/planos','/contato','/agendar','/conta','/conta/agendamentos','/conta/clube','/conta/plano','/conta/perfil','/privacidade','/termos','/barbeiros/rafael-falcao','/planos/corte-ilimitado'];
const links = new Set();
const failed = [];
for (const path of pages) {
  const resp = await p.goto(BASE+path, { waitUntil: 'networkidle' });
  if (!resp || resp.status() >= 400) failed.push(`${resp?.status()} PAGINA ${path}`);
  const hrefs = await p.$$eval('a[href]', as => as.map(a => a.getAttribute('href')));
  hrefs.filter(h => h && h.startsWith('/')).forEach(h => links.add(h));
}
for (const href of links) {
  const r = await ctx.request.get(BASE + href, { maxRedirects: 0 }).catch(() => null);
  const st = r ? r.status() : 'ERRO';
  if (st !== 200 && st !== 307 && st !== 308) failed.push(`${st} LINK ${href}`);
}
console.log('links internos verificados:', links.size);
console.log(failed.length ? failed.join('\n') : 'nenhum 404 encontrado');
await b.close();
