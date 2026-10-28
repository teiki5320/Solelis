'use client';

import { useEffect } from 'react';

/** Jeton public du site « solelis.com » dans Cloudflare Web Analytics (visible par tous dans la page : pas un secret). */
export const JETON_WEB_ANALYTICS = '0d0bce21e0e24777bc118b52807eeff6';

/**
 * Pages jamais mesurées : l'adresse d'une fiche (/fiche/<token>) est son secret d'accès,
 * celle du questionnaire contient le SIRET saisi (?siret=…).
 */
export function pageMesurable(chemin: string): boolean {
  return !/^\/(fiche|questionnaire)(\/|$)/.test(chemin);
}

/**
 * Mesure d'audience Cloudflare Web Analytics : sans cookie ni stockage dans le navigateur.
 * Le script n'est chargé qu'à l'arrivée sur une page mesurable, avec `spa: false` :
 * seule la page d'arrivée est comptée, jamais la suite de la navigation (questionnaire, fiche).
 */
export default function MesureAudience() {
  useEffect(() => {
    if (!pageMesurable(window.location.pathname)) return;
    if (document.querySelector('script[data-cf-beacon]')) return;
    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.dataset.cfBeacon = JSON.stringify({ token: JETON_WEB_ANALYTICS, spa: false });
    document.head.appendChild(script);
  }, []);
  return null;
}
