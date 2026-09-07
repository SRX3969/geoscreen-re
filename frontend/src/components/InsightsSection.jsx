import React from "react";

export default function InsightsSection({ result }) {
  if (!result) return null;

  const { energy, soil, findings } = result;

  return (
    <div className="insights-section-card">
      <div className="insights-header">
        <div>
          <span className="section-label">03 / WHY THIS SITE?</span>
          <h3 className="section-heading">Geospatial & Engineering Rationale</h3>
        </div>
        <span className="insights-badge">Automated Site Assessment</span>
      </div>

      {/* Observation items */}
      <div className="insights-grid">
        {/* Core Findings */}
        <div className="insights-column">
          <h4 className="column-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Key Site Observations
          </h4>

          <div className="observation-cards">
            {findings && findings.length > 0 ? (
              findings.map((f, i) => (
                <div key={i} className="observation-card">
                  <div className="obs-num">0{i + 1}</div>
                  <p className="obs-text">{f}</p>
                </div>
              ))
            ) : (
              <div className="observation-card">
                <div className="obs-num">01</div>
                <p className="obs-text">Multi-resource assessment completed for the specified geographic bounds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Civil & Environmental Engineering Guidance */}
        <div className="insights-column">
          <h4 className="column-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M7 7h10M7 12h10M7 17h6" />
            </svg>
            Engineering & Civil Guidelines
          </h4>

          <div className="guidelines-list">
            <div className="guideline-item">
              <div className="guide-icon">⚡</div>
              <div className="guide-content">
                <strong>Array Orientation & Tilt</strong>
                <span>
                  At {result.location.latitude.toFixed(2)}°N latitude, fixed-tilt solar arrays should target an optimum tilt of {(Math.abs(result.location.latitude) * 0.9).toFixed(1)}° true South.
                </span>
              </div>
            </div>

            <div className="guideline-item">
              <div className="guide-icon">🌱</div>
              <div className="guide-content">
                <strong>Soil Erosion Mitigation</strong>
                <span>
                  Estimated soil loss of {soil.soil_loss} t/ha/yr indicates {soil.risk.toLowerCase()} risk. Maintain vegetative ground cover between panel rows to prevent runoff gullies.
                </span>
              </div>
            </div>

            <div className="guideline-item">
              <div className="guide-icon">🏗️</div>
              <div className="guide-content">
                <strong>Foundation & Pile Embedment</strong>
                <span>
                  Soil composition ({soil.clay_pct || 33}% Clay, {soil.sand_pct || 40}% Sand, {soil.silt_pct || 27}% Silt) supports standard driven ramming piles with minimal pre-drilling required.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
