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
  { re: /130 jours ou\s+910 heures/, pourquoi: 'CSP : 88 jours ou 610 heures sur 24 mois (fiche Unédic CSP)' },
  { re: /8 jours en redressement ou liquidation/, pourquoi: 'DREETS : 8 jours en RJ, 4 jours en LJ (C. trav. L1233-58)' },
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
  { re: /Cerfa 14953|Cass\. soc\. 2014|loi Évin, art\. L911-8|salaire brut moyen des 12/, pourquoi: 'CSP : références non vérifiables ou inexactes (service-public F13819)' },
  { re: /juriste \+ comptable|bénévoles vous reçoit \(juriste|permanenceFrequence: '(?!sur rendez-vous)/, pourquoi: 'CIP : trio expert-comptable / avocat / ancien juge, sur rendez-vous (CCI)' },
  { re: /15 à 25 % des charges|souvent 40 à\s+70 %|généralement 90 j|insaisissable ~ 600|plupart proposent un premier RDV/, pourquoi: 'chiffres sans source officielle ; SBI = RSA personne seule (CPCE L162-2)' },
  { re: /CPAM \/ SSI|indépendants \(jusqu.à 3[\s ]000|vous y avez droit\./, pourquoi: 'action sociale des indépendants : Urssaf / CPSTI, au cas par cas (urssaf.fr)' },
  { re: /Comptez environ 3 000 à 10 000|compter 5 000 à 15 000|frais de greffe environ 80|audience ne dure souvent que 15 minutes|Le juge accorde généralement 1 mois|répond généralement sous 15 jours/, pourquoi: 'chiffres sans source officielle' },
  { re: /FISAC|Bonus écologique flotte|nom: 'USPF'|nom: 'SYNHORCAT'/, pourquoi: 'dispositifs disparus (FISAC éteint depuis 2019, Sénat PLF 2023) ou organismes fusionnés/mal nommés' },
  { re: /jusqu.à 90 % sous 48 h|Commission 1-3 %|Délai 48 h, jusqu.à un plafond/, pourquoi: 'conditions commerciales non officielles' },
  { re: /17[\s\u202f]000 €|18,17 ?€/, pourquoi: 'Adie : 15 000 € sur 48 mois (adie.org) ; ASS 19,48 €/jour (service-public F12484)' },
  { re: /forfaitaire 650 €|réinsertion économique<\/strong>\{' '\}\s*\(jusqu/, pourquoi: 'aide au retour OFII : montants de l\'arrêté du 9 octobre 2023 (service-public F33974)' },
  { re: /souvent\s+inférieurs à 15 jours|commander vos formulaires CSP/, pourquoi: 'OPCO : délai non sourcé ; documents CSP fournis par France Travail' },
  { re: /loi 14 fév\. 2022\)|loi du 14 fév\. 2022\)|loi du 14 fév\. 2022\)\./, pourquoi: 'limite de 5 ans du conjoint collaborateur : C. com. art. L121-4 (LFSS 2022)' },
  // Tour 4
  { re: /0 805 65 50 50|0805655050/, pourquoi: 'ancienne cellule APESA (2020) : absente d’apesa-france.com, qui renvoie au 3114' },
  { re: /0 820 012 112|0 820 000 97\d/, pourquoi: 'standard de la CCI Paris IdF / anciens numéros des CGSS (39 57 et 36 98 désormais)' },
  { re: /SSI · Sécurité Sociale|secu-independants\.fr/, pourquoi: 'SSI supprimée au 1er janvier 2020 : action sociale du CPSTI via l’Urssaf' },
  { re: /Cedants-Repreneurs|BPI Prêt rebond|Allocation de Fin d.Études|FNAUT-VTC/, pourquoi: 'site, prêt ou dispositif inexistants ou fermés' },
  { re: /01 55 90 27 00|01 53 17 87 40|0 969 328 110/, pourquoi: 'numéros absents des sites officiels (AGS, Médiateur des entreprises : saisine en ligne ; Adie)' },
  { re: /règlement européen 330\/2010/, pourquoi: 'règlement expiré, remplacé par le règlement (UE) 2022/720 ; clause de non-concurrence : L341-2 C. com.' },
  { re: /Taux d.accord supérieur à 75|réétaler jusqu.à 10 ans|[Éé]talement (possible )?jusqu\\?.à 10 ans/, pourquoi: 'PGE : allongement de 2 à 4 ans via la Médiation du crédit (accord de place) ; taux de médiation sans source' },
  { re: /plafond 10 ans|sans inscription défavorable|BdF, FBF, Bpifrance/, pourquoi: 'PGE : accord de place du 19/01/2022 signé par l’État, la Banque de France, l’IEDOM/IEOM et la FBF ; allongement de 2 ans (4 au plus) ; entreprise classée en défaut (banque-france.fr)' },
  { re: /[Ss]aisir directement APESA|directement par téléphone\. La saisine/, pourquoi: 'APESA : alerte déclenchée par une sentinelle formée, avec l’accord de l’entrepreneur (apesa-france.com, « Le dispositif »)' },
  { re: /cellule dédiée|dispositif de résolution organisée/, pourquoi: 'ACPR : pas de « cellule » d’accompagnement ; la résolution vise les banques et assureurs défaillants (acpr.banque-france.fr)' },
  { re: /traitée en 2 à 4 semaines|premier rendez-vous sous 7 jours|la plupart proposent un premier échange/, pourquoi: 'délais et gratuité sans source officielle (courriers)' },
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
