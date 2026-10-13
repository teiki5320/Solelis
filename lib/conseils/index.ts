/**
 * Rubrique « Conseils » à l'exécution : uniquement des filtres sur des données
 * préparées au build (HTML déjà prêt, dates déjà mises en forme). Aucun accès
 * aux fichiers ni conversion Markdown ici : quelques microsecondes par requête.
 *
 * Publication programmée : un article apparaît le jour de sa `date`, à 0 h à
 * Paris, sans redéploiement (les pages qui l'affichent sont rendues à la requête).
 */
import { CONSEILS } from './donnees.generated';
import type { Conseil, LienConseil } from './types';

export type { Conseil, LienConseil, SourceConseil, ThemeConseil } from './types';

const FORMAT_JOUR_PARIS = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Paris',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** Date du jour à Paris, au format AAAA-MM-JJ. */
export function jourParis(maintenant: Date = new Date()): string {
  const p = FORMAT_JOUR_PARIS.formatToParts(maintenant);
  const v = (type: string) => p.find((x) => x.type === type)?.value ?? '';
  return `${v('year')}-${v('month')}-${v('day')}`;
}

/** Publié = pas brouillon et date de publication atteinte (le jour même compris). */
export function estPublie(c: Pick<Conseil, 'date' | 'brouillon'>, jour: string): boolean {
  return !c.brouillon && c.date <= jour;
}

/** Articles publiés, du plus récent au plus ancien (ordre préparé au build). */
export function conseilsPublies(jour: string = jourParis(), tous: readonly Conseil[] = CONSEILS): Conseil[] {
  return tous.filter((c) => estPublie(c, jour));
}

/** L'article s'il est publié ce jour, sinon null (→ page 404). */
export function conseilPublie(slug: string, jour: string = jourParis(), tous: readonly Conseil[] = CONSEILS): Conseil | null {
  const c = tous.find((x) => x.slug === slug);
  return c && estPublie(c, jour) ? c : null;
}

/** Jusqu'à `n` autres articles publiés du même thème, les plus récents d'abord. */
export function conseilsDuMemeTheme(
  conseil: Conseil,
  jour: string = jourParis(),
  tous: readonly Conseil[] = CONSEILS,
  n = 3,
): Conseil[] {
  return tous.filter((c) => c.slug !== conseil.slug && c.theme === conseil.theme && estPublie(c, jour)).slice(0, n);
}

/** Slugs des articles pas encore visibles ce jour (programmés ou brouillons). */
function nonPublies(jour: string, tous: readonly Conseil[]): Set<string> {
  return new Set(tous.filter((c) => !estPublie(c, jour)).map((c) => c.slug));
}

/** Liens « À voir aussi » de l'article, sans ceux vers un article pas encore publié. */
export function liensVisibles(conseil: Conseil, jour: string = jourParis(), tous: readonly Conseil[] = CONSEILS): LienConseil[] {
  if (!conseil.liens.some((l) => l.conseil)) return conseil.liens;
  const caches = nonPublies(jour, tous);
  return conseil.liens.filter((l) => !l.conseil || !caches.has(l.conseil));
}

/**
 * Corps HTML de l'article. Un lien vers un article pas encore publié deviendrait
 * une 404 : il est remplacé par son simple texte jusqu'au jour de publication.
 */
export function corpsVisible(conseil: Conseil, jour: string = jourParis(), tous: readonly Conseil[] = CONSEILS): string {
  if (conseil.conseilsCites.length === 0) return conseil.html;
  const caches = nonPublies(jour, tous);
  if (!conseil.conseilsCites.some((s) => caches.has(s))) return conseil.html;
  return conseil.html.replace(/<a href="[^"]*" data-conseil="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (lien, slug: string, texte: string) =>
    caches.has(slug) ? texte : lien,
  );
}

export const SITE = 'https://solelis.com';

/** Entrées du sitemap : /conseils (s'il y a au moins un article publié) et chaque article publié. */
export function entreesSitemapConseils(
  jour: string = jourParis(),
  tous: readonly Conseil[] = CONSEILS,
): Array<{ url: string; lastModified: string; changeFrequency: 'weekly' | 'monthly'; priority: number }> {
  const publies = conseilsPublies(jour, tous);
  if (publies.length === 0) return [];
  const derniere = publies.reduce((max, c) => (c.miseAJour > max ? c.miseAJour : max), publies[0].miseAJour);
  return [
    { url: `${SITE}/conseils`, lastModified: derniere, changeFrequency: 'weekly', priority: 0.8 },
    ...publies.map((c) => ({
      url: `${SITE}/conseils/${c.slug}`,
      lastModified: c.miseAJour,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}

/** Paramètres de l'image de partage /api/og d'un article (mêmes que ceux posés par ogMeta). */
export function imagePartage(titre: string, sous: string, cat: string): string {
  return `/api/og?${new URLSearchParams({ titre, sous, cat }).toString()}`;
}
