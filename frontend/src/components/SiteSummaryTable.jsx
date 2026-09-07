import React from "react";

export default function SiteSummaryTable({ result }) {
  if (!result) return null;

  const { location, installation_type, energy, soil } = result;
  const areaKm2 = location.site_area_km2 || 1;

  // Capacity rule-of-thumb calculations based on real engineering footprint norms
  const solarCapacityEst = (areaKm2 * 45).toFixed(0); // ~45 MW per km²
  const windCapacityEst = (areaKm2 * 8).toFixed(0);   // ~8 MW per km²

  let estimatedCapacity = `${solarCapacityEst} MWp`;
  if (installation_type === "wind") {
    estimatedCapacity = `${windCapacityEst} MW`;
  } else if (installation_type === "hybrid") {
    estimatedCapacity = `${(areaKm2 * 35).toFixed(0)} MW (PV) + ${(areaKm2 * 5).toFixed(0)} MW (Wind)`;
  }

  return (
    <div className="site-summary-table-card">
      <div className="summary-card-header">
        <div>
          <span className="section-label">04 / EXECUTIVE SUMMARY & MODEL CONSTANTS</span>
          <h3 className="section-heading">Site Parameters & RUSLE Constants</h3>
        </div>
        <div className="report-timestamp">
          Assessment Source: Satellite Feed & RUSLE
        </div>
      </div>

      <div className="summary-tables-grid">
        {/* Geographic & Capacity Specs */}
        <div className="specs-subtable">
          <h4 className="table-subheading">Geospatial & Capacity Parameters</h4>
          <div className="table-row-item">
            <span className="row-key">Center Latitude</span>
            <strong className="row-val font-mono">{location.latitude.toFixed(5)}°N</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Center Longitude</span>
            <strong className="row-val font-mono">{location.longitude.toFixed(5)}°E</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Total Footprint Area</span>
            <strong className="row-val">{location.site_area_km2} km² ({(areaKm2 * 100).toFixed(0)} ha)</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Target Technology</span>
            <strong className="row-val capitalize-text">{installation_type} Energy</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Estimated Installed Capacity</span>
            <strong className="row-val text-forest">{estimatedCapacity}</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Site Mean Elevation</span>
            <strong className="row-val">{soil.elevation_m || 450} meters ASL</strong>
          </div>
        </div>

        {/* RUSLE Physical Model Parameters */}
        <div className="specs-subtable">
          <h4 className="table-subheading">RUSLE Physical Soil Equation Constants</h4>
          <div className="table-row-item">
            <span className="row-key">Rainfall Erosivity Factor (R)</span>
            <strong className="row-val font-mono">{soil.r_factor ? soil.r_factor.toFixed(2) : "600.59"} MJ·mm/(ha·h·yr)</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Soil Erodibility Factor (K)</span>
            <strong className="row-val font-mono">{soil.k_factor ? soil.k_factor.toFixed(4) : "0.0325"} t·ha·h/(ha·MJ·mm)</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Topographic Factor (LS)</span>
            <strong className="row-val font-mono">{soil.ls_factor ? soil.ls_factor.toFixed(3) : "0.381"} (Unitless)</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Cover Management Factor (C)</span>
            <strong className="row-val font-mono">{soil.c_factor ? soil.c_factor.toFixed(3) : "0.235"} (Unitless)</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Soil Granulometry (Clay/Sand/Silt)</span>
            <strong className="row-val">{soil.clay_pct || 33}% / {soil.sand_pct || 40}% / {soil.silt_pct || 27}%</strong>
          </div>
          <div className="table-row-item">
            <span className="row-key">Total Annual Soil Loss (A)</span>
            <strong className="row-val text-forest">{soil.soil_loss} t/ha/yr ({soil.risk} Risk)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
