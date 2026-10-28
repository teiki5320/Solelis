import Link from 'next/link';
import type { Metadata } from 'next';
import { conseilPublie } from '@/lib/conseils';

export const metadata: Metadata = {
  alternates: { canonical: '/situation' },
  title: 'Situations d\'entreprise en difficulté — Solelis',
  description: 'Guides pratiques pour chaque type de difficulté : URSSAF, fournisseurs, banque, impôts.',
};

const SITUATIONS = [
  { slug: 'dettes-urssaf', titre: 'Dettes URSSAF', desc: 'Échelonnement, prescription, contestation', icone: '🏛️', couleur: 'border-l-rouge', conseils: ['mise-en-demeure-urssaf', 'echeancier-urssaf', 'contrainte-urssaf-contester'] },
  { slug: 'dettes-fournisseurs', titre: 'Dettes fournisseurs', desc: 'Négociation amiable, médiation', icone: '🤝', couleur: 'border-l-bleu', conseils: ['fournisseur-impaye-menace', 'assignation-tribunal-creancier', 'procedure-de-conciliation'] },
  { slug: 'credit-bancaire', titre: 'Crédit bancaire', desc: 'Médiation du crédit, découvert, prêt refusé', icone: '🏦', couleur: 'border-l-bleu-fonce', conseils: ['pge-impossible-a-rembourser', 'caution-personnelle-dirigeant', 'mandat-ad-hoc'] },
  { slug: 'impots-impayes', titre: 'Impôts impayés', desc: 'Délais de paiement, CCSF, remise gracieuse', icone: '📋', couleur: 'border-l-jaune', conseils: ['plan-de-reglement-impots', 'ccsf-etaler-dettes-fiscales-sociales'] },
];

const jsonLdBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
    { '@type': 'ListItem', position: 2, name: 'Situations' },
  ],
};

export default function SituationsPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <div className="mb-10 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-bleu-fonce/70">Guides pratiques</p>
        <h1 className="mt-2 font-display text-3xl text-navy sm:text-5xl">Quelle est votre situation ?</h1>
        <p className="mx-auto mt-4 max-w-xl text-navy/70">
          Chaque situation a ses solutions. Cliquez sur celle qui vous concerne pour voir vos options concrètes.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {SITUATIONS.map((s) => (
          <Link key={s.slug} href={`/situation/${s.slug}`} className={`glass-soft flex items-start gap-4 border-l-4 ${s.couleur} p-5 transition hover:bg-white`}>
            <span className="text-2xl" aria-hidden>{s.icone}</span>
            <div>
              <p className="font-display text-lg text-navy">{s.titre}</p>
              <p className="mt-1 text-sm text-navy/55">{s.desc}</p>
            </div>
          </Link>
        ))}
      </div>
      {/* Articles Conseils liés à chaque situation (seulement ceux déjà publiés). */}
      <div className="mt-12">
        <h2 className="mb-4 font-display text-xl text-navy">Nos conseils pour chaque situation</h2>
        <div className="space-y-6">
          {SITUATIONS.map((s) => {
            const articles = s.conseils.map((slug) => conseilPublie(slug)).filter((c) => c !== null);
            if (articles.length === 0) return null;
            return (
              <div key={s.slug}>
                <p className="mb-2 font-display text-base text-navy">{s.titre}</p>
                <div className="grid gap-3">
                  {articles.map((c) => (
                    <Link key={c.slug} href={`/conseils/${c.slug}`} className="glass-soft p-4 text-sm text-bleu-fonce transition hover:bg-white">
                      {c.title} →
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/" className="btn-primary">Commencer le diagnostic Solelis →</Link>
      </div>
    </section>
  );
}
