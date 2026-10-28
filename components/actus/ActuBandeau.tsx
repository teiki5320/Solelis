'use client';

import type { Actu } from '@/lib/veille';
import { CreditImage } from './CreditImage';
import { SourceActu } from './SourceActu';
import { TitreCarte } from './TitreCarte';
import { lienCarte } from './lienCarte';

/**
 * Actu à la une (page /actus) : image 16:9, titre, résumé, source et âge, crédit de l'image.
 * Toute la carte ouvre l'article complet sur le site (ou, à défaut, l'article d'origine).
 * Sur grand écran, l'image passe à gauche du texte.
 * `dateFixe` : la date au lieu de l'âge (actus du build, avant la mise à jour dans le navigateur).
 */
export function ActuBandeau({ actu, dateFixe = false }: { actu: Actu; dateFixe?: boolean }) {
  const lien = lienCarte(actu);
  return (
    <article className="glass card-top-line relative flex flex-col overflow-hidden transition hover:shadow-lg lg:flex-row">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={actu.image.url}
        alt={actu.image.alt}
        width={actu.image.largeur}
        height={actu.image.hauteur}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="aspect-video w-full bg-navy/10 object-cover lg:w-[55%] lg:shrink-0 lg:self-start"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-5 sm:p-6">
        <h3 className="font-display text-xl leading-snug text-navy sm:text-2xl">
          <TitreCarte {...lien}>{actu.titre}</TitreCarte>
        </h3>
        <p className="text-sm leading-relaxed text-navy/75 sm:text-base">{actu.resume}</p>
        <div className="mt-auto space-y-1 pt-2">
          <SourceActu actu={actu} externe={lien.externe} dateFixe={dateFixe} />
          <CreditImage image={actu.image} className="relative z-10" />
        </div>
      </div>
    </article>
  );
}
