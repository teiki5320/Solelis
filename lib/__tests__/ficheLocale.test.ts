import { describe, it, expect } from 'vitest';
import { lireCookieFicheLocale, lireParametreD, validerFicheLocale } from '../ficheLocaleServeur';
import { valeurCookieFicheLocale, TAILLE_MAX_COOKIE_FICHE_LOCALE } from '../ficheLocale';
import type { Reponses } from '../types';

const reponses = { situation: 'prevention', probleme: 'urssaf', effectif: 'independant', moral: 'combatif' };

describe('validerFicheLocale', () => {
  it('accepte des données valides et nettoie le SIRET', () => {
    expect(validerFicheLocale({ siret: '123 456 789 01234', reponses })).toEqual({
      siret: '12345678901234',
      reponses,
    });
  });

  it('refuse des réponses hors schéma', () => {
    expect(validerFicheLocale({ siret: '12345678901234', reponses: { ...reponses, moral: 'inconnu' } })).toBeNull();
    expect(validerFicheLocale({ siret: '12345678901234', reponses: { ...reponses, script: '<x>' } })).toBeNull();
    expect(validerFicheLocale({ siret: '123', reponses })).toBeNull();
    expect(validerFicheLocale(null)).toBeNull();
  });
});

describe('lireCookieFicheLocale', () => {
  it('lit la valeur encodée posée par le navigateur', () => {
    const valeur = encodeURIComponent(JSON.stringify({ siret: '12345678901234', reponses }));
    expect(lireCookieFicheLocale(valeur)?.siret).toBe('12345678901234');
  });

  it('renvoie null pour une valeur absente ou corrompue', () => {
    expect(lireCookieFicheLocale(undefined)).toBeNull();
    expect(lireCookieFicheLocale('%E0%A4%A')).toBeNull();
    expect(lireCookieFicheLocale('pas-du-json')).toBeNull();
  });
});

describe('lireParametreD (anciens liens ?d=)', () => {
  it('reste compatible avec le base64 des anciens liens', () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses })).toString('base64');
    expect(lireParametreD(d)?.reponses.situation).toBe('prevention');
  });

  it('tolère un « + » relu comme une espace', () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses: { ...reponses, effectifDetail: '>>>?' } })).toString('base64');
    expect(d).toContain('+');
    expect(lireParametreD(d.replace(/\+/g, ' '))?.siret).toBe('12345678901234');
  });

  it('valide les réponses avec le schéma', () => {
    const d = Buffer.from(JSON.stringify({ siret: '12345678901234', reponses: { situation: 'x' } })).toString('base64');
    expect(lireParametreD(d)).toBeNull();
  });
});

describe('entreprise trouvée par le navigateur (fiche locale)', () => {
  const entreprise = { nom_complet: 'ACME', siege: { siret: '12345678901234', code_postal: '75001', libelle_commune: 'PARIS' } };

  it('conservée si valide, ignorée si mal formée (la fiche reste lisible)', () => {
    expect(validerFicheLocale({ siret: '12345678901234', reponses, entreprise })?.entreprise).toEqual(entreprise);
    const malFormee = validerFicheLocale({ siret: '12345678901234', reponses, entreprise: { ...entreprise, dirigeants: [] } });
    expect(malFormee?.siret).toBe('12345678901234');
    expect(malFormee).not.toHaveProperty('entreprise');
  });

  it('passe par le cookie', () => {
    const valeur = valeurCookieFicheLocale({ siret: '12345678901234', reponses: reponses as Reponses, entreprise });
    expect(lireCookieFicheLocale(valeur)?.entreprise?.siege?.libelle_commune).toBe('PARIS');
  });

  it('cookie trop gros : l’entreprise est retirée, les réponses restent', () => {
    const grosse = { ...entreprise, nom_complet: 'É'.repeat(250), nom_raison_sociale: 'É'.repeat(250), libelle_activite_principale: 'É'.repeat(200) };
    const valeur = valeurCookieFicheLocale({ siret: '12345678901234', reponses: reponses as Reponses, entreprise: grosse });
    expect(valeur.length).toBeLessThanOrEqual(TAILLE_MAX_COOKIE_FICHE_LOCALE);
    const lu = lireCookieFicheLocale(valeur);
    expect(lu?.reponses.situation).toBe('prevention');
    expect(lu?.entreprise).toBeUndefined();
  });
});
