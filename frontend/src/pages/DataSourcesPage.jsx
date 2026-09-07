import React from "react";
import { useNavigate } from "react-router-dom";
import { Database, Cpu, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

export default function DataSourcesPage() {
  const navigate = useNavigate();

  const sources = [
    {
      name: "Open-Meteo Historical Atmospheric Archive",
      purpose: "Multi-year solar irradiance, 10m wind velocity, and ambient air temperature screening.",
      variable: "shortwave_radiation (W/m²), wind_speed_10m (m/s), temperature_2m (°C)",
      resolution: "0.1° (~11 km) gridded atmospheric mesh",
      coverage: "2021-01-01 to 2023-12-31 (3 full calendar years, 26,280 hourly observations)",
      type: "Primary Atmospheric Reanalysis Source",
      source: "ECMWF ERA5-Land Reanalysis via Open-Meteo Archive API",
      link: "https://open-meteo.com/en/docs/historical-weather-api"
    },
    {
      name: "USGS SRTM Global Digital Elevation Model",
      purpose: "Topographic surface elevation, North-South and East-West terrain slope gradients.",
      variable: "Orthometric height (m ASL) and computed terrain slope (degrees & percent grade)",
      resolution: "1 arc-second (~30 meters)",
      coverage: "Static Global Topographic Baseline (SRTMGL1 v003)",
      type: "Primary Elevation & Topography Source",
      source: "NASA / USGS Shuttle Radar Topography Mission",
      link: "https://earthobservatory.nasa.gov"
    },
    {
      name: "Open-Meteo Multi-Year Precipitation Archive",
      purpose: "Annualized cumulative precipitation to compute RUSLE Rainfall Erosivity (R-factor).",
      variable: "Daily precipitation sum (mm/day) annualized across multi-year period",
      resolution: "0.1° (~11 km) gridded mesh",
      coverage: "2021-01-01 to 2023-12-31 (3-Year Multi-Year Mean)",
      type: "Primary Precipitation Source",
      source: "Open-Meteo Historical Archive",
      link: "https://open-meteo.com"
    },
    {
      name: "OpenStreetMap Nominatim Reverse Geocoder",
      purpose: "Live administrative nomenclature identification from geographic coordinates.",
      variable: "Locality, town, district, state, country, and formatted administrative line",
      resolution: "Point-level geographic coordinate lookup",
      coverage: "Real-time Live Geospatial Gazetteer",
      type: "Geographic Nomenclature Source",
      source: "OpenStreetMap Foundation (Nominatim API)",
      link: "https://nominatim.org"
    },
    {
      name: "USDA RUSLE Physical Soil Loss Model",
      purpose: "Annualized soil erosion estimate combining rainfall, erodibility, slope, and canopy.",
      variable: "A = R × K × LS × C × P (t/ha/year soil loss estimate)",
      resolution: "Derived mathematical composite equation",
      coverage: "Annualized modeled soil erosion potential",
      type: "Derived Mathematical Engineering Model",
      source: "USDA-ARS Handbook 703 & Indian Agro-Climatic Regional Adaptations",
      link: "https://www.ars.usda.gov"
    }
  ];

  return (
    <div className="datasources-page-root">
      <div className="datasources-page-container">
        {/* Page Header */}
        <div className="page-header-block">
          <div className="page-header-eyebrow">
            <Database size={13} strokeWidth={2.4} />
            <span>DATA PROVENANCE</span>
          </div>
          <h1 className="page-header-title">Data Sources</h1>
          <p className="page-header-subtitle">
            Transparent catalog of earth observation datasets, spatial resolutions,
            and derived engineering models utilized by the GeoScreen evaluation engine.
          </p>
        </div>

        {/* Primary Data Source vs Derived Model Distinction Banner (Section 30 & 37) */}
        <div className="source-distinction-banner-large">
          <div className="distinction-column primary">
            <div className="distinction-tag primary">
              <Database size={14} strokeWidth={2.4} />
              <span>PRIMARY DATA SOURCE</span>
            </div>
            <h3 className="distinction-heading">Raw Observations & Reanalysis</h3>
            <p className="distinction-text">
              Direct physical measurements and atmospheric models (such as <strong>Open-Meteo ERA5-Land</strong>, <strong>USGS SRTM 30m DEM</strong>, and <strong>OpenStreetMap Nominatim</strong>).
              These represent observed or modeled environmental telemetry.
            </p>
          </div>

          <div className="distinction-arrow-divider">
            <ArrowRight size={22} />
          </div>

          <div className="distinction-column derived">
            <div className="distinction-tag derived">
              <Cpu size={14} strokeWidth={2.4} />
              <span>DERIVED MODEL ESTIMATE</span>
            </div>
            <h3 className="distinction-heading">Synthesized Engineering Indicators</h3>
            <p className="distinction-text">
              Mathematical approximations (such as the <strong>RUSLE soil loss estimate</strong> and <strong>Preliminary Screening Score</strong>).
              Dataset credibility does not equate to certified bankable feasibility; derived outputs require site-specific verification.
            </p>
          </div>
        </div>

        {/* Self-Contained Dataset Cards (Section 36) */}
        <div className="datasources-grid">
          {sources.map((item, idx) => (
            <div key={idx} className="dataset-card-selfcontained">
              <div className="dataset-card-header">
                <div className="dataset-title-group">
                  <span className={`dataset-type-pill ${item.type.includes("Derived") ? "pill-derived" : "pill-primary"}`}>
                    {item.type}
                  </span>
                  <h3 className="dataset-name-text">{item.name}</h3>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="dataset-external-link"
                    title={`Visit ${item.name} documentation`}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>

              <div className="dataset-card-body">
                <div className="dataset-meta-row">
                  <span className="dataset-meta-k">Purpose:</span>
                  <p className="dataset-meta-v">{item.purpose}</p>
                </div>

                <div className="dataset-meta-row">
                  <span className="dataset-meta-k">Variable:</span>
                  <p className="dataset-meta-v font-mono">{item.variable}</p>
                </div>

                <div className="dataset-meta-columns">
                  <div className="dataset-sub-col">
                    <span className="dataset-meta-k">Spatial Resolution:</span>
                    <strong className="dataset-sub-v">{item.resolution}</strong>
                  </div>
                  <div className="dataset-sub-col">
                    <span className="dataset-meta-k">Temporal Coverage:</span>
                    <strong className="dataset-sub-v">{item.coverage}</strong>
                  </div>
                </div>

                <div className="dataset-card-footer">
                  <span className="dataset-source-label">Source / Provider:</span>
                  <span className="dataset-source-text">{item.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="datasources-bottom-cta">
          <div>
            <h3 className="bottom-cta-title">Test these datasets on your project area</h3>
            <p className="bottom-cta-sub">Run automated screening across solar, wind, and soil constraints.</p>
          </div>
          <button
            type="button"
            className="btn-bottom-launch"
            onClick={() => navigate("/assessment")}
          >
            <span>START ASSESSMENT</span>
            <ArrowRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
