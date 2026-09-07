import React from "react";
import { Table, Database, AlertCircle } from "lucide-react";

export default function SiteParametersTable({ result }) {
  if (!result) return null;

  const params = result.site_parameters || [];
  const soil = result.soil || {};

  return (
    <section className="site-parameters-section">
      <div className="section-title-wrap">
        <span className="section-eyebrow">PHYSICAL & PEDOLOGICAL INDICATORS</span>
        <h3 className="section-heading">Site Parameters & RUSLE Model Factors</h3>
      </div>

      <div className="params-table-card">
        {/* Technical Grid (Section 35) */}
        <div className="params-grid">
          {params.map((item, idx) => (
            <div key={idx} className="param-grid-item">
              <div className="param-meta-line">
                <span className="param-name">{item.name}</span>
                <span className="param-unit-tag">{item.unit}</span>
              </div>
              <div className="param-value-line">
                <span className="param-number">{item.value}</span>
              </div>
              <div className="param-source-line">
                {item.source}
              </div>
            </div>
          ))}
        </div>

        {/* Explicit RUSLE P-Factor & Modeling Notice (Section 28) */}
        <div className="rusle-model-callout">
          <div className="callout-header">
            <AlertCircle size={14} className="callout-icon" />
            <strong className="callout-title">RUSLE Physical Soil Equation Specification:</strong>
            <code className="rusle-equation">A = R × K × LS × C × P</code>
          </div>
          <p className="callout-desc">
            <strong>Modeled soil-loss estimate:</strong> Soil erosion is computed using multi-year rainfall erosivity (R),
            regional soil granulometry erodibility (K), 30m SRTM digital elevation slope gradient (LS), and canopy cover factor (C).
            Support practice factor <strong>P = 1.00</strong> is applied under the documented assumption:
            <em> "No site-specific conservation practice or terracing data provided (baseline unmanaged state assumed)."</em>
          </p>
        </div>
      </div>
    </section>
  );
}
