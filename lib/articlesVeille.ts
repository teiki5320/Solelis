/**
 * Articles complets des actus AU BUILD (jamais à l'exécution) : choix des articles
 * à construire en pages statiques /actus/<slug>, et écriture des modules générés.
 *
 * Utilisé par scripts/articles-veille.ts (Node, sans Next : imports avec l'extension .ts)
 * et par les tests. Les pages lisent les modules générés :
 * - lib/veille-slugs.generated.ts (liste des slugs construits, lue par les cartes d'actus) ;
 * - lib/veille-articles.generated.ts (articles et actus, lus par les pages serveur et le sitemap).
 */
import { lireArticle, lireFlux, type Actu, type ArticleActu } from './veille.ts';

/** Segments déjà pris sous /actus : jamais utilisés comme slug d'article. */
const SLUGS_RESERVES = new Set(['article']);

export interface DonneesArticles {
  /** Articles construits en pages, dans l'ordre des actus. */
  articles: ArticleActu[];
  /** Actus du fichier de la veille (pour le bloc « Autres actus »). */
  actus: Actu[];
}

/**
 * Garde les articles valides dont l'actu existe et porte le même slug ;
 * écarte les slugs réservés ou en double. Ne lève jamais d'erreur.
 */
export function choisirArticles(fluxBrut: unknown, articlesBruts: Record<string, unknown>): DonneesArticles {
  const flux = lireFlux(fluxBrut);
  if (!flux) return { articles: [], actus: [] };
  const articles: ArticleActu[] = [];
  const vus = new Set<string>();
  for (const actu of flux.actus) {
    if (!actu.slug || SLUGS_RESERVES.has(actu.slug) || vus.has(actu.slug)) continue;
    const article = lireArticle(articlesBruts[actu.id]);
    if (!article || article.id !== actu.id || article.slug !== actu.slug) continue;
    vus.add(actu.slug);
    articles.push(article);
  }
  return { articles, actus: flux.actus };
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
