'use client';

import { ageActu, type Actu } from '@/lib/veille';

/** Lien vers l'article d'origine, toujours visible, suivi de l'âge de l'actu. */
export function LienSource({ actu }: { actu: Actu }) {
  const age = ageActu(actu.publie_le);
  return (
    <p className="text-sm">
      <a
        href={actu.source_url}
        target="_blank"
        rel="noopener nofollow"
        className="font-medium text-bleu-fonce underline-offset-2 hover:underline"
      >
        Source : {actu.source_nom} <span aria-hidden>↗</span>
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
      {age && <span className="text-navy/60"> · {age}</span>}
    </p>
  );
}
