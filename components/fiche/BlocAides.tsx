'use client';
import type { Reponses, CompanyData } from '@/lib/types';
import type { SectorInfo } from '@/lib/secteur';
import { getAidesRegionales } from '@/lib/aidesRegionales';
import { isEI } from '@/lib/strategie';
import { contactCotisations } from '@/lib/organismes';
import { useFiche } from '@/lib/FicheContext';
import BlocAccordeon from './BlocAccordeon';

interface Aide {
  nom: string;
  description: string;
  telephone?: string;
  site?: string;
  badge?: string;
  condition?: string;
}

function buildAides(r: Reponses, c: CompanyData, s: SectorInfo): { titre: string; aides: Aide[] }[] {
  const sections: { titre: string; aides: Aide[] }[] = [];
  const dep = c.departement || '';
  const ville = c.ville || '';
  const ei = isEI(c.formeJuridique);

  // Section 1: Aides liées au problème principal
  const specifiques: Aide[] = [];
  if (r.probleme === 'urssaf') {
    const cot = contactCotisations(s, r.effectif, dep);
    specifiques.push({
      nom: cot.org === 'URSSAF' ? 'Échelonnement URSSAF' : `Échelonnement · ${cot.org}`,
      description: `Demandez un échéancier auprès de ${cot.orgAvecArticle}${cot.tel ? '' : ` (${cot.telLibelle})`}. Des cotisations anciennes peuvent être prescrites (3 ans, sauf mise en demeure envoyée à temps — art. L244-3 CSS).`,
      telephone: cot.tel ?? undefined,
      site: cot.site,
      badge: 'Prioritaire pour vous',
    });
    specifiques.push({
      nom: 'Fonds d\'action sociale URSSAF',
      description: 'Prise en charge partielle de cotisations en cas de difficulté avérée.',
      site: 'https://www.urssaf.fr',
    });
  }
  if (r.probleme === 'impots') {
    specifiques.push({
      nom: 'Votre service des impôts des entreprises (SIE)',
      description: 'Demande de délai de paiement, échelonnement ou remise gracieuse. En cas de gêne exceptionnelle, l\'administration peut réduire l\'impôt dû.',
      site: 'https://www.impots.gouv.fr',
      badge: 'Prioritaire pour vous',
    });
    specifiques.push({
      nom: 'CCSF · Commission des chefs des services financiers',
      description: 'Échelonnement global de toutes vos dettes fiscales ET sociales en une seule demande. Un seul interlocuteur.',
      site: 'https://www.impots.gouv.fr',
      badge: 'Guichet unique',
    });
  }
  if (r.probleme === 'banque') {
    specifiques.push({
      nom: `Médiation du crédit${dep ? ` · Banque de France (${dep})` : ''}`,
      description: 'Gratuit et confidentiel. Le médiateur contacte votre banque et négocie pour vous. Taux de succès élevé.',
      telephone: '34 14',
      site: 'https://mediateur-credit.banque-france.fr',
      badge: 'Prioritaire pour vous',
    });
  }
  if (r.probleme === 'fournisseurs') {
    specifiques.push({
      nom: 'Médiateur des entreprises',
      description: 'Différend avec un fournisseur ou client ? Le Médiateur des entreprises vous aide à renouer le dialogue. Gratuit et confidentiel.',
      telephone: '01 53 17 87 40',
      site: 'https://www.economie.gouv.fr/mediateur-des-entreprises',
      badge: 'Prioritaire pour vous',
    });
  }
  if (specifiques.length) {
    sections.push({ titre: `Pour votre situation (${r.probleme === 'urssaf' ? 'URSSAF' : r.probleme === 'impots' ? 'impôts' : r.probleme === 'banque' ? 'banque' : 'fournisseurs'})`, aides: specifiques });
  }

  // Section 2: Aides selon le statut
  const statut: Aide[] = [];
  if (r.effectif === 'independant' || ei) {
    statut.push({
      nom: 'CPAM / SSI · Action sociale',
      description: `Aide financière d'urgence pour indépendants (jusqu'à 3 000 €). Vous êtes ${ei ? 'entrepreneur individuel' : 'indépendant'} — vous y avez droit.`,
      telephone: '36 46',
      site: 'https://www.secu-independants.fr',
      badge: 'Gratuit',
    });
    statut.push({
      nom: 'RSA / ASS',
      description: 'Si votre revenu d\'activité est nul ou très faible, vous pouvez cumuler RSA et activité professionnelle.',
      site: 'https://www.caf.fr',
    });
  }
  if (r.effectif === 'salaries') {
    statut.push({
      nom: 'Activité partielle',
      description: `Indemnisation de vos salariés si baisse d'activité. Votre entreprise ${c.nom !== 'Votre entreprise' ? `(${c.nom}) ` : ''}peut en bénéficier.`,
      site: 'https://activitepartielle.emploi.gouv.fr',
      badge: 'Si baisse d\'activité',
    });
    statut.push({
      nom: 'AGS · Garantie des salaires',
      description: 'En cas de redressement ou liquidation, les salaires sont garantis par l\'AGS.',
      telephone: '01 55 90 27 00',
      site: 'https://www.ags-garantie-salaires.org',
    });
    statut.push({
      nom: 'FNE-Formation',
      description: 'Financement de formations pour vos salariés pendant la période de difficulté.',
      site: 'https://www.travail-emploi.gouv.fr',
    });
  }
  if (statut.length) {
    sections.push({ titre: r.effectif === 'independant' ? 'Pour les indépendants' : 'Pour les employeurs', aides: statut });
  }

  // Section 3: Aides sectorielles
  if (s.aidesSpecifiques.length > 0) {
    const sectorielles: Aide[] = s.aidesSpecifiques.map((a) => ({
      nom: a.nom,
      description: a.description,
      site: a.site,
      badge: a.badge ?? `Spécifique ${s.label}`,
    }));
    sections.push({ titre: `Aides ${s.label}`, aides: sectorielles });
  }

  // Section : leviers de trésorerie immédiats (affacturage, escompte, Dailly)
  // Pertinents pour toute entreprise qui facture des clients pros (B2B)
  if (r.situation === 'tresorie' || r.situation === 'redressement' || r.probleme === 'banque' || r.probleme === 'fournisseurs') {
    const tresorerieLeviers: Aide[] = [
      {
        nom: 'Affacturage (factoring)',
        description:
          'Cession de vos factures clients à un affactureur (banque, Bpifrance, société spécialisée) qui vous avance jusqu\'à 90 % sous 48 h, puis recouvre auprès du client. Différent du crédit fournisseur : c\'est un financement, pas un délai. Commission 1-3 % + intérêts. Adapté si vous avez plusieurs clients B2B solvables.',
        site: 'https://www.bpifrance.fr/catalogue-offres/garantie-affacturage',
        badge: 'Cash sous 48 h',
      },
      {
        nom: 'Escompte commercial',
        description:
          'Mobilisation auprès de votre banque d\'effets de commerce (lettres de change, billets à ordre) avant leur échéance. La banque vous paie immédiatement, déduction faite d\'un agio. Moins coûteux que l\'affacturage mais nécessite des effets acceptés. Différent de l\'escompte fournisseur (remise pour paiement comptant).',
        badge: 'Si effets acceptés',
      },
      {
        nom: 'Cession Dailly (loi du 2 janv. 1981)',
        description:
          'Cession de créances professionnelles à votre banque, via un bordereau simplifié (art. L313-23 CMF). Plus souple que l\'escompte (pas besoin d\'effet de commerce) et moins cher que l\'affacturage. Vous restez en relation avec votre client. Outil sous-utilisé en TPE/PME.',
        badge: 'Souple · banque',
      },
      {
        nom: 'Mobilisation créances publiques (Bpifrance)',
        description:
          'Si vous travaillez avec des collectivités ou administrations, Bpifrance avance jusqu\'à 100 % de vos factures publiques (DGFIP, conseil régional, hôpital). Délai 48 h, jusqu\'à un plafond de 30 000 € automatique, plus au-delà.',
        site: 'https://www.bpifrance.fr/catalogue-offres/avance',
        badge: 'Marchés publics',
      },
    ];
    sections.push({ titre: 'Leviers de trésorerie immédiats', aides: tresorerieLeviers });
  }

  // Section 4: Aides nationales (toujours)
  const nationales: Aide[] = [
    {
      nom: 'Bpifrance · prêts aux TPE/PME',
      description: `Prêts de renforcement de la trésorerie ou de développement, souvent en partenariat avec les Régions ; les offres évoluent régulièrement${c.nom !== 'Votre entreprise' ? `. Vérifiez si ${c.nom} peut être éligible auprès de votre direction régionale.` : ' : renseignez-vous auprès de votre direction régionale.'}`,
      site: 'https://www.bpifrance.fr',
      badge: 'Entretien gratuit',
    },
  ];
  nationales.push({
    nom: 'CODEFI',
    description: `Comité départemental d'aide aux entreprises en difficulté de financement${dep ? ` (${dep})` : ''}. Peut négocier avec vos créanciers.`,
    site: 'https://www.economie.gouv.fr',
    badge: '< 400 salariés',
  });
  nationales.push({
    nom: 'CIP · Centre d\'Information sur la Prévention',
    description: 'Rendez-vous gratuit et confidentiel avec d\'anciens chefs d\'entreprise, avocats et comptables bénévoles.',
    site: 'https://www.cip-national.fr',
    badge: 'Gratuit · confidentiel',
  });
  nationales.push({
    nom: 'ADIE · Micro-crédit',
    description: 'Prêts jusqu\'à 17 000 € sur 5 ans. Accessible même si vous êtes interdit bancaire ou fiché FICP.',
    telephone: '0 969 328 110',
    site: 'https://www.adie.org',
    badge: 'Même interdit bancaire',
  });
  nationales.push({
    nom: 'France Active · Garanties de prêts',
    description: 'Garantit jusqu\'à 65 % d\'un prêt bancaire, réduisant le risque pour la banque. Accompagnement inclus.',
    site: 'https://www.franceactive.org',
  });
  sections.push({ titre: 'Aides nationales', aides: nationales });

  // Aides personnelles du dirigeant
  const personnelles: Aide[] = [
    {
      nom: 'ATI · Allocation Travailleurs Indépendants',
      description: 'Chômage spécifique indépendants : environ 600 à 800 €/mois (19,73 à 26,30 €/jour) pendant 6 mois après cessation involontaire.',
      site: 'https://chomage-independant.francetravail.fr',
      badge: '6 mois',
    },
    {
      nom: 'CSS · Complémentaire Santé Solidaire',
      description: 'Mutuelle gratuite si vos revenus ont fortement baissé (moins de 10 421 €/an pour une personne seule en métropole).',
      telephone: '3646',
      site: 'https://www.complementaire-sante-solidaire.gouv.fr',
      badge: 'Gratuit',
    },
    {
      nom: 'Aide juridictionnelle',
      description: 'Avocat et frais de justice pris en charge : en totalité si votre revenu fiscal de référence est d\'au plus 12 957 €, en partie jusqu\'à 19 433 € (personne seule, barème 2026). Pour vos procédures personnelles.',
      site: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F18074',
      badge: 'Sous conditions',
    },
    {
      nom: 'Droit au compte · Banque de France',
      description: 'Si toutes les banques refusent de vous ouvrir un compte, la Banque de France en désigne une obligatoirement.',
      site: 'https://www.banque-france.fr',
      badge: 'Droit légal',
    },
  ];
  sections.push({ titre: 'Pour vous personnellement', aides: personnelles });

  // Aides locales
  // Pas de chambre consulaire pour les professions libérales, la santé et
  // les associations : le CIP (aides nationales) est leur interlocuteur.
  const sansChambre =
    s.secteur === 'liberal' || s.secteur === 'sante' || s.secteur === 'ess' || /association|fondation/i.test(c.formeJuridique || '');
  const chambreLabel = s.chambre === 'CMA' ? 'Chambre de métiers et de l\'artisanat' : s.chambre === 'CA' ? 'Chambre d\'agriculture' : 'CCI';
  const regionales: Aide[] = sansChambre
    ? []
    : [
        {
          nom: `${chambreLabel}${dep ? ` (${dep})` : ''}`,
          description: `Accompagnement gratuit et confidentiel pour les entreprises en difficulté${ville ? ` dans la région de ${ville}` : ''}.`,
          site: s.chambre === 'CMA' ? 'https://www.artisanat.fr' : s.chambre === 'CA' ? 'https://chambres-agriculture.fr' : 'https://www.cci.fr',
          badge: 'Gratuit · local',
        },
      ];
  if (r.probleme === 'urssaf' || r.probleme === 'impots') {
    regionales.push({
      nom: 'Médiateur national de l\'énergie',
      description: 'Si vos factures d\'énergie aggravent la situation. Gratuit pour les TPE (< 10 salariés, CA < 2 M€).',
      site: 'https://www.energie-mediateur.fr',
      badge: 'TPE uniquement',
    });
  }
  if (regionales.length > 0) {
    sections.push({ titre: `Aides locales${dep ? ` · département ${dep}` : ''}`, aides: regionales });
  }

  // Aides régionales ciblées
  const regionInfo = getAidesRegionales(dep);
  if (regionInfo && regionInfo.aides.length > 0) {
    const regionAides: Aide[] = regionInfo.aides.map((a) => ({
      nom: a.nom,
      description: a.description,
      site: a.site,
      telephone: a.telephone,
      badge: a.badge ?? `Région ${regionInfo.label}`,
    }));
    sections.push({
      titre: `Dispositifs régionaux · ${regionInfo.label}`,
      aides: regionAides,
    });
  }

  return sections;
}

