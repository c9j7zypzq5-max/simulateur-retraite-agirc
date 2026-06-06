# Plan d'acquisition de trafic — mesimulateurs.fr

État : les fondations techniques SEO sont déjà solides (sitemap dynamique,
schema.org BreadcrumbList + WebApplication + FAQPage, prérendu H1/intro,
maillage interne « simulateurs liés », bundle code-splitté rapide, og:image
PNG, 24 simulateurs). Le travail restant est surtout **éditorial, off-site et
analytique**.

## 0. Indispensable (à faire en premier, gratuit)
- [ ] **Google Search Console** : ajouter et valider `www.mesimulateurs.fr`,
      soumettre `https://www.mesimulateurs.fr/sitemap.xml`. C'est le tableau de
      bord n°1 pour suivre l'indexation, les requêtes et les positions.
- [ ] **Bing Webmaster Tools** (5 min, trafic d'appoint).
- [ ] Vérifier l'indexation : `site:mesimulateurs.fr` sur Google.
- [ ] **Plausible / Matomo** ou garder Vercel Analytics : suivre les pages
      d'entrée et le taux de rebond par simulateur.

## 1. Contenu / longue traîne (le plus gros levier)
Chaque simulateur peut capter des dizaines de requêtes longue traîne.
- [ ] **Blog automatique** (déjà en place) : laisser tourner le cron 2×/sem.
      Vérifier que les articles sont indexés et de bonne qualité ; enrichir la
      liste de sujets `TOPICS` avec des requêtes réellement recherchées.
- [ ] **Lier les articles aux simulateurs** (et inversement) : chaque article
      doit renvoyer vers le simulateur concerné, et chaque page simulateur vers
      2-3 articles. Renforce le maillage et le temps passé.
- [ ] **Pages « guide » par simulateur** : un contenu rédactionnel riche
      (800-1200 mots) sous chaque simulateur cible des requêtes informationnelles
      (« comment calculer sa retraite Agirc-Arrco », « barème PTZ 2025 »…).
- [ ] **Cibler des mots-clés à intention** : « simulateur X gratuit »,
      « calcul X 2026 », « X sans inscription » — déjà dans le positionnement.

## 2. Nouveaux simulateurs = nouvelles portes d'entrée
Chaque simulateur ouvre un nouveau corpus de requêtes. Pistes à fort volume :
- [ ] Capacité d'emprunt, frais de notaire, prélèvement à la source,
      indemnités de départ/licenciement, simulateur APL, droits au chômage,
      pension de réversion, donation/succession.

## 3. Off-site / notoriété
- [ ] **Backlinks** : forums (moneyvox, reddit r/vosfinances), annuaires de
      simulateurs, articles invités, comparateurs. Quelques liens de qualité
      pèsent plus que beaucoup de liens faibles.
- [ ] **Partage social** : la fonction « partager le compte-rendu » (image + lien)
      est un moteur viral — encourager le partage en fin de simulation.
- [ ] **Réseaux** : les vidéos TikTok/Shorts (générateur déjà présent dans le
      repo) peuvent ramener du trafic ; relier la vidéo au simulateur.

## 4. Technique / conversion (déjà bien avancé)
- [ ] Core Web Vitals : surveiller le LCP (polices optimisées, bundle splitté).
- [ ] Rich results : tester les pages dans l'outil Google Rich Results (FAQ,
      breadcrumb) pour confirmer l'éligibilité.
- [ ] Données structurées Article/BlogPosting sur les pages de blog (à ajouter).

## Priorisation conseillée
1. **Search Console + sitemap** (immédiat, mesure tout le reste).
2. **Blog auto + liens articles↔simulateurs** (contenu frais récurrent).
3. **2-3 nouveaux simulateurs à fort volume**.
4. **Backlinks + partage social**.
