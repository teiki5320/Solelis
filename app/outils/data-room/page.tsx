'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface Item {
  id: string;
  label: string;
  description?: string;
  obligatoire: boolean;
}

interface Section {
  cle: string;
  icone: string;
  titre: string;
  items: Item[];
}

const CHECKLIST: Section[] = [
  {
    cle: 'identite',
    icone: '🪪',
    titre: 'Identité juridique',
    items: [
      { id: 'kbis', label: 'Extrait K-bis < 3 mois', obligatoire: true },
      { id: 'statuts', label: 'Statuts à jour', obligatoire: true },
      { id: 'pv-ag', label: 'Procès-verbaux des AG des 3 dernières années', obligatoire: true },
      { id: 'cap-table', label: 'Table de capitalisation (répartition du capital)', obligatoire: true },
      { id: 'pacte', label: 'Pacte d\'associés / actionnaires (le cas échéant)', obligatoire: false },
    ],
  },
  {
    cle: 'comptable',
    icone: '📊',
    titre: 'Comptable et financier',
    items: [
      { id: 'bilan-3', label: 'Bilans, comptes de résultat et annexes des 3 derniers exercices', obligatoire: true },
      { id: 'liasse', label: 'Liasses fiscales (2050-2059 ou 2033) des 3 dernières années', obligatoire: true },
      { id: 'situation', label: 'Situation comptable intermédiaire récente (< 3 mois)', obligatoire: true },
      { id: 'previsionnel', label: 'Prévisionnel d\'activité (CA, marge, résultat à 3 ans)', obligatoire: true },
      { id: 'tresorerie', label: 'Plan de trésorerie à 12 mois', obligatoire: true },
      { id: 'rapports', label: "Rapports du commissaire aux comptes (3 dernières années)", obligatoire: false },
      { id: 'analytique', label: 'Comptabilité analytique (par produit / client / segment)', obligatoire: false },
    ],
  },
  {
    cle: 'commercial',
    icone: '💼',
    titre: 'Commercial et clients',
    items: [
      { id: 'top-clients', label: 'Top 10 clients (CA, marge, ancienneté, dépendance)', obligatoire: true },
      { id: 'contrats', label: 'Contrats clients majeurs (> 5 % du CA)', obligatoire: true },
      { id: 'cgv', label: 'Conditions générales de vente', obligatoire: true },
      { id: 'pipeline', label: 'Pipeline commercial / carnet de commandes', obligatoire: true },
      { id: 'satisfaction', label: 'Indicateurs de satisfaction clients', obligatoire: false },
    ],
  },
  {
    cle: 'fournisseurs',
    icone: '🚚',
    titre: 'Fournisseurs et sous-traitance',
    items: [
      { id: 'top-fourn', label: 'Top 10 fournisseurs (montants, dépendance)', obligatoire: true },
      { id: 'contrats-f', label: 'Contrats fournisseurs majeurs et de sous-traitance', obligatoire: true },
      { id: 'cgv-f', label: 'Conditions générales d\'achat', obligatoire: false },
    ],
  },
  {
    cle: 'rh',
    icone: '👥',
    titre: 'Ressources humaines',
    items: [
      { id: 'effectif', label: 'Effectif par catégorie + organigramme', obligatoire: true },
      { id: 'masse', label: 'Masse salariale et structure des rémunérations', obligatoire: true },
      { id: 'contrats-t', label: 'Contrats de travail (modèles types + spécificités cadres)', obligatoire: true },
      { id: 'cse', label: 'PV des réunions du CSE des 12 derniers mois', obligatoire: true },
      { id: 'litiges-rh', label: 'Litiges et contentieux RH en cours', obligatoire: true },
      { id: 'idcc', label: 'Convention collective applicable (IDCC)', obligatoire: true },
    ],
  },
  {
    cle: 'immobilier',
    icone: '🏠',
    titre: 'Immobilier et bail',
    items: [
      { id: 'bail', label: 'Copie du ou des baux commerciaux', obligatoire: true },
      { id: 'titres', label: 'Titres de propriété si propriétaire', obligatoire: true },
      { id: 'etat-lieux', label: 'État des lieux (entrée + récents)', obligatoire: false },
      { id: 'normes', label: 'Diagnostics réglementaires (ERP, accessibilité, amiante…)', obligatoire: false },
    ],
  },
  {
    cle: 'ip',
    icone: '🧠',
    titre: 'Propriété intellectuelle',
    items: [
      { id: 'marques', label: 'Marques (INPI : numéros, dates, classes, renouvellements)', obligatoire: true },
      { id: 'noms', label: 'Noms de domaine et titulaires', obligatoire: true },
      { id: 'brevets', label: 'Brevets, modèles, logiciels (si applicable)', obligatoire: false },
      { id: 'licences', label: 'Licences acquises ou concédées', obligatoire: false },
    ],
  },
  {
    cle: 'litiges',
    icone: '⚖️',
    titre: 'Contentieux et risques',
    items: [
      { id: 'litiges-cours', label: 'Liste des contentieux en cours (objet, montant, juridiction)', obligatoire: true },
      { id: 'reclamations', label: 'Réclamations clients/fournisseurs significatives', obligatoire: true },
      { id: 'controles', label: 'Contrôles fiscaux ou sociaux récents et leurs suites', obligatoire: true },
      { id: 'assurances', label: 'Polices d\'assurance (RC, Multirisque, perte d\'exploitation)', obligatoire: true },
    ],
  },
  {
    cle: 'fiscal',
    icone: '🏛️',
    titre: 'Fiscal et social',
    items: [
      { id: 'attestations', label: 'Attestations URSSAF et SIE de régularité', obligatoire: true },
      { id: 'tva-detail', label: 'Détail TVA collectée/déductible des 24 derniers mois', obligatoire: false },
      { id: 'cice-cir', label: 'Crédits d\'impôt (CIR, CII, etc.)', obligatoire: false },
      { id: 'impots-ag', label: 'Relevés de solde d\'IS (n° 2572) des 3 dernières années', obligatoire: true },
    ],
  },
  {
    cle: 'banque',
    icone: '🏦',
    titre: 'Bancaire et financements',
    items: [
      { id: 'releves', label: 'Relevés bancaires consolidés (12 derniers mois)', obligatoire: true },
      { id: 'emprunts', label: 'Tableau d\'amortissement de chaque emprunt', obligatoire: true },
      { id: 'pge', label: "PGE et autres dispositifs covid (statut, échéancier)", obligatoire: false },
      { id: 'cautions', label: 'Liste de toutes les cautions et garanties', obligatoire: true },
      { id: 'leasing', label: 'Contrats de leasing/crédit-bail (mobilier, immobilier)', obligatoire: false },
    ],
  },
];

