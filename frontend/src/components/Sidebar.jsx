import { NavLink } from 'react-router-dom';
import { useAlerts } from '../hooks/useAlerts';

export default function Sidebar() {
  const { unreadCount } = useAlerts();

  const links = [
    { to: '/', icon: 'dashboard', label: 'Dashboard' },
    { to: '/activity', icon: 'analytics', label: 'Activity' },
    { to: '/geofences', icon: 'fence', label: 'Geofences' },
    { to: '/devices', icon: 'smartphone', label: 'Devices' },
    { to: '/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Guardian Nexus</h1>
        <p>Watchful Horizon</p>
      </div>

      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end={link.to === '/'}
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
            {link.icon === 'notifications' && unreadCount > 0 && (
              <span style={{
                background: 'var(--error)',
                color: 'white',
                fontSize: '0.6rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 'var(--radius-full)',
                marginLeft: 'auto'
              }}>
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <NavLink to="/settings" className="nav-link" style={{ padding: '8px 16px' }}>
          <span className="material-symbols-outlined">help_outline</span>
          <span>Help</span>
        </NavLink>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          marginTop: '8px',
          background: 'var(--surface-container)',
          borderRadius: 'var(--radius-xl)',
        }}>
          <div className="avatar" style={{ width: 40, height: 40 }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-container))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.875rem',
            }}>
              DM
            </div>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Ravi</p>
            <p style={{ fontSize: '0.55rem', color: 'var(--on-surface-variant)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Premium Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
