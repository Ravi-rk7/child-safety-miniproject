import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { formatDate } from '../utils/helpers';
import { putAPI } from '../utils/helpers';

export default function TopBar({ title }) {
  const { alerts, unreadCount } = useAlerts();
  const [open, setOpen] = useState(false);

  async function markRead(alert) {
    if (alert.read) return;
    try {
      await putAPI(`/alerts/${alert.id}/read`, {});
    } catch (err) {
      console.error('Failed to mark alert read:', err.message);
    }
  }

  async function markAllRead() {
    const unread = alerts.filter(a => !a.read);
    await Promise.all(unread.map(a => putAPI(`/alerts/${a.id}/read`, {})));
  }

  return (
    <header className="topbar">
      <h2 className="topbar-title">{title}</h2>

      <div className="topbar-actions">
        <div className="search-bar">
          <span className="material-symbols-outlined" style={{ fontSize: '1rem', color: 'var(--secondary)' }}>search</span>
          <input type="text" placeholder="Search devices or locations..." />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--on-surface-variant)', fontFamily: 'var(--font-headline)', fontSize: '0.875rem', fontWeight: 600 }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>calendar_today</span>
          <span>{formatDate(Date.now())}</span>
        </div>

        <div style={{ width: 1, height: 24, background: 'rgba(194, 198, 217, 0.3)' }} />

        <button className="icon-btn">
          <span className="material-symbols-outlined">filter_list</span>
        </button>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="icon-btn"
            onClick={() => setOpen(prev => !prev)}
            title="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && <span className="badge" />}
          </button>

          {open && (
            <>
              {/* Backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                onClick={() => setOpen(false)}
              />

              {/* Dropdown panel */}
              <div className="notif-panel" style={{ zIndex: 100 }}>
                <div className="notif-panel-header">
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                    Notifications
                    {unreadCount > 0 && (
                      <span style={{
                        marginLeft: 8, background: 'var(--error)', color: 'white',
                        borderRadius: 'var(--radius-full)', fontSize: '0.65rem',
                        padding: '2px 8px', fontWeight: 700,
                      }}>{unreadCount}</span>
                    )}
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="notif-list">
                  {alerts.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '2rem', display: 'block', marginBottom: 8 }}>notifications_off</span>
                      <p style={{ fontSize: '0.75rem' }}>No notifications</p>
                    </div>
                  )}
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`notif-item ${!alert.read ? 'notif-item--unread' : ''}`}
                      onClick={() => markRead(alert)}
                    >
                      <div className={`notif-icon ${alert.type === 'sos' ? 'notif-icon--sos' : 'notif-icon--info'}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>
                          {alert.type === 'sos' ? 'emergency' : 'notifications'}
                        </span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: alert.read ? 500 : 700, lineHeight: 1.4 }}>
                          {alert.message}
                        </p>
                        <p style={{ fontSize: '0.625rem', color: 'var(--on-surface-variant)', marginTop: 2 }}>
                          {new Date(alert.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                      {!alert.read && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--error)', flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div style={{ width: 1, height: 24, background: 'rgba(194, 198, 217, 0.3)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>Live Tracking</span>
          <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>expand_more</span>
        </div>
      </div>
    </header>
  );
}
