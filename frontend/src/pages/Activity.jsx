import { useDeviceData } from "../hooks/useDeviceData";
import MapView from "../components/MapView";
import { formatTime, formatTimeAgo } from "../utils/helpers";

export default function Activity() {
  const { device, activities, loading } = useDeviceData();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
        }}
      >
        <span
          className="material-symbols-outlined animate-spin-slow"
          style={{ fontSize: "3rem", color: "var(--primary)" }}
        >
          radar
        </span>
      </div>
    );
  }

  const loc = device?.currentLocation || {};
  const battery = device?.battery || 0;
  const speed = device?.speed || 0;

  // Movement intensity data (simulated hourly data)
  const barData = [15, 10, 45, 60, 95, 40, 15, 10, 10, 50, 75, 30];
  const barLabels = [
    "8 AM",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
    "6 PM",
    "7 PM",
  ];

  const timelineIcons = {
    movement: {
      icon: "directions_run",
      bg: "var(--primary-fixed)",
      color: "var(--on-primary-fixed-variant)",
    },
    stationary: {
      icon: "stay_current_portrait",
      bg: "var(--surface-container-high)",
      color: "var(--on-surface-variant)",
    },
    geofence_entry: { icon: "check_circle", bg: "#dcfce7", color: "#16a34a" },
    geofence_exit: {
      icon: "logout",
      bg: "var(--surface-container-high)",
      color: "var(--on-surface-variant)",
    },
    battery: { icon: "battery_charging_full", bg: "#fef3c7", color: "#d97706" },
    sos: {
      icon: "emergency",
      bg: "var(--error-container)",
      color: "var(--on-error-container)",
    },
  };

  return (
    <div className="page-content" style={{ maxWidth: 1400 }}>
      {/* Hero Section */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "var(--space-6)",
          alignItems: "stretch",
          marginBottom: "var(--space-8)",
        }}
      >
        {/* Child Profile Card */}
        <div
          className="card card-elevated animate-fade-in-up"
          style={{
            padding: "var(--space-6)",
            display: "flex",
            gap: 32,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 160,
              height: 160,
              background: "rgba(0,75,202,0.04)",
              borderRadius: "50%",
              filter: "blur(30px)",
            }}
          />

          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "var(--radius-2xl)",
                overflow: "hidden",
                border: "4px solid rgba(0,75,202,0.1)",
                boxShadow: "var(--shadow-lg)",
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
                right: -8,
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#22c55e",
                border: "4px solid white",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: "white",
                  borderRadius: "50%",
                  animation: "pulse-ring 2s ease infinite",
                }}
              />
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 8,
              }}
            >
              <h3 style={{ fontSize: "1.875rem", fontWeight: 800 }}>
                {device?.childName || "Atharva wagh"}
              </h3>
              <span className="badge-online">Online</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "var(--on-surface-variant)",
                marginBottom: 24,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "1rem" }}
              >
                location_on
              </span>
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Near PES Modern college of engineering Campus •{" "}
                <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                  Current Location
                </span>
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 16,
              }}
            >
              <div className="metric-well">
                <p className="metric-well-label">Battery</p>
                <div className="metric-well-value">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "0.875rem",
                      color: battery > 30 ? "#16a34a" : "var(--error)",
                    }}
                  >
                    battery_charging_full
                  </span>
                  {battery}%
                </div>
              </div>
              <div className="metric-well">
                <p className="metric-well-label">Signal</p>
                <div className="metric-well-value">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "0.875rem", color: "var(--primary)" }}
                  >
                    signal_cellular_alt
                  </span>
                  {device?.signal === "good" ? "Good" : "Weak"}
                </div>
              </div>
              <div className="metric-well">
                <p className="metric-well-label">Last Update</p>
                <div className="metric-well-value">
                  {formatTimeAgo(device?.lastUpdated)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Card */}
        <div
          className="dark-card card-elevated animate-fade-in-up"
          style={{
            padding: "var(--space-6)",
            borderRadius: "var(--radius-xl)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
            animationDelay: "0.1s",
          }}
        >
          <div style={{ zIndex: 1 }}>
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
                  background: "rgba(255,255,255,0.1)",
                  padding: "4px 12px",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                System Status
              </span>
              <span
                className="material-symbols-outlined"
                style={{ color: "#facc15", fontVariationSettings: "'FILL' 1" }}
              >
                {speed > 0 ? "directions_walk" : "warning"}
              </span>
            </div>
            <h4
              style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 4 }}
            >
              {speed > 0 ? "Movement Active" : "Stationary Detected"}
            </h4>
            <p
              style={{
                color: "rgba(240,241,242,0.7)",
                fontSize: "0.875rem",
                marginBottom: 24,
              }}
            >
              {speed > 0
                ? "Child is moving at normal walking pace."
                : "No movement detected for a significant duration."}
            </p>
          </div>
          <div
            style={{
              zIndex: 1,
              background: "rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-xl)",
              padding: 16,
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                fontFamily: "var(--font-headline)",
                fontWeight: 900,
                color: "white",
                marginBottom: 4,
              }}
            >
              {speed > 0 ? `${speed.toFixed(1)} km/h` : "2h 15m"}
            </div>
            <div
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.8)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "0.875rem" }}
              >
                apartment
              </span>
              Near PES Modern college of engineering Campus
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -16,
              right: -16,
              opacity: 0.08,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 120 }}
            >
              timer
            </span>
          </div>
        </div>
      </section>

      {/* Metrics + Graph */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "var(--space-8)",
          marginBottom: "var(--space-8)",
        }}
      >
        {/* Metric Cards */}
        <div
          className="stagger-children"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div className="metric-card">
            <div>
              <p className="metric-label">Distance Today</p>
              <h5 className="metric-value">
                {(device?.distanceKm || 4.2).toFixed(1)}{" "}
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "var(--on-surface-variant)",
                  }}
                >
                  km
                </span>
              </h5>
            </div>
            <div
              className="metric-icon"
              style={{ background: "#eff6ff", color: "var(--primary)" }}
            >
              <span className="material-symbols-outlined">distance</span>
            </div>
          </div>
          <div className="metric-card">
            <div>
              <p className="metric-label">Steps Taken</p>
              <h5 className="metric-value">
                {(device?.stepCount || 5842).toLocaleString()}
              </h5>
            </div>
            <div
              className="metric-icon"
              style={{ background: "#fff7ed", color: "var(--tertiary)" }}
            >
              <span className="material-symbols-outlined">footprint</span>
            </div>
          </div>
          <div className="metric-card">
            <div>
              <p className="metric-label">Active Time</p>
              <h5 className="metric-value">1h 45m</h5>
            </div>
            <div
              className="metric-icon"
              style={{ background: "#f0fdf4", color: "#16a34a" }}
            >
              <span className="material-symbols-outlined">exercise</span>
            </div>
          </div>
        </div>

        {/* Movement Intensity Chart */}
        <div
          className="card animate-fade-in-up"
          style={{ padding: "var(--space-6)", animationDelay: "0.15s" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 32,
            }}
          >
            <h4 style={{ fontWeight: 700 }}>Movement Intensity</h4>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  borderRadius: "var(--radius-full)",
                  background: "var(--surface-container-high)",
                  color: "var(--on-surface)",
                }}
              >
                Day
              </button>
              <button
                style={{
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  borderRadius: "var(--radius-full)",
                  color: "var(--on-surface-variant)",
                }}
              >
                Week
              </button>
            </div>
          </div>
          <div className="bar-chart">
            {barData.map((h, i) => (
              <div
                key={i}
                className="bar"
                style={{
                  height: `${h}%`,
                  background:
                    h >= 70
                      ? "var(--primary)"
                      : h >= 30
                        ? "rgba(0,75,202,0.2)"
                        : "var(--surface-container-high)",
                  animationDelay: `${i * 0.05}s`,
                }}
                title={`${barLabels[i]}: ${h}%`}
              />
            ))}
          </div>
          <div className="bar-chart-labels">
            <span>8 AM</span>
            <span>12 PM</span>
            <span>4 PM</span>
            <span>8 PM</span>
          </div>
        </div>
      </section>

      {/* Activity Timeline + Map */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "7fr 5fr",
          gap: "var(--space-8)",
        }}
      >
        {/* Timeline */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 16, paddingLeft: 4 }}>
            Recent Activities
          </h4>
          <div className="timeline stagger-children">
            {activities.slice(0, 6).map((act, i) => {
              const style = timelineIcons[act.type] || timelineIcons.movement;
              return (
                <div key={i} className="timeline-item">
                  <div className="timeline-indicator">
                    <div
                      className="timeline-dot"
                      style={{ background: style.bg, color: style.color }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "1.125rem" }}
                      >
                        {act.icon || style.icon}
                      </span>
                    </div>
                    {i < activities.length - 1 && (
                      <div className="timeline-line" />
                    )}
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-content-header">
                      <span className="timeline-content-title">
                        {act.title}
                      </span>
                      <span className="timeline-content-time">
                        {formatTime(act.timestamp)}
                      </span>
                    </div>
                    <p className="timeline-content-desc">{act.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inset Map */}
        <div>
          <h4 style={{ fontWeight: 700, marginBottom: 16, paddingLeft: 4 }}>
            Last Known Location
          </h4>
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-2xl)",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <MapView
              center={[loc.latitude ?? 18.5308, loc.longitude ?? 73.8474]}
              zoom={15}
              height="400px"
              deviceLocation={loc}
              showRoute={false}
            />
            {/* Floating map info */}
            <div
              className="glass-card"
              style={{
                position: "absolute",
                bottom: 24,
                left: 24,
                right: 24,
                padding: 16,
                borderRadius: "var(--radius-xl)",
                boxShadow: "var(--shadow-xl)",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "var(--radius-lg)",
                    background: "var(--surface-container-highest)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary)",
                  }}
                >
                  <span className="material-symbols-outlined">apartment</span>
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--on-surface-variant)",
                    }}
                  >
                    Current Destination
                  </p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700 }}>
                    PES Modern college of engineering
                  </p>
                </div>
              </div>
              <button
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "10px 20px",
                  fontSize: "0.75rem",
                }}
              >
                View Full Map History
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
