import React from "react";
import { Sun, Wind, Mountain, Thermometer } from "lucide-react";

export default function ResourceAnalysis({ result }) {
  if (!result) return null;

  const { energy, soil } = result;

  // 1. Solar metrics (from backend)
  const solarVal = energy?.solar?.ghi_proxy_avg || energy?.solar?.ghi_avg || 0;
  const solarClass = energy?.solar?.classification || (energy?.solar?.suitable ? "SUITABLE" : "MODERATE");
  const solarSource = energy?.solar?.name || "Mean shortwave radiation / GHI proxy";

  // 2. Wind metrics (from backend)
  const windVal = energy?.wind?.wind_avg_10m || energy?.wind?.wind_avg || 0;
  const windClass = energy?.wind?.classification || (energy?.wind?.suitable ? "SUITABLE" : "LOW DENSITY");
  const windHeight = energy?.wind?.height || "10 m above ground level (AGL)";

  // 3. Soil loss metrics (from backend)
  const soilLoss = soil?.soil_loss || 0;
  const soilRisk = soil?.risk || "LOW";
  const soilModel = soil?.model_label || "Modeled soil-loss estimate";

  // 4. Microclimate temperature metrics (from backend)
  const tempVal = energy?.temperature?.avg || 25.0;

  return (
    <section className="resource-analysis-section">
      <div className="section-title-wrap">
        <span className="section-eyebrow">ENVIRONMENTAL & RESOURCE TELEMETRY</span>
        <h3 className="section-heading">Resource Analysis</h3>
      </div>

      <div className="resource-cards-grid">
        {/* CARD 1: SOLAR (Amber accent) */}
        <div className="resource-card card-solar">
          <div className="card-top-accent accent-solar"></div>
          <div className="resource-card-content">
            <div className="card-category-row">
              <div className="category-meta">
                <Sun size={15} strokeWidth={2.4} className="category-icon icon-solar" />
                <span className="category-name">SOLAR</span>
              </div>
              <span className={`classification-badge badge-solar`}>
                {solarClass.toUpperCase()}
              </span>
            </div>

            <div className="card-metric-block">
              <span className="metric-large-val">{solarVal.toFixed(1)}</span>
              <span className="metric-unit-text">W/m²</span>
            </div>

            <div className="card-parameter-detail">
              <span className="param-label">Variable:</span>
              <span className="param-val">{solarSource}</span>
            </div>

            <div className="card-source-tag">
              Source: Open-Meteo ERA5-Land Reanalysis (2021–2023)
            </div>
          </div>
        </div>

        {/* CARD 2: WIND (Blue accent) */}
        <div className="resource-card card-wind">
          <div className="card-top-accent accent-wind"></div>
          <div className="resource-card-content">
            <div className="card-category-row">
              <div className="category-meta">
                <Wind size={15} strokeWidth={2.4} className="category-icon icon-wind" />
                <span className="category-name">WIND</span>
              </div>
              <span className={`classification-badge badge-wind`}>
                {windClass.toUpperCase()}
              </span>
            </div>

            <div className="card-metric-block">
              <span className="metric-large-val">{windVal.toFixed(2)}</span>
              <span className="metric-unit-text">m/s</span>
            </div>

            <div className="card-parameter-detail">
              <span className="param-label">Elevation:</span>
              <span className="param-val">{windHeight}</span>
            </div>

            <div className="card-source-tag">
              Source: Open-Meteo ERA5-Land Reanalysis (2021–2023)
            </div>
          </div>
        </div>

        {/* CARD 3: SOIL LOSS (Brown accent) */}
        <div className="resource-card card-soil">
          <div className="card-top-accent accent-soil"></div>
          <div className="resource-card-content">
            <div className="card-category-row">
              <div className="category-meta">
                <Mountain size={15} strokeWidth={2.4} className="category-icon icon-soil" />
                <span className="category-name">SOIL LOSS</span>
              </div>
              <span className={`classification-badge badge-soil`}>
                {soilRisk.toUpperCase()} EROSION
              </span>
            </div>

            <div className="card-metric-block">
              <span className="metric-large-val">{soilLoss.toFixed(2)}</span>
              <span className="metric-unit-text">t/ha/year</span>
            </div>

            <div className="card-parameter-detail">
              <span className="param-label">Model:</span>
              <span className="param-val">{soilModel} (RUSLE)</span>
            </div>

            <div className="card-source-tag">
              Source: USDA RUSLE Physical Model / SRTM DEM
            </div>
          </div>
        </div>

        {/* CARD 4: MICROCLIMATE (Green/Neutral accent) */}
        <div className="resource-card card-microclimate">
          <div className="card-top-accent accent-climate"></div>
          <div className="resource-card-content">
            <div className="card-category-row">
              <div className="category-meta">
                <Thermometer size={15} strokeWidth={2.4} className="category-icon icon-climate" />
                <span className="category-name">MICROCLIMATE</span>
              </div>
              <span className="classification-badge badge-climate">
                AMBIENT
              </span>
            </div>

            <div className="card-metric-block">
              <span className="metric-large-val">{tempVal.toFixed(1)}</span>
              <span className="metric-unit-text">°C</span>
            </div>

            <div className="card-parameter-detail">
              <span className="param-label">Variable:</span>
              <span className="param-val">2 m Mean Ambient Air Temperature</span>
            </div>

            <div className="card-source-tag">
              Source: Open-Meteo ERA5-Land Reanalysis (2021–2023)
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
