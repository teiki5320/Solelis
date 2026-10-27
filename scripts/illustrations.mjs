/**
 * Illustrations des conseils et des guides (pages situation), mode « compléter seulement » :
 * une page qui a déjà son image dans data/illustrations.json la garde ; seules les autres en reçoivent une.
 *
 * Sources, dans l'ordre (comme la veille, voir teiki5320/veille scripts/publie.mjs) :
 *   1. Wikimedia Commons (licence libre, auteur connu) ;
 *   2. Openverse, usage commercial seulement (CC0, domaine public, CC BY, CC BY-SA), mots-clés en anglais ;
 *   3. sinon une carte générée aux couleurs du site (« Illustration : Solelis »).
 * Jamais de photo de personne reconnaissable dans un contexte de difficulté : dans ce cas, la carte.
 * Les images sont copiées dans le dépôt (public/illustrations/…, WebP) : aucun serveur tiers à l'affichage.
 * Jamais deux fois la même image sur le site (contrôlé ici et par lib/__tests__/illustrations.test.ts).
 *
 * Usage :
 *   node scripts/illustrations.mjs            → complète data/illustrations.json et public/illustrations/
 *   node scripts/illustrations.mjs --apercu   → n'écrit rien : liste les candidats des pages sans image
 *
 * Une page nouvelle sans entrée dans CHOIX ci-dessous reçoit une carte (à remplacer ensuite par une photo
 * choisie à la main : ajouter son entrée dans CHOIX, supprimer la ligne de data/illustrations.json, relancer).
 * sharp est fourni avec Next.js (pas de dépendance à ajouter).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RACINE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FICHIER_DONNEES = path.join(RACINE, 'data', 'illustrations.json');
const USER_AGENT = 'Solelis/1.0 (https://solelis.com ; illustrations libres de droits)';
const LARGEUR = 1200;
const HAUTEUR = 675;

/**
 * Image retenue pour chaque page, choisie après vérification à l'œil (sujet, pas de personne en difficulté).
 * - wikimedia : titre exact du fichier sur Commons ;
 * - openverse : identifiant de l'image ;
 * - carte : libellé écrit sur la carte (rien ne collait vraiment au sujet).
 * `alt` décrit ce qu'on voit vraiment sur l'image.
 */
