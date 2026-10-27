import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { META_PAGE_INTROUVABLE, ogMeta } from '@/lib/og';
import {
  SITE,
  conseilPublie,
  conseilsDuMemeTheme,
  corpsVisible,
  imagePartage,
  jourParis,
  liensVisibles,
} from '@/lib/conseils';
import { CATEGORIES_OG, LIBELLES_THEMES } from '@/lib/conseils/themes';
import { AppelFiche, CLASSES_CORPS, RappelConseil } from '../composants';
import { IllustrationPage } from '@/components/IllustrationPage';

// Rendu à chaque requête (pas de page figée au build ni dans le cache OpenNext) :
// un article programmé apparaît le jour de sa date, sans redéploiement. Le travail
// par requête se limite à un filtre de dates : le HTML est préparé au build.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

const sousTitre = (theme: keyof typeof LIBELLES_THEMES) => `Conseils · ${LIBELLES_THEMES[theme]}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = conseilPublie(slug);
  if (!c) return META_PAGE_INTROUVABLE;
  const m = ogMeta({
    chemin: `/conseils/${c.slug}`,
    titre: c.title,
    sous: sousTitre(c.theme),
    description: c.description,
    cat: CATEGORIES_OG[c.theme],
  });
  return { ...m, alternates: { ...m.alternates, types: { 'application/rss+xml': '/conseils/rss.xml' } } };
}

export default async function ConseilPage({ params }: Props) {
  const { slug } = await params;
  const jour = jourParis();
  const c = conseilPublie(slug, jour);
  if (!c) notFound();

  const url = `${SITE}/conseils/${c.slug}`;
  const liens = liensVisibles(c, jour);
  const memeTheme = conseilsDuMemeTheme(c, jour).filter((a) => !liens.some((l) => l.conseil === a.slug));
  const aVoir = [
    ...liens.map((l) => ({ href: l.href, libelle: l.libelle })),
    ...memeTheme.map((a) => ({ href: `/conseils/${a.slug}`, libelle: a.title })),
  ];

  const organisation = { '@type': 'Organization', '@id': `${SITE}/#organisation`, name: 'Solelis', url: SITE };
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: c.title,
        description: c.description,
        datePublished: c.publieLe,
        dateModified: c.modifieLe,
        inLanguage: 'fr-FR',
        url,
        mainEntityOfPage: url,
        image: `${SITE}${imagePartage(c.title, sousTitre(c.theme), CATEGORIES_OG[c.theme])}`,
        articleSection: LIBELLES_THEMES[c.theme],
        author: organisation,
        publisher: organisation,
        citation: c.sources.map((s) => ({ '@type': 'CreativeWork', name: s.titre, url: s.url })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Conseils', item: `${SITE}/conseils` },
          { '@type': 'ListItem', position: 3, name: c.title },
        ],
      },
    ],
  };

  return (
    <article className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <nav aria-label="Fil d’Ariane" className="mb-6 text-sm text-navy/60">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href="/" className="hover:text-navy">Accueil</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/conseils" className="hover:text-navy">Conseils</Link>
          </li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="text-navy/80">{c.title}</li>
        </ol>
      </nav>

      <p className="mb-3 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
        <Link href={`/conseils?theme=${c.theme}`} className="hover:text-bleu-fonce">
          {LIBELLES_THEMES[c.theme]}
        </Link>
      </p>
      <h1 className="font-display text-3xl leading-tight text-navy sm:text-4xl">{c.title}</h1>
      <p className="mt-3 text-sm text-navy/60">
        Publié le <time dateTime={c.date}>{c.dateLisible}</time> · Mis à jour le{' '}
        <time dateTime={c.miseAJour}>{c.miseAJourLisible}</time>
      </p>

      <IllustrationPage cle={`conseil:${c.slug}`} className="mt-8" />

      <div className="glass card-top-line mt-8 p-6">
        <h2 className="font-display text-xl text-navy">En bref</h2>
        <p className="mt-3 leading-relaxed text-navy/80">{c.resume}</p>
      </div>

      <div className={CLASSES_CORPS} dangerouslySetInnerHTML={{ __html: corpsVisible(c, jour) }} />

      <section className="mt-12 rounded-2xl border border-navy/15 bg-white/60 p-5" aria-labelledby="sources">
        <h2 id="sources" className="font-display text-base text-navy">Sources</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-navy/80">
          {c.sources.map((s) => (
            <li key={s.url + s.titre}>
              <a href={s.url} target="_blank" rel="noreferrer" className="break-words text-bleu-fonce hover:underline">
                {s.titre}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {aVoir.length > 0 && (
        <section className="mt-8" aria-labelledby="a-voir-aussi">
          <h2 id="a-voir-aussi" className="mb-4 font-display text-xl text-navy">À voir aussi</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {aVoir.map((l) => (
              <Link key={l.href} href={l.href} className="glass-soft p-4 text-sm text-bleu-fonce transition hover:bg-white">
                {l.libelle} →
              </Link>
            ))}
          </div>
        </section>
      )}

      <RappelConseil />
      <AppelFiche />
    </article>
  );
}
