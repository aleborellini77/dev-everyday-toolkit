import fs from 'node:fs';

export interface Tool {
  name: string;
  url: string;
  description: string;
  cmd?: string;
  tags: string[];
}

// - [Nome](https://url) `comando facoltativo`: descrizione #tag #altro-tag   (separatore ":" "—" o "–")
const TOOL_LINE = /^[-*]\s+\[([^\]]+)\]\((\S+?)\)(?:\s+`([^`]+)`)?\s*(?::|—|–)\s+(.+?)\s*$/;
const COMMENT_LINE = /^<!--.*-->$/;
// Tag in coda alla descrizione: " #cli #mac". "C#" non conta (manca lo spazio prima del #).
const TAG_TAIL = /(?:(?:^|\s+)#[a-z][a-z0-9-]*)+\s*$/i;

export class ContentError extends Error {
  constructor(public file: string, public line: number, message: string) {
    super(`${file}:${line}: ${message}`);
  }
}

/** Riga (1-based) in cui inizia `body` dentro il file, per dare errori con il numero di riga vero. */
export function bodyOffset(filePath: string | undefined, body: string): number {
  if (!filePath) return 0;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const at = raw.indexOf(body);
    return at < 0 ? 0 : raw.slice(0, at).split('\n').length - 1;
  } catch {
    return 0;
  }
}

/** Le righe vere sono corte (qualche centinaio di caratteri). Un tetto evita che righe enormi mettano in crisi le regex. */
export const MAX_LINE = 1000;
export function checkLength(file: string, line: number, text: string): void {
  if (text.length > MAX_LINE) fail(file, line, `riga troppo lunga (${text.length} caratteri, massimo ${MAX_LINE})`);
}

export function fail(file: string, line: number, message: string): never {
  // Su GitHub Actions l'annotazione compare direttamente sul file, nella pagina della PR/commit.
  if (process.env.GITHUB_ACTIONS) console.error(`::error file=${file},line=${line}::${message}`);
  throw new ContentError(file, line, message);
}

/** `vocabulary`: tag ammessi (da content/_tags.md). Se manca, i tag non vengono controllati. */
export function parseTools(body: string, file: string, filePath?: string, vocabulary?: Set<string>): Tool[] {
  const offset = bodyOffset(filePath, body);
  const tools: Tool[] = [];
  const seen = new Set<string>();

  body.split('\n').forEach((raw, i) => {
    const at = offset + i + 1;
    checkLength(file, at, raw);
    const line = raw.trim();
    if (!line || COMMENT_LINE.test(line)) return;

    const m = TOOL_LINE.exec(line);
    if (!m) {
      fail(
        file,
        at,
        `riga non valida: «${line.slice(0, 80)}». Formato atteso: - [Nome](https://indirizzo): descrizione  (vedi content/_FORMATO.md)`,
      );
    }
    const [, name, url, cmd, rawDescription] = m;

    const tail = TAG_TAIL.exec(rawDescription);
    const description = (tail ? rawDescription.slice(0, tail.index) : rawDescription).trim();
    const tags = [...new Set([...(tail?.[0] ?? '').matchAll(/#([a-z][a-z0-9-]*)/gi)].map((t) => t[1].toLowerCase()))];
    if (!description) fail(file, at, 'manca la descrizione (ci sono solo dei tag)');
    for (const tag of tags) {
      if (vocabulary && !vocabulary.has(tag)) {
        fail(file, at, `tag sconosciuto: #${tag}. Tag ammessi: ${[...vocabulary].join(', ')}. Per crearne uno nuovo aggiungilo a content/_tags.md`);
      }
    }

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return fail(file, at, `indirizzo non valido: ${url}`);
    }
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      fail(file, at, `l'indirizzo deve iniziare con http:// o https:// (trovato: ${url})`);
    }
    if (seen.has(url)) fail(file, at, `indirizzo duplicato nella stessa categoria: ${url}`);
    seen.add(url);

    tools.push({ name: name.trim(), url, description, tags, ...(cmd ? { cmd } : {}) });
  });

  if (tools.length === 0) fail(file, 1, 'la categoria non contiene nessun tool');
  return tools;
}
