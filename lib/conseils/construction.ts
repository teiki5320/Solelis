/**
 * Construction de la rubrique « Conseils » AU BUILD (jamais à l'exécution) :
 * lecture de l'en-tête des articles, validation (Zod), conversion du Markdown
 * en HTML sûr (marked) et vérification de tous les liens internes.
 *
 * Utilisé par scripts/generer-conseils.ts (Node, sans Next : imports avec
 * l'extension .ts) et par les tests. Les pages n'importent jamais ce fichier :
 * elles lisent le module généré lib/conseils/donnees.generated.ts.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { Marked, type Tokens } from 'marked';
import { z } from 'zod';
import { THEMES_CONSEILS, type Conseil, type LienConseil } from './types.ts';

/* ── En-tête (frontmatter) ─────────────────────────────────────────────── */

type ValeurEnTete = string | Array<string | Record<string, string>>;

/** Retire guillemets et commentaire de fin de ligne d'une valeur simple. */
function nettoyerScalaire(brut: string): string {
  const v = brut.trim();
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
    return v.slice(1, -1).replace(/\\(["\\])/g, '$1').replace(/\\n/g, '\n');
  }
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'");
  }
  // « # » précédé d'un espace = commentaire (comme en YAML) ; « https://x/#ancre » est conservé.
  return v.replace(/\s+#.*$/, '').trim();
}

/** « clé: valeur » en début de ligne ; « https://… » n'est pas une clé (pas d'espace après « : »). */
const CLE = /^([A-Za-z][A-Za-z0-9_]*)\s*:(?:\s+(.*)|\s*)$/;

/**
 * Lit l'en-tête d'un article. Sous-ensemble tolérant de YAML, adapté au format
 * des rédacteurs : « clé: valeur » (la valeur peut contenir « : », fréquent en
 * français), listes « - valeur » ou « - titre: … / url: … », blocs « > » et « | »,
 * guillemets facultatifs, commentaires « # ».
 */
export function lireEnTete(brut: string): { meta: Record<string, ValeurEnTete>; corps: string } {
  const texte = brut.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const m = texte.match(/^---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)([\s\S]*)$/);
  if (!m) throw new Error('en-tête manquant : le fichier doit commencer par une ligne « --- », les champs, puis une ligne « --- »');

  const meta: Record<string, ValeurEnTete> = {};
  const lignes = m[1].split('\n');
  let cle: string | null = null;
  let bloc: '>' | '|' | null = null;
  let objet: Record<string, string> | null = null;

  lignes.forEach((ligne, i) => {
    const numero = i + 2; // la ligne 1 est « --- »
    if (bloc && cle && (/^\s/.test(ligne) || ligne.trim() === '')) {
      const precedent = meta[cle] as string;
      const morceau = ligne.trim();
      meta[cle] = precedent === '' ? morceau : `${precedent}${bloc === '|' ? '\n' : ' '}${morceau}`;
      return;
    }
    bloc = null;
    if (ligne.trim() === '' || ligne.trim().startsWith('#')) return;

    if (!/^\s/.test(ligne)) {
      const c = ligne.match(CLE);
      if (!c) throw new Error(`ligne ${numero} illisible : « ${ligne.trim()} » (attendu « champ: valeur »)`);
      cle = c[1];
      objet = null;
      if (cle in meta) throw new Error(`ligne ${numero} : le champ « ${cle} » apparaît deux fois`);
      const valeur = (c[2] ?? '').trim();
      if (/^[>|][+-]?$/.test(valeur)) {
        bloc = valeur[0] as '>' | '|';
        meta[cle] = '';
      } else if (valeur.startsWith('[') && valeur.endsWith(']')) {
        meta[cle] = valeur.slice(1, -1).split(',').map(nettoyerScalaire).filter(Boolean);
      } else {
        meta[cle] = nettoyerScalaire(valeur);
      }
      return;
    }

    if (!cle) throw new Error(`ligne ${numero} : ligne en retrait sans champ au-dessus`);
    const actuel = meta[cle];
    const element = ligne.match(/^\s+-(?:\s+(.*)|\s*)$/);
    if (element) {
      if (typeof actuel === 'string' && actuel !== '') {
        throw new Error(`ligne ${numero} : « ${cle} » a déjà une valeur, il ne peut pas être une liste`);
      }
      const liste = Array.isArray(actuel) ? actuel : [];
      meta[cle] = liste;
      const contenu = (element[1] ?? '').trim();
      const sousCle = contenu.match(CLE);
      if (sousCle) {
        objet = { [sousCle[1]]: nettoyerScalaire(sousCle[2] ?? '') };
        liste.push(objet);
      } else {
        objet = null;
        liste.push(nettoyerScalaire(contenu));
      }
      return;
    }
    const sousCle = ligne.trim().match(CLE);
    if (sousCle && objet) {
      if (sousCle[1] in objet) throw new Error(`ligne ${numero} : « ${sousCle[1]} » apparaît deux fois dans le même élément`);
      objet[sousCle[1]] = nettoyerScalaire(sousCle[2] ?? '');
      return;
    }
    if (typeof actuel === 'string') {
      // Valeur sur plusieurs lignes (suite en retrait) : jointe par un espace.
      meta[cle] = `${actuel} ${nettoyerScalaire(ligne)}`.trim();
      return;
    }
    throw new Error(`ligne ${numero} illisible : « ${ligne.trim()} »`);
  });

  return { meta, corps: m[2] };
}

/* ── Validation (Zod) ──────────────────────────────────────────────────── */

function dateExiste(d: string): boolean {
  const t = new Date(`${d}T12:00:00Z`);
  return !Number.isNaN(t.getTime()) && t.toISOString().slice(0, 10) === d;
}

const dateAAAAMMJJ = z
  .string({ error: 'date manquante' })
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'date au format AAAA-MM-JJ attendue (ex. 2026-10-12)')
  .refine(dateExiste, 'date inexistante');

