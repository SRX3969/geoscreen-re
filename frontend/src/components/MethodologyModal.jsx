import React from "react";

export default function MethodologyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <span className="step-tag">SCIENTIFIC FRAMEWORK</span>
            <h3 className="modal-title">Assessment Methodology & Data Architecture</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* Section 1: RUSLE */}
          <div className="methodology-block">
            <h4 className="methodology-heading">
              1. Revised Universal Soil Loss Equation (RUSLE)
            </h4>
            <p className="methodology-text">
              The platform calculates annual soil erosion rate (A) in metric tons per hectare per year (t/ha/yr) using the internationally established USDA-ARS RUSLE standard formulation:
            </p>

            <div className="equation-callout">
              <code>A = R × K × LS × C × P</code>
            </div>

            <div className="factors-glossary">
              <div className="glossary-row">
                <strong>R (Rainfall Erosivity):</strong>
                <span>Calculated via Indian climatic proxy equation: R = 79 + 0.363 × (Annual Rainfall in mm) using Open-Meteo precipitation archives.</span>
              </div>
              <div className="glossary-row">
                <strong>K (Soil Erodibility):</strong>
                <span>Derived from soil organic carbon (SOC) and texture percentages (Sand, Silt, Clay fractions) using standard nomograph equations.</span>
              </div>
              <div className="glossary-row">
                <strong>LS (Slope Length & Steepness):</strong>
                <span>Computed from Digital Elevation Model (DEM) slope gradients sampled across the perimeter bounding box.</span>
              </div>
              <div className="glossary-row">
                <strong>C (Cover Management):</strong>
                <span>Estimated from vegetation indices (NDVI) using Van der Knijff profile: C = exp(-2 × (NDVI / (1 - NDVI))).</span>
              </div>
              <div className="glossary-row">
                <strong>P (Support Practice):</strong>
                <span>Conservative baseline set to 1.0 in the absence of installed contouring or structural terracing.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Renewable Energy Feasibility */}
          <div className="methodology-block">
            <h4 className="methodology-heading">
              2. Renewable Energy Resource Thresholds
            </h4>
            <div className="thresholds-table">
              <div className="thresh-row">
                <span className="thresh-col-name">Solar Irradiance (GHI)</span>
                <span className="thresh-col-val">≥ 400 W/m² daytime average</span>
                <span className="thresh-col-note">Standard utility PV economic benchmark</span>
              </div>
              <div className="thresh-row">
                <span className="thresh-col-name">Wind Speed</span>
                <span className="thresh-col-val">≥ 4.0 m/s mean at hub height</span>
                <span className="thresh-col-note">Minimum turbine generator cut-in velocity</span>
              </div>
              <div className="thresh-row">
                <span className="thresh-col-name">Soil Erosion Risk</span>
                <span className="thresh-col-val">&lt; 5 t/ha/yr (Low)</span>
                <span className="thresh-col-note">Safe threshold for minimal foundation grading</span>
              </div>
            </div>
          </div>

          {/* Section 3: Data Sources */}
          <div className="methodology-block">
            <h4 className="methodology-heading">
              3. Satellite Earth Observations & Telemetry
            </h4>
            <p className="methodology-text">
              Environmental inputs are queried in real time from Open-Meteo Weather APIs (ECMWF & ERA5-Land reanalysis), USGS SRTM 30m Digital Elevation Models, and Copernicus Sentinel-2 multispectral sensors.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn-primary" onClick={onClose}>
            Understood & Return to Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
