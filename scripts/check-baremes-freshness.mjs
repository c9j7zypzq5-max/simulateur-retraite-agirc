// Vérifie qu'aucune entrée de BAREMES_DATES n'a été laissée de côté trop
// longtemps. Ne connaît pas le calendrier officiel de revalorisation de
// chaque barème (il varie par organisme et n'est pas toujours documenté de
// façon fiable) : la règle est donc volontairement large — une entrée est
// signalée seulement si son année est antérieure à l'année précédente, ce qui
// laisse la marge nécessaire aux barèmes publiés en fin d'année pour l'année
// suivante (ex. AGIRC-ARRCO au 1er novembre).
//
// Sert de garde-fou, pas de source de vérité : une entrée signalée doit être
// vérifiée manuellement auprès de la source officielle avant toute mise à
// jour des chiffres du simulateur concerné.
import { BAREMES_DATES } from "../src/data/baremesDates.js";

const currentYear = new Date().getFullYear();
const staleThreshold = currentYear - 1;

const stale = Object.entries(BAREMES_DATES)
  .filter(([, entry]) => entry.annee < staleThreshold)
  .map(([path, entry]) => ({ path, ...entry }));

if (stale.length === 0) {
  console.log(`OK — toutes les entrées de BAREMES_DATES datent de ${staleThreshold} ou plus récent.`);
  process.exit(0);
}

console.log(`${stale.length} barème(s) à vérifier (année < ${staleThreshold}) :`);
for (const s of stale) {
  console.log(`- ${s.path} : ${s.annee}${s.mois ? ` (${s.mois})` : ""}`);
}

// Sortie JSON sur la dernière ligne pour une consommation facile côté CI.
console.log("__STALE_BAREMES_JSON__" + JSON.stringify(stale));
process.exit(1);
