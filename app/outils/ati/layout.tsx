import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/ati' },
  title: 'Simulateur ATI (allocation des travailleurs indépendants)',
  description:
    'Vérifiez votre éligibilité à l\'ATI et calculez le montant de votre allocation. De 19,73 à 26,30 € par jour pendant 6 mois (montants 2026).',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
