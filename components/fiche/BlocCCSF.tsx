'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';
import { getDepartement } from '@/lib/organismes';

export default function BlocCCSF() {
  const { reponses, company } = useFiche();
  const pertinent =
    reponses.probleme === 'urssaf' ||
    reponses.probleme === 'impots' ||
    reponses.situation === 'tresorie' ||
    reponses.situation === 'redressement';

  if (!pertinent) return null;

  const dep = company.departement || '';
  const depData = dep ? getDepartement(dep) : null;
  const ddfip = depData?.ddfip ?? null;

  return (
    <BlocAccordeon
      icone="🏛️"
      titre="CCSF — un guichet unique pour vos dettes fiscales ET sociales"
      soustitre="Plan d'échelonnement consolidé en une seule demande"
    >
      <p className="text-sm text-navy/80">
        La <strong>Commission des chefs des services financiers</strong>{' '}
        (CCSF) est un dispositif officiel qui permet à une entreprise en
        difficulté d&apos;obtenir un <strong>plan d&apos;apurement
        unique</strong> couvrant à la fois ses dettes fiscales (impôts,
        TVA, IS) ET ses dettes sociales (URSSAF, y compris la sécurité
        sociale des indépendants, MSA, retraite complémentaire,
        contributions d&apos;assurance chômage).
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-sm text-vert">✓ Avantages clés</p>
          <ul className="mt-2 space-y-1 text-sm text-navy/80">
            <li>• Un seul interlocuteur (DDFiP)</li>
            <li>• Échelonnement jusqu&apos;à 36 mois</li>
            <li>• Dettes fiscales + sociales traitées ensemble</li>
            <li>• Suspension des poursuites pendant l&apos;instruction</li>
            <li>• Confidentielle (non publiée)</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-jaune/30 bg-jaune/5 p-4">
          <p className="font-display text-sm text-jaune">⚠️ Conditions</p>
          <ul className="mt-2 space-y-1 text-sm text-navy/80">
            <li>• Entreprise à jour de ses obligations déclaratives</li>
            <li>• Cotisations courantes payées (ou plan accepté)</li>
            <li>• Pas en procédure collective ouverte</li>
            <li>• Difficulté avérée mais activité viable</li>
          </ul>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-bleu/20 bg-bleu/5 p-4">
        <p className="font-display text-base text-navy">
          Comment saisir la CCSF
        </p>
        <ol className="mt-2 space-y-2 text-sm text-navy/80">
          <li>
            <strong>1.</strong> Téléchargez le formulaire CERFA
            n°15772*02 sur <em>impots.gouv.fr</em> ou demandez-le à votre SIE.
          </li>
          <li>
            <strong>2.</strong> Joignez : 3 derniers bilans, situation
            comptable récente, prévisionnel de trésorerie, état du passif
            fiscal et social, plan d&apos;apurement proposé.
          </li>
          <li>
            <strong>3.</strong> Adressez-le à la <strong>DDFiP{dep ? ` du département ${dep}` : ''}</strong>{' '}
            (Direction Départementale des Finances Publiques) — bureau du
            recouvrement amiable.
          </li>
          <li>
            <strong>4.</strong> La CCSF se réunit en moyenne toutes les
            6 semaines. Décision sous 2 à 3 mois.
          </li>
        </ol>
      </div>

      {ddfip && (
        <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <p className="font-display text-base text-vert">
            Votre DDFiP de rattachement
          </p>
          <p className="mt-1 text-sm text-navy/80">{ddfip.nom}</p>
          {ddfip.adresse && (
            <p className="mt-0.5 text-xs text-navy/60">{ddfip.adresse}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <a
              href={`tel:${(ddfip.telephone ?? '0809401401').replace(/\s/g, '')}`}
              className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
            >
              <span aria-hidden>☎</span> {ddfip.telephone ?? '0 809 401 401'}
            </a>
            {ddfip.site && (
              <a
                href={ddfip.site}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
              >
                <span aria-hidden>🌐</span> contacts impots.gouv.fr
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        <a
          href="https://www.impots.gouv.fr/professionnel/accompagnement-individualise-en-cas-de-difficultes-economiques-et-financieres"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
        >
          <span aria-hidden>🌐</span> impots.gouv.fr — page officielle CCSF
        </a>
        <a
          href="https://www.formulaires.service-public.fr/gf/cerfa_15772.do"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
        >
          📄 Formulaire Cerfa n°15772*02
        </a>
        <a
          href="tel:0809401401"
          className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
        >
          <span aria-hidden>☎</span> 0 809 401 401 (renseignements fiscaux)
        </a>
        <a
          href="https://www.economie.gouv.fr/entreprises/commission-chefs-services-financiers-ccsf"
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
        >
          <span aria-hidden>🌐</span> economie.gouv.fr — guide CCSF
        </a>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Source : décret n°2007-686 du 4 mai 2007 et articles D626-9 à
        D626-15 du Code de commerce (remises de dettes publiques).
      </p>
    </BlocAccordeon>
  );
}
