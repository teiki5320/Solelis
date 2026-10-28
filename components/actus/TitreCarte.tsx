import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Titre d'une carte d'actu, dont le lien couvre TOUTE la carte (pseudo-élément étiré :
 * la carte doit être en `relative`). Lien interne (article sur le site) ou, à défaut,
 * article d'origine dans un nouvel onglet. Les autres liens de la carte (crédit de l'image)
 * passent au-dessus avec `relative z-10`.
 */
export function TitreCarte({ href, externe, children }: { href: string; externe: boolean; children: ReactNode }) {
  const classes =
    'outline-none after:absolute after:inset-0 after:rounded-[inherit] after:content-[""] hover:text-bleu-fonce focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-bleu';
  if (externe) {
    return (
      <a href={href} target="_blank" rel="noopener nofollow" className={classes}>
        {children}
        <span className="sr-only"> (article d’origine, nouvel onglet)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
