import React from "react";
import { Compass, RotateCcw } from "lucide-react";

export default function Header({ backendOnline, onNewAssessment, onNavigate }) {
  return (
    <header className="site-header">
      <div className="header-container">
        {/* Brand */}
        <div className="header-brand">
          <div className="brand-mark">
            <Compass size={18} strokeWidth={2.4} />
          </div>
          <div className="brand-text">
            <span className="brand-title">GEOSCREEN</span>
            <span className="brand-subtitle">Geospatial Renewable Intelligence</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="header-nav">
          <button
            type="button"
            className="nav-item"
            onClick={() => onNavigate("assessment")}
          >
            Assessment
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={() => onNavigate("methodology")}
          >
            Methodology
          </button>
          <button
            type="button"
            className="nav-item"
            onClick={() => onNavigate("data-sources")}
          >
            Data Sources
          </button>
        </nav>

        {/* Right Status & Actions */}
        <div className="header-actions">
          <div className="status-indicator">
            <span
              className={`status-dot ${
                backendOnline === true
                  ? "dot-ready"
                  : backendOnline === false
                  ? "dot-offline"
                  : "dot-connecting"
              }`}
            ></span>
            <span className="status-text">
              {backendOnline === true
                ? "System Ready"
                : backendOnline === false
                ? "System Offline"
                : "Connecting..."}
            </span>
          </div>

          <button
            type="button"
            className="btn-new-assessment"
            onClick={onNewAssessment}
            title="Start a new site assessment"
          >
            <RotateCcw size={13} strokeWidth={2.2} />
            <span>New Assessment</span>
          </button>
        </div>
      </div>
    </header>
  );
}
