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
  'Corse',
];

// Source : cip-national.fr — extraits indicatifs au 2025
// Environ 60 CIP territoriaux : la liste complète et à jour est sur cip-national.fr
const CIP_PRINCIPAUX: CIP[] = [
  // — Île-de-France —
  { region: 'Île-de-France', ville: 'Paris', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Paris (TC Paris)' },
  { region: 'Île-de-France', ville: 'Nanterre', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Hauts-de-Seine' },
  { region: 'Île-de-France', ville: 'Bobigny', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Seine-Saint-Denis' },
  { region: 'Île-de-France', ville: 'Créteil', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Val-de-Marne' },
  { region: 'Île-de-France', ville: 'Évry', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Essonne' },
  { region: 'Île-de-France', ville: 'Versailles', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Yvelines' },
  { region: 'Île-de-France', ville: 'Pontoise', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Val-d\'Oise' },
  // — Auvergne-Rhône-Alpes —
  { region: 'Auvergne-Rhône-Alpes', ville: 'Lyon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Rhône' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Grenoble', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Isère' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Saint-Étienne', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Loire' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Clermont-Ferrand', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Puy-de-Dôme' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Chambéry', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Savoie' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Annecy', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Haute-Savoie' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Valence', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Drôme' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Bourg-en-Bresse', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Ain' },
  // — Provence-Alpes-Côte d'Azur —
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Marseille', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Bouches-du-Rhône' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Nice', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Alpes-Maritimes' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Aix-en-Provence', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Aix-en-Provence' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Toulon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Var' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Avignon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Vaucluse' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Draguignan', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Draguignan' },
  // — Occitanie —
  { region: 'Occitanie', ville: 'Toulouse', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Haute-Garonne' },
  { region: 'Occitanie', ville: 'Montpellier', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Hérault' },
  { region: 'Occitanie', ville: 'Nîmes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Gard' },
  { region: 'Occitanie', ville: 'Perpignan', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Pyrénées-Orientales' },
  { region: 'Occitanie', ville: 'Albi', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Tarn' },
  { region: 'Occitanie', ville: 'Tarbes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Hautes-Pyrénées' },
  { region: 'Occitanie', ville: 'Montauban', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Tarn-et-Garonne' },
  // — Nouvelle-Aquitaine —
  { region: 'Nouvelle-Aquitaine', ville: 'Bordeaux', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Gironde' },
  { region: 'Nouvelle-Aquitaine', ville: 'Limoges', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Haute-Vienne' },
  { region: 'Nouvelle-Aquitaine', ville: 'Poitiers', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Vienne' },
  { region: 'Nouvelle-Aquitaine', ville: 'La Rochelle', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Charente-Maritime' },
  { region: 'Nouvelle-Aquitaine', ville: 'Angoulême', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Charente' },
  { region: 'Nouvelle-Aquitaine', ville: 'Pau', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Pyrénées-Atlantiques' },
  { region: 'Nouvelle-Aquitaine', ville: 'Bayonne', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Pays basque' },
  // — Pays de la Loire —
  { region: 'Pays de la Loire', ville: 'Nantes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Loire-Atlantique' },
  { region: 'Pays de la Loire', ville: 'Angers', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Maine-et-Loire' },
  { region: 'Pays de la Loire', ville: 'Le Mans', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Sarthe' },
  { region: 'Pays de la Loire', ville: 'La Roche-sur-Yon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Vendée' },
  // — Bretagne —
  { region: 'Bretagne', ville: 'Rennes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Ille-et-Vilaine' },
  { region: 'Bretagne', ville: 'Brest', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Finistère' },
  { region: 'Bretagne', ville: 'Vannes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Morbihan' },
  { region: 'Bretagne', ville: 'Saint-Brieuc', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Côtes-d\'Armor' },
  // — Hauts-de-France —
  { region: 'Hauts-de-France', ville: 'Lille', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Nord' },
  { region: 'Hauts-de-France', ville: 'Valenciennes', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Valenciennois' },
  { region: 'Hauts-de-France', ville: 'Amiens', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Somme' },
  { region: 'Hauts-de-France', ville: 'Beauvais', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Oise' },
  { region: 'Hauts-de-France', ville: 'Dunkerque', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Dunkerquois' },
  // — Grand Est —
  { region: 'Grand Est', ville: 'Strasbourg', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Bas-Rhin' },
  { region: 'Grand Est', ville: 'Nancy', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Meurthe-et-Moselle' },
  { region: 'Grand Est', ville: 'Metz', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Moselle' },
  { region: 'Grand Est', ville: 'Reims', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Marne' },
  { region: 'Grand Est', ville: 'Mulhouse', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Haut-Rhin' },
  // — Bourgogne-Franche-Comté —
  { region: 'Bourgogne-Franche-Comté', ville: 'Dijon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Côte-d\'Or' },
  { region: 'Bourgogne-Franche-Comté', ville: 'Besançon', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Doubs' },
  { region: 'Bourgogne-Franche-Comté', ville: 'Chalon-sur-Saône', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Saône-et-Loire' },
  // — Centre-Val de Loire —
  { region: 'Centre-Val de Loire', ville: 'Tours', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Indre-et-Loire' },
  { region: 'Centre-Val de Loire', ville: 'Orléans', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Loiret' },
  { region: 'Centre-Val de Loire', ville: 'Bourges', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Cher' },
  // — Normandie —
  { region: 'Normandie', ville: 'Rouen', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Seine-Maritime' },
  { region: 'Normandie', ville: 'Caen', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Calvados' },
  { region: 'Normandie', ville: 'Le Havre', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Le Havre' },
  { region: 'Normandie', ville: 'Évreux', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Eure' },
  // — Corse —
  { region: 'Corse', ville: 'Ajaccio', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Corse-du-Sud' },
  { region: 'Corse', ville: 'Bastia', permanenceFrequence: 'sur rendez-vous', contact: 'CIP Haute-Corse' },
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
        Le CIP est un dispositif national d&apos;<strong>accompagnement
        gratuit, confidentiel et sans rendez-vous</strong> pour les chefs
        d&apos;entreprise en difficulté. Les permanences sont assurées par
        des bénévoles : anciens chefs d&apos;entreprise, avocats,
        experts-comptables et juges consulaires honoraires.
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
          <li>Une équipe de bénévoles vous reçoit (en général un expert-comptable, un avocat et un ancien juge du tribunal de commerce)</li>
          <li>Diagnostic de votre situation, orientation vers les bons interlocuteurs</li>
          <li>Aucun engagement, aucun coût, secret professionnel des intervenants</li>
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
          Consultez l&apos;annuaire officiel et prenez RDV en ligne ou
          par téléphone. Les permanences se tiennent en général au
          tribunal de commerce, à la CCI ou la CMA de votre ville.
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
        difficultés des entreprises (CIP National). Cadre :
        association loi 1901 reconnue d&apos;intérêt général,
        partenaire du ministère de la Justice et du ministère de
        l&apos;Économie. Les fréquences de permanence sont indicatives :
        confirmez les horaires sur cip-national.fr.
      </p>
    </section>
  );
}
