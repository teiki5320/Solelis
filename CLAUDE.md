# Solelis

Plateforme SaaS (Next.js 15) d'aide aux dirigeants d'entreprise en difficulté en France.
Le dirigeant entre son SIRET, répond à un questionnaire, et reçoit une fiche personnalisée (stratégie, courriers, échéances, aides, annuaires).

## Commandes

```bash
npm run dev      # Serveur local (port 3000)
npm run build    # Build de production
npm run lint     # ESLint CLI (eslint.config.mjs : next/core-web-vitals)
npm test         # Vitest (715 tests dans lib/__tests__/, components/__tests__/, app/api/__tests__/, app/outils/__tests__/)
npm run test:e2e # Playwright (parcours utilisateur)
```

Hébergement : Worker Cloudflare « solelis » via OpenNext (`wrangler.jsonc`, `worker.ts`), déployé depuis `main` → https://solelis.com

```bash
npm run cf:build     # Build du Worker (OpenNext), sans déployer
npm run cf:preview   # Aperçu local dans le simulateur Cloudflare (port 8787)
npm run cf:deploy    # Build + mise en ligne sur Cloudflare
```

## Stack

- **Framework** : Next.js 15.5.x App Router, TypeScript, React 19 — Node 22 (`.nvmrc`)
- **CSS** : Tailwind 3.4 (JIT) + classes custom (voir `tailwind.config.js`)
- **Animations** : Framer Motion 11 (avec `LazyMotion` pour réduire le bundle)
- **UI** : Glass morphism (backdrop-blur, ombres glass), polices Playfair Display + Outfit
- **BDD** : Cloudflare D1 « solelis » (juridiction UE, binding `DB`, schéma dans `migrations/`) — table `fiches` : token/siret/reponses/company_data/email/rappels (JSON en texte)
- **Email** : Resend (magic link pour retrouver sa fiche + rappels cron quotidiens)
- **APIs externes** : INSEE Sirene (gouv.fr + INSEE fallback), BODACC, Google Places (avocats locaux), Infogreffe (signaux)
- **Validation** : Zod (schémas dans `lib/schemas.ts`)
- **Tests** : Vitest (715 tests, 53 fichiers) + Playwright (E2E)
- **CI** : GitHub Actions, Node 22 (lint → tsc → build → test → `opennextjs-cloudflare build`)
- **Rate limiting** : middleware in-memory (propre à chaque instance du Worker) — limiteur Cloudflare à venir
- **PWA** : manifest.json + icônes 512/192/favicon

## Variables d'environnement

Voir `.env.example` — clés nécessaires en production :
`INSEE_API_KEY`, `GOOGLE_PLACES_API_KEY`, `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_BASE_URL`, `CRON_SECRET`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optionnel)

## Architecture

