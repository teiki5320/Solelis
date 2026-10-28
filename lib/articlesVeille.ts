/**
 * Articles complets des actus AU BUILD (tous ceux de l'index de la veille, articles/solelis/index.json) (jamais à l'exécution) : choix des articles
 * à construire en pages statiques /actus/<slug>, et écriture des modules générés.
 *
 * Utilisé par scripts/articles-veille.ts (Node, sans Next : imports avec l'extension .ts)
 * et par les tests. Les pages lisent les modules générés :
 * - lib/veille-slugs.generated.ts (liste des slugs construits, lue par les cartes d'actus) ;
 * - lib/veille-articles.generated.ts (articles et actus, lus par les pages serveur et le sitemap).
 */
import { z } from 'zod';
import { lireArticle, lireFlux, type Actu, type ArticleActu } from './veille.ts';

/** Segments déjà pris sous /actus : jamais utilisés comme slug d'article. */
const SLUGS_RESERVES = new Set(['article']);

/** Index de tous les articles de la veille (articles/solelis/index.json) : aucun n'en est jamais retiré. */
const indexSchema = z.object({
  version: z.literal(1),
  articles: z.array(z.unknown()),
});
const entreeIndexSchema = z.object({
  id: z.string().regex(/^[0-9a-f]{40}$/),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).max(80),
});

export interface EntreeArticle {
  id: string;
  slug: string;
}

/**
 * Articles à construire : tous ceux de l'index de la veille ; si l'index est illisible,
 * ceux des actus récentes qui ont un slug (comportement d'avant l'index). Jamais d'erreur.
 */
export function entreesArticles(indexBrut: unknown, fluxBrut: unknown): EntreeArticle[] {
  const index = indexSchema.safeParse(indexBrut);
  if (index.success) {
    const entrees: EntreeArticle[] = [];
    for (const brut of index.data.articles) {
      const e = entreeIndexSchema.safeParse(brut);
      if (e.success) entrees.push({ id: e.data.id, slug: e.data.slug });
    }
    return entrees;
  }
  return (lireFlux(fluxBrut)?.actus ?? []).flatMap((a) => (a.slug ? [{ id: a.id, slug: a.slug }] : []));
}

export interface DonneesArticles {
  /** Articles construits en pages, du plus récent au plus ancien. */
  articles: ArticleActu[];
  /** Actus récentes du fichier de la veille (pour le bloc « Autres actus »). */
  actus: Actu[];
}

/**
 * Garde les articles valides dont l'id et le slug correspondent à l'entrée ;
 * écarte les slugs réservés ou en double. Ne lève jamais d'erreur.
 */
export function choisirArticles(entrees: readonly EntreeArticle[], fluxBrut: unknown, articlesBruts: Record<string, unknown>): DonneesArticles {
  const articles: ArticleActu[] = [];
  const vus = new Set<string>();
  for (const e of entrees) {
    if (SLUGS_RESERVES.has(e.slug) || vus.has(e.slug)) continue;
    const article = lireArticle(articlesBruts[e.id]);
    if (!article || article.id !== e.id || article.slug !== e.slug) continue;
    vus.add(e.slug);
    articles.push(article);
  }
  articles.sort((a, b) => Date.parse(b.publie_le) - Date.parse(a.publie_le) || a.slug.localeCompare(b.slug));
  return { articles, actus: lireFlux(fluxBrut)?.actus ?? [] };
}

const ENTETE = '// GÉNÉRÉ par scripts/articles-veille.ts (npm run veille) — ne pas modifier, non versionné.\n';

export function moduleSlugs(d: DonneesArticles): string {
  return `${ENTETE}export const SLUGS_ARTICLES_CONSTRUITS: readonly string[] = ${JSON.stringify(d.articles.map((a) => a.slug))};\n`;
}

export function moduleArticles(d: DonneesArticles): string {
  return (
    `${ENTETE}import type { ArticleActu, Actu } from './veille';\n\n` +
    `export const ARTICLES_VEILLE: readonly ArticleActu[] = ${JSON.stringify(d.articles, null, 1)};\n\n` +
    `export const ACTUS_VEILLE: readonly Actu[] = ${JSON.stringify(d.actus, null, 1)};\n`
  );
}
