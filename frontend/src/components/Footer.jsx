import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="global-site-footer">
      <div className="footer-inner-container">
        <div className="footer-top-brand-row">
          <div className="footer-brand-group">
            <div className="footer-brand-title">
              <Compass size={16} strokeWidth={2.4} />
              <span>GEOSCREEN</span>
            </div>
            <p className="footer-brand-subtitle">Geospatial Renewable Intelligence</p>
          </div>

          <nav className="footer-nav-links">
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/assessment" className="footer-link">Assessment</Link>
            <Link to="/methodology" className="footer-link">Methodology</Link>
            <Link to="/data-sources" className="footer-link">Data Sources</Link>
          </nav>
        </div>

        <div className="footer-bottom-notice-row">
          <p className="footer-disclaimer-notice">
            Preliminary model-based site screening. Does not replace on-site pyranometry/anemometry,
            geotechnical investigation, or environmental impact assessments.
          </p>
          <span className="footer-copy-text">
            © {new Date().getFullYear()} GEOSCREEN. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
