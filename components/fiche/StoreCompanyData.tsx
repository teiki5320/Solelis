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

interface Props {
  company: CompanyData;
  token: string;
  reponses?: Reponses;
  /** Tribunal compétent pour {{TRIBUNAL}} (vide s'il n'est pas connu précisément). */
  tribunal?: string;
}

export default function StoreCompanyData({ company, token, reponses, tribunal }: Props) {
  useEffect(() => {
    try {
      sessionStorage.setItem(
        'solelis_company',
        JSON.stringify({
          NOM_ENTREPRISE: company.nom,
          SIRET: company.siret,
          ADRESSE: adresseComplete(company),
          VILLE: company.ville,
          NOM_DIRIGEANT: '',
          FORME_JURIDIQUE: company.formeJuridique,
          DATE_CREATION: company.dateCreation,
          ACTIVITE: company.nafLabel || company.naf,
          ...(tribunal ? { TRIBUNAL: tribunal } : {}),
        })
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
  }, [company, token, reponses, tribunal]);

  return null;
}
