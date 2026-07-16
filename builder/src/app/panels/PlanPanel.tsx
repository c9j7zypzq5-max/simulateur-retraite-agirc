// Options du calculateur — mode « lancement gratuit » : capture d'email et
// webhook débloqués pour tous ; seul le retrait du badge reste réservé aux
// plans payants (le badge est le moteur de croissance du produit). Le
// verrouillage réel est le trigger builder_enforce_plan_limits côté serveur ;
// cette UI n'est qu'une indication. Les CTA Stripe reviendront quand la
// monétisation sera activée (lib/stripe.ts est prêt).

import type { Plan } from '../../schema/types';
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
          {label} {disabled && <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>🔒</span>}
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
  const badgeLocked = plan === 'free';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-secondary)' }}>{t('plan.launchNote')}</p>
      <ToggleRow
        label={t('plan.hideBadge')}
        help={badgeLocked ? t('plan.hideBadgeLaunchHelp') : t('plan.hideBadgeHelp')}
        checked={hideBadge}
        disabled={badgeLocked}
        onToggle={() => onChange({ hideBadge: !hideBadge })}
      />
      <ToggleRow
        label={t('plan.captureEmail')}
        help={t('plan.captureEmailHelp')}
        checked={captureEmail}
        disabled={false}
        onToggle={() => onChange({ captureEmail: !captureEmail })}
      />

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{t('plan.webhook')}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('plan.webhookHelp')}</div>
        <input
          type="url"
          placeholder="https://votre-site.fr/webhook"
          value={webhookUrl ?? ''}
          onChange={(e) => onChange({ webhookUrl: e.target.value || null })}
        />
      </div>
    </div>
  );
}
