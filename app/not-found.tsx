import type { Metadata } from 'next';
import Link from 'next/link';
import { META_PAGE_INTROUVABLE } from '@/lib/og';

export const metadata: Metadata = META_PAGE_INTROUVABLE;

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-5 py-20 text-center">
      <p className="font-display text-6xl text-navy/20">404</p>
      <h1 className="mt-4 font-display text-2xl text-navy">
        Page introuvable
      </h1>
      <p className="mt-3 text-navy/60">
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-bleu-fonce px-6 py-3 text-sm text-white hover:bg-navy"
      >
        Retour à l&apos;accueil
      </Link>
    </section>
  );
}
