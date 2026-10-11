import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/outils/licenciement' },
  title: 'Calculateur indemnité de licenciement — Solelis',
  description:
    'Calculez l\'indemnité légale de licenciement économique selon l\'ancienneté et le salaire brut. Plafonds AGS 2026 inclus.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
