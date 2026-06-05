# 🎬 Générateur de vidéos TikTok (comparateur)

Génère **en lot** les vidéos du comparateur de [mesimulateurs.fr](https://www.mesimulateurs.fr)
à partir d'un simple tableau.

Tu mets tes scénarios dans un tableau, le script ouvre le site en preview, remplit
les données pour chaque ligne, **télécharge les vidéos une par une**, et prépare
les légendes (titre + description). Tu n'as plus qu'à **publier toi-même** sur TikTok.

---

## 1. Installation (une seule fois)

```bash
cd scripts/tiktok
npm install          # installe Playwright + télécharge Chromium
brew install ffmpeg  # requis pour des .mp4 compatibles Photos (macOS)
```

> **Pourquoi ffmpeg ?** Le Chromium de Playwright n'a pas les codecs propriétaires
> et enregistre en VP9/WebM, que l'app Photos d'Apple refuse. Le script ré-encode
> donc chaque vidéo en **H.264 (yuv420p)** avec le `ffmpeg` du système → `.mp4`
> lisible par Photos / QuickTime / TikTok. Sans ffmpeg, tu obtiens des `.webm`.

> Le générateur vidéo n'est actif qu'en **preview** et en **local** (désactivé en
> production pour préserver le quota). Utilise donc le lien d'une preview Vercel.

---

## 2. Préparer le tableau

Crée un fichier `videos.tsv` (séparé par des **tabulations** — le plus simple :
copie-colle depuis un tableur). Colonnes attendues :

| #  | Actif 1 | Actif 2 | Actif 3 | Montant initial | DCA | Fréquence | De | À | Titre TikTok | Description TikTok |
|----|---------|---------|---------|-----------------|-----|-----------|----|----|--------------|--------------------|
| 1  | ^GSPC   | BTC-USD | —       | 10 000          | 0   | —         | Jan 2017 | Déc 2024 | 10 000€ dans le S&P 500 vs Bitcoin… | Et si tu avais choisi Bitcoin… #bitcoin |

Un exemple prêt à l'emploi : [`videos.sample.tsv`](./videos.sample.tsv)
(copie-le en `videos.tsv`).

**Notes de format :**
- **Actifs** : tickers Yahoo Finance (`^GSPC`, `BTC-USD`, `IWDA.AS`, `AAPL`…). Mets `—` pour une colonne vide.
- **Montant / DCA** : `10 000`, `10000`, `150 €`… les espaces et le `€` sont tolérés.
- **Fréquence** : `mensuel`, `trimestriel`, `semestriel`, `annuel` (ou `—` si pas de DCA).
- **De / À** : `Jan 2017`, `Déc 2024`, ou `2017-01`, ou `01/2017`.
- Jusqu'à **5 actifs** par ligne (ajoute des colonnes `Actif 4`, `Actif 5`).

---

## 3. Générer les vidéos

```bash
node generate-videos.mjs --base-url https://<ta-preview>.vercel.app
```

Options utiles :

| Option | Rôle | Défaut |
|--------|------|--------|
| `--base-url URL` | Lien de la preview (**obligatoire**) | — |
| `--input FILE`   | Fichier tableau | `videos.tsv` |
| `--out DIR`      | Dossier de sortie | `./out` |
| `--duration SEC` | Durée : `15`, `30`, `60`, `70` | `70` |
| `--format FMT`   | `mp4` (prêt TikTok) ou `webm` | `mp4` |
| `--only 1,3`     | Ne traiter que ces n° de lignes | toutes |
| `--limit N`      | Traiter les N premières lignes | toutes |
| `--bypass-url`   | Lien de partage Vercel (`?_vercel_share=…`) si le preview est protégé | — |
| `--insecure`     | Ignorer les erreurs TLS (proxy d'entreprise) | off |
| `--headful`      | Afficher le navigateur (debug) | masqué |

Chaque vidéo est enregistrée **en temps réel** (≈ la durée choisie) puis
**convertie en MP4** dans le navigateur (ffmpeg.wasm) — prévois donc un peu plus
que la durée brute. Résultat dans `out/` :

```
out/
  01-10-000-dans-le-s-p-500-vs-bitcoin.mp4
  01-10-000-dans-le-s-p-500-vs-bitcoin.txt   ← légende prête à coller
  metadata.json                              ← infos de toutes les vidéos
```

---

## 4. Publier (à la main)

Les vidéos `.mp4` et leurs légendes `.txt` sont dans `out/`. Tu les publies
toi-même sur TikTok : importe le `.mp4`, ouvre le `.txt` correspondant et
copie-colle le titre + la description.

> 💡 En cas d'échec sur une ligne, le script écrit aussi `XX-….error.png`
> (capture) et `XX-….log` (journal navigateur) dans `out/` pour comprendre.

---

## Comment ça marche

Le script pilote la page comparateur via des **paramètres d'URL** :

```
/simulateurs/comparateur?a=^GSPC,BTC-USD&montant=10000&dca=0&freq=monthly&from=2017-01&to=2024-12&video=70&format=mp4
```

Les paramètres `video=NN` (durée) et `format=mp4|webm` déclenchent automatiquement
l'enregistrement ; Playwright intercepte le téléchargement final et l'enregistre
dans `out/`. Tu peux d'ailleurs ouvrir cette URL toi-même dans un navigateur pour
vérifier un rendu.

Format de sortie : **MP4 (H.264) · 720×1280 · 9:16**, prêt pour TikTok / Reels / Shorts.
