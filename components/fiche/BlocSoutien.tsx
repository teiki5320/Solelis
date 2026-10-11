'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';
import type { CaisseRetraite } from '@/lib/secteur';

/**
 * Sélectionne la caisse sociale spécifique au dirigeant en fonction de son
 * code NAF (libéral, santé, vétérinaire, etc.). Renvoie null si aucune
 * caisse spécifique n'est identifiée.
 */
export function caisseFromNaf(
  naf: string,
  caisses: CaisseRetraite[] | undefined,
): CaisseRetraite | null {
  if (!naf || !caisses?.length) return null;
  const code = naf.replace(/\./g, '').toUpperCase();
  const find = (sigle: string) =>
    caisses.find((c) => c.caisse.toUpperCase() === sigle) ?? null;

  // 69.10Z regroupe avocats (CNBF), notaires (CPRN) et commissaires de
  // justice (CAVOM) : le code NAF ne permet pas de choisir, on ne devine pas.
  if (code.startsWith('6910')) return null;
  // Expertise comptable
  if (code.startsWith('6920')) return find('CAVEC');
  // Architecture (profession restée affiliée à la Cipav)
  if (code.startsWith('7111')) return find('CIPAV');
  // Pharmacie (commerce de détail pharmaceutique)
  if (code.startsWith('4773')) return find('CAVP');
  // Vétérinaire
  if (code.startsWith('7500')) return find('CARPV');
  // Auxiliaires médicaux (kiné, infirmier, orthophoniste…)
  if (code.startsWith('8690')) return find('CARPIMKO');
  // Médecins, dentistes, sages-femmes…
  if (code.startsWith('862')) {
    // Dentaire (86.23Z)
    if (code.startsWith('8623')) return find('CARCDSF');
    // Médecine générale / spécialisée
    return find('CARMF');
  }
  // Autres libéraux (conseil 70, activités spécialisées 74…) : depuis la
  // LFSS 2018 (loi n° 2017-1836, art. 15), la Cipav n'affilie plus qu'une
  // liste fermée de professions ; les libéraux non réglementés relèvent de
  // la sécurité sociale des indépendants (retraite : Assurance retraite).
  // Pas de caisse professionnelle spécifique à afficher.
  return null;
}

export default function BlocSoutien() {
  const { reponses, company, sector } = useFiche();
  const epuise = reponses.moral === 'epuise' || reponses.moral === 'perdu';
  const caisseSociale = caisseFromNaf(company.naf, sector.caissesRetraite);

  const message = epuise
    ? 'Ce que vous ressentez est légitime. Beaucoup de dirigeants traversent cette épreuve, et la plupart s\'en sortent mieux qu\'ils ne le croient — souvent parce qu\'ils ont osé demander de l\'aide. Vous venez de le faire.'
    : 'Diriger une entreprise en difficulté, c\'est porter beaucoup, souvent seul·e. Les personnes ci-dessous sont là pour vous — gratuitement et en confidentialité.';

  const hasSectorSoutien = !!sector.soutien;

  return (
    <BlocAccordeon
      icone="🤝"
      titre="Vous n'êtes pas seul·e"
      soustitre="Soutien humain, avant tout"
    >
      <p className="text-navy/80">{message}</p>
      <div className={`mt-5 grid gap-3 ${hasSectorSoutien ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        {hasSectorSoutien && (
          <a
            href={sector.soutien!.site ? sector.soutien!.site : sector.soutien!.telephone ? `tel:${sector.soutien!.telephone.replace(/\s/g, '')}` : '#'}
            target={sector.soutien!.site ? '_blank' : undefined}
            rel={sector.soutien!.site ? 'noreferrer' : undefined}
            className="glass-soft block border-l-4 border-l-vert p-4 transition hover:bg-white"
          >
            <p className="font-display text-lg text-navy">{sector.soutien!.nom}</p>
            <p className="mt-1 text-xs text-navy/60">{sector.soutien!.description}</p>
            {sector.soutien!.telephone && (
              <p className="mt-2 text-sm text-vert font-medium">{sector.soutien!.telephone}</p>
            )}
            <span className="pastille mt-2 text-[10px]">Spécifique {sector.label}</span>
          </a>
        )}
        <a
          href="https://www.apesa-france.com"
          target="_blank"
          rel="noreferrer"
          className="glass-soft block p-4 transition hover:bg-white"
        >
          <p className="font-display text-lg text-navy">APESA</p>
          <p className="mt-1 text-xs text-navy/60">
            Soutien psychologique gratuit et confidentiel pour les entrepreneur·e·s en souffrance, déclenché avec votre accord par une « sentinelle » (greffe, mandataire, expert-comptable…) · pas un service d’urgence : en cas de crise, 3114
          </p>
          <p className="mt-3 text-sm text-bleu-fonce">www.apesa-france.com →</p>
        </a>
        <a
          href="https://www.60000rebonds.com"
          target="_blank"
          rel="noreferrer"
          className="glass-soft block p-4 transition hover:bg-white"
        >
          <p className="font-display text-lg text-navy">60 000 Rebonds</p>
          <p className="mt-1 text-xs text-navy/60">
            Accompagnement après un dépôt de bilan
          </p>
          <p className="mt-3 text-sm text-bleu-fonce">60000rebonds.com →</p>
        </a>
        <a
          href="tel:3114"
          className="glass-soft block p-4 transition hover:bg-white"
        >
          <p className="font-display text-lg text-navy">3114</p>
          <p className="mt-1 text-xs text-navy/60">
            Numéro national de prévention du suicide · 24 h/24, 7 j/7 · gratuit
          </p>
          <p className="mt-3 text-sm text-bleu-fonce">Appeler 3114 →</p>
        </a>
      </div>
      {caisseSociale && (
        <div className="mt-5 rounded-2xl border border-vert/30 bg-vert/5 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-display text-base text-vert">
                {caisseSociale.caisse} · Action sociale
              </p>
              <p className="mt-1 text-xs text-navy/70">
                Votre caisse de retraite ({caisseSociale.profession.toLowerCase()}).
                Un fonds d&apos;action sociale peut vous accorder une aide
                financière d&apos;urgence (cotisations, perte de revenus,
                situations exceptionnelles).
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-vert">
              Spécifique {caisseSociale.profession}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <a
              href={`tel:${caisseSociale.telephone.replace(/\s/g, '')}`}
              className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
            >
              <span aria-hidden>☎</span> {caisseSociale.telephone}
            </a>
            <a
              href={caisseSociale.site}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
            >
              <span aria-hidden>🌐</span> {(() => {
                try {
                  return new URL(caisseSociale.site).hostname.replace('www.', '');
                } catch {
                  return 'site officiel';
                }
              })()}
            </a>
          </div>
        </div>
      )}

      <p className="mt-5 text-xs text-navy/50">
        Ces services sont gratuits et confidentiels. Ils sont tenus au secret
        professionnel.
      </p>
    </BlocAccordeon>
  );
}
