import { entitesVeille } from '@/lib/situations';

/**
 * Tags d'un article → liens vers les pages du site qui existent (`situation:<slug>`).
 * Les tags inconnus sont ignorés.
 */
export function fichesDesTags(tags: readonly string[] | undefined): { href: string; libelle: string }[] {
  if (!tags?.length) return [];
  const entites = new Map(entitesVeille().map((e) => [e.tag, e.nom]));
  const vus = new Set<string>();
  const liens: { href: string; libelle: string }[] = [];
  for (const tag of tags) {
    const nom = entites.get(tag);
    if (!nom || vus.has(tag)) continue;
    vus.add(tag);
    liens.push({ href: `/situation/${tag.slice('situation:'.length)}`, libelle: `Lire la fiche « ${nom} »` });
  }
  return liens;
}
