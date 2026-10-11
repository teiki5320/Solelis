'use client';
import { useState, useEffect, useMemo } from 'react';
import { useFiche, useFicheStorageKey } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';
import { nombreFr } from '@/lib/format';

interface Inputs {
  soldeInitial: number;
  entrees: number;
  sorties: number;
  detteUrgente: number;
}

const HORIZON_MOIS = 6;

const EMPTY: Inputs = {
  soldeInitial: 0,
  entrees: 0,
  sorties: 0,
  detteUrgente: 0,
};

function formatEuros(n: number): string {
  if (Math.abs(n) >= 1000) {
    return `${nombreFr(n / 1000, 1)} k€`;
  }
  return `${Math.round(n).toLocaleString('fr-FR')} €`;
}

interface Projection {
  mois: number;
  solde: number;
  alerte: boolean;
}

function projeter(inputs: Inputs): Projection[] {
  const delta = inputs.entrees - inputs.sorties;
  const proj: Projection[] = [];
  let solde = inputs.soldeInitial;
  for (let m = 0; m <= HORIZON_MOIS; m++) {
    proj.push({ mois: m, solde, alerte: solde < 0 });
    solde += delta;
  }
  return proj;
}

function verdict(inputs: Inputs, proj: Projection[]): {
  niveau: 'safe' | 'alerte' | 'cessation';
  titre: string;
  message: string;
  actions: string[];
} {
  const premierNegatif = proj.find((p) => p.solde < 0);

  if (inputs.soldeInitial < 0 && inputs.detteUrgente > Math.abs(inputs.soldeInitial) + inputs.entrees * 2) {
    return {
      niveau: 'cessation',
      titre: 'Risque de cessation des paiements imminent',
      message:
        "Votre solde est déjà négatif et la dette exigible dépasse ce que deux mois d'activité peuvent couvrir. Juridiquement, vous êtes peut-être déjà en cessation des paiements (actif disponible < passif exigible).",
      actions: [
        'Consultez un avocat ou un mandataire SOUS 48 H',
        "Préparez un dossier de déclaration (bilan, liste des créanciers, trésorerie)",
        "Rappel : 45 jours pour déclarer (C. com. L631-4)",
      ],
    };
  }

  if (!premierNegatif) {
    return {
      niveau: 'safe',
      titre: 'Horizon à 6 mois tenable',
      message:
        "Sur la base de vos chiffres, votre trésorerie reste positive sur l'horizon modélisé. Attention : un imprévu (client défaillant, charge oubliée) peut changer la donne.",
      actions: [
        "Consolidez une réserve d'au moins 1 mois de charges",
        "Négociez à l'avance les délais de règlement clients",
        "Revoyez ce prévisionnel tous les 15 jours",
      ],
    };
  }

  return {
    niveau: 'alerte',
    titre: `Rupture de trésorerie dans ~ ${premierNegatif.mois} mois`,
    message: `À charges constantes, votre trésorerie passe en négatif au mois ${premierNegatif.mois}. Il vous reste ${premierNegatif.mois} mois pour agir — c'est jouable.`,
    actions: [
      'Obtenez un moratoire URSSAF / SIE (courriers Solelis)',
      'Saisissez la médiation du crédit (Banque de France, gratuit, 5 j)',
      'Réduisez les charges fixes non vitales (abonnements, loyers renégociables)',
      "Accélérez les encaissements clients (relances, affacturage, escompte)",
      'Si l\'écart reste négatif après ces actions : mandat ad hoc pour négocier globalement',
    ],
  };
}

const NIVEAU_STYLES: Record<'safe' | 'alerte' | 'cessation', { bg: string; border: string; text: string }> = {
  safe: { bg: 'bg-vert/10', border: 'border-vert/30', text: 'text-vert' },
  alerte: { bg: 'bg-jaune/10', border: 'border-jaune/40', text: 'text-jaune' },
  cessation: { bg: 'bg-rouge/10', border: 'border-rouge/40', text: 'text-rouge' },
};