export default function BlocAides() {
  const { reponses, company, sector } = useFiche();
  const sections = buildAides(reponses, company, sector);
  const total = sections.reduce((n, s) => n + s.aides.length, 0);

  return (
    <BlocAccordeon
      icone="💶"
      titre="Aides et financements"
      soustitre={`${total} dispositifs identifiés pour ${company.nom !== 'Votre entreprise' ? company.nom : 'votre situation'}`}
    >
      <div className="space-y-6">
        {sections.map((s) => (
          <div key={s.titre}>
            <h3 className="mb-3 font-display text-base text-navy">{s.titre}</h3>
            <div className="space-y-2">
              {s.aides.map((a, i) => (
                <div
                  key={i}
                  className="glass-soft flex items-start justify-between gap-3 p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <p className="font-medium text-navy">{a.nom}</p>
                      {a.badge && (
                        <span className="pastille shrink-0 text-[10px]">{a.badge}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-navy/70">{a.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {a.telephone && (
                        <a
                          href={`tel:${a.telephone.replace(/\s/g, '')}`}
                          className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
                        >
                          <span aria-hidden>☎</span> {a.telephone}
                        </a>
                      )}
                      {a.site && (
                        <a
                          href={a.site}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-white/80 px-3 py-1 text-navy/80 hover:bg-white"
                        >
                          <span aria-hidden>🌐</span> {(() => { try { return new URL(a.site).hostname.replace('www.', ''); } catch { return a.nom; } })()}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-xs text-navy/50">
        Ces aides sont filtrées selon votre situation ({company.formeJuridique}, département {company.departement}). Vérifiez les conditions directement auprès de chaque organisme.
      </p>
    </BlocAccordeon>
  );
}
