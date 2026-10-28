import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ArticleSecours } from './ArticleSecours';

// Page de secours : articles publiés par la veille après la dernière construction du site.
// Jamais indexée (la version indexée est /actus/<slug>, une fois construite), absente du sitemap.
export const metadata: Metadata = {
  title: 'Actualité — Solelis',
  robots: { index: false, follow: true },
};

export default function ArticleSecoursPage() {
  return (
    <Suspense fallback={<p className="mx-auto max-w-[44rem] px-5 py-14 text-sm text-navy/60">Chargement de l’article…</p>}>
      <ArticleSecours />
    </Suspense>
  );
}
