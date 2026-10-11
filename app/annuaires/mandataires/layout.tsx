import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/annuaires/mandataires' },
  title: 'Mandataires et administrateurs judiciaires — Solelis',
  description:
    'Sélection indicative d\'études de mandataires et d\'administrateurs judiciaires, issue de l\'annuaire du CNAJMJ, classée par région.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
