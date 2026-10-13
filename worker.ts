// Point d'entrée du Worker : le site Next.js (généré par OpenNext)
// + l'envoi quotidien des rappels email (Cron Trigger).
// @ts-expect-error `.open-next/worker.js` est généré au build.
import { default as handler } from './.open-next/worker.js';

interface Env {
  CRON_SECRET?: string;
  NEXT_PUBLIC_BASE_URL?: string;
  CF_VERSION_METADATA?: { id: string };
}

// En-têtes de sécurité ajoutés à toutes les réponses du Worker
// (les fichiers statiques reçoivent les mêmes via public/_headers).
const ENTETES_SECURITE: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Frame-Options': 'DENY',
  'Content-Security-Policy': "frame-ancestors 'none'",
};

// Réponses coûteuses en calcul mises en cache au bord du réseau Cloudflare (en secondes).
const CACHE_ROUTES: Record<string, number> = {
  '/api/og': 7 * 24 * 3600,
  '/api/stats': 300,
};

// Pages publiques rendues à chaque visite (articles programmés filtrés par date) mais
// identiques pour tous : mises en cache 1 h pour rester sous la limite de calcul.
// La clé contient la version déployée, sinon on servirait après une mise en ligne
// du HTML qui pointe vers des fichiers JS/CSS supprimés.
const CACHE_PAGES_SECONDES = 3600;
function estPageEnCache(chemin: string): boolean {
  return chemin === '/sitemap.xml' || chemin === '/conseils' || chemin.startsWith('/conseils/');
}

function avecEntetes(res: Response): Response {
  const copie = new Response(res.body, res);
  for (const [nom, valeur] of Object.entries(ENTETES_SECURITE)) copie.headers.set(nom, valeur);
  return copie;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // http → https, et www.solelis.com → solelis.com (redirections permanentes).
    const domaineSolelis = url.hostname === 'solelis.com' || url.hostname === 'www.solelis.com';
    if (domaineSolelis && (url.protocol === 'http:' || url.hostname === 'www.solelis.com')) {
      url.protocol = 'https:';
      if (url.hostname === 'www.solelis.com') url.hostname = 'solelis.com';
      return Response.redirect(url.toString(), 301);
    }

    // Les requêtes de navigation interne de Next (RSC) renvoient un autre format : jamais en cache.
    const requeteRsc =
      request.headers.has('rsc') || request.headers.has('next-router-prefetch') || url.searchParams.has('_rsc');
    const page = request.method === 'GET' && !requeteRsc && estPageEnCache(url.pathname);
    const duree = request.method === 'GET' ? (CACHE_ROUTES[url.pathname] ?? (page ? CACHE_PAGES_SECONDES : undefined)) : undefined;
    const cache = duree ? (caches as unknown as { default: Cache }).default : undefined;
    let cle: Request = request;
    if (cache && page) {
      const versionnee = new URL(url);
      versionnee.searchParams.set('__version', env.CF_VERSION_METADATA?.id ?? 'local');
      cle = new Request(versionnee.toString(), { method: 'GET' });
    }
    if (cache) {
      const enCache = await cache.match(cle);
      if (enCache) return enCache;
    }

    const reponse = avecEntetes(await handler.fetch(request, env, ctx));

    if (cache && duree && reponse.status === 200) {
      if (page) {
        // Copie stockée 1 h au bord du réseau ; le navigateur garde l'en-tête d'origine.
        const copie = reponse.clone();
        const stockee = new Response(copie.body, copie);
        stockee.headers.set('Cache-Control', `public, max-age=${duree}`);
        ctx.waitUntil(cache.put(cle, stockee));
      } else {
        reponse.headers.set('Cache-Control', `public, max-age=${duree}`);
        ctx.waitUntil(cache.put(cle, reponse.clone()));
      }
    }
    return reponse;
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    const base = env.NEXT_PUBLIC_BASE_URL || 'https://solelis.com';
    const requete = new Request(`${base}/api/cron/rappels`, {
      headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
    });
    ctx.waitUntil(
      (async () => {
        const res = await handler.fetch(requete, env, ctx);
        const corps = (await res.text()).slice(0, 300);
        // Journalisé pour repérer un secret manquant (401) ou une panne.
        const niveau = res.ok ? 'log' : 'error';
        console[niveau]('[CRON rappels]', res.status, corps);
      })(),
    );
  },
} satisfies ExportedHandler<Env>;
