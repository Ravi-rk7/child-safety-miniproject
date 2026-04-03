import { useDeviceData } from "../hooks/useDeviceData";
import { formatTimeAgo } from "../utils/helpers";
import { postAPI } from "../utils/helpers";
import { useState } from "react";

function formatCoordinate(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(6) : "--";
}

export default function Devices() {
  const { device, loading } = useDeviceData();
  const [sosTriggered, setSosTriggered] = useState(false);

  const triggerSOS = async () => {
    try {
      await postAPI("/devices/device_001/sos");
      setSosTriggered(true);
      setTimeout(() => setSosTriggered(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

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

  return (
    <div className="page-content" style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>
          Device Management
        </h2>
        <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>
          Monitor and manage all connected tracking devices
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Device Card */}
        <div
          className="card card-elevated animate-fade-in-up"
          style={{ padding: 32, borderRadius: "var(--radius-2xl)" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "var(--radius-2xl)",
                background: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "2rem",
                  color: "var(--primary)",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                watch
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                {device?.name || "Leo's Tracker"}
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--on-surface-variant)",
                }}
              >
                Device #092 • ESP32 + GPS + GSM
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background:
                      device?.status === "online" ? "#22c55e" : "#94a3b8",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: device?.status === "online" ? "#16a34a" : "#94a3b8",
                    textTransform: "capitalize",
                  }}
                >
                  {device?.status || "offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
              marginBottom: 32,
            }}
          >
            <div className="metric-well">
              <p className="metric-well-label">Battery</p>
              <div className="metric-well-value">
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "1rem",
                    color: device?.battery > 30 ? "#16a34a" : "var(--error)",
                  }}
                >
                  {device?.battery > 60
                    ? "battery_full"
                    : device?.battery > 30
                      ? "battery_3_bar"
                      : "battery_1_bar"}
                </span>
                {device?.battery || 0}%
              </div>
            </div>
            <div className="metric-well">
              <p className="metric-well-label">Signal</p>
              <div className="metric-well-value">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "1rem", color: "var(--primary)" }}
                >
                  signal_cellular_alt
                </span>
                {device?.signal === "good" ? "Strong" : "Weak"}
              </div>
            </div>
            <div className="metric-well">
              <p className="metric-well-label">Last Update</p>
              <div
                className="metric-well-value"
                style={{ fontSize: "0.875rem" }}
              >
                {formatTimeAgo(device?.lastUpdated)}
              </div>
            </div>
            <div className="metric-well">
              <p className="metric-well-label">Speed</p>
              <div className="metric-well-value">
                {(device?.speed || 0).toFixed(1)} km/h
              </div>
            </div>
          </div>

          {/* GPS Coordinates */}
          <div
            style={{
              background: "var(--surface-container-low)",
              borderRadius: "var(--radius-xl)",
              padding: 16,
              marginBottom: 24,
            }}
          >
            <p
              style={{
                fontSize: "0.625rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--on-surface-variant)",
                marginBottom: 8,
              }}
            >
              GPS Coordinates
            </p>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              <span style={{ color: "var(--primary)" }}>
                {formatCoordinate(device?.currentLocation?.latitude)}
              </span>
              <span
                style={{ color: "var(--on-surface-variant)", margin: "0 8px" }}
              >
                |
              </span>
              <span style={{ color: "var(--primary)" }}>
                {formatCoordinate(device?.currentLocation?.longitude)}
              </span>
            </div>
          </div>

          {/* Firmware Info */}
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 1,
                background: "var(--surface-container-low)",
                borderRadius: "var(--radius-xl)",
                padding: 12,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--on-surface-variant)",
                  marginBottom: 4,
                }}
              >
                Firmware
              </p>
              <p style={{ fontWeight: 700, fontSize: "0.875rem" }}>v2.1.0</p>
            </div>
            <div
              style={{
                flex: 1,
                background: "var(--surface-container-low)",
                borderRadius: "var(--radius-xl)",
                padding: 12,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--on-surface-variant)",
                  marginBottom: 4,
                }}
              >
                Module
              </p>
              <p style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                ESP32-WROOM
              </p>
            </div>
            <div
              style={{
                flex: 1,
                background: "var(--surface-container-low)",
                borderRadius: "var(--radius-xl)",
                padding: 12,
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "var(--on-surface-variant)",
                  marginBottom: 4,
                }}
              >
                GPS
              </p>
              <p style={{ fontWeight: 700, fontSize: "0.875rem" }}>NEO-6M</p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* SOS Test Button */}
          <div
            className="card animate-fade-in-up"
            style={{
              padding: 32,
              borderRadius: "var(--radius-2xl)",
              textAlign: "center",
              animationDelay: "0.1s",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                margin: "0 auto 20px",
                background: sosTriggered
                  ? "linear-gradient(135deg, #dc2626, #ef4444)"
                  : "linear-gradient(135deg, var(--error-container), #fecaca)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: sosTriggered
                  ? "0 0 40px rgba(220,38,38,0.4)"
                  : "var(--shadow-md)",
                transition: "all 0.3s ease",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "2rem",
                  color: sosTriggered ? "white" : "var(--error)",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                emergency
              </span>
            </div>
            <h3
              style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 8 }}
            >
              SOS Emergency Test
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--on-surface-variant)",
                marginBottom: 24,
              }}
            >
              Test the emergency alert system. This will trigger a mock SOS
              notification.
            </p>
            <button
              onClick={triggerSOS}
              disabled={sosTriggered}
              style={{
                background: sosTriggered
                  ? "#22c55e"
                  : "linear-gradient(135deg, #dc2626, #ef4444)",
                color: "white",
                padding: "14px 32px",
                borderRadius: "var(--radius-xl)",
                fontWeight: 700,
                fontSize: "0.875rem",
                width: "100%",
                boxShadow: "0 4px 16px rgba(220,38,38,0.3)",
                transition: "all 0.3s ease",
                cursor: sosTriggered ? "default" : "pointer",
              }}
            >
              {sosTriggered ? "✓ SOS Alert Sent!" : "🚨 Trigger Test SOS"}
            </button>
          </div>

          {/* Connection Info */}
          <div
            className="card animate-fade-in-up"
            style={{
              padding: 32,
              borderRadius: "var(--radius-2xl)",
              animationDelay: "0.2s",
            }}
          >
            <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 20 }}>
              Connection Details
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--primary)" }}
                  >
                    wifi
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    WiFi
                  </span>
                </div>
                <span className="badge-safe">Connected</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--tertiary)" }}
                  >
                    sim_card
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    SIM800L GSM
                  </span>
                </div>
                <span className="badge-safe">Active</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#16a34a" }}
                  >
                    satellite_alt
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    GPS Fix
                  </span>
                </div>
                <span className="badge-safe">Locked</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--secondary)" }}
                  >
                    cloud
                  </span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                    Firebase RTDB
                  </span>
                </div>
                <span className="badge-safe">Synced</span>
              </div>
            </div>
          </div>

          {/* Add Device */}
          <div
            style={{
              borderRadius: "var(--radius-2xl)",
              padding: 32,
              border: "2px dashed var(--outline-variant)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 12,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--primary)";
              e.currentTarget.style.background = "rgba(0,75,202,0.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--outline-variant)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "2rem", color: "var(--primary)" }}
            >
              add_circle_outline
            </span>
            <p style={{ fontWeight: 700 }}>Add New Device</p>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
              }}
            >
              Connect another ESP32 tracker
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
