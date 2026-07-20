import AffiliateCTA from "./AffiliateCTA.jsx";

// Emplacement de recommandation contextuelle du parcours par objectif.
//
// `context` est une clé d'intention ("retraite", "emprunt", "epargne", "per",
// "assurance-vie", "credit"…). Quand des partenaires existent pour ce contexte,
// l'emplacement affiche l'AffiliateCTA correspondant (bloc « liens commerciaux »
// déjà utilisé sur les pages simulateurs) ; sinon il ne rend rien — c'est le
// placeholder prévu pour brancher l'affiliation réelle plus tard : il suffira
// d'ajouter le contexte dans PARTNERS (AffiliateCTA.jsx) ou de remplacer le
// rendu ici, sans toucher aux pages qui posent le slot.
export default function RecoSlot({ context }) {
  if (!context) return null;
  return <AffiliateCTA type={context} />;
}
