'use client';
import { useState, useEffect, useMemo } from 'react';
import { useFiche, useFicheStorageKey } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

type TypeCaution = 'personnelle' | 'hypothecaire' | 'solidaire' | 'autre';
type Creancier = 'banque' | 'bailleur' | 'fournisseur' | 'urssaf' | 'impots' | 'autre';

interface CautionDetail {
  id: string;
  type: TypeCaution;
  montant: number;
  annee: number;
  creancier: Creancier;
  note?: string;
}

const TYPE_LABELS: Record<TypeCaution, string> = {
  personnelle: 'Caution personnelle simple',
  hypothecaire: 'Caution hypothécaire (bien immobilier en garantie)',
  solidaire: 'Caution solidaire',
  autre: 'Autre (nantissement, gage…)',
};

const CREANCIER_LABELS: Record<Creancier, string> = {
  banque: 'Banque',
  bailleur: 'Bailleur (loyer commercial)',
  fournisseur: 'Fournisseur',
  urssaf: 'URSSAF',
  impots: 'Fisc / Impôts',
  autre: 'Autre',
};

interface Risque {
  niveau: 'critique' | 'eleve' | 'modere' | 'faible';
  label: string;
  recos: string[];
}

function analyseRisque(c: CautionDetail): Risque {
  const anciennete = new Date().getFullYear() - c.annee;
  const recos: string[] = [];
  let niveau: Risque['niveau'] = 'modere';
  let label = 'Risque modéré';

  if (c.type === 'hypothecaire' && c.montant >= 200000) {
    niveau = 'critique';
    label = 'Risque critique — résidence potentiellement menacée';
    recos.push(
      "Consultez un avocat en droit bancaire SANS ATTENDRE — une caution hypothécaire importante peut entraîner la saisie de votre bien."
    );
    recos.push(
      "Si la caution a été jugée manifestement disproportionnée à vos revenus/patrimoine au moment de la signature, elle peut être réduite au montant que vous pouviez garantir (art. 2300 du Code civil, cautions signées depuis le 1er janvier 2022) ou devenir inopposable (anciens art. L332-1 et L343-4 du Code de la consommation, cautions plus anciennes)."
    );
  } else if (c.type === 'solidaire' && c.montant >= 100000) {
    niveau = 'eleve';
    label = 'Risque élevé — caution solidaire importante';
    recos.push(
      "La caution solidaire permet au créancier de vous poursuivre directement, sans passer par l'entreprise. Action recommandée : audit juridique."
    );
  } else if (c.type === 'personnelle' && c.montant >= 50000) {
    niveau = 'eleve';
    label = 'Risque élevé — caution personnelle significative';
    recos.push(
      "Vérifiez la disproportion avec vos revenus/patrimoine à la signature. Un avocat peut apprécier en quelques minutes."
    );
  } else if (c.montant < 10000) {
    niveau = 'faible';
    label = 'Risque faible';
    recos.push("Même un petit montant mérite d'être documenté. Conservez une copie de l'acte.");
  }

  if (c.creancier === 'banque') {
    recos.push(
      "Saisissez la médiation du crédit (Banque de France) : elle peut négocier avec votre banque, y compris sur les garanties."
    );
  }
  if (c.creancier === 'bailleur') {
    recos.push(
      "Vérifiez le bail : une clause de solidarité peut être contestée. Négociez une levée partielle de caution en contrepartie d'un départ anticipé."
    );
  }

  if (anciennete >= 10) {
    recos.push(
      `Cette caution a ${anciennete} ans. Vérifiez sa durée dans l'acte : si elle est à durée indéterminée, vous pouvez la résilier pour l'avenir avec un préavis (art. 2315 C. civ.), en restant tenu·e des dettes nées avant.`
    );
  }

  recos.push(
    "Demandez au créancier copie de l'acte de cautionnement et de la fiche d'information patrimoniale signée à l'époque. En l'absence, la caution peut être contestée."
  );

  return { niveau, label, recos: Array.from(new Set(recos)) };
}

const NIVEAU_STYLES: Record<Risque['niveau'], { bg: string; border: string; text: string }> = {
  critique: { bg: 'bg-rouge/10', border: 'border-rouge/30', text: 'text-rouge' },
  eleve: { bg: 'bg-jaune/15', border: 'border-jaune/40', text: 'text-jaune' },
  modere: { bg: 'bg-bleu/10', border: 'border-bleu/30', text: 'text-bleu-fonce' },
  faible: { bg: 'bg-vert/10', border: 'border-vert/30', text: 'text-vert' },
};

function formatMontant(n: number): string {
  return n.toLocaleString('fr-FR') + ' €';
}