```
app/
  page.tsx                    # Home — saisie SIRET
  questionnaire/              # 18 étapes (8 base + 10 optionnelles dont nationalite)
  fiche/[token]/              # Fiche personnalisée (dashboard, SSR)
  situation/[slug]/           # 4 pages informatives par situation
  courriers/[slug]/           # 17 modèles de courriers (page serveur + CourrierDetail client, SSG)
  outils/                     # 11 calculateurs (ATI, licenciement, prescription, AGS, stocks, seuils, etc.)
  annuaires/                  # 4 annuaires (mandataires, CIP, AGS, TAE)
  accompagnant/               # Parcours « j'accompagne un proche » + bandeau urgence + code postal
  faq/                        # FAQ avec JSON-LD FAQPage
  temoignages/                # 4 témoignages anonymisés
  api/fiche/                  # POST création fiche + GET récupération
  api/fiche/send-link/        # Envoi magic link par email
  api/fiche/rappels/          # POST programmer un rappel
  api/cron/rappels/           # GET cron quotidien (Cron Trigger Cloudflare 7h UTC, worker.ts)
  api/og/                     # Image OG dynamique (runtime Node, autorisée dans robots.txt)
  api/stats/                  # Stats agrégées
  sitemap.ts, robots.ts       # SEO
  error.tsx, loading.tsx, not-found.tsx, global-error.tsx  # Error boundaries

components/
  fiche/
    dashboard/                # IdentiteHero, PriorityCards (splitté), QuickLinks, SectionNav, StrategieHero
    layouts/LayoutDashboard   # Layout principal de la fiche (FicheProvider)
    BlocAccordeon.tsx         # Composant accordéon (aria-expanded/controls/region)
    Bloc*.tsx                 # 37 blocs (accordéons interactifs)
    ModePerdu.tsx             # Carte radicale (3 infos max) si moral === 'perdu'
    ProgressTracker.tsx       # Suivi de progression (localStorage)
  Questionnaire.tsx           # 17 slides (5 nouveaux : pgeEnCours, rqth, conjointStatut, coGerants, saisonnalite)
  SiretInput.tsx              # Input SIRET avec validation
  Nav.tsx                     # Navigation (focus trap, aria-current, Escape ferme menu)
  Background.tsx              # Animations blob framer-motion
  Compteur.tsx                # Compteur de fiches créées
  LazyMotionProvider.tsx      # Wrapper LazyMotion (tree-shaking framer)

lib/
  types.ts                    # Types partagés (Reponses, CompanyData, Rappel, etc.)
  strategie.ts                # Moteur stratégie (5 axes) + getJuridiction() (TJ vs TC) + getFormeDetail() (micro/ei/eirl/societe)
  priorites.ts                # Scoring 13 cartes prioritaires (top 4 sélectionnées)
  courriers.ts                # 17 courriers, personnalisation tone/situation
  secteur.ts                  # 18 secteurs (BTP, agri, HCR, santé, libéral, pêche, ESS, services, culture-sport…) + caisses retraite + ordres + CSP
  aidesRegionales.ts          # Aides régionales (13 régions + DOM)
  bodacc.ts                   # Détection incohérences BODACC vs situation
  tone.ts                     # Présets de ton (combatif/épuisé/perdu)
  ics.ts                      # Génération fichiers ICS
  sirene.ts                   # API gouv.fr + INSEE fallback
  db.ts                       # Accès à la base D1 (fiches, rappels, stats)
  resend.ts                   # Envoi d'emails
  googlePlaces.ts             # Recherche avocats via Google Places
  organismes.ts               # buildOrganismes + buildOrdresProfessionnels + buildAidesPersonnelles + buildSoutien + buildReseauxSpecifiques
  schemas.ts                  # Schémas Zod pour validation API
  hooks.ts                    # useLocalStorage
  FicheContext.tsx            # React Context pour la fiche (utilisé par 18 blocs)
  __tests__/                  # Tests Vitest (715 au total : lib + components + API routes + outils)
  opco.ts                     # Mapping NAF → OPCO (11 OPCO de la branche)

data/
  organismes.json             # 107 territoires (96 dpts + 11 DOM-TOM), ~20 organismes par dpt

middleware.ts                 # Rate limiting (in-memory ; limiteur Cloudflare à venir)
worker.ts                     # Entrée du Worker Cloudflare + Cron rappels quotidiens 7h
```

## Couleurs Tailwind custom

| Token        | Hex       | Usage                      |
|-------------|-----------|----------------------------|
| `navy`      | `#0A1628` | Texte principal, fonds     |
| `bleu`      | `#4A72B8` | Axe restructurer, liens    |
| `bleu-fonce`| `#1E3D82` | Accents, boutons           |
| `rouge`     | `#C94040` | Axe rebondir, alertes      |
| `jaune`     | `#C97830` | Axe céder, warnings        |
| `vert`      | `#28A050` | Axe sauvegarder, succès    |
| `vert-fonce`| `#166E34` | Boutons verts à texte blanc (AA) |
| `jaune-fonce`| `#8A5418` | Texte orange lisible (AA) sur fond clair |

En thème clair, `text-vert` et `text-jaune` sont rendus avec les variantes foncées (règle dans `app/globals.css`) ; `text-navy/40` à `/60` ont un plancher de contraste AA. Textes informatifs : 12 px minimum (`text-xs`).

## Conventions

