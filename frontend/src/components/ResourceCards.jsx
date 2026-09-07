import React from "react";

export default function ResourceCards({ result }) {
  if (!result) return null;

  const { energy, soil } = result;

  // 1. Solar calculations
  const solarGhi = energy.solar.ghi_avg || 0;
  const solarPeak = energy.solar.ghi_max || 0;
  const isSolarSuitable = energy.solar.suitable;
  const solarProgress = Math.min(100, Math.max(10, (solarGhi / 500) * 100));

  // 2. Wind calculations
  const windAvg = energy.wind.wind_avg || 0;
  const windMax = energy.wind.wind_max || 0;
  const isWindSuitable = energy.wind.suitable;
  const windProgress = Math.min(100, Math.max(10, (windAvg / 10) * 100));

  // 3. Soil calculations
  const soilLoss = soil.soil_loss || 0;
  const soilRisk = soil.risk || "Low";
  const slopePct = soil.slope_percent !== undefined ? soil.slope_percent : 0.8;
  const slopeDeg = soil.slope_degrees !== undefined ? soil.slope_degrees : 0.5;
  // For soil loss, lower is better. 0-5 t/ha/yr is low (good)
  const soilProgress = Math.min(100, Math.max(10, (soilLoss / 20) * 100));

  // 4. Climate calculations
  const tempAvg = energy.temperature.avg || 25;
  const elevation = soil.elevation_m !== undefined ? soil.elevation_m : 450;
  const rainfall = soil.annual_rainfall_mm !== undefined ? soil.annual_rainfall_mm : 1100;

  return (
    <div className="resource-analytics-section">
      <div className="section-header-row">
        <div>
          <span className="section-label">RESOURCE & ENVIRONMENTAL ATTRIBUTES</span>
          <h3 className="section-heading">Key Assessment Dimensions</h3>
        </div>
      </div>

      <div className="resource-cards-grid">
        {/* CARD 1: SOLAR */}
        <div className="resource-card solar-theme-card">
          <div className="card-header-bar">
            <div className="resource-type">
              <div className="resource-icon solar-badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              </div>
              <span className="resource-name">Solar Irradiance</span>
            </div>
            <span className={`status-pill ${isSolarSuitable ? "pill-good" : "pill-warn"}`}>
              {isSolarSuitable ? "High Resource" : "Moderate Resource"}
            </span>
          </div>

          <div className="resource-value-block">
            <span className="primary-metric">{solarGhi.toFixed(1)}</span>
            <span className="metric-unit">W/m² GHI</span>
          </div>

          <div className="visual-progress-wrap">
            <div className="progress-labels">
              <span>Daytime Mean Irradiance</span>
              <strong>Target ≥400 W/m²</strong>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill fill-solar"
                style={{ width: `${solarProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="card-footer-details">
            <div className="detail-stat">
              <span>Peak Hourly:</span>
              <strong>{solarPeak.toFixed(0)} W/m²</strong>
            </div>
            <div className="detail-stat">
              <span>Assessment:</span>
              <strong className={isSolarSuitable ? "text-success" : "text-amber"}>
                {isSolarSuitable ? "Exceeds Threshold" : "Sub-Optimal"}
              </strong>
            </div>
          </div>
        </div>

        {/* CARD 2: WIND */}
        <div className="resource-card wind-theme-card">
          <div className="card-header-bar">
            <div className="resource-type">
              <div className="resource-icon wind-badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2" />
                </svg>
              </div>
              <span className="resource-name">Wind Velocity</span>
            </div>
            <span className={`status-pill ${isWindSuitable ? "pill-good" : "pill-warn"}`}>
              {isWindSuitable ? "Commercial Viability" : "Low Resource"}
            </span>
          </div>

          <div className="resource-value-block">
            <span className="primary-metric">{windAvg.toFixed(2)}</span>
            <span className="metric-unit">m/s Mean</span>
          </div>

          <div className="visual-progress-wrap">
            <div className="progress-labels">
              <span>Mean Velocity at 10m AGL</span>
              <strong>Target ≥4.0 m/s</strong>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill fill-wind"
                style={{ width: `${windProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="card-footer-details">
            <div className="detail-stat">
              <span>Max Gust:</span>
              <strong>{windMax.toFixed(1)} m/s</strong>
            </div>
            <div className="detail-stat">
              <span>Assessment:</span>
              <strong className={isWindSuitable ? "text-success" : "text-amber"}>
                {isWindSuitable ? "Turbine Viable" : "Unfavorable"}
              </strong>
            </div>
          </div>
        </div>

        {/* CARD 3: SOIL & RUSLE */}
        <div className="resource-card soil-theme-card">
          <div className="card-header-bar">
            <div className="resource-type">
              <div className="resource-icon soil-badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                </svg>
              </div>
              <span className="resource-name">Soil Loss (RUSLE)</span>
            </div>
            <span className={`status-pill ${soilRisk === "Low" ? "pill-good" : soilRisk === "Moderate" ? "pill-warn" : "pill-risk"}`}>
              {soilRisk} Erosion Risk
            </span>
          </div>

          <div className="resource-value-block">
            <span className="primary-metric">{soilLoss.toFixed(2)}</span>
            <span className="metric-unit">t/ha/year</span>
          </div>

          <div className="visual-progress-wrap">
            <div className="progress-labels">
              <span>RUSLE Estimated Loss Rate</span>
              <strong>Safe &lt;5 t/ha/yr</strong>
            </div>
            <div className="progress-bar-track">
              <div
                className={`progress-bar-fill ${soilRisk === "Low" ? "fill-good" : soilRisk === "Moderate" ? "fill-warn" : "fill-risk"}`}
                style={{ width: `${soilProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="card-footer-details">
            <div className="detail-stat">
              <span>Terrain Slope:</span>
              <strong>{slopePct.toFixed(1)}% ({slopeDeg.toFixed(1)}°)</strong>
            </div>
            <div className="detail-stat">
              <span>Foundation Stability:</span>
              <strong className={soilRisk === "Low" ? "text-success" : "text-amber"}>
                {soilRisk === "Low" ? "High Stability" : "Mitigation Required"}
              </strong>
            </div>
          </div>
        </div>

        {/* CARD 4: CLIMATE & ELEVATION */}
        <div className="resource-card terrain-theme-card">
          <div className="card-header-bar">
            <div className="resource-type">
              <div className="resource-icon terrain-badge-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
                </svg>
              </div>
              <span className="resource-name">Microclimate & Topo</span>
            </div>
            <span className="status-pill pill-neutral">
              Baseline Profile
            </span>
          </div>

          <div className="resource-value-block">
            <span className="primary-metric">{tempAvg.toFixed(1)}</span>
            <span className="metric-unit">°C Mean</span>
          </div>

          <div className="visual-progress-wrap">
            <div className="progress-labels">
              <span>Annual Precipitation</span>
              <strong>{rainfall.toFixed(0)} mm/yr</strong>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill fill-climate"
                style={{ width: `${Math.min(100, (rainfall / 2000) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="card-footer-details">
            <div className="detail-stat">
              <span>Altitude (ASL):</span>
              <strong>{elevation.toFixed(0)} meters</strong>
            </div>
            <div className="detail-stat">
              <span>Thermal Efficiency:</span>
              <strong className={tempAvg < 32 ? "text-success" : "text-amber"}>
                {tempAvg < 30 ? "Optimal Band" : "Thermal Derating"}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
