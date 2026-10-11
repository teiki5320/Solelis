'use client';
import { useState, useMemo, useEffect, useId, useRef } from 'react';
import { useFiche, useFicheStorageKey } from '@/lib/FicheContext';
import { buildIcs, downloadIcs, type IcsEvent } from '@/lib/ics';
import BlocAccordeon from './BlocAccordeon';
import { CESSATION_DATE_EVENT } from './BlocCessationDecompte';
import { estDateRappelAcceptable } from '@/lib/dateRappel';

interface Echeance {
  cle: string;
  titre: string;
  joursAvantAjd: number; // peut être négatif si futur
  description: string;
  source: string;
  baseDate: Date;
}

function addDays(d: Date, n: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  out.setHours(9, 0, 0, 0);
  return out;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

/** Date locale au format AAAA-MM-JJ (attendu par /api/fiche/rappels). */
export function dateIsoLocale(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Délais proposés pour le rappel par e-mail, en jours avant l'échéance. */
const DELAIS_RAPPEL = [
  { jours: 7, label: '7 jours avant' },
  { jours: 2, label: '2 jours avant' },
  { jours: 0, label: 'Le jour même' },
] as const;

/**
 * Date d'envoi du rappel : N jours avant l'échéance, mais jamais avant
 * aujourd'hui (l'API refuse une date passée).
 */
export function dateEnvoiRappel(echeance: Date, joursAvant: number, maintenant: Date = new Date()): string {
  const envoi = new Date(echeance);
  envoi.setDate(envoi.getDate() - joursAvant);
  const aujourdhui = dateIsoLocale(maintenant);
  const iso = dateIsoLocale(envoi);
  return iso < aujourdhui ? aujourdhui : iso;
}

/** Message d'erreur affiché selon la réponse de /api/fiche/rappels. */
export function messageErreurRappel(status: number | null): string {
  if (status === 409) {
    return 'Enregistrez d’abord votre fiche par e-mail (bandeau « Sauvegardez votre fiche par e-mail » en haut de la page), puis programmez le rappel : il sera envoyé à cette adresse.';
  }
  if (status === 404) {
    return 'Cette fiche n’est pas enregistrée sur nos serveurs : le rappel par e-mail n’est pas disponible. Utilisez plutôt le fichier calendrier (.ics).';
  }
  if (status === 400) {
    return 'Cette date ne convient pas : le rappel doit tomber entre aujourd’hui et dans 2 ans.';
  }
  if (status === 429) {
    return 'Trop de demandes ou trop de rappels déjà programmés pour cette fiche. Réessayez plus tard.';
  }
  return 'Le rappel n’a pas pu être programmé. Réessayez plus tard — vous pouvez aussi télécharger le calendrier (.ics).';
}

type StatutEnvoi = 'idle' | 'sending' | 'done' | 'err';

/** Formulaire « Recevoir un rappel par e-mail » (même style que SaveBanner). */
function RappelEmail({ token, echeances }: { token: string; echeances: Echeance[] }) {
  const futures = echeances.filter((e) => estDateRappelAcceptable(dateIsoLocale(e.baseDate)));
  const [cle, setCle] = useState('');
  const [joursAvant, setJoursAvant] = useState<number>(DELAIS_RAPPEL[0].jours);
  const [status, setStatus] = useState<StatutEnvoi>('idle');
  const [erreur, setErreur] = useState('');
  const [programme, setProgramme] = useState('');
  const idEcheance = useId();
  const idDelai = useId();
  const idAide = useId();
  const idErreur = useId();

  if (futures.length === 0) return null;
  const choisie = futures.find((e) => e.cle === cle) ?? futures[0];

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === 'sending') return;
    const echeance = dateIsoLocale(choisie.baseDate);
    const dateRappel = dateEnvoiRappel(choisie.baseDate, joursAvant);
    setStatus('sending');
    setErreur('');
    try {
      const res = await fetch('/api/fiche/rappels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, echeance, dateRappel, libelle: choisie.titre.slice(0, 80) }),
      });
      if (res.ok) {
        const [a, m, j] = dateRappel.split('-').map(Number);
        setProgramme(formatDate(new Date(a, m - 1, j)));
        setStatus('done');
        return;
      }
      setErreur(messageErreurRappel(res.status));
      setStatus('err');
    } catch {
      setErreur(messageErreurRappel(null));
      setStatus('err');
    }
  }

  return (
    <div className="no-print mt-4">
      <p className="sr-only" aria-live="polite" role="status">
        {status === 'sending' && 'Programmation du rappel…'}
        {status === 'done' && `Rappel programmé pour le ${programme}.`}
      </p>
      {status === 'done' ? (
        <div className="dashed-band flex items-center gap-3 p-4 text-sm text-bleu-fonce">
          <span aria-hidden="true">✉︎</span>
          <span>
            Rappel programmé : un e-mail vous sera envoyé le <strong>{programme}</strong> à
            l&apos;adresse enregistrée pour cette fiche.{' '}
            <button
              type="button"
              onClick={() => setStatus('idle')}
              className="underline underline-offset-2"
            >
              Programmer un autre rappel
            </button>
          </span>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="dashed-band p-4 sm:p-5">
          <p className="text-sm font-medium text-navy">Recevoir un rappel par e-mail</p>
          <p id={idAide} className="text-xs text-navy/55">
            Le rappel part à l&apos;adresse enregistrée avec « Sauvegardez votre fiche par
            e-mail » (en haut de la fiche) : enregistrez-la d&apos;abord si ce n&apos;est pas fait.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <label htmlFor={idEcheance} className="sr-only">
              Échéance à rappeler
            </label>
            <select
              id={idEcheance}
              value={choisie.cle}
              onChange={(e) => {
                setCle(e.target.value);
                if (status === 'err') setStatus('idle');
              }}
              aria-describedby={status === 'err' ? `${idAide} ${idErreur}` : idAide}
              className="min-h-[44px] w-full min-w-0 rounded-full border border-navy/10 bg-white/80 px-4 py-2 text-sm focus:border-bleu focus:outline-none"
            >
              {futures.map((e) => (
                <option key={e.cle} value={e.cle}>
                  {e.titre} — {formatDate(e.baseDate)}
                </option>
              ))}
            </select>
            {/* Bloc étroit (colonne de la fiche) : échéance sur toute la largeur, puis délai + bouton. */}
            <div className="flex flex-wrap gap-2">
              <label htmlFor={idDelai} className="sr-only">
                Quand recevoir le rappel
              </label>
              <select
                id={idDelai}
                value={joursAvant}
                onChange={(e) => {
                  setJoursAvant(Number(e.target.value));
                  if (status === 'err') setStatus('idle');
                }}
                className="min-h-[44px] min-w-0 flex-1 basis-40 rounded-full border border-navy/10 bg-white/80 px-4 py-2 text-sm focus:border-bleu focus:outline-none"
              >
                {DELAIS_RAPPEL.map((d) => (
                  <option key={d.jours} value={d.jours}>
                    {d.label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={status === 'sending'}
                aria-busy={status === 'sending'}
                className="min-h-[44px] rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {status === 'sending' ? 'Envoi…' : 'Programmer'}
              </button>
            </div>
          </div>
          {status === 'err' && (
            <p id={idErreur} role="alert" className="mt-2 text-xs text-rouge">
              {erreur}
            </p>
          )}
        </form>
      )}
    </div>
  );
}

export default function BlocRappels() {
  const { reponses, token } = useFiche();
  const [copie, setCopie] = useState<'idle' | 'ok' | 'err'>('idle');
  const minuterieCopie = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (minuterieCopie.current) clearTimeout(minuterieCopie.current);
  }, []);
  const [dateCessation, setDateCessation] = useState<string>('');
  const [dateAssignation, setDateAssignation] = useState<string>('');
  const [dateMiseDemeure, setDateMiseDemeure] = useState<string>('');
  const [dateJugement, setDateJugement] = useState<string>('');

  // Récupère la date de cessation saisie dans BlocCessationDecompte, et se
  // resynchronise quand elle change — dans le même onglet (événement custom,
  // car `storage` ne se déclenche pas localement) comme dans un autre onglet.
  const cessationKey = useFicheStorageKey('solelis_cessation_date');
  useEffect(() => {
    try {
      const stored = localStorage.getItem(cessationKey);
      if (stored) setDateCessation(stored);
    } catch {}

    function onLocalChange(e: Event) {
      setDateCessation((e as CustomEvent<string>).detail ?? '');
    }
    function onStorage(e: StorageEvent) {
      if (e.key === cessationKey) setDateCessation(e.newValue ?? '');
    }
    window.addEventListener(CESSATION_DATE_EVENT, onLocalChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CESSATION_DATE_EVENT, onLocalChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [cessationKey]);

  const echeances = useMemo<Echeance[]>(() => {
    const items: Echeance[] = [];

    if (dateCessation) {
      const d = new Date(dateCessation);
      if (!isNaN(d.getTime())) {
        const jLimit = addDays(d, 45);
        items.push({
          cle: 'cessation-45j',
          titre: 'Déclaration de cessation des paiements — dernier jour',
          joursAvantAjd: daysBetween(new Date(), jLimit),
          description: "Article L631-4 du Code de commerce : demander l'ouverture d'une procédure dans les 45 jours suivant la cessation des paiements (sauf conciliation demandée). L'omettre sciemment expose à une interdiction de gérer (L653-8). La banqueroute (L654-2) vise, elle, des actes frauduleux (détournement d'actif, comptabilité fictive…).",
          source: 'C. com. L631-4, L653-8, L654-2',
          baseDate: jLimit,
        });
        const jAlerte10 = addDays(d, 35);
        items.push({
          cle: 'cessation-alerte-10j',
          titre: 'Plus que 10 jours pour déclarer la cessation',
          joursAvantAjd: daysBetween(new Date(), jAlerte10),
          description: "Rappel anticipé : prendre RDV avec un avocat ou un mandataire immédiatement.",
          source: 'C. com. L631-4',
          baseDate: jAlerte10,
        });
      }
    }

    if (dateAssignation) {
      const d = new Date(dateAssignation);
      if (!isNaN(d.getTime())) {
        items.push({
          cle: 'audience-jour',
          titre: "Audience au tribunal — assignation",
          joursAvantAjd: daysBetween(new Date(), d),
          description: "Date de comparution indiquée sur l'assignation. Présentez-vous ou faites-vous représenter (avocat).",
          source: 'Code de procédure civile',
          baseDate: d,
        });
        const prepJ7 = addDays(d, -7);
        items.push({
          cle: 'audience-prep',
          titre: "Préparer l'audience (J-7)",
          joursAvantAjd: daysBetween(new Date(), prepJ7),
          description: "Finaliser vos pièces : bilan, trésorerie, liste des créanciers, propositions d'apurement.",
          source: 'Organisation',
          baseDate: prepJ7,
        });
      }
    }

    if (dateMiseDemeure) {
      const d = new Date(dateMiseDemeure);
      if (!isNaN(d.getTime())) {
        const limit = addDays(d, 60); // 2 mois
        items.push({
          cle: 'contestation-urssaf',
          titre: 'Contestation URSSAF — délai de 2 mois',
          joursAvantAjd: daysBetween(new Date(), limit),
          description: "Article R142-1 CSS : 2 mois pour saisir la Commission de Recours Amiable (CRA) à compter de la réception de la mise en demeure.",
          source: 'CSS R142-1',
          baseDate: limit,
        });
      }
    }

    if (dateJugement) {
      const d = new Date(dateJugement);
      if (!isNaN(d.getTime())) {
        const appelTC = addDays(d, 10);
        items.push({
          cle: 'appel-jugement',
          titre: "Appel d'un jugement du tribunal de commerce",
          joursAvantAjd: daysBetween(new Date(), appelTC),
          description: "Délai d'appel : 10 jours à compter du prononcé du jugement en matière de procédure collective (C. com. R661-3).",
          source: 'C. com. R661-3',
          baseDate: appelTC,
        });
      }
    }

    // Trier par date croissante
    items.sort((a, b) => a.baseDate.getTime() - b.baseDate.getTime());
    return items;
  }, [dateCessation, dateAssignation, dateMiseDemeure, dateJugement]);

  function exportIcs() {
    const events: IcsEvent[] = echeances.map((e) => ({
      uid: `${e.cle}-${e.baseDate.getTime()}`,
      title: e.titre,
      description: `${e.description}\n\nSource : ${e.source}\n\nGénéré par Solelis.`,
      date: e.baseDate,
      alarmHoursBefore: 48,
    }));
    if (events.length === 0) return;
    downloadIcs(events, 'solelis-rappels.ics');
  }

  function copyGoogleLink() {
    if (echeances.length === 0) return;
    const ics = buildIcs(
      echeances.map((e) => ({
        uid: `${e.cle}-${e.baseDate.getTime()}`,
        title: e.titre,
        description: e.description,
        date: e.baseDate,
        alarmHoursBefore: 48,
      }))
    );
    const afficher = (etat: 'ok' | 'err') => {
      setCopie(etat);
      if (minuterieCopie.current) clearTimeout(minuterieCopie.current);
      minuterieCopie.current = setTimeout(() => setCopie('idle'), 2500);
    };
    if (!navigator.clipboard) {
      afficher('err');
      return;
    }
    navigator.clipboard.writeText(ics).then(
      () => afficher('ok'),
      () => afficher('err'),
    );
  }

  const pertinent =
    reponses.situation === 'redressement' ||
    reponses.situation === 'assignation' ||
    reponses.situation === 'tresorie' ||
    reponses.probleme === 'urssaf';

  if (!pertinent) return null;

  return (
    <BlocAccordeon
      icone="🔔"
      titre="Rappels d'échéances — export calendrier"
      soustitre={
        echeances.length > 0
          ? `${echeances.length} échéance${echeances.length > 1 ? 's' : ''} identifiée${echeances.length > 1 ? 's' : ''}`
          : "Renseignez vos dates-clés pour générer un calendrier"
      }
    >
      <p className="mb-4 text-sm text-navy/80">
        Saisissez les dates qui s&apos;appliquent à votre situation.
        Solelis calcule les échéances légales à partir des textes
        officiels et génère un fichier <strong>.ics</strong> que vous
        pouvez importer dans Google Agenda, Apple Calendrier, Outlook ou
        tout autre agenda — avec un rappel 48 h avant.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm text-navy">
          Date de cessation des paiements
          <input
            type="date"
            value={dateCessation}
            onChange={(e) => setDateCessation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Déclenche les rappels des 45 jours légaux.
          </span>
        </label>
        <label className="block text-sm text-navy">
          Date d&apos;audience (assignation reçue)
          <input
            type="date"
            value={dateAssignation}
            onChange={(e) => setDateAssignation(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Date indiquée sur l&apos;assignation. Ajoute un rappel J-7.
          </span>
        </label>
        <label className="block text-sm text-navy">
          Date de mise en demeure URSSAF reçue
          <input
            type="date"
            value={dateMiseDemeure}
            onChange={(e) => setDateMiseDemeure(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Pour le délai de contestation de 2 mois (CRA).
          </span>
        </label>
        <label className="block text-sm text-navy">
          Date d&apos;un jugement à contester
          <input
            type="date"
            value={dateJugement}
            onChange={(e) => setDateJugement(e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-[10px] text-navy/55">
            Délai d&apos;appel : 10 jours (C. com. R661-3).
          </span>
        </label>
      </div>

      {echeances.length > 0 && (
        <div className="mt-5 rounded-2xl border border-bleu/20 bg-bleu/5 p-4">
          <p className="font-display text-base text-navy">
            {echeances.length} rappel{echeances.length > 1 ? 's' : ''} à venir
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            {echeances.map((e) => (
              <li key={e.cle} className="rounded-xl bg-white/80 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-navy">{e.titre}</p>
                    <p className="mt-0.5 text-xs text-navy/65">{e.description}</p>
                  </div>
                  <span className="shrink-0 text-xs text-navy/55 text-right">
                    <strong>{formatDate(e.baseDate)}</strong>
                    <br />
                    {e.joursAvantAjd > 0 ? `dans ${e.joursAvantAjd} j` : e.joursAvantAjd === 0 ? "aujourd'hui" : `il y a ${Math.abs(e.joursAvantAjd)} j`}
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-navy/45">Source : {e.source}</p>
              </li>
            ))}
          </ol>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportIcs}
              className="rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white hover:bg-navy"
            >
              📅 Télécharger le calendrier (.ics)
            </button>
            <button
              type="button"
              onClick={copyGoogleLink}
              className="rounded-full border border-navy/20 bg-white px-4 py-2 text-sm text-navy/80 hover:bg-white/90"
            >
              {copie === 'ok' ? '✓ Copié !' : copie === 'err' ? 'Copie impossible' : '📋 Copier l’ICS'}
            </button>
            <span className="sr-only" role="status" aria-live="polite">
              {copie === 'ok' ? 'Calendrier copié dans le presse-papiers.' : copie === 'err' ? 'La copie a échoué.' : ''}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-navy/55">
            Importez le fichier dans Google Agenda (Paramètres → Importer)
            ou double-cliquez dessus sur Mac/Windows pour l&apos;ouvrir
            dans votre calendrier. Un rappel s&apos;activera 48 h avant
            chaque échéance.
          </p>
          {token && token !== 'local' && <RappelEmail token={token} echeances={echeances} />}
        </div>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Les dates saisies restent uniquement dans votre navigateur, sauf si
        vous programmez un rappel par e-mail (échéance et intitulé seulement).
        Sources légales : C. com. L631-4, L653-8, L654-2, R661-3 ; CSS R142-1.
      </p>
    </BlocAccordeon>
  );
}
