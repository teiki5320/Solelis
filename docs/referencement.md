# Journal du référencement

Une page travaillée n'est pas retouchée avant 28 jours : Google a besoin de ce temps pour réagir.

## 22/10/2026

### Pages presque en première page (chiffres Search Console des 30 derniers jours)

| Page | Recherches visées | Place / vues au moment du travail | Ancien titre → nouveau titre | Autres changements |
|---|---|---|---|---|
| /annuaires/ags | ags cgea, cgea ags, cgea annecy, ags cgea bordeaux, cgea nancy | 12,3 (71 vues, 0 clic) ; « ags cgea » 11,9 (26 vues) | « Centres AGS (CGEA) — Solelis » → « AGS CGEA : adresses et téléphones des 15 centres — Solelis » | description réécrite (Annecy, Bordeaux, Nancy, Marseille) ; titre principal « AGS : les 15 centres CGEA, adresses et téléphones » ; chaque centre est un intertitre avec son ancre (/annuaires/ags#cgea-annecy…) ; petite FAQ visible (que veut dire CGEA, quel centre est compétent, le salarié doit-il le contacter) ; liens ajoutés depuis /aides (carte AGS) et le calculateur /outils/licenciement |
| /aides | médiateur des entreprises, solelis | 6,7 (3 vues) ; « médiateur des entreprises » 5e | « Aides financières d’urgence — Solelis » → « Aides d’urgence et médiateur des entreprises — Solelis » | description réécrite ; carte « Médiateur des entreprises » détaillée (gratuit, confidentiel, litiges clients et fournisseurs) avec lien vers le modèle de saisine ; encadré visible « Médiateur des entreprises ou médiation du crédit ? » (faits repris du conseil sur le fournisseur impayé, source service-public.fr) ; liens vers /aides ajoutés depuis les conseils Fournisseur impayé et Médiation du crédit (ce dernier ne paraît que le 06/11) |
| /mentions-legales | solelis | 8,4 (5 vues) | inchangé | rien : la recherche « solelis » doit mener à l’accueil, dont le titre commence déjà par « Solelis » (« Solelis — Aide aux chefs d'entreprise en difficulté ») |

Mise en ligne : à faire par Jean (`npm run cf:deploy`). À relire à partir du 19/11/2026.

## 23/10/2026

### Pages presque en première page

Rien de nouveau : les 3 pages de la liste (/annuaires/ags 12,3e place et 81 vues ; /mentions-legales 8,4e et 5 vues ; /aides 6,7e et 3 vues) ont été travaillées le 22/10. À relire à partir du 19/11/2026.

### Fiches enrichies vérifiées le 23/10/2026

- Accueil : Organization + WebSite ; articles Conseils : Article (auteur, éditeur, sources) + BreadcrumbList ; courriers, outils, situations : HowTo et BreadcrumbList ; /faq et /faq/… : FAQPage (FAQ visible).
- JSON-LD valide dans les pages construites (accueil, /faq, /dettes-fiscales-sociales).
- Reste : /annuaires/ags a une petite FAQ visible depuis le 22/10 mais pas de FAQPage ; à ajouter après le 19/11 (page à ne pas retoucher avant).

### Socle vérifié le 23/10/2026

- IndexNow : clé créée (`public/6420c222dd7200cc295dd43a6324ec71.txt`) et script `scripts/indexnow.mjs`. À lancer après la prochaine mise en ligne (`npm run cf:deploy`), pas avant : la clé doit être en ligne.
- Google Discover : `max-image-preview:large` ajouté au gabarit commun (app/layout.tsx) et aux 9 pages qui ont leur propre réglage « robots » ; l'image de partage /api/og fait déjà 1200 × 630.
- Vitesse sur téléphone : outil PageSpeed hors quota ce matin (« Queries per day »). À refaire au prochain passage (accueil, /conseils/procedure-de-sauvegarde, /courriers/echelonnement-impots).

### Page nouvelle

| Page | Recherche visée | Situation avant | Liens ajoutés vers elle |
|---|---|---|---|
| /dettes-fiscales-sociales | dettes fiscales et sociales (21 vues en 28 jours) | Google montrait seulement deux articles, à la 43e et 58e place | /penalites-fiscales, /ciri-codefi, article CCSF |

Contenu : les trois façons d'étaler (plan de règlement au SIE, échéancier URSSAF, plan unique CCSF), comment choisir, les délais de la mise en demeure et de la contrainte URSSAF, renvoi vers les pénalités et la cessation des paiements. Uniquement des faits déjà présents dans les articles du site (sources officielles). À relire à partir du 20/11/2026.

Mise en ligne : à faire par Jean (`npm run cf:deploy`), puis `node scripts/indexnow.mjs`.

## 30/10/2026

### Pages presque en première page (chiffres Search Console des 28 derniers jours)

| Page | Recherches visées | Place / vues au moment du travail | Ancien titre → nouveau titre | Autres changements |
|---|---|---|---|---|
| /courriers/mandat-ad-hoc | formulaire ad hoc, formulaire ad hoc définition | 10 (5 vues, 0 clic) ; « formulaire ad hoc » 8e (4 vues) | « Demande de mandat ad hoc : modèle de courrier — Solelis » → « Formulaire de mandat ad hoc : modèle de requête — Solelis » | description réécrite (requête, art. L611-3, pièces à joindre) ; paragraphe visible sous le titre : le formulaire du greffe « Demande de désignation d'un mandataire ad hoc », dépôt via Tribunal digital ou en 2 exemplaires au greffe (faits déjà dans le modèle) ; lien « modèle de formulaire de mandat ad hoc » dans le conseil Mandat ad hoc (la page reçoit déjà des liens des conseils Loyers commerciaux impayés et Procédure d'alerte du commissaire aux comptes) |
| /courriers/saisine-ccsf | saisine ccsf | 11 (3 vues) | « Saisine de la CCSF (échelonnement fiscal + social) : modèle de courrier — Solelis » (raccourci par le site en « Saisine de la CCSF : modèle de courrier — Solelis ») → « Saisine de la CCSF : modèle de courrier gratuit — Solelis » | description réécrite, commençant par « Saisine de la CCSF » ; titre principal inchangé (il contient déjà « Saisine de la CCSF ») ; liens internes déjà nombreux (FAQ, /dettes-fiscales-sociales, 6 conseils) : aucun ajouté |

Non retenues : /annuaires/ags et /aides (travaillées le 22/10, à relire à partir du 19/11) ; /outils, /mentions-legales, /accessibilite, /annuaires (seule recherche : « solelis », le nom du site, déjà 2,7e place pour l'accueil).

À relire à partir du 27/11/2026.

### Pages travaillées il y a 28 jours ou plus

Aucune (premières pages travaillées le 22/10 : à relire à partir du 19/11/2026). Chiffres du jour pour suivi : /annuaires/ags 12,1e place, 155 vues, 1 clic (12,3e et 71 vues le 22/10) ; /aides 8e place, 6 vues (6,7e et 3 vues le 22/10).

### Fiches enrichies

Non refait : vérifiées le 23/10/2026 (moins de 28 jours).

### Socle

IndexNow et Discover vérifiés le 23/10/2026 (moins de 28 jours). Vitesse sur téléphone : outil PageSpeed de nouveau hors quota ce matin (« Queries per day ») pour l'accueil, /conseils/procedure-de-sauvegarde et /courriers/echelonnement-impots. À refaire au prochain passage.

### Page nouvelle

Aucune créée. Recherches fréquentes examinées :
- « assignation en paiement » (41 vues) et « assignation à payer » (22 vues) : le site a déjà la vraie page (conseil « Assigné·e au tribunal par un créancier : que faire ? », 56e à 62e place) et /situation/assignation ; une page de plus ferait doublon.
- « administrateur judiciaire nice » (32 vues), niort (16), clermont-ferrand (14) : l'annuaire des mandataires n'a pas d'administrateur judiciaire à Nice (seulement un mandataire) ; une page dédiée demanderait des données que le site n'a pas. Proposé à Jean.
- « cip » (41 vues) : recherche trop ambiguë (sigle aux nombreux sens).
- « dettes fiscales et sociales » (39 vues) : page /dettes-fiscales-sociales créée le 23/10, à relire à partir du 20/11.
