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
          La loi <strong>présume</strong> que le travailleur immatriculé
          (registre, Urssaf) n&apos;est pas salarié : il est{' '}
          <strong>indépendant</strong> (art. L8221-6 C. trav.). Cette
          présomption peut cependant être renversée si vous démontrez un{' '}
          <strong>lien de subordination juridique permanent</strong>{' '}
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
          Créée en 2021, l&apos;ARPE encadre le dialogue social entre
          plateformes (VTC, livraison) et représentants des
          travailleurs élus. <strong>Des accords de secteur</strong>,
          rendus obligatoires par homologation, sont signés depuis 2023 :
          revenu minimal par course et revenu minimal horaire et
          kilométrique pour les VTC (accords des 18 janvier et 19 décembre
          2023), garantie minimale de revenus pour les livreurs (accord du
          20 avril 2023, portée à 19 € par heure d&apos;activité par
          l&apos;avenant du 10 juillet 2026). Montants en vigueur sur
          arpe.gouv.fr.
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
              (registre en ligne du ministère chargé des transports),
              renouvellement <strong>tous les 5 ans</strong>.
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
              <strong>Capacité financière</strong> : garantie de 1 500 €
              par véhicule, sauf si le véhicule vous appartient ou est loué
              pour plus de 6 mois.
            </li>
            <li>
              <strong>Litige avec la plateforme</strong> : les
              organisations représentatives des chauffeurs élues auprès de
              l&apos;ARPE peuvent vous accompagner (liste sur arpe.gouv.fr).
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
              <strong>Charte sociale</strong> facultative : la plateforme
              peut établir une charte, homologuée par l&apos;administration,
              précisant ses engagements (revenu, protection, formation —
              art. L7342-9).
            </li>
            <li>
              <strong>Assurance accidents du travail</strong> : si vous en
              souscrivez une, la plateforme prend en charge la cotisation
              dans la limite d&apos;un plafond, dès lors que votre chiffre
              d&apos;affaires sur la plateforme dépasse un seuil fixé par
              décret (art. L7342-2 et L7342-4).
            </li>
            <li>
              <strong>Formation</strong> : la plateforme prend en charge
              votre contribution à la formation professionnelle et abonde
              votre CPF au-delà d&apos;un seuil de chiffre d&apos;affaires
              (art. L7342-3).
            </li>
            <li>
              <strong>Action collective</strong> possible via les
              organisations représentatives des livreurs élues auprès de
              l&apos;ARPE (liste sur arpe.gouv.fr).
            </li>
          </ul>
        </div>
      )}

      {/* Requalification - la défense */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          ⚠️ Si vous êtes en redressement / liquidation : pensez à la requalification
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Si votre relation avec la plateforme est{' '}
          <strong>requalifiée en contrat de travail</strong>, c&apos;est
          la plateforme, comme employeur, qui doit les cotisations
          sociales ; elle s&apos;expose aussi à des poursuites pour travail
          dissimulé (art. L8221-5 et L8221-6 C. trav.), et vous pouvez
          réclamer rappels de salaires et indemnités devant le conseil de
          prud&apos;hommes. Indices examinés par les juges : tarif imposé,
          géolocalisation et notation, sanctions ou déconnexion en cas de
          refus de course. <strong>Conservez les preuves</strong>{' '}
          (captures d&apos;écran, messages, sanctions, historique des
          courses) et parlez-en à un avocat.
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
            (19,73 à 26,30 €/jour, soit environ 600 à 800 €/mois, pendant
            182 jours) si cessation involontaire et conditions
            d&apos;activité remplies.
          </li>
          <li>
            <strong>ACRE</strong> — Exonération partielle de cotisations
            sociales pendant 12 mois au plus en cas de création ou reprise
            d&apos;entreprise (plus automatique depuis 2026 : à demander à
            l&apos;Urssaf dans les 60 jours suivant le début
            d&apos;activité).
          </li>
          <li>
            <strong>ARCE</strong> — Versement en capital de 60 % de vos
            droits restants à l&apos;ARE, si vous êtes indemnisé·e par
            France Travail et avez obtenu l&apos;ACRE.
          </li>
          <li>
            <strong>Adie</strong> — Micro-crédit jusqu&apos;à 15 000 €
            sur 48 mois au plus, pour les personnes sans accès au crédit
            bancaire (changement de véhicule, équipement).
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
          <p className="font-display text-base text-navy">Médiation de l&apos;ARPE</p>
          <p className="mt-1 text-xs text-navy/60">Gratuite, pour un différend sur l&apos;application d&apos;un accord de secteur ; saisine par un représentant des travailleurs que vous mandatez</p>
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
          <strong>En redressement / liquidation</strong> : les sommes que
          la plateforme vous doit au titre de votre activité font partie de
          l&apos;actif de l&apos;entreprise. Informez immédiatement le
          mandataire de tous vos comptes plateformes (Uber Driver,
          Deliveroo Rider…).
        </p>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Sources : ord. n° 2021-484 du 21 avril 2021 (création ARPE) ;
        loi n° 2022-139 du 7 février 2022 ; art. L7341-1 et s. et
        L8221-6 C. trav. ; accords de secteur publiés sur arpe.gouv.fr ;
        arrêts Cass. soc. 28 nov. 2018 (Take Eat Easy) et 4 mars 2020
        (Uber).
      </p>
    </BlocAccordeon>
  );
}
