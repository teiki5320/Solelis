import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { fetchSirene } from '@/lib/sirene';
import { saveFiche } from '@/lib/db';
import { fichePayloadSchema, TAILLE_MAX_CORPS_FICHE } from '@/lib/schemas';
import type { Reponses } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: unknown;
  try {
    const texte = await req.text();
    if (texte.length > TAILLE_MAX_CORPS_FICHE) {
      return NextResponse.json({ error: 'Requête trop volumineuse' }, { status: 413 });
    }
    body = JSON.parse(texte);
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide (JSON attendu)' }, { status: 400 });
  }

  try {
    const parsed = fichePayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { siret, reponses, entreprise } = parsed.data;

    // Recherche serveur d'abord ; le résultat trouvé par le navigateur du
    // visiteur ne sert qu'en repli, et seulement si son SIRET correspond.
    const company_data = await fetchSirene(siret, entreprise);
    const token = randomUUID().replace(/-/g, '').slice(0, 24);

    const saved = await saveFiche({
      token,
      siret,
      reponses: reponses as Reponses,
      company_data,
    });

    return NextResponse.json({
      token,
      persisted: saved,
      company_data,
      reponses,
    });
  } catch (e) {
    console.error('[POST /api/fiche]', e);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