const texte = (champ: string, max?: number) => {
  const base = z.string({ error: `${champ} manquant` }).trim().min(1, `${champ} vide`);
  return max ? base.max(max, `${champ} trop long (${max} caractères au plus)`) : base;
};

/** Lien interne : chemin du site commençant par « / » (pas « // », pas d'espace). */
export const LIEN_INTERNE = /^\/(?!\/)[^\s]*$/;

export const schemaEnTete = z
  .strictObject(
    {
      title: texte('title', 70),
      description: texte('description', 160),
      date: dateAAAAMMJJ,
      miseAJour: dateAAAAMMJJ,
      theme: z.enum(THEMES_CONSEILS, { error: `theme inconnu (valeurs possibles : ${THEMES_CONSEILS.join(', ')})` }),
      resume: texte('resume'),
      sources: z
        .array(
          z.strictObject(
            {
              titre: texte('titre de la source'),
              url: z
                .string({ error: 'url de la source manquante' })
                .regex(/^https:\/\/[^\s/]+\.[^\s]+$/, 'url de source invalide : adresse complète en https:// attendue'),
            },
            { error: 'chaque source doit avoir exactement « titre » et « url »' },
          ),
          { error: 'sources : liste attendue (« - titre: … » puis « url: … »)' },
        )
        .min(1, 'au moins une source officielle est obligatoire'),
      liens: z
        .preprocess(
          (v) => (v === '' || v === undefined ? [] : v),
          z.array(z.string().regex(LIEN_INTERNE, 'lien interne invalide : il doit commencer par « / » (ex. /outils/ati)'), {
            error: 'liens : liste attendue (« - /chemin »)',
          }),
        ),
      brouillon: z.preprocess(
        (v) => (v === undefined || v === '' ? false : v === 'true' ? true : v === 'false' ? false : v),
        z.boolean({ error: 'brouillon : true ou false' }),
      ),
    },
    { error: (iss) => (iss.code === 'unrecognized_keys' ? `champ inconnu : ${iss.keys.join(', ')}` : undefined) },
  )
  .refine((d) => d.miseAJour >= d.date, { message: 'miseAJour ne peut pas précéder la date de publication', path: ['miseAJour'] });

export type EnTeteConseil = z.infer<typeof schemaEnTete>;

/* ── Dates ─────────────────────────────────────────────────────────────── */

