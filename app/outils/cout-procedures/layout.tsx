import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/cout-procedures' },
  title: 'Coût des procédures — Solelis',
  description:
    'Qui fixe et qui paie les frais d\'une procédure (greffe, mandataire, avocat) : mandat ad hoc, conciliation, sauvegarde, redressement, liquidation, rétablissement professionnel.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
