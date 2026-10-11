'use client';
import { useFiche } from '@/lib/FicheContext';
import { getOpcoFromNaf } from '@/lib/opco';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié aux obligations de reclassement de l'employeur en cas de
 * licenciement économique. S'affiche pour tout employeur (reponses.effectif
 * === 'salaries'), car les obligations s'appliquent dès le premier salarié.
 *
 * Couvre le CSP (obligatoire < 1000 salariés), le congé de reclassement
 * (≥ 1000), le PSE (≥ 50 et ≥ 10 licenciements/30j), ainsi que les
 * dispositifs de formation (FNE, AFE) et les contacts utiles.
 *
 * Voir aussi `getObligationsLicenciement()` dans lib/secteur.ts pour
 * le détail des obligations selon l'effectif exact.
 */
export default function BlocReclassement() {
  const { reponses, company } = useFiche();

  if (reponses.effectif !== 'salaries') return null;

  const opco = getOpcoFromNaf(company.naf);

  return (
    <BlocAccordeon
      icone="👥"
      titre="Reclassement et CSP — obligations envers vos salariés"
      soustitre="CSP, congé de reclassement, PSE : ce que l'employeur doit proposer"
    >
      <p className="text-sm text-navy/80">
        En cas de licenciement pour motif économique, l&apos;employeur a des{' '}
        <strong>obligations spécifiques de reclassement et
        d&apos;accompagnement</strong>, à géométrie variable selon
        l&apos;effectif et le nombre de licenciements envisagés. Leur
        non-respect entraîne la nullité du licenciement ou des dommages-intérêts.
      </p>

      {/* CSP */}
      <div className="mt-5 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          CSP — Contrat de Sécurisation Professionnelle (obligatoire {'<'} 1000 salariés)
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Pour tout licenciement économique dans une entreprise de{' '}
          <strong>moins de 1 000 salariés</strong> (ou en redressement /
          liquidation judiciaire, quel que soit l&apos;effectif), vous devez{' '}
          <strong>proposer le CSP</strong> à chaque salarié concerné.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>75 % du salaire journalier de référence</strong> pendant 12 mois au plus (avec au moins 1 an d&apos;ancienneté)
            (Allocation de Sécurisation Professionnelle — ASP), versée par
            France Travail.
          </li>
          <li>
            <strong>Accompagnement renforcé</strong> par un conseiller
            référent France Travail (entretiens hebdomadaires).
          </li>
          <li>
            <strong>Délai : 21 jours</strong> pour le salarié pour accepter
            ou refuser, à compter de la remise du document.
          </li>
          <li>
            Si l&apos;employeur omet de proposer le CSP, France Travail le
            propose à sa place et l&apos;employeur doit une{' '}
            <strong>contribution à France Travail</strong> de 2 mois de
            salaire, 3 mois si le salarié adhère (art. L1233-66 C. trav.).
            Le refus du salarié, lui, n&apos;entraîne aucune sanction.
          </li>
        </ul>
      </div>

      {/* Congé de reclassement */}
      <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
        <p className="font-display text-base text-jaune">
          Congé de reclassement (≥ 1 000 salariés)
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Obligatoire dans les entreprises de <strong>1 000 salariés et
          plus</strong> (et leurs groupes), le congé de reclassement dure
          de <strong>4 à 12 mois</strong>. Pendant cette période, le
          contrat est suspendu, le salarié est <strong>rémunéré par
          l&apos;employeur</strong> (100 % du salaire pendant le préavis
          puis 65 % minimum, sans pouvoir descendre sous 85 % du SMIC) et
          bénéficie d&apos;une cellule de reclassement (bilan, formation,
          accompagnement).
        </p>
      </div>

      {/* PSE */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          PSE — Plan de Sauvegarde de l&apos;Emploi
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Obligatoire si l&apos;entreprise compte <strong>au moins 50
          salariés</strong> ET envisage <strong>au moins 10 licenciements
          sur 30 jours</strong>. Le PSE doit prévoir : actions de
          reclassement interne et externe, formation, VAE, création
          d&apos;entreprise, indemnités supra-légales.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Voie majoritaire</strong> : accord collectif majoritaire{' '}
            <strong>validé</strong> par la DREETS (15 jours ; 8 jours en redressement ou liquidation judiciaire).
          </li>
          <li>
            <strong>Voie unilatérale</strong> : document unilatéral{' '}
            <strong>homologué</strong> par la DREETS (21 jours ; 8 jours en redressement ou liquidation judiciaire).
          </li>
          <li>
            Consultation préalable du CSE obligatoire (2 réunions minimum).
          </li>
          <li>
            <strong>Sanction</strong> : nullité du licenciement et
            réintégration ou indemnité minimum 6 mois.
          </li>
        </ul>
      </div>

      {/* Formation */}
      <div className="mt-4 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Dispositifs de formation à mobiliser
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>FNE-Formation</strong> : financement par l&apos;État des
            actions de formation pour maintenir l&apos;emploi pendant une
            baisse d&apos;activité. Mobilisable en activité partielle ou en
            difficulté économique.
          </li>
          <li>
            <strong>AFE — Allocation de Fin d&apos;Études</strong> :
            destinée aux salariés engagés dans une formation longue au
            moment du licenciement, pour leur permettre d&apos;aller au
            bout de leur cursus.
          </li>
          <li>
            <strong>POE — Préparation Opérationnelle à l&apos;Emploi</strong> :
            financement d&apos;une formation préalable à une embauche déjà
            identifiée.
          </li>
        </ul>
      </div>

      {/* OPCO compétent */}
      {opco.cle !== 'autre' && (
        <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-base text-vert">
            Votre OPCO compétent : {opco.nom}
          </p>
          <p className="mt-2 text-sm text-navy/80">
            {opco.description}
          </p>
          <p className="mt-2 text-sm text-navy/80">
            <strong>Mobilisez l&apos;OPCO en priorité</strong> pour
            financer FNE-Formation, POE individuelle, ProA, ou pour
            commander vos formulaires CSP. Délais de réponse souvent
            inférieurs à 15 jours pour les dossiers urgents.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            {opco.telephone && (
              <a
                href={`tel:${opco.telephone.replace(/\s/g, '')}`}
                className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
              >
                <span aria-hidden>☎</span> {opco.telephone}
              </a>
            )}
            <a
              href={opco.site}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> {(() => { try { return new URL(opco.site).hostname.replace('www.', ''); } catch { return 'site'; } })()}
            </a>
          </div>
        </div>
      )}

      {/* Contacts */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">
            France Travail — Service Employeur
          </p>
          <p className="mt-1 text-xs text-navy/60">
            CSP, mobilisation des dispositifs, ouverture des droits salariés
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="tel:3995"
              className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
            >
              <span aria-hidden>☎</span> 39 95
            </a>
            <a
              href="https://www.francetravail.fr/employeur/vos-declarations-et-cotisations/la-fin-de-vos-contrats-de-travai/le-contrat-de-securisation-profe.html"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> francetravail.fr — CSP employeur
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">
            DREETS — Direction du Travail
          </p>
          <p className="mt-1 text-xs text-navy/60">
            Validation / homologation du PSE, contrôle de la procédure de
            licenciement collectif
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="https://www.travail-emploi.gouv.fr/le-ministere-en-action/dreets"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> Trouver ma DREETS
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : Code du travail, art. L1233-65 et s. (CSP), L1233-71 et s.
        (congé de reclassement), L1233-61 et s. (PSE) ; circulaires Unédic
        et France Travail relatives à l&apos;ASP ; ministère du Travail
        (FNE-Formation, AFE, POE).
      </p>
    </BlocAccordeon>
  );
}