export default function BlocTresorerie() {
  const { reponses } = useFiche();
  const storageKey = useFicheStorageKey('solelis_tresorerie');
  const [inputs, setInputs] = useState<Inputs>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setInputs(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(inputs));
    } catch {}
  }, [inputs, loaded, storageKey]);

  const hasData = inputs.soldeInitial !== 0 || inputs.entrees > 0 || inputs.sorties > 0;

  const proj = useMemo(() => (hasData ? projeter(inputs) : []), [inputs, hasData]);
  const v = hasData ? verdict(inputs, proj) : null;

  const maxAbs = useMemo(() => {
    if (proj.length === 0) return 1;
    return Math.max(1, ...proj.map((p) => Math.abs(p.solde)));
  }, [proj]);

  function updateNumber(field: keyof Inputs, value: string) {
    const n = value === '' || value === '-' ? 0 : Number(value);
    if (Number.isFinite(n)) {
      setInputs((i) => ({ ...i, [field]: n }));
    }
  }

  const prioritaire =
    reponses.situation === 'tresorie' ||
    reponses.situation === 'redressement' ||
    reponses.probleme === 'banque';

  return (
    <BlocAccordeon
      icone="📊"
      titre="Projection de trésorerie (6 mois)"
      soustitre={hasData && v ? v.titre : 'Estimez votre horizon de trésorerie'}
    >
      <p className="mb-4 text-sm text-navy/80">
        Renseignez quatre chiffres (au doigt mouillé, c&apos;est ok) pour
        voir combien de temps vous tient votre trésorerie actuelle. Les
        valeurs sont stockées uniquement dans votre navigateur.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs text-navy/70">
          Solde bancaire actuel (€)
          <input
            type="number"
            value={inputs.soldeInitial || ''}
            onChange={(e) => updateNumber('soldeInitial', e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
            placeholder="Ex : 12000"
          />
        </label>
        <label className="block text-xs text-navy/70">
          Entrées moyennes par mois (€)
          <input
            type="number"
            min={0}
            value={inputs.entrees || ''}
            onChange={(e) => updateNumber('entrees', e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
            placeholder="Chiffre d'affaires encaissé"
          />
        </label>
        <label className="block text-xs text-navy/70">
          Sorties moyennes par mois (€)
          <input
            type="number"
            min={0}
            value={inputs.sorties || ''}
            onChange={(e) => updateNumber('sorties', e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
            placeholder="Salaires, loyers, fournisseurs…"
          />
        </label>
        <label className="block text-xs text-navy/70">
          Dette urgente exigible (€)
          <input
            type="number"
            min={0}
            value={inputs.detteUrgente || ''}
            onChange={(e) => updateNumber('detteUrgente', e.target.value)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm"
            placeholder="Impayés à régler sous 30 jours"
          />
        </label>
      </div>

      {hasData && v && (
        <div className={`mt-5 rounded-2xl border p-5 ${NIVEAU_STYLES[v.niveau].bg} ${NIVEAU_STYLES[v.niveau].border}`}>
          <p className={`font-display text-base ${NIVEAU_STYLES[v.niveau].text} sm:text-lg`}>
            {v.titre}
          </p>
          <p className="mt-2 text-sm text-navy/80">{v.message}</p>

          {/* Mini barres mensuelles */}
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] text-navy/60">
            {proj.map((p) => {
              const hauteurPct = Math.min(100, (Math.abs(p.solde) / maxAbs) * 100);
              const couleur = p.solde < 0 ? 'bg-rouge/70' : p.solde < (inputs.sorties || 1) ? 'bg-jaune/70' : 'bg-vert/70';
              return (
                <div key={p.mois} className="flex flex-col items-center gap-1">
                  <div className="flex h-24 items-end w-full">
                    <div
                      className={`w-full rounded-t ${couleur}`}
                      style={{ height: `${Math.max(4, hauteurPct)}%` }}
                      aria-hidden
                    />
                  </div>
                  <div className="font-medium">M+{p.mois}</div>
                  <div className="text-[9px] text-navy/50">{formatEuros(p.solde)}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <p className="font-display text-sm text-navy">Actions à engager</p>
            <ul className="mt-2 space-y-1.5 text-sm text-navy/80">
              {v.actions.map((a, i) => (
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
        Modèle linéaire simplifié (pas de saisonnalité ni d&apos;imprévu).
        Pour un prévisionnel précis, votre expert-comptable peut le
        produire en quelques heures — c&apos;est ce document qui
        conditionne l&apos;acceptation de vos demandes de délais.
      </p>
    </BlocAccordeon>
  );
}