const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** « 2026-10-01 » → « 1er octobre 2026 ». */
export function dateEnLettres(d: string): string {
  const [a, m, j] = d.split('-').map(Number);
  return `${j === 1 ? '1er' : j} ${MOIS[m - 1]} ${a}`;
}

/** « 2026-10-12 » → « 2026-10-12T00:00:00+02:00 » : minuit à Paris (heure d'été ou d'hiver). */
export function minuitParis(d: string): string {
  const parties = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', timeZoneName: 'longOffset' }).formatToParts(
    new Date(`${d}T00:00:00Z`),
  );
  const nom = parties.find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+01:00';
  return `${d}T00:00:00${nom === 'GMT' ? '+00:00' : nom.replace('GMT', '')}`;
}

/* ── Markdown → HTML sûr ───────────────────────────────────────────────── */

const echapper = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Ancre d'un sous-titre : « Délai de 45 jours » → « delai-de-45-jours ». */
export function ancre(texte: string): string {
  return texte
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Chemin d'un lien interne, sans ancre, paramètres ni « / » final. */
export function cheminDe(href: string): string {
  const chemin = href.split(/[?#]/)[0];
  return chemin.length > 1 ? chemin.replace(/\/+$/, '') : chemin;
}

/**
 * Convertit le corps Markdown en HTML. Refuse (erreur de build) ce qui ne doit
 * pas être publié : titre de niveau 1 (la page a déjà son h1), image, HTML brut,
 * lien http:// ou javascript:, lien interne vers une page inexistante.
 * Liens externes : target="_blank" rel="noreferrer". Liens vers un autre article :
 * attribut data-conseil (retirés à l'affichage tant que l'article n'est pas publié).
 */
export function rendreCorps(
  markdown: string,
  pageExiste: (chemin: string) => boolean,
): { html: string; erreurs: string[]; conseilsCites: string[] } {
  const erreurs: string[] = [];
  const cites = new Set<string>();
  const ancres = new Map<string, number>();
  const marked = new Marked({ gfm: true, breaks: false, async: false });

  marked.use({
    renderer: {
      heading({ tokens, depth, text }: Tokens.Heading) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) erreurs.push(`titre « # ${text} » interdit dans le corps : commencez les sous-titres par « ## »`);
        if (depth !== 2) return `<h${depth}>${inner}</h${depth}>\n`;
        const base = ancre(text) || 'partie';
        const n = (ancres.get(base) ?? 0) + 1;
        ancres.set(base, n);
        return `<h2 id="${n === 1 ? base : `${base}-${n}`}">${inner}</h2>\n`;
      },
      link({ href, title, tokens }: Tokens.Link) {
        const inner = this.parser.parseInline(tokens);
        const titre = title ? ` title="${echapper(title)}"` : '';
        if (LIEN_INTERNE.test(href)) {
          const chemin = cheminDe(href);
          if (!pageExiste(chemin)) erreurs.push(`lien interne vers une page inexistante : ${href}`);
          const slug = chemin.startsWith('/conseils/') ? chemin.slice('/conseils/'.length) : '';
          if (slug) cites.add(slug);
          return `<a href="${echapper(href)}"${slug ? ` data-conseil="${echapper(slug)}"` : ''}${titre}>${inner}</a>`;
        }
        if (/^https:\/\/[^\s]+$/.test(href)) {
          return `<a href="${echapper(href)}" target="_blank" rel="noreferrer"${titre}>${inner}</a>`;
        }
        if (/^#[\w-]+$/.test(href) || /^(mailto|tel):[^\s]+$/.test(href)) {
          return `<a href="${echapper(href)}"${titre}>${inner}</a>`;
        }
        erreurs.push(
          `lien refusé : « ${href} » (accepté : /chemin-du-site, https://…, #ancre, mailto:, tel:${href.startsWith('http://') ? ' — passez en https://' : ''})`,
        );
        return inner;
      },
      image({ href }: Tokens.Image) {
        erreurs.push(`image non prise en charge dans les articles : ${href}`);
        return '';
      },
      html({ text }: Tokens.HTML | Tokens.Tag) {
        // Les commentaires <!-- … --> sont des notes de rédaction : retirés.
        if (/^\s*<!--[\s\S]*-->\s*$/.test(text)) return '';
        erreurs.push(`HTML brut interdit dans le corps : « ${text.trim().slice(0, 60)} » (utilisez le Markdown)`);
        return echapper(text);
      },
    },
  });

  const html = marked.parse(markdown, { async: false });
  return { html: html.trim(), erreurs, conseilsCites: [...cites] };
}

/* ── Pages du site (cibles valides des liens internes) ─────────────────── */

/** Titre de page lu dans les métadonnées d'un page.tsx / layout.tsx (pageTitle d'abord, puis title). */
export function titreDepuisSource(source: string): string | null {
  for (const champ of ['pageTitle', 'title']) {
    const m = source.match(new RegExp(`\\b${champ}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`));
    if (m) return m[2].replace(/\\(.)/g, '$1').replace(/\s+—\s+Solelis$/, '').trim();
  }
  return null;
}

/** Entrées « 'slug': { titre: '…' » d'un fichier de page dynamique (situation, faq). */
export function slugsDepuisSource(source: string): Array<{ slug: string; titre: string }> {
  const re = /^\s{2}'([a-z0-9-]+)':\s*\{\s*\n\s*titre:\s*'((?:\\.|[^'\\])*)'/gm;
  return [...source.matchAll(re)].map((m) => ({ slug: m[1], titre: m[2].replace(/\\(.)/g, '$1') }));
}

