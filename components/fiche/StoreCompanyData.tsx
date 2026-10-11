'use client';
import { useEffect } from 'react';
import type { CompanyData, Reponses } from '@/lib/types';

/**
 * Adresse complète pour les courriers. L'API recherche-entreprises renvoie
 * déjà « 18 B RUE … 85100 LES SABLES D'OLONNE » : on n'ajoute alors ni le
 * code postal ni la ville une seconde fois. Le repli INSEE ne donne que la
 * voie : on complète avec « code postal ville ».
 */
export function adresseComplete(company: Pick<CompanyData, 'adresse' | 'codePostal' | 'ville'>): string {
  const adresse = (company.adresse ?? '').trim();
  const codePostal = (company.codePostal ?? '').trim();
  const ville = (company.ville ?? '').trim();
  const contientCodePostal = codePostal !== '' && adresse.split(/[\s,]+/).includes(codePostal);
  if (adresse && (contientCodePostal || (!codePostal && !ville))) return adresse;
  const localite = [codePostal, ville].filter(Boolean).join(' ');
  return [adresse, localite].filter(Boolean).join(', ');
}

/**
 * Activité pour les courriers ({{ACTIVITE}}). L'API ne donne souvent que le
 * code NAF (« 43.32A ») : on le précède alors du secteur (« BTP / Construction
 * (code NAF 43.32A) ») plutôt que d'écrire un code seul dans la lettre.
 */
export function activitePourCourrier(
  company: Pick<CompanyData, 'naf' | 'nafLabel'>,
  secteurLabel?: string,
): string {
  const libelle = (company.nafLabel ?? '').trim();
  const estCode = (v: string) => /^\d{2}\.?\d{2}[A-Z]?$/i.test(v);
  if (libelle && !estCode(libelle)) return libelle;
  const naf = (company.naf ?? '').trim() || libelle;
  if (!naf) return '';
  return secteurLabel && secteurLabel !== 'Autre' ? `${secteurLabel} (code NAF ${naf})` : `code NAF ${naf}`;
}

/** « 2015-03-12 » → « 12/03/2015 » ; toute autre valeur est rendue telle quelle. */
function dateFrancaise(iso: string | undefined): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso ?? '').trim());
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (iso ?? '').trim();
}

/**
 * Champs des courriers préremplis depuis la fiche (clé « solelis_company »
 * en sessionStorage). Un champ vide reste à compléter dans le formulaire.
 */
export function donneesCourrierEntreprise(
  company: CompanyData,
  tribunal?: string,
  secteurLabel?: string,
): Record<string, string> {
  const effectif = (company.effectif ?? '').trim();
  return {
    NOM_ENTREPRISE: company.nom,
    SIRET: company.siret,
    ADRESSE: adresseComplete(company),
    VILLE: company.ville,
    NOM_DIRIGEANT: '',
    FORME_JURIDIQUE: company.formeJuridique,
    DATE_CREATION: dateFrancaise(company.dateCreation),
    ACTIVITE: activitePourCourrier(company, secteurLabel),
    ...(effectif && effectif !== 'Non renseigné' ? { EFFECTIF: effectif } : {}),
    ...(tribunal ? { TRIBUNAL: tribunal } : {}),
  };
}

interface Props {
  company: CompanyData;
  token: string;
  reponses?: Reponses;
  /** Tribunal compétent pour {{TRIBUNAL}} (vide s'il n'est pas connu précisément). */
  tribunal?: string;
  /** Libellé du secteur (getSectorInfo), pour {{ACTIVITE}}. */
  secteurLabel?: string;
}

export default function StoreCompanyData({ company, token, reponses, tribunal, secteurLabel }: Props) {
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'solelis_company',
        JSON.stringify(donneesCourrierEntreprise(company, tribunal, secteurLabel))
      );
      if (reponses) {
        sessionStorage.setItem('solelis_reponses', JSON.stringify(reponses));
      }
      // Mémorise la dernière fiche pour « Retrouver votre fiche ».
      // Une fiche locale (non enregistrée) ne peut pas être rouverte par lien :
      // on ne la propose pas, et on retire une ancienne entrée « local ».
      if (token === 'local') {
        const ancienne = localStorage.getItem('solelis_last_fiche');
        if (ancienne && JSON.parse(ancienne)?.token === 'local') {
          localStorage.removeItem('solelis_last_fiche');
        }
      } else {
        localStorage.setItem('solelis_last_fiche', JSON.stringify({
          token,
          nom: company.nom,
          siret: company.siret,
          ts: Date.now(),
        }));
      }
    } catch {}
  }, [company, token, reponses, tribunal, secteurLabel]);

  return null;
}
