import { bodyOffset, checkLength, fail, type Tool } from './parse-tools';

export interface Category {
  id: string;
  title: string;
  when: string;
  tools: Tool[];
}

export interface StepTool {
  tool: Tool;
  category: string;
  note?: string;
}

export interface Step {
  title: string;
  /** Blocchi di testo: paragrafi, oppure elenchi puntati (`list: true`). */
  blocks: { list: boolean; lines: string[] }[];
  tools: StepTool[];
}

export interface DiagnosticPath {
  id: string;
  title: string;
  when: string;
  order: number;
  intro: string[];
  steps: Step[];
}

// - [[categoria/Nome del tool]]            oppure       - [[categoria/Nome]]: cosa guardare in questo passo
const REF = /^[-*]\s+\[\[([a-z0-9-]+)\/(.+?)\]\](?:\s*:\s+(.+?))?\s*$/i;
const STEP = /^##\s+(.+?)\s*$/;

/**
 * Corpo di un percorso: `## Titolo` apre un passo; sotto, testo libero e righe `- [[categoria/Tool]]`
 * che pescano il tool dalle categorie. Un riferimento che non esiste fa fallire la build con file e riga.
 */
export function parsePath(
  meta: { id: string; title: string; when: string; order: number },
  body: string,
  file: string,
  filePath: string | undefined,
  categories: Category[],
): DiagnosticPath {
  const offset = bodyOffset(filePath, body);
  const intro: string[] = [];
  const steps: Step[] = [];
  let current: Step | undefined;
  let listOpen = false;

  const pushText = (text: string, list: boolean) => {
    if (!current) return void intro.push(text);
    const last = current.blocks[current.blocks.length - 1];
    if (list && last?.list && listOpen) last.lines.push(text);
    else current.blocks.push({ list, lines: [text] });
  };

  body.split('\n').forEach((raw, i) => {
    const at = offset + i + 1;
    checkLength(file, at, raw);
    const line = raw.trim();
    if (!line || /^<!--.*-->$/.test(line)) {
      listOpen = false;
      return;
    }

    const heading = STEP.exec(line);
    if (heading) {
      current = { title: heading[1], blocks: [], tools: [] };
      steps.push(current);
      listOpen = false;
      return;
    }
    if (/^#{1,6}\s/.test(line)) fail(file, at, `usa solo titoli di secondo livello («## Titolo del passo»), trovato: «${line.slice(0, 60)}»`);

    if (line.includes('[[')) {
      const m = REF.exec(line);
      if (!m) fail(file, at, `riferimento non valido: «${line.slice(0, 80)}». Formato atteso: - [[categoria/Nome del tool]]`);
      if (!current) fail(file, at, 'i tool vanno messi sotto un passo («## Titolo»)');
      const [, catId, toolName, note] = m;
      const category = categories.find((c) => c.id.toLowerCase() === catId.toLowerCase());
      if (!category) {
        fail(file, at, `categoria inesistente: «${catId}». Categorie disponibili: ${categories.map((c) => c.id).join(', ')}`);
      }
      const tool = category.tools.find((t) => t.name.toLowerCase() === toolName.trim().toLowerCase());
      if (!tool) {
        fail(file, at, `nella categoria «${category.id}» non esiste il tool «${toolName}». Disponibili: ${category.tools.map((t) => t.name).join(', ')}`);
      }
      current.tools.push({ tool, category: category.id, ...(note ? { note } : {}) });
      listOpen = false;
      return;
    }

    const bullet = /^[-*]\s+(.+)$/.exec(line);
    if (bullet) {
      pushText(bullet[1], true);
      listOpen = true;
    } else {
      pushText(line, false);
      listOpen = false;
    }
  });

  if (steps.length === 0) fail(file, 1, 'il percorso non contiene nessun passo («## Titolo»)');
  for (const s of steps) {
    if (s.tools.length === 0 && s.blocks.length === 0) fail(file, 1, `il passo «${s.title}» è vuoto`);
  }
  return { ...meta, intro, steps };
}
