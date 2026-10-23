// Signale toutes les pages du site à Bing, DuckDuckGo, Ecosia, Yandex… via IndexNow.
// Usage : node scripts/indexnow.mjs, à lancer après chaque mise en ligne (npm run cf:deploy).
// La clé est publique par conception : elle est servie à la racine du site (public/<clé>.txt).
const SITE = "https://solelis.com";
const CLE = "6420c222dd7200cc295dd43a6324ec71";
// Un navigateur annoncé : l'hébergeur refuse certains robots génériques.
const headers = { "User-Agent": "Mozilla/5.0 (compatible; Solelis-IndexNow/1.0; +https://solelis.com)" };

const plan = await fetch(`${SITE}/sitemap.xml`, { headers });
if (!plan.ok) {
  console.error(`Sitemap illisible : réponse ${plan.status}`);
  process.exit(1);
}
const urls = [...(await plan.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
if (urls.length === 0) {
  console.log("Sitemap vide (site en maintenance ?) : rien à signaler.");
  process.exit(0);
}

const rep = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: CLE, keyLocation: `${SITE}/${CLE}.txt`, urlList: urls }),
});
console.log(`IndexNow : ${urls.length} page(s) signalée(s), réponse ${rep.status}`);
if (rep.status >= 400) {
  console.error(await rep.text());
  process.exit(1);
}
