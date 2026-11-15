/** Indirizzo interno che rispetta il base path di GitHub Pages (/nome-repo). */
export const url = (path = ''): string =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
