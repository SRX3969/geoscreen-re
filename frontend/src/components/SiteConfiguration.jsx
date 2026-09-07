import React from "react";
import { Sun, Wind, Layers, MapPin, Compass, Play, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const QUICK_AREAS = [1.0, 5.0, 10.0, 25.0];

export default function SiteConfiguration({
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  siteArea,
  setSiteArea,
  installationType,
  setInstallationType,
  locationInfo,
  isGeocoding,
  onEvaluate,
  loading,
  loadingStep,
  error,
  isFormValid
}) {
  const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);
  const areaNum = parseFloat(siteArea);

  const isLatValid = !isNaN(latNum) && latNum >= -90 && latNum <= 90;
  const isLonValid = !isNaN(lonNum) && lonNum >= -180 && lonNum <= 180;
  const isAreaValid = !isNaN(areaNum) && areaNum > 0;

  // Format display coordinates with N/S and E/W notation
  const formattedLat = isLatValid
    ? `${Math.abs(latNum).toFixed(5)}° ${latNum >= 0 ? "N" : "S"}`
    : "—";
  const formattedLon = isLonValid
    ? `${Math.abs(lonNum).toFixed(5)}° ${lonNum >= 0 ? "E" : "W"}`
    : "—";

  return (
    <div className="site-config-card">
      <div className="config-header">
        <div className="config-title-group">
          <span className="config-section-tag">SITE PARAMETERS</span>
          <h2 className="config-heading">Configuration</h2>
        </div>
      </div>

      {/* 1. PROMINENT LOCATION IDENTIFICATION (Section 13) */}
      <div className="location-prominent-hud">
        <div className="hud-label-row">
          <div className="hud-tag">
            <MapPin size={12} strokeWidth={2.5} />
            <span>LOCATION</span>
          </div>
          {isGeocoding && (
            <span className="geocoding-badge">
              <Loader2 size={11} className="spin-icon" />
              Identifying...
            </span>
          )}
        </div>

        <div className="hud-place-name">
          {locationInfo?.locality || "Location name unavailable"}
        </div>
        <div className="hud-place-admin">
          {locationInfo?.admin_line || "Administrative details unavailable"}
        </div>

        <div className="hud-coords-row">
          <div className="hud-coord-pill">
            <span className="coord-axis">LAT</span>
            <span className="coord-val">{formattedLat}</span>
          </div>
          <div className="hud-coord-pill">
            <span className="coord-axis">LON</span>
            <span className="coord-val">{formattedLon}</span>
          </div>
        </div>
      </div>

      {/* 2. PARAMETERS FORM */}
      <div className="config-form">
        {/* Coordinates Inputs */}
        <div className="form-two-col">
          <div className="input-group">
            <label htmlFor="input-lat" className="input-label">
              Latitude
            </label>
            <div className="input-wrapper">
              <input
                id="input-lat"
                type="number"
                step="any"
                className={`text-input ${!isLatValid && latitude ? "input-invalid" : ""}`}
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="12.29291"
              />
              <span className="input-unit">° N</span>
            </div>
            {!isLatValid && latitude && (
              <span className="input-error-msg">Must be between -90 and 90</span>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="input-lon" className="input-label">
              Longitude
            </label>
            <div className="input-wrapper">
              <input
                id="input-lon"
                type="number"
                step="any"
                className={`text-input ${!isLonValid && longitude ? "input-invalid" : ""}`}
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="76.67244"
              />
              <span className="input-unit">° E</span>
            </div>
            {!isLonValid && longitude && (
              <span className="input-error-msg">Must be between -180 and 180</span>
            )}
          </div>
        </div>

        {/* Site Footprint Area */}
        <div className="input-group">
          <div className="label-with-hint">
            <label htmlFor="input-area" className="input-label">
              Site Area
            </label>
            <span className="input-hint">Proposed project footprint</span>
          </div>
          <div className="input-wrapper">
            <input
              id="input-area"
              type="number"
              step="any"
              className={`text-input ${!isAreaValid && siteArea ? "input-invalid" : ""}`}
              value={siteArea}
              onChange={(e) => setSiteArea(e.target.value)}
              placeholder="5.00"
            />
            <span className="input-unit">km²</span>
          </div>

          {/* Quick Area Buttons (Section 18) */}
          <div className="quick-areas-row">
            <span className="quick-label">Presets:</span>
            {QUICK_AREAS.map((val) => (
              <button
                key={val}
                type="button"
                className={`btn-quick-area ${parseFloat(siteArea) === val ? "quick-active" : ""}`}
                onClick={() => setSiteArea(val.toFixed(2))}
              >
                {val} km²
              </button>
            ))}
          </div>
        </div>

        {/* Technology Selector (Section 17) */}
        <div className="input-group">
          <label className="input-label">Technology</label>
          <div className="tech-selector-grid">
            <button
              type="button"
              className={`tech-btn ${installationType === "solar" ? "tech-active tech-solar" : ""}`}
              onClick={() => setInstallationType("solar")}
            >
              <Sun size={15} strokeWidth={2.2} />
              <span>Solar PV</span>
            </button>

            <button
              type="button"
              className={`tech-btn ${installationType === "wind" ? "tech-active tech-wind" : ""}`}
              onClick={() => setInstallationType("wind")}
            >
              <Wind size={15} strokeWidth={2.2} />
              <span>Wind</span>
            </button>

            <button
              type="button"
              className={`tech-btn ${installationType === "hybrid" ? "tech-active tech-hybrid" : ""}`}
              onClick={() => setInstallationType("hybrid")}
            >
              <Layers size={15} strokeWidth={2.2} />
              <span>Hybrid</span>
            </button>
          </div>
        </div>

        {/* Assessment Button (Section 19) */}
        <div className="action-button-block">
          <button
            type="button"
            className={`btn-assessment ${loading ? "btn-loading" : ""}`}
            onClick={onEvaluate}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>ANALYZING SITE</span>
              </>
            ) : (
              <>
                <Play size={15} strokeWidth={2.4} />
                <span>RUN SITE ASSESSMENT</span>
              </>
            )}
          </button>

          {/* Real-time Analysis Stage Indicator (Section 19: no fake percentages) */}
          {loading && (
            <div className="analysis-state-box">
              <div className="analysis-stage-label">{loadingStep || "Retrieving environmental data"}</div>
              <div className="analysis-steps-list">
                <span className="step-bullet">• Retrieving environmental data</span>
                <span className="step-bullet">• Evaluating renewable resources</span>
                <span className="step-bullet">• Calculating site indicators</span>
              </div>
            </div>
          )}

          {error && (
            <div className="config-error-alert" role="alert">
              <AlertCircle size={15} strokeWidth={2.2} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
