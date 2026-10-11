'use client';
import { useState, useEffect } from 'react';
import type { Reponses, CompanyData } from '@/lib/types';
import { libelleActionSoutien, libelleContactSyndicat, libelleChambre, type SectorInfo } from '@/lib/secteur';
import { contactCotisations } from '@/lib/organismes';
import { getTribunalCompetent } from '@/lib/strategie';
import { getTonePreset } from '@/lib/tone';
import { useFiche, useFicheStorageKey } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  defaultOpen?: boolean;
}

/**
 * « Vérifier le tribunal dont dépend mon siège (Tribunal de commerce de
 * Bordeaux pour le département) » : nom issu de data/organismes.json, à
 * confirmer sur justice.fr quand le département compte plusieurs tribunaux.
 */
export function texteTribunal(c: CompanyData, possessif: 'mon' | 'votre'): string {
  const t = getTribunalCompetent(c);
  if (/dont dépend|de votre ressort/.test(t.nom)) {
    return `Identifier ${possessif} ${t.generique} (annuaire des juridictions sur justice.fr)`;
  }
  return `Identifier ${possessif} tribunal : ${t.nom} (à confirmer sur justice.fr selon la commune du siège)`;
}

interface Action {
  id: string;
  texte: string;
  done: boolean;
  custom?: boolean;
}

export function buildDefaultActions(r: Reponses, c: CompanyData, s: SectorInfo): Action[] {
  const actions: Action[] = [];
  const dep = c.departement || '';

  actions.push({ id: 'soin', texte: libelleActionSoutien(s), done: false });

  if (r.situation === 'assignation') {
    actions.push({ id: 'avocat-urgence', texte: 'Contacter un avocat en urgence (assignation reçue)', done: false });
  }
  if (r.probleme === 'urssaf') {
    const cot = contactCotisations(s, r.effectif, dep);
    actions.push({ id: 'urssaf-appel', texte: `Appeler ${cot.orgAvecArticle} (${cot.telLibelle}) pour demander un échelonnement`, done: false });
  }
  if (r.probleme === 'impots') {
    actions.push({ id: 'impots-sie', texte: 'Contacter mon service des impôts des entreprises (SIE), via la messagerie de mon espace professionnel impots.gouv.fr, pour demander un délai de paiement', done: false });
  }
  if (r.probleme === 'banque') {
    actions.push({ id: 'mediation-credit', texte: `Saisir la médiation du crédit (Banque de France${dep ? `, dép. ${dep}` : ''})`, done: false });
  }
  if (r.probleme === 'fournisseurs') {
    actions.push({ id: 'fournisseur-lettre', texte: 'Écrire une lettre de demande de délai au fournisseur principal', done: false });
  }
  if (r.pgeEnCours === 'oui') {
    actions.push({ id: 'pge-restructure', texte: 'Demander la restructuration du PGE à ma banque, puis via la Médiation du crédit (accord de place — allongement de 2 ans au plus, 4 ans par exception, garantie maintenue)', done: false });
  }
  if (r.conjointStatut === 'aucun') {
    actions.push({ id: 'conjoint-statut', texte: 'Déclarer le statut de mon conjoint·e s\'il·elle travaille régulièrement dans l\'entreprise (à défaut, il·elle est réputé·e conjoint·e salarié·e — art. L121-4 C. com.)', done: false });
  }
  if (r.conjointStatut === 'collaborateur') {
    actions.push({ id: 'conjoint-duree', texte: 'Vérifier la durée du statut de conjoint collaborateur (limite 5 ans — C. com. art. L121-4)', done: false });
  }
  if (r.coGerants === 'oui') {
    actions.push({ id: 'cogerance-pv', texte: 'Établir un PV de répartition des fonctions entre co-gérants (utile pour apprécier la responsabilité de chacun en cas d\'action pour insuffisance d\'actif, art. L651-2 C. com.)', done: false });
  }
  if (r.rqth === 'oui') {
    actions.push({ id: 'rqth-agefiph', texte: 'Contacter l\'AGEFIPH ou Cap Emploi pour l\'aide à la création/reprise d\'activité spécifique RQTH', done: false });
  }

  actions.push({ id: 'chambre', texte: `Prendre RDV avec ${libelleChambre(s, c)} — accompagnement gratuit`, done: false });
  if (s.syndicats.length > 0) {
    actions.push({ id: 'syndicat', texte: libelleContactSyndicat(s.syndicats[0]), done: false });
  }
  actions.push({ id: 'comptable', texte: 'Faire le point avec mon expert-comptable', done: false });

  if (r.effectif === 'salaries') {
    actions.push({ id: 'salaires', texte: 'Vérifier mes obligations vis-à-vis de l\'AGS et des salariés', done: false });
  }

  actions.push({ id: 'tribunal', texte: texteTribunal(c, 'mon'), done: false });
  actions.push({ id: 'bilan', texte: `Rassembler les derniers bilans et relevés bancaires de ${c.nom !== 'Votre entreprise' ? c.nom : 'mon entreprise'}`, done: false });

  if (r.situation === 'redressement' || r.situation === 'assignation') {
    actions.push({ id: 'cessation', texte: 'Déclarer la cessation des paiements (délai : 45 jours max)', done: false });
  }

  return actions;
}

