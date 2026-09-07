import React from "react";
import { Compass, ArrowUp } from "lucide-react";

export default function Footer({ onScrollToTop }) {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-main-row">
          <div className="footer-brand-info">
            <div className="brand-group">
              <Compass size={18} strokeWidth={2.4} />
              <span className="brand-name">GEOSCREEN</span>
            </div>
            <p className="brand-tagline">Geospatial Renewable Intelligence</p>
          </div>

          <div className="footer-action-links">
            <button type="button" className="btn-back-to-top" onClick={onScrollToTop}>
              <ArrowUp size={13} strokeWidth={2.2} />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        {/* Mandatory Scientific Disclaimer (Section 51) */}
        <div className="footer-disclaimer-card">
          <p className="disclaimer-text">
            <strong>Preliminary Screening Notice:</strong> This assessment provides preliminary, model-based site screening.
            It does not replace detailed resource measurement, geotechnical investigation, environmental assessment or engineering feasibility studies.
          </p>
        </div>

        <div className="footer-bottom-bar">
          <span className="copy-text">
            © {new Date().getFullYear()} GEOSCREEN • Geospatial Renewable Intelligence
          </span>
          <span className="version-tag">
            ERA5-Land • USGS SRTM 30m • RUSLE • OpenStreetMap
          </span>
        </div>
      </div>
    </footer>
  );
}
