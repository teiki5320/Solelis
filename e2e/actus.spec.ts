import { test, expect, type Page } from '@playwright/test';

/** Fichier de la veille simulé : 22 actus (la page en montre 20), une seule liée aux dettes URSSAF. */
const flux = {
  version: 3,
  site: 'solelis',
  genere_le: '2026-10-27T08:01:05.037Z',
  actus: Array.from({ length: 22 }, (_, i) => ({
    id: String(i + 1).padStart(40, '0'),
    titre: `Actu simulée numéro ${i + 1}`,
    resume: 'Résumé réécrit de l’actu simulée, en deux phrases courtes.',
    source_nom: 'Le Monde',
    source_url: `https://www.lemonde.fr/simule/${i + 1}`,
    publie_le: '2026-10-27T08:00:00.000Z',
    tags: i === 1 ? ['situation:dettes-urssaf'] : [],
    image:
      i % 2
        ? { url: `https://teiki5320.github.io/veille/cartes/solelis/${i}.svg`, source: 'carte', credit: 'Illustration : Solelis', licence: null, page: null, alt: 'Illustration Solelis', largeur: 1600, hauteur: 900 }
        : { url: `https://teiki5320.github.io/veille/images/solelis/${i}.webp`, source: 'wikimedia', credit: 'Auteur', licence: 'CC BY-SA 4.0', page: 'https://commons.wikimedia.org/wiki/File:X.jpg', alt: `Photo ${i}`, largeur: 1600, hauteur: 900 },
  })),
};

async function simulerVeille(page: Page, reponse: 'ok' | 'coupee') {
  await page.route('https://teiki5320.github.io/veille/actus/solelis.json', (route) =>
    reponse === 'ok' ? route.fulfill({ json: flux }) : route.abort(),
  );
  // Les images simulées n'existent pas : on renvoie une image vide.
  await page.route(/teiki5320\.github\.io\/veille\/(images|cartes)\//, (route) => route.fulfill({ status: 404, body: '' }));
}

test.describe('Actualité', () => {
  test('la page /actus montre 20 actus, leur source et leur crédit', async ({ page }) => {
    await simulerVeille(page, 'ok');
    await page.goto('/actus');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('L’actualité des entreprises en difficulté');
    await expect(page.getByText('Actu simulée numéro 1', { exact: true })).toBeVisible();
    await expect(page.locator('[data-bloc-actus] article')).toHaveCount(20);
    await expect(page.getByText('Actu simulée numéro 21')).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Source : Le Monde/ }).first()).toHaveAttribute('rel', 'noopener nofollow');
    await expect(page.getByText('Illustration : Solelis').first()).toBeVisible();
    await expect(page.getByText(/Mis à jour le 27 octobre 2026/)).toBeVisible();
    const largeur = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(largeur).toBeLessThanOrEqual(0);
  });

  test('une page situation montre ses actus, une autre n’a aucun bloc', async ({ page }) => {
    await simulerVeille(page, 'ok');
    await page.goto('/situation/dettes-urssaf');
    await expect(page.getByRole('heading', { name: 'Dans l\'actualité' })).toBeVisible();
    await expect(page.locator('[data-bloc-actus] article')).toHaveCount(1);
    await page.goto('/situation/credit-bancaire');
    await expect(page.getByRole('heading', { name: 'Ressources utiles' })).toBeVisible();
    await expect(page.locator('[data-bloc-actus]')).toHaveCount(0);
  });

  test('veille coupée : les pages restent intactes, sans bloc vide', async ({ page }) => {
    await simulerVeille(page, 'coupee');
    await page.goto('/actus');
    await expect(page.getByText('Les actualités ne sont pas disponibles pour le moment.')).toBeVisible();
    await page.goto('/situation/dettes-urssaf');
    await expect(page.getByRole('heading', { name: 'Ressources utiles' })).toBeVisible();
    await expect(page.locator('[data-bloc-actus]')).toHaveCount(0);
  });

  test('l’accueil n’a aucune actu', async ({ page }) => {
    let demandee = false;
    await page.route('https://teiki5320.github.io/**', (route) => {
      demandee = true;
      return route.abort();
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(demandee).toBe(false);
    await expect(page.locator('[data-bloc-actus]')).toHaveCount(0);
  });
});
