'use client';

import type { Actu } from '@/lib/veille';
import { CreditImage } from './CreditImage';
import { LienSource } from './LienSource';

/**
 * Actu à la une (page /actus) : image 16:9, titre, résumé, source et âge, crédit de l'image.
 * Sur grand écran, l'image passe à gauche du texte.
 */
export function ActuBandeau({ actu }: { actu: Actu }) {
  return (
    <article className="glass card-top-line flex flex-col overflow-hidden lg:flex-row">
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
        <h3 className="font-display text-xl leading-snug text-navy sm:text-2xl">{actu.titre}</h3>
        <p className="text-sm leading-relaxed text-navy/75 sm:text-base">{actu.resume}</p>
        <div className="mt-auto space-y-1 pt-2">
          <LienSource actu={actu} />
          <CreditImage image={actu.image} />
        </div>
      </div>
    </article>
  );
}
