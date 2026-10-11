// @vitest-environment node
/**
 * Non-régression du contre-audit juridique (tour 3) : affirmations fausses
 * ou sans source officielle qui ne doivent pas revenir dans le site.
 * Chaque motif est accompagné de la source qui l'a fait retirer.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { SEUILS } from '@/app/outils/seuils-effectif/seuils';
import { buildAidesPersonnelles, buildOrganismes, getDepartement } from '@/lib/organismes';
import type { Reponses } from '@/lib/types';

const RACINE = path.resolve(__dirname, '../..');
function fichiers(dir: string): string[] {
  return fs.readdirSync(path.join(RACINE, dir), { withFileTypes: true }).flatMap((e) => {
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' ? [] : fichiers(rel);
    return /\.(tsx?|json)$/.test(e.name) ? [rel] : [];
  });
}
const SOURCES = [...fichiers('app'), ...fichiers('components'), ...fichiers('lib')].map((f) => ({
  f,
  t: fs.readFileSync(path.join(RACINE, f), 'utf8'),
}));

const INTERDITS: { re: RegExp; pourquoi: string }[] = [
  { re: /0,06 ?€ ?\/ ?min/, pourquoi: 'tarif d’appel URSSAF non confirmé' },
  { re: /tenue d.accorder un échelonnement/, pourquoi: 'l’échelonnement URSSAF est une faculté (urssaf.fr)' },
  { re: /souvent gratuit/i, pourquoi: 'non vérifiable ; consultation gratuite en point-justice (service-public F20706)' },
  { re: /Décision en 2 à 6 semaines|Délai de réponse : 1 à 3 mois/, pourquoi: 'aide juridictionnelle : décision « dans les meilleurs délais » (service-public F18074)' },
  { re: /dans les 6 mois de la création/, pourquoi: 'ARCE : pas de délai de 6 mois ; ACRE à demander sous 60 jours (francetravail.fr)' },
  { re: /(Cerfa|CERFA) n?°? ?15772/, pourquoi: 'formulaire inexistant ; dossier de saisine CCSF (entreprendre.service-public F38326)' },
  { re: /CCSF[^.]{0,120}36 mois|36 mois[^.]{0,60}CCSF|jusqu.à 36 mois\. Saisine/, pourquoi: 'durée de plan CCSF non fixée par les textes' },
  { re: /10 166 €/, pourquoi: 'plafond CSS périmé (10 421 € au 1er avril 2026)' },
  { re: /88 jours ou\s+610 heures/, pourquoi: 'affiliation chômage : 130 jours / 910 heures (unedic.org)' },
  { re: /salaire brut antérieur/, pourquoi: 'CSP : 75 % du salaire journalier de référence (service-public F13819)' },
  { re: /L244-1 CSS/, pourquoi: 'solidarité du dirigeant : L243-3-2 CSS' },
  { re: /TVA à 4 ans|4 ans pour la TVA|fiscal 4 ans|fiscal \(4 ans\)|baux 1 an|baux \(1 an\)/, pourquoi: 'reprise TVA 3 ans (LPF L176) ; loyers 5 ans' },
  { re: /3 mois renouvelables/, pourquoi: 'mandat ad hoc : pas de durée légale (L611-3) ; poursuite d’activité en LJ : R641-18' },
  { re: /limitées? à 10 ans/, pourquoi: 'aucune durée légale de la caution (art. 2315 C. civ.)' },
  { re: /loi n° 2022-139 du 7 mars 2024|loi du 7 mars 2024/, pourquoi: 'loi n° 2022-139 du 7 février 2022' },
  { re: /Versement sous 15 jours après transmission|verse sous\s+15 jours/, pourquoi: 'AGS : 5 à 8 jours (C. trav. L3253-21)' },
  { re: /rappels au-delà de 2 mois pré-jugement/, pourquoi: 'AGS : sommes dues à la date du jugement (L3253-8)' },
  { re: /c.est un droit \(art\. L247/, pourquoi: 'remise gracieuse : faculté de l’administration (L247 LPF)' },
  { re: /sursis de paiement automatique/, pourquoi: 'sursis de paiement sur demande (L277 LPF)' },
  { re: /Décision sous 2 à 3 mois|généralement 2 à 3 mois/, pourquoi: 'CCSF : réponse sous 2 mois, sinon rejet (F38326)' },
  { re: /réponse sous 5 j(?!ours ouvrés)|5 jours pour répondre|5 jours en moyenne|Réponse sous 5 jours/, pourquoi: 'médiation du crédit : contact sous 48 h puis 5 jours ouvrés pour les banques (banque-france.fr)' },
  { re: /CSCPJ/, pourquoi: 'chambre supprimée (commissaires de justice depuis 2022)' },
  { re: /Forfait audience : 800/, pourquoi: 'honoraires libres, sans barème officiel' },
  { re: /loi 14 fév\. 2022\)|loi du 14 fév\. 2022\)|loi du 14 fév\. 2022\)\./, pourquoi: 'limite de 5 ans du conjoint collaborateur : C. com. art. L121-4 (LFSS 2022)' },
];

describe('contre-audit : affirmations retirées', () => {
  for (const { re, pourquoi } of INTERDITS) {
    it(`absent du site : ${re.source.slice(0, 50)} (${pourquoi})`, () => {
      const trouves = SOURCES.filter(({ t }) => re.test(t)).map(({ f }) => f);
      expect(trouves).toEqual([]);
    });
  }

  it('coût des procédures : plus de fourchettes chiffrées inventées', () => {
    const t = fs.readFileSync(path.join(RACINE, 'app/outils/cout-procedures/page.tsx'), 'utf8');
    expect(t).not.toMatch(/\d \d{3} à \d+ \d{3} €/);
    expect(t).not.toMatch(/coeffTaille/);
    expect(t).toContain('L611-14');
  });

  it('sauvegarde : 12 mois d’observation au plus (L621-3), redressement : 18 mois (L631-7)', () => {
    const t = fs.readFileSync(path.join(RACINE, 'app/procedures-comparaison/page.tsx'), 'utf8');
    expect(t).toContain("6 mois renouvelable une fois (12 mois max)");
  });

  it('seuils : index égalité dès 50 salariés (L1142-8), référent harcèlement employeur à 250 (L1153-5-1)', () => {
    expect(SEUILS.find((s) => s.reference.includes('L1142-8'))?.seuil).toBe(50);
    expect(SEUILS.find((s) => s.reference.includes('L1153-5-1'))?.seuil).toBe(250);
    expect(SEUILS.find((s) => s.nom === 'BDESE complète')?.seuil).toBe(300);
  });

  it('ATI : numéro des demandeurs d’emploi (39 49), pas la ligne employeurs (39 95)', () => {
    const r: Reponses = { situation: 'redressement', probleme: 'urssaf', effectif: 'independant', moral: 'epuise' };
    const ati = buildAidesPersonnelles(r).cartes.find((c) => c.nom.startsWith('ATI'));
    expect(ati?.telephone).toBe('39 49');
    const social = buildOrganismes(getDepartement('75'), r, [], 'autre', '', 'TC').find((g) => g.cle === 'social');
    expect(social?.cartes.find((c) => /France Travail/.test(c.nom))?.telephone).toBe('39 49');
  });
});
