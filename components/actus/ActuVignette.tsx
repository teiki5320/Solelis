'use client';

import { imageCarree, type Actu } from '@/lib/veille';
import { CreditImage } from './CreditImage';
import { LienSource } from './LienSource';

/** Actu compacte : image carrée à gauche, puis titre, résumé, source, âge et crédit. */
export function ActuVignette({ actu }: { actu: Actu }) {
  return (
    <article className="glass-soft flex h-full gap-3 p-3 sm:gap-4 sm:p-4">
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
        <h3 className="font-display text-base leading-snug text-navy sm:text-lg">{actu.titre}</h3>
        <p className="mt-1 line-clamp-3 text-sm leading-snug text-navy/70">{actu.resume}</p>
        <div className="mt-auto space-y-0.5 pt-2">
          <LienSource actu={actu} />
          <CreditImage image={actu.image} />
        </div>
      </div>
    </article>
  );
}
