'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { nombreFr } from '@/lib/format';

type SecteurVal =
  | 'commerce-detail'
  | 'hcr'
  | 'btp'
  | 'industrie'
  | 'services-bpb'
  | 'numerique'
  | 'sante-libe'
  | 'transport'
  | 'autre';

interface Multiples {
  label: string;
  ebeBas: number;
  ebeHaut: number;
  caBas: number; // % CA pour valeur fonds
  caHaut: number;
  note: string;
}

// Source : Bpifrance Création — « Valoriser son entreprise »,
// CRA, fiches BDO / PwC « Argos Mid-Market » pour les TPE/PME non cotées.
// Multiples indicatifs 2024-2025.
const MULTIPLES: Record<SecteurVal, Multiples> = {
  'commerce-detail': {
    label: 'Commerce de détail',
    ebeBas: 2.5, ebeHaut: 4.5,
    caBas: 0.3, caHaut: 0.7,
    note: 'Forte pondération sur l\'emplacement et le bail. Les murs peuvent ajouter 20-40 % à la valeur.',
  },
  'hcr': {
    label: 'Hôtellerie-restauration',
    ebeBas: 3, ebeHaut: 5.5,
    caBas: 0.7, caHaut: 1.2,
    note: "Hôtellerie : multiples plus élevés (5-7× EBE). Restauration traditionnelle : 3-5× EBE. Les murs souvent valorisés séparément.",
  },
  'btp': {
    label: 'BTP / Construction',
    ebeBas: 2.5, ebeHaut: 4.5,
    caBas: 0.15, caHaut: 0.35,
    note: "Décote récente liée à la crise du secteur. Carnet de commandes sécurisé valorisé.",
  },
  'industrie': {
    label: 'Industrie / PMI',
    ebeBas: 4, ebeHaut: 7,
    caBas: 0.4, caHaut: 0.8,
    note: "Outils productifs, brevets et savoir-faire valorisés. Forte dépendance à 1-2 clients = décote.",
  },
  'services-bpb': {
    label: 'Services B2B',
    ebeBas: 4, ebeHaut: 7,
    caBas: 0.5, caHaut: 1.2,
    note: "Récurrence du CA, qualité du portefeuille clients et marques d\'attention.",
  },
  'numerique': {
    label: 'Numérique / SaaS',
    ebeBas: 5, ebeHaut: 10,
    caBas: 1.0, caHaut: 3.0,
    note: "Multiple ARR (Annual Recurring Revenue) pour SaaS : 3-7× ARR. Taux de churn clé.",
  },
  'sante-libe': {
    label: 'Santé / libéral',
    ebeBas: 3.5, ebeHaut: 6,
    caBas: 0.4, caHaut: 0.8,
    note: "Patientèle transférable, compatibilité ordinale.",
  },
  'transport': {
    label: 'Transport routier',
    ebeBas: 3, ebeHaut: 5,
    caBas: 0.3, caHaut: 0.6,
    note: "Flotte en propriété valorisée séparément. Marges tendues récemment.",
  },
  'autre': {
    label: 'Autre',
    ebeBas: 3, ebeHaut: 5.5,
    caBas: 0.3, caHaut: 0.7,
    note: "Moyenne pondérée des secteurs. Faites vérifier par un expert-comptable.",
  },
};