export const CHOIX = {
  "conseil:activite-partielle-chomage-partiel": {
    "openverse": "3e4e0b94-4659-462c-8aad-07ea4d487d2c",
    "alt": "Un grand atelier industriel vide, sous une verrière"
  },
  "conseil:administrateur-ou-mandataire-judiciaire": {
    "wikimedia": "File:Tribunal de Commerce, Paris 140320 2.jpg",
    "alt": "La façade du tribunal de commerce de Paris, sur l’île de la Cité"
  },
  "conseil:ags-salaires-entreprise-en-difficulte": {
    "carte": "Salaires et AGS"
  },
  "conseil:aide-juridictionnelle-dirigeant": {
    "wikimedia": "File:Maison Justice Droit - Villejuif (FR94) - 2022-03-05 - 2.jpg",
    "alt": "La façade de la maison de justice et du droit de Villejuif"
  },
  "conseil:aides-urgence-entreprises-difficulte": {
    "wikimedia": "File:Euro banknotes, Europa series.png",
    "alt": "Des billets en euros disposés en éventail"
  },
  "conseil:assignation-tribunal-creancier": {
    "wikimedia": "File:Tribunal Commerce Seine.jpg",
    "alt": "Les fenêtres sculptées de la façade du tribunal de commerce de Paris"
  },
  "conseil:capitaux-propres-inferieurs-moitie-capital": {
    "carte": "Capitaux propres"
  },
  "conseil:caution-personnelle-dirigeant": {
    "wikimedia": "File:Legal Contract & Signature - Warm Tones.jpg",
    "alt": "Un contrat posé sur une table, avec un stylo-plume"
  },
  "conseil:ccsf-etaler-dettes-fiscales-sociales": {
    "wikimedia": "File:Remiremont - Rue Paul-Doumer - Centre des Finances publiques - 1.jpg",
    "alt": "L’entrée du centre des finances publiques de Remiremont"
  },
  "conseil:cessation-des-paiements-delai-45-jours": {
    "openverse": "8602bdc9-fd6d-4e32-9b69-4327c8013f5e",
    "alt": "Les pages d’un agenda ouvert"
  },
  "conseil:chomage-dirigeant-ati": {
    "wikimedia": "File:Pôle emploi à Petit-Bourg en Guadeloupe.jpg",
    "alt": "Une agence Pôle emploi (aujourd’hui France Travail) à Petit-Bourg, en Guadeloupe"
  },
  "conseil:conjoint-du-dirigeant-risques": {
    "openverse": "75da0d30-04e2-4d57-8635-4665dcc1a094",
    "alt": "Deux alliances posées l’une contre l’autre"
  },
  "conseil:contrainte-urssaf-contester": {
    "wikimedia": "File:Batiment Urssaf de Rennes en 2026.jpg",
    "alt": "Le bâtiment de l’Urssaf à Rennes"
  },
  "conseil:contrat-securisation-professionnelle": {
    "wikimedia": "File:Entrée du centre AFPA de Saint-Étienne.jpg",
    "alt": "L’entrée du centre de formation AFPA de Saint-Étienne"
  },
  "conseil:declarer-cessation-des-paiements": {
    "wikimedia": "File:Escalier de l'ancien tribunal de commerce, rue du Cloître St-Merry. IX, G.8552(1).jpg",
    "alt": "Gravure ancienne de l’escalier de l’ancien tribunal de commerce de Paris"
  },
  "conseil:dirigeant-en-detresse-qui-appeler": {
    "wikimedia": "File:FeAp 92-1a - handset-4975.jpg",
    "alt": "Un combiné de téléphone posé sur une table"
  },
  "conseil:echeancier-urssaf": {
    "wikimedia": "File:Rue des Alliés (CAF URSSAF).jpg",
    "alt": "Les immeubles de la CAF et de l’Urssaf, rue des Alliés, à Grenoble"
  },
  "conseil:entrepreneur-individuel-patrimoine-protege": {
    "openverse": "8db1b9c9-efe6-4beb-a0f4-597b7790f290",
    "alt": "Une maison française en pierre aux volets clairs, couverte de vigne vierge"
  },
  "conseil:entretien-prevention-tribunal": {
    "wikimedia": "File:Tribunal Commerce Paris 7.jpg",
    "alt": "Le tribunal de commerce de Paris et son dôme"
  },
  "conseil:faute-de-gestion-interdiction-de-gerer": {
    "wikimedia": "File:Legal Gavel (27571702173).jpg",
    "alt": "Un marteau de juge posé sur son socle"
  },
  "conseil:fournisseur-impaye-menace": {
    "wikimedia": "File:Palettes de sacs de cafe.jpg",
    "alt": "Des sacs de marchandises empilés sur des palettes dans un entrepôt"
  },
  "conseil:injonction-de-payer-recue": {
    "wikimedia": "File:Savigné 86 Boîte aux lettres 2012.jpg",
    "alt": "Une boîte aux lettres jaune de La Poste"
  },
  "conseil:licenciement-economique-petite-entreprise": {
    "wikimedia": "File:Empty office in a coworking building.jpg",
    "alt": "Un bureau vide, avec ses fauteuils inoccupés"
  },
  "conseil:liquidation-amiable-avec-dettes": {
    "openverse": "f2f66661-5f01-4875-921a-2f572965ed41",
    "alt": "Le rideau métallique baissé d’une boutique fermée"
  },
  "conseil:liquidation-judiciaire-etapes": {
    "wikimedia": "File:Hôtel Drouot.jpg",
    "alt": "La façade de l’hôtel Drouot, salle des ventes aux enchères à Paris"
  },
  "conseil:liquidation-judiciaire-simplifiee": {
    "carte": "Liquidation simplifiée"
  },
  "conseil:loyers-commerciaux-impayes": {
    "wikimedia": "File:Niklas Roy, À LOUER, 2013 (9511708052).jpg",
    "alt": "Une vitrine de local commercial avec une pancarte « À louer »"
  },
  "conseil:majorations-retard-urssaf-remise": {
    "openverse": "c45db3b4-90c9-4a74-9b38-90341187a374",
    "alt": "Une calculatrice, un stylo et un carnet à spirale"
  },
  "conseil:mandat-ad-hoc": {
    "wikimedia": "File:Tribunal du Commerce Paris-DSC 0832w.jpg",
    "alt": "Le fronton sculpté du tribunal de commerce de Paris"
  },
  "conseil:mediation-du-credit-banque-de-france": {
    "wikimedia": "File:Enseigne Banque de France, Toulon.jpg",
    "alt": "L’enseigne de la Banque de France à Toulon"
  },
  "conseil:mise-en-demeure-urssaf": {
    "openverse": "72897166-1fc2-4c8c-8553-e424a102a99c",
    "alt": "Une pile d’enveloppes"
  },
  "conseil:mise-en-sommeil-entreprise": {
    "carte": "Mise en sommeil"
  },
  "conseil:pge-impossible-a-rembourser": {
    "wikimedia": "File:Bpifrance à Bourg-en-Bresse (février 2023).JPG",
    "alt": "L’agence Bpifrance de Bourg-en-Bresse"
  },
  "conseil:plan-de-reglement-impots": {
    "wikimedia": "File:Hôtel des Impôts Strasbourg.jpg",
    "alt": "La façade de l’hôtel des impôts de Strasbourg"
  },
  "conseil:procedure-de-conciliation": {
    "openverse": "34336e51-a1ca-4afb-8bab-9a3615749d9c",
    "alt": "Une salle de réunion vide, avec sa table et ses chaises"
  },
  "conseil:procedure-de-sauvegarde": {
    "wikimedia": "File:Bouée de sauvetage, Conleau, golfe du Morbihan, France.jpg",
    "alt": "Une bouée de sauvetage orange rangée dans son abri rouge, à Conleau (golfe du Morbihan)"
  },
  "conseil:rebondir-apres-faillite": {
    "wikimedia": "File:The seedling.jpg",
    "alt": "Une jeune pousse verte qui sort de terre"
  },
  "conseil:redressement-judiciaire-deroulement": {
    "wikimedia": "File:Tribunal de Commerce de Nantes.jpg",
    "alt": "Le bâtiment du tribunal de commerce de Nantes"
  },
  "conseil:residence-principale-saisie": {
    "openverse": "3e04d8f5-f16a-40da-a7d5-11f522897a47",
    "alt": "Une petite maison et des clés posées à côté d’un marteau de juge"
  },
  "conseil:retablissement-professionnel": {
    "carte": "Rétablissement professionnel"
  },
  "conseil:saisie-compte-bancaire-entreprise": {
    "openverse": "a59feb6a-77d8-4d47-8ef4-10ee3e82788b",
    "alt": "Un terminal de paiement par carte bancaire"
  },
  "conseil:vendre-fonds-de-commerce-avec-dettes": {
    "wikimedia": "File:Devanture églomisée 20050917.jpg",
    "alt": "La devanture ancienne d’une boulangerie"
  },
  "situation:dettes-urssaf": {
    "wikimedia": "File:Carré-Sénart - 2019-07-03 - IMG 0076.jpg",
    "alt": "L’immeuble de l’Urssaf à Carré Sénart, en Seine-et-Marne"
  },
  "situation:dettes-fournisseurs": {
    "openverse": "78084dd0-2b63-4c80-a18e-1627d50fce5b",
    "alt": "Une main qui remplit une facture au stylo"
  },
  "situation:credit-bancaire": {
    "wikimedia": "File:Succursale de la banque de France, Chartres (Eure-et-Loir, France).jpg",
    "alt": "La succursale de la Banque de France à Chartres"
  },
  "situation:impots-impayes": {
    "carte": "Impôts impayés"
  }
};

