import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import {
  cataloguePages,
  construireConseils,
  dateEnLettres,
  lireEnTete,
  minuitParis,
  schemaEnTete,
  titreDepuisSource,
} from '../conseils/construction';
import {
  conseilPublie,
  conseilsDuMemeTheme,
  conseilsPublies,
  corpsVisible,
  entreesSitemapConseils,
  estPublie,
  jourParis,
  liensVisibles,
} from '../conseils';
import type { Conseil } from '../conseils/types';
import { COURRIERS } from '../courriers';
import { generateStaticParams as paramsSituation } from '../../app/situation/[slug]/page';
import { generateStaticParams as paramsFaq } from '../../app/faq/[situation]/page';

const RACINE = join(__dirname, '..', '..');

/** Article au format des rédacteurs, champs remplaçables. */
function md(champs: Record<string, string> = {}, corps = '## Partie\n\nTexte avec un [lien](/outils/ati).') {
  const base: Record<string, string> = {
    title: 'Cessation des paiements : que faire ?',
    description: 'Ce que dit la loi et les démarches à faire dans les 45 jours.',
    date: '2026-10-12',
    miseAJour: '2026-10-12',
    theme: 'procedures',
    resume: 'Vous avez 45 jours pour déclarer la cessation des paiements.',
    sources: '\n  - titre: Code de commerce, art. L631-4\n    url: https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000005634379/',
    liens: '\n  - /outils/prescription\n  - /courriers/echelonnement-urssaf',
    ...champs,
  };
  const lignes = Object.entries(base)
    .filter(([, v]) => v !== '__absent__')
    .map(([k, v]) => (v.startsWith('\n') ? `${k}:${v}` : `${k}: ${v}`));
  return `---\n${lignes.join('\n')}\n---\n${corps}\n`;
}

const PAGES = new Map<string, string>([
  ['/', 'Accueil'],
  ['/outils/ati', 'Simulateur ATI'],
  ['/outils/prescription', 'Vérificateur de prescription'],
  ['/courriers/echelonnement-urssaf', 'Modèle de courrier : URSSAF'],
  ['/faq', 'Questions fréquentes'],
]);

const construire = (fichiers: Array<[string, string]>) =>
  construireConseils(
    fichiers.map(([nom, contenu]) => ({ nom, contenu })),
    PAGES,
  );

describe('Conseils — lecture de l’en-tête', () => {
  it('accepte « : » dans une valeur, les guillemets, les commentaires et les listes', () => {
    const { meta, corps } = lireEnTete(
      [
        '---',
        'title: "Dettes : que faire ?"',
        "description: L'essentiel : délais et recours",
        'date: 2026-10-12            # date de publication',
        'resume: >',
        '  Première ligne',
        '  et suite.',
        'sources:',
        '  - titre: Code de commerce, art. L631-4',
        '    url: https://www.legifrance.gouv.fr/x#ancre',
        'liens: [/outils/ati, /faq]',
        '---',
        'Corps',
      ].join('\n'),
    );
    expect(meta.title).toBe('Dettes : que faire ?');
    expect(meta.description).toBe("L'essentiel : délais et recours");
    expect(meta.date).toBe('2026-10-12');
    expect(meta.resume).toBe('Première ligne et suite.');
    expect(meta.sources).toEqual([{ titre: 'Code de commerce, art. L631-4', url: 'https://www.legifrance.gouv.fr/x#ancre' }]);
    expect(meta.liens).toEqual(['/outils/ati', '/faq']);
    expect(corps).toBe('Corps');
  });

  it('refuse un fichier sans en-tête ou un champ en double', () => {
    expect(() => lireEnTete('Pas d’en-tête')).toThrow(/en-tête manquant/);
    expect(() => lireEnTete('---\ntitle: a\ntitle: b\n---\n')).toThrow(/deux fois/);
  });
});

