'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/**
 * Bloc dédié aux difficultés liées au remboursement d'un PGE (Prêt
 * Garanti par l'État) souscrit pendant la crise Covid. La restructuration
 * d'un PGE est l'une des principales causes de défaillance entre 2024
 * et 2025 ; ce bloc s'affiche dès qu'un signal bancaire/trésorerie
 * apparaît dans les réponses.
 */
export default function BlocPGE() {
  const { reponses } = useFiche();

  // Affiché aussi quand un PGE est déclaré en cours : la carte prioritaire
  // « PGE en cours » renvoie vers ce bloc.
  const pertinent =
    reponses.probleme === 'banque' || reponses.situation === 'tresorie' || reponses.pgeEnCours === 'oui';

  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="💳"
      titre="PGE en difficulté ? Restructuration possible"
      soustitre="Médiation du Crédit BdF — étalement jusqu'à 10 ans avant la procédure collective"
    >
      <p className="text-sm text-navy/80">
        Le <strong>PGE — Prêt Garanti par l&apos;État</strong>, distribué
        pendant la crise sanitaire (2020-2021), entre dans sa phase de
        remboursement la plus tendue, qui pèse sur la trésorerie de
        nombreuses entreprises. Une <strong>restructuration
        amiable</strong> est possible — et largement préférable à
        l&apos;ouverture d&apos;une procédure collective.
      </p>

      {/* Qu'est-ce que le PGE */}
      <div className="mt-5 rounded-2xl border border-bleu/30 bg-bleu/5 p-4">
        <p className="font-display text-base text-bleu-fonce">
          Rappel : qu&apos;est-ce que le PGE ?
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Prêt distribué par votre banque, <strong>garanti à 70 à 90 %
          par l&apos;État via Bpifrance</strong>. Différé de remboursement
          d&apos;1 ou 2 ans, puis amortissement initial sur 1 à 5 ans.
          La garantie d&apos;État porte sur le capital, pas sur les
          intérêts.
        </p>
      </div>

      {/* Accord-cadre & restructuration */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          Accord-cadre BdF / Fédération bancaire française
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Un protocole de place signé entre la Banque de France, la
          Médiation du crédit, la Fédération bancaire française et
          Bpifrance permet de <strong>réétaler le PGE jusqu&apos;à 10 ans
          au total</strong> (au lieu des 6 ans initiaux), <strong>sans
          perte de la garantie d&apos;État</strong> et sans inscription
          défavorable au fichier des incidents.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            Demande à formuler à votre banque dès les premiers signes
            de tension de trésorerie.
          </li>
          <li>
            En cas de refus, saisine gratuite et confidentielle de la
            <strong> Médiation du crédit</strong>.
          </li>
          <li>
            La restructuration peut s&apos;accompagner d&apos;une période
            de différé supplémentaire (6 à 12 mois).
          </li>
        </ul>
      </div>

      {/* Procédure pas-à-pas */}
      <div className="mt-4 rounded-2xl border border-navy/15 bg-white/60 p-4 text-sm text-navy/80">
        <p className="font-display text-base text-navy">
          Procédure pas-à-pas — restructuration PGE en 5 étapes
        </p>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5">
          <li>
            <strong>Préparer le dossier</strong> : prévisionnel de
            trésorerie à 12 mois, dernier bilan, justificatifs de la
            baisse d&apos;activité, plan d&apos;actions correctives.
          </li>
          <li>
            <strong>Demande écrite à la banque</strong> (LRAR ou
            courriel suivi) : « demande de réaménagement du PGE n° X
            au titre du protocole de place du 19 janvier 2022 »,
            durée totale ≤ 10 ans, différé éventuel.
          </li>
          <li>
            <strong>RDV avec votre conseiller</strong> : demandez une
            réponse écrite et, en cas de refus, ses motifs.
          </li>
          <li>
            <strong>En cas de refus ou sans réponse</strong> :
            saisir la Médiation du crédit (formulaire en ligne,
            entièrement gratuit). Le médiateur reprend contact avec
            votre banque sous 48 h.
          </li>
          <li>
            <strong>Plan validé</strong> : signature d&apos;un avenant
            au PGE — la garantie Bpifrance/État est <strong>maintenue</strong>{' '}
            de plein droit (pas de nouvel accord à demander à Bpifrance).
          </li>
        </ol>
      </div>

      {/* Priorité avant la procédure collective */}
      <div className="mt-4 rounded-2xl border border-rouge/30 bg-rouge/5 p-4">
        <p className="font-display text-base text-rouge">
          ⚠️ À traiter AVANT une procédure collective
        </p>
        <p className="mt-2 text-sm text-navy/80">
          L&apos;ouverture d&apos;une sauvegarde ou d&apos;un redressement
          <strong> ne fait pas perdre la garantie de l&apos;État</strong> :
          c&apos;est un « évènement de crédit » qui permet à la banque de
          l&apos;appeler. Si le PGE est rééchelonné dans le plan, la garantie
          le suit et la banque n&apos;est indemnisée qu&apos;à la fin du prêt
          restructuré ; en liquidation, à la remise du certificat
          d&apos;irrecouvrabilité. Tenter d&apos;abord l&apos;amiable reste
          préférable (confidentiel, plus souple) : Médiation du crédit,
          mandat ad hoc ou conciliation.
          <span className="mt-1 block text-xs text-navy/55">
            Sources : arrêté du 23 mars 2020 modifié, art. 6 ; FAQ PGE du
            ministère de l&apos;Économie (version du 25 mars 2026).
          </span>
        </p>
      </div>

      {/* Contacts */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">
            Médiation du crédit aux entreprises
          </p>
          <p className="mt-1 text-xs text-navy/60">
            Confidentiel et gratuit
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="tel:3414"
              className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
            >
              <span aria-hidden>☎</span> 34 14
            </a>
            <a
              href="https://mediateur-credit.banque-france.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> mediateur-credit.banque-france.fr
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-navy/15 bg-white/60 p-4">
          <p className="font-display text-base text-navy">
            Correspondant TPE-PME · Banque de France
          </p>
          <p className="mt-1 text-xs text-navy/60">
            Premier diagnostic confidentiel
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a
              href="tel:3414"
              className="rounded-full bg-white/80 px-3 py-1.5 text-navy/80 hover:bg-white"
            >
              <span aria-hidden>☎</span> 34 14
            </a>
            <a
              href="https://entreprises.banque-france.fr"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1.5 text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>🌐</span> entreprises.banque-france.fr
            </a>
          </div>
        </div>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Sources : protocole de place « Restructuration des PGE » du 19
        janvier 2022 (BdF, FBF, Bpifrance) ; Médiation du crédit aux
        entreprises ; loi de finances rectificative 2020 (PGE — art. 6).
      </p>
    </BlocAccordeon>
  );
}
