import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { META_PAGE_INTROUVABLE } from '@/lib/og';
import { ACTUS_VEILLE, ARTICLES_VEILLE } from '@/lib/veille-articles.generated';
import { fichesDesTags } from '@/lib/fichesVeille';
import { ArticleActu, autresActus } from '@/components/actus/ArticleActu';

const SITE = 'https://solelis.com';

// Pages figées au build (2 constructions par jour, après la veille) : seuls les articles
// lus à ce moment existent ; les plus récents passent par la page de secours /actus/article.
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

const trouver = (slug: string) => ARTICLES_VEILLE.find((a) => a.slug === slug);

export function generateStaticParams() {
  return ARTICLES_VEILLE.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = trouver((await params).slug);
  if (!article) return META_PAGE_INTROUVABLE;
  const chemin = `/actus/${article.slug}`;
  const image = { url: article.image.url, width: article.image.largeur, height: article.image.hauteur, alt: article.image.alt };
  return {
    title: article.titre,
    description: article.chapo,
    alternates: { canonical: chemin },
    openGraph: {
      title: article.titre,
      description: article.chapo,
      type: 'article',
      siteName: 'Solelis',
      locale: 'fr_FR',
      url: chemin,
      publishedTime: article.publie_le,
      modifiedTime: article.redige_le,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title: article.titre, description: article.chapo, images: [article.image.url] },
  };
}

export default async function ArticleActuPage({ params }: Props) {
  const article = trouver((await params).slug);
  if (!article) notFound();

  const url = `${SITE}/actus/${article.slug}`;
  const organisation = { '@type': 'Organization', '@id': `${SITE}/#organisation`, name: 'Solelis', url: SITE };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        '@id': `${url}#article`,
        headline: article.titre,
        description: article.chapo,
        datePublished: article.publie_le,
        dateModified: article.redige_le,
        inLanguage: 'fr-FR',
        url,
        mainEntityOfPage: url,
        image: [article.image.url],
        wordCount: article.mots,
        author: organisation,
        publisher: organisation,
        isBasedOn: article.source_url,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Actus', item: `${SITE}/actus` },
          { '@type': 'ListItem', position: 3, name: article.titre },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ArticleActu article={article} autres={autresActus(ACTUS_VEILLE, article.id)} fiches={fichesDesTags(article.tags)} />
    </>
  );
}
