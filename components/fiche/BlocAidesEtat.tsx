'use client';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

interface DispositifEtat {
  cle: string;
  nom: string;
  description: string;
  telephone?: string;
  site?: string;
  badge?: string;
  accent: 'bleu' | 'vert' | 'jaune' | 'rouge' | 'navy';
}

const ACCENTS: Record<DispositifEtat['accent'], string> = {
  bleu: 'border-bleu/30 bg-bleu/5',
  vert: 'border-vert/30 bg-vert/5',
  jaune: 'border-jaune/30 bg-jaune/5',
  rouge: 'border-rouge/30 bg-rouge/5',
  navy: 'border-navy/20 bg-navy/5',
};

const ACCENTS_TEXTE: Record<DispositifEtat['accent'], string> = {
  bleu: 'text-bleu-fonce',
  vert: 'text-vert',
  jaune: 'text-jaune',
  rouge: 'text-rouge',
  navy: 'text-navy',
};

export default function BlocAidesEtat() {
  const { reponses, company, seuils } = useFiche();
  const dispositifs: DispositifEtat[] = [];

  // Conseillers-Entreprises : premier réflexe, toujours affiché
  dispositifs.push({
    cle: 'conseillers',
    nom: 'Conseillers-Entreprises',
    description:
      "Plateforme unique de l'État pour identifier l'aide ou l'interlocuteur public adapté à votre situation. Un conseiller vous rappelle gratuitement.",
    site: 'https://conseillers-entreprises.service-public.gouv.fr',
    badge: 'Premier réflexe · gratuit',
    accent: 'bleu',
  });

  // BdF TPE-PME : si problème bancaire ou trésorerie
  if (reponses.probleme === 'banque' || reponses.situation === 'tresorie') {
    dispositifs.push({
      cle: 'bdf',
      nom: 'Banque de France · Correspondant TPE-PME',
      description:
        "Numéro unique pour les dirigeants face à une difficulté bancaire, de trésorerie ou de financement. Un référent local vous oriente vers la médiation du crédit ou un dispositif adapté.",
      telephone: '34 14',
      site: 'https://entreprises.banque-france.fr',
      badge: 'Gratuit · confidentiel',
      accent: 'bleu',
    });
  }

  // CCSF : dettes fiscales ou sociales
  if (reponses.probleme === 'urssaf' || reponses.probleme === 'impots') {
    dispositifs.push({
      cle: 'ccsf',
      nom: 'CCSF — Commission des chefs des services financiers',
      description:
        "Plan d'apurement unique couvrant à la fois vos dettes fiscales (impôts, TVA, IS) et sociales (URSSAF, retraite). Échelonnement jusqu'à 36 mois. Saisine via la DDFiP.",
      telephone: '0 809 401 401',
      site: 'https://www.impots.gouv.fr/professionnel/accompagnement-individualise-en-cas-de-difficultes-economiques-et-financieres',
      badge: 'Dettes fiscales + sociales',
      accent: 'vert',
    });
  }

  // CIRI ou CODEFI selon la taille : le CIRI traite les entreprises de plus
  // de 400 salariés, le CODEFI celles de 400 et moins.
  const grosseStructure = seuils.approx > 400;

  if (grosseStructure) {
    dispositifs.push({
      cle: 'ciri',
      nom: 'CIRI — Comité Interministériel de Restructuration Industrielle',
      description:
        "Cellule interministérielle dédiée aux entreprises de plus de 400 salariés. Coordonne État, banques et créanciers publics pour structurer un plan de retournement.",
      telephone: '01 44 87 72 58',
      site: 'https://www.economie.gouv.fr/ciri',
      badge: 'Entreprises >400 salariés',
      accent: 'navy',
    });
  } else {
    dispositifs.push({
      cle: 'codefi',
      nom: 'CODEFI — Comité Départemental d\'Examen des problèmes de Financement',
      description:
        "Cellule départementale pilotée par le préfet et le DDFiP. Coordonne créanciers publics (URSSAF, fisc) et banques pour les entreprises de moins de 400 salariés. Saisine confidentielle.",
      site: 'https://www.economie.gouv.fr/entreprises/codefi-commission-departementale-financement',
      badge: '<400 salariés',
      accent: 'navy',
    });
  }

  // CRP : pour les cas graves
  if (
    reponses.situation === 'redressement' ||
    reponses.situation === 'assignation'
  ) {
    dispositifs.push({
      cle: 'crp',
      nom: 'CRP — Commissaire aux Restructurations et à la Prévention',
      description:
        "Représentant de l'État en région (DREETS / Préfecture) chargé d'accompagner confidentiellement les entreprises en difficulté. Aide à coordonner les créanciers publics et privés en amont d'une procédure.",
      site: 'https://www.economie.gouv.fr/entreprises/commissaires-restructurations-prevention',
      badge: 'Cas urgents · confidentiel',
      accent: 'rouge',
    });
  }

  // FSE+ : restructurations sociales avec salariés
  if (reponses.effectif === 'salaries') {
    dispositifs.push({
      cle: 'fseplus',
      nom: 'FSE+ — Fonds Social Européen Plus (2021-2027)',
      description:
        "Cofinancement européen pour les actions de reclassement, formation et accompagnement des salariés lors de restructurations. Géré par les Régions (volet décentralisé) et la DGEFP (volet national). Mobilisable en complément d'un PSE ou d'un plan de reclassement.",
      site: 'https://www.fse.gouv.fr',
      badge: 'Cofinancement UE · jusqu\'à 60 %',
      accent: 'bleu',
    });
  }

  // FNE-Formation : restructuration formation collective
  if (reponses.effectif === 'salaries' && (reponses.situation === 'tresorie' || reponses.situation === 'redressement')) {
    dispositifs.push({
      cle: 'fne',
      nom: 'FNE-Formation',
      description:
        "Financement public de la formation des salariés pendant une baisse d'activité ou une restructuration. Cumulable avec l'activité partielle (et l'APLD-R pour les accords encore en vigueur). Demande déposée à l'OPCO via la téléprocédure.",
      site: 'https://www.travail-emploi.gouv.fr/emploi-et-insertion/accompagnement-des-mutations-economiques/article/fne-formation',
      badge: 'Maintien dans l\'emploi',
      accent: 'vert',
    });
  }

  if (!dispositifs.length) return null;

  return (
    <BlocAccordeon
      icone="🏛️"
      titre="Dispositifs de l'État pour vous aider"
      soustitre={`${dispositifs.length} guichet${dispositifs.length > 1 ? 's' : ''} public${dispositifs.length > 1 ? 's' : ''} gratuit${dispositifs.length > 1 ? 's' : ''} adapté${dispositifs.length > 1 ? 's' : ''} à votre situation`}
    >
      <p className="text-sm text-navy/80">
        L&apos;État dispose de plusieurs guichets confidentiels et gratuits
        pour accompagner les dirigeants en difficulté. Ces dispositifs
        interviennent en amont des procédures collectives — n&apos;hésitez
        pas à les solliciter tôt.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {dispositifs.map((d) => (
          <div
            key={d.cle}
            className={`glass-soft border ${ACCENTS[d.accent]} p-4 transition hover:bg-white`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className={`font-display text-base ${ACCENTS_TEXTE[d.accent]}`}>
                {d.nom}
              </p>
              {d.badge && (
                <span className="shrink-0 rounded-full bg-white/80 px-2 py-1 text-[10px] font-semibold text-navy/70">
                  {d.badge}
                </span>
              )}
            </div>
            <p className="mt-2 text-xs text-navy/70">{d.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {d.telephone && (
                <a
                  href={`tel:${d.telephone.replace(/\s/g, '')}`}
                  className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
                >
                  <span aria-hidden>☎</span> {d.telephone}
                </a>
              )}
              {d.site && (
                <a
                  href={d.site}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
                >
                  <span aria-hidden>🌐</span> {(() => {
                    try {
                      return new URL(d.site!).hostname.replace('www.', '');
                    } catch {
                      return 'site officiel';
                    }
                  })()}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-navy/50">
        Ces dispositifs sont gratuits, confidentiels et soumis au secret
        professionnel. Sollicitez-les avant l&apos;ouverture d&apos;une
        procédure collective pour bénéficier de tous les leviers
        amiables{company.departement ? ` (département ${company.departement})` : ''}.
      </p>
    </BlocAccordeon>
  );
}
