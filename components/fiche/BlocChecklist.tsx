'use client';
import type { Reponses, CompanyData } from '@/lib/types';
import { libelleActionSoutien, libelleContactSyndicat, libelleChambre, type SectorInfo } from '@/lib/secteur';
import { contactCotisations, institutionEmission } from '@/lib/organismes';
import { getTonePreset } from '@/lib/tone';
import { useLocalStorage } from '@/lib/hooks';
import { useFiche, useFicheStorageKey } from '@/lib/FicheContext';
import { texteTribunal } from './BlocPlanAction';
import BlocAccordeon from './BlocAccordeon';

interface Props {
  defaultOpen?: boolean;
}

export function buildItems(r: Reponses, c: CompanyData, s: SectorInfo): { id: string; texte: string; lien?: string }[] {
  const items: { id: string; texte: string; lien?: string }[] = [];
  const dep = c.departement || '';

  items.push({
    id: 'soin',
    texte: libelleActionSoutien(s, 'vous'),
    lien: 'https://www.apesa-france.com',
  });
  if (r.situation === 'assignation') {
    items.push({ id: 'avocat', texte: 'Contacter un avocat en urgence (droit des entreprises en difficulté)' });
  }
  if (r.probleme === 'urssaf') {
    const cot = contactCotisations(s, r.effectif, dep);
    items.push({
      id: 'urssaf',
      texte: `Appeler ${cot.orgAvecArticle} avant toute relance · ${cot.telLibelle}`,
    });
  }
  if (r.probleme === 'banque') {
    items.push({
      id: 'banque',
      texte: `Contacter ${institutionEmission(dep).avecArticle}${dep ? ` (${dep})` : ''} — médiation du crédit`,
    });
  }
  if (r.probleme === 'impots') {
    items.push({
      id: 'impots',
      texte: 'Contacter votre service des impôts des entreprises (SIE) pour un délai de paiement',
    });
  }
  if (r.effectif === 'salaries') {
    items.push({
      id: 'ags',
      texte: 'Vérifier vos obligations AGS (garantie des salaires)',
    });
  }
  items.push({
    id: 'chambre',
    texte: `Prendre RDV avec ${libelleChambre(s, c)}`,
  });
  if (s.syndicats.length > 0) {
    items.push({
      id: 'syndicat',
      texte: libelleContactSyndicat(s.syndicats[0]),
      lien: s.syndicats[0].site,
    });
  }
  items.push({
    id: 'tribunal',
    texte: texteTribunal(c, 'votre'),
  });
  items.push({
    id: 'courrier',
    texte: 'Préparer un courrier adapté à votre situation',
    // Pas de données dans l'URL : la fiche enregistre déjà nom, SIRET et
    // adresse dans sessionStorage (StoreCompanyData), lus par chaque modèle
    // de courrier pour le préremplir. (L'ancien ?prefill= était ignoré par
    // la page /courriers et exposait le SIRET dans l'adresse.)
    lien: '/courriers',
  });
  return items;
}

export default function BlocChecklist({ defaultOpen }: Props) {
  const { reponses, company, sector } = useFiche();
  const items = buildItems(reponses, company, sector);
  // Cases cochées conservées dans le navigateur, comme le plan d'action
  // (clé propre au SIRET de la fiche).
  const storageKey = useFicheStorageKey('solelis_checklist');
  const [done, setDone] = useLocalStorage<Record<string, boolean>>(storageKey, {});
  const tone = getTonePreset(reponses.moral);

  function toggle(id: string) {
    setDone((d) => ({ ...d, [id]: !d[id] }));
  }

  const completed = items.filter((it) => done[it.id]).length;

  return (
    <BlocAccordeon
      icone="✓"
      titre="Votre checklist"
      soustitre={`${completed} / ${items.length} · ${tone.pace}`}
      defaultOpen={defaultOpen}
    >
      <p className="mb-3 text-sm text-navy/75">{tone.intro}</p>
      <ul className="space-y-2.5">
        {items.map((it) => {
          const checked = !!done[it.id];
          return (
            <li key={it.id}>
              {/* <label> + case à cocher (et non <button>) : un lien <a> ne peut
                  pas être imbriqué dans un bouton. L'anneau de focus du bouton
                  d'origine est reporté sur l'étiquette. */}
              <label
                className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border p-4 text-left transition has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-[rgb(var(--ring))] ${
                  checked
                    ? 'border-vert/30 bg-vert/5'
                    : 'border-navy/10 bg-white/60 hover:bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => toggle(it.id)}
                />
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                    checked
                      ? 'border-vert-fonce bg-vert-fonce text-white'
                      : 'border-navy/25'
                  }`}
                  aria-hidden
                >
                  {checked ? '✓' : ''}
                </span>
                <span
                  className={`text-sm sm:text-base ${
                    checked ? 'text-navy/50 line-through' : 'text-navy'
                  }`}
                >
                  {it.texte}
                  {it.lien && (
                    <>
                      {' · '}
                      <a
                        href={it.lien}
                        target={it.lien.startsWith('/') ? undefined : '_blank'}
                        rel={it.lien.startsWith('/') ? undefined : 'noreferrer'}
                        className="text-bleu-fonce underline underline-offset-2"
                      >
                        {it.lien.startsWith('/') ? 'Voir les modèles' : new URL(it.lien).hostname.replace('www.', '')}
                      </a>
                    </>
                  )}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </BlocAccordeon>
  );
}
