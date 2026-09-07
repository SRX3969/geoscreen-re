import React from "react";

export default function CriteriaMatrix({ result }) {
  if (!result) return null;

  const matrix = result.criteria_matrix || [
    {
      factor: "Modeled Shortwave Radiation (GHI Proxy)",
      value: `${result.energy?.solar?.ghi_proxy_avg || 0} W/m²`,
      score: 75,
      weight: "70%",
      classification: "Suitable",
      status: "success"
    },
    {
      factor: "10 m Wind Speed",
      value: `${result.energy?.wind?.wind_avg_10m || 0} m/s`,
      score: 60,
      weight: "0%",
      classification: "Moderate",
      status: "muted"
    },
    {
      factor: "Modeled Soil Loss Risk (RUSLE)",
      value: `${result.soil?.soil_loss || 0} t/ha/yr`,
      score: 85,
      weight: "20%",
      classification: "Low Risk",
      status: "success"
    },
    {
      factor: "Topographic Slope Gradient",
      value: `${result.soil?.slope_degrees || 0}°`,
      score: 90,
      weight: "10%",
      classification: "Gentle",
      status: "success"
    }
  ];

  return (
    <section className="criteria-matrix-section">
      <div className="section-title-wrap">
        <span className="section-eyebrow">SCREENING CRITERIA SYNTHESIS</span>
        <h3 className="section-heading">Multi-Criteria Analysis</h3>
      </div>

      <div className="matrix-table-card">
        <div className="matrix-table-header">
          <div className="col-factor">Factor</div>
          <div className="col-value">Observed / Modeled</div>
          <div className="col-weight">Weight</div>
          <div className="col-score">Score</div>
          <div className="col-class">Classification</div>
        </div>

        <div className="matrix-rows-list">
          {matrix.map((row, idx) => (
            <div key={idx} className="matrix-row">
              <div className="col-factor">
                <span className="factor-name">{row.factor}</span>
              </div>

              <div className="col-value">
                <span className="factor-val-text">{row.value}</span>
              </div>

              <div className="col-weight">
                <span className="factor-weight-pill">{row.weight}</span>
              </div>

              <div className="col-score">
                <div className="matrix-score-bar-wrapper">
                  <div className="score-number-label">{row.score}</div>
                  <div className="score-track">
                    <div
                      className={`score-fill fill-${row.status || "success"}`}
                      style={{ width: `${Math.min(100, Math.max(5, row.score))}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="col-class">
                <span className={`matrix-class-pill class-${row.status || "neutral"}`}>
                  {row.classification}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
