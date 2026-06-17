# Prompt — Article d'actualité relié à un simulateur

Copie-colle le bloc ci-dessous quand tu veux que je transforme une actu en article de blog.

---

Recherche les **actualités françaises récentes** (derniers jours) en finances personnelles : taux d'emprunt, immobilier/PTZ, retraite et réformes, fiscalité et loi de finances, épargne/livrets, marchés/ETF, PER/assurance-vie, budget/pouvoir d'achat.

Identifie **un sujet d'actualité concret** qui peut se rattacher à **l'un des simulateurs de simfinly.com** :
- Retraite : `/simulateurs/agirc-arrco`, `/simulateurs/cnav`, `/simulateurs/fonction-publique`, `/simulateurs/independants`, `/simulateurs/ircantec`, `/simulateurs/retraite-progressive`, `/simulateurs/cnavpl`, `/simulateurs/msa`, `/simulateurs/per`
- Immobilier : `/simulateurs/emprunt-immobilier`, `/simulateurs/rendement-locatif`, `/simulateurs/ptz`
- Impôts : `/simulateurs/impot-revenu`, `/simulateurs/plus-value-immobiliere`
- Finances : `/simulateurs/budget`, `/simulateurs/salaire`, `/simulateurs/epargne`, `/simulateurs/fire`, `/simulateurs/patrimoine`, `/simulateurs/comparateur`, `/simulateurs/assurance-vie`, `/simulateurs/credit-conso`
- Vie & temps : `/simulateurs/cout-en-heures`, `/simulateurs/vie-en-semaines`

**Si aucun sujet ne se rattache vraiment** à un simulateur, dis-le et ne rédige rien (pas d'article forcé).

**Si oui**, rédige un article de blog en français :
- 550 à 750 mots, ton accessible, factuel, daté ; contexte 100 % français.
- HTML **uniquement** avec ces balises : `h2, p, ul, li, strong, em` (pas de h1, a, img, script, style).
- L'article doit **exploiter l'actualité** (chiffres/faits vérifiés, cite tes sources d'actu dans ta réponse — pas dans le contenu) et **renvoyer naturellement vers le simulateur concerné** (ex. « estimez votre cas avec le simulateur X de simfinly.com »), avec un paragraphe final invitant à le tester.
- Vérifie les chiffres avant d'écrire ; reste prudent si une donnée n'est pas confirmée.

Rends un **objet JSON** exact :
```json
{
  "title": "Titre accrocheur (≤ 75 caractères)",
  "slug": "titre-kebab-case-sans-accents",
  "intro": "Accroche de 2-3 phrases résumant l'article.",
  "content": "<h2>...</h2><p>...</p>...",
  "category": "Retraite | Immobilier | Fiscalité | Épargne | Budget | FIRE | Finances",
  "readTime": 5
}
```
L'**image libre de droits est ajoutée automatiquement** (Pexels selon la catégorie) à la publication — ne mets pas d'image dans le JSON.

**Publication** : je n'ai pas d'accès réseau sortant vers le site depuis mon environnement. Génère donc, en plus du JSON, une **commande `curl` prête à coller** que je lancerai depuis mon Mac, de la forme :
```sh
curl -X POST https://www.simfinly.com/api/publish-article \
  -H "Authorization: Bearer $CRON_SECRET" \
  -H "Content-Type: application/json" \
  -d '<le JSON ci-dessus, échappé>'
```
(Le `Authorization` n'est nécessaire que si `CRON_SECRET` est défini sur Vercel.) L'article apparaîtra alors sur `/blog` et dans le sitemap automatiquement.
