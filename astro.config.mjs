import { defineConfig } from 'astro/config';

// For a project site (https://USER.github.io/REPO/) set ASTRO_SITE and ASTRO_BASE.
// The GitHub Actions workflow does this automatically.
export default defineConfig({
  output: 'static',
  site: process.env.ASTRO_SITE || undefined,
  base: process.env.ASTRO_BASE || '/',
});
