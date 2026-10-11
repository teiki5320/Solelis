import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  alternates: { canonical: '/annuaires/ags' },
  title: 'Centres AGS (CGEA) — Solelis',
  description:
    'Les 15 centres de gestion et d\'études AGS (CGEA) — garantie des salaires — avec adresses, téléphones et départements couverts.',
};

interface Delegation {
  region: string;
  ville: string;
  adresse: string;
  telephone: string;
  ressort: string;
}

// Source : ags-garantie-salaires.org, rubrique « Notre implantation territoriale »
// (fiche de chaque CGEA, consultée en octobre 2026) — 15 centres, dont 2 outre-mer.
// Le centre compétent est celui du tribunal qui a ouvert la procédure collective
// (et non le domicile du salarié). Les centres ne reçoivent pas de public.
const DELEGATIONS: Delegation[] = [
  {
    region: 'CGEA Île-de-France Ouest',
    ville: 'Levallois-Perret (Île-de-France Ouest)',
    adresse: '164-174 rue Victor Hugo, 92300 Levallois-Perret',
    telephone: '01 41 40 70 00',
    ressort: 'Paris (75), Hauts-de-Seine (92)',
  },
  {
    region: 'CGEA Île-de-France Est',
    ville: 'Levallois-Perret (Île-de-France Est)',
    adresse: '164-174 rue Victor Hugo, 92300 Levallois-Perret',
    telephone: '01 41 40 70 30',
    ressort: 'Essonne (91), Seine-Saint-Denis (93), Val-de-Marne (94)',
  },
  {
    region: 'CGEA Amiens',
    ville: 'Amiens',
    adresse: '2 rue de l\'Étoile, 80094 Amiens Cedex 3',
    telephone: '03 22 50 35 30',
    ressort: 'Aisne (02), Ardennes (08), Aube (10), Marne (51), Haute-Marne (52), Oise (60), Pas-de-Calais (62), Somme (80)',
  },
  {
    region: 'CGEA Lille',
    ville: 'Lille',
    adresse: '50 rue Gustave Delory, CS 50004, 59023 Lille Cedex',
    telephone: '03 20 74 62 10',
    ressort: 'Nord (59)',
  },
  {
    region: 'CGEA Rouen',
    ville: 'Rouen',
    adresse: '73 rue Martainville, CS 11716, 76108 Rouen Cedex 1',
    telephone: '02 32 81 57 00',
    ressort: 'Calvados (14), Eure (27), Manche (50), Orne (61), Seine-Maritime (76), Val-d\'Oise (95)',
  },
  {
    region: 'CGEA Nancy',
    ville: 'Nancy',
    adresse: '96 rue Saint-Georges, CS 50510, 54008 Nancy Cedex',
    telephone: '03 83 95 52 50',
    ressort: 'Doubs (25), Jura (39), Meurthe-et-Moselle (54), Meuse (55), Moselle (57), Bas-Rhin (67), Haut-Rhin (68), Haute-Saône (70), Vosges (88), Territoire de Belfort (90)',
  },
  {
    region: 'CGEA Chalon-sur-Saône',
    ville: 'Chalon-sur-Saône',
    adresse: '6 allée de la Sucrerie, CS 40338, 71108 Chalon-sur-Saône',
    telephone: '03 85 46 98 30',
    ressort: 'Côte-d\'Or (21), Loire (42), Nièvre (58), Rhône (69), Saône-et-Loire (71), Seine-et-Marne (77), Yonne (89)',
  },
  {
    region: 'CGEA Orléans',
    ville: 'Orléans',
    adresse: '16 rue de la République, CS 15802, 45058 Orléans Cedex 1',
    telephone: '02 38 24 20 40',
    ressort: 'Allier (03), Cher (18), Eure-et-Loir (28), Indre (36), Indre-et-Loire (37), Loir-et-Cher (41), Loiret (45), Puy-de-Dôme (63), Yvelines (78)',
  },
  {
    region: 'CGEA Rennes',
    ville: 'Rennes',
    adresse: 'Immeuble Urban Quartz, bâtiment 1, 22 rue de l\'Alma, CS 96925, 35069 Rennes Cedex',
    telephone: '02 99 85 95 00',
    ressort: 'Côtes-d\'Armor (22), Finistère (29), Ille-et-Vilaine (35), Loire-Atlantique (44), Maine-et-Loire (49), Mayenne (53), Morbihan (56), Sarthe (72), Vendée (85)',
  },
  {
    region: 'CGEA Annecy',
    ville: 'Seynod (Annecy)',
    adresse: 'Acropole, BP 37, 86 avenue d\'Aix-les-Bains, 74602 Seynod Cedex',
    telephone: '04 50 69 80 20',
    ressort: 'Ain (01), Ardèche (07), Drôme (26), Isère (38), Haute-Loire (43), Savoie (73), Haute-Savoie (74)',
  },
  {
    region: 'CGEA Marseille',
    ville: 'Marseille',
    adresse: 'Les Docks Atrium 10.5, 10 place de la Joliette, BP 76514, 13567 Marseille Cedex',
    telephone: '04 96 11 66 20',
    ressort: 'Alpes-de-Haute-Provence (04), Hautes-Alpes (05), Alpes-Maritimes (06), Bouches-du-Rhône (13), Corse-du-Sud (2A), Haute-Corse (2B), Var (83), Vaucluse (84)',
  },
  {
    region: 'CGEA Toulouse',
    ville: 'Toulouse',
    adresse: '4 rue du Pont de Guilheméry, CS 81510, 31015 Toulouse Cedex 6',
    telephone: '05 62 73 76 00',
    ressort: 'Ariège (09), Aude (11), Aveyron (12), Cantal (15), Gard (30), Haute-Garonne (31), Gers (32), Hérault (34), Lot (46), Lozère (48), Hautes-Pyrénées (65), Pyrénées-Orientales (66), Tarn (81), Tarn-et-Garonne (82)',
  },
  {
    region: 'CGEA Bordeaux',
    ville: 'Bordeaux',
    adresse: 'Les Bureaux du Parc, avenue Jean-Gabriel Domergue, CS 82181, 33071 Bordeaux Cedex',
    telephone: '05 56 69 64 00',
    ressort: 'Charente (16), Charente-Maritime (17), Corrèze (19), Creuse (23), Dordogne (24), Gironde (33), Landes (40), Lot-et-Garonne (47), Pyrénées-Atlantiques (64), Deux-Sèvres (79), Vienne (86), Haute-Vienne (87)',
  },
  {
    region: 'CGEA Martinique',
    ville: 'Schœlcher',
    adresse: 'Résidence Kalysta, bâtiment A, rond-point Anse Gouraud, 97233 Schœlcher',
    telephone: '05 96 60 65 65',
    ressort: 'Guadeloupe, Guyane, Martinique, Saint-Pierre-et-Miquelon, Saint-Barthélemy, Saint-Martin',
  },
  {
    region: 'CGEA La Réunion',
    ville: 'Sainte-Clotilde',
    adresse: 'Centre d\'affaires Cadjee, bureau C 214, 62 boulevard du Chaudron, CS 41005, 97495 Sainte-Clotilde Cedex',
    telephone: '02 62 20 94 50',
    ressort: 'La Réunion (974), Mayotte (976)',
  },
];

