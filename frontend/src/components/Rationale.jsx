import React from "react";
import { CheckCircle2, ShieldCheck, Wrench } from "lucide-react";

export default function Rationale({ result }) {
  if (!result) return null;

  const findings = result.key_findings || [];
  const recommendation = result.recommendation;

  return (
    <section className="rationale-section">
      <div className="section-title-wrap">
        <span className="section-eyebrow">DECISION ENGINE SYNTHESIS</span>
        <h3 className="section-heading">Rationale & Engineering Recommendations</h3>
      </div>

      <div className="rationale-grid">
        {/* KEY FINDINGS (01, 02, 03) */}
        <div className="findings-card">
          <div className="card-top-header">
            <span className="findings-badge">OBSERVATIONAL SYNTHESIS</span>
            <h4 className="findings-title">KEY FINDINGS</h4>
          </div>

          <div className="findings-items-list">
            {findings.map((item, idx) => (
              <div key={idx} className="finding-item">
                <div className="finding-number">{item.num}</div>
                <div className="finding-body">
                  <strong className="finding-summary">{item.summary || item.title}</strong>
                  <p className="finding-text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ENGINEERING RECOMMENDATION */}
        <div className="recommendation-card">
          <div className="card-top-header">
            <span className="recommendation-badge">
              <Wrench size={12} strokeWidth={2.2} />
              ENGINEERING DIRECTIVE
            </span>
            <h4 className="recommendation-title">Site Recommendation</h4>
          </div>

          <div className="recommendation-content">
            <p className="recommendation-text">{recommendation}</p>

            <div className="actionable-checklist">
              <div className="checklist-item">
                <ShieldCheck size={16} className="check-icon" />
                <span>Micro-siting and on-site met mast calibration recommended prior to turbine procurement.</span>
              </div>
              <div className="checklist-item">
                <ShieldCheck size={16} className="check-icon" />
                <span>Geotechnical borehole sampling required to confirm bedrock depth and driven pile embedment criteria.</span>
              </div>
              <div className="checklist-item">
                <ShieldCheck size={16} className="check-icon" />
                <span>Stormwater drainage channel design must accommodate multi-year peak rainfall events to prevent foundation scouring.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