// ---------- Outils ----------
const ENTITES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const texteSeul = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITES[n] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
const couper = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…');

export function licenceWikimediaLibre(nom) {
  const n = String(nom || '').trim().toLowerCase();
  if (!n || /\bnc\b|-nc|\bnd\b|-nd|fair use|non-free/.test(n)) return false;
  return /^(cc0|cc-zero|public domain|pd\b|pd-|cc[ -]by(-sa)?([ -]\d|$))/.test(n);
}
export const auteurConnu = (a) => Boolean(a && String(a).trim()) && !/\b(unknown|inconnu|anonymous|anonyme|not provided)\b/i.test(String(a));
const LICENCES_OPENVERSE = { cc0: 'CC0', pdm: 'Domaine public', by: 'CC BY', 'by-sa': 'CC BY-SA' };

async function telecharger(url, type = 'json') {
  const r = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, signal: AbortSignal.timeout(90000), redirect: 'follow' });
  if (!r.ok) throw new Error(`HTTP ${r.status} : ${url}`);
  return type === 'json' ? r.json() : Buffer.from(await r.arrayBuffer());
}

function infosWikimedia(p) {
  const ii = p.imageinfo?.[0];
  if (!ii) return null;
  const m = ii.extmetadata || {};
  return {
    source: 'wikimedia',
    titre: String(p.title || ''),
    origine: ii.url,
    telechargement: ii.thumburl || ii.url,
    credit: couper(texteSeul(m.Artist?.value), 120),
    licence: texteSeul(m.LicenseShortName?.value),
    page: ii.descriptionurl,
    largeur: ii.width,
    mime: ii.mime,
  };
}

