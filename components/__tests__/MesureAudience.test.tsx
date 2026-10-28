// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import MesureAudience, { pageMesurable } from '../MesureAudience';

describe('MesureAudience', () => {
  beforeEach(() => document.head.querySelectorAll('script[data-cf-beacon]').forEach((s) => s.remove()));

  it('ne mesure jamais la fiche ni le questionnaire', () => {
    expect(pageMesurable('/fiche/abc123')).toBe(false);
    expect(pageMesurable('/questionnaire')).toBe(false);
    expect(pageMesurable('/')).toBe(true);
    expect(pageMesurable('/conseils/mandat-ad-hoc')).toBe(true);
    expect(pageMesurable('/fiches-utiles')).toBe(true);
  });

  it('charge une seule fois le script, sans suivi de la navigation', () => {
    window.history.replaceState(null, '', '/conseils');
    render(<MesureAudience />);
    render(<MesureAudience />);
    const scripts = document.head.querySelectorAll('script[data-cf-beacon]');
    expect(scripts).toHaveLength(1);
    expect(scripts[0].getAttribute('src')).toBe('https://static.cloudflareinsights.com/beacon.min.js');
    expect(JSON.parse(scripts[0].getAttribute('data-cf-beacon') ?? '{}')).toMatchObject({ spa: false });
  });

  it('ne charge rien sur une fiche', () => {
    window.history.replaceState(null, '', '/fiche/abc123');
    render(<MesureAudience />);
    expect(document.head.querySelectorAll('script[data-cf-beacon]')).toHaveLength(0);
  });
});