describe('Conseils — validation (Zod)', () => {
  const valider = (champs: Record<string, string>) => schemaEnTete.safeParse(lireEnTete(md(champs)).meta);
  const messages = (champs: Record<string, string>) => {
    const r = valider(champs);
    return r.success ? [] : r.error.issues.map((i) => `${i.path.join('.')} ${i.message}`);
  };

  it('accepte un article complet ; brouillon vaut false par défaut', () => {
    const r = valider({});
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.brouillon).toBe(false);
    const b = valider({ brouillon: 'true' });
    expect(b.success && b.data.brouillon).toBe(true);
  });

  it.each([
    [{ title: 'x'.repeat(71) }, /title trop long/],
    [{ description: 'x'.repeat(161) }, /description trop long/],
    [{ theme: 'fiscalite' }, /theme inconnu/],
    [{ date: '12/10/2026' }, /AAAA-MM-JJ/],
    [{ date: '2026-02-30', miseAJour: '2026-03-01' }, /date inexistante/],
    [{ miseAJour: '2026-10-11' }, /miseAJour ne peut pas précéder/],
    [{ resume: '__absent__' }, /resume manquant/],
    [{ sources: '\n  - titre: Source\n    url: http://www.legifrance.gouv.fr' }, /https/],
    [{ sources: '__absent__' }, /sources/],
    [{ liens: '\n  - outils/ati' }, /commencer par « \/ »/],
    [{ liens: '\n  - //exemple.com' }, /commencer par « \/ »/],
    [{ brouillon: 'oui' }, /brouillon/],
    [{ auteur: 'Jean' }, /champ inconnu : auteur/],
  ])('refuse %o', (champs, attendu) => {
    expect(messages(champs as Record<string, string>).join(' | ')).toMatch(attendu);
  });
});

