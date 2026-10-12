/**
 * Génère lib/conseils/donnees.generated.ts à partir de content/conseils/*.md.
 *
 * Lancé automatiquement avant `npm run build`, `npm run dev` et `npm test`
 * (scripts « pre… » de package.json) ; à la main : `npm run conseils`.
 * Échoue (code 1) si un article est invalide, si un lien interne vise une page
 * inexistante ou si un slug est en double : le build s'arrête alors.
 *
 * Variable facultative CONSEILS_DIR : autre dossier d'articles (tests).
 */
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { cataloguePages, construireConseils, moduleDonnees } from '../lib/conseils/construction.ts';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const dossier = process.env.CONSEILS_DIR ? resolve(process.env.CONSEILS_DIR) : join(racine, 'content', 'conseils');
const sortie = join(racine, 'lib', 'conseils', 'donnees.generated.ts');

const fichiers = existsSync(dossier)
  ? readdirSync(dossier)
      .filter((nom) => nom.toLowerCase().endsWith('.md') && nom.toLowerCase() !== 'readme.md')
      .sort()
      .map((nom) => ({ nom, contenu: readFileSync(join(dossier, nom), 'utf8') }))
  : [];

const pages = await cataloguePages(racine);
const { conseils, erreurs } = construireConseils(fichiers, pages);

if (erreurs.length) {
  console.error(`\n✗ Conseils : ${erreurs.length} erreur(s) dans ${dossier}\n`);
  for (const e of erreurs) console.error(`  - ${e}`);
  console.error('\nFormat attendu : voir content/conseils/README.md\n');
  process.exit(1);
}

writeFileSync(sortie, moduleDonnees(conseils));
const brouillons = conseils.filter((c) => c.brouillon).length;
console.log(
  `✓ Conseils : ${conseils.length} article(s) (${brouillons} brouillon(s)) → lib/conseils/donnees.generated.ts`,
);
