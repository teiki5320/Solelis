import Link from 'next/link';
import { ogMeta } from '@/lib/og';

export const metadata = {
  ...ogMeta({
    chemin: '/procedures-comparaison',
    titre: 'Comparatif des 8 procédures amiables et collectives',
    sous: 'Mandat ad hoc, conciliation, sauvegarde, RJ, LJ, PRP',
    description: 'Mandat ad hoc, conciliation, sauvegarde, redressement, liquidation, PRP : comparaison détaillée des procédures (confidentialité, durée, coût, conditions).',
    cat: 'procedure',
    pageTitle: 'Comparatif des procédures amiables et collectives — Solelis',
  }),
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
};

interface Procedure {
  nom: string;
  icone: string;
  couleur: string;
  preventif: 'oui' | 'non';
  confidentiel: 'oui' | 'non' | 'partiel';
  cessationPaiement: 'non' | 'possible' | 'oui';
  duree: string;
  conditionsCle: string;
  dirigeantReste: 'oui' | 'oui-controle' | 'non';
  cout: 'bas' | 'moyen' | 'eleve';
  protection: 'aucune' | 'partielle' | 'totale';
  utiliteCle: string;
  reference: string;
}

const PROCEDURES: Procedure[] = [
  {
    nom: 'Mandat ad hoc',
    icone: '🤝',
    couleur: 'bleu',
    preventif: 'oui',
    confidentiel: 'oui',
    cessationPaiement: 'non',
    duree: 'Fixée par le président du tribunal',
    conditionsCle: 'Difficulté économique ou financière non encore en cessation des paiements',
    dirigeantReste: 'oui',
    cout: 'moyen',
    protection: 'aucune',
    utiliteCle: 'Négocier amiablement avec ses créanciers (banques, fournisseurs) sans visibilité publique',
    reference: 'C. com. art. L611-3',
  },
  {
    nom: 'Conciliation',
    icone: '⚖️',
    couleur: 'bleu',
    preventif: 'oui',
    confidentiel: 'oui',
    cessationPaiement: 'possible',
    duree: '4 mois + 1 mois',
    conditionsCle: 'Difficulté avérée ou prévisible. Cessation possible depuis moins de 45 jours.',
    dirigeantReste: 'oui',
    cout: 'moyen',
    protection: 'partielle',
    utiliteCle: 'Cadre plus formel que le mandat ad hoc, homologation possible par le tribunal',
    reference: 'C. com. art. L611-4 à L611-15',
  },
  {
    nom: 'Sauvegarde',
    icone: '🛡️',
    couleur: 'vert',
    preventif: 'oui',
    confidentiel: 'non',
    cessationPaiement: 'non',
    duree: '6 mois renouvelable une fois (12 mois max)',
    conditionsCle: 'Difficulté que le dirigeant ne peut surmonter seul. PAS en cessation des paiements.',
    dirigeantReste: 'oui-controle',
    cout: 'eleve',
    protection: 'totale',
    utiliteCle: 'Gèle les dettes et suspend les poursuites. Plan d\'apurement sur 10 ans max.',
    reference: 'C. com. art. L620-1 et s.',
  },
  {
    nom: 'Sauvegarde accélérée',
    icone: '⚡',
    couleur: 'vert',
    preventif: 'oui',
    confidentiel: 'partiel',
    cessationPaiement: 'possible',
    duree: '2 mois, 4 mois max',
    conditionsCle: 'Conciliation en cours, projet de plan, comptes certifiés par un CAC ou établis par un expert-comptable. Plus de seuil de taille depuis 2021.',
    dirigeantReste: 'oui-controle',
    cout: 'eleve',
    protection: 'totale',
    utiliteCle: 'Imposer rapidement un plan validé aux créanciers récalcitrants',
    reference: 'C. com. art. L628-1 et s.',
  },
  {
    nom: 'Redressement judiciaire (RJ)',
    icone: '🔄',
    couleur: 'jaune',
    preventif: 'non',
    confidentiel: 'non',
    cessationPaiement: 'oui',
    duree: '6 mois renouvelable (jusqu\'à 18 mois)',
    conditionsCle: 'Cessation des paiements (à déclarer dans les 45 jours). Sauvetage encore possible.',
    dirigeantReste: 'oui-controle',
    cout: 'eleve',
    protection: 'totale',
    utiliteCle: 'Sauver l\'activité par un plan de continuation ou de cession',
    reference: 'C. com. art. L631-1 et s.',
  },
  {
    nom: 'Liquidation judiciaire (LJ)',
    icone: '🔚',
    couleur: 'rouge',
    preventif: 'non',
    confidentiel: 'non',
    cessationPaiement: 'oui',
    duree: 'Variable (6 mois à plusieurs années)',
    conditionsCle: 'Cessation des paiements et redressement manifestement impossible.',
    dirigeantReste: 'non',
    cout: 'eleve',
    protection: 'totale',
    utiliteCle: 'Arrêt définitif de l\'activité, vente des actifs pour désintéresser les créanciers',
    reference: 'C. com. art. L640-1 et s.',
  },
  {
    nom: 'Liquidation simplifiée',
    icone: '⚡',
    couleur: 'rouge',
    preventif: 'non',
    confidentiel: 'non',
    cessationPaiement: 'oui',
    duree: '6 mois ou 1 an (+ 3 mois)',
    conditionsCle: 'Obligatoire si aucun immeuble, ≤ 5 salariés et CA HT ≤ 750 k€ (personne physique : seule l\'absence d\'immeuble compte, la résidence principale n\'y fait pas obstacle). Clôture en 6 mois, portés à 1 an seulement si > 1 salarié et CA HT > 300 k€.',
    dirigeantReste: 'non',
    cout: 'moyen',
    protection: 'totale',
    utiliteCle: 'Version express et moins coûteuse de la liquidation pour TPE',
    reference: 'C. com. art. L641-2, L644-1 et s., D641-10',
  },
  {
    nom: 'Rétablissement professionnel (PRP)',
    icone: '♻️',
    couleur: 'navy',
    preventif: 'non',
    confidentiel: 'partiel',
    cessationPaiement: 'oui',
    duree: '4 mois maximum',
    conditionsCle: 'Entrepreneur individuel (personne physique) en cessation des paiements, redressement manifestement impossible. Aucun salarié depuis 6 mois. Actif < 15 000 €. Pas d\'instance prud\'homale en cours. Pas de dessaisissement : vous gardez la gestion de vos biens. Les poursuites ne sont pas arrêtées, mais le juge peut reporter un paiement (L645-6). Ouverture non publiée, clôture publiée au BODACC (R645-19).',
    dirigeantReste: 'oui',
    cout: 'bas',
    protection: 'partielle',
    utiliteCle: 'Effacement rapide des dettes professionnelles, sans liquidation complexe',
    reference: 'C. com. art. L645-1 et s.',
  },
];

