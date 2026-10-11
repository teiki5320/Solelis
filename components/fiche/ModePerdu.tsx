'use client';
import { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { useFiche } from '@/lib/FicheContext';
import { contactCotisations } from '@/lib/organismes';

/** Cible du focus quand on quitte le mode perdu (titre de la fiche, IdentiteHero). */
export const ID_TITRE_FICHE = 'fiche-titre';

/**
 * Mode « perdu » radical : affiché tout en haut de la fiche quand
 * reponses.moral === 'perdu'. L'objectif est de réduire la charge
 * cognitive à 3 informations max : qui appeler, 1 action cette
 * semaine, on reprend demain.
 *
 * L'utilisateur peut « masquer » et accéder à la fiche complète, ou
 * « rester en mode simple » et avoir toute sa fiche réduite.
 */
export default function ModePerdu() {
  const { reponses, company, sector } = useFiche();
  const [masque, setMasque] = useState(false);

  // Le bouton « Voir tout » disparaît avec le bloc : on place le focus sur
  // le titre de la fiche pour ne pas le perdre (navigation clavier, lecteur d'écran).
  useEffect(() => {
    if (masque) document.getElementById(ID_TITRE_FICHE)?.focus();
  }, [masque]);

  if (reponses.moral !== 'perdu' || masque) return null;

  const ville = company.ville;
  const dep = company.departement || '';

  // 1 contact prioritaire selon la situation
  const contact = (() => {
    if (reponses.situation === 'assignation') {
      return {
        nom: 'Avocat en droit des entreprises en difficulté',
        action: 'Sous 48 h · consultation gratuite possible en point-justice (3039)',
        tel: null as string | null,
        site: 'https://www.cnb.avocat.fr/annuaire-des-avocats-de-france',
        labelSite: 'Trouver un avocat',
      };
    }
    if (reponses.situation === 'redressement') {
      return {
        nom: 'CIP — Centre d\'Information sur la Prévention',
        action: 'RDV gratuit et confidentiel avec un expert-comptable, un avocat et un ancien juge',
        tel: null as string | null,
        site: 'https://www.cip-national.fr',
        labelSite: 'cip-national.fr',
      };
    }
    return {
      nom: 'Banque de France · Correspondant TPE-PME',
      action: 'Échange gratuit pour faire le point et vous orienter',
      tel: '3414',
      site: 'https://entreprises.banque-france.fr',
      labelSite: 'entreprises.banque-france.fr',
    };
  })();

  // 1 action cette semaine
  const actionSemaine = (() => {
    if (reponses.situation === 'assignation') {
      return 'Appelez un avocat aujourd\'hui. Présentez-vous à l\'audience ou faites-vous représenter — sinon le tribunal décide sans vous.';
    }
    if (reponses.situation === 'redressement') {
      return 'Vous avez 45 jours pour déclarer la cessation. Cette semaine : appeler 1 avocat ou le CIP. Pas plus.';
    }
    if (reponses.probleme === 'urssaf' || reponses.probleme === 'impots') {
      if (reponses.probleme === 'impots') {
        return 'Cette semaine : 1 message à votre service des impôts des entreprises (SIE) pour demander un délai. Rien d\'autre.';
      }
      const cot = contactCotisations(sector, reponses.effectif, dep);
      return `Cette semaine : 1 coup de fil à ${cot.orgAvecArticle} (${cot.telLibelle}) pour demander un délai. Rien d'autre.`;
    }
    return 'Cette semaine : appelez le 34 14 (Banque de France). 10 minutes au téléphone suffisent pour commencer.';
  })();

  return (
    <m.section
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border-2 border-vert/40 bg-gradient-to-br from-vert/10 via-white to-vert/5 p-6 shadow-glass sm:p-8"
      role="region"
      aria-label="Mode urgence — 3 informations essentielles"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-2xl text-navy sm:text-3xl">
            On commence par 3 choses. Pas plus.
          </p>
          <p className="mt-2 text-sm text-navy/70">
            Vous avez dit que vous ne savez plus où donner de la tête. C&apos;est normal,
            on vous a entendu. Le reste de la fiche est en bas si vous voulez. Pour
            l&apos;instant, juste ces trois points.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setMasque(true)}
          className="no-print shrink-0 rounded-full bg-white/80 px-3 py-1.5 text-xs text-navy/70 hover:bg-white"
        >
          Voir tout
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {/* 1. Qui appeler */}
        <div className="rounded-2xl border border-vert/30 bg-white/80 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-vert">
            1 · Qui appeler
          </p>
          <p className="mt-2 font-display text-base text-navy">{contact.nom}</p>
          <p className="mt-2 text-xs text-navy/70">{contact.action}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {contact.tel && (
              <a
                href={`tel:${contact.tel.replace(/\s/g, '')}`}
                className="rounded-full bg-vert-fonce px-4 py-2 font-medium text-white hover:bg-vert-fonce/90"
              >
                <span aria-hidden>☎</span> {contact.tel}
              </a>
            )}
            <a
              href={contact.site}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-3 py-2 text-navy/80 ring-1 ring-navy/15 hover:bg-navy/5"
            >
              <span aria-hidden>🌐</span> {contact.labelSite}
            </a>
          </div>
        </div>

        {/* 2. Une action cette semaine */}
        <div className="rounded-2xl border border-vert/30 bg-white/80 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-vert">
            2 · Cette semaine
          </p>
          <p className="mt-2 font-display text-base text-navy">Une seule action</p>
          <p className="mt-2 text-xs text-navy/70">{actionSemaine}</p>
        </div>

        {/* 3. Quelqu'un pour vous, vous */}
        <div className="rounded-2xl border border-vert/30 bg-white/80 p-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-vert">
            3 · Pour vous, vous
          </p>
          <p className="mt-2 font-display text-base text-navy">Vous n&apos;êtes pas seul·e</p>
          <p className="mt-2 text-xs text-navy/70">
            <strong>APESA</strong> — soutien psychologique gratuit pour
            dirigeant·e·s, gratuit et confidentiel (apesa-france.com). Si c&apos;est très lourd ce soir : <strong>3114</strong>{' '}
            (prévention suicide, 24h/24, gratuit, anonyme).
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a
              href="tel:3114"
              className="rounded-full bg-rouge px-4 py-2 font-medium text-white hover:bg-rouge/90"
            >
              <span aria-hidden>☎</span> 3114
            </a>
            <a
              href="https://www.apesa-france.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white px-3 py-2 text-navy/80 ring-1 ring-navy/15 hover:bg-navy/5"
            >
              <span aria-hidden>🌐</span> apesa-france.com
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-navy/5 px-5 py-4 text-sm text-navy/75">
        <p>
          <strong>On reprend demain.</strong> Vous n&apos;avez pas à tout
          comprendre aujourd&apos;hui. Cette fiche est sauvegardée — vous la
          retrouverez plus tard avec un email{ville ? ` (les démarches à ${ville} sont déjà préparées)` : ''}.
        </p>
      </div>
    </m.section>
  );
}
