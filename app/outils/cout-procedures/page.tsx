'use client';
import Link from 'next/link';

interface Fiche {
  procedure: string;
  icone: string;
  couleur: string;
  type: 'amiable' | 'collective';
  confidentiel: boolean;
  duree: string;
  greffe: string;
  mandataire: string;
  avocat: string;
  sources: string[];
}

// Aucun montant chiffré : les rémunérations dépendent du dossier. On indique
// seulement qui les fixe et sur quelle base légale (sources officielles).
const GREFFE_TARIF = 'Tarif réglementé (C. com. art. L444-1 et s.)';
const AVOCAT_LIBRE = 'Honoraires libres, convention d\'honoraires écrite obligatoire (loi n° 71-1130, art. 10)';
const REMUNERATION_AMIABLE =
  'Fixée par le président du tribunal avec votre accord ; ni forfait d\'ouverture de dossier, ni pourcentage des abandons de créances (C. com. art. L611-14)';
const REMUNERATION_COLLECTIVE =
  'Tarif réglementé, à la charge de la procédure (C. com. art. L444-1 et R663-3 et s.)';

const PROCEDURES: Fiche[] = [
  {
    procedure: 'Mandat ad hoc',
    icone: '🤝',
    couleur: 'border-bleu/40 bg-bleu/5',
    type: 'amiable',
    confidentiel: true,
    duree: 'fixée par le président du tribunal',
    greffe: GREFFE_TARIF,
    mandataire: REMUNERATION_AMIABLE,
    avocat: `${AVOCAT_LIBRE} — facultatif`,
    sources: ['C. com. art. L611-3 et L611-14'],
  },
  {
    procedure: 'Conciliation',
    icone: '🫱🏻‍🫲🏿',
    couleur: 'border-vert/40 bg-vert/5',
    type: 'amiable',
    confidentiel: true,
    duree: '4 mois, 5 mois au plus avec prorogation',
    greffe: GREFFE_TARIF,
    mandataire: REMUNERATION_AMIABLE,
    avocat: AVOCAT_LIBRE,
    sources: ['C. com. art. L611-4 à L611-16'],
  },
  {
    procedure: 'Sauvegarde',
    icone: '🛡️',
    couleur: 'border-jaune/40 bg-jaune/5',
    type: 'collective',
    confidentiel: false,
    duree: 'observation de 6 mois renouvelable une fois (12 mois au plus), puis plan de 10 ans au plus',
    greffe: GREFFE_TARIF,
    mandataire: REMUNERATION_COLLECTIVE,
    avocat: AVOCAT_LIBRE,
    sources: ['C. com. art. L620-1, L621-3, L626-12'],
  },
  {
    procedure: 'Redressement judiciaire (RJ)',
    icone: '⚖️',
    couleur: 'border-rouge/30 bg-rouge/5',
    type: 'collective',
    confidentiel: false,
    duree: 'observation de 6 mois renouvelable (18 mois au plus), puis plan de 10 ans au plus',
    greffe: GREFFE_TARIF,
    mandataire: REMUNERATION_COLLECTIVE,
    avocat: AVOCAT_LIBRE,
    sources: ['C. com. art. L631-1, L631-7, L631-19'],
  },
  {
    procedure: 'Liquidation judiciaire simplifiée',
    icone: '🔚',
    couleur: 'border-navy/30 bg-navy/5',
    type: 'collective',
    confidentiel: false,
    duree: '6 mois ou 1 an selon la taille de l\'entreprise, prorogeable de 3 mois',
    greffe: GREFFE_TARIF,
    mandataire: `${REMUNERATION_COLLECTIVE} ; si l'actif est insuffisant, une indemnité est versée par un fonds dédié (art. L663-3)`,
    avocat: AVOCAT_LIBRE,
    sources: ['C. com. art. L641-1, L644-1 à L644-6, L663-3'],
  },
  {
    procedure: 'Rétablissement professionnel (PRP)',
    icone: '♻️',
    couleur: 'border-vert/30 bg-vert/5',
    type: 'collective',
    confidentiel: false,
    duree: '4 mois',
    greffe: GREFFE_TARIF,
    mandataire: 'Rémunération prélevée sur un fonds alimenté par les intérêts versés par la Caisse des dépôts (C. com. art. L663-3-1)',
    avocat: AVOCAT_LIBRE,
    sources: ['C. com. art. L645-1 à L645-12, L663-3-1'],
  },
];

export default function CoutProceduresPage() {
  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comparer le coût des procédures',
    description:
      'Comparez qui fixe et qui paie les frais des procédures amiables et collectives (mandat ad hoc, conciliation, sauvegarde, RJ, LJ, PRP).',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Comparer les procédures',
        text: 'Consultez pour chaque procédure la durée légale, les frais de greffe, la rémunération du mandataire et les honoraires d\'avocat.',
      },
      {
        '@type': 'HowToStep',
        name: 'Identifier les solutions de financement',
        text: 'Vérifiez les options de prise en charge : aide juridictionnelle, consultation gratuite, fonds dédié (PRP).',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Coût des procédures' },
    ],
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Link
        href="/outils"
        className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy"
      >
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Coût des procédures
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Qui fixe et qui paie les frais (greffe, mandataire, avocat) pour
        chaque procédure. Les montants dépendent de votre dossier :
        demandez une estimation écrite avant de vous engager.
      </p>

      <div className="mt-8 grid gap-4">
        {PROCEDURES.map((p) => (
          <div key={p.procedure} className={`rounded-2xl border p-5 ${p.couleur}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-xl text-navy">
                  <span className="mr-2" aria-hidden>{p.icone}</span>
                  {p.procedure}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="pastille">{p.type === 'amiable' ? 'Procédure amiable' : 'Procédure collective'}</span>
                  <span className="pastille">{p.confidentiel ? 'Confidentielle' : 'Publique'}</span>
                  <span className="pastille">Durée : {p.duree}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-navy/80 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase text-navy/55">Frais de greffe</p>
                <p>{p.greffe}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Mandataire / administrateur</p>
                <p>{p.mandataire}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase text-navy/55">Honoraires avocat</p>
                <p>{p.avocat}</p>
              </div>
            </div>

            <div className="mt-3 border-t border-navy/10 pt-3 text-[11px] text-navy/55">
              <strong>Sources :</strong> {p.sources.join(' · ')}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">Comment financer ces frais</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Aide juridictionnelle</strong> (AJ) : si vos revenus sont faibles, l&apos;avocat est pris en charge totalement ou partiellement.
            <Link href="/outils/aide-juridictionnelle" className="ml-1 text-bleu-fonce underline">Vérifier mon éligibilité</Link>
          </li>
          <li>
            <strong>Consultation gratuite</strong> : une première consultation avec un avocat est possible gratuitement dans un point-justice (3039). Le CIP organise des entretiens confidentiels et gratuits.
          </li>
          <li>
            <strong>Rémunération des mandataires et administrateurs judiciaires</strong> : dans les procédures collectives, elle suit un tarif réglementé et fait partie des frais de la procédure.
          </li>
          <li>
            <strong>PRP (Rétablissement Professionnel)</strong> : la rémunération du mandataire est prélevée sur un fonds dédié (C. com. art. L663-3-1).
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Code de commerce (articles cités sur chaque carte, à
        consulter sur www.legifrance.gouv.fr) ; loi n° 71-1130 du 31
        décembre 1971, art. 10. Les coûts réels dépendent de la taille du
        bilan, du nombre de créanciers et de la complexité du dossier.
      </p>
    </section>
  );
}