export default function AgsPage() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-10">
      <Link href="/annuaires" className="mb-6 inline-flex items-center gap-2 text-sm text-navy/60 hover:text-navy">
        ← Tous les annuaires
      </Link>

      <h1 className="font-display text-3xl text-navy sm:text-4xl">
        AGS — centres de gestion (CGEA)
      </h1>
      <p className="mt-3 text-base text-navy/70">
        L&apos;<strong>AGS</strong> (Association pour la gestion du
        régime de Garantie des créances des Salariés) couvre les
        salaires, indemnités de licenciement, congés payés et autres
        créances salariales en cas de procédure collective de
        l&apos;employeur. Plafonds 2026 : 4, 5 ou 6 fois le plafond mensuel
        d&apos;assurance chômage (4 plafonds mensuels de la Sécurité sociale)
        selon la date de conclusion du contrat de travail, soit 64 080 € à 96 120 €.
        Le centre compétent est celui du tribunal qui a ouvert la procédure ;
        les centres ne reçoivent pas de public.
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
          <li>L&apos;AGS avance les sommes aux salarié·e·s, à la demande du mandataire ou de l&apos;administrateur judiciaire, puis en demande le remboursement sur l&apos;actif de la procédure. Depuis 2024, l&apos;AGS assure elle-même la gestion opérationnelle du régime (auparavant confiée à la Délégation Unédic AGS).</li>
          <li>Plafond 4 (16 PMSS) si le contrat a été conclu moins de 6 mois avant le jugement d&apos;ouverture : 64 080 €.</li>
          <li>Plafond 5 (20 PMSS) si le contrat a été conclu entre 6 mois et 2 ans avant : 80 100 €.</li>
          <li>Plafond 6 (24 PMSS) si le contrat a été conclu au moins 2 ans avant : 96 120 €.</li>
          <li>L&apos;AGS garantit, dans la limite du plafond, les sommes dues à la date du jugement d&apos;ouverture d&apos;un redressement ou d&apos;une liquidation judiciaire et, sous conditions, les indemnités des ruptures intervenues pendant la procédure (C. trav. L3253-8).</li>
        </ul>
      </div>

      <p className="mt-6 text-xs text-navy/50">
        Source : ags-garantie-salaires.org (rubrique « Notre implantation
        territoriale », fiches des CGEA). Cadre légal : C. trav. art.
        L3253-6 à L3253-21 et D3253-5 ; PMSS 2026 : 4 005 €.
      </p>
    </section>
  );
}
