const KEY = 'dasha-astro.theme';

export type ThemeName = 'dark' | 'light';

export function readTheme(): ThemeName {
  return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(KEY, theme);
}

export function bootTheme() {
  try { applyTheme(readTheme()); } catch { document.documentElement.dataset.theme = 'dark'; }
}
