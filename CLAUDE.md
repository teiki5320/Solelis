# Solelis

Plateforme SaaS (Next.js 16) d'aide aux dirigeants d'entreprise en difficulté en France.
Le dirigeant entre son SIRET, répond à un questionnaire, et reçoit une fiche personnalisée (stratégie, courriers, échéances, aides, annuaires).

## Commandes

```bash
npm run dev      # Serveur local (port 3000)
npm run build    # Build de production
npm run lint     # ESLint CLI (eslint.config.mjs : next/core-web-vitals)
npm run conseils # Vérifie content/conseils/*.md et génère lib/conseils/donnees.generated.ts (lancé aussi avant dev/build/test)
npm run veille   # Lit les articles complets des actus sur la veille → lib/veille-*.generated.ts (avant dev/build/test ; 0 article si la veille ne répond pas)
npm test         # Vitest (1013 tests, 65 fichiers, au 28 octobre 2026, dans lib/__tests__/, components/__tests__/, app/api/__tests__/, app/outils/__tests__/)
npm run test:e2e # Playwright (parcours utilisateur)
```

Hébergement : Worker Cloudflare « solelis » via OpenNext (`wrangler.jsonc`, `worker.ts`) → https://solelis.com. Mise en ligne **automatique** : à chaque envoi sur `main`, la CI GitHub vérifie puis publie sur Cloudflare (`.github/workflows/ci.yml`), dès que les secrets `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` sont réglés dans GitHub (en attente au 23 octobre 2026 : d'ici là, `npm run cf:deploy` à la main).

```bash
npm run cf:build     # Build du Worker (OpenNext), sans déployer
npm run cf:preview   # Aperçu local dans le simulateur Cloudflare (port 8787)
npm run cf:deploy    # Build + mise en ligne sur Cloudflare
```

## Stack

