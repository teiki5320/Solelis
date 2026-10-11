'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';

/**
 * Calculateur de valorisation des stocks en cas de cession ou
 * liquidation. Les taux de réfaction sont des ordres de grandeur
 * indicatifs, sans source officielle publiée.
 *
 * Objectif : donner au dirigeant une fourchette réaliste de ce qu'il
 * peut espérer tirer de ses stocks selon la voie (cession amiable,
 * cession judiciaire, liquidation à la cuve, vente aux enchères).
 */

type NatureStock = 'matieres-premieres' | 'produits-finis-courants' | 'produits-finis-niche' | 'sav-pieces-detachees' | 'consommables' | 'invendus-obsoletes';
type Voie = 'amiable-rapide' | 'amiable-lente' | 'plan-cession' | 'liquidation-cuve' | 'encheres-judiciaires';

interface RefactionRange {
  bas: number; // pourcentage du prix de revient (HT)
  haut: number;
}

// Ordres de grandeur indicatifs (pas de barème officiel publié)
// Fourchettes typiques observées sur dossiers TPE/PME 2022-2024.
const REFACTIONS: Record<NatureStock, Record<Voie, RefactionRange>> = {
  'matieres-premieres': {
    'amiable-rapide':       { bas: 60, haut: 80 },
    'amiable-lente':        { bas: 70, haut: 90 },
    'plan-cession':         { bas: 50, haut: 70 },
    'liquidation-cuve':     { bas: 25, haut: 45 },
    'encheres-judiciaires': { bas: 15, haut: 35 },
  },
  'produits-finis-courants': {
    'amiable-rapide':       { bas: 50, haut: 70 },
    'amiable-lente':        { bas: 60, haut: 80 },
    'plan-cession':         { bas: 45, haut: 65 },
    'liquidation-cuve':     { bas: 20, haut: 40 },
    'encheres-judiciaires': { bas: 10, haut: 30 },
  },
  'produits-finis-niche': {
    'amiable-rapide':       { bas: 30, haut: 55 },
    'amiable-lente':        { bas: 40, haut: 65 },
    'plan-cession':         { bas: 25, haut: 50 },
    'liquidation-cuve':     { bas: 10, haut: 25 },
    'encheres-judiciaires': { bas: 5,  haut: 15 },
  },
  'sav-pieces-detachees': {
    'amiable-rapide':       { bas: 35, haut: 60 },
    'amiable-lente':        { bas: 50, haut: 75 },
    'plan-cession':         { bas: 30, haut: 55 },
    'liquidation-cuve':     { bas: 10, haut: 25 },
    'encheres-judiciaires': { bas: 5,  haut: 15 },
  },
  'consommables': {
    'amiable-rapide':       { bas: 40, haut: 65 },
    'amiable-lente':        { bas: 50, haut: 75 },
    'plan-cession':         { bas: 35, haut: 60 },
    'liquidation-cuve':     { bas: 15, haut: 30 },
    'encheres-judiciaires': { bas: 8,  haut: 20 },
  },
  'invendus-obsoletes': {
    'amiable-rapide':       { bas: 5,  haut: 20 },
    'amiable-lente':        { bas: 10, haut: 25 },
    'plan-cession':         { bas: 5,  haut: 15 },
    'liquidation-cuve':     { bas: 2,  haut: 10 },
    'encheres-judiciaires': { bas: 1,  haut: 5 },
  },
};

const NATURES: { value: NatureStock; label: string; description: string }[] = [
  { value: 'matieres-premieres',    label: 'Matières premières / vrac',  description: 'Acier, bois, tissu, ingrédients bruts revendables au poids' },
  { value: 'produits-finis-courants', label: 'Produits finis grand public', description: 'Marchandises standards, marques connues, écoulables vite' },
  { value: 'produits-finis-niche',  label: 'Produits finis spécialisés / niche', description: 'Sur-mesure, marque confidentielle, distribution étroite' },
  { value: 'sav-pieces-detachees',  label: 'Pièces détachées / SAV',     description: 'Stock industriel, références limitées au métier' },
  { value: 'consommables',          label: 'Consommables / fournitures', description: 'Emballages, papèterie, outillage à usage unique' },
  { value: 'invendus-obsoletes',    label: 'Invendus / obsolètes',       description: 'Collections passées, fins de série, matériel vétuste' },
];

