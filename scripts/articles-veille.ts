/**
 * Génère lib/veille-slugs.generated.ts et lib/veille-articles.generated.ts :
 * les articles complets des actus, construits en pages /actus/<slug>.
 *
 * Lancé automatiquement avant `npm run build`, `npm run dev` et `npm test` ; à la main : `npm run veille`.
 * Ne casse JAMAIS le build : si la veille ne répond pas, 0 article (les cartes mènent
 * alors à la page de secours ou à la source).
 *
 * Variables facultatives :
 * - VEILLE_DOSSIER : dossier local qui imite la veille (actus/solelis.json, articles/solelis/<id>.json) ;
 * - VEILLE_HORS_LIGNE=1 : n'interroge pas la veille (0 article).
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { choisirArticles, moduleArticles, moduleSlugs } from '../lib/articlesVeille.ts';
import { URL_ARTICLES, URL_VEILLE, lireFlux } from '../lib/veille.ts';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const dossier = process.env.VEILLE_DOSSIER ? resolve(process.env.VEILLE_DOSSIER) : null;
const horsLigne = process.env.VEILLE_HORS_LIGNE === '1';
const DELAI_MS = 10_000;

async function lireJson(url: string, local: string | null): Promise<unknown> {
  try {
    if (local) return existsSync(local) ? JSON.parse(readFileSync(local, 'utf8')) : null;
    const rep = await fetch(url, { signal: AbortSignal.timeout(DELAI_MS), headers: { 'User-Agent': 'Solelis-build (+https://solelis.com)' } });
    return rep.ok ? await rep.json() : null;
  } catch {
    return null;
  }
}

const fluxBrut = horsLigne ? null : await lireJson(URL_VEILLE, dossier && join(dossier, 'actus', 'solelis.json'));
const flux = lireFlux(fluxBrut);
const avecSlug = flux?.actus.filter((a) => a.slug) ?? [];
const articlesBruts: Record<string, unknown> = {};
// Par paquets de 6 : la veille est un simple site GitHub Pages.
for (let i = 0; i < avecSlug.length; i += 6) {
  await Promise.all(
    avecSlug.slice(i, i + 6).map(async (a) => {
      articlesBruts[a.id] = await lireJson(`${URL_ARTICLES}${a.id}.json`, dossier && join(dossier, 'articles', 'solelis', `${a.id}.json`));
    }),
  );
}

const donnees = choisirArticles(fluxBrut, articlesBruts);
writeFileSync(join(racine, 'lib', 'veille-slugs.generated.ts'), moduleSlugs(donnees));
writeFileSync(join(racine, 'lib', 'veille-articles.generated.ts'), moduleArticles(donnees));

const origine = horsLigne ? 'hors ligne' : dossier ? `dossier ${dossier}` : flux ? 'veille' : 'veille injoignable';
console.log(`✓ Veille (${origine}) : ${donnees.actus.length} actu(s), ${donnees.articles.length} article(s) construit(s) sur ${avecSlug.length} annoncé(s)`);
