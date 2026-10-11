import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/procedures' },
  title: 'Quelle procédure pour votre situation ? — Solelis',
  description:
    'Tableau comparatif des procédures collectives : mandat ad hoc, conciliation, sauvegarde, redressement et liquidation judiciaire. Expliqué simplement.',
};

const procedures = [
  {
    nom: 'Mandat ad hoc',
    color: 'border-vert',
    colorDot: 'bg-vert',
    quand:
      'Vous sentez que ça se dégrade, mais vous n’êtes pas encore en cessation',
    quiDecide: 'Vous — c’est volontaire',
    confidentialite: 'Oui — toutes les personnes appelées à la procédure sont tenues à la confidentialité (art. L611-15 C. com.)',
    duree: 'Pas de durée légale : fixée par le président du tribunal',
    controle: 'Oui, totalement',
    cout: 'Rémunération du mandataire fixée par le président du tribunal, avec votre accord (art. L611-14 C. com.)',
    ideal:
      'Vous voulez négocier discrètement avec un créancier',
  },
  {
    nom: 'Conciliation',
    color: 'border-vert',
    colorDot: 'bg-vert',
    quand:
      'Difficultés avérées, cessation depuis moins de 45 jours',
    quiDecide: 'Vous — demande au tribunal',
    confidentialite: 'Oui, sauf si accord homologué',
    duree: '4 mois + 1 mois max',
    controle: 'Oui',
    cout: 'Honoraires du conciliateur',
    ideal:
      'Vous avez besoin d’un médiateur pour trouver un accord global',
  },
  {
    nom: 'Sauvegarde',
    color: 'border-jaune',
    colorDot: 'bg-jaune',
    quand:
      'Difficultés que vous ne pouvez pas surmonter seul·e, AVANT cessation',
    quiDecide: 'Vous — demande au tribunal',
    confidentialite: 'Non — la procédure est publique',
    duree: '6 mois (renouvelable 6 mois)',
    controle: 'Oui, avec un administrateur le cas échéant',
    cout: 'Frais de justice + honoraires administrateur',
    ideal:
      'L’entreprise est viable mais les dettes l’étouffent',
  },
  {
    nom: 'Redressement judiciaire',
    color: 'border-jaune',
    colorDot: 'bg-jaune',
    quand: 'Vous êtes en cessation des paiements',
    quiDecide: 'Vous, un créancier ou le procureur',
    confidentialite: 'Non — publication au BODACC',
    duree: '6 mois, renouvelable 6 mois, et exceptionnellement 6 mois de plus à la demande du procureur : 18 mois max (art. L631-7)',
    controle:
      'Partiellement — un administrateur peut vous assister, voire vous remplacer',
    cout: 'Frais de justice',
    ideal:
      'L’entreprise peut être sauvée avec un plan de restructuration',
  },
  {
    nom: 'Liquidation judiciaire',
    color: 'border-rouge',
    colorDot: 'bg-rouge',
    quand: 'Redressement manifestement impossible',
    quiDecide: 'Le tribunal',
    confidentialite: 'Non',
    duree: 'Variable (6 mois à plusieurs années)',
    controle: 'Non — un liquidateur gère tout',
    cout: 'Frais de justice',
    ideal:
      'L’activité ne peut plus continuer — il faut clore proprement',
  },
];

const labels: Record<string, string> = {
  quand: 'Quand',
  quiDecide: 'Qui décide',
  confidentialite: 'Confidentialité',
  duree: 'Durée',
  controle: 'Le dirigeant garde le contrôle',
  cout: 'Coût',
  ideal: 'Idéal si',
};

const fieldKeys = [
  'quand',
  'quiDecide',
  'confidentialite',
  'duree',
  'controle',
  'cout',
  'ideal',
] as const;

export default function ProceduresPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Comprendre vos options
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Quelle procédure pour votre situation ?
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Un tableau clair pour comprendre vos options — sans jargon.
        </p>
      </div>

      {/* Procedure cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {procedures.map((p) => (
          <article
            key={p.nom}
            className={`glass-soft border-l-4 ${p.color} p-6 sm:p-8`}
          >
            {/* Title with color dot */}
            <div className="mb-5 flex items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${p.colorDot}`}
                aria-hidden="true"
              />
              <h2 className="font-display text-xl text-navy">{p.nom}</h2>
            </div>

            {/* Fields */}
            <dl className="space-y-3 text-sm">
              {fieldKeys.map((key) => (
                <div key={key}>
                  <dt className="font-semibold text-navy/80">
                    {labels[key]}
                  </dt>
                  <dd className="mt-0.5 text-navy/65 leading-relaxed">
                    {p[key]}
                  </dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        Ce tableau est une simplification. Chaque situation est unique —
        un CIP (entretien gratuit et confidentiel) ou un avocat (première consultation
        gratuite possible dans un point-justice, 3039) peuvent vous orienter vers la procédure la plus adaptée.
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link href="/parler" className="btn-primary">
          Besoin de parler ? →
        </Link>
      </div>
    </section>
  );
}
