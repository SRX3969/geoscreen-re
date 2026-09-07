import React from "react";

export default function Navbar({ backendOnline, onOpenMethodology, onScrollToAssessment }) {
  return (
    <header className="site-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-title">
              GeoScreen <span>RE</span>
            </div>
            <div className="brand-subtitle">Geospatial Renewable Intelligence</div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="navbar-links">
          <a href="#overview" className="nav-link" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            Overview
          </a>
          <a href="#workspace" className="nav-link" onClick={(e) => { e.preventDefault(); onScrollToAssessment(); }}>
            Workspace
          </a>
          <button type="button" className="nav-link nav-btn-link" onClick={onOpenMethodology}>
            Methodology & RUSLE
          </button>
        </nav>

        {/* Status indicator & Actions */}
        <div className="navbar-right">
          <div className={`system-status ${backendOnline === true ? "status-online" : backendOnline === false ? "status-offline" : "status-connecting"}`}>
            <span className="status-pulse-dot"></span>
            <span className="status-label">
              {backendOnline === true ? "Engine Connected" : backendOnline === false ? "Engine Offline" : "Connecting..."}
            </span>
          </div>

          <button
            type="button"
            className="navbar-action-btn"
            onClick={onScrollToAssessment}
          >
            New Assessment
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