- **Langue du code** : noms de variables/fonctions en français (ex: `reponses`, `effectifDetail`, `situationFragments`)
- **Langue UI** : tout en français, formulations inclusives (seul·e·s)
- **Tailwind JIT** : ne jamais utiliser de template literals pour les classes dynamiques (`bg-${color}/15`). Utiliser des maps statiques (ex: `PASTILLE_CLASSES`)
- **Entités HTML** : utiliser directement les caractères UTF-8 dans le JSX (é, è, ê, à…), pas les entités (&eacute; etc.). Exceptions JSX : `&apos;`, `&lt;`, `&gt;`, `&amp;`
- **Liens externes** : toujours `target="_blank" rel="noreferrer"`. URLs gouvernementales avec `www.` (ex: `https://www.impots.gouv.fr`)
- **Sources** : ne citer que des sources officielles (codes de loi, sites .gouv.fr). Pas de stats sans source vérifiable
- **URSSAF** : `36 98` travailleurs indépendants, `39 57` employeurs (urssaf.fr) ; MSA : pas de numéro national, numéro de la caisse locale (msa.fr) ; CGSS Outre-mer : `39 57` employeurs, `36 98` indépendants (sites des CGSS, annuaire service-public)
- **Tribunal** : `getJuridiction(company)` → TJ pour libéraux/agri/santé (NAF 69-74, 01-03, 86-88), TC sinon (loi 22 déc. 2021)
- **Commits** : format conventionnel `type(scope): message` en français
- **Métadonnées** : pas de title/description/url dans l'openGraph racine (chaque page hérite des siens) ; `ogMeta({ …, chemin })` ajoute og:url + canonique. Les titres de page incluent déjà « Solelis » (pas de modèle de titre global)
- **Cibles tactiles** : 44 × 44 px minimum (pseudo-élément `before:-inset-*` si le visuel doit rester petit)
- **Print** : classes `no-print` sur les éléments à masquer en impression
- **Animations** : utiliser `m.div` au lieu de `motion.div` (LazyMotion)
- **Framer Motion** : opérateurs `??` et `?:` à parenthéser explicitement (précédence)

## Données clés

- **Reponses** : 18 champs (situation, probleme, effectif, effectifDetail, moral, caution, regime, patrimoine, vente, montantDettes, ageDirigeant, franchise, antecedents, pgeEnCours, rqth, conjointStatut, coGerants, saisonnalite, **nationalite**)
- **CompanyData** : données INSEE (siret, nom, formeJuridique, naf, dateCreation, effectif, adresse, codePostal, ville, departement, fetched)
- **Stratégie** : 5 axes possibles avec scoring, chacun a titre/verdict/etapes/pourquoi/alternatives. Distingue micro/EI/EIRL/société (`getFormeDetail`). Exploite pgeEnCours et antecedents.
- **PriorityCards** : 13 cartes possibles, top 4 sélectionnées par scoring selon les réponses (ajout : pge, conjoint, cogerance)
- **Blocs fiche** : 37 blocs (32 + 5 nouveaux : Plateformes, CSP autonome, GarantieBPI, ArretLongueDuree, NationaliteSejour) — + ModePerdu
- **Mode perdu** : si moral === 'perdu', composant `ModePerdu` affiché en haut avec 3 infos seulement (qui appeler / action semaine / soutien). Bouton "Voir tout" pour ouvrir la fiche complète.
- **Organismes par dpt** (data/organismes.json) : tribunal, cci, urssaf (ou cgss DOM), sie, banqueDeFrance, dreets, ddfip, cma, prefecture, pointJustice, carsat, conciliateur, ordreMedecins, ordreAvocats, chambreNotaires, ordrePharmaciens, urpsMedecins, urssafRegional, bge, initiativeFrance, franceActive, mdph, maisonJustice, solidaritePaysans (si agri), + DOM : cgss, bpiOutreMer, afd, ladom, cafat/cps/ieom (selon territoire)

## Couverture estimée

- **~94% de la pertinence** pour les profils-types de dirigeants en difficulté
- **107 territoires** couverts (96 départements + 11 DOM-TOM) — **8 datasets enrichis** avec adresses + téléphones réels (DDFiP, Barreaux, Chambres notaires, Chambres agriculture, URSSAF, Tribunaux commerce, CCI, CMA)
- **3 thèmes** : clair (défaut) · sombre · contraste élevé (RGAA AAA) — bascule dans la Nav, persistance localStorage
- **18 secteurs** enrichis (incluant finance, IT, éducation, immobilier, ESS/associations, services, culture/sport) + mapping 11 OPCO par NAF
- **715 tests Vitest** + Playwright E2E configuré
- **11 calculateurs officiels** (ajout : valorisation stocks, seuils d'effectif)
- **18 questions** au questionnaire

## Roadmap

Voir `_plans/roadmap.md` pour l'état d'avancement détaillé et la liste de ce qu'il reste à faire.
