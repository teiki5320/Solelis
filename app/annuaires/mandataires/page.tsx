'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

interface Etude {
  region: string;
  ville: string;
  nom: string;
  type: 'mandataire' | 'administrateur';
  telephone?: string;
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
  'Normandie',
  'Centre-Val de Loire',
];

// Source : annuaire du CNAJMJ (www.cnajmj.fr/annuaire), rubrique « Implantations »
// de la fiche de chaque professionnel, consultée en octobre 2026. Sélection indicative.
const ETUDES: Etude[] = [
  // — Île-de-France —
  { region: 'Île-de-France', ville: 'Paris (75)', nom: 'SELARL AJAssociés', type: 'administrateur', telephone: '01 53 64 92 92' },
  { region: 'Île-de-France', ville: 'Neuilly-sur-Seine (92)', nom: 'SCP BTSG²', type: 'mandataire', telephone: '01 41 96 82 82' },
  { region: 'Île-de-France', ville: 'Paris (75)', nom: 'SELAFA MJA', type: 'mandataire', telephone: '01 44 24 65 65' },
  { region: 'Île-de-France', ville: 'Paris (75)', nom: 'SELAS AJ UP (Paris)', type: 'administrateur', telephone: '01 89 16 35 30' },
  { region: 'Île-de-France', ville: 'Neuilly-sur-Seine (92)', nom: 'SELARL FHBX', type: 'administrateur', telephone: '01 40 97 05 41' },
  { region: 'Île-de-France', ville: 'Bobigny (93)', nom: 'SELAS MJS Partners (Bobigny)', type: 'mandataire', telephone: '01 48 32 45 45' },
  { region: 'Île-de-France', ville: 'Bobigny (93)', nom: 'SELARL BVMJ', type: 'mandataire', telephone: '01 41 50 93 15' },
  { region: 'Île-de-France', ville: 'Évry-Courcouronnes (91)', nom: 'SELARL FHBX (Évry)', type: 'administrateur' },
  // — Auvergne-Rhône-Alpes —
  { region: 'Auvergne-Rhône-Alpes', ville: 'Lyon (69)', nom: 'SELAS AJ UP (Lyon)', type: 'administrateur', telephone: '04 78 29 20 04' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Lyon (69)', nom: 'SCP BTSG² (Lyon)', type: 'mandataire' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Lyon (69)', nom: 'SELARL FHBX (Lyon)', type: 'administrateur' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Grenoble (38)', nom: 'SELAS AJ UP (Grenoble)', type: 'administrateur', telephone: '04 76 44 16 55' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Saint-Étienne (42)', nom: 'SELAS AJ UP (Saint-Étienne)', type: 'administrateur', telephone: '04 77 38 74 40' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Clermont-Ferrand (63)', nom: 'SELAS AJ UP (Clermont-Ferrand)', type: 'administrateur', telephone: '04 73 40 30 20' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Chambéry (73)', nom: 'SELAS AJ UP (Chambéry)', type: 'administrateur' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Bourg-en-Bresse (01)', nom: 'SELAS AJ UP (Bourg-en-Bresse)', type: 'administrateur' },
  { region: 'Auvergne-Rhône-Alpes', ville: 'Roanne (42)', nom: 'SELAS AJ UP (Roanne)', type: 'administrateur', telephone: '04 77 71 50 89' },
  // — Provence-Alpes-Côte d'Azur —
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Nice (06)', nom: 'SELARL Pellier – Les Mandataires', type: 'mandataire', telephone: '04 22 13 60 50' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Cannes (06)', nom: 'SCP BTSG² (Cannes)', type: 'mandataire', telephone: '04 93 85 89 72' },
  { region: 'Provence-Alpes-Côte d\'Azur', ville: 'Toulon (83)', nom: 'SCP BR Associés', type: 'mandataire', telephone: '04 94 89 96 79' },
  // — Occitanie —
  { region: 'Occitanie', ville: 'Montpellier (34)', nom: 'SELARL FHBX (Montpellier)', type: 'administrateur' },
  { region: 'Occitanie', ville: 'Perpignan (66)', nom: 'SELARL FHBX (Perpignan)', type: 'administrateur' },
  // — Nouvelle-Aquitaine —
  { region: 'Nouvelle-Aquitaine', ville: 'Bordeaux (33)', nom: 'SCP Silvestri-Baujet', type: 'mandataire', telephone: '05 56 48 85 85' },
  { region: 'Nouvelle-Aquitaine', ville: 'Libourne (33)', nom: 'SELARL Louis et Laurent Hirou', type: 'mandataire', telephone: '05 57 74 05 50' },
  { region: 'Nouvelle-Aquitaine', ville: 'Bordeaux (33)', nom: 'SELARL FHBX (Bordeaux)', type: 'administrateur' },
  { region: 'Nouvelle-Aquitaine', ville: 'Limoges (87)', nom: 'SCP BTSG² (Limoges)', type: 'mandataire', telephone: '09 70 64 00 30' },
  { region: 'Nouvelle-Aquitaine', ville: 'Brive-la-Gaillarde (19)', nom: 'SCP BTSG² (Brive)', type: 'mandataire', telephone: '09 70 64 00 31' },
  { region: 'Nouvelle-Aquitaine', ville: 'Pau (64)', nom: 'SELARL FHBX (Pau)', type: 'administrateur' },
  { region: 'Nouvelle-Aquitaine', ville: 'Bayonne (64)', nom: 'SELARL FHBX (Bayonne)', type: 'administrateur' },
  { region: 'Nouvelle-Aquitaine', ville: 'Poitiers (86)', nom: 'SELAS AJ UP (Poitiers)', type: 'administrateur' },
  { region: 'Nouvelle-Aquitaine', ville: 'Niort (79)', nom: 'SELAS AJ UP (Niort)', type: 'administrateur', telephone: '02 40 20 11 18' },
  // — Pays de la Loire —
  { region: 'Pays de la Loire', ville: 'Nantes (44)', nom: 'SELAS AJ UP (Nantes)', type: 'administrateur', telephone: '02 40 20 11 18' },
  { region: 'Pays de la Loire', ville: 'Angers (49)', nom: 'SELAS AJ UP (Angers)', type: 'administrateur', telephone: '02 41 18 09 25' },
  { region: 'Pays de la Loire', ville: 'Le Mans (72)', nom: 'SELARL SBCMJ', type: 'mandataire' },
  // — Bretagne —
  { region: 'Bretagne', ville: 'Rennes (35)', nom: '2M & Associés', type: 'administrateur' },
  // — Hauts-de-France —
  { region: 'Hauts-de-France', ville: 'Roubaix (59)', nom: 'SELAS MJS Partners (siège)', type: 'mandataire', telephone: '03 20 06 19 22' },
  { region: 'Hauts-de-France', ville: 'Valenciennes (59)', nom: 'SELAS MJS Partners (Valenciennes)', type: 'mandataire' },
  { region: 'Hauts-de-France', ville: 'Amiens (80)', nom: 'SELAS MJS Partners (Amiens)', type: 'mandataire' },
  { region: 'Hauts-de-France', ville: 'Arras (62)', nom: 'SELAS MJS Partners (Arras)', type: 'mandataire' },
  { region: 'Hauts-de-France', ville: 'Boulogne-sur-Mer (62)', nom: 'SELARL FHBX (Boulogne-sur-Mer)', type: 'administrateur' },
  // — Grand Est —
  { region: 'Grand Est', ville: 'Reims (51)', nom: 'SELARL Bruno Raulet', type: 'mandataire' },
  { region: 'Grand Est', ville: 'Metz (57)', nom: 'SELARL MJ AIR', type: 'mandataire' },
  { region: 'Grand Est', ville: 'Nancy (54)', nom: 'Étude Bogelmann', type: 'mandataire' },
  // — Bourgogne-Franche-Comté —
  { region: 'Bourgogne-Franche-Comté', ville: 'Chalon-sur-Saône (71)', nom: 'SCP BTSG² (Chalon)', type: 'mandataire', telephone: '03 85 48 86 91' },
  // — Normandie —
  { region: 'Normandie', ville: 'Caen (14)', nom: 'Étude Lize', type: 'mandataire' },
  { region: 'Normandie', ville: 'Le Havre (76)', nom: 'SELARL FHBX (Le Havre)', type: 'administrateur' },
  // — Centre-Val de Loire —
  { region: 'Centre-Val de Loire', ville: 'Tours (37)', nom: 'SELARL AJAssociés (Tours)', type: 'administrateur', telephone: '02 47 20 47 50' },
];

