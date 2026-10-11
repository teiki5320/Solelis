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
      soustitre="Médiation du crédit BdF — jusqu'à +2 ans (+4 par exception), avant la procédure collective"
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
          La garantie couvre un pourcentage du capital, des intérêts et
          accessoires restant dus (arrêté du 23 mars 2020, art. 6).
        </p>
      </div>

      {/* Accord-cadre & restructuration */}
      <div className="mt-4 rounded-2xl border border-vert/30 bg-vert/5 p-4">
        <p className="font-display text-base text-vert">
          Accord de place du 19 janvier 2022 (État, BdF, IEDOM, IEOM, FBF)
        </p>
        <p className="mt-2 text-sm text-navy/80">
          Un accord de place signé par l&apos;État, la Banque de France,
          l&apos;IEDOM, l&apos;IEOM et la Fédération bancaire française,
          prolongé jusqu&apos;au 31 décembre 2026, permet aux TPE et PME
          dont les PGE totalisent au plus 50 000 € à l&apos;octroi (au-delà,
          seulement par exception) et qui ne sont pas en cessation des
          paiements de{' '}
          <strong>allonger le PGE de 2 ans au plus</strong> par rapport à
          l&apos;échéancier initial (4 ans au plus si c&apos;est
          particulièrement justifié, soit 10 ans au total au maximum) dans le cadre de la Médiation du
          crédit, <strong>sans perte de la garantie d&apos;État</strong>.
          Attention : la restructuration est en principe classée « en
          défaut » par les banques, ce qui peut peser sur la cotation et
          l&apos;accès à de nouveaux crédits.
        </p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy/80">
          <li>
            Parlez-en à votre banque dès les premiers signes de tension
            de trésorerie.
          </li>
          <li>
            La restructuration passe par une saisine gratuite et
            confidentielle de la<strong> Médiation du crédit</strong>.
          </li>
          <li>
            Elle peut s&apos;accompagner, si c&apos;est particulièrement
            justifié, d&apos;un différé en capital de 6 mois au plus,
            compris dans la durée d&apos;allongement.
          </li>
          <li>
            Ce recours n&apos;est possible qu&apos;une seule fois.
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
            courriel suivi) : « demande de réaménagement du PGE n° X »,
            avec la durée et le différé souhaités.
          </li>
          <li>
            <strong>RDV avec votre conseiller</strong> : demandez une
            réponse écrite et, en cas de refus, ses motifs.
          </li>
          <li>
            <strong>En cas de refus ou sans réponse</strong> :
            saisir la Médiation du crédit (formulaire en ligne,
            entièrement gratuit) — c&apos;est dans ce cadre que
            s&apos;applique l&apos;accord de place. Le médiateur vous
            contacte sous 48 h.
          </li>
          <li>
            <strong>Accord trouvé</strong> : signature d&apos;un avenant
            au PGE — la garantie de l&apos;État est <strong>maintenue</strong>{' '}
            sur le nouvel échéancier, sans prime de garantie sur la durée
            supplémentaire.
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
            Accompagnement gratuit et orientation
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
        Sources : accord de place du 19 janvier 2022 sur les
        restructurations de PGE (État, Banque de France, IEDOM, IEOM, FBF),
        prolongé jusqu&apos;au 31 décembre 2026 ; fiche « Restructuration
        de PGE » de la Médiation du crédit (banque-france.fr) ; loi
        n° 2020-289 du 23 mars 2020 de finances rectificative, art. 6.
      </p>
    </BlocAccordeon>
  );
}
