// Affiché une fois le calculateur publié : lien public + script embed,
// chacun copiable. Écran 4 (Éditeur) du parcours MVP — pas de prévisualisation
// live ici (déjà l'aperçu de l'éditeur juste en dessous), YAGNI.

import { useState } from 'react';
import { t } from '../../i18n';

export default function PublishPanel({ slug }: { slug: string }) {
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null);
  const origin = window.location.origin;
  const link = `${origin}/s/${slug}`;
  const embed = `<script src="${origin}/embed.js" data-slug="${slug}"></script>`;

  function copy(text: string, which: 'link' | 'embed') {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    }).catch(() => {});
  }

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 4 }}>
      <div>
        <span className="lbl">{t('publish.publicLink')}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <input type="text" readOnly value={link} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }} />
          <button className="btn" onClick={() => copy(link, 'link')}>{copied === 'link' ? t('publish.copied') : t('publish.copy')}</button>
        </div>
      </div>
      <div>
        <span className="lbl">{t('publish.embedCode')}</span>
        <div style={{ display: 'flex', gap: 6 }}>
          <input type="text" readOnly value={embed} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }} />
          <button className="btn" onClick={() => copy(embed, 'embed')}>{copied === 'embed' ? t('publish.copied') : t('publish.copy')}</button>
        </div>
      </div>
    </div>
  );
}
