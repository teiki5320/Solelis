import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/annuaires/cip' },
  title: 'CIP — Centres d\'Information sur la Prévention — Solelis',
  description:
    'Trouvez votre CIP pour un entretien gratuit et confidentiel avec des bénévoles : expert-comptable, avocat et ancien juge du tribunal de commerce.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
