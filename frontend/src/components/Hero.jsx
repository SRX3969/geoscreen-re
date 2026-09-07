import React from "react";

export default function Hero({ presets, activePreset, onSelectPreset, onScrollToWorkspace }) {
  return (
    <section className="hero-section" id="overview">
      <div className="hero-container">
        {/* Category Pill */}
        <div className="hero-eyebrow">
          <span className="eyebrow-badge">
            <span className="live-radar-dot"></span>
            GIS RESOURCE SCREENING
          </span>
          <span className="eyebrow-text">Global Satellite & RUSLE Physical Modeling</span>
        </div>

        {/* Hero Title & Description */}
        <div className="hero-content">
          <h1 className="hero-title">
            Renewable energy site intelligence
          </h1>
          <p className="hero-subtitle">
            Evaluate utility-scale solar irradiance, wind velocity profiles, and <strong>RUSLE soil erosion constraints</strong> using satellite earth observations, digital elevation models, and physical climate indices.
          </p>
        </div>

        {/* Benchmark Sites Selector */}
        <div className="hero-presets-wrapper">
          <div className="presets-header">
            <span className="presets-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              Benchmark Reference Sites:
            </span>
            <span className="presets-hint">Click to load coordinates & area into workspace</span>
          </div>

          <div className="preset-chips-grid">
            {presets.map((preset, index) => {
              const isActive = activePreset === preset.name;
              return (
                <button
                  key={index}
                  type="button"
                  className={`benchmark-chip ${isActive ? "chip-active" : ""}`}
                  onClick={() => onSelectPreset(preset)}
                >
                  <span className="chip-icon">
                    {preset.type === "solar" ? "☀️" : preset.type === "wind" ? "💨" : "⚡"}
                  </span>
                  <div className="chip-meta">
                    <span className="chip-name">{preset.name}</span>
                    <span className="chip-details">{preset.lat}°N, {preset.lon}°E • {preset.area} km²</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Geospatial Capability Telemetry Bar */}
        <div className="hero-telemetry-bar">
          <div className="telemetry-item">
            <span className="telemetry-label">Solar Feed</span>
            <strong className="telemetry-value">GHI & DNI Archive</strong>
          </div>
          <div className="telemetry-divider"></div>
          <div className="telemetry-item">
            <span className="telemetry-label">Anemometer Grid</span>
            <strong className="telemetry-value">10m & 100m Velocity</strong>
          </div>
          <div className="telemetry-divider"></div>
          <div className="telemetry-item">
            <span className="telemetry-label">Topography (DEM)</span>
            <strong className="telemetry-value">30m SRTM Slope Model</strong>
          </div>
          <div className="telemetry-divider"></div>
          <div className="telemetry-item">
            <span className="telemetry-label">Soil Physics</span>
            <strong className="telemetry-value">RUSLE (R·K·LS·C·P)</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
