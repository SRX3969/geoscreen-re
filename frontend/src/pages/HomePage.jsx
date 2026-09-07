import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass, ShieldCheck, Sun, Wind, Mountain, Database, Layers, CheckCircle2, ChevronRight } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page-root">
      {/* 1. HERO SECTION (Section 4) */}
      <section className="landing-hero-section">
        {/* Subtle decorative background contours */}
        <div className="hero-contour-backdrop" aria-hidden="true">
          <div className="contour-ring ring-1"></div>
          <div className="contour-ring ring-2"></div>
          <div className="contour-ring ring-3"></div>
        </div>

        <div className="hero-inner-container">
          <div className="hero-text-content">
            <div className="hero-eyebrow-badge">
              <span className="eyebrow-pulse-dot"></span>
              <span>GEOSPATIAL RENEWABLE INTELLIGENCE</span>
            </div>

            <h1 className="hero-display-heading">
              Assess the potential of any site <br className="hero-br" />
              <span className="heading-highlight">before you build.</span>
            </h1>

            <p className="hero-lead-paragraph">
              GeoScreen combines geographic, environmental and renewable-resource
              data to provide preliminary site screening for solar, wind and hybrid
              energy projects.
            </p>

            <div className="hero-cta-buttons-row">
              <button
                type="button"
                className="btn-hero-primary"
                onClick={() => navigate("/assessment")}
              >
                <span>START ASSESSMENT</span>
                <ArrowRight size={16} strokeWidth={2.4} />
              </button>

              <button
                type="button"
                className="btn-hero-secondary"
                onClick={() => navigate("/methodology")}
              >
                <span>VIEW METHODOLOGY</span>
              </button>
            </div>
          </div>

          {/* Glassmorphic Interactive Preview Card (Section 6) */}
          <div className="hero-glass-preview-container">
            <div className="glass-preview-card">
              <div className="glass-preview-header">
                <div className="preview-location-meta">
                  <div className="preview-pin-icon">
                    <Compass size={14} strokeWidth={2.4} />
                  </div>
                  <div>
                    <strong className="preview-place">Mysuru Site Assessment</strong>
                    <span className="preview-coords">12.29291° N, 76.67244° E • 5.00 km²</span>
                  </div>
                </div>
                <div className="preview-status-pill">PRELIMINARY</div>
              </div>

              {/* Mini Score & Verdict Teaser */}
              <div className="preview-score-strip">
                <div className="preview-score-circle">
                  <span className="preview-score-val">87</span>
                  <span className="preview-score-total">/100</span>
                </div>
                <div className="preview-verdict-info">
                  <span className="preview-verdict-label">SCREENING SCORE</span>
                  <strong className="preview-verdict-title">Highly Suitable</strong>
                  <span className="preview-subverdict">Feasible with Standard Engineering Design</span>
                </div>
              </div>

              {/* 3 Metric Pills */}
              <div className="preview-metrics-grid">
                <div className="preview-metric-card solar">
                  <div className="pm-label">
                    <Sun size={12} strokeWidth={2.4} />
                    <span>Solar Irradiance</span>
                  </div>
                  <strong className="pm-val">425.8 W/m²</strong>
                  <span className="pm-status">Suitable GHI</span>
                </div>

                <div className="preview-metric-card wind">
                  <div className="pm-label">
                    <Wind size={12} strokeWidth={2.4} />
                    <span>10 m Wind Speed</span>
                  </div>
                  <strong className="pm-val">10.3 m/s</strong>
                  <span className="pm-status">Strong Resource</span>
                </div>

                <div className="preview-metric-card soil">
                  <div className="pm-label">
                    <Mountain size={12} strokeWidth={2.4} />
                    <span>Soil Erosion</span>
                  </div>
                  <strong className="pm-val">2.82 t/ha/yr</strong>
                  <span className="pm-status">Low Physical Risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHAT GEOSCREEN DOES (Section 3) */}
      <section className="landing-value-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow-tag">PRE-FEASIBILITY INTELLIGENCE</span>
            <h2 className="section-title-large">What GeoScreen Does</h2>
            <p className="section-subtitle-text">
              Accelerate renewable development by screening physical feasibility, climatic resource yields,
              and terrain stability in minutes.
            </p>
          </div>

          <div className="value-cards-grid">
            <div className="value-card">
              <div className="value-icon-box solar-icon-box">
                <Sun size={20} strokeWidth={2.2} />
              </div>
              <h3 className="value-card-title">Renewable Resource Abundance</h3>
              <p className="value-card-desc">
                Extracts multi-year atmospheric reanalysis (shortwave irradiance and 10m wind velocity)
                to assess baseline generation yields without relying on isolated single-month anomalies.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box soil-icon-box">
                <Mountain size={20} strokeWidth={2.2} />
              </div>
              <h3 className="value-card-title">Topographic & Soil Stability</h3>
              <p className="value-card-desc">
                Synthesizes 30m digital elevation slope gradients with the USDA RUSLE physical model
                to forecast soil erosion risks, driven pile embedment constraints, and stormwater drainage needs.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box accent-icon-box">
                <Layers size={20} strokeWidth={2.2} />
              </div>
              <h3 className="value-card-title">Technology-Weighted Scoring</h3>
              <p className="value-card-desc">
                Adapts screening criteria to your targeted installation—prioritizing solar irradiance for PV,
                wind speed for turbines, or co-generation parameters for hybrid parks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (Section 8: Simple 3-Step Explanation) */}
      <section className="landing-how-it-works-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="section-eyebrow-tag">WORKFLOW</span>
            <h2 className="section-title-large">How It Works</h2>
            <p className="section-subtitle-text">
              A streamlined three-step screening journey from coordinates to downloadable assessment report.
            </p>
          </div>

          <div className="steps-three-col-grid">
            <div className="step-workflow-card">
              <div className="step-num-badge">01</div>
              <h3 className="step-card-name">LOCATE</h3>
              <p className="step-card-explanation">
                Select a geographic site via interactive map, enter coordinates, or choose benchmark reference sites.
                Administrative locality is identified automatically via OpenStreetMap Nominatim.
              </p>
            </div>

            <div className="step-workflow-card">
              <div className="step-num-badge">02</div>
              <h3 className="step-card-name">ANALYZE</h3>
              <p className="step-card-explanation">
                Evaluate renewable resources and environmental conditions. Our backend aggregates 3-year ERA5-Land
                reanalysis and computes RUSLE physical soil loss equations across site boundaries.
              </p>
            </div>

            <div className="step-workflow-card">
              <div className="step-num-badge">03</div>
              <h3 className="step-card-name">ASSESS</h3>
              <p className="step-card-explanation">
                Receive a preliminary screening score, self-contained resource cards, normalized comparative charts,
                and an executive-grade downloadable site assessment report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRIMARY CTA BANNER */}
      <section className="landing-cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-banner-text">
            <span className="cta-tag">GET STARTED</span>
            <h2 className="cta-banner-heading">Ready to screen a renewable project site?</h2>
            <p className="cta-banner-sub">
              Access live satellite atmospheric telemetry, elevation gradients, and physical soil loss estimates.
            </p>
          </div>
          <button
            type="button"
            className="btn-cta-launch"
            onClick={() => navigate("/assessment")}
          >
            <span>START ASSESSMENT</span>
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </section>

      {/* 5. SMALL TRUST & DATA PROVENANCE SECTION (Section 3) */}
      <section className="landing-trust-section">
        <div className="section-container">
          <div className="trust-inner-strip">
            <div className="trust-label">VERIFIED SCIENTIFIC PROVENANCE</div>
            <div className="trust-badges-row">
              <span className="trust-pill">Open-Meteo ERA5-Land (3-Year Reanalysis)</span>
              <span className="trust-pill">USGS SRTM 30m Global DEM</span>
              <span className="trust-pill">USDA RUSLE Soil Equation</span>
              <span className="trust-pill">OpenStreetMap Nominatim</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
