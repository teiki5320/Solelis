import { FicheProvider } from '@/lib/FicheContext';
import ProgressTracker from '@/components/fiche/ProgressTracker';
import BlocSanteSecteur from '@/components/fiche/BlocSanteSecteur';
import AlertesBand from '@/components/fiche/AlertesBand';
import BlocSoutien from '@/components/fiche/BlocSoutien';
import BlocCalendrier from '@/components/fiche/BlocCalendrier';
import BlocChecklist from '@/components/fiche/BlocChecklist';
import BlocOrganismes from '@/components/fiche/BlocOrganismes';
import BlocAlertes from '@/components/fiche/BlocAlertes';
import BlocPrescription from '@/components/fiche/BlocPrescription';
import BlocPlanAction from '@/components/fiche/BlocPlanAction';
import BlocAides from '@/components/fiche/BlocAides';
import BlocProtectionFamille from '@/components/fiche/BlocProtectionFamille';
import BlocProcedureRecommandee from '@/components/fiche/BlocProcedureRecommandee';
import BlocObligations from '@/components/fiche/BlocObligations';
import BlocAuditCaution from '@/components/fiche/BlocAuditCaution';
import BlocTimeline from '@/components/fiche/BlocTimeline';
import BlocPatrimoine from '@/components/fiche/BlocPatrimoine';
import BlocTresorerie from '@/components/fiche/BlocTresorerie';
import BlocCessationDecompte from '@/components/fiche/BlocCessationDecompte';
import BlocCCSF from '@/components/fiche/BlocCCSF';
import BlocAidesEtat from '@/components/fiche/BlocAidesEtat';
import BlocSurendettement from '@/components/fiche/BlocSurendettement';
import BlocPGE from '@/components/fiche/BlocPGE';
import BlocBailCommercial from '@/components/fiche/BlocBailCommercial';
import BlocConsequencesPerso from '@/components/fiche/BlocConsequencesPerso';
import BlocRappels from '@/components/fiche/BlocRappels';
import BlocFranchise from '@/components/fiche/BlocFranchise';
import BlocCreditBail from '@/components/fiche/BlocCreditBail';
import BlocSCOP from '@/components/fiche/BlocSCOP';
import BlocReclassement from '@/components/fiche/BlocReclassement';
import BlocAPLDR from '@/components/fiche/BlocAPLDR';
import BlocPeriodeSuspecte from '@/components/fiche/BlocPeriodeSuspecte';
import BlocConjointCollaborateur from '@/components/fiche/BlocConjointCollaborateur';
import BlocPlateformes from '@/components/fiche/BlocPlateformes';
import BlocCSP from '@/components/fiche/BlocCSP';
import BlocGarantieBPI from '@/components/fiche/BlocGarantieBPI';
import BlocArretLongueDuree from '@/components/fiche/BlocArretLongueDuree';
import BlocNationaliteSejour from '@/components/fiche/BlocNationaliteSejour';
import ModePerdu from '@/components/fiche/ModePerdu';
import IdentiteHero from '@/components/fiche/dashboard/IdentiteHero';
import PriorityCards from '@/components/fiche/dashboard/PriorityCards';
import QuickLinks from '@/components/fiche/dashboard/QuickLinks';
import StrategieHero from '@/components/fiche/dashboard/StrategieHero';
import SectionNav from '@/components/fiche/dashboard/SectionNav';
import SectionHeader from '@/components/fiche/dashboard/SectionHeader';
import { harmoniserCarteTribunal } from '@/lib/strategie';
import { nettoyerNomComplet } from '@/lib/sirene';
import type { CompanyData } from '@/lib/types';
import type { LayoutData } from './types';

/**
 * L'API recherche-entreprises renvoie « NOM (SIGLE) » ; quand le sigle est
 * identique au nom, on obtient « AMP ETANCHEITE (AMP ETANCHEITE) ».
 */
export function nomSansSigleRedondant(nom: string): string {
  // « NOM (NOM) (SIGLE) » (fiches enregistrées avant le nettoyage à la source).
  const nettoye = nettoyerNomComplet(nom);
  if (nettoye !== nom.trim()) return nettoye;
  const m = /^(.+?)\s*\((.+)\)$/.exec(nom.trim());
  if (!m) return nom;
  const normaliser = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/gi, '').toLowerCase();
  return normaliser(m[1]) === normaliser(m[2]) ? m[1].trim() : nom;
}

function companyAffichee(company: CompanyData): CompanyData {
  const nom = nomSansSigleRedondant(company.nom);
  return nom === company.nom ? company : { ...company, nom };
}

/**
 * Wrapper qui rend deux colonnes indépendantes : chaque colonne grandit
 * librement, sans alignement forcé entre les deux (évite les vides
 * quand un accordéon s'ouvre d'un seul côté).
 */
function TwoCols({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="min-w-0 space-y-4">{left}</div>
      <div className="min-w-0 space-y-4">{right}</div>
    </div>
  );
}