/**
 * Toutes les pages publiques du site, avec leur titre : pages fixes de app/
 * (hors /api et routes dynamiques), courriers, situations et FAQ ciblées.
 * Les articles (/conseils/<slug>) sont ajoutés par construireConseils.
 */
export async function cataloguePages(racineProjet: string): Promise<Map<string, string>> {
  const pages = new Map<string, string>();
  const app = join(racineProjet, 'app');
  const lire = (f: string) => (existsSync(f) ? readFileSync(f, 'utf8') : '');

  const parcourir = (dossier: string, segments: string[]) => {
    const entrees = readdirSync(dossier, { withFileTypes: true });
    const page = ['page.tsx', 'page.ts', 'page.jsx', 'page.js'].find((f) => entrees.some((e) => e.isFile() && e.name === f));
    if (page) {
      const chemin = `/${segments.join('/')}`;
      const titre = titreDepuisSource(lire(join(dossier, page))) ?? titreDepuisSource(lire(join(dossier, 'layout.tsx')));
      pages.set(chemin, titre ?? chemin);
    }
    for (const e of entrees) {
      if (!e.isDirectory()) continue;
      if (/^[[@_]/.test(e.name)) continue; // routes dynamiques, parallèles, privées
      if (segments.length === 0 && e.name === 'api') continue;
      const groupe = /^\(.*\)$/.test(e.name);
      parcourir(join(dossier, e.name), groupe ? segments : [...segments, e.name]);
    }
  };
  parcourir(app, []);
  pages.set('/', 'Accueil : créer ma fiche personnalisée');

  const { COURRIERS } = (await import(pathToFileURL(join(racineProjet, 'lib', 'courriers.ts')).href)) as {
    COURRIERS: Array<{ slug: string; titre: string }>;
  };
  for (const c of COURRIERS) pages.set(`/courriers/${c.slug}`, `Modèle de courrier : ${c.titre}`);
  for (const s of slugsDepuisSource(lire(join(racineProjet, 'lib', 'situations.ts')))) {
    pages.set(`/situation/${s.slug}`, s.titre);
  }
  for (const s of slugsDepuisSource(lire(join(app, 'faq', '[situation]', 'page.tsx')))) {
    pages.set(`/faq/${s.slug}`, s.titre.replace(/^FAQ — /, 'FAQ : '));
  }
  pages.set('/conseils', 'Tous les conseils');
  pages.set('/conseils/rss.xml', 'Flux RSS des conseils');
  return pages;
}

/* ── Construction de l'ensemble des articles ───────────────────────────── */

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface FichierConseil {
  nom: string;
  contenu: string;
}

/**
 * Valide et convertit tous les articles. Ne s'arrête pas à la première erreur :
 * renvoie la liste complète pour que le rédacteur corrige tout d'un coup.
 * Les articles sont triés du plus récent au plus ancien (puis par titre).
 */
export function construireConseils(
  fichiers: FichierConseil[],
  pages: Map<string, string>,
): { conseils: Conseil[]; erreurs: string[] } {
  const erreurs: string[] = [];
  const valides: Array<{ slug: string; meta: EnTeteConseil; corps: string; fichier: string }> = [];
  const vus = new Map<string, string>();

  for (const f of fichiers) {
    const slug = f.nom.replace(/\.md$/i, '');
    const err = (msg: string) => erreurs.push(`${f.nom} : ${msg}`);
    if (!SLUG.test(slug)) {
      err('nom de fichier invalide : minuscules sans accents, chiffres et tirets seulement (ex. cessation-des-paiements.md)');
      continue;
    }
    const deja = vus.get(slug.toLowerCase());
    if (deja) {
      err(`slug « ${slug} » en double (déjà utilisé par ${deja})`);
      continue;
    }
    vus.set(slug.toLowerCase(), f.nom);
    if (pages.has(`/conseils/${slug}`)) {
      err(`slug « ${slug} » réservé`);
      continue;
    }

    let lu: ReturnType<typeof lireEnTete>;
    try {
      lu = lireEnTete(f.contenu);
    } catch (e) {
      err((e as Error).message);
      continue;
    }
    const resultat = schemaEnTete.safeParse(lu.meta);
    if (!resultat.success) {
      for (const issue of resultat.error.issues) {
        const champ = issue.path.length ? `${issue.path.join('.')} : ` : '';
        err(`${champ}${issue.message}`);
      }
      continue;
    }
    if (!lu.corps.trim()) {
      err('corps de l’article vide');
      continue;
    }
    valides.push({ slug, meta: resultat.data, corps: lu.corps, fichier: f.nom });
  }

  // Les articles valides (publiés, programmés ou brouillons) sont des cibles de lien.
  const titres = new Map(pages);
  for (const v of valides) titres.set(`/conseils/${v.slug}`, v.meta.title);
  const pageExiste = (chemin: string) => titres.has(chemin);

  const conseils: Conseil[] = [];
  for (const v of valides) {
    const err = (msg: string) => erreurs.push(`${v.fichier} : ${msg}`);
    const corps = rendreCorps(v.corps, pageExiste);
    corps.erreurs.forEach(err);

    const liens: LienConseil[] = [];
    for (const href of v.meta.liens) {
      const chemin = cheminDe(href);
      if (!pageExiste(chemin)) {
        err(`liens : page inexistante ${href}`);
        continue;
      }
      if (chemin === `/conseils/${v.slug}`) {
        err(`liens : l’article ne peut pas se citer lui-même (${href})`);
        continue;
      }
      if (liens.some((l) => l.href === href)) continue;
      const conseil = chemin.startsWith('/conseils/') && chemin !== '/conseils/rss.xml' ? chemin.slice('/conseils/'.length) : undefined;
      liens.push({ href, libelle: titres.get(chemin) ?? chemin, ...(conseil ? { conseil } : {}) });
    }

    const m = v.meta;
    conseils.push({
      slug: v.slug,
      title: m.title,
      description: m.description,
      date: m.date,
      miseAJour: m.miseAJour,
      publieLe: minuitParis(m.date),
      modifieLe: minuitParis(m.miseAJour),
      dateLisible: dateEnLettres(m.date),
      miseAJourLisible: dateEnLettres(m.miseAJour),
      theme: m.theme,
      resume: m.resume,
      sources: m.sources,
      liens,
      brouillon: m.brouillon,
      html: corps.html,
      conseilsCites: corps.conseilsCites.filter((s) => s !== v.slug),
    });
  }

  conseils.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, 'fr'));
  return { conseils, erreurs };
}

/** Contenu du module TypeScript généré (lib/conseils/donnees.generated.ts). */
export function moduleDonnees(conseils: Conseil[]): string {
  return [
    '// Fichier GÉNÉRÉ par scripts/generer-conseils.ts à partir de content/conseils/*.md.',
    '// Ne pas modifier à la main ni l’ajouter à git : il est recréé avant chaque build (npm run conseils).',
    "import type { Conseil } from './types';",
    '',
    `export const CONSEILS: readonly Conseil[] = ${JSON.stringify(conseils, null, 2)};`,
    '',
  ].join('\n');
}