- **Framework** : Next.js 16.4.x App Router, TypeScript, React 19 — Node 22 (`.nvmrc`). Next.js 15 n'est plus maintenu depuis le 21/10/2026 et l'adaptateur OpenNext refuse les versions non maintenues : suivre les versions majeures (support de 2 ans)
- **CSS** : Tailwind 3.4 (JIT) + classes custom (voir `tailwind.config.js`)
- **Animations** : Framer Motion 11 (avec `LazyMotion` pour réduire le bundle)
- **UI** : Glass morphism (backdrop-blur, ombres glass), polices Playfair Display + Outfit
- **BDD** : Cloudflare D1 « solelis » (juridiction UE, binding `DB`, schéma dans `migrations/`) — table `fiches` : token/siret/reponses/company_data/email/rappels (JSON en texte)
- **Email** : Resend (magic link pour retrouver sa fiche + rappels cron quotidiens)
- **APIs externes** : INSEE Sirene (gouv.fr + INSEE fallback), BODACC, Google Places (avocats locaux), Infogreffe (signaux)
- **Validation** : Zod (schémas dans `lib/schemas.ts`)
- **Tests** : Vitest (1013 tests, 65 fichiers, au 28 octobre 2026) + Playwright (E2E)
- **CI** : GitHub Actions, Node 22 (lint → tsc → build → test → `opennextjs-cloudflare build`) ; aussi chaque jour à 11 h 50 et 18 h 50 UTC (reconstruction des articles d'actus, après la veille)
- **Rate limiting** : middleware in-memory (propre à chaque instance du Worker) — limiteur Cloudflare à venir. `middleware.ts` : convention dépréciée par Next.js 16 au profit de `proxy.ts`, encore fonctionnelle
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
  situation/[slug]/           # 4 pages informatives par situation (données : lib/situations.ts) + bloc « Dans l'actualité » (3 actus, absent s'il n'y en a pas)
  actus/                      # Page « L'actualité des entreprises en difficulté » : 20 actus de la veille (jamais sur l'accueil)
  actus/[slug]/               # Article complet d'une actu, page statique construite au build (NewsArticle, sitemap)
  actus/article/              # Page de secours ?id=<id> : article lu dans le navigateur (noindex, hors sitemap)
  veille/entites.json/        # Route statique : les 4 situations exposées à la veille (tag situation:<slug>)
  courriers/[slug]/           # 17 modèles de courriers (page serveur + CourrierDetail client, SSG)
  outils/                     # 11 calculateurs (ATI, licenciement, prescription, AGS, stocks, seuils, etc.)
  annuaires/                  # 4 annuaires (mandataires, CIP, AGS, TAE)
  accompagnant/               # Parcours « j'accompagne un proche » + bandeau urgence + code postal
  faq/                        # FAQ avec JSON-LD FAQPage
  temoignages/                # exemples fictifs (présentés comme tels)
  api/fiche/                  # POST création fiche + GET récupération
  api/fiche/send-link/        # Envoi magic link par email
  api/fiche/rappels/          # POST programmer un rappel
  api/cron/rappels/           # GET cron quotidien (Cron Trigger Cloudflare 7h UTC, worker.ts)
  api/og/                     # Image OG dynamique (runtime Node, autorisée dans robots.txt)
  api/stats/                  # Stats agrégées
  sitemap.ts, robots.ts       # SEO (sitemap rendu à la requête : inclut les articles Conseils publiés ce jour)
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
  actus/                      # BlocActus, ActuBandeau, ActuVignette (carte entière cliquable : TitreCarte, lienCarte), SourceActu, CreditImage, ArticleActu
  IllustrationPage.tsx        # Image d'un conseil ou d'un guide + crédit (data/illustrations.json)
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
  sirene.ts                   # API gouv.fr (serveur) → résultat du navigateur (SIRET exact) → INSEE → générique
  rechercheEntreprises.ts     # Recherche recherche-entreprises depuis le navigateur (questionnaire) + réduction des champs
  db.ts                       # Accès à la base D1 (fiches, rappels, stats)
  resend.ts                   # Envoi d'emails
  googlePlaces.ts             # Recherche avocats via Google Places
  organismes.ts               # buildOrganismes + buildOrdresProfessionnels + buildAidesPersonnelles + buildSoutien + buildReseauxSpecifiques
  schemas.ts                  # Schémas Zod pour validation API
  hooks.ts                    # useLocalStorage
  FicheContext.tsx            # React Context pour la fiche (utilisé par 18 blocs)
  __tests__/                  # Tests Vitest (1013 au total au 28 octobre 2026 : lib + components + API routes + outils)
  veille.ts                   # Veille actus : URL_VEILLE, schéma Zod v3, chargerActus() (navigateur, 8 s, cache 15 min, [] si erreur), schéma article v1, lienActu()
  articlesVeille.ts           # Build : tous les articles de l'index de la veille (articles/solelis/index.json) à construire + modules générés (veille-articles/slugs.generated.ts, non versionnés)
  fichesVeille.ts             # Tags d'un article → liens vers les pages situation existantes
  situations.ts               # Contenu des 4 pages situation + entitesVeille()
  illustrations.ts            # Images des conseils et guides (data/illustrations.json)
  opco.ts                     # Mapping NAF → OPCO (11 OPCO de la branche)
  conseils/                   # Rubrique Conseils : types.ts, themes.ts, index.ts (filtres de date à la requête, fuseau Paris),
                              #   construction.ts (build : en-tête, Zod, marked → HTML sûr, vérif. des liens internes),
                              #   donnees.generated.ts (GÉNÉRÉ, non versionné)

content/
  conseils/                   # Articles Markdown <slug>.md + README.md (format, règles, veille hebdomadaire)

scripts/
  illustrations.mjs           # Images des conseils et guides, mode « compléter seulement » (Wikimedia > Openverse > carte), WebP dans public/illustrations/
  generer-conseils.ts         # Build : content/conseils → lib/conseils/donnees.generated.ts (échoue si article invalide)
  articles-veille.ts          # Build : articles des actus (veille) → lib/veille-*.generated.ts (ne casse jamais le build)

data/
  organismes.json             # 107 territoires (96 dpts + 11 DOM-TOM), ~20 organismes par dpt
  illustrations.json          # Crédits des images des conseils et guides (public/illustrations/, WebP)

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
- **1013 tests Vitest** (65 fichiers, au 28 octobre 2026) + Playwright E2E configuré
- **11 calculateurs officiels** (ajout : valorisation stocks, seuils d'effectif)
- **18 questions** au questionnaire

## Roadmap

Voir `_plans/roadmap.md` pour l'état d'avancement détaillé et la liste de ce qu'il reste à faire.

## Fiches à jour à chaque changement (règle de Jean, 22 octobre 2026)

Le Studio de Jean affiche les fiches de ce dépôt (docs/INFRA.md, docs/MARKETING.md, docs/PUBLICATION.md) et le README. Elles doivent toujours dire la vérité d'aujourd'hui.

- Dès qu'un travail change un fait affiché par ces fiches — version envoyée ou en ligne (App Store, Google Play, site), date de mise en ligne, hébergement ou domaine, service ajouté ou retiré, code Amazon Partenaires, état AdSense ou Pinterest, monétisation, nombre de contenus publiés —, mets à jour **dans le même envoi** toutes les phrases concernées des trois fiches (En bref, Parcours, Boutiques, Vue d'ensemble, Ce qui reste…) et du README.
- Une ancienne valeur ne reste qu'au passé, datée (« la 1.0.4 a été mise en ligne le 15 octobre »).
- Ne recopie jamais de secret ni de clé dans ces fichiers.
- Chaque matin, la tâche « Fiches Mes Apps » du Studio vérifie derrière toi, compare les versions avec ce que servent réellement les boutiques et signale toute phrase fausse.
