import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/annuaires/ags' },
  title: 'Délégations régionales AGS — Solelis',
  description:
    'Liste des 13 délégations régionales AGS (garantie des salaires) avec adresses et téléphones. Trouvez votre CGEA.',
};

interface Delegation {
  region: string;
  ville: string;
  adresse: string;
  telephone: string;
  ressort: string;
}

// Source : ags-garantie-salaires.org/contacts (au 2025)
// 13 délégations (CGEA — Centre de Gestion et d'Études AGS)
const DELEGATIONS: Delegation[] = [
  {
    region: 'Île-de-France Ouest',
    ville: 'Rouen',
    adresse: '11 avenue Pasteur, 76000 Rouen',
    telephone: '02 32 19 96 50',
    ressort: 'Eure (27), Seine-Maritime (76), Yvelines (78)',
  },
  {
    region: 'Île-de-France Est',
    ville: 'Bobigny',
    adresse: '38 boulevard Lénine, 93000 Bobigny',
    telephone: '01 41 60 84 41',
    ressort: 'Seine-Saint-Denis (93), Val-d\'Oise (95), Seine-et-Marne (77)',
  },
  {
    region: 'Île-de-France Centre',
    ville: 'Paris',
    adresse: '11 rue Clovis, 75005 Paris',
    telephone: '01 55 43 54 00',
    ressort: 'Paris (75), Hauts-de-Seine (92), Val-de-Marne (94), Essonne (91)',
  },
  {
    region: 'Nord-Pas-de-Calais / Picardie',
    ville: 'Amiens',
    adresse: '20 rue de Beauvais, 80000 Amiens',
    telephone: '03 22 22 41 50',
    ressort: 'Aisne (02), Nord (59), Oise (60), Pas-de-Calais (62), Somme (80)',
  },
  {
    region: 'Champagne-Ardenne / Lorraine / Alsace',
    ville: 'Nancy',
    adresse: '6 avenue Foch, 54000 Nancy',
    telephone: '03 83 17 41 50',
    ressort: 'Ardennes (08), Aube (10), Marne (51), Haute-Marne (52), Meurthe-et-Moselle (54), Meuse (55), Moselle (57), Bas-Rhin (67), Haut-Rhin (68), Vosges (88)',
  },
  {
    region: 'Bourgogne / Franche-Comté',
    ville: 'Dijon',
    adresse: '5 rue Auguste-Comte, 21000 Dijon',
    telephone: '03 80 53 39 00',
    ressort: 'Côte-d\'Or (21), Doubs (25), Jura (39), Nièvre (58), Haute-Saône (70), Saône-et-Loire (71), Yonne (89), Territoire de Belfort (90)',
  },
  {
    region: 'Centre / Pays de la Loire',
    ville: 'Orléans',
    adresse: '32 rue du Faubourg-Madeleine, 45000 Orléans',
    telephone: '02 38 79 40 00',
    ressort: 'Cher (18), Eure-et-Loir (28), Indre (36), Indre-et-Loire (37), Loir-et-Cher (41), Loiret (45), Loire-Atlantique (44), Maine-et-Loire (49), Mayenne (53), Sarthe (72), Vendée (85)',
  },
  {
    region: 'Bretagne / Basse-Normandie',
    ville: 'Rennes',
    adresse: '38 boulevard de Beaumont, 35000 Rennes',
    telephone: '02 99 30 76 00',
    ressort: 'Calvados (14), Manche (50), Orne (61), Côtes-d\'Armor (22), Finistère (29), Ille-et-Vilaine (35), Morbihan (56)',
  },
  {
    region: 'Auvergne / Rhône-Alpes',
    ville: 'Chassieu',
    adresse: '9 avenue de la Gare, 69680 Chassieu',
    telephone: '04 72 23 35 00',
    ressort: 'Ain (01), Allier (03), Ardèche (07), Cantal (15), Drôme (26), Isère (38), Loire (42), Haute-Loire (43), Puy-de-Dôme (63), Rhône (69), Savoie (73), Haute-Savoie (74)',
  },
  {
    region: 'Sud-Est',
    ville: 'Marseille',
    adresse: '64 avenue Cantini, 13008 Marseille',
    telephone: '04 91 80 41 00',
    ressort: 'Alpes-de-Haute-Provence (04), Hautes-Alpes (05), Alpes-Maritimes (06), Bouches-du-Rhône (13), Var (83), Vaucluse (84), Corse (2A, 2B)',
  },
  {
    region: 'Languedoc / Roussillon / Midi-Pyrénées',
    ville: 'Toulouse',
    adresse: '11 boulevard de la Gare, 31500 Toulouse',
    telephone: '05 62 73 75 00',
    ressort: 'Ariège (09), Aude (11), Aveyron (12), Gard (30), Haute-Garonne (31), Gers (32), Hérault (34), Lot (46), Lozère (48), Hautes-Pyrénées (65), Pyrénées-Orientales (66), Tarn (81), Tarn-et-Garonne (82)',
  },
  {
    region: 'Aquitaine / Limousin / Poitou-Charentes',
    ville: 'Bordeaux',
    adresse: '74 rue Georges-Bonnac, 33000 Bordeaux',
    telephone: '05 56 99 21 90',
    ressort: 'Charente (16), Charente-Maritime (17), Corrèze (19), Creuse (23), Dordogne (24), Gironde (33), Landes (40), Lot-et-Garonne (47), Pyrénées-Atlantiques (64), Deux-Sèvres (79), Vienne (86), Haute-Vienne (87)',
  },
  {
    region: 'Outre-mer',
    ville: 'Paris (siège)',
    adresse: '11 rue Clovis, 75005 Paris',
    telephone: '01 55 43 54 00',
    ressort: 'Guadeloupe (971), Martinique (972), Guyane (973), La Réunion (974), Mayotte (976)',
  },
];

