import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/data-room' },
  title: 'Checklist data room — Solelis',
  description:
    'Liste (non exhaustive) des documents à préparer pour une cession ou une procédure collective : juridique, financier, social, fiscal, opérationnel.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
