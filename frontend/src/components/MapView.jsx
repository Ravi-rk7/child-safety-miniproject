import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView({
  center = [18.5204, 73.8567],
  zoom = 14,
  height = '500px',
  deviceLocation,
  locationHistory = [],
  geofences = [],
  showRoute = true,
  darkMode = false,
  deviceName = 'Device',
  children,
  onMapReady,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const circlesRef = useRef([]);
  const routeRef = useRef(null);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const tileUrl = darkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    mapInstanceRef.current = map;
    if (onMapReady) onMapReady(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update device marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !deviceLocation) return;

    const { latitude, longitude } = deviceLocation;
    if (!latitude || !longitude) return;

    // Create or update child marker
    if (markersRef.current.device) {
      markersRef.current.device.setLatLng([latitude, longitude]);
    } else {
      const childIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="position:relative; width:48px; height:48px;">
            <div style="position:absolute; inset:-6px; border-radius:50%; background:rgba(0,75,202,0.2); animation: pulse-ring 2s ease-out infinite;"></div>
            <div style="width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,#004bca,#0061ff); display:flex; align-items:center; justify-content:center; color:white; box-shadow:0 4px 16px rgba(0,75,202,0.4); border:3px solid white;">
              <span class="material-symbols-outlined" style="font-size:22px; font-variation-settings:'FILL' 1;">person_pin_circle</span>
            </div>
          </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      });

      markersRef.current.device = L.marker([latitude, longitude], { icon: childIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif; padding:4px;">
            <strong style="font-family:Manrope,sans-serif;">${deviceName}'s Location</strong><br>
            <span style="font-size:12px; color:#424656;">
              ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
            </span>
          </div>
        `);
    }

    // Smooth pan to new position
    map.panTo([latitude, longitude], { animate: true, duration: 1 });
  }, [deviceLocation]);

  // Update route line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !showRoute || locationHistory.length < 2) return;

    if (routeRef.current) {
      map.removeLayer(routeRef.current);
    }

    const coords = locationHistory.map(p => [p.latitude, p.longitude]);
    routeRef.current = L.polyline(coords, {
      color: '#004bca',
      weight: 3,
      opacity: 0.6,
      dashArray: '8 4',
      lineCap: 'round',
    }).addTo(map);
  }, [locationHistory, showRoute]);

  // Update geofence circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old circles
    circlesRef.current.forEach(c => map.removeLayer(c));
    circlesRef.current = [];

    const geofenceArray = Object.entries(geofences);
    geofenceArray.forEach(([id, geo]) => {
      if (!geo.active) return;

      const circle = L.circle([geo.latitude, geo.longitude], {
        radius: geo.radius,
        color: '#004bca',
        fillColor: '#004bca',
        fillOpacity: 0.08,
        weight: 2,
        opacity: 0.5,
      }).addTo(map);

      circle.bindTooltip(geo.name || geo.fullName, {
        permanent: true,
        direction: 'top',
        className: 'geofence-tooltip',
        offset: [0, -10],
      });

      circlesRef.current.push(circle);
    });
  }, [geofences]);

  // Handle 'My Location' geolocation
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    function onLocationFound(e) {
      if (markersRef.current.me) {
        markersRef.current.me.setLatLng(e.latlng);
      } else {
        // Use default map pin instead of a custom dot
        markersRef.current.me = L.marker(e.latlng).addTo(map)
          .bindPopup('<strong style="font-family:Manrope,sans-serif;">You are here</strong>');
      }
    }

    function onLocationError(e) {
      alert("Could not get actual location: " + e.message);
    }

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);
    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
    };
  }, []);

  return (
    <div className="map-container" style={{ height }}>
      <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      <button
        onClick={(e) => {
          e.preventDefault();
          if (mapInstanceRef.current) {
            // Request actual high accuracy location
            mapInstanceRef.current.locate({ setView: true, maxZoom: 15, enableHighAccuracy: true });
          }
        }}
        style={{
          position: 'absolute', bottom: 24, right: 24, zIndex: 1000,
          background: 'white', border: 'none', borderRadius: 'var(--radius-lg)',
          width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-md)', color: 'var(--on-surface)', cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-container-low)'}
        onMouseLeave={e => e.currentTarget.style.background = 'white'}
        title="Find My Location"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>my_location</span>
      </button>
      {children}
    </div>
  );
}