export default function LayoutDashboard({
  token,
  company: companyBrute,
  reponses,
  sector,
  alertes,
  bodacc,
  infogreffe,
  bodaccIndisponible,
  groupes: groupesBruts,
  companyAge,
  seuils,
}: LayoutData) {
  const company = companyAffichee(companyBrute);
  // Une seule source pour le tribunal : la carte « Organismes » cite le même
  // tribunal que la stratégie, le plan d'action et la checklist.
  const groupes = harmoniserCarteTribunal(groupesBruts, company);
  return (
    <FicheProvider value={{ token, reponses, company, sector, alertes, bodacc, infogreffe, bodaccIndisponible, groupes, companyAge, seuils }}>
    <div className="space-y-6">
      {/* Mode perdu : remplace temporairement le détail si moral === 'perdu' */}
      <ModePerdu />

      {/* ───── Top : identité + cartes prioritaires dynamiques ───── */}
      <IdentiteHero />
      <PriorityCards />

      {/* Progression de lecture */}
      <ProgressTracker token={token} />

      {/* Alertes contextuelles */}
      <BlocSanteSecteur />
      <AlertesBand />

      {/* Liens rapides outils / courriers */}
      <QuickLinks />

      {/* Navigation sticky */}
      <SectionNav />

      {/* ───── Section AGIR (en premier, 2 accordéons ouverts) ───── */}
      <SectionHeader
        id="action"
        icone="✅"
        titre="Agir"
        sousTitre="Votre plan et votre checklist, déjà dépliés pour commencer"
        couleur="vert"
      />
      <TwoCols
        left={
          <>
            <div data-section="plan-action">
              <BlocPlanAction defaultOpen />
            </div>
            <div data-section="procedure">
              <BlocProcedureRecommandee />
            </div>
            <div data-section="apldr">
              <BlocAPLDR />
            </div>
          </>
        }
        right={
          <>
            <div data-section="checklist">
              <BlocChecklist defaultOpen />
            </div>
            <div data-section="reclassement">
              <BlocReclassement />
            </div>
            <div data-section="csp">
              <BlocCSP />
            </div>
          </>
        }
      />

      {/* ───── Section VUE D'ENSEMBLE ───── */}
      <SectionHeader
        id="vue-ensemble"
        icone="📊"
        titre="Vue d'ensemble"
        sousTitre="Votre cap recommandé et votre soutien"
        couleur="bleu"
      />
      <div data-section="strategie">
        <StrategieHero />
      </div>
      <div data-section="soutien">
        <BlocSoutien />
      </div>

      {/* ───── Section ÉCHÉANCES ───── */}
      <SectionHeader
        id="echeances"
        icone="⏱️"
        titre="Échéances & urgences"
        sousTitre="Ce qui presse, avec dates et délais légaux"
        couleur="rouge"
      />
      <TwoCols
        left={
          <>
            <div data-section="cessation">
              <BlocCessationDecompte />
            </div>
            <div data-section="tresorerie">
              <BlocTresorerie />
            </div>
            <div data-section="pge">
              <BlocPGE />
            </div>
            <div data-section="garantie-bpi">
              <BlocGarantieBPI />
            </div>
            <div data-section="calendrier">
              <BlocCalendrier />
            </div>
          </>
        }
        right={
          <>
            <div data-section="timeline">
              <BlocTimeline />
            </div>
            <div data-section="periode-suspecte">
              <BlocPeriodeSuspecte />
            </div>
            <div data-section="arret-longue-duree">
              <BlocArretLongueDuree />
            </div>
            <div data-section="rappels">
              <BlocRappels />
            </div>
          </>
        }
      />

      {/* ───── Section PATRIMOINE ───── */}
      <SectionHeader
        id="patrimoine"
        icone="🏠"
        titre="Patrimoine & famille"
        sousTitre="Protection, cautions, conséquences personnelles"
        couleur="jaune"
      />
      <TwoCols
        left={
          <>
            <div data-section="protection">
              <BlocProtectionFamille />
            </div>
            <div data-section="caution">
              <BlocAuditCaution />
            </div>
            <div data-section="conjoint">
              <BlocConjointCollaborateur />
            </div>
          </>
        }
        right={
          <>
            <div data-section="patrimoine">
              <BlocPatrimoine />
            </div>
            <div data-section="consequences">
              <BlocConsequencesPerso />
            </div>
            <div data-section="nationalite">
              <BlocNationaliteSejour />
            </div>
          </>
        }
      />

      {/* ───── Section AIDES ───── */}
      <SectionHeader
        id="aides"
        icone="💶"
        titre="Aides & leviers"
        sousTitre="Dispositifs financiers, CCSF, bail commercial"
        couleur="bleu"
      />
      <TwoCols
        left={
          <>
            <div data-section="aides">
              <BlocAides />
            </div>
            <div data-section="aides-etat">
              <BlocAidesEtat />
            </div>
            <div data-section="surendettement">
              <BlocSurendettement />
            </div>
            <div data-section="bail">
              <BlocBailCommercial />
            </div>
            <div data-section="franchise">
              <BlocFranchise />
            </div>
            <div data-section="credit-bail">
              <BlocCreditBail />
            </div>
          </>
        }
        right={
          <>
            <div data-section="ccsf">
              <BlocCCSF />
            </div>
            <div data-section="obligations">
              <BlocObligations />
            </div>
            <div data-section="scop">
              <BlocSCOP />
            </div>
            <div data-section="plateformes">
              <BlocPlateformes />
            </div>
          </>
        }
      />

      {/* ───── Section RESSOURCES ───── */}
      <SectionHeader
        id="ressources"
        icone="📚"
        titre="Ressources"
        sousTitre="Organismes, prescriptions, alertes publiques"
        couleur="navy"
      />
      <TwoCols
        left={
          <>
            <div data-section="organismes">
              <BlocOrganismes />
            </div>
            <div data-section="alertes">
              <BlocAlertes />
            </div>
          </>
        }
        right={
          <>
            <div data-section="prescription">
              <BlocPrescription />
            </div>
          </>
        }
      />
    </div>
    </FicheProvider>
  );
}
