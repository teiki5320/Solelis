import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { META_PAGE_INTROUVABLE } from '@/lib/og';
import { SITUATIONS as DATA } from '@/lib/situations';
import { BlocActus } from '@/components/actus/BlocActus';
import { ACTUS_VEILLE, GENERE_LE_VEILLE } from '@/lib/veille-articles.generated';
import { IllustrationPage } from '@/components/IllustrationPage';

export function generateStaticParams() {
  return Object.keys(DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = DATA[slug];
  if (!d) return META_PAGE_INTROUVABLE;
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: { canonical: `/situation/${slug}` },
  };
}

export default async function SituationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DATA[slug];
  if (!d) return notFound();

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Situations', item: 'https://solelis.com/situation' },
      { '@type': 'ListItem', position: 3, name: d.titre },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Link href="/situation" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Toutes les situations
      </Link>

      <h1 className="font-display text-2xl leading-tight text-navy sm:text-4xl">
        {d.titre}
      </h1>
      <p className="mt-4 text-navy/70">{d.intro}</p>

      <IllustrationPage cle={`situation:${slug}`} className="mt-8" />

      <div className="glass card-top-line mt-8 p-6">
        <h2 className="font-display text-xl text-navy">Ce que dit la loi</h2>
        <p className="mt-3 text-sm text-navy/80 leading-relaxed">{d.loi}</p>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl text-navy">Vos options concrètes</h2>
        <div className="space-y-3">
          {d.etapes.map((e, i) => (
            <div key={i} className="glass-soft flex items-start gap-4 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bleu-fonce text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <p className="font-display text-base text-navy">{e.titre}</p>
                <p className="mt-1 text-sm text-navy/70">{e.texte}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {d.courrier && (
        <div className="dashed-band mt-8 flex items-center justify-between gap-4 p-5">
          <p className="text-sm text-navy/70">Un modèle de courrier est disponible pour cette situation.</p>
          <Link href={`/courriers/${d.courrier.slug}`} className="btn-primary shrink-0 text-sm">
            {d.courrier.label} →
          </Link>
        </div>
      )}

      {/* Après les étapes et le courrier, jamais en haut de page : 3 actus de la situation au plus,
          bloc absent s'il n'y en a aucune (ou si la veille ne répond pas). */}
      <BlocActus
        titre="Dans l'actualité"
        limite={3}
        tag={`situation:${slug}`}
        bandeau={false}
        initiales={{ actus: ACTUS_VEILLE, genereLe: GENERE_LE_VEILLE }}
        className="mt-10"
      />

      <div className="mt-8">
        <h2 className="mb-4 font-display text-xl text-navy">Ressources utiles</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {d.ressources.map((r, i) => (
            <Link key={i} href={r.href} className="glass-soft p-4 text-sm text-bleu-fonce transition hover:bg-white">
              {r.label} →
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="mb-4 text-sm text-navy/60">Prêt à faire le point sur votre situation ?</p>
        <Link href="/" className="btn-primary">Commencer le diagnostic Solelis →</Link>
      </div>
    </section>
  );
}
