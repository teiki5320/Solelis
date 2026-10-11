'use client';
import { useState, useEffect, useMemo } from 'react';
import { useFiche, useFicheStorageKey } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

/** Événement custom : l'event `storage` du navigateur ne se déclenche que
 *  dans les AUTRES onglets — BlocRappels s'appuie sur celui-ci pour se
 *  resynchroniser quand la date est saisie dans le même onglet. */
export const CESSATION_DATE_EVENT = 'solelis:cessation-date';

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDateFR(d: Date): string {
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

interface Verdict {
  niveau: 'safe' | 'urgent' | 'depasse';
  joursRestants: number;
  joursEcoules: number;
  echeance: Date;
  titre: string;
  message: string;
  actions: string[];
}

function buildVerdict(dateCessation: Date): Verdict {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cessation = new Date(dateCessation);
  cessation.setHours(0, 0, 0, 0);
  const echeance = addDays(cessation, 45);
  const joursEcoules = daysBetween(cessation, today);
  const joursRestants = daysBetween(today, echeance);

  if (joursRestants < 0) {
    return {
      niveau: 'depasse',
      joursRestants,
      joursEcoules,
      echeance,
      titre: `Délai de 45 jours dépassé de ${Math.abs(joursRestants)} jour${Math.abs(joursRestants) > 1 ? 's' : ''}`,
      message:
        "L'article L631-4 du Code de commerce imposait de demander l'ouverture d'une procédure sous 45 jours (sauf conciliation demandée dans ce délai). Avoir omis sciemment de le faire expose à une interdiction de gérer (art. L653-8) ; en liquidation, le retard peut aussi être retenu comme faute de gestion (art. L651-2). Régularisez SANS attendre : plus le retard s'allonge, plus le risque augmente.",
      actions: [
        "Consultez un avocat ou un mandataire judiciaire dans les 24 h",
        "Préparez immédiatement la déclaration (formulaire CERFA n°10530)",
        "Documentez les raisons du retard (négociations en cours, accident, etc.) — un retard justifié réduit la portée des sanctions",
        "Aucune décision d'engagement ne doit plus être prise sans l'avis du conseil",
      ],
    };
  }

  if (joursRestants <= 10) {
    return {
      niveau: 'urgent',
      joursRestants,
      joursEcoules,
      echeance,
      titre: `Plus que ${joursRestants} jour${joursRestants > 1 ? 's' : ''} pour déclarer`,
      message: `La déclaration de cessation des paiements doit être déposée au plus tard le ${formatDateFR(echeance)}. Au-delà, une interdiction de gérer peut être prononcée (art. L653-8 C. com.) et le retard peut être retenu comme faute de gestion (art. L651-2).`,
      actions: [
        "Prenez rendez-vous avec un avocat ou un mandataire judiciaire dès aujourd'hui",
        "Téléchargez le formulaire CERFA 10530 (déclaration de cessation)",
        "Rassemblez : K-bis < 3 mois, état du passif exigible, état de l'actif disponible, comptes annuels, situation de trésorerie < 1 mois",
        "Décidez de la procédure visée (RJ ou LJ) avec votre conseil",
      ],
    };
  }

  return {
    niveau: 'safe',
    joursRestants,
    joursEcoules,
    echeance,
    titre: `Vous avez encore ${joursRestants} jour${joursRestants > 1 ? 's' : ''} pour déclarer`,
    message: `Date limite légale : ${formatDateFR(echeance)} (45 j après la cessation). Cette fenêtre permet aussi de tenter une conciliation si la cessation date de moins de 45 j.`,
    actions: [
      "Si vous l'envisagez, demandez en parallèle l'ouverture d'une conciliation (C. com. L611-4) — accessible jusqu'à 45 j de cessation",
      "Préparez vos pièces justificatives sans attendre",
      "Évitez tout acte aggravant : nouvelle dette, paiement préférentiel à un créancier (peut être annulé en période suspecte)",
    ],
  };
}

const STYLES: Record<Verdict['niveau'], { bg: string; border: string; text: string }> = {
  safe: { bg: 'bg-bleu/10', border: 'border-bleu/30', text: 'text-bleu-fonce' },
  urgent: { bg: 'bg-jaune/15', border: 'border-jaune/40', text: 'text-jaune' },
  depasse: { bg: 'bg-rouge/10', border: 'border-rouge/40', text: 'text-rouge' },
};

export default function BlocCessationDecompte() {
  const { reponses } = useFiche();
  const storageKey = useFicheStorageKey('solelis_cessation_date');
  const [dateStr, setDateStr] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setDateStr(stored);
    } catch {}
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      if (dateStr) localStorage.setItem(storageKey, dateStr);
      else localStorage.removeItem(storageKey);
    } catch {}
    window.dispatchEvent(new CustomEvent(CESSATION_DATE_EVENT, { detail: dateStr }));
  }, [dateStr, loaded, storageKey]);

  const pertinent =
    reponses.situation === 'redressement' ||
    reponses.situation === 'assignation' ||
    reponses.situation === 'tresorie';

  const verdict = useMemo<Verdict | null>(() => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return buildVerdict(d);
  }, [dateStr]);

  const todayISO = new Date().toISOString().slice(0, 10);

  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="⏳"
      titre="Décompte légal des 45 jours (cessation des paiements)"
      soustitre={
        verdict
          ? verdict.niveau === 'depasse'
            ? `⚠️ Délai dépassé de ${Math.abs(verdict.joursRestants)} j`
            : `${verdict.joursRestants} j restants · échéance ${formatDateFR(verdict.echeance)}`
          : 'Renseignez la date de cessation pour activer le décompte'
      }
    >
      <p className="mb-4 text-sm text-navy/80">
        L&apos;article <strong>L631-4 du Code de commerce</strong> impose au
        dirigeant de demander l&apos;ouverture d&apos;une procédure au
        tribunal dans les <strong>45 jours</strong> qui suivent la
        cessation des paiements, sauf s&apos;il a demandé une conciliation
        dans ce délai. Omettre sciemment de le faire expose à une
        interdiction de gérer (art. L653-8) ; en liquidation, le retard
        peut aussi être retenu comme faute de gestion (responsabilité pour
        insuffisance d&apos;actif, art. L651-2). La banqueroute (art.
        L654-2) vise des actes frauduleux, pas un simple retard.
      </p>

      <label className="block text-xs text-navy/70">
        Date à laquelle la cessation des paiements est intervenue
        <input
          type="date"
          max={todayISO}
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm text-navy"
        />
        <span className="mt-1 block text-[11px] text-navy/50">
          La cessation est définie comme l&apos;impossibilité de faire face
          au passif exigible avec l&apos;actif disponible (L631-1 C. com.).
          En cas de doute, votre expert-comptable peut la dater précisément.
        </span>
      </label>

      {verdict && (
        <div className={`mt-5 rounded-2xl border p-5 ${STYLES[verdict.niveau].bg} ${STYLES[verdict.niveau].border}`}>
          <p className={`font-display text-base sm:text-lg ${STYLES[verdict.niveau].text}`}>
            {verdict.titre}
          </p>
          <p className="mt-2 text-sm text-navy/80">{verdict.message}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-3">
            <div className="rounded-xl bg-white/70 p-3">
              <p className="font-display text-xl text-navy">{verdict.joursEcoules}</p>
              <p className="mt-1 text-navy/60">jours écoulés</p>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <p className={`font-display text-xl ${verdict.niveau === 'depasse' ? 'text-rouge' : 'text-navy'}`}>
                {verdict.niveau === 'depasse' ? '−' : ''}{Math.abs(verdict.joursRestants)}
              </p>
              <p className="mt-1 text-navy/60">jours {verdict.niveau === 'depasse' ? 'de retard' : 'restants'}</p>
            </div>
            <div className="rounded-xl bg-white/70 p-3">
              <p className="font-display text-xl text-navy">45</p>
              <p className="mt-1 text-navy/60">délai légal</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-navy/70">
            Échéance limite : <strong>{formatDateFR(verdict.echeance)}</strong>
          </p>

          <div className="mt-4">
            <p className="font-display text-sm text-navy">À faire</p>
            <ul className="mt-2 space-y-1.5 text-sm text-navy/80">
              {verdict.actions.map((a, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-navy/40">→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Ce décompte est indicatif. Le tribunal fixe la date exacte de
        cessation, qui peut être reportée jusqu&apos;à 18 mois avant le
        jugement d&apos;ouverture (art. L631-8 C. com.). Un
        avocat ou un mandataire peut la fixer précisément.
      </p>
      <p className="mt-1 text-xs text-navy/45">
        Source : Code de commerce, art. L611-4, L631-1, L631-4, L651-2,
        L653-8, L654-2.
      </p>
    </BlocAccordeon>
  );
}
