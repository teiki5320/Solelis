import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/aides-personnelles' },
  title: 'Aides personnelles du dirigeant — Solelis',
  description:
    'Vos droits personnels en tant que dirigeant : ATI, RSA, CSS, APL, surendettement, AGEFIPH. Beaucoup de dirigeants les ignorent.',
};

/* ---------- data ---------- */

type Aide = {
  nom: string;
  description: string;
  url?: string;
  urlLabel?: string;
  tel?: string;
  badge?: string;
  badgeColor?: string;
};

type Section = {
  titre: string;
  colorBorder: string;
  colorDot: string;
  aides: Aide[];
};

const sections: Section[] = [
  {
    titre: 'Revenus de remplacement',
    colorBorder: 'border-bleu-fonce',
    colorDot: 'bg-bleu-fonce',
    aides: [
      {
        nom: 'ATI (Allocation des Travailleurs Indépendants)',
        description:
          'De 19,73 à 26,30 € par jour (environ 600 à 800 €/mois) pendant 182 jours (environ 6 mois). Conditions : 2 ans d’activité continue dans la même entreprise, au moins 10 000 € de revenus sur l’une des 2 années précédant l’arrêt, ressources sous le montant du RSA, et perte involontaire de l’activité : liquidation judiciaire, redressement judiciaire dont le plan impose le remplacement du dirigeant, ou activité non viable attestée par un tiers de confiance.',
        url: 'https://chomage-independant.francetravail.fr',
        urlLabel: 'chomage-independant.francetravail.fr',
      },
      {
        nom: 'RSA',
        description:
          'Accessible aux dirigeant·e·s dont les ressources du foyer sont faibles. Conditions : au moins 25 ans (sauf exceptions) ; pour les indépendant·e·s, règles particulières de prise en compte des revenus (pas de salarié·e, chiffre d’affaires plafonné) à vérifier auprès de la CAF ou de la MSA. Depuis le 01/01/2025, inscription automatique à France Travail.',
        url: 'https://www.caf.fr',
        urlLabel: 'caf.fr',
        badge: 'Sous conditions',
        badgeColor: 'text-jaune',
      },
      {
        nom: 'ASS (Allocation de Solidarité Spécifique)',
        description:
          'Après épuisement des droits ARE. 5 ans de travail salarié requis dans les 10 dernières années. Cumulable 3 mois avec une activité non salariée.',
        url: 'https://francetravail.fr',
        urlLabel: 'francetravail.fr',
        badge: 'Si ex-salarié',
        badgeColor: 'text-bleu',
      },
    ],
  },
  {
    titre: 'Santé et logement',
    colorBorder: 'border-vert',
    colorDot: 'bg-vert',
    aides: [
      {
        nom: 'CSS (Complémentaire Santé Solidaire, ex CMU-C)',
        description:
          'Gratuite si les ressources annuelles ne dépassent pas 10 421 € (personne seule, métropole) ; avec une participation financière jusqu’à 14 069 €. Couvre soins, médicaments, optique et dentaire sans avance de frais.',
        url: 'https://www.complementaire-sante-solidaire.gouv.fr',
        urlLabel: 'complementaire-sante-solidaire.gouv.fr',
        tel: '3646',
        badge: 'Gratuit',
        badgeColor: 'text-vert',
      },
      {
        nom: 'APL / ALS',
        description:
          'Aide au logement réexaminée tous les 3 mois. Attention : pour les revenus d’activité indépendante, la CAF retient en principe ceux de l’année N-2, donc une baisse récente n’est pas prise en compte automatiquement. Déclarez vos changements de situation.',
        url: 'https://www.caf.fr',
        urlLabel: 'caf.fr',
      },
      {
        nom: 'Aide juridictionnelle',
        description:
          'Avocat et frais de justice pris en charge si revenus < 12 957 €/an (total) ou < 19 433 € (partiel). Pour vos procédures PERSONNELLES uniquement  -  pas celles de l’entreprise.',
        url: 'https://www.service-public.fr',
        urlLabel: 'service-public.fr',
      },
    ],
  },
  {
    titre: 'Surendettement personnel',
    colorBorder: 'border-rouge',
    colorDot: 'bg-rouge',
    aides: [
      {
        nom: 'Procédure de surendettement (Banque de France)',
        description:
          'Restructure ou efface vos dettes PERSONNELLES (pas celles de l’entreprise). Particulièrement utile si vous avez signé des cautions personnelles. Inscription au FICP pendant 7 ans maximum. La procédure est gratuite et confidentielle.',
        url: 'https://www.banque-france.fr',
        urlLabel: 'banque-france.fr',
        badge: 'Dernier recours',
        badgeColor: 'text-rouge',
      },
    ],
  },
  {
    titre: 'Dirigeant en situation de handicap',
    colorBorder: 'border-bleu',
    colorDot: 'bg-bleu',
    aides: [
      {
        nom: 'AGEFIPH',
        description:
          'Aide de 3 000 € au maximum pour créer ou reprendre une entreprise (personne en situation de handicap, accompagnée en amont par un prestataire habilité qui valide le projet). Si votre handicap compromet la poursuite de votre activité d’indépendant·e, une aide au maintien dans l’emploi existe aussi (demande faite par un conseiller Cap emploi ou Comète).',
        url: 'https://agefiph.fr',
        urlLabel: 'agefiph.fr',
      },
    ],
  },
];

/* ---------- component ---------- */

export default function AidesPersonnellesPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Vos droits personnels
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Vos droits personnels en tant que dirigeant
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          En tant que personne — pas en tant qu’entreprise —
          vous avez des droits. Beaucoup de dirigeants les ignorent.
        </p>
      </div>

      {/* Sections */}
      <div className="mt-12 space-y-10">
        {sections.map((s) => (
          <div key={s.titre} className="glass card-top-line p-6 sm:p-8">
            {/* Section title */}
            <div className="mb-6 flex items-center gap-3">
              <span
                className={`inline-block h-3 w-3 rounded-full ${s.colorDot}`}
                aria-hidden="true"
              />
              <h2 className="font-display text-xl text-navy sm:text-2xl">
                {s.titre}
              </h2>
            </div>

            {/* Aide cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {s.aides.map((a) => (
                <article
                  key={a.nom}
                  className={`glass-soft border-l-4 ${s.colorBorder} flex flex-col p-5`}
                >
                  {/* Name + badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base text-navy">
                      {a.nom}
                    </h3>
                    {a.badge && (
                      <span
                        className={`pastille ${a.badgeColor ?? ''}`}
                      >
                        {a.badge}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-navy/65">
                    {a.description}
                  </p>

                  {/* Links & phone */}
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    {a.url && (
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-bleu-fonce underline underline-offset-4"
                      >
                        {a.urlLabel}
                      </a>
                    )}
                    {a.tel && (
                      <a
                        href={`tel:${a.tel.replace(/\s/g, '')}`}
                        className="pastille"
                      >
                        Tél : {a.tel}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        Ces aides sont cumulables dans certains cas. Un travailleur social de la
        CAF ou de la CPAM peut vous aider à identifier celles auxquelles
        vous avez droit.
      </div>

      {/* Bottom CTA */}
      <div className="mt-10 text-center">
        <a href="/parler" className="btn-primary">
          Vous n’êtes pas seul·e →
        </a>
      </div>
    </section>
  );
}
