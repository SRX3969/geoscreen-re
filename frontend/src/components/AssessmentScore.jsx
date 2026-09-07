import React from "react";

export default function AssessmentScore({ result, onPrintReport, onNewAssessment }) {
  if (!result) return null;

  const score = result.score_percentage !== undefined ? result.score_percentage : 75;
  const decision = result.final_decision || "SUITABLE";
  
  // Calculate stroke dash offset for a circular gauge (circumference of r=40 is ~251.2)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getVerdictDetails = (dec) => {
    switch (dec) {
      case "HIGHLY SUITABLE":
        return {
          title: "HIGHLY SUITABLE",
          subtitle: "Tier-1 Development Potential",
          badgeClass: "verdict-highly-suitable",
          color: "#15803d",
          bg: "#f0fdf4"
        };
      case "SUITABLE":
        return {
          title: "SUITABLE",
          subtitle: "Commercial Feasibility Confirmed",
          badgeClass: "verdict-suitable",
          color: "#166534",
          bg: "#ecfdf5"
        };
      case "CONDITIONALLY SUITABLE":
        return {
          title: "CONDITIONALLY SUITABLE",
          subtitle: "Feasible with Engineering Mitigation",
          badgeClass: "verdict-conditional",
          color: "#b45309",
          bg: "#fffbeb"
        };
      default:
        return {
          title: "NOT SUITABLE",
          subtitle: "Constraints Exceed Feasibility Threshold",
          badgeClass: "verdict-unsuitable",
          color: "#b91c1c",
          bg: "#fef2f2"
        };
    }
  };

  const verdict = getVerdictDetails(decision);

  return (
    <div className="assessment-hero-card">
      <div className="hero-card-inner">
        {/* Left column: Score Radial Gauge */}
        <div className="score-radial-column">
          <div className="radial-meter-container">
            <svg className="radial-meter-svg" viewBox="0 0 100 100">
              {/* Background Track Circle */}
              <circle
                className="radial-track"
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                strokeWidth="7"
              />
              {/* Animated Progress Circle */}
              <circle
                className="radial-progress"
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={verdict.color}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="radial-score-display">
              <span className="score-num">{score}</span>
              <span className="score-max">/ 100</span>
            </div>
          </div>
          <span className="radial-score-caption">Multi-Factor Score</span>
        </div>

        {/* Center column: Verdict & Executive Narrative */}
        <div className="verdict-narrative-column">
          <div className="verdict-header-row">
            <span className="section-label">02 / FEASIBILITY OUTCOME</span>
            <div className={`verdict-pill ${verdict.badgeClass}`}>
              <span className="verdict-dot"></span>
              <strong>{verdict.title}</strong>
            </div>
          </div>

          <h2 className="verdict-headline">{verdict.subtitle}</h2>

          <p className="verdict-recommendation">
            {result.recommendation || "Site screening combines high-resolution solar irradiance, wind resource availability, and RUSLE soil erosion hazard analysis."}
          </p>

          <div className="site-quick-meta">
            <div className="meta-tag">
              <span className="meta-tag-label">Location:</span>
              <strong className="meta-tag-val">{result.location.latitude.toFixed(4)}°N, {result.location.longitude.toFixed(4)}°E</strong>
            </div>
            <div className="meta-tag">
              <span className="meta-tag-label">Footprint:</span>
              <strong className="meta-tag-val">{result.location.site_area_km2} km²</strong>
            </div>
            <div className="meta-tag">
              <span className="meta-tag-label">Tech:</span>
              <strong className="meta-tag-val" style={{ textTransform: "capitalize" }}>{result.installation_type}</strong>
            </div>
          </div>
        </div>

        {/* Right column: Action buttons */}
        <div className="hero-card-actions">
          <button
            type="button"
            className="action-btn btn-export"
            onClick={onPrintReport}
            title="Export full printable PDF intelligence summary"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Print / Save Report
          </button>

          <button
            type="button"
            className="action-btn btn-reassess"
            onClick={onNewAssessment}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Re-evaluate Site
          </button>
        </div>
      </div>
    </div>
  );
}
