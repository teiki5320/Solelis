/**
 * Veille actus : actualités des entreprises en difficulté en France, préparées 2 fois par jour
 * (12 h et 19 h) dans le dépôt public teiki5320/veille et publiées sur GitHub Pages.
 * Le site ne fait que lire ce fichier, dans le navigateur du visiteur (rien n'est reconstruit,
 * rien n'est envoyé à la veille). Schéma : veille/schema/actus-schema-v3.json.
 *
 * Règles : le titre original n'est jamais dans le fichier ; on affiche toujours la source
 * (avec son lien) et le crédit de l'image. Aucune actu sur l'accueil (consigne de Jean) :
 * seulement /actus et, si c'est pertinent, les pages situation.
 */
import { z } from 'zod';

export const URL_VEILLE = 'https://teiki5320.github.io/veille/actus/solelis.json';

/** Toutes les images des actus sont copiées sur la veille : aucune autre origine n'est acceptée. */
const ORIGINE_IMAGES = 'https://teiki5320.github.io/veille/';

const lienWeb = z.string().regex(/^https?:\/\//);
const texte = z.string().trim().min(1);

export const imageActuSchema = z.object({
  url: z.string().refine((u) => u.startsWith(ORIGINE_IMAGES), 'image hors de la veille'),
  source: z.enum(['wikimedia', 'openverse', 'banque', 'carte']),
  credit: texte,
  licence: z.string().nullable().optional(),
  page: lienWeb.nullable().optional(),
  alt: texte,
  mots_cles: z.array(z.string()).optional(),
  largeur: z.number().int().positive(),
  hauteur: z.number().int().positive(),
});

export const actuSchema = z.object({
  id: texte,
  /** Titre reformulé (jamais le titre original). */
  titre: texte,
  /** Résumé réécrit, en français. */
  resume: texte,
  theme: z.string().optional(),
  pays: z.array(z.string()).optional(),
  /** Liens vers les pages du site, ex. `situation:dettes-urssaf`. */
  tags: z.array(z.string()).optional(),
  source_nom: texte,
  source_url: lienWeb,
  autres_sources: z.array(z.string()).optional(),
  publie_le: texte,
  collecte_le: z.string().optional(),
  langue: z.string().optional(),
  image: imageActuSchema,
  /** Article complet (veille, depuis le 28/10/2026) : absent tant que l'article n'est pas rédigé. */
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80).optional(),
  article_url: z.string().optional(),
  lecture_min: z.number().int().positive().optional(),
});

/** Article complet d'une actu : articles/solelis/<id>.json (schéma veille/schema/article-schema-v1.json). */
export const articleSchema = z.object({
  version: z.literal(1),
  site: z.string(),
  id: z.string().regex(/^[0-9a-f]{40}$/),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80),
  titre: texte,
  chapo: texte,
  blocs: z
    .array(z.object({ intertitre: z.string().trim().min(1).nullable().optional(), paragraphes: z.array(texte).min(1) }))
    .min(1),
  mots: z.number().int().positive(),
  lecture_min: z.number().int().positive(),
  theme: z.string().optional(),
  pays: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  source_nom: texte,
  source_url: lienWeb,
  autres_sources: z.array(lienWeb).optional(),
  publie_le: texte,
  redige_le: texte,
  image: imageActuSchema,
});

export type ArticleActu = z.infer<typeof articleSchema>;

/**
 * Dossier des articles complets sur la veille. NEXT_PUBLIC_VEILLE_ARTICLES (facultatif) sert
 * seulement aux essais en local (copie d'exemple servie par le site) ; jamais réglé en production.
 */
export const URL_ARTICLES = process.env.NEXT_PUBLIC_VEILLE_ARTICLES || 'https://teiki5320.github.io/veille/articles/solelis/';

/** Identifiant d'actu accepté par la page de secours (empreinte de 40 caractères hexadécimaux). */
export function idActuValide(id: string | null | undefined): id is string {
  return typeof id === 'string' && /^[0-9a-f]{40}$/.test(id);
}

/** Chemin de la page de secours d'un article (rendue dans le navigateur, noindex). */
export function cheminSecours(id: string): string {
  return `/actus/article?id=${id}`;
}

/**
 * Où mène une carte d'actu :
 * 1. la page construite `/actus/<slug>` si elle existe ;
 * 2. sinon la page de secours, si la veille a déjà rédigé l'article (`article_url`) ;
 * 3. sinon l'article d'origine (lien externe), comme avant les articles complets.
 */
export function lienActu(actu: Actu, slugsConstruits: ReadonlySet<string> | readonly string[]): { href: string; externe: boolean } {
  const construits = slugsConstruits instanceof Set ? slugsConstruits : new Set(slugsConstruits as readonly string[]);
  if (actu.slug && construits.has(actu.slug)) return { href: `/actus/${actu.slug}`, externe: false };
  if (actu.article_url && idActuValide(actu.id)) return { href: cheminSecours(actu.id), externe: false };
  return { href: actu.source_url, externe: true };
}

/** Lit un article reçu : null s'il n'a pas la forme attendue. */
export function lireArticle(donnees: unknown): ArticleActu | null {
  const r = articleSchema.safeParse(donnees);
  return r.success ? r.data : null;
}

/**
 * Charge un article complet dans le navigateur (page de secours) : délai de 8 s,
 * requête anonyme, null si l'identifiant est invalide, l'article absent ou abîmé.
 */
