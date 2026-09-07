import React from "react";

export default function AssessmentBreakdown({ result }) {
  if (!result) return null;

  const { energy, soil, installation_type } = result;

  // Derive normalized scores 0-100 for each dimension
  const solarScore = Math.min(100, Math.round((energy.solar.ghi_avg / 500) * 100));
  const windScore = Math.min(100, Math.round((energy.wind.wind_avg / 9.0) * 100));
  
  // Soil retention: 0 loss = 100 score, 20 loss = 0 score
  const soilLoss = soil.soil_loss || 2.0;
  const soilRetentionScore = Math.max(10, Math.min(100, Math.round(100 - (soilLoss / 20.0) * 80)));
  
  // Topography stability based on slope (lower slope = higher stability score)
  const slope = soil.slope_percent || 1.0;
  const topoScore = Math.max(15, Math.min(100, Math.round(100 - (slope / 15.0) * 70)));

  // Thermal derating score (25C is 100, 45C is 50)
  const temp = energy.temperature.avg || 28;
  const thermalScore = Math.max(20, Math.min(100, Math.round(100 - Math.max(0, temp - 20) * 3)));

  const dimensions = [
    {
      name: "Solar Irradiance Resource",
      desc: "Global Horizontal Irradiance (GHI) intensity & diurnal availability",
      score: solarScore,
      value: `${energy.solar.ghi_avg} W/m²`,
      status: energy.solar.suitable ? "High Yield" : "Moderate",
      barClass: "bar-solar"
    },
    {
      name: "Wind Velocity Potential",
      desc: "Anemometer velocity at hub height and kinematic energy density",
      score: windScore,
      value: `${energy.wind.wind_avg} m/s`,
      status: energy.wind.suitable ? "Turbine Viable" : "Low Density",
      barClass: "bar-wind"
    },
    {
      name: "Soil Loss Retention Index",
      desc: "RUSLE physical soil loss resistance and foundation longevity",
      score: soilRetentionScore,
      value: `${soil.soil_loss} t/ha/yr`,
      status: soil.risk === "Low" ? "High Retention" : `${soil.risk} Risk`,
      barClass: "bar-soil"
    },
    {
      name: "Topographic Slope Stability",
      desc: "Digital elevation model gradient and civil earthwork requirements",
      score: topoScore,
      value: `${soil.slope_percent || 0.8}% Grade`,
      status: (soil.slope_percent || 0.8) < 5 ? "Minimal Grading" : "Steep Gradient",
      barClass: "bar-topo"
    },
    {
      name: "Photovoltaic Thermal Index",
      desc: "Ambient operating temperature efficiency and heat dissipation",
      score: thermalScore,
      value: `${energy.temperature.avg}°C Mean`,
      status: temp < 30 ? "Optimal Range" : "Derating Expected",
      barClass: "bar-thermal"
    }
  ];

  return (
    <div className="assessment-breakdown-card">
      <div className="breakdown-header-wrap">
        <div>
          <span className="section-label">DIMENSIONAL SYNTHESIS</span>
          <h3 className="section-heading">Multi-Criteria Feasibility Matrix</h3>
        </div>
        <div className="tech-badge-tag">
          Active Evaluation: <strong>{installation_type.toUpperCase()}</strong>
        </div>
      </div>

      <div className="dimensions-list">
        {dimensions.map((dim, idx) => (
          <div key={idx} className="dimension-row">
            <div className="dimension-info">
              <div className="dimension-name-wrap">
                <strong className="dim-name">{dim.name}</strong>
                <span className="dim-value">{dim.value}</span>
              </div>
              <p className="dim-desc">{dim.desc}</p>
            </div>

            <div className="dimension-visual">
              <div className="dim-bar-track">
                <div
                  className={`dim-bar-fill ${dim.barClass}`}
                  style={{ width: `${dim.score}%` }}
                ></div>
              </div>
              <div className="dim-score-badge">
                <span className="dim-score-num">{dim.score}%</span>
                <span className="dim-status-tag">{dim.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
