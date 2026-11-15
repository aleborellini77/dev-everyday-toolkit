// Formattazione minima per i testi dei percorsi: `codice`, **grassetto**, [testo](https://link).
// Il testo viene prima "escapato", quindi dal Markdown non può uscire HTML arbitrario.
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function inline(text: string, links = true): string {
  const html = esc(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Dentro una card (che è già un link) i link non si possono annidare: restano testo.
  return !links ? html : html
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
}
