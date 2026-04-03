import { useState } from "react";
import { useGeofences } from "../hooks/useGeofences";
import { useDeviceData } from "../hooks/useDeviceData";
import MapView from "../components/MapView";
import { putAPI, postAPI, deleteAPI } from "../utils/helpers";

export default function Geofences() {
  const { geofences, loading } = useGeofences();
  const { device } = useDeviceData();
  const [selectedId, setSelectedId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGeo, setNewGeo] = useState({
    name: "",
    radius: 100,
    type: "Safe Zone",
  });
  const [isEditingBoundary, setIsEditingBoundary] = useState(false);
  const [editRadius, setEditRadius] = useState(100);

  const geofenceArray = Object.entries(geofences);
  const selected = selectedId ? geofences[selectedId] : null;
  const loc = device?.currentLocation || {};

  const toggleGeofence = async (id, active) => {
    try {
      await putAPI(`/geofences/${id}`, { active: !active });
    } catch (e) {
      console.error(e);
    }
  };

  const addGeofence = async () => {
    if (!newGeo.name) return;
    try {
      await postAPI("/geofences", {
        name: newGeo.name,
        fullName: newGeo.name,
        icon: "location_on",
        latitude: loc.latitude ?? 18.5204,
        longitude: loc.longitude ?? 73.8567,
        radius: parseInt(newGeo.radius),
        type: newGeo.type,
        active: true,
        entryAlerts: true,
        exitAlerts: true,
      });
      setShowAddForm(false);
      setNewGeo({ name: "", radius: 100, type: "Safe Zone" });
    } catch (e) {
      console.error(e);
    }
  };

  const removeGeofence = async (id) => {
    try {
      await deleteAPI(`/geofences/${id}`);
      if (selectedId === id) {
        setSelectedId(null);
        setIsEditingBoundary(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startEditingBoundary = () => {
    setEditRadius(selected?.radius || 100);
    setIsEditingBoundary(true);
  };

  const saveBoundary = async () => {
    if (!selectedId) return;
    try {
      await putAPI(`/geofences/${selectedId}`, {
        radius: parseInt(editRadius, 10),
      });
      setIsEditingBoundary(false);
    } catch (e) {
      console.error(e);
    }
  };

  const displayGeofences = { ...geofences };
  if (selectedId && isEditingBoundary) {
    displayGeofences[selectedId] = {
      ...displayGeofences[selectedId],
      radius: parseInt(editRadius, 10),
    };
  }

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - var(--topbar-height))",
        overflow: "hidden",
      }}
    >
      {/* Main Map Area */}
      <section
        style={{
          flex: 1,
          position: "relative",
          background: "var(--surface-container)",
          overflow: "hidden",
        }}
      >
        <MapView
          center={[loc.latitude ?? 18.5204, loc.longitude ?? 73.8567]}
          zoom={14}
          height="100%"
          deviceLocation={loc}
          geofences={displayGeofences}
          showRoute={false}
          darkMode={false}
        />

        {/* Map Controls */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            className="glass-dark"
            style={{
              padding: 8,
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <button
              style={{
                padding: 12,
                color: "white",
                borderRadius: "var(--radius-lg)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
              title="Draw Circle"
            >
              <span className="material-symbols-outlined">
                radio_button_unchecked
              </span>
            </button>
            <button
              style={{
                padding: 12,
                color: "white",
                borderRadius: "var(--radius-lg)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
              title="Draw Polygon"
            >
              <span className="material-symbols-outlined">polyline</span>
            </button>
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.1)",
                margin: "4px 8px",
              }}
            />
            <button
              style={{
                padding: 12,
                color: "white",
                borderRadius: "var(--radius-lg)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = "rgba(255,255,255,0.1)")
              }
              onMouseLeave={(e) => (e.target.style.background = "transparent")}
              title="Measure Distance"
            >
              <span className="material-symbols-outlined">straighten</span>
            </button>
          </div>

          <button
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
            style={{ boxShadow: "var(--shadow-xl)" }}
          >
            <span className="material-symbols-outlined">add</span>
            Add New Geofence
          </button>
        </div>

        {/* Selected Geofence Floating Panel */}
        {selected && (
          <div
            className="glass-dark animate-scale-in"
            style={{
              position: "absolute",
              top: 24,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              width: 320,
              padding: 20,
              borderRadius: "var(--radius-2xl)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: "var(--font-headline)",
                    fontWeight: 700,
                    fontSize: "1.25rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {selected.fullName || selected.name}
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 4,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      background: selected.active ? "#34d399" : "#94a3b8",
                      borderRadius: "50%",
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                    {selected.active ? "Currently Active" : "Disabled"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedId(null);
                  setIsEditingBoundary(false);
                }}
                style={{
                  padding: 4,
                  color: "white",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#34d399" }}
                  >
                    login
                  </span>
                  <span style={{ fontSize: "0.875rem" }}>Entry Alerts</span>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    defaultChecked={selected.entryAlerts}
                  />
                  <span className="toggle-slider" />
                </label>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-xl)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "var(--tertiary)" }}
                  >
                    logout
                  </span>
                  <span style={{ fontSize: "0.875rem" }}>Exit Alerts</span>
                </div>
                <label className="toggle">
                  <input type="checkbox" defaultChecked={selected.exitAlerts} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {isEditingBoundary ? (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.55rem",
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      fontWeight: 700,
                    }}
                  >
                    Adjust Radius (m)
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {editRadius}m
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="2000"
                  step="50"
                  value={editRadius}
                  onChange={(e) => setEditRadius(e.target.value)}
                  style={{ width: "100%" }}
                />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-primary"
                    onClick={saveBoundary}
                    style={{
                      flex: 1,
                      padding: "8px",
                      fontSize: "0.75rem",
                      justifyContent: "center",
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setIsEditingBoundary(false)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      fontSize: "0.75rem",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.1)",
                      color: "white",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 16,
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "0.55rem",
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontWeight: 700,
                  }}
                >
                  Radius: {selected.radius}m
                </span>
                <button
                  onClick={startEditingBoundary}
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--primary-fixed-dim)",
                    fontWeight: 700,
                  }}
                >
                  Edit Boundary
                </button>
              </div>
            )}
          </div>
        )}

        {/* Bottom Metrics */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            zIndex: 1000,
            display: "flex",
            gap: 16,
          }}
        >
          <div
            className="glass-dark"
            style={{
              padding: 16,
              borderRadius: "var(--radius-2xl)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              minWidth: 180,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-xl)",
                background: "rgba(0,75,202,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  color: "var(--primary-fixed-dim)",
                  fontVariationSettings: "'FILL' 1",
                }}
              >
                history
              </span>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Entries Today
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                4
              </p>
            </div>
          </div>
          <div
            className="glass-dark"
            style={{
              padding: 16,
              borderRadius: "var(--radius-2xl)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              minWidth: 180,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-xl)",
                background: "rgba(52,211,153,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: "#34d399", fontVariationSettings: "'FILL' 1" }}
              >
                schedule
              </span>
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Time in Zones
              </p>
              <p
                style={{
                  fontSize: "1.5rem",
                  fontFamily: "var(--font-headline)",
                  fontWeight: 700,
                  color: "white",
                }}
              >
                6h 12m
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side Panel */}
      <aside
        style={{
          width: 320,
          background: "var(--surface)",
          boxShadow: "-4px 0 12px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flexShrink: 0,
          zIndex: 30,
          overflowY: "auto",
        }}
      >
        <div style={{ padding: "var(--space-6)" }}>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            Saved Zones
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--on-surface-variant)",
              marginTop: 4,
            }}
          >
            Manage {geofenceArray.length} monitored areas
          </p>
        </div>

        {/* Add Geofence Form */}
        {showAddForm && (
          <div
            className="animate-fade-in-up"
            style={{ padding: "0 16px 16px" }}
          >
            <div
              style={{
                background: "var(--surface-container-low)",
                borderRadius: "var(--radius-xl)",
                padding: 16,
              }}
            >
              <input
                type="text"
                placeholder="Geofence name..."
                value={newGeo.name}
                onChange={(e) => setNewGeo({ ...newGeo, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "white",
                  borderRadius: "var(--radius-xl)",
                  fontSize: "0.875rem",
                  marginBottom: 8,
                  border: "1px solid rgba(194,198,217,0.3)",
                }}
              />
              <input
                type="number"
                placeholder="Radius (m)"
                value={newGeo.radius}
                onChange={(e) =>
                  setNewGeo({ ...newGeo, radius: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "white",
                  borderRadius: "var(--radius-xl)",
                  fontSize: "0.875rem",
                  marginBottom: 8,
                  border: "1px solid rgba(194,198,217,0.3)",
                }}
              />
              <select
                value={newGeo.type}
                onChange={(e) => setNewGeo({ ...newGeo, type: e.target.value })}
                style={{
                  width: "100%",
                  padding: "10px 16px",
                  background: "white",
                  borderRadius: "var(--radius-xl)",
                  fontSize: "0.875rem",
                  marginBottom: 12,
                  border: "1px solid rgba(194,198,217,0.3)",
                }}
              >
                <option>Safe Zone</option>
                <option>High Security</option>
                <option>Recreational</option>
                <option>Restricted</option>
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn-primary"
                  onClick={addGeofence}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    padding: "10px",
                  }}
                >
                  Add
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowAddForm(false)}
                  style={{ fontSize: "0.75rem", padding: "10px 16px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Geofence List */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {geofenceArray.map(([id, geo]) => {
            const isSelected = selectedId === id;
            const icons = {
              home: "home",
              school: "school",
              park: "park",
              person_pin_circle: "person_pin_circle",
              location_on: "location_on",
            };

            return (
              <div
                key={id}
                onClick={() => {
                  setSelectedId(isSelected ? null : id);
                  setIsEditingBoundary(false);
                }}
                style={{
                  padding: 16,
                  background: isSelected
                    ? "var(--primary-fixed)"
                    : "var(--surface-container-low)",
                  borderRadius: "var(--radius-xl)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  border: isSelected
                    ? "2px solid var(--primary)"
                    : "2px solid transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "var(--radius-lg)",
                        background: isSelected
                          ? "var(--on-primary-fixed-variant)"
                          : "var(--surface-container-highest)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: isSelected ? "white" : "var(--secondary)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {icons[geo.icon] || "location_on"}
                      </span>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                        {geo.fullName || geo.name}
                      </h4>
                      <p style={{ fontSize: "0.75rem", opacity: 0.75 }}>
                        {geo.radius}m • {geo.type}
                      </p>
                    </div>
                  </div>
                  <label
                    className="toggle"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={geo.active}
                      onChange={() => toggleGeofence(id, geo.active)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip */}
        <div
          style={{
            padding: "var(--space-6)",
            borderTop: "1px solid rgba(194,198,217,0.2)",
          }}
        >
          <div
            style={{
              background: "var(--surface-container-high)",
              borderRadius: "var(--radius-2xl)",
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "0.875rem", color: "var(--tertiary)" }}
              >
                info
              </span>
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Geofence Tip
              </span>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--on-surface-variant)",
                lineHeight: 1.6,
              }}
            >
              Overlap geofences to create complex notification triggers for
              transit between safe zones.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
