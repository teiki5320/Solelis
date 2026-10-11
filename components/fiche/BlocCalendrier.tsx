'use client';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import { libelleChambre } from '@/lib/secteur';
import { contactCotisations } from '@/lib/organismes';
import { estEnCessation } from '@/lib/strategie';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

interface Jalon {
  delai: string;
  date: string;
  texte: string;
  urgence?: 'rouge' | 'jaune' | 'vert';
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

export function buildJalons(r: Reponses, c: CompanyData, s: SectorInfo): Jalon[] {
  const jalons: Jalon[] = [];
  const now = new Date();
  const dep = c.departement || '';

  if (r.moral === 'epuise' || r.moral === 'perdu') {
    jalons.push({
      delai: 'Dès aujourd\'hui',
      date: formatDate(now),
      texte: 'Appeler le numéro vert de soutien psychologique 0 805 65 50 50 (APESA) — gratuit et confidentiel',
      urgence: 'vert',
    });
  }
  if (r.situation === 'assignation') {
    jalons.push({
      delai: 'Urgent',
      date: formatDate(now),
      texte: 'Consulter un avocat immédiatement — les délais sont courts',
      urgence: 'rouge',
    });
  }
  if (r.probleme === 'urssaf') {
    jalons.push({
      delai: 'Avant le ' + formatDate(addDays(7)),
      date: formatDate(addDays(7)),
      texte: `Contacter ${contactCotisations(s, r.effectif, dep).libelle} pour demander un échelonnement`,
      urgence: 'jaune',
    });
  }
  if (r.probleme === 'impots') {
    jalons.push({
      delai: 'Avant le ' + formatDate(addDays(7)),
      date: formatDate(addDays(7)),
      texte: 'Contacter votre service des impôts des entreprises (SIE), par la messagerie de votre espace professionnel impots.gouv.fr, pour demander un délai',
      urgence: 'jaune',
    });
  }

  jalons.push({
    delai: 'Aujourd\'hui',
    date: formatDate(now),
    texte: `Contacter ${libelleChambre(s, c)} — accompagnement gratuit et confidentiel`,
  });
  jalons.push({
    delai: 'Avant le ' + formatDate(addDays(15)),
    date: formatDate(addDays(15)),
    texte: 'Faire le point avec votre expert-comptable',
  });
  jalons.push({
    delai: 'Avant le ' + formatDate(addDays(30)),
    date: formatDate(addDays(30)),
    texte: "Consulter un avocat (droit des entreprises en difficulté) si la situation n'a pas évolué",
  });
  // Le délai de 45 jours court à partir de la cessation des paiements
  // (art. L631-4 C. com.), pas d'aujourd'hui : pas de date calculée.
  if (estEnCessation(r)) {
    jalons.push({
      delai: '45 jours max',
      date: '',
      texte: 'Déclarer la cessation des paiements au tribunal dans les 45 jours suivant la date de cessation des paiements (sauf conciliation demandée dans ce délai) — le décompte exact se fait dans le bloc « Décompte légal des 45 jours »',
      urgence: 'rouge',
    });
  }

  return jalons;
}

const PUCE: Record<NonNullable<Jalon['urgence']>, string> = {
  rouge: 'border-rouge/40 bg-rouge/5 text-rouge',
  jaune: 'border-jaune/40 bg-jaune/5 text-jaune',
  vert: 'border-vert/40 bg-vert/5 text-vert',
};

export default function BlocCalendrier() {
  const { reponses, company, sector } = useFiche();
  const jalons = buildJalons(reponses, company, sector);
  return (
    <BlocAccordeon
      icone="📅"
      titre={`Calendrier d'urgence${company.nom !== 'Votre entreprise' ? ` · ${company.nom}` : ''}`}
      soustitre="Dates réelles calculées à partir d'aujourd'hui"
    >
      <ol className="space-y-3">
        {jalons.map((j, i) => (
          <li
            key={i}
            className={`flex items-start gap-4 rounded-2xl border bg-white/60 p-4 ${
              j.urgence ? PUCE[j.urgence] : 'border-navy/10 text-navy'
            }`}
          >
            <span className="shrink-0 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide">
              {j.delai}
            </span>
            <p className="text-sm text-navy/80 sm:text-base">{j.texte}</p>
          </li>
        ))}
      </ol>
      <p className="mt-5 text-xs text-navy/50">
        La loi (C. com. art. L631-4) impose de déclarer la cessation des
        paiements dans les 45 jours qui suivent — ce délai est le seul qui soit
        strictement légal.
      </p>
    </BlocAccordeon>
  );
}
