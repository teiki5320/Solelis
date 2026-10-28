'use client';

import { imageCarree, type Actu } from '@/lib/veille';
import { CreditImage } from './CreditImage';
import { SourceActu } from './SourceActu';
import { TitreCarte } from './TitreCarte';
import { lienCarte } from './lienCarte';

/**
 * Actu compacte : image carrée à gauche, puis titre, résumé, source, âge et crédit.
 * Toute la vignette ouvre l'article complet sur le site (ou, à défaut, l'article d'origine).
 * `dateFixe` : la date au lieu de l'âge (pages figées au build).
 */
export function ActuVignette({ actu, dateFixe = false }: { actu: Actu; dateFixe?: boolean }) {
  const lien = lienCarte(actu);
  return (
    <article className="glass-soft relative flex h-full gap-3 p-3 transition hover:shadow-md sm:gap-4 sm:p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageCarree(actu.image)}
        alt={actu.image.alt}
        width={112}
        height={112}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className="size-20 shrink-0 rounded-xl bg-navy/10 object-cover sm:size-28"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-base leading-snug text-navy sm:text-lg">
          <TitreCarte {...lien}>{actu.titre}</TitreCarte>
        </h3>
        <p className="mt-1 line-clamp-3 text-sm leading-snug text-navy/70">{actu.resume}</p>
        <div className="mt-auto space-y-0.5 pt-2">
          <SourceActu actu={actu} externe={lien.externe} dateFixe={dateFixe} />
          <CreditImage image={actu.image} className="relative z-10" />
        </div>
      </div>
    </article>
  );
}