const STORAGE_KEY = 'solelis_dataroom_check';

function downloadText(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function DataRoomPage() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {}
  }, [done, loaded]);

  const stats = useMemo(() => {
    let totalObl = 0;
    let doneObl = 0;
    let total = 0;
    let doneAll = 0;
    CHECKLIST.forEach((s) =>
      s.items.forEach((i) => {
        total++;
        if (i.obligatoire) totalObl++;
        if (done[i.id]) {
          doneAll++;
          if (i.obligatoire) doneObl++;
        }
      })
    );
    return { totalObl, doneObl, total, doneAll };
  }, [done]);

  function toggle(id: string) {
    setDone((d) => ({ ...d, [id]: !d[id] }));
  }

  function exporter() {
    const lines: string[] = [];
    lines.push('Solelis — CHECKLIST DATA ROOM CESSION');
    lines.push(`Exporté le ${new Date().toLocaleDateString('fr-FR')}`);
    lines.push(`Avancement : ${stats.doneAll} / ${stats.total} pièces (${stats.doneObl} / ${stats.totalObl} obligatoires)`);
    lines.push('');
    CHECKLIST.forEach((s) => {
      lines.push(`### ${s.titre}`);
      s.items.forEach((i) => {
        lines.push(`${done[i.id] ? '[x]' : '[ ]'} ${i.label}${i.obligatoire ? ' (OBLIGATOIRE)' : ''}`);
      });
      lines.push('');
    });
    downloadText(lines.join('\n'), 'solelis-data-room.txt');
  }

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Préparer votre data room',
    description:
      'Constituez la data room pour la cession de votre entreprise avec cette checklist des pièces à rassembler (liste non exhaustive).',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Parcourir les catégories de documents',
        text: 'Consultez les 10 catégories : identité juridique, comptable, commercial, fournisseurs, RH, immobilier, propriété intellectuelle, contentieux, fiscal, bancaire.',
      },
      {
        '@type': 'HowToStep',
        name: 'Cocher les pièces déjà prêtes',
        text: 'Cochez chaque document que vous avez déjà rassemblé. L\'avancement est sauvegardé dans votre navigateur.',
      },
      {
        '@type': 'HowToStep',
        name: 'Prioriser les pièces obligatoires',
        text: 'Concentrez-vous sur les pièces marquées "obligatoire" en rouge, qui sont indispensables pour tout repreneur.',
      },
      {
        '@type': 'HowToStep',
        name: 'Exporter la checklist',
        text: 'Cliquez sur "Exporter ma checklist" pour télécharger un récapitulatif au format texte.',
      },
    ],
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://solelis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Outils', item: 'https://solelis.com/outils' },
      { '@type': 'ListItem', position: 3, name: 'Préparateur de data room' },
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
        Préparateur de data room (cession)
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Checklist des pièces à rassembler pour préparer la cession de
        votre entreprise (liste non exhaustive). Cochez ce que vous avez — l&apos;avancement est
        sauvegardé dans votre navigateur.
      </p>

      <div className="glass mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <p className="font-display text-2xl text-navy">
            {stats.doneAll} / {stats.total}
          </p>
          <p className="text-xs text-navy/55">pièces cochées au total</p>
        </div>
        <div>
          <p className="font-display text-2xl text-vert">
            {stats.doneObl} / {stats.totalObl}
          </p>
          <p className="text-xs text-navy/55">obligatoires cochées</p>
        </div>
        <button
          type="button"
          onClick={exporter}
          className="rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white hover:bg-navy"
        >
          📥 Exporter ma checklist
        </button>
      </div>

      <div className="mt-8 space-y-5">
        {CHECKLIST.map((s) => (
          <details key={s.cle} className="rounded-2xl border border-navy/10 bg-white/70 p-5" open>
            <summary className="cursor-pointer font-display text-lg text-navy">
              <span className="mr-2" aria-hidden>{s.icone}</span>
              {s.titre} ({s.items.filter((i) => done[i.id]).length} / {s.items.length})
            </summary>
            <ul className="mt-3 space-y-2">
              {s.items.map((i) => (
                <li key={i.id}>
                  <button
                    type="button"
                    onClick={() => toggle(i.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left ${
                      done[i.id]
                        ? 'border-vert/30 bg-vert/5'
                        : i.obligatoire
                        ? 'border-rouge/15 bg-rouge/5'
                        : 'border-navy/10 bg-white/60'
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        done[i.id]
                          ? 'border-vert-fonce bg-vert-fonce text-white'
                          : 'border-navy/25'
                      }`}
                      aria-hidden
                    >
                      {done[i.id] ? '✓' : ''}
                    </span>
                    <span className="flex-1 text-sm text-navy">
                      {i.label}
                      {i.obligatoire && (
                        <span className="ml-2 text-[10px] font-medium uppercase text-rouge">obligatoire</span>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-bleu/20 bg-bleu/5 p-5 text-sm text-navy">
        <p className="font-display text-base text-bleu-fonce">Conseils</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Numérisez tous les documents en PDF avant la mise en data room.</li>
          <li>Anonymisez les noms de salariés (RGPD) avant communication large.</li>
          <li>Faites signer un NDA (accord de confidentialité) avant l&apos;ouverture de la data room.</li>
          <li>Une data room complète facilite l&apos;audit du repreneur et la négociation.</li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Sources : Bpifrance Création — guide « Céder son entreprise »,
        CRA (Cédants et Repreneurs d&apos;Affaires), CCI France.
        Liste de référence non exhaustive.
      </p>
    </section>
  );
}
