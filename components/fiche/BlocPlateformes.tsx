'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié aux travailleurs des plateformes numériques :
 * - VTC (Uber, Bolt, Heetch, Marcel)
 * - Livraison (Deliveroo, Uber Eats, Stuart, Frichti)
 * - Services à la personne (Yoojo, AlloVoisin)
 *
 * S'affiche pour les indépendant·e·s des NAF transport (49.32Z = taxis,
 * VTC ; 53.20Z = livraison autre que poste).
 *
 * Couvre : statut juridique, ARPE, charte sociale, DGCCRF, registre
 * VTC, prestation services au plus juste prix (loi du 7 février 2022),
 * différentes lignes de défense en cas de requalification en salariat.
 */
export default function BlocPlateformes() {
  const { company, reponses } = useFiche();
  const naf = (company.naf || '').replace(/\./g, '').toUpperCase();
  // Seuls le VTC/taxi (49.32Z) et la livraison (53.20Z) relèvent
  // typiquement du travail de plateforme. Un restaurant (56.10), un salon
  // de coiffure (96) ou un service d'aide à domicile (88) n'en relèvent
  // pas : le bloc n'est plus affiché pour tout le code NAF.
  const isPlateforme =
    (naf.startsWith('4932') || naf.startsWith('5320')) && reponses.effectif === 'independant';

  if (!isPlateforme) return null;

  return (
    <BlocAccordeon
      icone="🛵"
      titre="Travailleur de plateforme — VTC, livraison, services"
      soustitre="Statut, ARPE, défense en cas de requalification, dispositifs spécifiques"
    >
      <p className="text-sm text-navy/80">
        Si vous travaillez via une plateforme (Uber, Bolt, Heetch,
        Deliveroo, Uber Eats, Stuart, Yoojo…), votre situation comporte
        des protections récentes mais aussi des risques juridiques
        particuliers. La loi du 7 février 2022 et l&apos;ordonnance du 21 avril
        2021 ont créé des garanties spécifiques.
      </p>

      {/* Statut juridique */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Votre statut : indépendant présumé, mais...
        </p>
        <p className="mt-2 text-sm text-navy/80">
          La loi française <strong>présume</strong> que le travailleur de
          plateforme est <strong>indépendant</strong> (art. L7341-1 C.
          trav.). Cette présomption peut cependant être renversée si vous
          démontrez un <strong>lien de subordination juridique permanent</strong>{' '}
          (Cass. soc. 28 nov. 2018, n° 17-20.079, arrêt Take Eat Easy ;
          Cass. soc. 4 mars 2020, n° 19-13.316, arrêt Uber). Conséquence :
          <strong> requalification en CDI</strong> avec rappels de salaires,
          cotisations URSSAF, congés payés, indemnités de licenciement.
        </p>
      </div>

      {/* ARPE */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          ARPE — Autorité des Relations sociales des Plateformes d&apos;Emploi
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Créée en 2021, l&apos;ARPE encadre les négociations collectives
          entre plateformes (VTC, livraison) et représentants des
          travailleurs élus. <strong>Premier accord de branche</strong>{' '}
          obligatoire signé en 2023 : revenu minimal par course
          (7,65 € HT minimum VTC, 11,75 € HT pour 30 min de livraison
          au 1er janv. 2024).
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a
            href="https://www.arpe.gouv.fr"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
          >
            <span aria-hidden>🌐</span> arpe.gouv.fr
          </a>
        </div>
      </div>

      {/* Registre VTC + obligations */}
      {naf.startsWith('4932') && (
        <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-base text-jaune">
            Spécifique VTC — inscription au registre
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>
              <strong>Inscription obligatoire</strong> au registre VTC
              (Préfecture de votre département), renouvellement{' '}
              <strong>tous les 5 ans</strong>.
            </li>
            <li>
              <strong>Carte VTC</strong> délivrée par la Préfecture après
              examen théorique et pratique (CMA).
            </li>
            <li>
              <strong>Assurance RC pro</strong> spécifique transport de
              personnes (obligatoire — différente de la RC auto classique).
            </li>
            <li>
              <strong>Garantie financière</strong> dès qu&apos;il y a
              intermédiation (≥ 1 véhicule appartenant à un tiers).
            </li>
            <li>
              <strong>FNAUT-VTC</strong> : fédération nationale des
              professionnels du transport public, accompagne en cas de
              litige avec la plateforme.
            </li>
          </ul>
        </div>
      )}

      {/* Charte sociale + obligations livreurs */}
      {naf.startsWith('5320') && (
        <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-base text-jaune">
            Spécifique Livraison — charte sociale
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
            <li>
              <strong>Charte sociale</strong> obligatoire publiée par la
              plateforme (art. L7342-9), définissant les engagements
              minimaux (revenu, protection, formation).
            </li>
            <li>
              <strong>Couverture AT/MP</strong> prise en charge par la
              plateforme (art. L7342-2).
            </li>
            <li>
              <strong>Cotisation formation</strong> versée par la plateforme,
              accessible via votre compte CPF.
            </li>
            <li>
              <strong>Action collective</strong> possible : CFDT-VTC,
              Coursiers-INV (livreurs), STP (taxis et VTC).
            </li>
          </ul>
        </div>
      )}

      {/* Requalification - la défense */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          ⚠️ Si vous êtes en redressement / liquidation : risque inverse
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Le mandataire ou l&apos;URSSAF peut chercher à{' '}
          <strong>requalifier votre activité en salariat dissimulé</strong>{' '}
          (art. L8221-3 C. trav.) — ce qui vous transformerait en
          débiteur de cotisations massives. Indices retenus : tarif fixe
          imposé, application qui vous géolocalise et vous note,
          impossibilité de refuser une course sans pénalité, exclusivité
          de fait. <strong>Conservez les preuves de votre autonomie</strong>{' '}
          (clients hors plateforme, refus de courses sans sanction,
          choix horaires).
        </p>
      </div>

      {/* Aides personnelles */}
      <div className="mt-4 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Aides personnelles mobilisables
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>ATI</strong> — Allocation Travailleurs Indépendants
            (environ 600 à 800 €/mois pendant 6 mois) si cessation involontaire
            et conditions d&apos;activité remplies.
          </li>
          <li>
            <strong>ACRE</strong> — Exonération partielle de cotisations
            sociales pendant 1 an si reprise d&apos;activité (à demander
            dans les 45 j de la nouvelle activité).
          </li>
          <li>
            <strong>ARCE</strong> — Versement en capital de l&apos;ARE
            si vous étiez salarié auparavant.
          </li>
          <li>
            <strong>Adie</strong> — Micro-crédit jusqu&apos;à 15 000 €
            même si interdit bancaire (changement véhicule, équipement).
          </li>
        </ul>
      </div>

      {/* Contacts utiles */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">DGCCRF — direction concurrence</p>
          <p className="mt-1 text-xs text-navy/60">
            Signaler une pratique abusive d&apos;une plateforme (clause léonine,
            déconnexion arbitraire, non-paiement)
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://signal.conso.gouv.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> signal.conso.gouv.fr
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">Médiation indépendants-plateformes</p>
          <p className="mt-1 text-xs text-navy/60">Service gratuit en cas de litige individuel avec la plateforme</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.arpe.gouv.fr/dialogue-social/la-mediation/"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> Saisine ARPE
            </a>
          </div>
        </div>
      </div>

      {reponses.situation === 'redressement' && (
        <p className="mt-4 rounded-xl bg-jaune/10 p-3 text-xs text-navy/80">
          <strong>En redressement / liquidation</strong> : vos revenus
          d&apos;activité plateforme restent saisissables, mais les
          paiements en cours auprès de la plateforme entrent dans
          l&apos;actif disponible. Informez immédiatement le mandataire de
          tous vos comptes plateformes (Uber Driver, Deliveroo Rider…).
        </p>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Sources : ord. n° 2021-484 du 21 avril 2021 (création ARPE) ;
        loi n° 2022-139 du 7 février 2022 ; art. L7341-1 à L7342-7 et
        L8221-3 C. trav. ; arrêts Cass. soc. 28 nov. 2018 (Take Eat Easy)
        et 4 mars 2020 (Uber).
      </p>
    </BlocAccordeon>
  );
}