const BADGE: Record<string, string> = {
  oui: 'bg-vert/15 text-vert',
  non: 'bg-rouge/15 text-rouge',
  possible: 'bg-jaune/15 text-jaune',
  partiel: 'bg-jaune/15 text-jaune',
  'oui-controle': 'bg-bleu/15 text-bleu-fonce',
  bas: 'bg-vert/15 text-vert',
  moyen: 'bg-jaune/15 text-jaune',
  eleve: 'bg-rouge/15 text-rouge',
  aucune: 'bg-rouge/15 text-rouge',
  partielle: 'bg-jaune/15 text-jaune',
  totale: 'bg-vert/15 text-vert',
};

const LABEL: Record<string, string> = {
  oui: 'Oui',
  non: 'Non',
  possible: 'Possible',
  partiel: 'Partielle',
  'oui-controle': 'Sous contrôle',
  bas: 'Bas',
  moyen: 'Moyen',
  eleve: 'Élevé',
  aucune: 'Aucune',
  partielle: 'Partielle',
  totale: 'Totale',
};

export default function ProceduresComparaisonPage() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:py-14">
      <Link href="/procedures" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Procédures
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Comparatif des 8 procédures amiables et collectives
      </h1>
      <p className="mt-4 max-w-2xl text-base text-navy/70">
        Du mandat ad hoc (préventif, confidentiel) à la liquidation simplifiée (fin d&apos;activité TPE) :
        comparez les 8 procédures sur 8 critères clés.
      </p>

      {/* Grille de procédures */}
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {PROCEDURES.map((p) => (
          <article key={p.nom} className="glass card-top-line p-5">
            <div className="flex items-start gap-3">
              <span className="text-3xl" aria-hidden>{p.icone}</span>
              <div className="flex-1">
                <h2 className="font-display text-lg text-navy">{p.nom}</h2>
                <p className="mt-1 text-xs text-navy/55">{p.reference}</p>
              </div>
            </div>

            <p className="mt-3 text-sm text-navy/80">
              <strong>À quoi ça sert :</strong> {p.utiliteCle}
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-navy/55">Préventif</dt>
                <dd className={`mt-0.5 inline-block rounded-full px-2 py-0.5 ${BADGE[p.preventif]}`}>{LABEL[p.preventif]}</dd>
              </div>
              <div>
                <dt className="text-navy/55">Confidentiel</dt>
                <dd className={`mt-0.5 inline-block rounded-full px-2 py-0.5 ${BADGE[p.confidentiel]}`}>{LABEL[p.confidentiel]}</dd>
              </div>
              <div>
                <dt className="text-navy/55">Cessation des paiements</dt>
                <dd className={`mt-0.5 inline-block rounded-full px-2 py-0.5 ${BADGE[p.cessationPaiement]}`}>{LABEL[p.cessationPaiement]}</dd>
              </div>
              <div>
                <dt className="text-navy/55">Dirigeant en place</dt>
                <dd className={`mt-0.5 inline-block rounded-full px-2 py-0.5 ${BADGE[p.dirigeantReste]}`}>{LABEL[p.dirigeantReste]}</dd>
              </div>
              <div>
                <dt className="text-navy/55">Protection créanciers</dt>
                <dd className={`mt-0.5 inline-block rounded-full px-2 py-0.5 ${BADGE[p.protection]}`}>{LABEL[p.protection]}</dd>
              </div>
              <div>
                <dt className="text-navy/55">Coût</dt>
                <dd className={`mt-0.5 inline-block rounded-full px-2 py-0.5 ${BADGE[p.cout]}`}>{LABEL[p.cout]}</dd>
              </div>
            </dl>

            <p className="mt-3 text-xs text-navy/70">
              <strong>Durée :</strong> {p.duree}
            </p>
            <p className="mt-1 text-xs text-navy/70">
              <strong>Conditions :</strong> {p.conditionsCle}
            </p>
          </article>
        ))}
      </div>

      {/* Aide à la décision */}
      <div className="mt-12 rounded-2xl border border-bleu/30 bg-bleu/5 p-6">
        <h2 className="font-display text-xl text-bleu-fonce">Comment choisir ?</h2>
        <ul className="mt-4 space-y-2 text-sm text-navy/80">
          <li>
            <strong>Je sens que ça se dégrade, je peux encore payer</strong> → mandat ad hoc ou conciliation (préventif, confidentiel)
          </li>
          <li>
            <strong>Je ne suis pas en cessation, mais je n&apos;y arriverai pas seul</strong> → sauvegarde (judiciaire mais protection totale)
          </li>
          <li>
            <strong>Je suis en cessation depuis &lt; 45 j, l&apos;activité peut être sauvée</strong> → redressement judiciaire (plan de continuation ou cession)
          </li>
          <li>
            <strong>Plus de solution viable</strong> → liquidation judiciaire (ou simplifiée si TPE)
          </li>
          <li>
            <strong>Je suis EI/micro, sans salarié, peu d&apos;actifs</strong> → rétablissement professionnel (PRP) — 4 mois, effacement des dettes
          </li>
        </ul>
        <p className="mt-4 text-sm text-navy/70">
          Dans tous les cas, consultez un avocat en droit des entreprises en difficulté avant de choisir.
          Une première consultation gratuite est possible dans un point-justice (3039).
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/glossaire"
          className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white"
        >
          📚 Glossaire détaillé
        </Link>
        <Link
          href="/outils/cout-procedures"
          className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white"
        >
          💶 Comparateur coût détaillé
        </Link>
        <Link
          href="/annuaires/mandataires"
          className="rounded-full border border-navy/15 bg-white/80 px-4 py-2 text-sm text-navy/80 hover:bg-white"
        >
          📞 Annuaire mandataires
        </Link>
      </div>
    </section>
  );
}
