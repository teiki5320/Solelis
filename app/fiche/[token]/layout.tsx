import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFicheByTokenMemo } from '@/lib/db';
import { tokenSchema } from '@/lib/schemas';

/** Fiche inconnue : le titre de l'onglet annonce la page introuvable (404). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  if (token === 'local') return {};
  const existe = tokenSchema.safeParse(token).success && !!(await getFicheByTokenMemo(token));
  return existe ? {} : { title: 'Page introuvable — Solelis' };
}

/**
 * Vérifie l'existence de la fiche AVANT la frontière de chargement
 * (loading.tsx de ce segment) : une fois le streaming commencé, le statut
 * HTTP est figé à 200. Ici, notFound() renvoie encore un vrai 404 pour un
 * token inconnu. La lecture est partagée avec la page (React cache).
 * « local » (fiche non enregistrée) est laissé à la page.
 */
export default async function FicheTokenLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (token !== 'local') {
    const valide = tokenSchema.safeParse(token).success;
    if (!valide || !(await getFicheByTokenMemo(token))) notFound();
  }
  return children;
}
