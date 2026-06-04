// ─────────────────────────────────────────────────────────────────────────────
// Aide à la publication TikTok (semi-automatique)
//
// Ouvre TikTok Studio dans un navigateur avec session persistante (tu te
// connectes une seule fois), puis pour chaque vidéo générée :
//   - attache le fichier WebM,
//   - pré-remplit la légende (titre + description + hashtags).
// Par défaut, il NE publie PAS : tu vérifies puis tu cliques « Publier »
// toi-même. Utilise --auto-post pour tenter de cliquer Publier (à tes risques).
//
// ⚠️ L'automatisation d'une plateforme tierce peut enfreindre ses CGU et son
//    interface change souvent. Ce script reste volontairement « assistant » :
//    l'humain garde le contrôle de la connexion et de la publication.
//
// Usage :
//   node upload-tiktok.mjs --out ./out [--auto-post] [--profile ./.tiktok-profile]
// ─────────────────────────────────────────────────────────────────────────────

import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import path from 'node:path';

const UPLOAD_URL = 'https://www.tiktok.com/tiktokstudio/upload';

function parseArgs(argv) {
  const args = { out: './out', profile: './.tiktok-profile' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--out') args.out = next();
    else if (a === '--profile') args.profile = next();
    else if (a === '--auto-post') args.autoPost = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(res => rl.question(question, a => { rl.close(); res(a); }));
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log('node upload-tiktok.mjs --out ./out [--auto-post] [--profile DIR]');
    return;
  }

  const outDir = path.resolve(args.out);
  const meta = JSON.parse(await readFile(path.join(outDir, 'metadata.json'), 'utf8'));
  const videos = meta.filter(v => v.ok && v.file);

  if (videos.length === 0) { console.error('❌ Aucune vidéo générée trouvée dans metadata.json'); process.exit(1); }

  console.log(`📤 ${videos.length} vidéo(s) à publier depuis ${outDir}`);
  console.log(`   Profil navigateur persistant : ${path.resolve(args.profile)}\n`);

  const context = await chromium.launchPersistentContext(path.resolve(args.profile), {
    headless: false,
    viewport: { width: 1280, height: 900 },
    acceptDownloads: false,
  });

  const page = context.pages()[0] || await context.newPage();
  await page.goto(UPLOAD_URL, { waitUntil: 'domcontentloaded' });

  console.log('👉 Si demandé, connecte-toi à TikTok dans la fenêtre ouverte.');
  await ask('   Appuie sur Entrée une fois connecté et la page d’upload affichée… ');

  for (const v of videos) {
    const filePath = path.join(outDir, v.file);
    const caption = [v.title, v.description].filter(Boolean).join('\n\n');

    console.log(`\n▶ #${v.idx} ${v.file}`);
    try {
      await page.goto(UPLOAD_URL, { waitUntil: 'domcontentloaded' });

      // 1) Attacher le fichier vidéo
      const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 60000 });
      await fileInput.setInputFiles(filePath);
      console.log('  📎 fichier attaché, traitement par TikTok…');

      // 2) Renseigner la légende (champ contenteditable)
      const captionSel = 'div[contenteditable="true"], [data-text="true"]';
      const editor = await page.waitForSelector(captionSel, { timeout: 60000 });
      await editor.click();
      // On vide le placeholder éventuel puis on tape la légende.
      await page.keyboard.press('Control+A').catch(() => {});
      await page.keyboard.press('Delete').catch(() => {});
      await page.keyboard.type(caption, { delay: 8 });
      console.log('  ✍️  légende renseignée');

      if (args.autoPost) {
        const postBtn = await page.waitForSelector(
          'button:has-text("Publier"), button:has-text("Post")', { timeout: 30000 });
        await postBtn.click();
        console.log('  🚀 publication lancée');
        await page.waitForTimeout(8000);
      } else {
        await ask('  ✅ Vérifie la vidéo + la légende, clique « Publier » manuellement, puis Entrée pour la suivante… ');
      }
    } catch (e) {
      console.log(`  ⚠️  problème : ${e.message}`);
      await ask('  Corrige manuellement si besoin, puis Entrée pour continuer… ');
    }
  }

  console.log('\n🎉 Terminé. Tu peux fermer la fenêtre.');
  if (!args.autoPost) await ask('Entrée pour fermer le navigateur… ');
  await context.close();
}

main().catch(e => { console.error(e); process.exit(1); });
