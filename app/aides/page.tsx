import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/aides' },
  title: 'Aides financières d’urgence — Solelis',
  description:
    'Annuaire des aides financières d’urgence pour dirigeants en difficulté : Bpifrance, médiation du crédit, activité partielle, aides régionales.',
};

/* ---------- data ---------- */

type Aide = {
  nom: string;
  description: string;
  url?: string;
  urlLabel?: string;
  tel?: string;
  gratuit?: boolean;
};

type Section = {
  titre: string;
  colorBorder: string;
  colorDot: string;
  aides: Aide[];
};

const sections: Section[] = [
  {
    titre: 'Aides nationales',
    colorBorder: 'border-bleu-fonce',
    colorDot: 'bg-bleu-fonce',
    aides: [
      {
        nom: 'Bpifrance — prêts aux TPE/PME',
        description:
          'Prêts et garanties pour TPE/PME, certains proposés avec votre Région. Montants et conditions selon le dispositif : renseignez-vous auprès de la direction régionale Bpifrance.',
        url: 'https://www.bpifrance.fr',
        urlLabel: 'www.bpifrance.fr',
      },
      {
        nom: 'Médiation du crédit',
        description:
          'Si votre banque refuse un prêt ou réduit votre découvert',
        url: 'https://mediateur-credit.banque-france.fr',
        urlLabel: 'mediateur-credit.banque-france.fr',
        gratuit: true,
      },
      {
        nom: 'Médiateur des entreprises',
        description: 'Litiges avec fournisseurs ou clients',
        url: 'https://www.economie.gouv.fr/mediateur-des-entreprises',
        urlLabel: 'economie.gouv.fr/mediateur-des-entreprises',
        gratuit: true,
      },
      {
        nom: 'CCSF',
        description:
          'Échelonnement de vos dettes fiscales et sociales en une seule demande',
        url: 'https://www.impots.gouv.fr',
        urlLabel: 'impots.gouv.fr',
      },
    ],
  },
  {
    titre: 'Aides pour indépendants',
    colorBorder: 'border-vert',
    colorDot: 'bg-vert',
    aides: [
      {
        nom: 'Urssaf · Action sociale du CPSTI',
        description:
          'Aide financière exceptionnelle ou prise en charge de cotisations pour les indépendants en difficulté (attribution au cas par cas)',
        url: 'https://www.urssaf.fr/accueil/services/services-independants/solliciter-action-sociale-cpsti.html',
        urlLabel: 'urssaf.fr',
        tel: '36 98',
      },
      {
        nom: 'Délais de paiement Urssaf',
        description: 'Échéancier pour payer vos cotisations sociales personnelles en retard, à demander à l’Urssaf (accord au cas par cas)',
        url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F38672',
        urlLabel: 'entreprendre.service-public.gouv.fr',
      },
      {
        nom: 'RSA / ASS',
        description:
          'RSA (CAF ou MSA) si les ressources de votre foyer sont faibles ; ASS (France Travail) si vous avez épuisé vos droits au chômage d’ancien·ne salarié·e',
        url: 'https://www.caf.fr',
        urlLabel: 'caf.fr',
      },
    ],
  },
  {
    titre: 'Aides pour employeurs',
    colorBorder: 'border-jaune',
    colorDot: 'bg-jaune',
    aides: [
      {
        nom: 'Activité partielle',
        description:
          'Indemnisation des salariés si baisse d’activité',
        url: 'https://www.asp.gouv.fr',
        urlLabel: 'asp.gouv.fr',
      },
      {
        nom: 'AGS',
        description:
          'Garantie des salaires si redressement/liquidation',
        url: 'https://ags-garantie-salaires.org',
        urlLabel: 'ags-garantie-salaires.org',
      },
      {
        nom: 'FNE-Formation',
        description:
          'Financement de formations pour vos salariés pendant la difficulté',
        url: 'https://www.travail-emploi.gouv.fr',
        urlLabel: 'travail-emploi.gouv.fr',
      },
    ],
  },
  {
    titre: "Dispositifs de l’État",
    colorBorder: 'border-navy',
    colorDot: 'bg-navy',
    aides: [
      {
        nom: 'CODEFI',
        description:
          "Comité départemental d’examen des problèmes de financement des entreprises. Peut faire réaliser un audit (sous conditions) et accorder des prêts du FDES pour une restructuration. Entreprises < 400 salariés. Contact : secrétaire permanent du CODEFI à la DDFiP (Direction départementale des finances publiques).",
        url: 'https://www.impots.gouv.fr/professionnel/accompagnement-individualise-en-cas-de-difficultes-economiques-et-financieres',
        urlLabel: 'impots.gouv.fr',
        gratuit: true,
      },
      {
        nom: 'CIRI',
        description:
          "Comité interministériel de restructuration industrielle. Entreprises > 400 salariés.",
        url: 'https://www.tresor.economie.gouv.fr/services-aux-entreprises/comite-interministeriel-de-restructuration-industrielle',
        urlLabel: 'tresor.economie.gouv.fr',
        tel: '01 44 87 72 58',
      },
      {
        nom: 'CRP',
        description:
          "Commissaire aux restructurations et à la prévention des difficultés des entreprises, présent dans chaque région. Diagnostic + négociation avec créanciers. Contact via la préfecture de région.",
        url: 'https://www.economie.gouv.fr',
        urlLabel: 'economie.gouv.fr',
        gratuit: true,
      },
      {
        nom: 'Conseillers-Entreprises',
        description:
          "Service public d’accompagnement des TPE et PME : décrivez votre situation en ligne, un·e conseiller·ère de votre territoire vous rappelle.",
        url: 'https://conseillers-entreprises.service-public.gouv.fr',
        urlLabel: 'conseillers-entreprises.service-public.gouv.fr',
        gratuit: true,
      },
      {
        nom: 'MAPi (Infogreffe)',
        description:
          "Moteur de recherche d’aides publiques selon votre situation.",
        url: 'https://mesaidespubliques.infogreffe.fr',
        urlLabel: 'mesaidespubliques.infogreffe.fr',
        gratuit: true,
      },
    ],
  },
  {
    titre: 'Aides régionales',
    colorBorder: 'border-bleu',
    colorDot: 'bg-bleu',
    aides: [
      {
        nom: 'Votre région',
        description:
          "Chaque région propose des aides spécifiques (fonds d’urgence, prêts d’honneur, accompagnement). Contactez votre CCI locale pour connaître les dispositifs de votre territoire.",
      },
    ],
  },
];

/* ---------- component ---------- */

export default function AidesPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 pt-6 pb-20 sm:pt-14">
      {/* Header */}
      <div className="text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-bleu-fonce/70">
          Vos droits
        </p>
        <h1 className="font-display text-3xl leading-tight text-navy sm:text-5xl">
          Aides financières d’urgence
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-navy/70 sm:text-lg">
          Beaucoup de dirigeants ignorent qu’ils ont droit à ces
          aides. Vérifiez.
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
                  {/* Name + gratuit badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-base text-navy">
                      {a.nom}
                    </h3>
                    {a.gratuit && (
                      <span className="pastille text-vert">Gratuit</span>
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
                        Tel : {a.tel}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* CCI button for regional section */}
            {s.titre === 'Aides régionales' && (
              <div className="mt-6 text-center">
                <a
                  href="https://www.cci.fr"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary"
                >
                  Trouver ma CCI → cci.fr
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="dashed-band mt-12 p-6 text-center text-sm leading-relaxed text-navy/70">
        Ces aides évoluent. Vérifiez les conditions actuelles
        directement auprès de chaque organisme.
      </div>
    </section>
  );
}
