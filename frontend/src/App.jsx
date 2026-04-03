import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Activity from './pages/Activity';
import Geofences from './pages/Geofences';
import Devices from './pages/Devices';
import Settings from './pages/Settings';
import { useLocation } from 'react-router-dom';

function AppLayout() {
  const location = useLocation();

  const pageTitles = {
    '/': 'Live Tracking',
    '/activity': 'Activity Overview',
    '/geofences': 'Geofence Management',
    '/devices': 'Device Management',
    '/settings': 'Settings',
  };

  const isGeofencePage = location.pathname === '/geofences';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <TopBar title={pageTitles[location.pathname] || 'Guardian Nexus'} />
        {isGeofencePage ? (
          <Geofences />
        ) : (
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
