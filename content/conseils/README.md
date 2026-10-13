# Rubrique « Conseils » : écrire un article

Chaque article est un fichier Markdown de ce dossier : `content/conseils/<slug>.md`.
Le nom du fichier donne l'adresse de la page : `cessation-des-paiements.md` → `https://solelis.com/conseils/cessation-des-paiements`.

- **Nom du fichier** : minuscules sans accents, chiffres et tirets (`que-faire-dette-urssaf.md`). Il ne change plus une fois l'article publié (sinon l'adresse change).
- Ce fichier `README.md` n'est pas un article (il est ignoré).

## Format

```markdown
---
title: Cessation des paiements : que faire dans les 45 jours ?
description: Ce que dit la loi et les démarches à faire dans les 45 jours, avec les sources officielles.
date: 2026-10-12
miseAJour: 2026-10-12
theme: procedures
resume: La cessation des paiements, c'est l'impossibilité de payer les dettes exigibles avec l'actif disponible. Vous avez 45 jours pour la déclarer au tribunal.
sources:
  - titre: Code de commerce, art. L631-4
    url: https://www.legifrance.gouv.fr/...
  - titre: Service-public.fr — Cessation des paiements (vérifié le 12 octobre 2026)
    url: https://entreprendre.service-public.gouv.fr/...
liens:
  - /outils/prescription
  - /courriers/cessation-paiements
  - /conseils/autre-article
brouillon: false
---
## Premier sous-titre

Texte en Markdown : listes, **gras**, [liens](/outils/ati), citations > courtes.
```

| Champ | Obligatoire | Règle |
|---|---|---|
| `title` | oui | la question ou le titre, **70 caractères au plus** |
| `description` | oui | résumé pour Google, **160 caractères au plus** |
| `date` | oui | date de publication `AAAA-MM-JJ`. **Une date future = article programmé** : invisible (absent de la liste, du sitemap, du flux RSS, page 404) jusqu'à ce jour, 0 h, heure de Paris |
| `miseAJour` | oui | `AAAA-MM-JJ`, égale ou postérieure à `date` ; à avancer à chaque vérification ou correction (c'est la date « Mis à jour le » et le `lastmod` du sitemap) |
| `theme` | oui | `dettes`, `procedures`, `dirigeant`, `salaries` ou `aides` |
| `resume` | oui | 2 ou 3 phrases qui répondent directement à la question (encadré « En bref ») |
| `sources` | oui, au moins une | chaque source a un `titre` et une `url` en `https://`. Uniquement des sources officielles (codes sur legifrance.gouv.fr, sites .gouv.fr) ; pour une page qui évolue, indiquer « (vérifié le …) » dans le titre |
| `liens` | non | pages du site à proposer dans « À voir aussi » : chemins commençant par `/` (`/outils/…`, `/courriers/…`, `/faq/…`, `/conseils/<slug>`…). Le libellé affiché est le titre de la page visée |
| `brouillon` | non | `true` = jamais publié, quelle que soit la date (`false` par défaut) |

Valeurs : pas besoin de guillemets, même avec « : » dans le texte. Un texte long peut s'écrire sur plusieurs lignes après `resume: >` (lignes suivantes en retrait de 2 espaces).

## Corps de l'article

- Sous-titres en `##` (et `###`). **Pas de `#`** : le titre de la page vient de `title`.
- Listes `-` ou `1.`, **gras**, citations `>` courtes, tableaux Markdown.
- Liens internes : `[texte](/outils/ati)`, ancre possible (`/faq#cessation`).
- Liens externes : `https://` uniquement (ils s'ouvrent dans un nouvel onglet). Aussi : `tel:3957`, `mailto:`, `#ancre`.
- Interdit (le build s'arrête) : images, HTML brut (`<div>`, `<br>`…), liens `http://`. Les commentaires `<!-- note -->` sont autorisés et retirés à la publication.
- Lien vers un autre article programmé plus tard : autorisé ; tant que cet article n'est pas publié, le lien est affiché comme simple texte (et retiré de « À voir aussi »).
- Style du site : français simple, formulations inclusives (dirigeant·e·s), aucun chiffre sans source.

## Vérifier et publier

```bash
npm run conseils   # vérifie TOUS les articles et prépare les données (quelques secondes)
npm run dev        # voir le site en local : http://localhost:3000/conseils
```

`npm run conseils` liste toutes les erreurs d'un coup (champ manquant, thème inconnu, adresse non https, lien vers une page qui n'existe pas, slug en double…). La même vérification est faite avant chaque build : **un article invalide empêche la mise en ligne**, y compris un brouillon.

En local, un article programmé n'apparaît pas non plus avant sa date. Pour le relire avant, mettre temporairement une date passée (ou relire le Markdown).

Après une modification d'un article pendant `npm run dev`, relancer `npm run conseils` (puis recharger la page).

## Publication programmée : comment ça marche

Au build, `scripts/generer-conseils.ts` lit ce dossier, valide chaque article, convertit le Markdown en HTML et écrit `lib/conseils/donnees.generated.ts` (fichier généré, non versionné) avec **tous** les articles, y compris ceux à date future.

Les pages `/conseils`, `/conseils/<slug>`, `/conseils/rss.xml` et `/sitemap.xml` sont rendues à chaque visite : elles comparent simplement la date de chaque article à la date du jour à Paris. Un article programmé paraît donc tout seul le jour venu, **sans redéploiement**. En revanche, un nouvel article ou une correction n'est en ligne qu'après un déploiement (fusion dans `main`).

## Veille hebdomadaire

1. Relire les sources des articles dont la `miseAJour` est la plus ancienne (taux, plafonds, délais, numéros de téléphone).
2. Corriger si besoin, puis avancer `miseAJour` (et la mention « vérifié le … » des sources concernées).
3. `npm run conseils` doit afficher « ✓ » avant d'envoyer la modification.
