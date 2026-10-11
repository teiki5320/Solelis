'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié à la période suspecte : de la date de cessation des paiements
 * (reportable jusqu'à 18 mois avant le jugement, C. com. art. L631-8) au
 * jugement d'ouverture. C. com. art. L632-1 à L632-3.
 *
 * Affiché systématiquement pour toute situation à risque (tresorie /
 * redressement / assignation) — c'est l'un des sujets les plus
 * sous-estimés par les dirigeants et l'une des causes les plus
 * fréquentes d'annulation rétroactive d'actes.
 */
export default function BlocPeriodeSuspecte() {
  const { reponses } = useFiche();
  const pertinent =
    reponses.situation === 'tresorie' ||
    reponses.situation === 'redressement' ||
    reponses.situation === 'assignation';
  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="⏳"
      titre="Période suspecte — de la cessation des paiements au jugement"
      soustitre="Les actes risquant l'annulation rétroactive (C. com. L632-1 à L632-3)"
    >
      <p className="text-sm text-navy/80">
        Quand un tribunal ouvre une procédure collective, il fixe une{' '}
        <strong>date de cessation des paiements</strong> — souvent
        antérieure de plusieurs mois au jugement. Les actes accomplis
        entre cette date et le jugement (jusqu&apos;à <strong>18 mois en
        arrière</strong>) sont scrutés et peuvent être{' '}
        <strong>annulés rétroactivement</strong> par le tribunal, à la
        demande notamment du mandataire, pour reconstituer l&apos;actif. Comprendre ce mécanisme est crucial
        pour éviter des erreurs lourdes pendant cette période sensible.
      </p>

      {/* Nullités de droit */}
      <div className="mt-5 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          ❌ Nullités de DROIT (annulation automatique — art. L632-1)
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Ces actes sont annulés par le juge dès qu&apos;ils sont
          identifiés, <strong>sans avoir à prouver la fraude</strong>.
          Très dangereux car l&apos;intention ne compte pas.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Donation</strong> ou acte à titre gratuit (cadeau d&apos;un bien à un proche).
          </li>
          <li>
            <strong>Contrat déséquilibré</strong> où vos obligations excèdent notablement celles de l&apos;autre partie.
          </li>
          <li>
            <strong>Paiement anticipé</strong> d&apos;une dette non encore échue.
          </li>
          <li>
            <strong>Paiement par moyen anormal</strong> : dation en paiement (céder une voiture ou un bien à la place d&apos;un règlement bancaire), compensation non autorisée.
          </li>
          <li>
            <strong>Hypothèque, nantissement ou autre sûreté</strong> consenti pour garantir une dette contractée antérieurement (la banque qui se fait inscrire au dernier moment), sauf remplacement d&apos;une sûreté équivalente.
          </li>
          <li>
            <strong>Mesure conservatoire</strong> (saisie conservatoire, inscription provisoire), sauf si elle a été inscrite ou pratiquée avant la date de cessation des paiements.
          </li>
          <li>
            <strong>Attribution ou levée d&apos;options</strong> de souscription ou d&apos;achat d&apos;actions (stock-options).
          </li>
        </ul>
      </div>

      {/* Nullités facultatives */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          ⚠️ Nullités FACULTATIVES (appréciation du juge — art. L632-2)
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Le juge peut annuler l&apos;acte s&apos;il établit que{' '}
          <strong>l&apos;autre partie avait connaissance</strong> de la
          cessation des paiements. Le mandataire enquête : SMS, mails,
          comptes, témoignages — la preuve est souvent reconstruite.
          Une saisie (saisie-attribution, saisie administrative,
          opposition) pratiquée par un créancier après la date de
          cessation des paiements, en connaissance de celle-ci, peut
          aussi être annulée. Pour les procédures ouvertes à partir du
          1er janvier 2027, ces nullités ne visent plus les paiements et
          saisies de certaines cotisations sociales et dettes fiscales
          (loi n° 2025-1403 du 30 décembre 2025).
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Paiement d&apos;une dette échue</strong> par un mode normal (virement, chèque) — annulable si le créancier savait votre situation.
          </li>
          <li>
            <strong>Vente à un proche</strong> (conjoint, enfant, ami), même au juste prix — la loi ne présume pas sa connaissance de la cessation des paiements : elle doit être prouvée, mais le juge peut la déduire d&apos;indices (lien familial, informations partagées).
          </li>
          <li>
            <strong>Cession de fonds de commerce</strong> ou d&apos;un autre actif (si le prix est notablement trop bas, la nullité est même de droit).
          </li>
          <li>
            <strong>Transfert d&apos;actif</strong> à une société écran ou nouvellement créée.
          </li>
        </ul>
      </div>

      {/* Datation */}
      <div className="mt-4 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Comment la date de cessation est-elle fixée ?
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Par défaut, le tribunal retient la <strong>date du jugement
          d&apos;ouverture</strong>. Le mandataire ou le ministère public
          peut demander à la <strong>reporter en arrière</strong> (jusqu&apos;à
          18 mois max). Les preuves : impayés URSSAF/SIE répétés,
          chèques rejetés, mises en demeure non honorées, dossier en
          médiation, courriers de banque réclamant un découvert.
        </p>
        <p className="mt-2 text-sm text-navy/80">
          <strong>Conséquence stratégique</strong> : déclarer rapidement
          la cessation (dans le délai des 45 jours) limite la durée
          d&apos;exposition rétroactive — c&apos;est aussi pour ça que le
          délai existe.
        </p>
      </div>

      {/* Action paulienne */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          Action paulienne (art. 1341-2 C. civ.) — hors période suspecte
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Même <strong>au-delà de la période suspecte</strong>, un
          créancier peut attaquer un acte fait <strong>en fraude de ses
          droits</strong> (action paulienne). Prescription : 5 ans à
          compter de la connaissance de l&apos;acte. Cible typique :
          donation à un enfant ou changement de régime matrimonial
          précipité, alors que les dettes étaient déjà importantes.
          Conséquence : l&apos;acte est inopposable au créancier — le
          bien réintègre le patrimoine saisissable.
        </p>
      </div>

      {/* Ce qu'il faut faire (et ne pas faire) */}
      <div className="mt-5 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">Recommandations concrètes</p>
        <ul className="mt-2 space-y-1.5 text-sm text-navy/80">
          <li className="flex gap-2"><span className="text-vert">✓</span><span>Continuez à payer vos créanciers de manière <strong>égalitaire</strong> (ne pas privilégier un « ami »).</span></li>
          <li className="flex gap-2"><span className="text-vert">✓</span><span>Documentez chaque décision (mails, factures, contrats) — la trace écrite démontre la bonne foi.</span></li>
          <li className="flex gap-2"><span className="text-vert">✓</span><span>Si vous devez vendre un actif, faites-le <strong>à prix de marché</strong>, avec une <strong>expertise indépendante</strong>.</span></li>
          <li className="flex gap-2"><span className="text-vert">✓</span><span>Avant tout acte significatif (vente, donation, changement de régime), <strong>consultez un avocat</strong> en droit des entreprises en difficulté.</span></li>
          <li className="flex gap-2"><span className="text-rouge">✗</span><span>N&apos;essayez pas de « sauver » un bien en l&apos;offrant à votre conjoint ou enfant — la nullité est automatique.</span></li>
          <li className="flex gap-2"><span className="text-rouge">✗</span><span>Ne payez pas en priorité un créancier proche (famille, ami, banquier connu) au détriment des autres.</span></li>
          <li className="flex gap-2"><span className="text-rouge">✗</span><span>Ne tardez pas à déclarer la cessation : plus vous attendez, plus la période suspecte s&apos;étend.</span></li>
        </ul>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : C. com. art. L631-8, L632-1 à L632-4 (période suspecte
        et nullités) ; C. com. art. L631-4 (délai de 45 j) ; Code civil
        art. 1341-2 (action paulienne).
      </p>
    </BlocAccordeon>
  );
}
