# Solelis

Plateforme d'aide aux chefs d'entreprise français en difficulté — https://solelis.com

## Installation

Node 22 (voir `.nvmrc`).

```bash
npm install
cp .env.example .env.local
# Renseignez vos clés API
npm run dev
```

## Commandes

```bash
npm run dev          # Serveur local (port 3000), base D1 simulée par Wrangler
npm run build        # Build Next.js de production
npm run lint         # ESLint (CLI, config eslint.config.mjs — next/core-web-vitals)
npm test             # Vitest
npm run test:e2e     # Playwright (parcours utilisateur)

npm run cf:build     # Build du Worker Cloudflare (OpenNext), sans déployer
npm run cf:preview   # Build + aperçu local dans le simulateur Cloudflare (port 8787)
npm run cf:deploy    # Build + mise en ligne sur Cloudflare (Worker « solelis »)
```

## Variables d'environnement

Voir `.env.example`. En production, elles sont définies dans la console
Cloudflare (Worker « solelis » → Paramètres → Variables et secrets).

- `INSEE_API_KEY` — API Sirene INSEE (secours si l'API gouv.fr échoue, optionnelle)
- `GOOGLE_PLACES_API_KEY` — Google Places, recherche d'avocats (optionnelle)
- `RESEND_API_KEY` — envoi d'emails (lien magique, rappels)
- `RESEND_FROM` — expéditeur des emails, ex. `Solelis <contact@exemple.fr>`
- `NEXT_PUBLIC_BASE_URL` — URL publique (liens magiques) : `https://solelis.com` en production
- `CRON_SECRET` — secret partagé entre le Cron Trigger (`worker.ts`) et `/api/cron/rappels`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` — mesure d'audience Plausible (optionnelle)

Les variables `NEXT_PUBLIC_*` sont intégrées au moment du build : elles
doivent aussi être disponibles pour le build Cloudflare.

## Actus et illustrations

- **Actus** : `/actus` (20 actus) et un bloc « Dans l'actualité » en bas des pages situation lisent dans le navigateur
  `https://teiki5320.github.io/veille/actus/solelis.json` (veille préparée à 12 h et 19 h, `lib/veille.ts`, `components/actus/`).
  Aucune actu sur l'accueil. La veille lit les situations sur `/veille/entites.json` (`lib/situations.ts`).
- **Articles des actus** (depuis le 28 octobre 2026) : toute la carte ouvre l'article complet sur le site. Au build,
  `npm run veille` (`scripts/articles-veille.ts`) lit l'index `articles/solelis/index.json` (tous les articles, jamais vidé)
  puis chaque `articles/solelis/<id>.json` sur la veille et construit `/actus/<slug>`
  (0 page si la veille ne répond pas, le build passe) ; les plus récents s'ouvrent sur `/actus/article?id=<id>` (noindex).
  La CI reconstruit le site à 11 h 50 et 18 h 50 UTC. Essai local : `VEILLE_DOSSIER=<dossier> npm run build`.
- **Illustrations** des conseils et des guides : `public/illustrations/` (WebP) et crédits dans `data/illustrations.json`.
  `node scripts/illustrations.mjs` complète seulement les pages sans image (Wikimedia Commons, puis Openverse, sinon carte Solelis).

## Base de données

Cloudflare D1 « solelis » (stockage limité à l'UE), reliée au Worker par le binding `DB`.
Le schéma de la table `fiches` est dans `migrations/` :

```bash
npx wrangler d1 migrations apply DB --local    # base locale (npm run dev / cf:preview)
npx wrangler d1 migrations apply DB --remote   # base en ligne
```

## Stack

Next.js 16.4 App Router · React 19 · Tailwind 3.4 · Framer Motion 11 ·
Cloudflare Workers (OpenNext) + D1 · Resend.
