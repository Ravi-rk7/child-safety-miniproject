import { useEffect, useRef } from 'react';

export default function SOSAlert({ alert, onDismiss }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      // Browsers may block autoplay if there was no prior user interaction
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.warn('Autoplay blocked:', e));
    }
  }, []);

  if (!alert) return null;

  return (
    <div className="sos-banner">
      <audio ref={audioRef} loop src="https://actions.google.com/sounds/v1/alarms/beeping_alarm.ogg" />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div className="sos-pulse" />
        <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>emergency</span>
        <div>
          <strong style={{ fontSize: '0.875rem' }}>SOS ALERT</strong>
          <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>{alert.message}</p>
        </div>
      </div>
      <button
        onClick={onDismiss}
        style={{
          color: 'white',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255,255,255,0.2)',
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      >
        Dismiss
      </button>
    </div>
  );
}
