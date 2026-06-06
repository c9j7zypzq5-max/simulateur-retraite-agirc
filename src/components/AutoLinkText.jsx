import Terme from "./Terme.jsx";
import { TERM_MATCHERS } from "../data/glossaire.js";

// Auto-liaison des termes du lexique dans une chaîne de texte (FAQ, intros,
// descriptions…). Rend la PREMIÈRE occurrence de chaque terme sous forme de
// <Terme> (lien + infobulle). Conçu pour être branché sur les composants
// partagés (FaqItem, SimulateurHeader) afin de couvrir tout le site.
//
// Règles alignées sur utils/autolinkTerms.js :
//   • une seule liaison par terme dans le bloc de texte ;
//   • bornes de mot strictes ;
//   • acronymes en majuscules : correspondance sensible à la casse.

const isBoundary = (ch) => ch === undefined || !/[\p{L}\p{N}]/u.test(ch);

function linkify(text) {
  const linked = new Set();
  const out = [];
  let buffer = "";
  let i = 0;

  while (i < text.length) {
    let hit = null;

    if (isBoundary(text[i - 1])) {
      for (const m of TERM_MATCHERS) {
        if (linked.has(m.slug)) continue;
        const len = m.match.length;
        const slice = text.substr(i, len);
        if (slice.length < len) continue;
        const isAcronym = /[A-Z]/.test(m.match) && m.match === m.match.toUpperCase();
        const equal = isAcronym ? slice === m.match : slice.toLowerCase() === m.match.toLowerCase();
        if (!equal) continue;
        if (!isBoundary(text[i + len])) continue;
        hit = { slug: m.slug, len, text: slice };
        break;
      }
    }

    if (hit) {
      if (buffer) { out.push(buffer); buffer = ""; }
      out.push(<Terme key={`t${i}`} slug={hit.slug}>{hit.text}</Terme>);
      linked.add(hit.slug);
      i += hit.len;
    } else {
      buffer += text[i];
      i += 1;
    }
  }
  if (buffer) out.push(buffer);
  return out;
}

export default function AutoLinkText({ children }) {
  // N'agit que sur du texte brut ; tout autre contenu est rendu tel quel.
  if (typeof children !== "string" || !children) return children ?? null;
  return <>{linkify(children)}</>;
}
