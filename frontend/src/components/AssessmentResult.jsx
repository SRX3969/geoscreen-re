import React, { useState } from "react";
import { Info, CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from "lucide-react";

export default function AssessmentResult({ result }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!result) return null;

  const score = result.preliminary_score !== undefined
    ? result.preliminary_score
    : (result.score_percentage || 0);

  const verdict = result.preliminary_result || result.final_decision || "Conditionally Suitable";
  const subVerdict = result.sub_verdict || "Feasible with Engineering Mitigation";
  const confidence = result.data_confidence || "Medium";
  const disclaimer = result.score_disclaimer || "This is a model-based screening score, not a statistical accuracy percentage.";

  // Dynamic status theme based on score / verdict
  const getTheme = () => {
    if (score >= 80) {
      return {
        color: "var(--success)",
        bgColor: "var(--accent-light)",
        badgeClass: "badge-success",
        icon: <CheckCircle2 size={20} strokeWidth={2.4} />
      };
    }
    if (score >= 60) {
      return {
        color: "var(--warning)",
        bgColor: "var(--warning-light)",
        badgeClass: "badge-warning",
        icon: <AlertTriangle size={20} strokeWidth={2.4} />
      };
    }
    return {
      color: "var(--danger)",
      bgColor: "var(--danger-light)",
      badgeClass: "badge-danger",
      icon: <AlertOctagon size={20} strokeWidth={2.4} />
    };
  };

  const theme = getTheme();

  // SVG circular gauge calculations
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="assessment-result-card" id="results">
      <div className="result-card-inner">
        {/* Left: Score Gauge (Section 21) */}
        <div className="result-score-block">
          <div className="score-ring-wrapper">
            <svg className="score-ring-svg" viewBox="0 0 110 110">
              <circle
                className="score-ring-bg"
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                strokeWidth="8"
              />
              <circle
                className="score-ring-fill"
                cx="55"
                cy="55"
                r={radius}
                fill="none"
                stroke={theme.color}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 55 55)"
              />
            </svg>
            <div className="score-number-center">
              <span className="score-big-num">{score}</span>
              <span className="score-denom">/ 100</span>
            </div>
          </div>
          <span className="score-descriptor-label">PRELIMINARY SCREENING SCORE</span>
        </div>

        {/* Center: Result & Verdict (Section 20) */}
        <div className="result-verdict-block">
          <div className="result-header-line">
            <span className="result-category-label">PRELIMINARY SCREENING RESULT</span>
            
            {/* Data Confidence Indicator (Section 22) */}
            <div
              className="data-confidence-pill"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              role="button"
              tabIndex={0}
            >
              <span className="confidence-label">DATA CONFIDENCE:</span>
              <strong className="confidence-val">{confidence}</strong>
              <Info size={13} className="confidence-icon" />

              {showTooltip && (
                <div className="confidence-tooltip" role="tooltip">
                  <div className="tooltip-title">Data Confidence Methodology</div>
                  <p className="tooltip-text">
                    Screening confidence reflects:
                  </p>
                  <ul className="tooltip-list">
                    <li>Spatial resolution (0.1° atmospheric grid, 30m DEM)</li>
                    <li>Temporal coverage (2021–2023 multi-year reanalysis)</li>
                    <li>Source datasets (Open-Meteo ERA5-Land, SRTM, OSM)</li>
                    <li>Modelling assumptions (baseline RUSLE parameters)</li>
                    <li>Absence of direct physical borehole / ground-station validation</li>
                  </ul>
                  <div className="tooltip-note">
                    Not a statistically validated confidence interval.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="verdict-main-heading">
            <span className="verdict-icon-wrap" style={{ color: theme.color }}>
              {theme.icon}
            </span>
            <span className="verdict-title-text">{verdict}</span>
          </div>

          <div className="verdict-sub-status">
            {subVerdict}
          </div>

          {/* Mandatory Truthful Disclaimer (Section 21) */}
          <div className="score-disclaimer-notice">
            <p className="disclaimer-text">
              <strong>Methodology Note:</strong> {disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
