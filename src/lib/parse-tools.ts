import fs from 'node:fs';

export interface Tool {
  name: string;
  url: string;
  description: string;
  cmd?: string;
}

// - [Nome](https://url) `comando facoltativo`: descrizione      (separatore ":" "—" o "–")
const TOOL_LINE = /^[-*]\s+\[([^\]]+)\]\((\S+?)\)(?:\s+`([^`]+)`)?\s*(?::|—|–)\s+(.+?)\s*$/;
const COMMENT_LINE = /^<!--.*-->$/;

export class ContentError extends Error {
  constructor(public file: string, public line: number, message: string) {
    super(`${file}:${line}: ${message}`);
  }
}

/** Riga (1-based) in cui inizia `body` dentro il file, per dare errori con il numero di riga vero. */
function bodyOffset(filePath: string | undefined, body: string): number {
  if (!filePath) return 0;
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const at = raw.indexOf(body);
    return at < 0 ? 0 : raw.slice(0, at).split('\n').length - 1;
  } catch {
    return 0;
  }
}

function fail(file: string, line: number, message: string): never {
  // Su GitHub Actions l'annotazione compare direttamente sul file, nella pagina della PR/commit.
  if (process.env.GITHUB_ACTIONS) console.error(`::error file=${file},line=${line}::${message}`);
  throw new ContentError(file, line, message);
}

export function parseTools(body: string, file: string, filePath?: string): Tool[] {
  const offset = bodyOffset(filePath, body);
  const tools: Tool[] = [];
  const seen = new Set<string>();

  body.split('\n').forEach((raw, i) => {
    const line = raw.trim();
    if (!line || COMMENT_LINE.test(line)) return;
    const at = offset + i + 1;

    const m = TOOL_LINE.exec(line);
    if (!m) {
      fail(
        file,
        at,
        `riga non valida: «${line.slice(0, 80)}». Formato atteso: - [Nome](https://indirizzo): descrizione  (vedi content/_FORMATO.md)`,
      );
    }
    const [, name, url, cmd, description] = m;

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

    tools.push({ name: name.trim(), url, description, ...(cmd ? { cmd } : {}) });
  });

  if (tools.length === 0) fail(file, 1, 'la categoria non contiene nessun tool');
  return tools;
}
