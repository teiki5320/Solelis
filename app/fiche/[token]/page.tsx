import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound, unstable_rethrow } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import SaveBanner from '@/components/fiche/SaveBanner';
import ExportPDF from '@/components/fiche/ExportPDF';
import StoreCompanyData from '@/components/fiche/StoreCompanyData';
import LayoutDashboard from '@/components/fiche/layouts/LayoutDashboard';
import { getFicheByTokenMemo } from '@/lib/db';
import { fetchSirene } from '@/lib/sirene';
import { fetchBodaccResultat, fetchProceduresResultat, computeAlertes } from '@/lib/bodacc';
import { searchAvocats } from '@/lib/googlePlaces';
import {
  buildOrganismes,
  buildOrdresProfessionnels,
  buildAidesPersonnelles,
  buildSoutien,
  buildReseauxSpecifiques,
  getDepartement,
  OrganismeCard,
} from '@/lib/organismes';
import { getSectorInfo, getCompanyAge, getEffectifSeuils } from '@/lib/secteur';
import { tokenSchema } from '@/lib/schemas';
import { getJuridiction, nomTribunalPourCourrier } from '@/lib/strategie';
import { formaterSiret } from '@/lib/siret';
import { CLE_FICHE_LOCALE } from '@/lib/ficheLocale';
import { lireCookieFicheLocale, lireParametreD } from '@/lib/ficheLocaleServeur';
import Chargement from './Chargement';
import type { CompanyData, Reponses, BodaccItem } from '@/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Données d'une fiche locale : ancien format ?d=<base64> (toujours lisible),
 * sinon cookie court posé par le navigateur (voir lib/ficheLocale.ts).
 */
async function lireFicheLocale(d?: string) {
  return d
    ? lireParametreD(d)
    : lireCookieFicheLocale((await cookies()).get(CLE_FICHE_LOCALE)?.value);
}

// Les fiches sont des contenus personnels — ne pas indexer.
const ROBOTS = { index: false, follow: false, noarchive: true, nosnippet: true };

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { token } = await params;
  if (token !== 'local') return { robots: ROBOTS };
  // Fiche locale sans données : la page répond 404 (voir FichePage).
  const { d } = await searchParams;
  const locale = await lireFicheLocale(d);
  return locale ? { robots: ROBOTS } : { robots: ROBOTS, title: 'Page introuvable — Solelis' };
}

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ d?: string }>;
}

interface FicheData {
  token: string;
  siret: string;
  reponses: Reponses;
  company_data: CompanyData;
}

async function loadFiche(
  token: string,
  d?: string
): Promise<FicheData | null> {
  if (token === 'local') {
    // Ancien format ?d=<base64> (toujours lisible), sinon cookie court posé par le
    // navigateur (voir lib/ficheLocale.ts) : les réponses ne passent plus par l'URL.
    const locale = await lireFicheLocale(d);
    if (!locale) return null;
    const company_data = await fetchSirene(locale.siret);
    return {
      token: 'local',
      siret: locale.siret,
      reponses: locale.reponses,
      company_data,
    };
  }

  // Token mal formé : inutile d'interroger la base.
  if (!tokenSchema.safeParse(token).success) return null;

  const rec = await getFicheByTokenMemo(token);
  if (!rec) return null;
  let company_data = rec.company_data as CompanyData;
  // Entreprise introuvable à la création (API indisponible) : on retente à l'affichage.
  if (!company_data?.siret || !company_data.fetched) {
    company_data = await fetchSirene(rec.siret);
  }
  return {
    token,
    siret: rec.siret,
    reponses: rec.reponses as Reponses,
    company_data,
  };
}

function ErreurChargement() {
  return (
    <section className="mx-auto max-w-xl px-5 py-20 text-center">
      <h1 className="font-display text-2xl text-navy">Impossible d&apos;afficher cette fiche</h1>
      <p className="mt-4 text-navy/60">Une erreur est survenue lors du chargement. Veuillez réessayer.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-bleu-fonce px-6 py-3 text-white">Retour à l&apos;accueil</Link>
    </section>
  );
}