export default function BlocAuditCaution() {
  const { reponses } = useFiche();
  const storageKey = useFicheStorageKey('solelis_cautions');
  const [cautions, setCautions] = useState<CautionDetail[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState<Partial<CautionDetail>>({
    type: 'personnelle',
    creancier: 'banque',
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCautions(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(cautions));
    } catch {}
  }, [cautions, loaded, storageKey]);

  const showBloc = reponses.caution === 'oui' || reponses.caution === 'ne-sais-pas';

  const riskGlobal = useMemo<Risque['niveau'] | null>(() => {
    if (cautions.length === 0) return null;
    const order: Risque['niveau'][] = ['critique', 'eleve', 'modere', 'faible'];
    let max: Risque['niveau'] = 'faible';
    for (const c of cautions) {
      const r = analyseRisque(c);
      if (order.indexOf(r.niveau) < order.indexOf(max)) max = r.niveau;
    }
    return max;
  }, [cautions]);

  function addCaution() {
    if (!draft.type || !draft.creancier || !draft.montant || !draft.annee) return;
    const nouvelle: CautionDetail = {
      id: `c-${Date.now()}`,
      type: draft.type as TypeCaution,
      creancier: draft.creancier as Creancier,
      montant: Number(draft.montant),
      annee: Number(draft.annee),
      note: draft.note,
    };
    setCautions((prev) => [...prev, nouvelle]);
    setDraft({ type: 'personnelle', creancier: 'banque' });
  }

  function remove(id: string) {
    setCautions((prev) => prev.filter((c) => c.id !== id));
  }

  if (!showBloc) return null;

  const soustitre = cautions.length === 0
    ? (reponses.caution === 'oui' ? 'Renseignez vos cautions pour obtenir une analyse' : 'À clarifier avec votre banque ou notaire')
    : `${cautions.length} caution${cautions.length > 1 ? 's' : ''} analysée${cautions.length > 1 ? 's' : ''}${riskGlobal ? ` · risque ${riskGlobal}` : ''}`;

  return (
    <BlocAccordeon
      icone="🛡️"
      titre="Audit de vos cautions"
      soustitre={soustitre}
    >
      {reponses.caution === 'ne-sais-pas' && (
        <div className="mb-4 rounded-2xl border border-jaune/30 bg-jaune/10 p-4 text-sm text-navy">
          <p className="font-medium text-navy">Première étape : vérifier</p>
          <p className="mt-1 text-navy/80">
            Demandez à votre banque la copie de votre acte de caution et la
            fiche d&apos;information patrimoniale. C&apos;est votre droit. Un
            notaire peut aussi vérifier vos engagements hypothécaires.
          </p>
        </div>
      )}

      <p className="mb-4 text-sm text-navy/80">
        Les cautions personnelles sont <strong>la principale source de ruine
        patrimoniale</strong> des dirigeants. Mais beaucoup peuvent être
        contestées ou négociées. Ajoutez les vôtres pour obtenir une
        première analyse.
      </p>

      {cautions.length > 0 && (
        <ul className="space-y-3">
          {cautions.map((c) => {
            const risque = analyseRisque(c);
            const style = NIVEAU_STYLES[risque.niveau];
            return (
              <li
                key={c.id}
                className={`rounded-2xl border p-4 ${style.bg} ${style.border}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`font-display text-base ${style.text}`}>
                      {risque.label}
                    </p>
                    <p className="mt-1 text-sm text-navy">
                      {TYPE_LABELS[c.type]} · {CREANCIER_LABELS[c.creancier]} ·{' '}
                      {formatMontant(c.montant)} · {c.annee}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(c.id)}
                    className="text-xs text-navy/55 hover:text-rouge"
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm text-navy/80">
                  {risque.recos.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-navy/40">→</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-5 rounded-2xl border border-navy/10 bg-white/70 p-4">
        <p className="mb-3 font-display text-sm text-navy">Ajouter une caution</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs text-navy/70">
            Type
            <select
              value={draft.type ?? 'personnelle'}
              onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as TypeCaution }))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm text-navy"
            >
              {Object.entries(TYPE_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-navy/70">
            Créancier
            <select
              value={draft.creancier ?? 'banque'}
              onChange={(e) => setDraft((d) => ({ ...d, creancier: e.target.value as Creancier }))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm text-navy"
            >
              {Object.entries(CREANCIER_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>
          <label className="block text-xs text-navy/70">
            Montant garanti (€)
            <input
              type="number"
              min={0}
              value={draft.montant ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, montant: e.target.value ? Number(e.target.value) : undefined }))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm text-navy"
              placeholder="50000"
            />
          </label>
          <label className="block text-xs text-navy/70">
            Année de signature
            <input
              type="number"
              min={1980}
              max={new Date().getFullYear()}
              value={draft.annee ?? ''}
              onChange={(e) => setDraft((d) => ({ ...d, annee: e.target.value ? Number(e.target.value) : undefined }))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-sm text-navy"
              placeholder={String(new Date().getFullYear() - 5)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={addCaution}
          disabled={!draft.type || !draft.creancier || !draft.montant || !draft.annee}
          className="mt-4 rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          + Analyser cette caution
        </button>
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Cette analyse est automatique et non juridique. Une caution peut être
        contestée sur plusieurs fondements (disproportion, défaut
        d&apos;information, vice de forme). Faites vérifier par un avocat en
        droit bancaire.
      </p>
    </BlocAccordeon>
  );
}