export default function AgsPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        AGS — délégations régionales
      </h1>
      <p className="mt-3 text-base text-navy/70">
        L&apos;<strong>AGS</strong> (Association pour la gestion du
        régime de Garantie des créances des Salariés) couvre les
        salaires, indemnités de licenciement, congés payés et autres
        créances salariales en cas de procédure collective de
        l&apos;employeur. Plafonds 2026 : 4, 5 ou 6 fois le plafond mensuel
        d&apos;assurance chômage (4 plafonds mensuels de la Sécurité sociale)
        selon l&apos;ancienneté du contrat de travail, soit 64 080 € à 96 120 €.
      </p>

      <div className="mt-8 space-y-3">
        {DELEGATIONS.map((d) => (
          <div key={d.ville} className="glass-soft rounded-2xl p-5">
            <p className="font-display text-lg text-navy">{d.region}</p>
            <p className="mt-1 text-sm text-navy/70">
              <strong>{d.ville}</strong> — {d.adresse}
            </p>
            <a
              href={`tel:${d.telephone.replace(/\s/g, '')}`}
              className="mt-2 inline-flex rounded-full bg-white/80 px-3 py-1 text-sm text-bleu-fonce hover:bg-white"
            >
              <span aria-hidden>☎</span> {d.telephone}
            </a>
            <p className="mt-3 text-[11px] text-navy/55">
              <strong>Ressort :</strong> {d.ressort}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-navy/10 bg-white/60 p-5 text-sm text-navy/75">
        <p className="font-display text-base text-navy">À savoir</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li>Les fonds AGS sont avancés par l&apos;UNEDIC et récupérés sur l&apos;actif de la procédure.</li>
          <li>Plafond 4 (16 PMSS) si le contrat a été conclu moins de 6 mois avant le jugement : 64 080 €.</li>
          <li>Plafond 5 (20 PMSS) si le contrat a été conclu entre 6 mois et 2 ans avant : 80 100 €.</li>
          <li>Plafond 6 (24 PMSS) si le contrat a au moins 2 ans : 96 120 €.</li>
          <li>L&apos;AGS garantit les sommes dues à la date du jugement, dans la limite du plafond ; elle ne couvre pas les indemnités transactionnelles.</li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : ags-garantie-salaires.org (annuaire officiel des CGEA).
        Cadre légal : C. trav. art. L3253-6 à L3253-21 et D3253-5 ; PMSS 2026 : 4 005 €.
      </p>
    </section>
  );
}