export async function chargerArticle(id: string, base: string = URL_ARTICLES): Promise<ArticleActu | null> {
  if (!idActuValide(id)) return null;
  const controle = new AbortController();
  const minuteur = setTimeout(() => controle.abort(), DELAI_MS);
  try {
    const rep = await fetch(`${base}${id}.json`, { signal: controle.signal, cache: 'no-cache', credentials: 'omit', referrerPolicy: 'no-referrer' });
    if (!rep.ok) return null;
    const article = lireArticle(await rep.json());
    return article && article.id === id ? article : null;
  } catch {
    return null;
  } finally {
    clearTimeout(minuteur);
  }
}

/** Date lisible et stable (heure de Paris) : « 27 octobre 2026 », « 1er novembre 2026 ». */
export function dateLongue(iso: string): string {
  const date = new Date(iso);
  if (!iso || Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' })
    .format(date)
    .replace(/^1 /, '1er ');
}

export type ImageActu = z.infer<typeof imageActuSchema>;
export type Actu = z.infer<typeof actuSchema>;

export interface FluxActus {
  version: 3;
  genere_le: string;
  actus: Actu[];
}

const enteteSchema = z.object({ version: z.literal(3), genere_le: z.string().optional(), actus: z.array(z.unknown()) });

/**
 * Lit le fichier reçu : null s'il n'a pas la forme attendue.
 * Une actu incomplète ou douteuse est écartée seule, sans faire tomber les autres.
 */
export function lireFlux(donnees: unknown): FluxActus | null {
  const entete = enteteSchema.safeParse(donnees);
  if (!entete.success) return null;
  const actus: Actu[] = [];
  for (const brut of entete.data.actus) {
    const r = actuSchema.safeParse(brut);
    if (r.success) actus.push(r.data);
  }
  return { version: 3, genere_le: entete.data.genere_le ?? '', actus };
}

const DELAI_MS = 8000;
const CACHE_CLE = 'solelis-veille-v3';
const CACHE_DUREE_MS = 15 * 60 * 1000;

function lireCache(): FluxActus | null {
  try {
    const brut = sessionStorage.getItem(CACHE_CLE);
    if (!brut) return null;
    const { t, flux } = JSON.parse(brut) as { t: unknown; flux: unknown };
    if (typeof t !== 'number' || Date.now() - t > CACHE_DUREE_MS) return null;
    return lireFlux(flux);
  } catch {
    return null;
  }
}

function ecrireCache(flux: FluxActus) {
  try {
    sessionStorage.setItem(CACHE_CLE, JSON.stringify({ t: Date.now(), flux }));
  } catch {
    // Navigation privée ou stockage plein : on rechargera la prochaine fois.
  }
}

let enCours: Promise<FluxActus | null> | null = null;

/**
 * Charge le fichier des actus (navigateur seulement) : délai de 8 s, cache de 15 min dans sessionStorage.
 * Ne lève jamais d'erreur : null si le fichier est absent, trop lent ou abîmé.
 * Requête anonyme : ni cookie ni adresse de la page envoyés.
 */
export function chargerFlux(url: string = URL_VEILLE): Promise<FluxActus | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  const cache = lireCache();
  if (cache) return Promise.resolve(cache);
  if (enCours) return enCours;
  enCours = (async () => {
    const controle = new AbortController();
    const minuteur = setTimeout(() => controle.abort(), DELAI_MS);
    try {
      const rep = await fetch(url, { signal: controle.signal, cache: 'no-cache', credentials: 'omit', referrerPolicy: 'no-referrer' });
      if (!rep.ok) return null;
      const flux = lireFlux(await rep.json());
      if (flux) ecrireCache(flux);
      return flux;
    } catch {
      return null;
    } finally {
      clearTimeout(minuteur);
      enCours = null;
    }
  })();
  return enCours;
}

/** Les actus seules ; [] en cas de problème (la page ne casse jamais). */
export async function chargerActus(url: string = URL_VEILLE): Promise<Actu[]> {
  return (await chargerFlux(url))?.actus ?? [];
}

/** Actus portant un tag (`situation:dettes-urssaf`), dans la limite demandée. */
export function filtrerActus(actus: Actu[], { tag, limite }: { tag?: string; limite: number }): Actu[] {
  return (tag ? actus.filter((a) => a.tags?.includes(tag)) : actus).slice(0, limite);
}

/** Image carrée : la version « -carre.webp » pour une photo ; la carte SVG est recadrée à l'affichage. */
export function imageCarree(image: ImageActu): string {
  return image.source !== 'carte' && image.url.endsWith('.webp') ? image.url.replace(/\.webp$/, '-carre.webp') : image.url;
}

/** Âge d'une actu : « à l'instant », « il y a 12 min », « il y a 3 h », « il y a 2 j », puis la date. */
export function ageActu(iso: string, maintenant: Date = new Date()): string {
  const date = new Date(iso);
  const minutes = Math.floor((maintenant.getTime() - date.getTime()) / 60000);
  if (Number.isNaN(minutes)) return '';
  if (minutes < 1) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return `il y a ${heures} h`;
  const jours = Math.floor(heures / 24);
  if (jours < 7) return `il y a ${jours} j`;
  const jour = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'Europe/Paris' }).format(date);
  return `le ${jour}`.replace(/^le 1 /, 'le 1er ');
}

/** Date de mise à jour du fichier : « 27 octobre 2026 à 12 h 05 » (heure de Paris). */
export function dateMiseAJour(iso: string): string {
  const date = new Date(iso);
  if (!iso || Number.isNaN(date.getTime())) return '';
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Paris' })
      .formatToParts(date)
      .map((x) => [x.type, x.value]),
  );
  return `${p.day === '1' ? '1er' : p.day} ${p.month} ${p.year} à ${Number(p.hour)} h ${p.minute}`;
}
