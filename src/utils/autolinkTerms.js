import { TERM_MATCHERS } from "../data/glossaire.js";

// Auto-liaison des termes du lexique dans le HTML d'un article de blog.
// Règles :
//   • on lie la PREMIÈRE occurrence de chaque terme seulement (pas de sur-liaison) ;
//   • on ignore le contenu des titres (h1-h6), des liens existants et du code ;
//   • bornes de mot strictes (pas de match au milieu d'un mot) ;
//   • acronymes en majuscules (TAEG, PER…) : correspondance sensible à la casse
//     pour éviter les faux positifs ; expressions en minuscules : insensible.
//
// Nécessite le DOM (exécuté côté client). Renvoie le HTML inchangé côté serveur.

const SKIP_TAGS = new Set(["A", "H1", "H2", "H3", "H4", "H5", "H6", "CODE", "PRE"]);

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function autolinkTermsHtml(html) {
  if (!html || typeof window === "undefined" || typeof DOMParser === "undefined") return html;

  const doc = new DOMParser().parseFromString(`<div id="__al">${html}</div>`, "text/html");
  const root = doc.getElementById("__al");
  if (!root) return html;

  const isEligible = (textNode) => {
    for (let p = textNode.parentNode; p && p !== root; p = p.parentNode) {
      if (SKIP_TAGS.has(p.nodeName)) return false;
    }
    return true;
  };

  const linked = new Set();

  for (const { match, slug } of TERM_MATCHERS) {
    if (linked.has(slug)) continue;

    const isAcronym = /[A-Z]/.test(match) && match === match.toUpperCase();
    const flags = isAcronym ? "u" : "iu";
    let re;
    try {
      re = new RegExp(`(^|[^\\p{L}\\p{N}])(${escapeRegex(match)})(?=$|[^\\p{L}\\p{N}])`, flags);
    } catch {
      continue; // moteur regex sans \p{…} : on saute ce terme
    }

    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);

    for (const tn of textNodes) {
      if (!isEligible(tn)) continue;
      const text = tn.nodeValue;
      const m = re.exec(text);
      if (!m) continue;

      const start = m.index + m[1].length;
      const end = start + m[2].length;

      const frag = doc.createDocumentFragment();
      const before = text.slice(0, start);
      const after = text.slice(end);
      if (before) frag.appendChild(doc.createTextNode(before));
      const a = doc.createElement("a");
      a.setAttribute("href", `/lexique/${slug}`);
      a.setAttribute("class", "term-link");
      a.textContent = text.slice(start, end);
      frag.appendChild(a);
      if (after) frag.appendChild(doc.createTextNode(after));

      tn.parentNode.replaceChild(frag, tn);
      linked.add(slug);
      break; // terme lié → on passe au suivant
    }
  }

  return root.innerHTML;
}
