import { getCollection } from 'astro:content';
import { parseTools } from './parse-tools';
import { loadTagVocabulary } from './tags';
import { parsePath, type Category, type DiagnosticPath } from './paths';

export interface UsedTag {
  id: string;
  description: string;
  count: number;
}

/** Legge e valida tutto il contenuto: se qualcosa è scritto male la build si ferma qui, con file e riga. */
export async function loadSite() {
  const vocabulary = loadTagVocabulary();
  const allowed = new Set(vocabulary.map((t) => t.id));

  const entries = (await getCollection('categories')).sort(
    (a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id),
  );
  const categories: Category[] = entries.map((e) => ({
    id: e.id,
    title: e.data.title,
    when: e.data.when,
    tools: parseTools(e.body ?? '', `content/${e.id}.md`, e.filePath, allowed),
  }));

  const counts = new Map<string, number>();
  for (const c of categories) for (const t of c.tools) for (const tag of t.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  // Solo i tag usati, nell'ordine in cui sono elencati in _tags.md.
  const tags: UsedTag[] = vocabulary
    .filter((t) => counts.has(t.id))
    .map((t) => ({ ...t, count: counts.get(t.id)! }));

  const pathEntries = (await getCollection('paths')).sort(
    (a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id),
  );
  const paths: DiagnosticPath[] = pathEntries.map((e) =>
    parsePath(
      { id: e.id, title: e.data.title, when: e.data.when, order: e.data.order },
      e.body ?? '',
      `content/percorsi/${e.id}.md`,
      e.filePath,
      categories,
    ),
  );

  return { categories, tags, paths };
}
