'use client';
import { useFiche } from '@/lib/FicheContext';
import { getFormeDetail } from '@/lib/strategie';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié à la commission de surendettement de la Banque de France.
 * S'affiche uniquement pour les personnes physiques : entrepreneurs
 * individuels (EI/EIRL/micro). Inapplicable aux personnes morales
 * (SARL, SAS, SA…) dont les dettes restent dans la sphère
 * professionnelle (procédure collective).
 */
export default function BlocSurendettement() {
  const { company, reponses } = useFiche();

  const forme = getFormeDetail(company.formeJuridique);
  const isPersonnePhysique =
    forme === 'micro' || forme === 'ei' || forme === 'eirl' ||
    // Fallback : si l'INSEE n'a pas renvoyé de forme mais l'effectif est indépendant
    (!company.formeJuridique && reponses.effectif === 'independant');

  if (!isPersonnePhysique) return null;

  return (
    <BlocAccordeon
      icone="🏦"
      titre="Commission de surendettement (BdF)"
      soustitre="Une voie spécifique aux personnes physiques pour traiter les dettes non professionnelles"
    >
      <p className="text-sm text-navy/80">
        Réservée aux personnes physiques, la commission de surendettement
        de la Banque de France traite les dettes de la vie personnelle
        (crédit conso, loyer du logement, découvert bancaire, impôts
        personnels, énergie, télécom…). Attention : tant que vous relevez
        des procédures collectives du Code de commerce (entrepreneur·e
        individuel·le commerçant·e, artisan·e, libéral·e ou
        agriculteur·rice), vous ne pouvez pas la saisir directement
        (art. L711-3 C. conso.). Depuis le 15 mai 2022, c&apos;est le
        tribunal qui ouvre la procédure collective qui peut, avec votre
        accord, lui transmettre vos dettes personnelles (art. L681-2 C.
        com. ; art. L711-9 C. conso.).
      </p>

      {/* Conditions d'éligibilité */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Conditions d&apos;éligibilité
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            Être une <strong>personne physique de bonne foi</strong>{' '}
            (résident français ou français résidant à l&apos;étranger
            avec des dettes contractées en France).
          </li>
          <li>
            Se trouver dans l&apos;<strong>impossibilité manifeste</strong>{' '}
            de faire face à l&apos;ensemble de ses dettes exigibles et à
            échoir (art. L711-1 C. conso.).
          </li>
          <li>
            Pour un <strong>entrepreneur individuel</strong> : saisine
            uniquement sur renvoi du tribunal de la procédure collective,
            si vos patrimoines professionnel et personnel ont été
            strictement séparés ; seul le{' '}
            <strong>patrimoine personnel</strong> est alors concerné.
            Une <strong>caution</strong> donnée pour la dette d&apos;une
            entreprise individuelle ou d&apos;une société peut aussi
            caractériser le surendettement (art. L711-1 C. conso.).
          </li>
        </ul>
      </div>

      {/* Mesures possibles */}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-base text-vert">Plan conventionnel</p>
          <p className="mt-2 text-sm text-navy/75">
            Accord négocié entre vous et vos créanciers par la commission :
            rééchelonnement, report, remise partielle. Durée maximale de
            <strong> 7 ans</strong>.
          </p>
        </div>
        <div className="rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-base text-vert">Mesures imposées</p>
          <p className="mt-2 text-sm text-navy/75">
            Si l&apos;accord est impossible, la commission impose un
            rééchelonnement, une réduction des intérêts ou un effacement
            partiel des dettes (hors créances alimentaires et pénales).
          </p>
        </div>
        <div className="rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-base text-jaune">
            Rétablissement personnel sans liquidation
          </p>
          <p className="mt-2 text-sm text-navy/75">
            En l&apos;absence de biens ayant une valeur marchande, la
            commission peut imposer l&apos;<strong>effacement total</strong>{' '}
            des dettes (le juge n&apos;intervient qu&apos;en cas de
            contestation).
          </p>
        </div>
        <div className="rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-base text-jaune">
            Rétablissement personnel avec liquidation
          </p>
          <p className="mt-2 text-sm text-navy/75">
            En présence de biens, la commission peut, avec votre accord,
            saisir le juge, qui prononce une liquidation judiciaire des
            biens (sauf biens nécessaires à la vie courante) puis
            l&apos;effacement des dettes résiduelles.
          </p>
        </div>
      </div>

      {/* Contacts */}
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <a
          href="tel:3414"
          className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
        >
          <span aria-hidden>☎</span> 34 14 — Correspondant BdF
        </a>
        <a
          href="https://particuliers.banque-france.fr/surendettement"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
        >
          <span aria-hidden>🌐</span> particuliers.banque-france.fr/surendettement
        </a>
      </div>

      {/* Différence avec procédure collective */}
      <div className="mt-5 rounded-2xl border border-navy/15 bg-navy/5 p-4 text-sm text-navy/80">
        <p className="font-display text-sm text-navy">
          Quelle différence avec une procédure collective ?
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            La <strong>procédure collective</strong> (sauvegarde,
            redressement, liquidation) traite les <strong>dettes
            professionnelles</strong> de l&apos;entreprise — y compris pour
            un EI dont le patrimoine professionnel est désormais séparé
            (loi du 14 février 2022).
          </li>
          <li>
            La <strong>commission de surendettement</strong> traite les
            <strong> dettes personnelles</strong> du dirigeant — vie
            privée, logement, conso. Pour un entrepreneur individuel, elle
            intervient<strong> en parallèle</strong> d&apos;une procédure
            collective, sur renvoi du tribunal (art. L681-2 C. com.).
          </li>
          <li>
            Pour un entrepreneur individuel, la coordination des deux
            dossiers est délicate : appuyez-vous sur un{' '}
            <strong>CIP</strong> ou un avocat spécialisé.
          </li>
        </ul>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : Code de la consommation, articles L711-1 et suivants
        (dont L711-3 et L711-9) ; Code de commerce, art. L681-2 ; Banque
        de France, dossier de surendettement (formulaire Cerfa 13594*02) ;
        loi n° 2022-172 du 14 février 2022 sur le statut de
        l&apos;entrepreneur individuel.
      </p>
    </BlocAccordeon>
  );
}
