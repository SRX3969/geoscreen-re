import React from "react";
import { Database, Cpu, ArrowRight } from "lucide-react";

export default function DataSources({ result }) {
  const sources = (result && result.data_sources) || [
    {
      dataset: "Open-Meteo Historical Archive",
      parameter: "Shortwave radiation, 10 m wind speed, 2 m air temperature",
      resolution: "0.1° (~11 km) atmospheric grid",
      period: "2021-01-01 to 2023-12-31 (3-Year Reanalysis)",
      type: "Weather & Climate Source"
    },
    {
      dataset: "USGS SRTM Global DEM",
      parameter: "Topographic elevation, slope gradients in NS and EW vectors",
      resolution: "1 arc-second (~30 m)",
      period: "Static Topographic Baseline",
      type: "Elevation & Topography Source"
    },
    {
      dataset: "Open-Meteo Precipitation Archive",
      parameter: "Cumulative multi-year rainfall for RUSLE R-factor erosivity",
      resolution: "0.1° (~11 km) gridded",
      period: "2021-01-01 to 2023-12-31 (3-Year Mean)",
      type: "Precipitation Source"
    },
    {
      dataset: "OpenStreetMap Nominatim",
      parameter: "Administrative reverse geocoding (locality, district, state, country)",
      resolution: "Point level",
      period: "Real-time Live Query",
      type: "Geographic Nomenclature Source"
    },
    {
      dataset: "USDA RUSLE Model",
      parameter: "Physical soil loss equation A = R × K × LS × C × P",
      resolution: "Mathematical derived model",
      period: "Annualised soil loss estimate",
      type: "Derived Mathematical Model"
    }
  ];

  return (
    <section className="data-sources-section" id="data-sources">
      <div className="section-title-wrap">
        <span className="section-eyebrow">SCIENTIFIC INTEGRITY & PROVENANCE</span>
        <h3 className="section-heading">Data Sources & Assessment Methodology</h3>
      </div>

      {/* Distinction between DATA SOURCE and MODEL RESULT (Section 30) */}
      <div className="source-distinction-banner">
        <div className="distinction-item item-source">
          <div className="distinction-tag">
            <Database size={13} strokeWidth={2.2} />
            PRIMARY DATA SOURCE
          </div>
          <p className="distinction-desc">
            Raw observational or atmospheric reanalysis data (e.g. <strong>Open-Meteo ERA5-Land</strong>, <strong>USGS SRTM 30m DEM</strong>, <strong>OSM Nominatim</strong>).
          </p>
        </div>

        <div className="distinction-divider">
          <ArrowRight size={18} className="arrow-icon" />
        </div>

        <div className="distinction-item item-model">
          <div className="distinction-tag">
            <Cpu size={13} strokeWidth={2.2} />
            DERIVED MODEL ESTIMATE
          </div>
          <p className="distinction-desc">
            Computed engineering approximations (e.g. <strong>RUSLE soil loss estimate</strong>, <strong>Preliminary Screening Score</strong>). Dataset credibility does not equal certified site feasibility.
          </p>
        </div>
      </div>

      {/* Verified Data Sources Table (Section 29) */}
      <div className="sources-table-card">
        <div className="sources-table-header">
          <div className="col-src-dataset">Dataset</div>
          <div className="col-src-param">Observed Variable / Purpose</div>
          <div className="col-src-res">Spatial Resolution</div>
          <div className="col-src-period">Temporal Period</div>
          <div className="col-src-type">Classification</div>
        </div>

        <div className="sources-table-body">
          {sources.map((src, i) => (
            <div key={i} className="sources-row">
              <div className="col-src-dataset">
                <strong className="dataset-name">{src.dataset}</strong>
              </div>
              <div className="col-src-param">
                <span className="param-text">{src.parameter}</span>
              </div>
              <div className="col-src-res">
                <span className="res-pill">{src.resolution}</span>
              </div>
              <div className="col-src-period">
                <span className="period-text">{src.period}</span>
              </div>
              <div className="col-src-type">
                <span className={`type-tag ${src.type.includes("Derived") ? "tag-derived" : "tag-raw"}`}>
                  {src.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Step Methodology Summary (Section 31) */}
      <div className="methodology-card" id="methodology">
        <div className="methodology-header">
          <h4 className="methodology-title">5-Stage Screening Methodology</h4>
          <span className="methodology-badge">ISO & USDA Harmonized</span>
        </div>

        <div className="methodology-steps-grid">
          <div className="methodology-step">
            <span className="step-number">01</span>
            <strong className="step-title">Location Delineation</strong>
            <p className="step-desc">
              Reverse geocodes geographic coordinates via OpenStreetMap Nominatim, establishes bounding envelope, and models site boundary footprint.
            </p>
          </div>

          <div className="methodology-step">
            <span className="step-number">02</span>
            <strong className="step-title">Atmospheric Data Query</strong>
            <p className="step-desc">
              Retrieves 3 full calendar years (26,280 hourly observations) of ERA5-Land reanalysis for shortwave radiation, 10m wind velocity, and ambient air temperature.
            </p>
          </div>

          <div className="methodology-step">
            <span className="step-number">03</span>
            <strong className="step-title">Renewable Potential</strong>
            <p className="step-desc">
              Calculates daytime mean shortwave radiation (GHI proxy) and 10m kinetic wind velocity against utility-scale economic screening thresholds.
            </p>
          </div>

          <div className="methodology-step">
            <span className="step-number">04</span>
            <strong className="step-title">Topographic & Soil Loss</strong>
            <p className="step-desc">
              Computes multi-point terrain slope from SRTM 30m DEM and evaluates soil erosion risk using the Revised Universal Soil Loss Equation (A = R × K × LS × C × P).
            </p>
          </div>

          <div className="methodology-step">
            <span className="step-number">05</span>
            <strong className="step-title">Multi-Criteria Scoring</strong>
            <p className="step-desc">
              Weights resource abundance and geotechnical foundation stability according to selected technology (Solar, Wind, or Hybrid) to synthesize the screening score.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
