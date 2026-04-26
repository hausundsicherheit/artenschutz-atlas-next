/**
 * Mini-Markdown → HTML
 * Bewusst ohne externe Dependency. Unterstützt:
 * - Headings (## ###)
 * - Bold/Italic
 * - Links [text](url)
 * - Listen (- item)
 * - Tabellen (| ... |)
 * - Code-Inline `code`
 * - Blockquote (>)
 * - Horizontal rule (---)
 * - Paragraphen
 *
 * Sicher für reines Trusted-Content (Atlas-Blog kommt aus eigener DB).
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function inline(text: string): string {
  // Reihenfolge wichtig
  // Inline-Code zuerst (sonst werden ** in `**` als bold geparsed)
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${escapeHtml(c)}</code>`);
  // Links
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text;
}

export function markdownToHtml(md: string): string {
  if (!md) return '';
  const lines = md.split('\n');
  const out: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Empty line → paragraph break
    if (!line.trim()) {
      i++;
      continue;
    }

    // Headings
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(escapeHtml(h[2]))}</h${level}>`);
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      out.push('<hr/>');
      i++;
      continue;
    }

    // Blockquote (kann mehrzeilig sein)
    if (/^>\s/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''));
        i++;
      }
      out.push(`<blockquote>${inline(escapeHtml(buf.join(' ')))}</blockquote>`);
      continue;
    }

    // Tabelle: Erkennung über 2. Zeile mit "---"
    if (line.includes('|') && i + 1 < lines.length && /^\s*\|?\s*[:-]+\s*\|/.test(lines[i + 1])) {
      const headerCells = line
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((c) => c.trim());
      i += 2; // Header + Separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim()) {
        rows.push(
          lines[i]
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((c) => c.trim())
        );
        i++;
      }
      const thead = `<thead><tr>${headerCells
        .map((c) => `<th>${inline(escapeHtml(c))}</th>`)
        .join('')}</tr></thead>`;
      const tbody = `<tbody>${rows
        .map((r) => `<tr>${r.map((c) => `<td>${inline(escapeHtml(c))}</td>`).join('')}</tr>`)
        .join('')}</tbody>`;
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // Liste (- item)
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      out.push(`<ul>${items.map((it) => `<li>${inline(escapeHtml(it))}</li>`).join('')}</ul>`);
      continue;
    }

    // Numbered list (1. item)
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      out.push(`<ol>${items.map((it) => `<li>${inline(escapeHtml(it))}</li>`).join('')}</ol>`);
      continue;
    }

    // Paragraph (kann mehrere Zeilen umfassen bis Leerzeile)
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,4}\s|>\s|---+\s*$|[-*]\s|\d+\.\s)/.test(lines[i]) &&
      !lines[i].includes('|')
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${inline(escapeHtml(buf.join(' ')))}</p>`);
  }

  return out.join('\n');
}