async function requeteWikimedia(params) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  Object.entries({ action: 'query', format: 'json', prop: 'imageinfo', iiprop: 'url|extmetadata|size|mime', iiurlwidth: '1600', ...params }).forEach(([k, v]) => u.searchParams.set(k, v));
  const d = await telecharger(u.toString());
  return Object.values(d?.query?.pages || {})
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
    .map(infosWikimedia)
    .filter(Boolean);
}

const valideWikimedia = (c) =>
  /^image\/(jpeg|png|webp)$/.test(c.mime || '') && (c.largeur || 0) >= 800 && licenceWikimediaLibre(c.licence) && auteurConnu(c.credit);

async function chercherWikimedia(q) {
  return (await requeteWikimedia({ generator: 'search', gsrnamespace: '6', gsrsearch: q, gsrlimit: '10' })).filter(valideWikimedia);
}

function infosOpenverse(r) {
  const lic = String(r.license || '').toLowerCase();
  if (!LICENCES_OPENVERSE[lic] || !auteurConnu(r.creator) || (r.width && r.width < 800)) return null;
  return {
    source: 'openverse',
    titre: `${r.title || ''} [${r.id}]`,
    origine: r.url,
    telechargement: r.url,
    credit: couper(String(r.creator).trim(), 120),
    licence: lic === 'pdm' || lic === 'cc0' ? LICENCES_OPENVERSE[lic] : `${LICENCES_OPENVERSE[lic]}${r.license_version ? ` ${r.license_version}` : ''}`,
    page: r.foreign_landing_url || r.url,
  };
}

async function chercherOpenverse(q) {
  const d = await telecharger(`https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=10`);
  return (d?.results || []).map(infosOpenverse).filter(Boolean);
}

// ---------- Carte générée (couleurs du site, icône soleil, sans drapeau) ----------
const echapper = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function carteSvg(libelle, rubrique) {
  const L = 1600;
  const H = 900;
  const encre = '#ffffff';
  const bandes = Array.from({ length: 40 }, (_, i) => `<rect x="${i * 40 + 18}" y="0" width="4" height="${H}"/>`).join('');
  const soleil = (x, y, t) =>
    `<g transform="translate(${x} ${y}) scale(${t / 100})" fill="none" stroke="${encre}" stroke-width="5" stroke-linecap="round"><circle cx="50" cy="50" r="19" fill="${encre}"/><path d="M50 5 V20 M50 80 V95 M5 50 H20 M80 50 H95 M18 18 L29 29 M71 71 L82 82 M82 18 L71 29 M29 71 L18 82"/></g>`;
  const texte = echapper(libelle.toUpperCase());
  const taille = texte.length > 26 ? 66 : texte.length > 18 ? 80 : 94;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${L}" height="${H}" viewBox="0 0 ${L} ${H}">
<defs><linearGradient id="f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e3d82"/><stop offset="1" stop-color="#0a1628"/></linearGradient></defs>
<rect width="${L}" height="${H}" fill="url(#f)"/>
<g fill="${encre}" opacity="0.06">${bandes}</g>
${soleil(L - 170, 50, 110)}
${soleil((L - 300) / 2, 170, 300)}
<text x="${L / 2}" y="640" text-anchor="middle" fill="${encre}" font-family="Georgia,'Times New Roman',serif" font-weight="700" font-size="${taille}" letter-spacing="2">${texte}</text>
<text x="${L / 2}" y="800" text-anchor="middle" fill="${encre}" opacity="0.85" font-family="Helvetica,Arial,sans-serif" font-weight="600" font-size="40" letter-spacing="2">Solelis · ${echapper(rubrique)}</text>
</svg>`;
}

// ---------- Pages à illustrer ----------
function pages() {
  const dossier = path.join(RACINE, 'content', 'conseils');
  const conseils = fs
    .readdirSync(dossier)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .sort()
    .map((f) => {
      const md = fs.readFileSync(path.join(dossier, f), 'utf8');
      return { cle: `conseil:${f.slice(0, -3)}`, titre: /^title:\s*(.+)$/m.exec(md)?.[1] ?? f };
    });
  const situations = ['dettes-urssaf', 'dettes-fournisseurs', 'credit-bancaire', 'impots-impayes'].map((s) => ({ cle: `situation:${s}`, titre: s }));
  return [...conseils, ...situations];
}

const fichierDe = (cle) => {
  const [type, slug] = cle.split(':');
  return `/illustrations/${type === 'conseil' ? 'conseils' : 'situations'}/${slug}.webp`;
};

async function enregistrer(buffer, cle) {
  const sortie = path.join(RACINE, 'public', fichierDe(cle));
  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  await sharp(buffer, { failOn: 'none' }).rotate().resize(LARGEUR, HAUTEUR, { fit: 'cover', position: 'attention' }).webp({ quality: 74 }).toFile(sortie);
}

async function photoChoisie(choix) {
  if (choix.wikimedia) {
    const [c] = await requeteWikimedia({ titles: choix.wikimedia });
    if (!c || !valideWikimedia(c)) throw new Error(`${choix.wikimedia} : licence, auteur ou taille refusés`);
    return c;
  }
  let r;
  for (let essai = 1; ; essai++) {
    try {
      r = await telecharger(`https://api.openverse.org/v1/images/${choix.openverse}/`);
      break;
    } catch (e) {
      if (essai >= 3) throw e;
      await new Promise((ok) => setTimeout(ok, 5000 * essai));
    }
  }
  const c = infosOpenverse(r);
  if (!c) throw new Error(`Openverse ${choix.openverse} : licence ou auteur refusés`);
  return c;
}

