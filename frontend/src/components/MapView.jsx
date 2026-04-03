import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function parseCoordinate(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function isValidLatLng(latitude, longitude) {
  return (
    latitude !== null &&
    longitude !== null &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

function normalizePoint(point) {
  if (!point) return null;
  const latitude = parseCoordinate(point.latitude ?? point.lat);
  const longitude = parseCoordinate(point.longitude ?? point.lng);

  if (!isValidLatLng(latitude, longitude)) return null;
  return { latitude, longitude };
}

export default function MapView({
  center = [18.5204, 73.8567],
  zoom = 14,
  height = "500px",
  deviceLocation,
  locationHistory = [],
  geofences = [],
  showRoute = true,
  darkMode = false,
  deviceName = "Device",
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
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    mapInstanceRef.current = map;
    if (onMapReady) onMapReady(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !Array.isArray(center) || center.length < 2) return;

    const latitude = parseCoordinate(center[0]);
    const longitude = parseCoordinate(center[1]);
    if (!isValidLatLng(latitude, longitude)) return;

    const current = map.getCenter();
    const centerChanged =
      Math.abs(current.lat - latitude) > 0.000001 ||
      Math.abs(current.lng - longitude) > 0.000001;

    if (centerChanged || map.getZoom() !== zoom) {
      map.setView([latitude, longitude], zoom, { animate: centerChanged });
    }
  }, [center, zoom]);

  // Update device marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !deviceLocation) return;

    const point = normalizePoint(deviceLocation);
    if (!point) return;

    const { latitude, longitude } = point;

    // Create or update child marker
    if (markersRef.current.device) {
      markersRef.current.device.setLatLng([latitude, longitude]);
    } else {
      const childIcon = L.divIcon({
        className: "custom-marker",
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

      markersRef.current.device = L.marker([latitude, longitude], {
        icon: childIcon,
      }).addTo(map).bindPopup(`
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
  }, [deviceLocation, deviceName]);

  // Update route line
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routeRef.current) {
      map.removeLayer(routeRef.current);
      routeRef.current = null;
    }

    if (!showRoute || locationHistory.length < 2) return;

    const coords = locationHistory
      .map(normalizePoint)
      .filter(Boolean)
      .map((p) => [p.latitude, p.longitude]);

    if (coords.length < 2) return;

    routeRef.current = L.polyline(coords, {
      color: "#004bca",
      weight: 3,
      opacity: 0.6,
      dashArray: "8 4",
      lineCap: "round",
    }).addTo(map);
  }, [locationHistory, showRoute]);

  // Update geofence circles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old circles
    circlesRef.current.forEach((c) => map.removeLayer(c));
    circlesRef.current = [];

    const geofenceArray = Object.entries(geofences);
    geofenceArray.forEach(([id, geo]) => {
      if (!geo.active) return;

      const point = normalizePoint(geo);
      if (!point) return;

      const radius = parseCoordinate(geo.radius);
      if (radius === null || radius <= 0) return;

      const circle = L.circle([point.latitude, point.longitude], {
        radius,
        color: "#004bca",
        fillColor: "#004bca",
        fillOpacity: 0.08,
        weight: 2,
        opacity: 0.5,
      }).addTo(map);

      circle.bindTooltip(geo.name || geo.fullName, {
        permanent: true,
        direction: "top",
        className: "geofence-tooltip",
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
        markersRef.current.me = L.marker(e.latlng)
          .addTo(map)
          .bindPopup(
            '<strong style="font-family:Manrope,sans-serif;">You are here</strong>',
          );
      }
    }

    function onLocationError(e) {
      alert("Could not get actual location: " + e.message);
    }

    map.on("locationfound", onLocationFound);
    map.on("locationerror", onLocationError);
    return () => {
      map.off("locationfound", onLocationFound);
      map.off("locationerror", onLocationError);
    };
  }, []);

  return (
    <div className="map-container" style={{ height }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={(e) => {
          e.preventDefault();
          if (mapInstanceRef.current) {
            // Request actual high accuracy location
            mapInstanceRef.current.locate({
              setView: true,
              maxZoom: 15,
              enableHighAccuracy: true,
            });
          }
        }}
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 1000,
          background: "white",
          border: "none",
          borderRadius: "var(--radius-lg)",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-md)",
          color: "var(--on-surface)",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--surface-container-low)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
        title="Find My Location"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>
          my_location
        </span>
      </button>
      {children}
    </div>
  );
}
