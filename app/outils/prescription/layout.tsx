import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/prescription' },
  title: 'Vérificateur de prescription — Solelis',
  description:
    'Vérifiez si vos dettes sont prescrites : URSSAF (3 ans), fiscal (3 ans, reprise), civil et commercial (5 ans), loyers (5 ans). Sources légales officielles.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
