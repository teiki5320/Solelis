'use client';
import { usePathname } from 'next/navigation';
import FicheLocale from '@/components/fiche/FicheLocale';
import NotFound from '@/app/not-found';

/**
 * 404 du segment /fiche/[token] (statut HTTP 404).
 * /fiche/local sans données côté serveur : la fiche est peut-être encore dans
 * l'onglet (sessionStorage) → FicheLocale la relit et recharge la page, sinon
 * explique qu'elle n'est plus disponible.
 */
export default function FicheNotFound() {
  const pathname = usePathname();
  if (pathname === '/fiche/local') return <FicheLocale />;
  return <NotFound />;
}
