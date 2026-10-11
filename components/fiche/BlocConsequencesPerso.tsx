'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

interface Section {
  icone: string;
  titre: string;
  intro: string;
  points: { label: string; valeur: string }[];
  actions?: string[];
  sources: string[];
  liens?: { label: string; url: string }[];
}

const SECTIONS: Section[] = [
  {
    icone: '🏦',
    titre: 'FICP et FCC — inscriptions Banque de France (personnes physiques)',
    intro:
      "Deux fichiers tenus par la Banque de France recensent les incidents de paiement. Une inscription n'est pas une sanction mais une information aux établissements bancaires.",
    points: [
      { label: 'FICP', valeur: 'Fichier des Incidents de remboursement de Crédits aux Particuliers. Inscription en cas de 2 mensualités impayées (crédit à la conso) ou de 60 jours d\'impayé (crédit immobilier).' },
      { label: 'FCC', valeur: "Fichier Central des Chèques. Inscription en cas de chèque sans provision non régularisé ou de retrait de carte bancaire pour usage abusif." },
      { label: 'Durée FICP', valeur: '5 ans maximum (levée possible avant si régularisation + notification par le créancier).' },
      { label: 'Durée FCC', valeur: "5 ans pour chèques ; 2 ans pour cartes. Levée immédiate après régularisation." },
      { label: 'Vos droits', valeur: "Accès gratuit à vos données (agence BDF ou particuliers.banque-france.fr). Droit de rectification." },
    ],
    actions: [
      "Consultez votre dossier : compte particulier gratuit sur particuliers.banque-france.fr",
      "En cas d'erreur, demandez rectification par courrier à la BDF avec justificatifs",
      "Après régularisation, vérifiez que le créancier a bien notifié la BDF (obligation légale)",
    ],
    sources: [
      'Code de la consommation art. L751-1 et s. (FICP)',
      'Code monétaire et financier art. L131-73 (FCC)',
    ],
    liens: [
      { label: 'Espace personnel BDF', url: 'https://particuliers.banque-france.fr' },
    ],
  },
  {
    icone: '📊',
    titre: 'Cotation Banque de France (entreprises)',
    intro:
      "La cotation est un indicateur de la capacité de l'entreprise à honorer ses engagements financiers. Elle est communiquée aux banques et influence fortement l'accès au crédit.",
    points: [
      { label: 'Échelle', valeur: '3++ (excellente) à 9 (incapacité à honorer) ; P si procédure collective ouverte ; 0 si aucune info.' },
      { label: 'Mise à jour', valeur: 'Au moins annuelle, ou suite à un événement significatif (dépôt des comptes, incident, jugement).' },
      { label: "Seuil d'alerte", valeur: "Passage à 6 et en dessous : l'accès au crédit devient très difficile. 7 signale un risque élevé." },
      { label: 'Votre droit', valeur: "Vous avez le droit de connaître votre cote, les motifs de la cotation, et de la contester via un entretien avec la BDF." },
    ],
    actions: [
      "Demandez un entretien gratuit avec votre analyste BDF (indiquez vos éléments d'amélioration)",
      "Déposez systématiquement vos comptes annuels : l'absence de dépôt dégrade mécaniquement la cote",
      "Communiquez tout élément positif (contrats, restructuration, recapitalisation)",
    ],
    sources: [
      'Banque de France — « Cotation des entreprises »',
      'Règlement BCE 2014/1374 (crédits éligibles à la BCE)',
    ],
    liens: [
      { label: 'entreprises.banque-france.fr', url: 'https://entreprises.banque-france.fr' },
    ],
  },
  {
    icone: '⚖️',
    titre: "Responsabilité personnelle du dirigeant : ce qui peut être déclenché",
    intro:
      "Plusieurs mécanismes juridiques peuvent engager votre patrimoine ou vos droits de gestion à l'issue d'une procédure. En connaître les contours aide à les éviter.",
    points: [
      { label: 'Action en responsabilité pour insuffisance d\'actif (ex-« comblement de passif »)', valeur: "Peut viser le dirigeant ayant commis une faute de gestion ayant contribué à l'insuffisance d'actif. Condamnation à payer tout ou partie du passif. Prescription : 3 ans à compter du jugement de liquidation." },
      { label: 'Faillite personnelle', valeur: "Interdiction de diriger toute entreprise pendant 15 ans max. Déclenchée pour fautes graves : poursuite abusive d'activité, détournement d'actif, comptabilité fictive." },
      { label: 'Interdiction de gérer', valeur: "Sanction plus large (jusqu'à 15 ans) pour manquements de bonne foi moins graves que la faillite personnelle (défaut de déclaration dans les 45 j, absence de coopération avec le mandataire)." },
      { label: 'Banqueroute (pénal)', valeur: "Délit passible de 5 ans de prison et 75 000 € d'amende. Suppose une procédure collective ET un comportement frauduleux (détournement, faux en écritures, augmentation frauduleuse du passif)." },
      { label: 'Dettes sociales / fiscales', valeur: "L'administration peut engager la responsabilité solidaire du dirigeant (L267 LPF, L244-1 CSS) en cas de manœuvres frauduleuses ou d'inobservation grave et répétée." },
    ],
    actions: [
      "Déclarez la cessation des paiements dans les 45 jours — c'est la première protection",
      "Coopérez pleinement avec le mandataire et le juge-commissaire",
      "Conservez une comptabilité à jour et sincère jusqu'au bout",
      "Ne préférez aucun créancier : les paiements faits pendant la période suspecte (de la cessation des paiements, qui peut remonter jusqu'à 18 mois, au jugement) peuvent être annulés",
      "Ne dissimulez pas de biens : l'inventaire est vérifié, les conséquences sont pénales",
    ],
    sources: [
      'C. com. art. L651-2 (insuffisance d\'actif)',
      'C. com. art. L653-1 à L653-11 (faillite personnelle / interdiction de gérer)',
      'C. com. art. L654-1 à L654-6 (banqueroute)',
      'LPF art. L267 (dettes fiscales) ; CSS art. L244-1 (dettes sociales)',
    ],
  },
  {
    icone: '🛡️',
    titre: "Risques juridiques supplémentaires : à connaître pour éviter les pièges",
    intro:
      "Au-delà des sanctions principales, plusieurs mécanismes peu connus peuvent vous exposer personnellement. Les anticiper est la meilleure façon de les neutraliser — et la plupart sont évitables avec quelques précautions simples.",
    points: [
      {
        label: 'Cotisations sociales : solidarité du dirigeant (art. L243-3-2 CSS)',
        valeur:
          "Le dirigeant d'une société verbalisée pour travail dissimulé peut être déclaré solidairement responsable des cotisations par le président du tribunal judiciaire, s'il est responsable de manœuvres frauduleuses ou d'une inobservation grave et répétée de ses obligations. Hors de ce cas, une difficulté de paiement des cotisations ne rend pas le dirigeant personnellement redevable — sauf condamnation pour faute de gestion en liquidation (art. L651-2 C. com.).",
      },
      {
        label: 'Période suspecte — de la cessation des paiements au jugement (art. L631-8, L632-1 à L632-3 C. com.)',
        valeur:
          "Le tribunal fixe une date de cessation des paiements, qui peut remonter jusqu'à 18 mois avant le jugement d'ouverture ; les actes accomplis entre cette date et le jugement peuvent être annulés. NULLITÉS DE DROIT : donation et acte à titre gratuit (y compris dans les 6 mois qui précèdent la cessation), contrat très déséquilibré (vente à prix dérisoire), paiement anticipé d'une dette, paiement par un moyen anormal (dation en paiement), sûreté pour une dette antérieure. NULLITÉS FACULTATIVES (à l'appréciation du juge) : paiements de dettes échues et actes à titre onéreux lorsque l'autre partie connaissait la cessation des paiements (par exemple un créancier « ami » payé en priorité). Le mandataire peut faire annuler ces actes pour récupérer des fonds.",
      },
      {
        label: 'Confusion de patrimoine — extension de procédure (art. L621-2 C. com.)',
        valeur:
          "Si la justice constate une confusion entre votre patrimoine personnel et celui de la société (compte mixte, dépenses perso payées par la société, flux financiers anormaux), la procédure collective peut être ÉTENDUE à d'autres sociétés du groupe, voire à votre patrimoine personnel. C'est l'un des rares mécanismes capables de faire tomber les protections classiques — y compris, dans certains cas, la protection de la résidence principale de l'EIRL ou de l'entrepreneur individuel.",
      },
      {
        label: 'Privilèges des créanciers en liquidation — l\'ordre de paiement',
        valeur:
          "À savoir si vous êtes vous-même créancier de votre société (compte courant d'associé, apports) : (1) super-privilège des salaires (AGS), (2) frais de justice de la procédure, (3) privilège fiscal et social (Trésor + URSSAF), (4) créances garanties par sûreté, (5) créances chirographaires (sans garantie). Vos apports et comptes courants associés passent en DERNIER : il est très rare qu'ils soient remboursés. Ce n'est pas une injustice — c'est la règle légale.",
      },
      {
        label: 'Casier judiciaire B2 / B3 — conséquences professionnelles à long terme',
        valeur:
          "Faillite personnelle, interdiction de gérer et banqueroute sont inscrites au bulletin n°2 du casier judiciaire. Le B2 est consultable par : employeurs publics, organismes de protection sociale, certaines professions réglementées (avocat, notaire, expert-comptable, médecin, agent immobilier, etc.). Durée d'inscription : 10 à 15 ans selon la peine. Conséquence concrète : impossibilité d'exercer certaines professions futures. Le B3 (votre exemplaire, demandable gratuitement) ne contient que les condamnations les plus lourdes.",
      },
      {
        label: 'CRPC (Comparution sur Reconnaissance Préalable de Culpabilité) — en cas de banqueroute',
        valeur:
          "Si vous êtes poursuivi pour banqueroute, le procureur peut vous proposer une CRPC (le « plaider-coupable » à la française). Vous reconnaissez les faits ; en échange, la peine proposée ne peut dépasser la moitié de la peine encourue. L'assistance d'un avocat est OBLIGATOIRE. Avantage : procédure plus rapide, peine plus faible, moins d'exposition médiatique. À discuter sérieusement avec votre avocat — c'est souvent la meilleure option quand les faits sont matériellement établis.",
      },
    ],
    actions: [
      "Évitez de payer un créancier « amical » avant les autres : si une procédure s'ouvre, la date de cessation des paiements peut être fixée jusqu'à 18 mois avant le jugement",
      "Tenez vos comptes professionnels et personnels strictement séparés (jamais de carte société pour des dépenses perso)",
      "Si l'URSSAF est massivement impayée, échelonnez tout de suite — c'est la trace écrite de la bonne foi",
      "En cas de poursuite pénale, ne refusez pas la CRPC par principe : faites évaluer l'option par votre avocat",
      "Demandez gratuitement votre bulletin n°3 du casier (casier-judiciaire.justice.gouv.fr) pour savoir ce qui y figure",
    ],
    sources: [
      'CSS art. L243-3-2 (solidarité du dirigeant en cas de travail dissimulé)',
      'C. com. art. L632-1 à L632-3 (période suspecte)',
      'C. com. art. L621-2 (extension pour confusion de patrimoine)',
      'C. com. art. L641-13 (ordre des créanciers en liquidation)',
      'Code de procédure pénale art. 775 (bulletin n°2) ; art. 495-7 et s. (CRPC)',
    ],
    liens: [
      { label: 'Demande de bulletin n°3', url: 'https://casier-judiciaire.justice.gouv.fr' },
    ],
  },
];

