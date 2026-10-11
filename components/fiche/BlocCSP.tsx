'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc autonome dédié au CSP (Contrat de Sécurisation Professionnelle).
 * Le CSP est sous-utilisé alors qu'il est obligatoire pour tout
 * employeur de moins de 1 000 salariés en cas de licenciement
 * économique, OU pour tout employeur en RJ/LJ quel que soit l'effectif.
 *
 * Distinct du BlocReclassement (qui couvre PSE, congé de reclassement
 * et formation) car le CSP a sa propre mécanique opérationnelle
 * (délai 21 j, ASP 75%, conseiller référent).
 */
export default function BlocCSP() {
  const { reponses, seuils } = useFiche();
  if (reponses.effectif !== 'salaries') return null;

  // CSP obligatoire si effectif < 1000 OU en RJ/LJ quel que soit l'effectif
  const grosseStructure = seuils.approx >= 1000;
  const cspObligatoire =
    !grosseStructure ||
    reponses.situation === 'redressement' ||
    reponses.situation === 'assignation';

  if (!cspObligatoire) return null;

  return (
    <BlocAccordeon
      icone="📋"
      titre="CSP — Contrat de Sécurisation Professionnelle"
      soustitre="Document à remettre obligatoirement à chaque salarié licencié pour motif éco"
    >
      <p className="text-sm text-navy/80">
        Le <strong>CSP</strong> est un contrat proposé aux salariés
        licenciés pour motif économique. Il offre <strong>jusqu&apos;à 12 mois une allocation
        de 75 % du salaire journalier de référence</strong> (avec au moins 1 an d&apos;ancienneté ; sinon le montant de l&apos;allocation chômage) (Allocation de
        Sécurisation Professionnelle, ASP), versée par France Travail,
        et un accompagnement renforcé. Il est <strong>obligatoire</strong>{' '}
        — s&apos;il n&apos;est pas proposé, France Travail le propose
        à la place de l&apos;employeur, qui doit alors une contribution
        de 2 mois de salaire (3 mois si le salarié adhère).
      </p>

      {/* Conditions */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">Quand le CSP est obligatoire</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Entreprise &lt; 1 000 salariés</strong> + licenciement
            économique (motif personnel = pas de CSP).
          </li>
          <li>
            <strong>Toute entreprise en RJ ou LJ</strong>, quel que soit
            l&apos;effectif — même les groupes &gt; 1 000 salariés en
            procédure collective doivent proposer le CSP au lieu du congé
            de reclassement.
          </li>
          <li>
            <strong>Tout salarié</strong> totalisant au moins 130 jours ou
            910 heures de travail sur les 24 derniers mois (36 mois à
            partir de 55 ans) — soit la majorité (Unédic, France
            Travail).
          </li>
        </ul>
      </div>

      {/* Procédure */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">Procédure pas-à-pas</p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-navy/80">
          <li>
            <strong>Remise en main propre</strong> du document CSP
            (Cerfa 14953) lors de l&apos;entretien préalable au
            licenciement, contre signature. Si refus de signer : remise
            en LRAR.
          </li>
          <li>
            <strong>Délai de 21 jours calendaires</strong> pour le salarié
            pour accepter ou refuser. Le délai court à compter de la
            remise du document.
          </li>
          <li>
            Si le salarié <strong>accepte</strong> : le contrat prend fin
            à l&apos;issue du délai de réflexion, sans préavis.
            L&apos;employeur paie l&apos;indemnité de licenciement et,
            pour un salarié d&apos;au moins 1 an d&apos;ancienneté, verse
            à France Travail l&apos;équivalent de l&apos;indemnité de
            préavis dans la limite de 3 mois de salaire (le surplus
            éventuel revient au salarié).
          </li>
          <li>
            Si le salarié <strong>refuse</strong> ou ne répond pas : le
            licenciement suit la procédure classique (préavis, indemnité).
          </li>
          <li>
            <strong>Inscription</strong> du salarié auprès de France
            Travail dans les 7 jours suivant la fin du contrat.
          </li>
        </ol>
      </div>

      {/* Avantages pour le salarié */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">Ce que le salarié reçoit</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>ASP</strong> : 75 % du salaire brut moyen des 12
            derniers mois pendant 12 mois (plafonné à 4 PASS).
          </li>
          <li>
            <strong>Accompagnement renforcé</strong> par un conseiller
            référent (entretiens hebdomadaires les 3 premiers mois,
            puis bimensuels).
          </li>
          <li>
            <strong>Aide à la reprise/création</strong> d&apos;entreprise
            (ARCE).
          </li>
          <li>
            <strong>Primes</strong> : reclassement (50 % du reliquat
            d&apos;ASP si retour à l&apos;emploi avant la fin) ;
            différentielles de rémunération (si nouveau salaire inférieur
            à l&apos;ancien).
          </li>
          <li>
            <strong>Maintien des droits</strong> mutuelle, prévoyance
            (loi Évin, art. L911-8 CSS) — souvent oublié, à rappeler.
          </li>
        </ul>
      </div>

      {/* Sanctions employeur */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          Ce qui se passe si l&apos;employeur oublie le CSP
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            <strong>Contribution à France Travail</strong> équivalente à
            2 mois de salaire brut par salarié à qui le CSP n&apos;a pas
            été proposé, portée à 3 mois si le salarié adhère au CSP
            que France Travail lui propose alors (art. L1233-66 C.
            trav.).
          </li>
          <li>
            <strong>Risque prud&apos;homal</strong> : la jurisprudence
            assimile l&apos;absence de proposition du CSP à un manquement
            qui n&apos;entraîne pas la nullité du licenciement mais
            ouvre droit à dommages-intérêts (Cass. soc. 2014).
          </li>
          <li>
            En <strong>RJ/LJ</strong> : la contribution due à France
            Travail est une créance de la procédure (à déclarer au passif
            par France Travail) — pas une dette personnelle du
            mandataire.
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div className="mt-5 rounded-2xl border border-navy/15 bg-white/60 p-4">
        <p className="font-display text-base text-navy">France Travail — Service Employeur</p>
        <p className="mt-1 text-xs text-navy/60">
          Commande du formulaire CSP, information sur la procédure,
          accompagnement de l&apos;équipe à reclasser
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
          <a
            href="https://entreprendre.service-public.gouv.fr/vosdroits/F13819"
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
          >
            <span aria-hidden>🌐</span> Fiche service-public
          </a>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : C. trav. art. L1233-65 à L1233-70 (CSP) ; Convention
        Unédic relative au CSP du 26 janv. 2015 (avenants 2018, 2021,
        2024) ; circulaire DGEFP n° 2015-09 ; Cerfa 14953*02.
      </p>
    </BlocAccordeon>
  );
}
