import React, { useRef } from "react";
import { X, Printer, Download, ShieldCheck, Compass, CheckCircle2 } from "lucide-react";

export default function AssessmentReportModal({ isOpen, onClose, result, locationInfo }) {
  const reportRef = useRef(null);

  if (!isOpen || !result) return null;

  const handlePrint = () => {
    window.print();
  };

  const { location, installation_type, energy, soil } = result;
  const score = result.preliminary_score || result.score_percentage || 0;
  const verdict = result.preliminary_result || result.final_decision || "Conditionally Suitable";
  const subVerdict = result.sub_verdict || "Feasible with Standard Engineering Design";
  const recommendation = result.recommendation || "";
  const findings = result.key_findings || [];
  const matrix = result.criteria_matrix || [];
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  return (
    <div className="report-modal-backdrop" onClick={onClose}>
      <div
        className="report-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Action Toolbar */}
        <div className="report-modal-toolbar">
          <div className="toolbar-left">
            <span className="report-badge-pill">PRELIMINARY SITE REPORT</span>
            <span className="report-date-text">{dateStr}</span>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              className="btn-toolbar-print"
              onClick={handlePrint}
              title="Print or Save as PDF"
            >
              <Printer size={14} strokeWidth={2.2} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              className="btn-toolbar-close"
              onClick={onClose}
              aria-label="Close Report Preview"
            >
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* Printable Document Content (Section 44) */}
        <div className="printable-report-document" ref={reportRef}>
          {/* Document Header */}
          <div className="doc-header">
            <div className="doc-brand">
              <div className="doc-brand-mark">
                <Compass size={22} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="doc-title">GEOSCREEN</h1>
                <p className="doc-subtitle">Geospatial Renewable Intelligence</p>
              </div>
            </div>
            <div className="doc-meta-right">
              <div className="doc-type-label">SITE ASSESSMENT REPORT</div>
              <div className="doc-meta-line">Generated: {dateStr}</div>
              <div className="doc-meta-line">Reference: GS-{Math.abs(location.latitude).toFixed(2)}-{Math.abs(location.longitude).toFixed(2)}</div>
            </div>
          </div>

          {/* Section 1: Location & Site Configuration */}
          <div className="doc-section">
            <h2 className="doc-section-title">01 / LOCATION SPECIFICATION</h2>
            <div className="doc-meta-grid">
              <div className="doc-meta-card">
                <span className="meta-k">Location Name</span>
                <strong className="meta-v">{locationInfo?.locality || "Selected Site"}</strong>
                <span className="meta-sub">{locationInfo?.admin_line || "Administrative Region"}</span>
              </div>
              <div className="doc-meta-card">
                <span className="meta-k">Geographic Coordinates</span>
                <strong className="meta-v">
                  {location.latitude.toFixed(5)}° N, {location.longitude.toFixed(5)}° E
                </strong>
                <span className="meta-sub">WGS 84 Reference Ellipsoid</span>
              </div>
              <div className="doc-meta-card">
                <span className="meta-k">Footprint Area</span>
                <strong className="meta-v">{location.site_area_km2} km²</strong>
                <span className="meta-sub">{(location.site_area_km2 * 100).toFixed(0)} Hectares</span>
              </div>
              <div className="doc-meta-card">
                <span className="meta-k">Target Technology</span>
                <strong className="meta-v text-capitalize">{installation_type.toUpperCase()} PV / ENERGY</strong>
                <span className="meta-sub">Utility-Scale Configuration</span>
              </div>
            </div>
          </div>

          {/* Section 2: Screening Result & Score */}
          <div className="doc-section">
            <h2 className="doc-section-title">02 / PRELIMINARY SCREENING RESULT</h2>
            <div className="doc-result-banner">
              <div className="doc-score-block">
                <span className="doc-score-num">{score}</span>
                <span className="doc-score-denom">/ 100</span>
                <span className="doc-score-caption">SCREENING SCORE</span>
              </div>
              <div className="doc-verdict-block">
                <div className="doc-verdict-title">{verdict}</div>
                <div className="doc-verdict-subtitle">{subVerdict}</div>
                <p className="doc-verdict-disclaimer">
                  * Model-based preliminary screening score; not a statistical accuracy percentage or financial guarantee.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Resource Summary */}
          <div className="doc-section">
            <h2 className="doc-section-title">03 / RESOURCE & ENVIRONMENTAL SUMMARY</h2>
            <div className="doc-resources-grid">
              <div className="doc-res-box">
                <span className="doc-res-type">SOLAR RESOURCE</span>
                <div className="doc-res-val">{energy.solar.ghi_proxy_avg || energy.solar.ghi_avg} <span className="doc-unit">W/m²</span></div>
                <span className="doc-res-detail">Mean shortwave radiation proxy</span>
                <span className="doc-res-src">Open-Meteo ERA5-Land (2021–2023)</span>
              </div>

              <div className="doc-res-box">
                <span className="doc-res-type">WIND RESOURCE</span>
                <div className="doc-res-val">{energy.wind.wind_avg_10m || energy.wind.wind_avg} <span className="doc-unit">m/s</span></div>
                <span className="doc-res-detail">10 m wind speed (10m AGL)</span>
                <span className="doc-res-src">Open-Meteo ERA5-Land (2021–2023)</span>
              </div>

              <div className="doc-res-box">
                <span className="doc-res-type">SOIL EROSION RISK</span>
                <div className="doc-res-val">{soil.soil_loss} <span className="doc-unit">t/ha/year</span></div>
                <span className="doc-res-detail">{soil.risk} risk physical estimate</span>
                <span className="doc-res-src">USDA RUSLE Model (P=1.00 baseline)</span>
              </div>

              <div className="doc-res-box">
                <span className="doc-res-type">MICROCLIMATE</span>
                <div className="doc-res-val">{energy.temperature.avg} <span className="doc-unit">°C</span></div>
                <span className="doc-res-detail">Mean ambient 2m temperature</span>
                <span className="doc-res-src">Open-Meteo ERA5-Land (2021–2023)</span>
              </div>
            </div>
          </div>

          {/* Section 4: Graphical Screening Analysis */}
          <div className="doc-section">
            <h2 className="doc-section-title">04 / SCREENING CRITERIA BREAKDOWN</h2>
            <div className="doc-criteria-table">
              <div className="doc-cr-head">
                <span>Evaluation Factor</span>
                <span>Observed / Modeled</span>
                <span>Weight</span>
                <span>Score (0–100)</span>
                <span>Classification</span>
              </div>
              {matrix.map((row, i) => (
                <div key={i} className="doc-cr-row">
                  <span className="cr-name">{row.factor}</span>
                  <span className="cr-val">{row.value}</span>
                  <span className="cr-wt">{row.weight}</span>
                  <div className="cr-bar-wrap">
                    <span className="cr-score-num">{row.score}</span>
                    <div className="cr-track">
                      <div className="cr-fill" style={{ width: `${Math.min(100, Math.max(5, row.score))}%` }}></div>
                    </div>
                  </div>
                  <span className="cr-class">{row.classification}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Key Site Parameters */}
          <div className="doc-section">
            <h2 className="doc-section-title">05 / KEY PHYSICAL & TOPOGRAPHIC PARAMETERS</h2>
            <div className="doc-params-table">
              <div className="doc-param-cell">
                <span className="pk">Elevation ASL</span>
                <strong className="pv">{soil.elevation_m || 450} m</strong>
              </div>
              <div className="doc-param-cell">
                <span className="pk">Topographic Slope</span>
                <strong className="pv">{soil.slope_degrees || 0.5}° (Grade: {soil.slope_percent || 0.8}%)</strong>
              </div>
              <div className="doc-param-cell">
                <span className="pk">Mean Annual Rainfall</span>
                <strong className="pv">{soil.annual_rainfall_mm || 1100} mm/year</strong>
              </div>
              <div className="doc-param-cell">
                <span className="pk">Vegetation Index (NDVI)</span>
                <strong className="pv">{soil.ndvi_est || 0.42} (Canopy index)</strong>
              </div>
              <div className="doc-param-cell">
                <span className="pk">RUSLE Soil Loss</span>
                <strong className="pv">{soil.soil_loss} t/ha/yr ({soil.risk} Risk)</strong>
              </div>
              <div className="doc-param-cell">
                <span className="pk">Support Practice (P)</span>
                <strong className="pv">1.00 (No conservation baseline)</strong>
              </div>
            </div>
          </div>

          {/* Section 6: Key Findings & Considerations */}
          <div className="doc-section">
            <h2 className="doc-section-title">06 / KEY FINDINGS & RECOMMENDATIONS</h2>
            <div className="doc-findings-list">
              {findings.map((f, i) => (
                <div key={i} className="doc-finding-item">
                  <div className="finding-bullet">{f.num || `0${i+1}`}</div>
                  <div className="finding-text-group">
                    <strong className="finding-title">{f.summary || f.title}</strong>
                    <p className="finding-desc">{f.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="doc-recommendation-box">
              <strong className="rec-box-title">Engineering Directive:</strong>
              <p className="rec-box-text">{recommendation}</p>
              <ul className="rec-bullet-list">
                <li>Deploy on-site calibrated meteorological mast for turbine / pyranometer measurements.</li>
                <li>Conduct geotechnical borehole sampling to confirm driven pile refusal depth and soil load-bearing capacity.</li>
                <li>Implement stormwater drainage retention basins according to multi-year rainfall peak events.</li>
              </ul>
            </div>
          </div>

          {/* Section 7: Data Sources Provenance */}
          <div className="doc-section">
            <h2 className="doc-section-title">07 / DATA SOURCES & PROVENANCE</h2>
            <div className="doc-sources-mini-table">
              <div className="doc-src-item">
                <strong>Open-Meteo ERA5-Land:</strong> Shortwave radiation, 10m wind speed, ambient 2m temperature (2021–2023 hourly atmospheric reanalysis, 0.1° grid).
              </div>
              <div className="doc-src-item">
                <strong>USGS SRTM Global DEM:</strong> Topographic surface elevation and terrain slope gradient (1 arc-second ~30m resolution).
              </div>
              <div className="doc-src-item">
                <strong>Open-Meteo Precipitation Archive:</strong> Multi-year precipitation for RUSLE rainfall erosivity (R-factor).
              </div>
              <div className="doc-src-item">
                <strong>OpenStreetMap Nominatim:</strong> Reverse geocoding geographic nomenclature.
              </div>
              <div className="doc-src-item">
                <strong>USDA RUSLE Model:</strong> Physical equation for annual soil loss ($A = R \times K \times LS \times C \times P$).
              </div>
            </div>
          </div>

          {/* Section 8: Legal Disclaimer */}
          <div className="doc-disclaimer-card">
            <strong>Preliminary Screening Disclaimer:</strong> This document is generated for preliminary geospatial site screening
            purposes only. It does not constitute an engineering-grade certification, bankable energy yield report, geotechnical survey,
            or environmental impact assessment. Formal on-site instrumentation and geotechnical borehole sampling are required prior to project financing and civil construction.
          </div>

          {/* Document Footer */}
          <div className="doc-footer-row">
            <span>GEOSCREEN • Geospatial Renewable Intelligence</span>
            <span>https://github.com/SRX3969/geoscreen-re</span>
          </div>
        </div>
      </div>
    </div>
  );
}
