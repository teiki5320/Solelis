import { lienActu, type Actu } from '@/lib/veille';
import { SLUGS_ARTICLES_CONSTRUITS } from '@/lib/veille-slugs.generated';

const CONSTRUITS = new Set(SLUGS_ARTICLES_CONSTRUITS);

/** Lien d'une carte d'actu, d'après les pages /actus/<slug> construites avec ce déploiement. */
export function lienCarte(actu: Actu): { href: string; externe: boolean } {
  return lienActu(actu, CONSTRUITS);
}
