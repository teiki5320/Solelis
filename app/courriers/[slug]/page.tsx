import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { COURRIERS, getCourrier } from '@/lib/courriers';
import { DESCRIPTION_MAX, META_PAGE_INTROUVABLE, ogMeta } from '@/lib/og';
import CourrierDetail from './CourrierDetail';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Les 17 modèles sont générés au build ; tout autre slug → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COURRIERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const courrier = getCourrier(slug);
  if (!courrier) return META_PAGE_INTROUVABLE;
  const complement = ' Modèle gratuit, prérempli avec les informations de votre entreprise, prêt à copier ou imprimer.';
  return ogMeta({
    titre: courrier.titre,
    sous: `Modèle de courrier · ${courrier.destinataire}`,
    // Le complément seulement s'il tient dans la description affichée par Google.
    description:
      courrier.descriptionRecherche ??
      (courrier.description.length + complement.length <= DESCRIPTION_MAX ? courrier.description + complement : courrier.description),
    cat: 'courrier',
    pageTitle: courrier.titreRecherche ?? `${courrier.titre} : modèle de courrier — Solelis`,
    chemin: `/courriers/${courrier.slug}`,
  });
}

export default async function CourrierPage({ params }: PageProps) {
  const { slug } = await params;
  const courrier = getCourrier(slug);
  if (!courrier) notFound();

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Courriers', item: 'https://solelis.com/courriers' },
      { '@type': 'ListItem', position: 3, name: courrier.titre },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <CourrierDetail slug={courrier.slug} />
    </>
  );
}
