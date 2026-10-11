'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

interface CIP {
  region: string;
  ville: string;
  permanenceFrequence: string;
  contact: string;
}

const REGIONS = [
  'Île-de-France',
  'Auvergne-Rhône-Alpes',
  'Provence-Alpes-Côte d\'Azur',
  'Occitanie',
  'Nouvelle-Aquitaine',
  'Pays de la Loire',
  'Bretagne',
  'Hauts-de-France',
  'Grand Est',
  'Bourgogne-Franche-Comté',
  'Centre-Val de Loire',
  'Normandie',
  'Outre-mer',
];

// Source : carte officielle des CIP territoriaux sur cip-national.fr
// (consultée en octobre 2026 : 52 CIP). Le CIP National indique « une soixantaine »
// de CIP territoriaux : la liste complète et à jour (adresses, téléphones) est sur cip-national.fr.
const CIP_PRINCIPAUX: CIP[] = [
  // — Île-de-France —
  { region: 'Île-de-France', ville: 'Paris', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Paris (75) — CCI de Paris' },
  { region: 'Île-de-France', ville: 'Nanterre', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Hauts-de-Seine (92) — CMA' },
  { region: 'Île-de-France', ville: 'Bobigny', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Seine-Saint-Denis (93) — CCI' },
  { region: 'Île-de-France', ville: 'Lisses', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de l\'Essonne (91)' },
  { region: 'Île-de-France', ville: 'Versailles', permanenceFrequence: 'sur rendez-vous', contact: 'CIP des Yvelines (78)' },
  { region: 'Île-de-France', ville: 'Vaux-le-Pénil', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Seine-et-Marne (77)' },
  // — Auvergne-Rhône-Alpes —
  { region: 'Auvergne-Rhône-Alpes', ville: 'Bourg-en-Bresse', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de l\'Ain (01)' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Le Puy-en-Velay', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Haute-Loire (43)' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Saint-Étienne', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Loire Sud (42)' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Roanne', permanenceFrequence: 'sur rendez-vous', contact: 'CIP du Bassin roannais (42)' },
  // — Provence-Alpes-Côte d'Azur —
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Nice', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Alpes-Maritimes (06) — CCI Nice Côte d\'Azur' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Manosque', permanenceFrequence: 'sur rendez-vous', contact: 'CIP des Alpes-de-Haute-Provence (04)' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Gap', permanenceFrequence: 'sur rendez-vous', contact: 'CIP des Hautes-Alpes (05) — CCI' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Toulon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Toulon (83) — Maison de justice et du droit' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Draguignan', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Haut-Centre Var (83) — CMA du Var' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Pernes-les-Fontaines', permanenceFrequence: 'sur rendez-vous', contact: 'CIP du Vaucluse (84)' },
  // — Occitanie —
  { region: 'Occitanie', ville: 'Toulouse', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Haute-Garonne (31) — Ordre des experts-comptables' },
  { region: 'Occitanie', ville: 'Mauguio', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de l\'Hérault (34) — CCI Hérault' },
  { region: 'Occitanie', ville: 'Béziers', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Béziers (34) — CCI Hérault' },
  { region: 'Occitanie', ville: 'Nîmes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Gard (30) — CCI' },
  { region: 'Occitanie', ville: 'Carcassonne', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de l\'Aude (11) — CCI' },
  { region: 'Occitanie', ville: 'Narbonne', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Narbonne (11)' },
  { region: 'Occitanie', ville: 'Cahors', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Lot (46) — CCI' },
  { region: 'Occitanie', ville: 'Tarbes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Tarbes (65) — CCI' },
  { region: 'Occitanie', ville: 'Montauban', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Tarn-et-Garonne (82) — CCI' },
  // — Nouvelle-Aquitaine —
  { region: 'Nouvelle-Aquitaine', ville: 'Bordeaux', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Gironde (33) — CCI' },
  { region: 'Nouvelle-Aquitaine', ville: 'Angoulême', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Charente (16)' },
  { region: 'Nouvelle-Aquitaine', ville: 'Bayonne', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Pyrénées-Atlantiques (64)' },
  { region: 'Nouvelle-Aquitaine', ville: 'Marmande', permanenceFrequence: 'sur rendez-vous', contact: 'CIP du Lot-et-Garonne (47)' },
  // — Pays de la Loire —
  { region: 'Pays de la Loire', ville: 'Nantes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Loire-Atlantique (44) — Ordre des experts-comptables' },
  { region: 'Pays de la Loire', ville: 'Angers', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Maine-et-Loire (49)' },
  { region: 'Pays de la Loire', ville: 'Le Mans', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Sarthe (72)' },
  { region: 'Pays de la Loire', ville: 'Laval', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Mayenne (53)' },
  { region: 'Pays de la Loire', ville: 'La Roche-sur-Yon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Vendée (85) — CMA' },
  // — Bretagne —
  { region: 'Bretagne', ville: 'Saint-Brieuc', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Côtes-d\'Armor (22) — CCI' },
  { region: 'Bretagne', ville: 'Lorient', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Morbihan (56)' },
  // — Hauts-de-France —
  { region: 'Hauts-de-France', ville: 'Dunkerque', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Dunkerque Côte d\'Opale (59)' },
  // — Grand Est —
  { region: 'Grand Est', ville: 'Reims', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Champagne-Ardenne (51)' },
  { region: 'Grand Est', ville: 'Metz', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Moselle (57) — CCI' },
  // — Bourgogne-Franche-Comté —
  { region: 'Bourgogne-Franche-Comté', ville: 'Besançon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Doubs (25) — CCI' },
  { region: 'Bourgogne-Franche-Comté', ville: 'Vesoul', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Haute-Saône (70) — CCI' },
  { region: 'Bourgogne-Franche-Comté', ville: 'Belfort', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Belfort (90) — CCI' },
  { region: 'Bourgogne-Franche-Comté', ville: 'Chalon-sur-Saône', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Saône-et-Loire (71) — CCI' },
  // — Centre-Val de Loire —
  { region: 'Centre-Val de Loire', ville: 'Tours', permanenceFrequence: 'sur rendez-vous', contact: 'CIP de Tours (37) — CCI de Touraine' },
  { region: 'Centre-Val de Loire', ville: 'Châteauroux', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Indre (36) — CCI' },
  // — Normandie —
  { region: 'Normandie', ville: 'Rouen', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Seine Normandie (76)' },
  { region: 'Normandie', ville: 'Le Havre', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Seine Estuaire (76) — CCI' },
  { region: 'Normandie', ville: 'Caen', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Ouest-Normandie — Calvados (14)' },
  { region: 'Normandie', ville: 'Caen', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Ouest-Normandie — Manche (50)' },
  { region: 'Normandie', ville: 'Alençon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Ouest-Normandie — Orne (61)' },
  // — Outre-mer —
  { region: 'Outre-mer', ville: 'Pointe-à-Pitre', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Guadeloupe (971) — CCI' },
  { region: 'Outre-mer', ville: 'Fort-de-France', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Martinique (972) — CCI' },
];

export default function CipPage() {
  const [recherche, setRecherche] = useState('');
  const [regionFiltre, setRegionFiltre] = useState<string | null>(null);

  const cipFiltres = useMemo(() => {
    const q = recherche.toLowerCase();
    return CIP_PRINCIPAUX.filter(c => {
      if (regionFiltre && c.region !== regionFiltre) return false;
      if (q && !c.ville.toLowerCase().includes(q) && !c.contact.toLowerCase().includes(q) && !c.region.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [recherche, regionFiltre]);

  const parRegion = useMemo(() => {
    const map = new Map<string, CIP[]>();
    for (const c of cipFiltres) {
      const list = map.get(c.region) || [];
      list.push(c);
      map.set(c.region, list);
    }
    return map;
  }, [cipFiltres]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        CIP — Centres d&apos;Information sur la Prévention
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Le CIP propose aux chef·fe·s d&apos;entreprise en difficulté un <strong>entretien gratuit, confidentiel et anonyme, sur
        rendez-vous</strong> (les « Entretiens du jeudi »). Vous êtes
        reçu·e par des bénévoles : un expert-comptable ou commissaire aux
        comptes, un avocat et un ancien juge du tribunal de commerce.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="glass-soft rounded-2xl p-4 text-center">
          <p className="font-display text-2xl text-navy">100 %</p>
          <p className="mt-1 text-xs text-navy/65">Gratuit</p>
        </div>
        <div className="glass-soft rounded-2xl p-4 text-center">
          <p className="font-display text-2xl text-navy">100 %</p>
          <p className="mt-1 text-xs text-navy/65">Confidentiel</p>
        </div>
        <div className="glass-soft rounded-2xl p-4 text-center">
          <p className="font-display text-2xl text-navy">~ 60</p>
          <p className="mt-1 text-xs text-navy/65">CIP territoriaux</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-bleu/30 bg-bleu/5 p-5 text-sm text-navy">
        <p className="font-display text-base text-bleu-fonce">
          Comment se déroule un RDV CIP
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Entretien de <strong>30 à 60 minutes</strong> environ, sur rendez-vous</li>
          <li>Un trio de bénévoles vous reçoit : un expert-comptable ou commissaire aux comptes, un avocat et un ancien juge du tribunal de commerce (parfois un conseiller CCI ou CMA)</li>
          <li>Diagnostic de votre situation, orientation vers les bons interlocuteurs</li>
          <li>Aucun engagement, aucun coût ; entretien confidentiel et anonyme (vos nom et coordonnées ne sont pas enregistrés)</li>
        </ul>
      </div>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Rechercher par ville, département ou région…"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white/60 px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-bleu/50 focus:outline-none focus:ring-1 focus:ring-bleu/30"
          aria-label="Rechercher un CIP"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => setRegionFiltre(null)}
          className={regionFiltre === null
            ? 'pastille text-[10px] bg-bleu-fonce/15 text-bleu-fonce'
            : 'pastille text-[10px] bg-navy/5 text-navy/60 hover:bg-navy/10'}
        >
          Toutes ({CIP_PRINCIPAUX.length})
        </button>
        {REGIONS.map(r => {
          const count = CIP_PRINCIPAUX.filter(c => c.region === r).length;
          if (count === 0) return null;
          return (
            <button
              key={r}
              onClick={() => setRegionFiltre(regionFiltre === r ? null : r)}
              className={regionFiltre === r
                ? 'pastille text-[10px] bg-bleu-fonce/15 text-bleu-fonce'
                : 'pastille text-[10px] bg-navy/5 text-navy/60 hover:bg-navy/10'}
            >
              {r} ({count})
            </button>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-navy/55">
        {cipFiltres.length} antenne{cipFiltres.length > 1 ? 's' : ''} sur {CIP_PRINCIPAUX.length} répertoriées
      </p>

      {REGIONS.filter(r => parRegion.has(r)).map(region => (
        <div key={region} className="mt-6">
          <h2 className="font-display text-lg text-navy">{region}</h2>
          <div className="mt-3 space-y-3">
            {parRegion.get(region)!.map((c, i) => (
              <div key={i} className="glass-soft rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base text-navy">{c.contact}</p>
                    <p className="mt-1 text-sm text-navy/70">
                      <strong>{c.ville}</strong> · région {c.region}
                    </p>
                  </div>
                  <span className="pastille shrink-0 text-[10px]">{c.permanenceFrequence}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {cipFiltres.length === 0 && (
        <p className="mt-8 text-center text-sm text-navy/50">
          Aucun résultat pour cette recherche. Essayez le site officiel ci-dessous.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-jaune/30 bg-jaune/5 p-5 text-sm text-navy/80">
        <p className="font-display text-base text-navy">
          Pour trouver l&apos;antenne CIP la plus proche
        </p>
        <p className="mt-2">
          Consultez la carte officielle et prenez RDV auprès du CIP de
          votre choix. Les CIP sont le plus souvent hébergés par une CCI,
          l&apos;ordre des experts-comptables, une maison des avocats ou une
          CMA.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="https://www.cip-national.fr"
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white hover:bg-navy"
          >
            <span aria-hidden>🌐</span> cip-national.fr — toutes les antennes
          </a>
          <a
            href="tel:0186216684"
            className="inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-bleu-fonce hover:bg-white"
          >
            <span aria-hidden>☎</span> 01 86 21 66 84
          </a>
        </div>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : Centre d&apos;Information sur la Prévention des
        difficultés des entreprises (CIP National), cip-national.fr :
        carte des CIP territoriaux et page « Les Entretiens du jeudi ».
        Confirmez l&apos;adresse et les modalités de rendez-vous auprès
        du CIP choisi.
      </p>
    </section>
  );
}
