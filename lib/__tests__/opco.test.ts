import { describe, it, expect } from 'vitest';
import { getOpcoFromNaf, OPCO_DATA } from '../opco';

describe('getOpcoFromNaf', () => {
  it('renvoie OCAPIAT pour l\'agriculture', () => {
    expect(getOpcoFromNaf('01.11Z').cle).toBe('ocapiat');
    expect(getOpcoFromNaf('03.11Z').cle).toBe('ocapiat');
  });

  it('renvoie Constructys pour le BTP', () => {
    expect(getOpcoFromNaf('41.20A').cle).toBe('opco-construction');
    expect(getOpcoFromNaf('43.91A').cle).toBe('opco-construction');
  });

  it('renvoie OPCO 2i pour l\'industrie', () => {
    expect(getOpcoFromNaf('13.10Z').cle).toBe('opco-2i');
    expect(getOpcoFromNaf('25.62A').cle).toBe('opco-2i');
  });

  it('renvoie OPCO Mobilités pour le transport', () => {
    expect(getOpcoFromNaf('49.32Z').cle).toBe('opco-mobilites'); // taxis/VTC
    expect(getOpcoFromNaf('45.20A').cle).toBe('opco-mobilites'); // garage auto
  });

  it('renvoie AKTO pour l\'HCR', () => {
    expect(getOpcoFromNaf('56.10A').cle).toBe('akto'); // restaurant
    expect(getOpcoFromNaf('55.20Z').cle).toBe('akto'); // hôtel
  });

  it('renvoie OPCO Santé pour la santé humaine', () => {
    expect(getOpcoFromNaf('86.10Z').cle).toBe('opco-sante');
    expect(getOpcoFromNaf('87.30A').cle).toBe('opco-sante');
  });

  it('renvoie ATLAS pour les services financiers', () => {
    expect(getOpcoFromNaf('64.19Z').cle).toBe('atlas'); // banque
    expect(getOpcoFromNaf('65.11Z').cle).toBe('atlas'); // assurance
  });

  it('renvoie AFDAS pour la culture/médias', () => {
    expect(getOpcoFromNaf('59.11A').cle).toBe('afdas'); // prod cinéma
    expect(getOpcoFromNaf('90.01Z').cle).toBe('afdas'); // arts spectacle
  });

  it('renvoie OPCO EP pour l\'artisanat de proximité', () => {
    expect(getOpcoFromNaf('96.02A').cle).toBe('opco-ep'); // coiffure
    expect(getOpcoFromNaf('96.02B').cle).toBe('opco-ep'); // soins de beauté
  });

  it('raffinements par classe : boulangerie, pharmacie, auto-école', () => {
    expect(getOpcoFromNaf('10.71C').cle).toBe('opco-ep'); // boulangerie artisanale (branche boulangerie)
    expect(getOpcoFromNaf('10.89Z').cle).toBe('ocapiat'); // industrie agroalimentaire = OCAPIAT inchangé
    expect(getOpcoFromNaf('47.73Z').cle).toBe('opco-ep'); // pharmacie d'officine
    expect(getOpcoFromNaf('47.11D').cle).toBe('opcommerce'); // supermarché = Opcommerce inchangé
    expect(getOpcoFromNaf('85.53Z').cle).toBe('opco-mobilites'); // auto-école (services de l'automobile)
    expect(getOpcoFromNaf('85.59A').cle).toBe('akto'); // formation continue (organismes de formation → AKTO)
  });

  it('renvoie OPCO EP pour les vétérinaires (75)', () => {
    expect(getOpcoFromNaf('75.00Z').cle).toBe('opco-ep');
  });

  it('renvoie OPCO 2i pour extraction, énergie, eau et déchets', () => {
    expect(getOpcoFromNaf('08.11Z').cle).toBe('opco-2i'); // carrières
    expect(getOpcoFromNaf('35.11Z').cle).toBe('opco-2i'); // production électricité
    expect(getOpcoFromNaf('38.11Z').cle).toBe('akto'); // collecte déchets : AKTO majoritaire (France compétences)
  });

  it('suit l\'OPCO majoritaire publié par France compétences', () => {
    expect(getOpcoFromNaf('62.01Z').cle).toBe('atlas'); // programmation informatique (Syntec)
    expect(getOpcoFromNaf('70.22Z').cle).toBe('atlas'); // conseil de gestion
    expect(getOpcoFromNaf('69.10Z').cle).toBe('opco-ep'); // avocats, notaires
    expect(getOpcoFromNaf('69.20Z').cle).toBe('atlas'); // experts-comptables
    expect(getOpcoFromNaf('71.11Z').cle).toBe('opco-ep'); // architecture
    expect(getOpcoFromNaf('61.10Z').cle).toBe('afdas'); // télécommunications
    expect(getOpcoFromNaf('46.90Z').cle).not.toBe('autre');
    expect(getOpcoFromNaf('46.21Z').cle).toBe('ocapiat'); // gros céréales
    expect(getOpcoFromNaf('47.22Z').cle).toBe('opco-ep'); // boucherie
    expect(getOpcoFromNaf('88.10A').cle).toBe('uniformation'); // aide à domicile
    expect(getOpcoFromNaf('86.23Z').cle).toBe('opco-ep'); // cabinets dentaires
    expect(getOpcoFromNaf('85.20Z').cle).toBe('akto'); // enseignement privé
    expect(getOpcoFromNaf('81.30Z').cle).toBe('ocapiat'); // paysagistes
    expect(getOpcoFromNaf('84.11Z').cle).toBe('autre'); // emploi public : pas d'OPCO
  });

  it('renvoie OPCO Mobilités pour les agences de voyage (79)', () => {
    expect(getOpcoFromNaf('79.11Z').cle).toBe('opco-mobilites');
  });

  it('renvoie Uniformation pour les associations (94)', () => {
    expect(getOpcoFromNaf('94.99Z').cle).toBe('uniformation');
  });

  it('renvoie un OPCO valide même pour un NAF inconnu', () => {
    const opco = getOpcoFromNaf('99.99Z');
    expect(opco).toBeDefined();
    expect(opco.cle).toBe('autre');
  });

  it('tolère les codes NAF mal formattés', () => {
    expect(() => getOpcoFromNaf('')).not.toThrow();
    expect(() => getOpcoFromNaf('XX')).not.toThrow();
    expect(() => getOpcoFromNaf('4520')).not.toThrow();
  });

  it('expose OPCO_DATA avec les 12 OPCO', () => {
    const cles = Object.keys(OPCO_DATA);
    expect(cles).toHaveLength(12);
    expect(cles).toContain('akto');
    expect(cles).toContain('afdas');
    expect(cles).toContain('autre');
  });
});
