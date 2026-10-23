import Link from 'next/link';
import { ogMeta } from '@/lib/og';

export const metadata = {
  ...ogMeta({
    chemin: '/dettes-fiscales-sociales',
    titre: 'Dettes fiscales et sociales : les solutions',
    sous: 'Impôts, URSSAF, CCSF : étaler et se défendre',
    description: 'Impôts ou URSSAF impayés : plan de règlement au SIE, échéancier URSSAF, plan unique CCSF, mise en demeure, contrainte. Les délais et les bons réflexes.',
    cat: 'situation',
    pageTitle: 'Dettes fiscales et sociales : les solutions — Solelis',
  }),
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

const JSON_LD_FIL = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
    { '@type': 'ListItem', position: 2, name: 'Dettes fiscales et sociales' },
  ],
};

interface Solution {
  icone: string;
  titre: string;
  pour: string;
  texte: string;
  conseil: { href: string; libelle: string };
  courrier: { href: string; libelle: string };
}

const SOLUTIONS: Solution[] = [
  {
    icone: '🧾',
    titre: 'Plan de règlement des impôts',
    pour: 'TVA, impôt sur les sociétés, CFE impayés',
    texte:
      'Demandez au comptable de votre service des impôts des entreprises (SIE) un plan de règlement, en principe sur deux ans au plus. Il faut être à jour de vos déclarations, proposer un échéancier précis et justifier vos difficultés. Tant que le plan est respecté, les poursuites sont suspendues.',
    conseil: { href: '/conseils/plan-de-reglement-impots', libelle: 'Obtenir un plan de règlement' },
    courrier: { href: '/courriers/echelonnement-impots', libelle: 'Modèle : échelonnement impôts' },
  },
  {
    icone: '🏢',
    titre: 'Échéancier URSSAF',
    pour: 'Cotisations sociales en retard',
    texte:
      'L’URSSAF peut étaler vos cotisations en retard sur 12 mois au plus ; la demande se fait de préférence depuis votre espace en ligne. Ce n’est pas un droit : la demande doit être motivée et, pour un employeur, les cotisations salariales doivent être payées et la DSN transmise.',
    conseil: { href: '/conseils/echeancier-urssaf', libelle: 'Demander un échéancier' },
    courrier: { href: '/courriers/echelonnement-urssaf', libelle: 'Modèle : échelonnement URSSAF' },
  },
  {
    icone: '🤝',
    titre: 'Plan unique CCSF',
    pour: 'Impôts et cotisations à la fois',
    texte:
      'La commission des chefs des services financiers (CCSF) peut accorder un plan unique pour payer progressivement vos dettes fiscales et sociales. Il faut être à jour de vos déclarations et avoir payé la part salariale des cotisations. La saisine est gratuite et confidentielle ; la commission répond sous 2 mois.',
    conseil: { href: '/conseils/ccsf-etaler-dettes-fiscales-sociales', libelle: 'Tout savoir sur la CCSF' },
    courrier: { href: '/courriers/saisine-ccsf', libelle: 'Modèle : saisine de la CCSF' },
  },
];

export default function DettesFiscalesSocialesPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_FIL) }} />
      <Link href="/situation/impots-impayes" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Impôts impayés
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">Dettes fiscales et sociales : les solutions</h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        Impôts et cotisations URSSAF qui s&apos;accumulent : des délais de paiement existent, à condition de les
        demander tôt et de rester à jour de vos déclarations. Voici les trois voies possibles, puis les délais à
        surveiller si un courrier de recouvrement arrive.
      </p>

      <h2 className="mt-10 font-display text-2xl text-navy">Étaler ses dettes : trois voies</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {SOLUTIONS.map((s) => (
          <article key={s.titre} className="glass card-top-line flex flex-col p-6">
            <span className="text-3xl" aria-hidden="true">{s.icone}</span>
            <h3 className="mt-3 font-display text-xl text-navy">{s.titre}</h3>
            <p className="mt-1 text-xs text-navy/55">{s.pour}</p>
            <p className="mt-4 flex-1 text-sm text-navy/80">{s.texte}</p>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <Link href={s.conseil.href} className="text-bleu-fonce underline">
                {s.conseil.libelle}
              </Link>
              <Link href={s.courrier.href} className="text-bleu-fonce underline">
                {s.courrier.libelle}
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-bleu/30 bg-bleu/5 p-6">
        <h2 className="font-display text-xl text-bleu-fonce">Quelle voie choisir ?</h2>
        <ul className="mt-4 space-y-2 text-sm text-navy/80">
          <li>
            <strong>Une seule dette, auprès d&apos;un seul organisme</strong> → demandez d&apos;abord un délai
            directement au SIE ou à l&apos;URSSAF.
          </li>
          <li>
            <strong>Plusieurs dettes publiques (impôts et cotisations)</strong> → la CCSF évite de multiplier les
            démarches et donne une vision d&apos;ensemble.
          </li>
          <li>
            <strong>Problème de financement plus large (banques, investisseurs), moins de 400 salarié·e·s</strong> →
            le CODEFI peut aussi intervenir : voir <Link href="/ciri-codefi" className="text-bleu-fonce underline">CIRI et CODEFI</Link>.
          </li>
        </ul>
      </div>

      <h2 className="mt-10 font-display text-2xl text-navy">Un courrier de recouvrement est arrivé</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <article className="glass card-top-line p-6">
          <h3 className="font-display text-xl text-navy">Mise en demeure de l&apos;URSSAF</h3>
          <p className="mt-3 text-sm text-navy/80">
            Elle vous laisse <strong>un mois pour payer</strong> avant un recouvrement forcé. Si vous ne pouvez pas
            payer, demandez tout de suite un délai ; si vous contestez la somme, saisissez la commission de recours
            amiable <strong>dans les 2 mois</strong>.
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/conseils/mise-en-demeure-urssaf" className="text-bleu-fonce underline">
              Mise en demeure de l&apos;URSSAF : que faire ?
            </Link>
            <Link href="/courriers/contestation-urssaf" className="text-bleu-fonce underline">
              Modèle : contestation de mise en demeure
            </Link>
          </div>
        </article>
        <article className="glass card-top-line p-6">
          <h3 className="font-display text-xl text-navy">Contrainte de l&apos;URSSAF</h3>
          <p className="mt-3 text-sm text-navy/80">
            Vous avez <strong>15 jours</strong> à compter de sa notification ou de sa signification pour former
            opposition devant le tribunal indiqué sur l&apos;acte. Passé ce délai, la contrainte produit les effets
            d&apos;un jugement et l&apos;URSSAF peut faire saisir vos comptes.
          </p>
          <div className="mt-4 text-sm">
            <Link href="/conseils/contrainte-urssaf-contester" className="text-bleu-fonce underline">
              Contrainte URSSAF : quels délais pour contester ?
            </Link>
          </div>
        </article>
      </div>

      <div className="mt-10 rounded-2xl border border-navy/10 bg-white/60 p-6">
        <h2 className="font-display text-xl text-navy">Et les pénalités ?</h2>
        <p className="mt-3 text-sm text-navy/80">
          Intérêts de retard et majorations peuvent faire l&apos;objet d&apos;une demande de remise gracieuse. Notre
          page <Link href="/penalites-fiscales" className="text-bleu-fonce underline">Pénalités fiscales</Link>{' '}
          détaille les taux et les recours.
        </p>
        <p className="mt-3 text-sm text-navy/80">
          Si vous ne pouvez plus payer vos dettes exigibles avec votre trésorerie disponible, lisez{' '}
          <Link href="/conseils/cessation-des-paiements-delai-45-jours" className="text-bleu-fonce underline">
            Cessation des paiements : définition et délai de 45 jours
          </Link>.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/situation/impots-impayes" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Impôts impayés
        </Link>
        <Link href="/faq/urssaf-impayee" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          FAQ URSSAF impayée
        </Link>
        <Link href="/courriers" className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white">
          Modèles de courriers
        </Link>
      </div>

      <p className="mt-12 text-xs text-navy/50">
        Sources : impots.gouv.fr (délais de paiement, CCSF) ; urssaf.fr (délais de paiement) ; Code de la sécurité
        sociale, art. L244-2, R133-3 et R142-1 ; décret n° 2007-686 du 4 mai 2007. Détail et liens dans chaque article.
      </p>
    </section>
  );
}