/**
 * Vérifications rapides AVANT toute frontière de chargement : tant que rien
 * n'est envoyé au navigateur, notFound() donne un vrai statut HTTP 404.
 * (Un loading.tsx de segment figerait le statut à 200 dès le début du
 * streaming : le chargement est donc une <Suspense> placée après ces tests.)
 */
export default async function FichePage({ params, searchParams }: PageProps) {
  const { token } = await params;
  const { d } = await searchParams;

  if (token === 'local') {
    // Fiche locale sans données (cookie expiré, ancien lien…) : vrai 404.
    // La page 404 de ce segment (not-found.tsx) relit encore l'onglet
    // (sessionStorage) et recharge la fiche si elle y est.
    const locale = await lireFicheLocale(d);
    if (!locale) notFound();
  } else if (!tokenSchema.safeParse(token).success || !(await getFicheByTokenMemo(token))) {
    notFound();
  }

  return (
    <Suspense fallback={<Chargement />}>
      <ContenuFiche token={token} d={d} />
    </Suspense>
  );
}

async function ContenuFiche({ token, d }: { token: string; d?: string }) {
  let data: FicheData | null;
  try {
    data = await loadFiche(token, d);
  } catch (e) {
    console.error('[fiche] erreur de chargement :', e instanceof Error ? e.message : e);
    return <ErreurChargement />;
  }

  // Cas déjà écartés avant la frontière de chargement (voir FichePage).
  if (!data) notFound();

  try {
    return await renderFiche(data);
  } catch (e) {
    unstable_rethrow(e);
    console.error('[fiche] CRASH:', e);
    return <ErreurChargement />;
  }
}

