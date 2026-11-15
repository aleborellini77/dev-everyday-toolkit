import fs from 'node:fs';
import { checkLength, fail } from './parse-tools';

export interface TagInfo {
  id: string;
  description: string;
}

const FILE = 'content/_tags.md';
const ENTRY = /^[-*]\s+([a-z][a-z0-9-]*)\s*:\s+(.+?)\s*$/i;

/** Legge il vocabolario dei tag da content/_tags.md: una riga `- tag: descrizione` per tag. */
export function loadTagVocabulary(file = FILE): TagInfo[] {
  let raw: string;
  try {
    raw = fs.readFileSync(file, 'utf-8');
  } catch {
    return [];
  }
  const tags: TagInfo[] = [];
  raw.split('\n').forEach((text, i) => {
    checkLength(file, i + 1, text);
    const line = text.trim();
    if (!line || line.startsWith('#') || /^<!--.*-->$/.test(line)) return;
    const m = ENTRY.exec(line);
    if (!m) fail(file, i + 1, `riga non valida: «${line.slice(0, 80)}». Formato atteso: - nome-tag: descrizione`);
    const id = m[1].toLowerCase();
    if (tags.some((t) => t.id === id)) fail(file, i + 1, `tag duplicato: ${id}`);
    tags.push({ id, description: m[2] });
  });
  return tags;
}