export default function MandatairesPage() {
  const [recherche, setRecherche] = useState('');
  const [regionFiltre, setRegionFiltre] = useState<string | null>(null);

  const etudesFiltrees = useMemo(() => {
    const q = recherche.toLowerCase();
    return ETUDES.filter(e => {
      if (regionFiltre && e.region !== regionFiltre) return false;
      if (q && !e.nom.toLowerCase().includes(q) && !e.ville.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [recherche, regionFiltre]);

  const parRegion = useMemo(() => {
    const map = new Map<string, Etude[]>();
    for (const e of etudesFiltrees) {
      const list = map.get(e.region) || [];
      list.push(e);
      map.set(e.region, list);
    }
    return map;
  }, [etudesFiltrees]);

  return (
    <section className="mx-auto max-w-3xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        Mandataires et administrateurs judiciaires
      </h1>
      <p className="mt-3 text-base text-navy/70">
        Les <strong>administrateurs judiciaires</strong> (AJ) et{' '}
        <strong>mandataires judiciaires</strong> (MJ) sont nommés par le
        tribunal lors d&apos;une procédure collective. Ci-dessous, une{' '}
        <strong>sélection indicative</strong> d&apos;études (elle ne couvre
        pas tous les départements) ; l&apos;annuaire officiel complet est
        tenu par le Conseil national (CNAJMJ) :{' '}
        <a href="https://www.cnajmj.fr/annuaire/" target="_blank" rel="noreferrer" className="text-bleu-fonce underline">www.cnajmj.fr/annuaire</a>.
      </p>

      <div className="mt-6 rounded-2xl border border-bleu/30 bg-bleu/5 p-5 text-sm text-navy">
        <p className="font-display text-base text-bleu-fonce">
          Comment se déroule la nomination
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>
            Vous pouvez <strong>proposer</strong> au tribunal le nom d&apos;un administrateur judiciaire (C. com. L621-4) ; ce n&apos;est qu&apos;une proposition.
          </li>
          <li>
            C&apos;est le tribunal qui désigne le mandataire judiciaire et, le cas échéant, l&apos;administrateur judiciaire ; il n&apos;est pas tenu de suivre votre proposition.
          </li>
          <li>
            Avant toute procédure, vous pouvez contacter une étude pour un premier échange : demandez à l&apos;avance s&apos;il est facturé.
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Rechercher par ville ou nom d'étude…"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="w-full rounded-xl border border-navy/15 bg-white/60 px-4 py-2.5 text-sm text-navy placeholder:text-navy/40 focus:border-bleu/50 focus:outline-none focus:ring-1 focus:ring-bleu/30"
          aria-label="Rechercher un professionnel"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <button
          onClick={() => setRegionFiltre(null)}
          className={regionFiltre === null
            ? 'pastille text-[10px] bg-bleu-fonce/15 text-bleu-fonce'
            : 'pastille text-[10px] bg-navy/5 text-navy/60 hover:bg-navy/10'}
        >
          Toutes ({ETUDES.length})
        </button>
        {REGIONS.map(r => {
          const count = ETUDES.filter(e => e.region === r).length;
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
        {etudesFiltrees.length} résultat{etudesFiltrees.length > 1 ? 's' : ''} sur {ETUDES.length} études répertoriées
      </p>

      {REGIONS.filter(r => parRegion.has(r)).map(region => (
        <div key={region} className="mt-6">
          <h2 className="font-display text-lg text-navy">{region}</h2>
          <div className="mt-3 space-y-3">
            {parRegion.get(region)!.map((e, i) => (
              <div key={i} className="glass-soft rounded-2xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base text-navy">{e.nom}</p>
                    <p className="mt-1 text-sm text-navy/70">{e.ville}</p>
                    <span
                      className={
                        e.type === 'administrateur'
                          ? 'pastille mt-2 text-[10px] bg-bleu/15 text-bleu-fonce'
                          : 'pastille mt-2 text-[10px] bg-vert/15 text-vert'
                      }
                    >
                      {e.type === 'administrateur' ? 'Administrateur judiciaire' : 'Mandataire judiciaire'}
                    </span>
                  </div>
                  {e.telephone && (
                    <a
                      href={`tel:${e.telephone.replace(/\s/g, '')}`}
                      className="shrink-0 rounded-full bg-white/80 px-3 py-1 text-sm text-bleu-fonce hover:bg-white"
                    >
                      <span aria-hidden>☎</span> {e.telephone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {etudesFiltrees.length === 0 && (
        <p className="mt-8 text-center text-sm text-navy/50">
          Aucun résultat pour cette recherche. Essayez l&apos;annuaire officiel ci-dessous.
        </p>
      )}

      <div className="mt-8 rounded-2xl border border-jaune/30 bg-jaune/5 p-5 text-sm text-navy/80">
        <p className="font-display text-base text-navy">
          Annuaire officiel complet
        </p>
        <p className="mt-2">
          Cette liste est une <strong>sélection indicative</strong> et non
          exhaustive. Pour rechercher par ressort géographique :
        </p>
        <a
          href="https://www.cnajmj.fr/annuaire/"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex rounded-full bg-bleu-fonce px-4 py-2 text-sm font-medium text-white hover:bg-navy"
        >
          <span aria-hidden>🌐</span> cnajmj.fr — annuaire officiel
        </a>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : annuaire du Conseil National des Administrateurs
        Judiciaires et Mandataires Judiciaires (CNAJMJ), fiches des
        professionnels (implantations et téléphones). Cadre légal :
        C. com., livre VIII, titre Ier (art. L811-1 et suivants).
      </p>
    </section>
  );
}
