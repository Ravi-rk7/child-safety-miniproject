import { useDeviceData } from "../hooks/useDeviceData";
import { useGeofences } from "../hooks/useGeofences";
import { useAlerts } from "../hooks/useAlerts";
import MapView from "../components/MapView";
import SOSAlert from "../components/SOSAlert";
import { formatTimeAgo, formatTime, putAPI } from "../utils/helpers";

export default function Dashboard() {
  const { device, history, activities, loading } = useDeviceData();
  const { geofences } = useGeofences();
  const { alerts } = useAlerts();
  const latestSOS = alerts.find((a) => a.type === "sos" && !a.read);

  async function dismissSOS() {
    if (!latestSOS) return;
    try {
      await putAPI(`/alerts/${latestSOS.id}/read`, {});
    } catch (err) {
      console.error("Failed to dismiss SOS alert:", err.message);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <span
            className="material-symbols-outlined animate-spin-slow"
            style={{ fontSize: "3rem", color: "var(--primary)" }}
          >
            radar
          </span>
          <p
            style={{
              marginTop: 16,
              color: "var(--on-surface-variant)",
              fontWeight: 600,
            }}
          >
            Connecting to device...
          </p>
        </div>
      </div>
    );
  }

  const loc = device?.currentLocation || {};
  const battery = device?.battery || 0;
  const signal = device?.signal || "unknown";
  const latitude = Number(loc?.latitude);
  const longitude = Number(loc?.longitude);
  const deviceLocationText =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      : "Waiting for GPS fix...";

  return (
    <div>
      {latestSOS && <SOSAlert alert={latestSOS} onDismiss={dismissSOS} />}

      <div
        style={{
          display: "flex",
          gap: "var(--space-8)",
          padding: "var(--space-8)",
          height: "calc(100vh - var(--topbar-height))",
          overflow: "hidden",
        }}
      >
        {/* Left: Map + Metrics (70%) */}
        <div
          style={{
            flex: 7,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
            overflowY: "auto",
            paddingRight: 8,
          }}
        >
          {/* Map */}
          <div style={{ position: "relative" }}>
            <MapView
              center={[loc.latitude ?? 18.5204, loc.longitude ?? 73.8567]}
              zoom={15}
              height="500px"
              deviceLocation={loc}
              deviceName={device?.childName || "Atharva wagh"}
              locationHistory={history}
              geofences={geofences}
            />

            {/* Dark overlay info pod */}
            <div
              className="glass-dark animate-fade-in-up"
              style={{
                position: "absolute",
                top: 24,
                left: 24,
                padding: 20,
                borderRadius: "var(--radius-2xl)",
                width: 260,
                zIndex: 1000,
                boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "var(--primary-fixed)",
                  }}
                >
                  Active Tracking
                </span>
                <div style={{ display: "flex", gap: 4 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#22c55e",
                      animation: "pulse-ring 2s ease infinite",
                    }}
                  />
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.5)",
                    }}
                  />
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "rgba(34,197,94,0.3)",
                    }}
                  />
                </div>
              </div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                {device?.childName || "Device"} Location
              </h3>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.8)",
                  marginBottom: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontFamily: "monospace",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "0.95rem" }}
                >
                  my_location
                </span>
                {deviceLocationText}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 16,
                }}
              >
                Last updated: {formatTimeAgo(device?.lastUpdated)}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "var(--radius-xl)",
                    padding: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.55rem",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "rgba(180,197,255,0.7)",
                      marginBottom: 4,
                    }}
                  >
                    Battery
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1.125rem" }}
                    >
                      battery_5_bar
                    </span>
                    <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                      {battery}%
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: "var(--radius-xl)",
                    padding: 12,
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.55rem",
                      textTransform: "uppercase",
                      fontWeight: 700,
                      color: "rgba(180,197,255,0.7)",
                      marginBottom: 4,
                    }}
                  >
                    Signal
                  </p>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: "1.125rem" }}
                    >
                      signal_cellular_4_bar
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        textTransform: "capitalize",
                      }}
                    >
                      {signal}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Metrics Grid */}
          <div className="grid-3 stagger-children">
            {/* Geofence Card */}
            <div
              className="card"
              style={{
                padding: "var(--space-6)",
                borderRadius: "var(--radius-2xl)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: "var(--secondary-container)",
                    borderRadius: "var(--radius-xl)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                    marginBottom: 16,
                  }}
                >
                  <span className="material-symbols-outlined">home_pin</span>
                </div>
                <p className="metric-label">Current Geofence</p>
                <h4
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}
                >
                  {findNearestGeofence(loc, geofences)}
                </h4>
              </div>
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(194,198,217,0.1)",
                }}
              >
                <span className="badge-safe">Safe Zone Verified</span>
              </div>
            </div>

            {/* Steps Card */}
            <div
              className="card"
              style={{
                padding: "var(--space-6)",
                borderRadius: "var(--radius-2xl)",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "var(--primary-fixed)",
                  borderRadius: "var(--radius-xl)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  marginBottom: 16,
                }}
              >
                <span className="material-symbols-outlined">
                  directions_walk
                </span>
              </div>
              <p className="metric-label">Steps Taken</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <h4 style={{ fontSize: "1.875rem", fontWeight: 800 }}>
                  {(device?.stepCount || 0).toLocaleString()}
                </h4>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: "#16a34a",
                  }}
                >
                  +12%
                </span>
              </div>
              <div
                style={{
                  marginTop: 16,
                  width: "100%",
                  height: 8,
                  background: "var(--surface-container-high)",
                  borderRadius: "var(--radius-full)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background:
                      "linear-gradient(90deg, var(--primary), #60a5fa)",
                    height: "100%",
                    borderRadius: "var(--radius-full)",
                    width: `${Math.min((device?.stepCount || 0) / 120, 100)}%`,
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "0.55rem",
                  color: "var(--on-surface-variant)",
                  marginTop: 8,
                  fontWeight: 500,
                }}
              >
                Daily goal: 12,000 steps
              </p>
            </div>

            {/* Movement Status Card */}
            <div
              className="card"
              style={{
                padding: "var(--space-6)",
                borderRadius: "var(--radius-2xl)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    border: "4px solid var(--primary-fixed)",
                    borderTop: "4px solid var(--primary)",
                    animation:
                      device?.speed > 0
                        ? "spin-slow 3s linear infinite"
                        : "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--primary)", fontSize: "1.875rem" }}
                  >
                    motion_photos_on
                  </span>
                </div>
              </div>
              <p className="metric-label">Movement Status</p>
              <h4
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                Stationary
              </h4>
              <p
                style={{
                  fontSize: "0.55rem",
                  color: "var(--on-surface-variant)",
                  marginTop: 4,
                }}
              >
                Speed: {0.1} km/h
              </p>
            </div>
          </div>
        </div>

        {/* Right: Profile + Activity (30%) */}
        <div
          style={{
            flex: 3,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
            overflowY: "auto",
          }}
        >
          {/* Profile Card */}
          <div
            className="card animate-slide-right"
            style={{
              padding: "var(--space-8)",
              borderRadius: "var(--radius-3xl)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: 96,
                background:
                  "linear-gradient(135deg, rgba(0,75,202,0.08), rgba(96,165,250,0.12))",
              }}
            />

            <div
              style={{ position: "relative", marginTop: 16, marginBottom: 24 }}
            >
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "var(--radius-3xl)",
                  overflow: "hidden",
                  border: "4px solid white",
                  boxShadow: "var(--shadow-xl)",
                  background: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "3.5rem",
                    color: "var(--primary)",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  face
                </span>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -8,
                  right: -4,
                  background: "white",
                  padding: 8,
                  borderRadius: "var(--radius-2xl)",
                  boxShadow: "var(--shadow-sm)",
                  border: "1px solid rgba(194,198,217,0.1)",
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: "#22c55e",
                    fontVariationSettings: "'FILL' 1",
                  }}
                >
                  verified
                </span>
              </div>
            </div>

            <h2
              style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}
            >
              {device?.childName || "Atharva wagh"}
            </h2>
            <p
              style={{
                color: "var(--on-surface-variant)",
                fontSize: "0.875rem",
                fontWeight: 500,
                marginBottom: 24,
              }}
            >
              College Tracker • Device #092
            </p>

            {/* Device Health */}
            <div style={{ width: "100%" }}>
              <div
                style={{
                  background: "var(--surface-container-low)",
                  padding: 20,
                  borderRadius: "var(--radius-2xl)",
                  textAlign: "left",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      color: "var(--on-surface-variant)",
                    }}
                  >
                    Device Health
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                    }}
                  >
                    {battery > 60 ? "Excellent" : battery > 30 ? "Good" : "Low"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: 12,
                        background: "white",
                        borderRadius: "var(--radius-full)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          background: `linear-gradient(90deg, ${battery > 30 ? "var(--primary)" : "var(--error)"}, ${battery > 30 ? "#60a5fa" : "#f87171"})`,
                          height: "100%",
                          width: `${battery}%`,
                          borderRadius: "var(--radius-full)",
                          transition: "width 1s ease",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "0.55rem",
                        color: "var(--on-surface-variant)",
                        marginTop: 8,
                        fontWeight: 700,
                      }}
                    >
                      {battery}% Capacity Remaining
                    </p>
                  </div>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--primary)", fontSize: "1.5rem" }}
                  >
                    bolt
                  </span>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{ textAlign: "left" }}>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    history
                  </span>
                  Recent Activity
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 20,
                    position: "relative",
                    marginLeft: 16,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -3,
                      top: 8,
                      bottom: 8,
                      width: 1,
                      background: "rgba(194,198,217,0.3)",
                    }}
                  />
                  {activities.slice(0, 3).map((act, i) => (
                    <div
                      key={i}
                      style={{ position: "relative", paddingLeft: 12 }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: -9,
                          top: 4,
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          background:
                            i === 0
                              ? "var(--primary)"
                              : "var(--outline-variant)",
                          border: "2px solid white",
                        }}
                      />
                      <p style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                        {act.title}
                      </p>
                      <p
                        style={{
                          fontSize: "0.55rem",
                          color: "var(--on-surface-variant)",
                        }}
                      >
                        {formatTime(act.timestamp)} •{" "}
                        {act.description?.slice(0, 30)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{
                width: "100%",
                marginTop: 32,
                padding: "16px",
                borderRadius: "var(--radius-2xl)",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1rem" }}
              >
                download
              </span>
              Export Activity Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function findNearestGeofence(loc, geofences) {
  const lat = Number(loc?.latitude);
  const lng = Number(loc?.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || !geofences)
    return "Pune, Maharashtra";
  const entries = Object.values(geofences);
  let nearest = null;
  let minDist = Infinity;
  for (const geo of entries) {
    const geoLat = Number(geo.latitude);
    const geoLng = Number(geo.longitude);
    if (!Number.isFinite(geoLat) || !Number.isFinite(geoLng)) continue;

    const d = Math.sqrt(Math.pow(lat - geoLat, 2) + Math.pow(lng - geoLng, 2));
    if (d < minDist) {
      minDist = d;
      nearest = geo;
    }
  }
  return nearest
    ? `Near ${nearest.fullName || nearest.name}`
    : "Pune, Maharashtra";
}
