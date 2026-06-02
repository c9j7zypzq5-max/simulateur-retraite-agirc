import { useVideoRecording } from '../contexts/VideoRecordingContext';

export default function VideoRecordingToast() {
  const { recState, progress, label, stop } = useVideoRecording();

  if (recState === 'idle') return null;

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: 'var(--surface)',
      border: '1px solid var(--border-gold)',
      borderRadius: 14,
      padding: '12px 16px',
      display: 'flex', flexDirection: 'column', gap: 8,
      minWidth: 220, maxWidth: 300,
      boxShadow: 'var(--card-shadow, 0 8px 32px rgba(0,0,0,0.5))',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {recState === 'recording' && (
            <span style={{
              width: 8, height: 8, background: '#ef4444', borderRadius: '50%', flexShrink: 0,
              boxShadow: '0 0 6px #ef4444',
            }} />
          )}
          <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 600 }}>
            {recState === 'processing' ? '⏳ Finalisation…' : '🎬 Enregistrement'}
          </span>
        </div>
        {recState === 'recording' && (
          <button
            onClick={stop}
            style={{
              background: 'none', border: '1px solid rgba(239,68,68,0.4)',
              borderRadius: 6, color: '#ef4444', cursor: 'pointer',
              fontSize: 11, padding: '2px 8px',
            }}
          >
            ⏹ Stop
          </button>
        )}
      </div>

      {label && (
        <span style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.3 }}>
          {label}
        </span>
      )}

      {recState === 'recording' && (
        <>
          <progress
            value={progress} max={100}
            style={{ width: '100%', height: 3, accentColor: 'var(--gold-mid)' }}
          />
          <span style={{ fontSize: 10, color: '#ef4444' }}>
            {progress}% — ne fermez pas l'onglet
          </span>
        </>
      )}
    </div>
  );
}
