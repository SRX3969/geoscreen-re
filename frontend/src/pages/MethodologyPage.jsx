import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function MethodologyPage() {
  const navigate = useNavigate();

  const stages = [
    {
      num: "01",
      title: "Location Delineation & Geocoding",
      desc: "Establishes project geographic boundaries and automatically queries OpenStreetMap Nominatim for official administrative classification (locality, district, state, country).",
      inputs: "Selected center coordinates (WGS84 Latitude, Longitude) and proposed footprint area (km²).",
      output: "Bounding geographic envelope, polygon footprint coordinates, and localized administrative naming."
    },
    {
      num: "02",
      title: "Atmospheric & Renewable Resource Analysis",
      desc: "Queries 3 full calendar years (26,280 hourly observations, 2021–2023) from the Open-Meteo ERA5-Land atmospheric archive to compute climatological mean resource conditions.",
      inputs: "Hourly shortwave radiation (W/m²), 10 m wind speed (m/s), and 2 m ambient air temperature (°C).",
      output: "Mean daytime shortwave radiation (GHI proxy), 10 m wind speed, diurnal peak irradiance, and ambient thermal derating factors."
    },
    {
      num: "03",
      title: "Topographic & Slope Gradient Extraction",
      desc: "Samples digital elevation models across the site perimeter to compute terrain slope steepness and evaluate civil foundation grading feasibility.",
      inputs: "USGS SRTM 30m Global Digital Elevation Model (DEM) across multi-point site matrix.",
      output: "Mean elevation ASL (m), North-South and East-West slope gradients (degrees and percent grade)."
    },
    {
      num: "04",
      title: "Physical Soil Erosion Modeling (RUSLE)",
      desc: "Evaluates annual soil loss risk using the USDA Revised Universal Soil Loss Equation: A = R × K × LS × C × P, accounting for rainfall erosivity and topography.",
      inputs: "Multi-year annual rainfall (R), regional soil granulometry (K), topographic length/steepness (LS), canopy cover (C), and baseline support practice (P=1.00 assumed).",
      output: "Modeled annual soil loss estimate (t/ha/year) and erosional vulnerability risk classification (Low, Moderate, High, Severe)."
    },
    {
      num: "05",
      title: "Technology-Weighted Multi-Criteria Screening",
      desc: "Harmonizes atmospheric resource abundance with civil soil and slope constraints according to the selected installation technology.",
      inputs: "Solar PV (70% Solar / 30% Soil), Wind (70% Wind / 30% Soil), or Hybrid (40% Solar / 40% Wind / 20% Soil).",
      output: "Preliminary Screening Score (0–100), suitability classification, sub-verdict, and explainable engineering considerations."
    }
  ];

  return (
    <div className="methodology-page-root">
      <div className="methodology-page-container">
        {/* Page Header */}
        <div className="page-header-block">
          <div className="page-header-eyebrow">
            <BookOpen size={13} strokeWidth={2.4} />
            <span>SCIENTIFIC FRAMEWORK</span>
          </div>
          <h1 className="page-header-title">Methodology</h1>
          <p className="page-header-subtitle">
            A transparent 5-stage screening pipeline combining satellite earth observations,
            digital elevation models, and empirical soil loss mechanics.
          </p>
        </div>

        {/* 5 Assessment Stages Cards (Section 34) */}
        <div className="methodology-stages-stack">
          {stages.map((stage, idx) => (
            <div key={idx} className="methodology-stage-card">
              <div className="stage-left-badge">
                <span className="stage-number-text">{stage.num}</span>
              </div>

              <div className="stage-content-body">
                <h3 className="stage-title-text">{stage.title}</h3>
                <p className="stage-desc-text">{stage.desc}</p>

                <div className="stage-io-grid">
                  <div className="stage-io-box">
                    <span className="io-tag">INPUT DATASETS</span>
                    <p className="io-text">{stage.inputs}</p>
                  </div>
                  <div className="stage-io-box">
                    <span className="io-tag">MODEL OUTPUT</span>
                    <p className="io-text">{stage.output}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Model Limitations & Baseline Assumptions (Section 33 & 37) */}
        <div className="methodology-limitations-card">
          <div className="limitations-header">
            <AlertTriangle size={18} className="limitations-icon" />
            <h3 className="limitations-title">Model Limitations & Baseline Assumptions</h3>
          </div>

          <div className="limitations-body">
            <p className="limitations-intro">
              The GeoScreen platform is designed exclusively for <strong>preliminary pre-feasibility site screening</strong>.
              Users should consider the following scientific and physical parameters when interpreting results:
            </p>

            <ul className="limitations-list">
              <li>
                <strong>Spatial Grid Resolution:</strong> Atmospheric reanalysis utilizes a 0.1° (~11 km) gridded mesh. Micro-topographic wind funneling or localized cloud shadowing require on-site instrumentation.
              </li>
              <li>
                <strong>10 m Wind Speed vs. Hub Height:</strong> Wind velocities are reported at 10 m above ground level (AGL). Utility turbine hub heights (100–140 m) require site-specific shear exponent extrapolation from met mast sensors.
              </li>
              <li>
                <strong>RUSLE Conservation Factor (P = 1.00):</strong> Support practice factor P is set to 1.00 assuming baseline unmanaged conditions in the absence of site-specific terracing or contour trench data.
              </li>
              <li>
                <strong>No Geotechnical In-Situ Boreholes:</strong> Soil erodibility (K) is derived from regional soil associations. Driven pile load-bearing tests and bedrock refusal depth require physical borehole sampling.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="methodology-bottom-cta">
          <div>
            <h3 className="bottom-cta-title">Apply this methodology to a real site</h3>
            <p className="bottom-cta-sub">Launch an automated multi-criteria evaluation in seconds.</p>
          </div>
          <button
            type="button"
            className="btn-bottom-launch"
            onClick={() => navigate("/assessment")}
          >
            <span>LAUNCH ASSESSMENT</span>
            <ArrowRight size={15} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}
