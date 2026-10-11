import { cache } from 'react';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { CompanyData, FicheRecord, Rappel, Reponses } from './types';

/* Sous-ensemble de l'API D1 utilisé ici (évite d'importer tous les types Workers). */
interface D1Statement {
  bind(...valeurs: unknown[]): D1Statement;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<{ meta?: { changes?: number } }>;
}
export interface D1Database {
  prepare(requete: string): D1Statement;
}

interface LigneFiche {
  token: string;
  siret: string;
  reponses: string;
  company_data: string;
  email: string | null;
  rappels: string | null;
  created_at: string;
}

export interface FicheAvecRappels {
  token: string;
  siret: string;
  rappels: Rappel[];
  company_data: CompanyData;
}

/** Base D1 du Worker (binding `DB`), ou null hors Cloudflare (tests, build). */
export function getDb(): D1Database | null {
  try {
    const env = getCloudflareContext().env as { DB?: D1Database };
    return env.DB ?? null;
  } catch {
    return null;
  }
}

function lireJson<T>(texte: string | null, defaut: T): T {
  if (!texte) return defaut;
  try {
    return JSON.parse(texte) as T;
  } catch {
    return defaut;
  }
}

export async function saveFiche(fiche: FicheRecord): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    await db
      .prepare('INSERT INTO fiches (token, siret, reponses, company_data, email) VALUES (?, ?, ?, ?, ?)')
      .bind(fiche.token, fiche.siret, JSON.stringify(fiche.reponses), JSON.stringify(fiche.company_data), fiche.email ?? null)
      .run();
    return true;
  } catch {
    return false;
  }
}

export async function getFicheByToken(token: string): Promise<FicheRecord | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const ligne = await db.prepare('SELECT * FROM fiches WHERE token = ?').bind(token).first<LigneFiche>();
    if (!ligne) return null;
    return {
      token: ligne.token,
      siret: ligne.siret,
      reponses: lireJson<Reponses>(ligne.reponses, {} as Reponses),
      company_data: lireJson<CompanyData>(ligne.company_data, {} as CompanyData),
      email: ligne.email ?? undefined,
      created_at: ligne.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * getFicheByToken mémorisé le temps d'une requête : le layout de
 * /fiche/[token] (vérification d'existence, vrai 404) et la page partagent
 * une seule lecture en base.
 */
export const getFicheByTokenMemo = cache(getFicheByToken);

export async function updateFicheEmail(token: string, email: string): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    const res = await db.prepare('UPDATE fiches SET email = ? WHERE token = ?').bind(email, token).run();
    return (res.meta?.changes ?? 1) > 0;
  } catch {
    return false;
  }
}

/**
 * Enregistre les données d'entreprise retrouvées après coup (recherche
 * indisponible à la création) : la fiche n'interroge plus l'API à chaque
 * affichage. N'écrit que des données trouvées (fetched) pour ce même SIRET.
 */
export async function updateFicheCompanyData(token: string, company: CompanyData): Promise<boolean> {
  if (!company?.fetched || !/^\d{14}$/.test(company.siret ?? '')) return false;
  const db = getDb();
  if (!db) return false;
  try {
    const res = await db
      .prepare('UPDATE fiches SET company_data = ? WHERE token = ? AND siret = ?')
      .bind(JSON.stringify(company), token, company.siret)
      .run();
    return (res.meta?.changes ?? 1) > 0;
  } catch {
    return false;
  }
}

/** Rappels d'une fiche ([] si aucun), ou null si la fiche n'existe pas. */
export async function getRappels(token: string): Promise<Rappel[] | null> {
  const db = getDb();
  if (!db) return null;
  const ligne = await db.prepare('SELECT rappels FROM fiches WHERE token = ?').bind(token).first<{ rappels: string | null }>();
  if (!ligne) return null;
  return lireJson<Rappel[]>(ligne.rappels, []);
}

export async function setRappels(token: string, rappels: Rappel[]): Promise<boolean> {
  const db = getDb();
  if (!db) return false;
  try {
    await db.prepare('UPDATE fiches SET rappels = ? WHERE token = ?').bind(JSON.stringify(rappels), token).run();
    return true;
  } catch {
    return false;
  }
}

export async function fichesAvecRappels(): Promise<FicheAvecRappels[]> {
  const db = getDb();
  if (!db) return [];
  const { results } = await db
    .prepare('SELECT token, siret, rappels, company_data FROM fiches WHERE rappels IS NOT NULL')
    .all<Pick<LigneFiche, 'token' | 'siret' | 'rappels' | 'company_data'>>();
  return results.map((l) => ({
    token: l.token,
    siret: l.siret,
    rappels: lireJson<Rappel[]>(l.rappels, []),
    company_data: lireJson<CompanyData>(l.company_data, {} as CompanyData),
  }));
}

/** Nombre total de fiches (compteur public du pied de page). */
export async function compterFiches(): Promise<number> {
  const db = getDb();
  if (!db) return 0;
  const ligne = await db.prepare('SELECT COUNT(*) AS n FROM fiches').first<{ n: number }>();
  return ligne?.n ?? 0;
}
