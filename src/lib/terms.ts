// Shared dictionary of bioregional / commons vocabulary used across the site.
//
// Used by:
//   - <Term> component for hover/tap definitions inline in templates
//   - Home page glossary spread (subset, see homeGlossary.terms)
//   - The Commons page glossary (richer entries — see src/content/pages/the-commons.md)
//
// Keep entries short — one or two sentences. Link out to the longer glossary
// on /the-commons/ when readers want more.

export interface TermDef {
  /** Canonical term (also the lookup key). */
  term: string;
  /** Short one-sentence definition shown in the hover popover. */
  short: string;
  /** Optional accent tone — used by the Term component for the dotted underline. */
  tone?: 'clay' | 'creek' | 'sage' | 'grass';
  /** Optional anchor link to the long glossary entry. */
  href?: string;
}

export const TERMS: Record<string, TermDef> = {
  bioregion: {
    term: 'bioregion',
    short:
      'A geographically and hydrologically defined area characterized by distinct ecological features that together form a coherent biocultural home.',
    tone: 'clay',
    href: '/the-commons/#glossary',
  },
  commons: {
    term: 'commons',
    short:
      'The living realities of shared place — the ecologies and resources for which all residents share responsibility, and on which all depend.',
    tone: 'creek',
    href: '/the-commons/#glossary',
  },
  commoning: {
    term: 'commoning',
    short:
      'The practice — the *verb* — of caring for a commons together. The garden is the noun; gardening is the commoning.',
    tone: 'sage',
    href: '/the-commons/#glossary',
  },
  'bioregional commons': {
    term: 'bioregional commons',
    short:
      'A commons organized at the scale of a bioregion: the people who live in a place collectively stewarding its shared ecological and cultural systems.',
    tone: 'grass',
    href: '/the-commons/#glossary',
  },
  'institutional self-negation': {
    term: 'institutional self-negation',
    short:
      'The practice of an institution explicitly limiting its own authority and refusing to claim ownership over what it serves. The aim is to be replaced by the community.',
    tone: 'clay',
  },
  enclosure: {
    term: 'enclosure',
    short:
      'The historical and ongoing process of turning shared land, knowledge, or relationships into private property — severing labor from ecology and community from place.',
    tone: 'creek',
  },
  'listeners’ council': {
    term: 'listeners’ council',
    short:
      'A gathering form: one person speaks at a time, holding a token; others listen without preparing a response. Drawn from many lineages.',
    tone: 'sage',
  },
  sociocracy: {
    term: 'sociocracy',
    short:
      'A consent-based decision-making practice: proposals move forward unless someone raises a meaningful objection. SPIRIT runs by sociocratic consent inside its Stewardship Council.',
    tone: 'grass',
  },
  'quadratic funding': {
    term: 'quadratic funding',
    short:
      'A community-weighted funding mechanism that amplifies the number of contributors rather than the size of contributions. A wealthy donor’s $10K funds less than 100 neighbors each giving $5.',
    tone: 'creek',
  },
  extitution: {
    term: 'extitution',
    short:
      'A coordination form that operates alongside and through institutions without being captured by them — facilitating connection rather than claiming ownership.',
    tone: 'grass',
  },
};

/** Case-insensitive lookup. Returns undefined if no entry matches. */
export function lookupTerm(name: string): TermDef | undefined {
  return TERMS[name.toLowerCase().trim()];
}

/**
 * Render the term HTML used by both <Term> and injectTermTooltips. Kept here so
 * the post-processor and component stay visually consistent without duplication.
 */
function termHtml(def: TermDef, label: string): string {
  const tone = def.tone ?? 'clay';
  const id = `term-pop-${def.term.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`;
  const escapedDef = def.short.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const moreLink = def.href
    ? `<a href="${def.href}" class="term-pop-more">Full glossary →</a>`
    : '';
  return (
    `<span class="term-wrap term-${tone}" data-term="${def.term}">` +
    `<button type="button" class="term-trigger" aria-describedby="${id}" aria-expanded="false">${label}</button>` +
    `<span id="${id}" role="tooltip" class="term-pop">` +
    `<span class="term-pop-label">${def.term}</span>` +
    `<span class="term-pop-def">${escapedDef}</span>` +
    `${moreLink}` +
    `</span>` +
    `</span>`
  );
}

/**
 * Walk a rendered HTML string and wrap the FIRST occurrence of each known term
 * with the same hover-tooltip markup the <Term> component emits. Only mutates
 * text nodes (not attribute values or tag interiors), and skips terms that
 * already appear inside an <a>, <button>, or existing .term-wrap.
 *
 * Usage:
 *   const html = injectTermTooltips(mdToHtml(spread.body));
 *
 * Notes:
 *   - Only one match per term per call, to keep tooltips uncrowded.
 *   - Pass `allow` to limit which terms get injected on a given spread.
 */
export function injectTermTooltips(html: string, allow?: string[]): string {
  if (!html) return html;

  // Split into tags vs text segments. Tags pass through unchanged.
  const segments = html.split(/(<[^>]+>)/);

  // Stack-track which "skip zones" we are inside (a/button/term-wrap).
  // When the stack has any entry, we leave text untouched.
  const skipStack: string[] = [];
  const skipOpenRe = /^<(a|button)\b|class="[^"]*\bterm-wrap\b[^"]*"/i;
  const aOpenRe = /^<(a|button)\b/i;
  const closeRe = /^<\/(a|button)>/i;

  // Order matters: longer/multi-word terms first so "bioregional commons"
  // matches before "commons" claims the word.
  const allTerms = Object.values(TERMS).sort((a, b) => b.term.length - a.term.length);
  const allowedSet = allow ? new Set(allow.map((t) => t.toLowerCase())) : null;
  const used = new Set<string>(); // terms already injected once on this pass

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    if (!seg) continue;

    // Tag — adjust skip-zone stack
    if (seg.startsWith('<')) {
      if (closeRe.test(seg)) {
        skipStack.pop();
      } else if (aOpenRe.test(seg) || /class="[^"]*\bterm-wrap\b[^"]*"/i.test(seg)) {
        // Self-closing tags don't push state
        if (!/\/>$/.test(seg)) skipStack.push(seg);
      }
      continue;
    }

    if (skipStack.length > 0) continue; // text inside a/button/term-wrap → skip

    // Text node — try to inject available terms. Each wrap splits the segment
    // into [text, wrap, text] pieces so subsequent term searches only see the
    // surrounding TEXT portions, never the injected HTML (which itself contains
    // URLs like /the-commons/ that would otherwise re-match the 'commons' term).
    type Piece = { type: 'text' | 'wrap'; value: string };
    let pieces: Piece[] = [{ type: 'text', value: seg }];

    for (const def of allTerms) {
      if (used.has(def.term)) continue;
      if (allowedSet && !allowedSet.has(def.term)) continue;
      const re = new RegExp(`\\b(${escapeForRegex(def.term)})\\b`, 'i');

      // Find the first TEXT piece that contains this term
      for (let j = 0; j < pieces.length; j++) {
        if (pieces[j].type !== 'text') continue;
        const text = pieces[j].value;
        const m = text.match(re);
        if (!m) continue;
        const before = text.slice(0, m.index!);
        const matched = m[1];
        const after = text.slice(m.index! + matched.length);
        pieces.splice(j, 1,
          { type: 'text', value: before },
          { type: 'wrap', value: termHtml(def, matched) },
          { type: 'text', value: after },
        );
        used.add(def.term);
        break; // only first occurrence of this term per pass
      }
    }

    segments[i] = pieces.map((p) => p.value).join('');
  }

  return segments.join('');
}

function escapeForRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