const VOIES: { value: Voie; label: string; description: string }[] = [
  { value: 'amiable-rapide',       label: 'Cession amiable rapide (1-3 mois)',                description: 'Repreneur déjà identifié, fonds de commerce vendu en bloc' },
  { value: 'amiable-lente',        label: 'Cession amiable étalée (3-12 mois)',               description: 'Écoulement progressif via canaux normaux, dirigeant aux commandes' },
  { value: 'plan-cession',         label: 'Plan de cession en RJ',                            description: 'Repreneur via tribunal, prix négocié à la baisse' },
  { value: 'liquidation-cuve',     label: 'Liquidation à la cuve (mandataire)',               description: 'Vente en gros à un revendeur spécialisé, sous contrôle du liquidateur' },
  { value: 'encheres-judiciaires', label: 'Ventes aux enchères judiciaires (commissaire-priseur)', description: 'Lots dispersés, ventes publiques, valeur la plus basse' },
];

function formatEuros(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

export default function ValorisationStocksPage() {
  const [nature, setNature] = useState<NatureStock>('produits-finis-courants');
  const [voie, setVoie] = useState<Voie>('liquidation-cuve');
  const [prixRevient, setPrixRevient] = useState(50000);

  const result = useMemo(() => {
    const r = REFACTIONS[nature][voie];
    const bas = (prixRevient * r.bas) / 100;
    const haut = (prixRevient * r.haut) / 100;
    const moyenne = (bas + haut) / 2;
    return { bas, haut, moyenne, pctBas: r.bas, pctHaut: r.haut };
  }, [nature, voie, prixRevient]);

  // Comparaison : amiable rapide vs. liquidation cuve, à nature constante
  const comparaison = useMemo(() => {
    const amiable = REFACTIONS[nature]['amiable-rapide'];
    const cuve = REFACTIONS[nature]['liquidation-cuve'];
    const moyenneAmiable = (prixRevient * (amiable.bas + amiable.haut)) / 200;
    const moyenneCuve = (prixRevient * (cuve.bas + cuve.haut)) / 200;
    return { moyenneAmiable, moyenneCuve, ecart: moyenneAmiable - moyenneCuve };
  }, [nature, prixRevient]);

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Estimer la valeur de réalisation des stocks',
    description: 'Calculez la fourchette de valeur de vos stocks selon la voie de liquidation envisagée.',
    step: [
      { '@type': 'HowToStep', name: 'Saisir le prix de revient', text: 'Indiquez la valeur d\'achat HT de votre stock (valeur comptable).' },
      { '@type': 'HowToStep', name: 'Choisir la nature du stock', text: 'Matières premières, produits finis courants, niche, SAV, consommables, invendus.' },
      { '@type': 'HowToStep', name: 'Choisir la voie de réalisation', text: 'Cession amiable rapide, étalée, plan de cession, liquidation à la cuve, enchères judiciaires.' },
      { '@type': 'HowToStep', name: 'Lire la fourchette', text: 'L\'outil affiche une valeur basse, haute et moyenne en euros.' },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Valorisation des stocks' },
    ],
  };

  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <Link href="/outils" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Valorisation des stocks en cession ou liquidation
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Estimez la valeur réelle que vous pouvez tirer de vos stocks
        selon la nature du stock et la voie de cession envisagée. Les
        taux de réfaction sont des ordres de grandeur indicatifs, sans
        valeur officielle.
      </p>

      <div className="glass mt-8 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm text-navy/80">
            Prix de revient total HT du stock (€)
            <input
              type="number"
              min={0}
              value={prixRevient || ''}
              onChange={(e) => setPrixRevient(Number(e.target.value) || 0)}
              className="mt-2 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-base"
              placeholder="50000"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              Valeur d&apos;achat comptable, hors marge. À retrouver sur l&apos;état des stocks (compte 31, 32, 35, 37).
            </span>
          </label>

          <div className="block text-sm text-navy/80">
            Nature dominante du stock
            <select
              aria-label="Nature dominante du stock"
              value={nature}
              onChange={(e) => setNature(e.target.value as NatureStock)}
              className="mt-2 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-base"
            >
              {NATURES.map((n) => (
                <option key={n.value} value={n.value}>{n.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-[11px] text-navy/55">
              {NATURES.find((n) => n.value === nature)?.description}
            </span>
          </div>

          <div className="sm:col-span-2 block text-sm text-navy/80">
            Voie de réalisation envisagée
            <select
              aria-label="Voie de réalisation envisagée"
              value={voie}
              onChange={(e) => setVoie(e.target.value as Voie)}
              className="mt-2 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2 text-base"
            >
              {VOIES.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
            <span className="mt-1 block text-[11px] text-navy/55">
              {VOIES.find((v) => v.value === voie)?.description}
            </span>
          </div>
        </div>

        {prixRevient > 0 && (
          <div className="mt-6 rounded-2xl border border-bleu/30 bg-bleu/5 p-5">
            <p className="text-[11px] uppercase tracking-wider text-bleu-fonce">
              Fourchette de valeur de réalisation
            </p>
            <p className="mt-2 font-display text-3xl text-bleu-fonce">
              {formatEuros(result.bas)} — {formatEuros(result.haut)}
            </p>
            <p className="mt-1 text-sm text-navy/70">
              Soit {result.pctBas} % à {result.pctHaut} % du prix de revient · valeur moyenne ≈ {formatEuros(result.moyenne)}
            </p>
          </div>
        )}

        {prixRevient > 0 && nature !== 'invendus-obsoletes' && (
          <div className="mt-4 rounded-2xl border border-jaune/30 bg-jaune/5 p-5">
            <p className="font-display text-base text-jaune">
              💡 Écart amiable rapide vs liquidation à la cuve
            </p>
            <p className="mt-2 text-sm text-navy/80">
              Une cession amiable rapide vous rapporterait en moyenne{' '}
              <strong>{formatEuros(comparaison.moyenneAmiable)}</strong>,
              contre <strong>{formatEuros(comparaison.moyenneCuve)}</strong>{' '}
              en liquidation à la cuve. Soit un écart de{' '}
              <strong>{formatEuros(comparaison.ecart)}</strong> en faveur
              de la voie amiable. C&apos;est typiquement l&apos;ordre de
              grandeur qui justifie d&apos;ouvrir un mandat ad hoc ou une
              conciliation plutôt que d&apos;attendre la liquidation.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">À savoir</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            <strong>Cession amiable</strong> : vous gardez la main, négociez
            avec un repreneur. Les stocks vendus en bloc avec le fonds
            valent souvent plus que vendus séparément.
          </li>
          <li>
            <strong>Plan de cession en RJ</strong> : le repreneur fixe son
            prix en intégrant le stock à un prix décoté.
          </li>
          <li>
            <strong>Liquidation à la cuve</strong> : le mandataire vend en
            gros à un revendeur (broker) qui paie cash et écoule en
            soldeurs / web marketplaces. Décote forte.
          </li>
          <li>
            <strong>Enchères judiciaires</strong> : ventes publiques en lots
            par un commissaire de justice. Valeurs les plus basses,
            mais transparence totale et rapidité.
          </li>
          <li>
            <strong>Stocks périssables</strong> (alimentaire, fleurs,
            médicaments) : la valeur de réalisation chute brutalement
            avec le temps. À traiter en priorité absolue.
          </li>
          <li>
            <strong>Stocks taxables CRD</strong> (alcool, tabac, parfumerie) :
            attention aux droits indirects à régler à la sortie.
          </li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Ordres de grandeur indicatifs, sans source officielle publiée :
        ils ne remplacent pas l&apos;inventaire et l&apos;estimation faits
        par un commissaire de justice ou par le mandataire. La
        valeur réelle dépend de l&apos;état des stocks, de la conjoncture
        sectorielle et de la qualité du repreneur ou de l&apos;acheteur en gros.
      </p>
    </section>
  );
}