export default function BlocConsequencesPerso() {
  const { reponses } = useFiche();
  return (
    <BlocAccordeon
      icone="🔒"
      titre="Conséquences personnelles à connaître"
      soustitre="Fichiers BDF, cotation, responsabilité — sources officielles"
    >
      <p className="mb-4 text-sm text-navy/80">
        Plusieurs mécanismes peuvent affecter durablement votre patrimoine,
        votre capacité à emprunter ou à gérer une entreprise. Les
        connaître permet de les anticiper — et le plus souvent, de les
        éviter.
      </p>

      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <section
            key={s.titre}
            className="rounded-2xl border border-navy/10 bg-white/70 p-5"
          >
            <p className="font-display text-lg text-navy">
              <span className="mr-2" aria-hidden>{s.icone}</span>
              {s.titre}
            </p>
            <p className="mt-2 text-sm text-navy/75">{s.intro}</p>

            <dl className="mt-4 space-y-2 text-sm">
              {s.points.map((p) => (
                <div key={p.label} className="rounded-xl bg-white/60 p-3">
                  <dt className="font-medium text-navy">{p.label}</dt>
                  <dd className="mt-1 text-navy/75">{p.valeur}</dd>
                </div>
              ))}
            </dl>

            {s.actions && s.actions.length > 0 && (
              <div className="mt-4">
                <p className="font-display text-sm text-navy">Ce que vous pouvez faire</p>
                <ul className="mt-2 space-y-1 text-sm text-navy/80">
                  {s.actions.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-navy/40">→</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {s.liens && s.liens.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {s.liens.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
                  >
                    <span aria-hidden>🌐</span> {l.label}
                  </a>
                ))}
              </div>
            )}

            <p className="mt-4 border-t border-navy/10 pt-3 text-[11px] text-navy/55">
              <strong>Sources :</strong> {s.sources.join(' · ')}
            </p>
          </section>
        ))}
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Ces informations sont générales. L&apos;appréciation de votre
        situation particulière par un avocat peut être utile — la
        plupart proposent un premier RDV gratuit.
      </p>
    </BlocAccordeon>
  );
}
