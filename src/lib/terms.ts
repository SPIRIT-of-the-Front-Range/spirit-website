// Shared dictionary of bioregional / commons vocabulary used across the site.
//
// Used by:
//   - <Term> component for hover/tap definitions inline in templates
//   - injectTermTooltips() — wraps the first occurrence of each term in body copy
//   - Page glossary spreads render their own card definitions (see each page .md)
//
// The first eight entries are the canonical SPIRIT Glossary (verbatim from the
// copy doc); the full set lives on /words/#glossary. Keep entries short — one or
// two sentences. Link out to the long glossary on /words/ when readers want more.

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
  // ── Canonical SPIRIT Glossary (verbatim from the copy doc) ──
  bioregion: {
    term: 'bioregion',
    short:
      'A geographically and hydrologically defined area characterized by distinct ecological features that together form a coherent biocultural home.',
    tone: 'clay',
    href: '/words/#glossary',
  },
  commons: {
    term: 'commons',
    short:
      '“The Commons” points to the living realities of shared place — the commonality of the ecologies and resources for which all residents of a place share responsibility, and on which all residents depend.',
    tone: 'creek',
    href: '/words/#glossary',
  },
  'the front range commons': {
    term: 'the front range commons',
    short:
      'A decentralized, member-directed network-in-formation dedicated to cultural and ecological stewardship, and community-led resource allocation; a space where anyone can contribute, propose projects, share resources, and participate in network governance.',
    tone: 'sage',
    href: '/words/#glossary',
  },
  commoning: {
    term: 'commoning',
    short:
      'Commoning on a bioregional level directs our attentions and energies to where we can directly relate to the consequences of our stewardship, labor, and care.',
    tone: 'sage',
    href: '/words/#glossary',
  },
  'bioregional commoning': {
    term: 'bioregional commoning',
    short:
      'Recognizes the wellbeing of human and natural systems (neighborhoods, watersheds, ecosystems, soil) as shared resources that the people who live in and depend on that land take responsibility to steward collectively.',
    tone: 'grass',
    href: '/words/#glossary',
  },
  resilience: {
    term: 'resilience',
    short:
      'The capacity of a community to absorb shocks — storms, outages, economic disruption, supply chain failure — and recover together. Not bunkers, but networks.',
    tone: 'creek',
    href: '/words/#glossary',
  },
  'the lattice': {
    term: 'the lattice',
    short:
      "SPIRIT's operating metaphor. The minimum infrastructure that enables Commons activity without controlling it.",
    tone: 'clay',
    href: '/words/#glossary',
  },
  'institutional self-negation': {
    term: 'institutional self-negation',
    short:
      'The deliberate practice of transferring responsibility from SPIRIT to the Commons as fast as the Commons can absorb it.',
    tone: 'clay',
    href: '/words/#glossary',
  },
  regeneration: {
    term: 'regeneration',
    short:
      'Regeneration means renewing the capacity to renew. Consider the old adage about teaching someone to fish, rather than giving them a fish. Regeneration is about teaching them how to fish, how to make their own fishing poles, how to keep the fish in the pond happily reproducing.',
    tone: 'clay',
    href: '/words/#glossary',
  },

  // ── Supporting vocabulary that appears in body copy (not in the printed glossary) ──
  enclosure: {
    term: 'enclosure',
    short:
      'The long history of turning shared land, knowledge, or relationships into private property — and the harm that has caused.',
    tone: 'creek',
  },
  'listening circle': {
    term: 'listening circle',
    short:
      'A simple gathering form: one person speaks at a time, holding a token; others listen without preparing a response. Drawn from many traditions.',
    tone: 'sage',
  },
  sociocracy: {
    term: 'sociocracy',
    short:
      'A way of making decisions by consent rather than majority vote. A proposal moves forward unless someone has a serious objection that the group needs to address.',
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
