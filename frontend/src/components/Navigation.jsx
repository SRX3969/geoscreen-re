import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Compass, RotateCcw, ArrowRight, Menu, X } from "lucide-react";

export default function Navigation({ backendOnline, onNewAssessment }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAssessmentPage = location.pathname === "/assessment";

  const handleCtaClick = () => {
    if (isAssessmentPage && onNewAssessment) {
      onNewAssessment();
    } else {
      navigate("/assessment");
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="global-navbar-glass">
      <div className="nav-inner-container">
        {/* Brand */}
        <NavLink to="/" className="nav-brand" onClick={() => setMobileMenuOpen(false)}>
          <div className="nav-brand-mark">
            <Compass size={18} strokeWidth={2.4} />
          </div>
          <div className="nav-brand-text">
            <span className="nav-brand-title">GEOSCREEN</span>
            <span className="nav-brand-subtitle">Geospatial Renewable Intelligence</span>
          </div>
        </NavLink>

        {/* Desktop Nav Links */}
        <nav className="nav-links-desktop">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/assessment"
            className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
          >
            Assessment
          </NavLink>
          <NavLink
            to="/methodology"
            className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
          >
            Methodology
          </NavLink>
          <NavLink
            to="/data-sources"
            className={({ isActive }) => `nav-link-item ${isActive ? "active" : ""}`}
          >
            Data Sources
          </NavLink>
        </nav>

        {/* Right CTA & System Status */}
        <div className="nav-actions-desktop">
          <div className="status-indicator-pill" title="Backend calculation engine status">
            <span
              className={`status-dot ${
                backendOnline === true
                  ? "dot-ready"
                  : backendOnline === false
                  ? "dot-offline"
                  : "dot-connecting"
              }`}
            ></span>
            <span className="status-label">
              {backendOnline === true ? "System Ready" : backendOnline === false ? "System Offline" : "Connecting..."}
            </span>
          </div>

          <button
            type="button"
            className={`btn-nav-primary ${isAssessmentPage ? "btn-nav-reset" : ""}`}
            onClick={handleCtaClick}
          >
            {isAssessmentPage ? (
              <>
                <RotateCcw size={13} strokeWidth={2.2} />
                <span>New Assessment</span>
              </>
            ) : (
              <>
                <span>Start Assessment</span>
                <ArrowRight size={13} strokeWidth={2.2} />
              </>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/assessment"
            className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Assessment
          </NavLink>
          <NavLink
            to="/methodology"
            className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Methodology
          </NavLink>
          <NavLink
            to="/data-sources"
            className={({ isActive }) => `mobile-nav-item ${isActive ? "active" : ""}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Data Sources
          </NavLink>
          <div className="mobile-drawer-cta">
            <button
              type="button"
              className="btn-nav-primary w-full"
              onClick={handleCtaClick}
            >
              {isAssessmentPage ? "New Assessment" : "Start Assessment →"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
