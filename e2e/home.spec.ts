import { test, expect } from '@playwright/test';

test.describe('Page d\'accueil', () => {
  test('affiche le titre et le champ SIRET', async ({ page }) => {
    await page.goto('/');
    // Le H1 contient le mot « difficulté » dans les variations courantes.
    await expect(page.locator('h1').first()).toBeVisible();
    // Le champ SIRET est présent.
    const siretInput = page.getByLabel(/SIRET/i);
    await expect(siretInput).toBeVisible();
  });

  test('refuse un SIRET trop court', async ({ page }) => {
    await page.goto('/');
    const siretInput = page.getByLabel(/SIRET/i);
    await siretInput.fill('12345');
    await page.getByRole('button', { name: /Lancer|Démarrer|Commencer|Continuer/i }).first().click();
    await expect(page.getByText(/14 chiffres/i)).toBeVisible();
  });

  test('refuse un SIRET dont la clé de contrôle est fausse', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/SIRET/i).fill('12345678901234');
    await page.getByRole('button', { name: /Lancer|Démarrer|Commencer|Continuer/i }).first().click();
    await expect(page.getByText(/chiffre semble mal saisi/i)).toBeVisible();
  });

  test('redirige vers le questionnaire avec un SIRET valide', async ({ page }) => {
    await page.goto('/');
    const siretInput = page.getByLabel(/SIRET/i);
    // SIRET réel et public (siège de La Poste) : la clé de contrôle est vérifiée.
    await siretInput.fill('35600000000048');
    await page.getByRole('button', { name: /Lancer|Démarrer|Commencer|Continuer/i }).first().click();
    await page.waitForURL(/\/questionnaire/, { timeout: 5000 });
    expect(page.url()).toContain('/questionnaire');
  });
});

test.describe('Navigation principale', () => {
  test('les pages outils sont accessibles', async ({ page }) => {
    await page.goto('/outils');
    await expect(page.locator('h1')).toContainText(/outils/i);
    // Au moins 9 outils
    const links = page.locator('a[href^="/outils/"]');
    await expect(links).toHaveCount(await links.count());
    expect(await links.count()).toBeGreaterThanOrEqual(9);
  });

  test('la FAQ générale s\'affiche', async ({ page }) => {
    await page.goto('/faq');
    await expect(page.locator('h1')).toContainText(/Questions|FAQ/i);
  });

  test('les FAQ ciblées sont accessibles', async ({ page }) => {
    for (const slug of ['urssaf-impayee', 'pge-en-difficulte', 'assignation-tribunal']) {
      await page.goto(`/faq/${slug}`);
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});