async function main() {
  const apercu = process.argv.includes('--apercu');
  const donnees = fs.existsSync(FICHIER_DONNEES) ? JSON.parse(fs.readFileSync(FICHIER_DONNEES, 'utf8')) : {};
  const origines = new Set(Object.values(donnees).map((d) => d.origine));
  const manquantes = pages().filter((p) => !donnees[p.cle]);
  console.log(`${manquantes.length} page(s) sans image sur ${pages().length}.`);

  for (const p of manquantes) {
    const choix = CHOIX[p.cle];
    if (apercu) {
      console.log(`\n## ${p.cle} — ${p.titre}`);
      for (const q of choix?.requetes ?? []) {
        const [source, texte] = q.split(/:(.*)/s);
        let res = [];
        try {
          res = source === 'wikimedia' ? await chercherWikimedia(texte) : await chercherOpenverse(texte);
        } catch (e) {
          console.log(`  ${q} : ${e.message}`);
        }
        for (const c of res.slice(0, 5)) console.log(`  ${origines.has(c.origine) ? '(déjà pris) ' : ''}${c.source} | ${c.titre} | ${c.credit} | ${c.licence} | ${c.telechargement}`);
      }
      continue;
    }
    let entree;
    if (choix && (choix.wikimedia || choix.openverse)) {
      let c;
      try {
        c = await photoChoisie(choix);
      } catch (e) {
        // Source momentanément indisponible : la page reste sans image, il suffit de relancer.
        console.error(`${p.cle} : ${e.message} (à relancer)`);
        continue;
      }
      if (origines.has(c.origine)) throw new Error(`${p.cle} : image déjà utilisée ailleurs sur le site (${c.origine})`);
      await enregistrer(await telecharger(c.telechargement, 'buffer'), p.cle);
      entree = { fichier: fichierDe(p.cle), source: c.source, credit: c.credit, licence: c.licence, page: c.page, alt: choix.alt, origine: c.origine };
    } else {
      const libelle = choix?.carte ?? 'Solelis';
      const rubrique = p.cle.startsWith('conseil:') ? 'Conseils' : 'Guides';
      await enregistrer(Buffer.from(carteSvg(libelle, rubrique)), p.cle);
      entree = { fichier: fichierDe(p.cle), source: 'carte', credit: 'Solelis', licence: null, page: null, alt: choix?.alt ?? `Illustration Solelis : un soleil blanc sur fond bleu nuit, avec la mention « ${libelle} »`, origine: `carte:${p.cle}` };
    }
    origines.add(entree.origine);
    donnees[p.cle] = { ...entree, largeur: LARGEUR, hauteur: HAUTEUR };
    console.log(`${p.cle} : ${entree.source === 'carte' ? 'carte' : `${entree.source} (${entree.credit})`}`);
  }

  if (!apercu) {
    const trie = Object.fromEntries(Object.entries(donnees).sort(([a], [b]) => a.localeCompare(b)));
    fs.writeFileSync(FICHIER_DONNEES, JSON.stringify(trie, null, 2) + '\n');
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
