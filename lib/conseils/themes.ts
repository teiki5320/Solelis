import type { OgCat } from '../og';
import type { ThemeConseil } from './types';

export { THEMES_CONSEILS, type ThemeConseil } from './types';

/** Libellé affiché pour chaque thème (filtres, fil d'Ariane, image de partage). */
export const LIBELLES_THEMES: Record<ThemeConseil, string> = {
  dettes: 'Dettes',
  procedures: 'Procédures',
  dirigeant: 'Dirigeant·e',
  salaries: 'Salarié·e·s',
  aides: 'Aides',
};

/** Couleur d'accent de l'image de partage (/api/og) selon le thème. */
export const CATEGORIES_OG: Record<ThemeConseil, OgCat> = {
  dettes: 'situation',
  procedures: 'procedure',
  dirigeant: 'defaut',
  salaries: 'courrier',
  aides: 'aide',
};
