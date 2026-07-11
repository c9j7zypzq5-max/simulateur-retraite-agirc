// Verrous de plan — bascules retirer le badge / capturer l'email. Le
// verrouillage réel est le trigger builder_enforce_plan_limits côté serveur ;
// ces cases grisées ne sont qu'une indication (défense en profondeur, pas la
// barrière).

import { useState } from 'react';
import type { Plan } from '../../schema/types';
import { startCheckout } from '../../lib/stripe';
import { t } from '../../i18n';

interface PlanPanelProps {
  plan: Plan;
  hideBadge: boolean;
  captureEmail: boolean;
  webhookUrl: string | null;
  onChange: (patch: { hideBadge?: boolean; captureEmail?: boolean; webhookUrl?: string | null }) => void;
}

function ToggleRow({
  label,
  help,
  checked,
  disabled,
  onToggle,
}: {
  label: string;
  help: string;
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, opacity: disabled ? 0.55 : 1 }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>
          {label} {disabled && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>🔒 {t('plan.proOnly')}</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{help}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={onToggle}
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          flexShrink: 0,
          background: checked && !disabled ? 'var(--primary)' : 'var(--border)',
        }}
      >
        <span style={{ position: 'absolute', top: 3, left: checked && !disabled ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
      </button>
    </div>
  );
}

export default function PlanPanel({ plan, hideBadge, captureEmail, webhookUrl, onChange }: PlanPanelProps) {
  const locked = plan === 'free';
  const webhookLocked = plan !== 'premium';
  const [upgrading, setUpgrading] = useState<'pro' | 'premium' | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  async function upgrade(target: 'pro' | 'premium') {
    setUpgrading(target);
    setUpgradeError(null);
    const { error } = await startCheckout(target);
    if (error) setUpgradeError(error);
    setUpgrading(null);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {locked && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{t('plan.upgradeHint')}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn primary" disabled={upgrading !== null} onClick={() => upgrade('pro')}>
              {upgrading === 'pro' ? '…' : t('plan.upgradePro')}
            </button>
            <button className="btn" disabled={upgrading !== null} onClick={() => upgrade('premium')}>
              {upgrading === 'premium' ? '…' : t('plan.upgradePremium')}
            </button>
          </div>
          {upgradeError && <p style={{ margin: 0, fontSize: 12, color: 'var(--negative)' }}>{upgradeError}</p>}
        </div>
      )}
      <ToggleRow
        label={t('plan.hideBadge')}
        help={t('plan.hideBadgeHelp')}
        checked={hideBadge}
        disabled={locked}
        onToggle={() => onChange({ hideBadge: !hideBadge })}
      />
      <ToggleRow
        label={t('plan.captureEmail')}
        help={t('plan.captureEmailHelp')}
        checked={captureEmail}
        disabled={locked}
        onToggle={() => onChange({ captureEmail: !captureEmail })}
      />

      {/* Webhook sortant — Premium uniquement (clampé à null côté serveur sinon). */}
      <div className="card" style={{ opacity: webhookLocked ? 0.55 : 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
          {t('plan.webhook')} {webhookLocked && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>🔒 {t('plan.premiumOnly')}</span>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('plan.webhookHelp')}</div>
        <input
          type="url"
          placeholder="https://votre-site.fr/webhook"
          value={webhookUrl ?? ''}
          disabled={webhookLocked}
          onChange={(e) => onChange({ webhookUrl: e.target.value || null })}
        />
      </div>
    </div>
  );
}
