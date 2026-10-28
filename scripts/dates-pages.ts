/**
 * Génère lib/dates-pages.generated.ts : la date de dernière modification réelle de chaque page,
 * lue dans l'historique git, pour le `lastmod` du sitemap.
 *
 * Pour une page app/<chemin>/page.tsx, on prend le dernier commit qui a touché un fichier de son
 * dossier (sans les sous-dossiers, qui sont d'autres pages) ou un module de contenu qu'elle importe
 * (`@/lib/…`, `@/data/…`), hors modules techniques partagés par tout le site.
 * Les pages dynamiques ([slug]) ont une seule date, sous leur motif (`/courriers/[slug]`).
 *
 * Lancé avant `npm run build`, `npm run dev` et `npm test` ; à la main : `npm run dates`.
 * Ne casse JAMAIS le build : sans git ou avec un historique tronqué (clone superficiel),
 * le module est vide et le sitemap garde sa date fixe de repli.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');

// Modules partagés par tout le site : les modifier ne change pas le contenu d'une page.
const MODULES_TECHNIQUES = new Set(['og', 'types', 'hooks', 'FicheContext', 'schemas', 'utils', 'fetchTimeout', 'illustrations']);

function git(...args: string[]): string {
  return execFileSync('git', args, { cwd: racine, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

function pages(dossier: string, chemin = ''): Array<{ route: string; dossier: string }> {
  const trouvees: Array<{ route: string; dossier: string }> = [];
  for (const nom of readdirSync(dossier)) {
    const complet = join(dossier, nom);
    if (!statSync(complet).isDirectory()) continue;
    if (nom.startsWith('_') || nom === 'api') continue;
    // Les groupes (dossier) ne comptent pas dans l'adresse.
    const segment = nom.startsWith('(') ? '' : `/${nom}`;
    trouvees.push(...pages(complet, chemin + segment));
  }
  if (existsSync(join(dossier, 'page.tsx'))) trouvees.push({ route: chemin || '/', dossier });
  return trouvees;
}

/**
 * Fichiers du dossier (sans sous-dossiers) + modules de contenu importés.
 * Pour l'accueil, seulement page.tsx : le dossier app/ contient aussi la mise en page,
 * le sitemap, les pages d'erreur… communs à tout le site.
 */
function sources(dossier: string): string[] {
  const fichiers = (dossier === join(racine, 'app') ? ['page.tsx'] : readdirSync(dossier))
    .map((n) => join(dossier, n))
    .filter((f) => statSync(f).isFile());
  const modules = new Set<string>();
  for (const f of fichiers) {
    if (!/\.(tsx?|json)$/.test(f)) continue;
    for (const m of readFileSync(f, 'utf8').matchAll(/from '@\/(lib|data)\/([^']+)'/g)) {
      const nom = m[2];
      if (MODULES_TECHNIQUES.has(nom) || nom.endsWith('.generated')) continue;
      for (const ext of ['.ts', '.tsx', '/index.ts', '']) {
        const candidat = join(racine, m[1], nom + ext);
        if (existsSync(candidat) && statSync(candidat).isFile()) {
          modules.add(candidat);
          break;
        }
      }
    }
  }
  return [...fichiers, ...modules].map((f) => f.slice(racine.length + 1));
}

let dates: Record<string, string> = {};
let origine = 'historique git';
try {
  if (git('rev-parse', '--is-shallow-repository') === 'true') throw new Error('historique tronqué');
  for (const { route, dossier } of pages(join(racine, 'app'))) {
    const date = git('log', '-1', '--format=%cI', '--', ...sources(dossier));
    if (date) dates[route] = new Date(date).toISOString();
  }
} catch (e) {
  dates = {};
  origine = `aucune date (${e instanceof Error ? e.message : 'git indisponible'})`;
}

const trie = Object.fromEntries(Object.entries(dates).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(
  join(racine, 'lib', 'dates-pages.generated.ts'),
  '// GÉNÉRÉ par scripts/dates-pages.ts (npm run dates) — ne pas modifier, non versionné.\n' +
    `export const DATES_PAGES: Readonly<Record<string, string>> = ${JSON.stringify(trie, null, 1)};\n`,
);
console.log(`✓ Dates des pages (${origine}) : ${Object.keys(trie).length} page(s)`);