function formatEuros(n: number): string {
  if (n >= 1000000) return nombreFr(n / 1000000, 2) + ' M€';
  if (n >= 1000) return (n / 1000).toFixed(0) + ' k€';
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

interface Decote {
  label: string;
  taux: number; // en %
  actif: boolean;
}

export default function ValorisationPage() {
  const [secteur, setSecteur] = useState<SecteurVal>('autre');
  const [ca, setCa] = useState(500000);
  const [ebe, setEbe] = useState(50000);
  const [decotes, setDecotes] = useState<Decote[]>([
    { label: 'Dépendance à un client (> 30 % du CA)', taux: 20, actif: false },
    { label: 'Dépendance au dirigeant (pas de relais)', taux: 25, actif: false },
    { label: 'Dette significative (LBO, PGE)', taux: 15, actif: false },
    { label: 'Cession en procédure collective', taux: 30, actif: false },
    { label: 'Secteur en fort déclin', taux: 15, actif: false },
    { label: 'Dépendance à 1 fournisseur critique', taux: 10, actif: false },
  ]);

  const m = MULTIPLES[secteur];

  const valo = useMemo(() => {
    const valoEbeBas = ebe * m.ebeBas;
    const valoEbeHaut = ebe * m.ebeHaut;
    const valoCaBas = ca * m.caBas;
    const valoCaHaut = ca * m.caHaut;
    const moyEbe = (valoEbeBas + valoEbeHaut) / 2;
    const moyCa = (valoCaBas + valoCaHaut) / 2;
    // Pondération : 70 % EBE, 30 % CA (méthode mixte)
    const baseCentrale = moyEbe * 0.7 + moyCa * 0.3;

    const tauxDecote = decotes.filter((d) => d.actif).reduce((sum, d) => sum + d.taux, 0);
    const coefDecote = Math.max(0, 1 - tauxDecote / 100);
    const centraleAjustee = baseCentrale * coefDecote;

    return {
      valoEbeBas, valoEbeHaut,
      valoCaBas, valoCaHaut,
      baseCentrale,
      centraleAjustee,
      tauxDecote,
    };
  }, [ebe, ca, m, decotes]);

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Estimer la valorisation de votre entreprise',
    description:
      'Estimez la valeur de votre entreprise par la méthode des multiples sectoriels (EBE et CA) avec prise en compte des facteurs de décote.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Sélectionner votre secteur d\'activité',
        text: 'Choisissez parmi 9 secteurs (commerce, HCR, BTP, industrie, services, numérique, santé, transport, autre) pour obtenir les multiples adaptés.',
      },
      {
        '@type': 'HowToStep',
        name: 'Saisir le chiffre d\'affaires et l\'EBE',
        text: 'Indiquez votre CA annuel HT et votre Excédent Brut d\'Exploitation pour le calcul des fourchettes.',
      },
      {
        '@type': 'HowToStep',
        name: 'Appliquer les facteurs de décote',
        text: 'Cochez les éléments applicables : dépendance client, dépendance dirigeant, dette, procédure collective, déclin sectoriel, fournisseur unique.',
      },
      {
        '@type': 'HowToStep',
        name: 'Lire la valorisation estimée',
        text: 'L\'outil affiche la fourchette par approche EBE et CA, la valeur centrale pondérée (70 % EBE / 30 % CA) et la valeur ajustée après décotes.',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Valorisation indicative' },
    ],
  };

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <Link href="/outils" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les outils
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Valorisation indicative
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Estimation par méthode des multiples sectoriels (EBE et CA).
        Ordres de grandeur de marché pour des TPE/PME, sans valeur
        officielle. Un expert-comptable affinera selon vos
        spécificités.
      </p>

      <div className="glass mt-8 space-y-4 p-6 sm:p-8">
        <label className="block text-sm text-navy">
          Secteur d&apos;activité
          <select
            value={secteur}
            onChange={(e) => setSecteur(e.target.value as SecteurVal)}
            className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
          >
            {(Object.entries(MULTIPLES) as [SecteurVal, Multiples][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <span className="mt-1 block text-[11px] text-navy/55">
            Multiples : {nombreFr(m.ebeBas)}× à {nombreFr(m.ebeHaut)}× EBE · {(m.caBas * 100).toFixed(0)} % à {(m.caHaut * 100).toFixed(0)} % CA
          </span>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm text-navy">
            Chiffre d&apos;affaires annuel HT (€)
            <input
              type="number"
              min={0}
              value={ca}
              onChange={(e) => setCa(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
          </label>
          <label className="block text-sm text-navy">
            EBE (Excédent Brut d&apos;Exploitation) annuel (€)
            <input
              type="number"
              value={ebe}
              onChange={(e) => setEbe(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-navy/15 bg-white/90 px-3 py-2"
            />
            <span className="mt-1 block text-[11px] text-navy/55">
              EBE = CA − achats − charges externes − impôts/taxes − charges de personnel
            </span>
          </label>
        </div>

        <div className="rounded-2xl border border-navy/10 bg-white/60 p-4 text-sm">
          <p className="font-medium text-navy">Facteurs de décote</p>
          <p className="mt-1 text-xs text-navy/55">
            Cochez les éléments qui s&apos;appliquent à votre cas. Les taux se cumulent.
          </p>
          <div className="mt-3 space-y-2">
            {decotes.map((d, i) => (
              <label key={i} className="flex items-center gap-2 text-sm text-navy">
                <input
                  type="checkbox"
                  checked={d.actif}
                  onChange={(e) =>
                    setDecotes((prev) => prev.map((x, j) => (j === i ? { ...x, actif: e.target.checked } : x)))
                  }
                  className="h-4 w-4"
                />
                <span>{d.label}</span>
                <span className="ml-auto text-xs text-rouge">-{d.taux} %</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-bleu/30 bg-bleu/5 p-5">
          <p className="font-display text-lg text-bleu-fonce">Estimation indicative</p>

          {ebe > 0 && (
            <>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/80 p-3">
                  <p className="text-[11px] uppercase text-navy/55">Approche EBE</p>
                  <p className="mt-1 text-sm text-navy">{formatEuros(valo.valoEbeBas)} — {formatEuros(valo.valoEbeHaut)}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3">
                  <p className="text-[11px] uppercase text-navy/55">Approche CA</p>
                  <p className="mt-1 text-sm text-navy">{formatEuros(valo.valoCaBas)} — {formatEuros(valo.valoCaHaut)}</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-white/90 p-4 text-center">
                <p className="text-[11px] uppercase text-navy/55">Valeur centrale pondérée (70 % EBE, 30 % CA)</p>
                <p className="mt-1 font-display text-3xl text-navy">{formatEuros(valo.baseCentrale)}</p>
                {valo.tauxDecote > 0 && (
                  <div className="mt-3 border-t border-navy/10 pt-3">
                    <p className="text-xs text-rouge">
                      Après décotes ({valo.tauxDecote} %) :
                    </p>
                    <p className="font-display text-2xl text-rouge">{formatEuros(valo.centraleAjustee)}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {ebe <= 0 && (
            <p className="mt-2 text-sm text-navy/75">
              Avec un EBE négatif ou nul, la valorisation par multiples n&apos;a pas de sens — la valeur repose sur la valeur patrimoniale nette (actif − passif) ou sur la valeur des éléments immatériels (fonds, marque, clientèle). Consultez un expert-comptable.
            </p>
          )}

          <p className="mt-3 text-[11px] text-navy/55">
            <strong>Note sectorielle :</strong> {m.note}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-jaune/30 bg-jaune/5 p-5 text-sm text-navy/80">
        <p className="font-display text-base text-navy">⚠️ Limites de l&apos;outil</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Les multiples varient selon la taille (les TPE subissent en général une décote par rapport aux PME/ETI).</li>
          <li>Une cession en procédure collective subit en général une décote supplémentaire importante.</li>
          <li>Cette méthode ignore la trésorerie nette (à ajouter/déduire selon le cas).</li>
          <li>La valeur réelle se matérialise en négociation — préparez une data room solide (voir outil dédié).</li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Méthode des multiples (présentée notamment par Bpifrance
        Création, « Valoriser son entreprise ») ; les multiples et
        décotes affichés sont des ordres de grandeur, sans source
        officielle. Cet outil ne remplace pas un expert-comptable.
      </p>
    </section>
  );
}
