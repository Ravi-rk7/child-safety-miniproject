import { useState } from 'react';

export default function Settings() {
  const [trackingInterval, setTrackingInterval] = useState(10);
  const [notifications, setNotifications] = useState({
    sos: true,
    geofenceEntry: true,
    geofenceExit: true,
    lowBattery: true,
    offline: true,
  });

  return (
    <div className="page-content" style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Settings</h2>
        <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem' }}>Configure tracking preferences and notifications</p>
      </div>

      <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Tracking Settings */}
        <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-xl)',
              background: 'var(--primary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--primary)'
            }}>
              <span className="material-symbols-outlined">satellite_alt</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Tracking Configuration</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Control how often the device sends updates</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 8, display: 'block' }}>
                Update Interval: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{trackingInterval}s</span>
              </label>
              <input
                type="range"
                min="5"
                max="120"
                step="5"
                value={trackingInterval}
                onChange={e => setTrackingInterval(parseInt(e.target.value))}
                style={{
                  width: '100%', height: 8, borderRadius: 'var(--radius-full)',
                  appearance: 'none', background: 'var(--surface-container-high)',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: '0.625rem', color: 'var(--on-surface-variant)', fontWeight: 600 }}>
                <span>5s (Real-time)</span>
                <span>60s (Balanced)</span>
                <span>120s (Battery Saver)</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="metric-well">
                <p className="metric-well-label">Communication</p>
                <div className="metric-well-value" style={{ fontSize: '0.875rem' }}>HTTP / GPRS</div>
              </div>
              <div className="metric-well">
                <p className="metric-well-label">Data Format</p>
                <div className="metric-well-value" style={{ fontSize: '0.875rem' }}>JSON</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-xl)',
              background: 'var(--tertiary-fixed)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--tertiary)'
            }}>
              <span className="material-symbols-outlined">notifications_active</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Notification Preferences</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Choose which alerts you want to receive</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { key: 'sos', icon: 'emergency', label: 'SOS Emergency Alerts', desc: 'Instant notification when panic button is pressed', color: 'var(--error)' },
              { key: 'geofenceEntry', icon: 'login', label: 'Geofence Entry', desc: 'Alert when child enters a safe zone', color: '#16a34a' },
              { key: 'geofenceExit', icon: 'logout', label: 'Geofence Exit', desc: 'Alert when child leaves a safe zone', color: 'var(--tertiary)' },
              { key: 'lowBattery', icon: 'battery_1_bar', label: 'Low Battery Warning', desc: 'Notify when battery drops below 20%', color: '#d97706' },
              { key: 'offline', icon: 'wifi_off', label: 'Device Offline', desc: 'Alert when device loses connection', color: 'var(--secondary)' },
            ].map(item => (
              <div
                key={item.key}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 12px', borderRadius: 'var(--radius-xl)',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span className="material-symbols-outlined" style={{ color: item.color }}>{item.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.label}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>{item.desc}</p>
                  </div>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifications[item.key]}
                    onChange={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key] })}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="card" style={{ padding: 32, borderRadius: 'var(--radius-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-xl)',
              background: 'var(--secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--secondary)'
            }}>
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Account Information</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)' }}>Your Guardian Nexus profile</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Name</label>
              <p style={{ fontWeight: 600 }}>Ravi</p>
            </div>
            <div>
              <label style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Email</label>
              <p style={{ fontWeight: 600 }}>david.miller@email.com</p>
            </div>
            <div>
              <label style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Plan</label>
              <p style={{ fontWeight: 600 }}>Premium</p>
            </div>
            <div>
              <label style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', display: 'block', marginBottom: 4 }}>Devices</label>
              <p style={{ fontWeight: 600 }}>1 / 5 slots used</p>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div style={{
          border: '2px solid var(--outline-variant)',
          borderRadius: 'var(--radius-2xl)', padding: 32, textAlign: 'center', opacity: 0.8
        }}>
          <h4 style={{ fontWeight: 700, marginBottom: 8, color: 'var(--primary)' }}>Guardian Nexus v1.0</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
            TE Mini Project — Design and Implementation of an Automatic Child Location Tracking Device
            with Periodic Updates Using ESP32, GPS and GSM
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: 12 }}>
            Built with React • Node.js • Firebase • Leaflet.js
          </p>
        </div>
      </div>
    </div>
  );
}
