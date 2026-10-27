'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { COURRIERS } from '@/lib/courriers';
import ThemeToggle from './ThemeToggle';

// « Parler à quelqu'un » en tête : c'est l'entrée la plus importante pour
// une personne en détresse — elle est mise en avant dans le menu.
const PARLER = { href: '/parler', label: "Parler à quelqu'un", desc: "Numéros d'écoute et d'orientation" };

const LINKS = [
  { href: '/procedures', label: 'Procédures', desc: 'Comprendre vos options' },
  { href: '/courriers', label: 'Courriers', desc: `${COURRIERS.length} modèles prêts` },
  { href: '/aides', label: 'Aides entreprise', desc: 'Financements et dispositifs' },
  { href: '/aides-personnelles', label: 'Droits personnels', desc: 'ATI, CSS, RSA...' },
  { href: '/proteger-famille', label: 'Famille', desc: 'Patrimoine et cautions' },
  { href: '/vendre', label: 'Vendre / Céder', desc: 'Cession, location-gérance' },
  { href: '/rebond', label: 'Rebondir', desc: 'Après une liquidation' },
  { href: '/actus', label: 'Actualité', desc: 'Entreprises en difficulté en France' },
  { href: '/faq', label: 'FAQ', desc: 'Questions fréquentes' },
  { href: '/glossaire', label: 'Glossaire', desc: '38 termes expliqués' },
  { href: '/accompagnant', label: "J'accompagne", desc: 'Pour les proches' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const boutonMenuRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        // Rend le focus au bouton Menu (sinon il se perd en haut de page).
        boutonMenuRef.current?.focus();
      }
    }
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  return (
    <>
    {/* Voile derrière le menu ouvert : isole visuellement le menu du contenu.
        Rendu hors du <header> (transformé), sinon `fixed` serait relatif à lui. */}
    {open && (
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-30 bg-black/20"
      />
    )}
    <header ref={ref} className="fixed top-3 left-1/2 z-40 -translate-x-1/2 sm:top-4">
      <a
        href="#contenu-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-navy focus:rounded-lg"
      >
        Aller au contenu
      </a>
      <nav aria-label="Navigation principale" className="pill-nav flex items-center gap-4 px-5 py-2.5 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="font-display text-base tracking-wide text-navy sm:text-lg"
        >
          Solelis
        </Link>

        <div className="hidden items-center gap-4 text-sm text-navy/55 md:flex">
          <Link href="/procedures" aria-current={pathname === '/procedures' ? 'page' : undefined} className="transition hover:text-navy">Procédures</Link>
          <Link href="/courriers" aria-current={pathname === '/courriers' ? 'page' : undefined} className="transition hover:text-navy">Courriers</Link>
          <Link href="/aides" aria-current={pathname === '/aides' ? 'page' : undefined} className="transition hover:text-navy">Aides</Link>
          <Link href="/parler" aria-current={pathname === '/parler' ? 'page' : undefined} className="transition hover:text-navy">Parler</Link>
        </div>

        <ThemeToggle />

        {/* Cible tactile de 44 px (pseudo-élément) sans changer le visuel de 32 px. */}
        <button
          ref={boutonMenuRef}
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-sm text-navy/60 before:absolute before:-inset-1.5 before:content-[''] hover:bg-navy/5"
          aria-label="Menu"
          aria-expanded={open}
          aria-controls="menu-complet"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <nav
          id="menu-complet"
          aria-label="Menu complet"
          className="glass mt-2 max-h-[70vh] w-[280px] overflow-y-auto rounded-2xl p-2 sm:w-[320px]"
          style={{ position: 'absolute', right: 0, top: '100%' }}
          onKeyDown={(e) => {
            if (e.key !== 'Tab') return;
            const focusable = e.currentTarget.querySelectorAll<HTMLElement>('a, button');
            if (focusable.length === 0) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }}
        >
          <Link
            href={PARLER.href}
            onClick={() => setOpen(false)}
            aria-current={pathname === PARLER.href ? 'page' : undefined}
            className="mb-1 flex flex-col rounded-xl border border-bleu/25 bg-bleu/10 px-4 py-2.5 transition hover:bg-bleu/15"
          >
            <span className="text-sm font-semibold text-bleu-fonce">
              <span aria-hidden className="mr-1.5">📞</span>
              {PARLER.label}
            </span>
            <span className="text-xs text-navy/70">{PARLER.desc}</span>
          </Link>
          <ul>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === l.href ? 'page' : undefined}
                  className="flex flex-col rounded-xl px-4 py-2.5 transition hover:bg-navy/5"
                >
                  <span className="text-sm font-medium text-navy">{l.label}</span>
                  <span className="text-xs text-navy/45">{l.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
    </>
  );
}
