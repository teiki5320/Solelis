import { entitesVeille } from '@/lib/situations';

/**
 * https://solelis.com/veille/entites.json : les 4 situations, lues par la tâche de veille
 * pour relier une actu à une page situation (tag `situation:<slug>`).
 * Fichier figé au build, généré depuis lib/situations.ts (jamais recopié à la main).
 */
export const dynamic = 'force-static';

export function GET() {
  return Response.json(entitesVeille(), {
    headers: { 'Cache-Control': 'public, max-age=3600' },
  });
}