describe('Conseils — construction (build)', () => {
  it('produit un article prêt à afficher', () => {
    const { conseils, erreurs } = construire([['cessation.md', md()]]);
    expect(erreurs).toEqual([]);
    const c = conseils[0];
    expect(c.slug).toBe('cessation');
    expect(c.dateLisible).toBe('12 octobre 2026');
    expect(c.publieLe).toBe('2026-10-12T00:00:00+02:00');
    expect(c.html).toContain('<h2 id="partie">Partie</h2>');
    expect(c.html).toContain('<a href="/outils/ati">lien</a>');
    expect(c.liens).toEqual([
      { href: '/outils/prescription', libelle: 'Vérificateur de prescription' },
      { href: '/courriers/echelonnement-urssaf', libelle: 'Modèle de courrier : URSSAF' },
    ]);
  });

  it('liens externes : target="_blank" rel="noreferrer" ; mailto, tel et ancres acceptés', () => {
    const { conseils, erreurs } = construire([
      ['a.md', md({}, 'Voir [Légifrance](https://www.legifrance.gouv.fr), [3957](tel:3957), [haut](#partie).')],
    ]);
    expect(erreurs).toEqual([]);
    expect(conseils[0].html).toContain('<a href="https://www.legifrance.gouv.fr" target="_blank" rel="noreferrer">Légifrance</a>');
    expect(conseils[0].html).toContain('<a href="tel:3957">3957</a>');
  });

  it('lien interne vers une page inexistante (corps ou liens) → erreur de build', () => {
    const corps = construire([['a.md', md({}, 'Voir [ceci](/outils/nexiste-pas).')]]);
    expect(corps.erreurs.join()).toMatch(/a\.md : lien interne vers une page inexistante : \/outils\/nexiste-pas/);
    const liens = construire([['a.md', md({ liens: '\n  - /conseils/inconnu' })]]);
    expect(liens.erreurs.join()).toMatch(/liens : page inexistante \/conseils\/inconnu/);
  });

  it('lien vers un autre article : accepté et marqué (data-conseil), libellé = titre de l’article', () => {
    const { conseils, erreurs } = construire([
      ['a.md', md({ liens: '\n  - /conseils/b' }, 'Voir [l’autre](/conseils/b#partie).')],
      ['b.md', md({ title: 'Article B', brouillon: 'true' })],
    ]);
    expect(erreurs).toEqual([]);
    const a = conseils.find((c) => c.slug === 'a')!;
    expect(a.html).toContain('<a href="/conseils/b#partie" data-conseil="b">');
    expect(a.conseilsCites).toEqual(['b']);
    expect(a.liens).toEqual([{ href: '/conseils/b', libelle: 'Article B', conseil: 'b' }]);
  });

  it('ancre et paramètres ignorés pour vérifier un lien interne', () => {
    const { erreurs } = construire([['a.md', md({ liens: '\n  - /faq#cessation' }, '[x](/outils/ati?y=1)')]]);
    expect(erreurs).toEqual([]);
  });

  it.each([
    ['# Titre 1', /titre « # Titre 1 » interdit/],
    ['![image](https://exemple.fr/a.png)', /image non prise en charge/],
    ['<div>html</div>', /HTML brut interdit/],
    ['Texte <b>gras</b>', /HTML brut interdit/],
    ['[x](http://www.impots.gouv.fr)', /passez en https/],
    ['[x](javascript:alert(1))', /lien refusé/],
  ])('corps refusé : %s', (corps, attendu) => {
    expect(construire([['a.md', md({}, corps)]]).erreurs.join()).toMatch(attendu);
  });

  it('les commentaires HTML (notes de rédaction) sont retirés sans erreur', () => {
    const { conseils, erreurs } = construire([['a.md', md({}, 'Texte\n\n<!-- à vérifier -->\n\nSuite')]]);
    expect(erreurs).toEqual([]);
    expect(conseils[0].html).not.toContain('vérifier');
  });

  it('slug en double, nom de fichier invalide, corps vide → erreurs', () => {
    expect(construire([['a.md', md()], ['A.md', md()]]).erreurs.join()).toMatch(/nom de fichier invalide/);
    expect(construire([['a.md', md()], ['a.MD', md()]]).erreurs.join()).toMatch(/en double/);
    expect(construire([['Cessation_Paiements.md', md()]]).erreurs.join()).toMatch(/nom de fichier invalide/);
    expect(construire([['a.md', md({}, '   ')]]).erreurs.join()).toMatch(/corps de l’article vide/);
  });

  it('trie du plus récent au plus ancien', () => {
    const { conseils } = construire([
      ['ancien.md', md({ date: '2026-01-05', miseAJour: '2026-01-05' })],
      ['futur.md', md({ date: '2027-03-01', miseAJour: '2027-03-01' })],
      ['moyen.md', md({ date: '2026-10-12' })],
    ]);
    expect(conseils.map((c) => c.slug)).toEqual(['futur', 'moyen', 'ancien']);
  });

  it('dates : 1er du mois, heure d’hiver et d’été à Paris', () => {
    expect(dateEnLettres('2026-11-01')).toBe('1er novembre 2026');
    expect(minuitParis('2026-07-14')).toBe('2026-07-14T00:00:00+02:00');
    expect(minuitParis('2026-12-25')).toBe('2026-12-25T00:00:00+01:00');
  });
});

describe('Conseils — pages du site connues (cibles des liens)', () => {
  it('contient toutes les pages dynamiques pré-générées et un titre pour chaque page fixe', async () => {
    const pages = await cataloguePages(RACINE);
    for (const c of COURRIERS) expect(pages.has(`/courriers/${c.slug}`)).toBe(true);
    for (const { slug } of paramsSituation()) expect(pages.has(`/situation/${slug}`), slug).toBe(true);
    for (const { situation } of await paramsFaq()) expect(pages.has(`/faq/${situation}`), situation).toBe(true);
    for (const chemin of ['/', '/outils/ati', '/glossaire', '/annuaires/cip', '/conseils']) expect(pages.has(chemin), chemin).toBe(true);
    for (const exclu of ['/api/og', '/fiche/x', '/conseils/rss']) expect(pages.has(exclu), exclu).toBe(false);
    // Le titre est trouvé dans les métadonnées : jamais le chemin brut.
    for (const [chemin, titre] of pages) expect(titre, chemin).not.toBe(chemin);
  });

  it('lit pageTitle avant title et retire « — Solelis »', () => {
    expect(titreDepuisSource("titre: 'A',\n  pageTitle: 'B : c — Solelis',")).toBe('B : c');
    expect(titreDepuisSource("title: 'J\\'accompagne — Solelis',")).toBe("J'accompagne");
  });
});

/* ── Exécution : publication programmée ─────────────────────────────── */

function conseil(slug: string, date: string, autres: Partial<Conseil> = {}): Conseil {
  return {
    slug,
    title: `Titre ${slug}`,
    description: 'Description',
    date,
    miseAJour: date,
    publieLe: `${date}T00:00:00+02:00`,
    modifieLe: `${date}T00:00:00+02:00`,
    dateLisible: date,
    miseAJourLisible: date,
    theme: 'dettes',
    resume: 'Résumé',
    sources: [{ titre: 'Source', url: 'https://www.legifrance.gouv.fr' }],
    liens: [],
    brouillon: false,
    html: '<p>Corps</p>',
    conseilsCites: [],
    ...autres,
  };
}

describe('Conseils — date du jour à Paris', () => {
  it('bascule à minuit heure de Paris (été : UTC+2, hiver : UTC+1)', () => {
    expect(jourParis(new Date('2026-10-11T21:59:59Z'))).toBe('2026-10-11');
    expect(jourParis(new Date('2026-10-11T22:00:00Z'))).toBe('2026-10-12');
    expect(jourParis(new Date('2026-12-31T22:59:59Z'))).toBe('2026-12-31');
    expect(jourParis(new Date('2026-12-31T23:00:00Z'))).toBe('2027-01-01');
  });
});

describe('Conseils — filtre de publication', () => {
  const TOUS = [
    conseil('demain', '2026-10-13'),
    conseil('aujourdhui', '2026-10-12', { liens: [{ href: '/conseils/demain', libelle: 'Demain', conseil: 'demain' }, { href: '/faq', libelle: 'FAQ' }] }),
    conseil('brouillon', '2026-01-01', { brouillon: true }),
    conseil('hier', '2026-10-11'),
    conseil('autre-theme', '2026-10-01', { theme: 'aides' }),
  ];

  it('veille : l’article du 12 n’est pas encore publié', () => {
    expect(estPublie(TOUS[1], '2026-10-11')).toBe(false);
    expect(conseilPublie('aujourdhui', '2026-10-11', TOUS)).toBeNull();
  });

  it('jour même : publié dès 0 h ; lendemain : toujours publié', () => {
    expect(conseilPublie('aujourdhui', '2026-10-12', TOUS)?.slug).toBe('aujourdhui');
    expect(conseilPublie('aujourdhui', '2026-10-13', TOUS)?.slug).toBe('aujourdhui');
  });

  it('liste : plus récent d’abord, sans article futur ni brouillon', () => {
    expect(conseilsPublies('2026-10-12', TOUS).map((c) => c.slug)).toEqual(['aujourdhui', 'hier', 'autre-theme']);
    expect(conseilsPublies('2030-01-01', TOUS).map((c) => c.slug)).not.toContain('brouillon');
    expect(conseilPublie('brouillon', '2030-01-01', TOUS)).toBeNull();
    expect(conseilPublie('inconnu', '2030-01-01', TOUS)).toBeNull();
  });

  it('même thème : 3 au plus, publiés, sans l’article lui-même', () => {
    expect(conseilsDuMemeTheme(TOUS[1], '2026-10-12', TOUS).map((c) => c.slug)).toEqual(['hier']);
    expect(conseilsDuMemeTheme(TOUS[1], '2026-10-13', TOUS).map((c) => c.slug)).toEqual(['demain', 'hier']);
  });

  it('les liens vers un article pas encore publié sont masqués jusqu’au jour J', () => {
    expect(liensVisibles(TOUS[1], '2026-10-12', TOUS).map((l) => l.href)).toEqual(['/faq']);
    expect(liensVisibles(TOUS[1], '2026-10-13', TOUS).map((l) => l.href)).toEqual(['/conseils/demain', '/faq']);

    const avecLien = conseil('a', '2026-10-12', {
      html: '<p>Voir <a href="/conseils/demain" data-conseil="demain">demain</a> et <a href="/conseils/hier" data-conseil="hier">hier</a>.</p>',
      conseilsCites: ['demain', 'hier'],
    });
    expect(corpsVisible(avecLien, '2026-10-12', TOUS)).toBe(
      '<p>Voir demain et <a href="/conseils/hier" data-conseil="hier">hier</a>.</p>',
    );
    expect(corpsVisible(avecLien, '2026-10-13', TOUS)).toBe(avecLien.html);
  });

  it('sitemap : /conseils et les articles publiés (lastmod = miseAJour), rien si aucun article', () => {
    const entrees = entreesSitemapConseils('2026-10-12', TOUS);
    expect(entrees.map((e) => e.url)).toEqual([
      'https://solelis.com/conseils',
      'https://solelis.com/conseils/aujourdhui',
      'https://solelis.com/conseils/hier',
      'https://solelis.com/conseils/autre-theme',
    ]);
    expect(entrees[0].lastModified).toBe('2026-10-12');
    expect(entreesSitemapConseils('2026-10-12', [conseil('futur', '2027-01-01')])).toEqual([]);
  });
});