async function renderFiche(data: FicheData) {
  const { token, siret, reponses, company_data } = data;

  let bodacc: BodaccItem[] = [];
  let infogreffe: BodaccItem[] = [];
  // Par défaut « indisponible » : on ne conclut jamais à l'absence d'annonce
  // si le BODACC n'a pas pu être interrogé.
  let bodaccIndisponible = true;
  let avocatsRaw: Awaited<ReturnType<typeof searchAvocats>> = [];

  try {
    const [resBodacc, resProcedures, avocats] = await Promise.all([
      fetchBodaccResultat(siret),
      fetchProceduresResultat(siret),
      searchAvocats(company_data.ville || company_data.departement).catch(() => []),
    ]);
    bodacc = resBodacc.annonces;
    infogreffe = resProcedures.annonces;
    bodaccIndisponible =
      resBodacc.statut === 'indisponible' || resProcedures.statut === 'indisponible';
    avocatsRaw = avocats;
  } catch {}

  const alertes = computeAlertes(bodacc, infogreffe, reponses.situation, {
    bodaccDisponible: !bodaccIndisponible,
  });
  const dep = getDepartement(company_data.departement);

  const avocats: OrganismeCard[] = avocatsRaw.map((p) => ({
    nom: p.name,
    // Résultats Google Places : la spécialité n'est pas vérifiée (un cabinet de
    // droit immobilier peut sortir) → étiquette neutre.
    type: 'Avocat à proximité',
    adresse: p.address,
    note: p.rating,
    avis: p.reviews,
    telephone: p.phone,
    mapsUrl: p.mapsUrl,
  }));

  let sector: ReturnType<typeof getSectorInfo>;
  let companyAge: number | null;
  let seuils: ReturnType<typeof getEffectifSeuils>;
  let groupes: ReturnType<typeof buildOrganismes>;
  try {
    sector = getSectorInfo(company_data);
    companyAge = getCompanyAge(company_data.dateCreation);
    seuils = getEffectifSeuils(company_data.effectif);
    const groupesBase = buildOrganismes(
      dep,
      reponses,
      avocats,
      sector.secteur,
      company_data.effectif,
      getJuridiction(company_data),
    );
    const groupeOrdres = buildOrdresProfessionnels(sector);
    const groupeSoutien = buildSoutien(reponses);
    const groupeAidesPerso = buildAidesPersonnelles(reponses);
    const groupesReseaux = buildReseauxSpecifiques(reponses, sector);
    groupes = [
      ...groupesBase,
      ...(groupeOrdres ? [groupeOrdres] : []),
      groupeSoutien,
      groupeAidesPerso,
      ...groupesReseaux,
    ];
  } catch (e) {
    console.error('[fiche] Erreur calcul données:', e);
    sector = getSectorInfo({ ...company_data, naf: '' });
    companyAge = null;
    seuils = { approx: 0, cse: false, obligations50: false };
    groupes = [];
  }

  const moralFragile = reponses.moral === 'epuise' || reponses.moral === 'perdu';

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-5 pb-24 sm:space-y-6">
      {/* Print-only header */}
      <div className="print-header hidden">
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '22pt', letterSpacing: '0.05em' }}>Solelis</p>
        <p style={{ fontSize: '10pt', color: '#666', marginTop: '4px' }}>
          Fiche confidentielle · {company_data.nom} · SIRET {formaterSiret(company_data.siret)}
        </p>
      </div>

      <div className="no-print flex items-center justify-between">
        <ExportPDF companyName={company_data.nom} />
      </div>

      {moralFragile && (
        <div
          role="note"
          className="rounded-2xl border border-vert/30 bg-vert/10 p-5 text-sm text-navy"
        >
          <p className="font-display text-base text-vert sm:text-lg">
            Nous avons vu votre réponse. Merci de votre honnêteté.
          </p>
          <p className="mt-2">
            APESA est disponible dès aujourd&apos;hui — gratuitement, en
            confidentialité.{' '}
            <a
              href="https://www.apesa-france.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-vert underline underline-offset-4"
            >
              apesa-france.com
            </a>
          </p>
        </div>
      )}

      <StoreCompanyData
        company={company_data}
        token={token}
        reponses={reponses}
        tribunal={nomTribunalPourCourrier(company_data)}
        secteurLabel={sector.label}
      />

      {!company_data.fetched && (
        <div role="note" className="dashed-band p-4 text-sm text-navy sm:p-5">
          <p className="font-medium">
            Nous n&apos;avons pas trouvé votre entreprise (SIRET {formaterSiret(siret)}).
          </p>
          <p className="mt-1 text-xs text-navy/60">
            Le numéro est peut-être mal saisi, ou le répertoire de l&apos;INSEE n&apos;a pas
            répondu. Les conseils ci-dessous restent valables, mais sans votre forme
            juridique, votre activité ni votre département.{' '}
            <Link href="/" className="underline underline-offset-2">
              Vérifier le numéro SIRET
            </Link>
          </p>
        </div>
      )}

      {token !== 'local' ? (
        <SaveBanner token={token} />
      ) : (
        <div role="note" className="dashed-band p-4 text-sm text-navy sm:p-5">
          <p className="font-medium">Cette fiche n&apos;a pas pu être enregistrée.</p>
          <p className="mt-1 text-xs text-navy/60">
            Elle reste visible uniquement dans cet onglet, pendant environ une heure, et
            ne pourra pas être retrouvée par e-mail. Pensez à l&apos;exporter en PDF.
          </p>
        </div>
      )}

      <LayoutDashboard
        token={token}
        company={company_data}
        reponses={reponses}
        sector={sector}
        alertes={alertes}
        bodacc={bodacc}
        infogreffe={infogreffe}
        bodaccIndisponible={bodaccIndisponible}
        groupes={groupes}
        companyAge={companyAge}
        seuils={seuils}
      />

      <p className="pt-6 text-center text-xs text-navy/45">
        Cette fiche ne remplace pas un conseil personnalisé. Elle vous aide à
        y voir clair et à mobiliser les bons interlocuteurs.
      </p>

      {/* Print-only footer */}
      <div className="print-footer hidden">
        <p>Solelis · Accompagnement gratuit, confidentiel, sans jugement</p>
        <p>Cette fiche ne remplace pas un conseil personnalisé.</p>
      </div>
    </section>
  );
}
