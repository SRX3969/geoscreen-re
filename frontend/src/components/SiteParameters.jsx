import React from "react";

const QUICK_AREAS = [2.5, 5.0, 7.0, 10.0, 25.0, 50.0];

export default function SiteParameters({
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  siteArea,
  setSiteArea,
  installationType,
  setInstallationType,
  onEvaluate,
  loading,
  loadingStep,
  error,
  mapPosition,
  onSetMapPosition
}) {
  const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);
  const areaNum = parseFloat(siteArea);

  const isLatValid = !isNaN(latNum) && latNum >= -90 && latNum <= 90;
  const isLonValid = !isNaN(lonNum) && lonNum >= -180 && lonNum <= 180;
  const isAreaValid = !isNaN(areaNum) && areaNum > 0;
  const isFormReady = isLatValid && isLonValid && isAreaValid;

  const handleLatChange = (e) => {
    const val = e.target.value;
    setLatitude(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= -90 && num <= 90 && isLonValid) {
      onSetMapPosition([num, lonNum]);
    }
  };

  const handleLonChange = (e) => {
    const val = e.target.value;
    setLongitude(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= -180 && num <= 180 && isLatValid) {
      onSetMapPosition([latNum, num]);
    }
  };

  return (
    <div className="site-parameters-card">
      <div className="card-top-bar">
        <div className="card-top-left">
          <span className="step-tag">01 / PARAMETERS</span>
          <h2 className="card-title">Site Configuration</h2>
        </div>
        <div className="form-readiness-indicator">
          {isFormReady ? (
            <span className="ready-badge ready-ok">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              Ready for Analysis
            </span>
          ) : (
            <span className="ready-badge ready-pending">
              Incomplete Inputs
            </span>
          )}
        </div>
      </div>

      <div className="parameters-form">
        {/* Coordinates Row */}
        <div className="form-row-2col">
          <div className="form-field">
            <div className="field-label-wrap">
              <label htmlFor="lat-input">Latitude (°N)</label>
              {latitude && (
                <span className={`validation-indicator ${isLatValid ? "val-ok" : "val-err"}`}>
                  {isLatValid ? "Valid Lat" : "±90°"}
                </span>
              )}
            </div>
            <div className="field-input-wrap">
              <input
                id="lat-input"
                type="number"
                step="any"
                placeholder="21.87577"
                value={latitude}
                onChange={handleLatChange}
                className="geospatial-input"
              />
              <span className="input-suffix">°N</span>
            </div>
          </div>

          <div className="form-field">
            <div className="field-label-wrap">
              <label htmlFor="lon-input">Longitude (°E)</label>
              {longitude && (
                <span className={`validation-indicator ${isLonValid ? "val-ok" : "val-err"}`}>
                  {isLonValid ? "Valid Lon" : "±180°"}
                </span>
              )}
            </div>
            <div className="field-input-wrap">
              <input
                id="lon-input"
                type="number"
                step="any"
                placeholder="79.52266"
                value={longitude}
                onChange={handleLonChange}
                className="geospatial-input"
              />
              <span className="input-suffix">°E</span>
            </div>
          </div>
        </div>

        {/* Site Area & Presets */}
        <div className="form-field">
          <div className="field-label-wrap">
            <label htmlFor="area-input">Site Footprint Area</label>
            {siteArea && (
              <span className={`validation-indicator ${isAreaValid ? "val-ok" : "val-err"}`}>
                {isAreaValid ? `${(areaNum * 100).toFixed(0)} Hectares` : "> 0 km²"}
              </span>
            )}
          </div>
          <div className="field-input-wrap">
            <input
              id="area-input"
              type="number"
              step="any"
              min="0.1"
              placeholder="7.00"
              value={siteArea}
              onChange={(e) => setSiteArea(e.target.value)}
              className="geospatial-input"
            />
            <span className="input-suffix">km²</span>
          </div>

          {/* Quick Area Buttons */}
          <div className="quick-area-row">
            <span className="quick-area-label">Quick:</span>
            {QUICK_AREAS.map((val) => (
              <button
                key={val}
                type="button"
                className={`quick-area-btn ${parseFloat(siteArea) === val ? "area-btn-active" : ""}`}
                onClick={() => setSiteArea(val.toFixed(2))}
              >
                {val} km²
              </button>
            ))}
          </div>
        </div>

        {/* Technology Selection Segmented Cards */}
        <div className="form-field">
          <label className="field-label">Target Energy Technology</label>
          <div className="tech-selector-grid">
            <button
              type="button"
              className={`tech-card ${installationType === "solar" ? "tech-card-active" : ""}`}
              onClick={() => setInstallationType("solar")}
            >
              <div className="tech-card-icon solar-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <div className="tech-card-text">
                <strong>Solar PV</strong>
                <span>Photovoltaic arrays</span>
              </div>
            </button>

            <button
              type="button"
              className={`tech-card ${installationType === "wind" ? "tech-card-active" : ""}`}
              onClick={() => setInstallationType("wind")}
            >
              <div className="tech-card-icon wind-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2" />
                </svg>
              </div>
              <div className="tech-card-text">
                <strong>Wind Turbine</strong>
                <span>Aerodynamic turbines</span>
              </div>
            </button>

            <button
              type="button"
              className={`tech-card ${installationType === "hybrid" ? "tech-card-active" : ""}`}
              onClick={() => setInstallationType("hybrid")}
            >
              <div className="tech-card-icon hybrid-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="tech-card-text">
                <strong>Hybrid Solar+Wind</strong>
                <span>Combined co-generation</span>
              </div>
            </button>
          </div>
        </div>

        {/* Map Sync Hint */}
        <div className="map-sync-note">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>
            Click map coordinates or click <strong>Draw Site</strong> on the map to define polygon boundaries and calculate surface area automatically.
          </span>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          className="run-assessment-btn"
          onClick={onEvaluate}
          disabled={loading || !isFormReady}
        >
          {loading ? (
            <div className="btn-loading-state">
              <span className="btn-spinner"></span>
              <span className="btn-loading-text">{loadingStep || "Screening environmental factors..."}</span>
            </div>
          ) : (
            <div className="btn-ready-state">
              <span>Run site assessment</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          )}
        </button>

        {/* Error Display */}
        {error && (
          <div className="form-error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div className="error-text">
              <strong>Assessment Error:</strong> {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