export default function BlocPlanAction({ defaultOpen }: Props) {
  const { reponses, company, sector } = useFiche();
  const storageKey = useFicheStorageKey('solelis_plan_action');
  const [actions, setActions] = useState<Action[]>([]);
  const [newText, setNewText] = useState('');
  const [loaded, setLoaded] = useState(false);
  const tone = getTonePreset(reponses.moral);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setActions(JSON.parse(saved));
        setLoaded(true);
        return;
      }
    } catch {}
    setActions(buildDefaultActions(reponses, company, sector));
    setLoaded(true);
  }, [reponses, company, sector, storageKey]);

  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(storageKey, JSON.stringify(actions)); } catch {}
    }
  }, [actions, loaded, storageKey]);

  function toggle(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, done: !a.done } : a))
    );
  }

  function addCustom(e: React.FormEvent) {
    e.preventDefault();
    const text = newText.trim();
    if (!text) return;
    setActions((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, texte: text, done: false, custom: true },
    ]);
    setNewText('');
  }

  function remove(id: string) {
    setActions((prev) => prev.filter((a) => a.id !== id));
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    setActions((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }

  const doneCount = actions.filter((a) => a.done).length;

  return (
    <BlocAccordeon
      icone="📋"
      titre="Mon plan d'action"
      soustitre={`${doneCount} / ${actions.length} · ${tone.pace}`}
      defaultOpen={defaultOpen}
    >
      <p className="mb-3 text-sm text-navy/75">{tone.intro}</p>
      <ul className="space-y-2">
        {actions.map((a, idx) => (
          <li
            key={a.id}
            className={`flex items-start rounded-2xl border transition ${
              a.done
                ? 'border-vert/30 bg-vert/5'
                : 'border-navy/10 bg-white/60'
            }`}
          >
            {/* Toute la ligne (case + texte) est cliquable : cible tactile
                bien plus grande que la case de 20 px. */}
            <button
              type="button"
              role="checkbox"
              aria-checked={a.done}
              onClick={() => toggle(a.id)}
              className="flex min-h-11 flex-1 items-start gap-2 rounded-2xl p-3 text-left"
            >
              <span
                aria-hidden
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs ${
                  a.done
                    ? 'border-vert-fonce bg-vert-fonce text-white'
                    : 'border-navy/25'
                }`}
              >
                {a.done ? '✓' : ''}
              </span>
              <span
                className={`flex-1 text-sm ${
                  a.done ? 'text-navy/50 line-through' : 'text-navy'
                }`}
              >
                {a.texte}
              </span>
            </button>
            <div className="flex shrink-0">
              {idx > 0 && (
                <button
                  type="button"
                  onClick={() => moveUp(idx)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-xs text-navy/60 hover:text-navy"
                  aria-label={`Monter : ${a.texte}`}
                >
                  ↑
                </button>
              )}
              {a.custom && (
                <button
                  type="button"
                  onClick={() => remove(a.id)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-xs text-navy/60 hover:text-rouge"
                  aria-label={`Supprimer : ${a.texte}`}
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={addCustom} className="mt-4 flex gap-2">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Ajouter une action personnelle…"
          aria-label="Ajouter une action personnelle"
          className="flex-1 rounded-full border border-navy/10 bg-white/80 px-4 py-2 text-sm focus:border-bleu focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newText.trim()}
          aria-label="Ajouter l’action"
          className="rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          +
        </button>
      </form>

      <p className="mt-4 text-xs text-navy/45">
        Ce plan est sauvegardé dans votre navigateur. Réorganisez-le selon
        vos priorités — commencez toujours par prendre soin de vous.
      </p>
      <p className="mt-2 text-xs italic text-navy/55">{tone.rappel}</p>
    </BlocAccordeon>
  );
}
