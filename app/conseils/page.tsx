import Link from 'next/link';
import type { Metadata } from 'next';
import { ogMeta } from '@/lib/og';
import { SITE, conseilsPublies } from '@/lib/conseils';
import { LIBELLES_THEMES, THEMES_CONSEILS, type ThemeConseil } from '@/lib/conseils/themes';
import { AppelFiche } from './composants';

// Rendu à chaque requête : la liste suit la date du jour (heure de Paris), un
// article programmé y apparaît le jour venu sans redéploiement. Coût : un filtre.
export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ theme?: string | string[] }> };

export async function generateMetadata(): Promise<Metadata> {
  const m = ogMeta({
    chemin: '/conseils',
    titre: 'Conseils aux dirigeant·e·s en difficulté',
    sous: 'Des réponses claires, avec leurs sources officielles',
    description:
      'Dettes, procédures collectives, salariés, aides, protection du dirigeant : des réponses claires aux questions des chefs d’entreprise en difficulté, avec leurs sources officielles.',
    cat: 'faq',
    pageTitle: 'Conseils aux dirigeants en difficulté — Solelis',
  });
  return {
    ...m,
    alternates: { ...m.alternates, types: { 'application/rss+xml': '/conseils/rss.xml' } },
    // Tant qu'aucun article n'est publié, la page n'a pas de contenu à proposer aux moteurs.
    ...(conseilsPublies().length === 0 ? { robots: { index: false, follow: true } } : {}),
  };
}

const estTheme = (v: unknown): v is ThemeConseil => typeof v === 'string' && (THEMES_CONSEILS as readonly string[]).includes(v);

const PUCE = 'rounded-lg px-3 py-1.5 text-xs font-medium transition';
const PUCE_INACTIVE = 'bg-bleu/10 text-bleu hover:bg-bleu/20';
const PUCE_ACTIVE = 'bg-bleu-fonce text-white';

export default async function ConseilsPage({ searchParams }: Props) {
  const { theme } = await searchParams;
  const publies = conseilsPublies();
  const themeActif = estTheme(theme) ? theme : null;
  const themes = THEMES_CONSEILS.filter((t) => publies.some((c) => c.theme === t));
  const liste = themeActif ? publies.filter((c) => c.theme === themeActif) : publies;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Conseils' },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">Conseils</p>
      <h1 className="font-display text-3xl leading-tight text-navy sm:text-4xl">
        Vos questions, des réponses claires
      </h1>
      <p className="mt-3 text-base text-navy/60 sm:text-lg">
        Dettes, procédures, salarié·e·s, aides, protection du dirigeant : une question par article,
        une réponse directe et les sources officielles. Ces articles ne remplacent pas un conseil
        personnalisé.
      </p>

      {themes.length > 1 && (
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Filtrer par thème">
          <Link href="/conseils" aria-current={themeActif ? undefined : 'page'} className={`${PUCE} ${themeActif ? PUCE_INACTIVE : PUCE_ACTIVE}`}>
            Tous
          </Link>
          {themes.map((t) => (
            <Link
              key={t}
              href={`/conseils?theme=${t}`}
              aria-current={t === themeActif ? 'page' : undefined}
              className={`${PUCE} ${t === themeActif ? PUCE_ACTIVE : PUCE_INACTIVE}`}
            >
              {LIBELLES_THEMES[t]}
            </Link>
          ))}
        </nav>
      )}

      {liste.length === 0 ? (
        <div className="mt-10 glass-soft rounded-2xl p-6 text-center text-sm text-navy/70">
          <p>Les premiers articles arrivent très bientôt.</p>
          <p className="mt-2">
            En attendant, les{' '}
            <Link href="/faq" className="text-bleu-fonce underline">
              questions fréquentes
            </Link>{' '}
            et le{' '}
            <Link href="/glossaire" className="text-bleu-fonce underline">
              glossaire
            </Link>{' '}
            répondent déjà à l’essentiel.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {liste.map((c) => (
            <li key={c.slug}>
              <article className="glass-soft rounded-2xl p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wide text-bleu-fonce/70">
                  {LIBELLES_THEMES[c.theme]} · <time dateTime={c.date}>{c.dateLisible}</time>
                </p>
                <h2 className="mt-2 font-display text-lg text-navy sm:text-xl">
                  <Link href={`/conseils/${c.slug}`} className="hover:text-bleu-fonce">
                    {c.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-navy/70">{c.resume}</p>
              </article>
            </li>
          ))}
        </ul>
      )}

      <AppelFiche />
    </section>
  );
}
