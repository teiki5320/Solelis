'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { chargerFlux, dateMiseAJour, filtrerActus, type Actu } from '@/lib/veille';
import { ActuBandeau } from './ActuBandeau';
import { ActuVignette } from './ActuVignette';

interface BlocActusProps {
  /** Titre du bloc (aucun sur la page /actus, qui a déjà son grand titre). */
  titre?: string;
  /** Nombre d'actus au plus. */
  limite: number;
  /** Ne garder que les actus portant ce tag (`situation:dettes-urssaf`). */
  tag?: string;
  /** La 1re actu en bandeau (page /actus) ; sinon, que des vignettes (bloc discret des pages situation). */
  bandeau?: boolean;
  /** Affiche la date de mise à jour du fichier. */
  avecDate?: boolean;
  /** Texte montré quand aucune actu n'est disponible (par défaut : rien, le bloc disparaît). */
  siVide?: ReactNode;
  className?: string;
}

/**
 * Grille des vignettes sans case vide sur la dernière rangée (consigne de Jean) :
 * 2 colonnes dès la tablette ; avec un nombre impair, la dernière vignette occupe toute la rangée
 * (elle s'allonge, son image garde la même taille : elle ne devient pas géante).
 * Bloc discret (pages situation) : une seule colonne.
 */
export function grilleVignettes(n: number, discret: boolean): { grille: string; derniere: string } {
  if (discret || n <= 1) return { grille: '', derniere: '' };
  return { grille: 'md:grid-cols-2', derniere: n % 2 === 1 ? 'md:col-span-2' : '' };
}

type Etat = { phase: 'chargement' } | { phase: 'pret'; actus: Actu[]; genereLe: string };

/**
 * Bloc d'actus lu en direct depuis la veille (voir lib/veille.ts).
 * Pendant le chargement, rien n'est affiché ; en cas d'erreur ou s'il n'y a aucune actu,
 * le bloc reste absent : la page est intacte.
 */
export function BlocActus({ titre, limite, tag, bandeau = true, avecDate = false, siVide = null, className = '' }: BlocActusProps) {
  const [etat, setEtat] = useState<Etat>({ phase: 'chargement' });

  useEffect(() => {
    let actif = true;
    chargerFlux().then((flux) => {
      if (actif) setEtat({ phase: 'pret', actus: flux ? filtrerActus(flux.actus, { tag, limite }) : [], genereLe: flux?.genere_le ?? '' });
    });
    return () => {
      actif = false;
    };
  }, [tag, limite]);

  if (etat.phase === 'chargement') return null;
  if (etat.actus.length === 0) return siVide ? <div className={className}>{siVide}</div> : null;

  const une = bandeau ? etat.actus[0] : undefined;
  const suite = bandeau ? etat.actus.slice(1) : etat.actus;
  const grille = grilleVignettes(suite.length, !bandeau);
  const maj = avecDate ? dateMiseAJour(etat.genereLe) : '';

  return (
    <section className={className} aria-label={titre ?? 'Actualités'} data-bloc-actus="">
      {titre && <h2 className="mb-4 font-display text-xl text-navy">{titre}</h2>}
      {maj && <p className="mb-4 text-sm text-navy/60">Mis à jour le {maj}.</p>}
      <div className="grid gap-4">
        {une && <ActuBandeau actu={une} />}
        {suite.length > 0 && (
          <div className={`grid gap-3 ${grille.grille}`}>
            {suite.map((a, i) => (
              <div key={a.id} className={i === suite.length - 1 ? grille.derniere : ''}>
                <ActuVignette actu={a} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
