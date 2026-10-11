'use client';
import { yearFromDate } from '@/lib/sirene';
import { useFiche } from '@/lib/FicheContext';
import { ID_TITRE_FICHE } from '@/components/fiche/ModePerdu';

function isValid(v?: string): boolean {
  if (!v) return false;
  return !/non renseign|^—$/i.test(v);
}

export default function IdentiteHero() {
  const { company } = useFiche();
  const year = yearFromDate(company.dateCreation);
  const hasName = company.nom && company.nom !== 'Votre entreprise';
  const initials = hasName
    ? company.nom.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()
    : '—';

  return (
    <section className="relative overflow-hidden rounded-3xl border border-navy/10 bg-gradient-to-br from-white/90 via-white/80 to-bleu/10 p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-5">
        {/* Avatar initiales */}
        <div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-bleu-fonce to-bleu text-xl font-semibold text-white sm:h-20 sm:w-20 sm:text-2xl"
          aria-hidden
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h1 id={ID_TITRE_FICHE} tabIndex={-1} className="font-display text-2xl leading-tight text-navy focus:outline-none sm:text-4xl">
            {hasName ? company.nom : 'Votre entreprise'}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-navy/60 sm:text-sm">
            {company.siret && <span>SIRET · {company.siret}</span>}
            {(company.codePostal || company.ville) && (
              <>
                <span>
                  {[
                    company.codePostal,
                    company.ville || (company.departement ? `Dép. ${company.departement}` : ''),
                  ]
                    .filter(Boolean)
                    .join(' ')}
                </span>
              </>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {isValid(company.formeJuridique) && (
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-navy/75">
                🏢 {company.formeJuridique}
              </span>
            )}
            {isValid(company.nafLabel) && (
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-navy/75">
                🏷️ {company.nafLabel}
              </span>
            )}
            {year !== '—' && (
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-navy/75">
                📅 Depuis {year}
              </span>
            )}
            {isValid(company.effectif) && (
              <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-navy/75">
                👥 {company.effectif}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
