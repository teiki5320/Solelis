import Link from 'next/link';
import type { Metadata } from 'next';
import { ogMeta } from '@/lib/og';
import { BlocActus } from '@/components/actus/BlocActus';

export const metadata: Metadata = ogMeta({
  chemin: '/actus',
  titre: 'L’actualité des entreprises en difficulté',
  sous: 'Procédures, aides et chiffres, en France',
  description:
    'L’actualité des entreprises en difficulté en France, mise à jour deux fois par jour : procédures, aides, chiffres des défaillances. Résumés clairs, avec le lien vers chaque source.',
  cat: 'procedure',
  pageTitle: 'L’actualité des entreprises en difficulté — Solelis',
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
    { '@type': 'ListItem', position: 2, name: 'Actualité' },
  ],
};

/**
 * Page /actus : les 20 dernières actus de la veille (1 bandeau + vignettes), lues dans le navigateur.
 * Le texte de la page est rendu au serveur ; seules les actus arrivent ensuite. Si la veille ne répond pas,
 * la page reste lisible avec un message court.
 */
export default function ActusPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-3xl">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">Actualité</p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-4xl">
          L’actualité des entreprises en difficulté
        </h1>
        <p className="mt-3 text-base text-navy/70 sm:text-lg">
          Procédures, aides, chiffres : ce qui se passe en France pour les entreprises qui traversent une
          période difficile. Chaque jour, des dirigeant·e·s trouvent une solution, et il en existe
          sûrement une pour vous aussi.
        </p>
        <p className="mt-3 text-sm text-navy/70">
          Pour faire le point sur votre propre situation,{' '}
          <Link href="/" className="text-bleu-fonce underline">
            répondez au questionnaire gratuit
          </Link>{' '}
          ou{' '}
          <Link href="/parler" className="text-bleu-fonce underline">
            parlez à quelqu’un dès maintenant
          </Link>
          .
        </p>
        <p className="mt-3 text-xs text-navy/60">
          Titres et résumés réécrits par Solelis à partir d’articles de presse ; le lien vers chaque source est
          indiqué. Ces actualités ne remplacent pas un conseil personnalisé.
        </p>
      </div>

      <BlocActus
        limite={20}
        avecDate
        className="mt-10"
        siVide={
          <p className="glass-soft rounded-2xl p-6 text-center text-sm text-navy/70">
            Les actualités ne sont pas disponibles pour le moment. Revenez un peu plus tard.
          </p>
        }
      />
    </section>
  );
}
