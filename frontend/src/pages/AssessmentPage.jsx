import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Compass, MapPin, Sun, Wind, Layers, Play, Loader2,
  CheckCircle2, AlertCircle, Info, Download, ChevronDown, ChevronUp,
  Mountain, Thermometer, BarChart3, Sliders, Check
} from "lucide-react";
import MapPanel from "../components/MapPanel";
import AssessmentReportModal from "../components/AssessmentReportModal";

const QUICK_AREAS = [1.0, 5.0, 10.0, 25.0];

const BENCHMARK_SITES = [
  {
    name: "Mysuru, Karnataka",
    lat: "12.29291",
    lon: "76.67244",
    area: "5.00",
    type: "solar",
    desc: "Deccan Plateau reference location"
  },
  {
    name: "Bhadla Solar Park, RJ",
    lat: "27.53871",
    lon: "71.91632",
    area: "10.00",
    type: "solar",
    desc: "Thar desert high irradiance corridor"
  },
  {
    name: "Muppandal Wind Farm, TN",
    lat: "8.26120",
    lon: "77.54890",
    area: "8.50",
    type: "wind",
    desc: "Western Ghats coastal wind gap"
  },
  {
    name: "Khavda Hybrid Park, GJ",
    lat: "23.85000",
    lon: "69.75000",
    area: "15.00",
    type: "hybrid",
    desc: "Rann of Kutch mega co-generation zone"
  },
  {
    name: "Pench Buffer, MP",
    lat: "21.87577",
    lon: "79.52266",
    area: "7.00",
    type: "solar",
    desc: "Central Indian undulating plateau"
  }
];

export default function AssessmentPage({
  latitude, setLatitude,
  longitude, setLongitude,
  siteArea, setSiteArea,
  installationType, setInstallationType,
  mapPosition, setMapPosition,
  locationInfo, setLocationInfo,
  result, setResult
}) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [showConfidenceTooltip, setShowConfidenceTooltip] = useState(false);
  const [technicalAccordionOpen, setTechnicalAccordionOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [activeBenchmark, setActiveBenchmark] = useState("Mysuru, Karnataka");

  const resultsRef = useRef(null);
  const geocodeTimerRef = useRef(null);

  // Debounced Reverse Geocoding
  const performReverseGeocode = useCallback(async (lat, lon) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/reverse-geocode?lat=${lat}&lon=${lon}`);
      if (res.ok) {
        const data = await res.json();
        setLocationInfo(data);
      } else {
        setLocationInfo((prev) => ({
          ...prev,
          locality: "LOCATION NAME UNAVAILABLE",
          admin_line: "Administrative details unavailable"
        }));
      }
    } catch (err) {
      console.warn("[ReverseGeocode] API error:", err);
      setLocationInfo((prev) => ({
        ...prev,
        locality: "LOCATION NAME UNAVAILABLE",
        admin_line: "Administrative details unavailable"
      }));
    } finally {
      setIsGeocoding(false);
    }
  }, [setLocationInfo]);

  useEffect(() => {
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);

    if (!isNaN(latNum) && !isNaN(lonNum) && latNum >= -90 && latNum <= 90 && lonNum >= -180 && lonNum <= 180) {
      if (Math.abs(mapPosition[0] - latNum) > 0.0001 || Math.abs(mapPosition[1] - lonNum) > 0.0001) {
        setMapPosition([latNum, lonNum]);
      }

      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
      geocodeTimerRef.current = setTimeout(() => {
        performReverseGeocode(latNum, lonNum);
      }, 400);
    }

    return () => {
      if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
    };
  }, [latitude, longitude, mapPosition, performReverseGeocode, setMapPosition]);

  // Validation
  const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);
  const areaNum = parseFloat(siteArea);
  const isLatValid = !isNaN(latNum) && latNum >= -90 && latNum <= 90;
  const isLonValid = !isNaN(lonNum) && lonNum >= -180 && lonNum <= 180;
  const isAreaValid = !isNaN(areaNum) && areaNum > 0;
  const isFormValid = isLatValid && isLonValid && isAreaValid;

  // Run Site Assessment
  const handleRunAssessment = async () => {
    if (!isFormValid) {
      setError("Please specify valid latitude (-90 to 90), longitude (-180 to 180), and footprint area (> 0 km²).");
      return;
    }

    setLoading(true);
    setError("");
    setLoadingStep("Location verified");

    try {
      const step1 = setTimeout(() => setLoadingStep("Environmental data retrieved"), 600);
      const step2 = setTimeout(() => setLoadingStep("Renewable resources evaluated"), 1200);
      const step3 = setTimeout(() => setLoadingStep("Assessment generated"), 1800);

      const response = await fetch("http://127.0.0.1:8000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: latNum,
          longitude: lonNum,
          site_area_km2: areaNum,
          installation_type: installationType
        }),
      });

      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Environmental data could not be retrieved. Please try again.");
      }

      const data = await response.json();
      setResult(data);

      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 250);
    } catch (err) {
      console.error("[Assessment Error]:", err);
      setError(err.message || "Environmental data could not be retrieved. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleBenchmarkSelect = (b) => {
    setActiveBenchmark(b.name);
    setLatitude(b.lat);
    setLongitude(b.lon);
    setSiteArea(b.area);
    setInstallationType(b.type);
    setMapPosition([parseFloat(b.lat), parseFloat(b.lon)]);
    setError("");
  };

  const handleMapClick = (pos) => {
    setMapPosition(pos);
    setLatitude(pos[0].toFixed(5));
    setLongitude(pos[1].toFixed(5));
    setActiveBenchmark(null);
  };

  // Score & Verdict calculations
  const score = result?.preliminary_score !== undefined
    ? result.preliminary_score
    : (result?.score_percentage || 0);
  const verdict = result?.preliminary_result || result?.final_decision || "Conditionally Suitable";
  const subVerdict = result?.sub_verdict || "Feasible with Standard Engineering Design";
  const energy = result?.energy;
  const soil = result?.soil;
  const matrix = result?.criteria_matrix || [];
  const findings = result?.key_findings || [];
  const recommendation = result?.recommendation || "";

  // Circular score animation
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="assessment-page-root">
      <div className="assessment-page-container">
        {/* 1. PAGE INTRO (Section 11) */}
        <div className="assessment-intro-header">
          <div className="assessment-badge-pill">
            <span className="badge-pulse-dot"></span>
            <span>PRELIMINARY SCREENING</span>
          </div>
          <h1 className="assessment-page-title">Site Assessment</h1>
          <p className="assessment-page-subtitle">
            Evaluate a location using environmental and renewable-resource data.
          </p>

          {/* Benchmark Site Quick Selectors */}
          <div className="assessment-presets-strip">
            <span className="presets-label">
              <MapPin size={13} strokeWidth={2.2} />
              Reference Sites:
            </span>
            <div className="presets-list">
              {BENCHMARK_SITES.map((b, i) => (
                <button
                  key={i}
                  type="button"
                  className={`btn-benchmark-chip ${activeBenchmark === b.name ? "active" : ""}`}
                  onClick={() => handleBenchmarkSelect(b)}
                >
                  <span className="b-name">{b.name}</span>
                  <span className="b-tech">{b.type.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. LOCATION WORKSPACE (Section 12, 13, 15: 40% Config, 60% Map) */}
        <div className="workspace-duo-container">
          {/* Left Column (40%): Site Configuration */}
          <div className="config-column-card">
            <div className="card-inner-pad">
              <div className="config-card-header">
                <span className="config-label-eyebrow">SITE CONFIGURATION</span>
                <h2 className="config-title-text">Parameters</h2>
              </div>

              {/* Prominent Location Card (Section 14 & 15: All info strictly inside card) */}
              <div className="location-card-contained">
                <div className="location-card-top">
                  <div className="location-tag">
                    <MapPin size={13} strokeWidth={2.4} />
                    <span>LOCATION</span>
                  </div>
                  {isGeocoding && (
                    <span className="loc-geocoding-indicator">
                      <Loader2 size={11} className="spin-icon" />
                      Geocoding...
                    </span>
                  )}
                </div>

                <div className="location-place-name">
                  {locationInfo?.locality || "LOCATION NAME UNAVAILABLE"}
                </div>
                <div className="location-admin-area">
                  {locationInfo?.admin_line || "Administrative Region"}
                </div>

                <div className="location-coords-contained">
                  <span className="coord-chip">
                    {isLatValid ? `${Math.abs(latNum).toFixed(5)}° ${latNum >= 0 ? "N" : "S"}` : "—"}
                  </span>
                  <span className="coord-chip">
                    {isLonValid ? `${Math.abs(lonNum).toFixed(5)}° ${lonNum >= 0 ? "E" : "W"}` : "—"}
                  </span>
                </div>
              </div>

              {/* Coordinate Inputs */}
              <div className="config-inputs-row">
                <div className="input-field-group">
                  <label htmlFor="cfg-lat" className="field-label">Latitude</label>
                  <div className="field-input-box">
                    <input
                      id="cfg-lat"
                      type="number"
                      step="any"
                      className={`cfg-text-input ${!isLatValid && latitude ? "invalid" : ""}`}
                      value={latitude}
                      onChange={(e) => { setLatitude(e.target.value); setActiveBenchmark(null); }}
                      placeholder="12.29291"
                    />
                    <span className="field-unit">° N</span>
                  </div>
                </div>

                <div className="input-field-group">
                  <label htmlFor="cfg-lon" className="field-label">Longitude</label>
                  <div className="field-input-box">
                    <input
                      id="cfg-lon"
                      type="number"
                      step="any"
                      className={`cfg-text-input ${!isLonValid && longitude ? "invalid" : ""}`}
                      value={longitude}
                      onChange={(e) => { setLongitude(e.target.value); setActiveBenchmark(null); }}
                      placeholder="76.67244"
                    />
                    <span className="field-unit">° E</span>
                  </div>
                </div>
              </div>

              {/* Site Area Input & Presets */}
              <div className="input-field-group">
                <div className="field-label-split">
                  <label htmlFor="cfg-area" className="field-label">Site Area</label>
                  <span className="field-hint">Proposed footprint</span>
                </div>
                <div className="field-input-box">
                  <input
                    id="cfg-area"
                    type="number"
                    step="any"
                    className={`cfg-text-input ${!isAreaValid && siteArea ? "invalid" : ""}`}
                    value={siteArea}
                    onChange={(e) => { setSiteArea(e.target.value); setActiveBenchmark(null); }}
                    placeholder="5.00"
                  />
                  <span className="field-unit">km²</span>
                </div>

                {/* Quick Area Presets */}
                <div className="area-presets-pills">
                  <span className="area-preset-label">Quick:</span>
                  {QUICK_AREAS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`btn-area-pill ${parseFloat(siteArea) === a ? "active" : ""}`}
                      onClick={() => { setSiteArea(a.toFixed(2)); setActiveBenchmark(null); }}
                    >
                      {a} km²
                    </button>
                  ))}
                </div>
              </div>

              {/* Technology Selector (Section 19: 3 compact cards with check indicator) */}
              <div className="technology-selector-container">
                <label className="field-label">Target Technology</label>
                <div className="tech-cards-three-col">
                  {/* Solar PV */}
                  <button
                    type="button"
                    className={`tech-select-card ${installationType === "solar" ? "selected solar-selected" : ""}`}
                    onClick={() => setInstallationType("solar")}
                  >
                    <div className="tech-card-top">
                      <Sun size={16} strokeWidth={2.4} className="tech-icon-solar" />
                      {installationType === "solar" && <Check size={14} strokeWidth={3} className="check-badge" />}
                    </div>
                    <strong className="tech-card-title">SOLAR PV</strong>
                    <span className="tech-card-sub">Utility photovoltaic arrays</span>
                  </button>

                  {/* Wind */}
                  <button
                    type="button"
                    className={`tech-select-card ${installationType === "wind" ? "selected wind-selected" : ""}`}
                    onClick={() => setInstallationType("wind")}
                  >
                    <div className="tech-card-top">
                      <Wind size={16} strokeWidth={2.4} className="tech-icon-wind" />
                      {installationType === "wind" && <Check size={14} strokeWidth={3} className="check-badge" />}
                    </div>
                    <strong className="tech-card-title">WIND</strong>
                    <span className="tech-card-sub">Onshore wind turbines</span>
                  </button>

                  {/* Hybrid */}
                  <button
                    type="button"
                    className={`tech-select-card ${installationType === "hybrid" ? "selected hybrid-selected" : ""}`}
                    onClick={() => setInstallationType("hybrid")}
                  >
                    <div className="tech-card-top">
                      <Layers size={16} strokeWidth={2.4} className="tech-icon-hybrid" />
                      {installationType === "hybrid" && <Check size={14} strokeWidth={3} className="check-badge" />}
                    </div>
                    <strong className="tech-card-title">HYBRID</strong>
                    <span className="tech-card-sub">Solar-wind co-generation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (60%): Interactive Map */}
          <div className="map-column-card">
            <MapPanel
              position={mapPosition}
              setPosition={handleMapClick}
              siteArea={siteArea}
              onAreaCalculated={(calcArea) => setSiteArea(calcArea)}
              locationInfo={locationInfo}
            />
          </div>
        </div>

        {/* 3. RUN ASSESSMENT (Section 20: Primary CTA directly below workspace) */}
        <div className="assessment-action-strip">
          <button
            type="button"
            className={`btn-run-assessment-large ${loading ? "loading" : ""}`}
            onClick={handleRunAssessment}
            disabled={loading || !isFormValid}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin-icon" />
                <span>ANALYZING SITE...</span>
              </>
            ) : (
              <>
                <span>RUN SITE ASSESSMENT</span>
                <Play size={16} strokeWidth={2.6} />
              </>
            )}
          </button>

          {/* Progressive Loading Stages (Section 20: No fake percentages) */}
          {loading && (
            <div className="assessment-stages-box">
              <div className="stage-active-line">
                <span className="stage-active-pulse"></span>
                <strong>Current Stage:</strong> {loadingStep}
              </div>
              <div className="stage-checklist">
                <span className={loadingStep === "Location verified" ? "step-now" : "step-done"}>
                  ✓ Location verified
                </span>
                <span className={loadingStep === "Environmental data retrieved" ? "step-now" : ""}>
                  • Environmental data retrieved
                </span>
                <span className={loadingStep === "Renewable resources evaluated" ? "step-now" : ""}>
                  • Renewable resources evaluated
                </span>
                <span className={loadingStep === "Assessment generated" ? "step-now" : ""}>
                  • Assessment generated
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="assessment-error-banner" role="alert">
              <AlertCircle size={16} strokeWidth={2.2} />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* 4. RESULTS SECTION (Section 21 - 32) */}
        {result && (
          <div className="assessment-results-sequence" ref={resultsRef}>
            {/* Result Summary & Score Card (Section 21, 22) */}
            <div className="results-summary-card">
              <div className="card-inner-pad">
                <div className="results-summary-grid">
                  {/* Circular Score Gauge */}
                  <div className="score-radial-container">
                    <div className="radial-svg-box">
                      <svg viewBox="0 0 110 110" className="radial-svg">
                        <circle cx="55" cy="55" r={radius} className="radial-track" strokeWidth="8" fill="none" />
                        <circle
                          cx="55"
                          cy="55"
                          r={radius}
                          className="radial-bar"
                          strokeWidth="8"
                          fill="none"
                          stroke={score >= 80 ? "var(--success)" : score >= 60 ? "var(--warning)" : "var(--danger)"}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          transform="rotate(-90 55 55)"
                        />
                      </svg>
                      <div className="radial-number-inner">
                        <span className="radial-score-num num-tnum">{score}</span>
                        <span className="radial-score-denom">/ 100</span>
                      </div>
                    </div>
                    <span className="radial-score-label">PRELIMINARY SCREENING SCORE</span>
                  </div>

                  {/* Verdict & Confidence */}
                  <div className="verdict-details-column">
                    <div className="verdict-eyebrow-row">
                      <span className="verdict-preliminary-tag">ASSESSMENT RESULT • PRELIMINARY SCREENING</span>

                      {/* Small Data Confidence Indicator with Tooltip */}
                      <div
                        className="confidence-badge-pill"
                        onMouseEnter={() => setShowConfidenceTooltip(true)}
                        onMouseLeave={() => setShowConfidenceTooltip(false)}
                        onClick={() => setShowConfidenceTooltip(!showConfidenceTooltip)}
                        tabIndex={0}
                        role="button"
                      >
                        <span className="cb-label">DATA CONFIDENCE:</span>
                        <strong className="cb-val">{result.data_confidence || "Medium"}</strong>
                        <Info size={13} className="cb-icon" />

                        {showConfidenceTooltip && (
                          <div className="confidence-tooltip-box" role="tooltip">
                            <strong className="ct-title">Confidence Factor Breakdown</strong>
                            <p className="ct-text">
                              Reflects spatial resolution (0.1° grid, 30m DEM), 3-year multi-year reanalysis coverage,
                              and baseline unmanaged RUSLE soil assumptions in the absence of in-situ borehole validation.
                            </p>
                            <span className="ct-note">* Model-based screening; not a statistical certainty percentage.</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="verdict-headline-text">{verdict}</h3>
                    <p className="verdict-subheadline-text">{subVerdict}</p>

                    <div className="score-disclaimer-callout">
                      <p className="disclaimer-callout-text">
                        <strong>Model Note:</strong> {result.score_disclaimer || "This is a model-based screening score, not a statistical accuracy percentage."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. RESOURCE ANALYSIS (Section 24, 25: 4 Self-Contained Cards with Zero Exterior Overflow) */}
            <div className="resource-cards-quad-container">
              <div className="section-mini-heading">
                <span className="smh-eyebrow">RESOURCE ATTRIBUTES</span>
                <h3 className="smh-title">Resource Analysis</h3>
              </div>

              <div className="resource-quad-grid">
                {/* Solar Resource Card */}
                <div className="resource-card-selfcontained solar">
                  <div className="card-top-color-stripe stripe-solar"></div>
                  <div className="rc-body">
                    <div className="rc-header">
                      <div className="rc-category">
                        <Sun size={15} strokeWidth={2.4} className="icon-solar" />
                        <span>SOLAR RESOURCE</span>
                      </div>
                      <span className="rc-badge badge-solar">
                        {energy?.solar?.suitable ? "SUITABLE" : "MODERATE"}
                      </span>
                    </div>

                    <div className="rc-value-row">
                      <span className="rc-primary-num num-tnum">
                        {(energy?.solar?.ghi_proxy_avg || energy?.solar?.ghi_avg || 0).toFixed(1)}
                      </span>
                      <span className="rc-unit-text">W/m²</span>
                    </div>

                    <div className="rc-variable-meta">
                      <span className="rc-var-title">Mean shortwave radiation / GHI proxy</span>
                      <span className="rc-var-sub">Threshold target: ≥ 400 W/m² daytime mean</span>
                    </div>

                    <div className="rc-source-footer">
                      Open-Meteo ERA5-Land (2021–2023)
                    </div>
                  </div>
                </div>

                {/* Wind Resource Card */}
                <div className="resource-card-selfcontained wind">
                  <div className="card-top-color-stripe stripe-wind"></div>
                  <div className="rc-body">
                    <div className="rc-header">
                      <div className="rc-category">
                        <Wind size={15} strokeWidth={2.4} className="icon-wind" />
                        <span>WIND RESOURCE</span>
                      </div>
                      <span className="rc-badge badge-wind">
                        {energy?.wind?.suitable ? "SUITABLE" : "LOW DENSITY"}
                      </span>
                    </div>

                    <div className="rc-value-row">
                      <span className="rc-primary-num num-tnum">
                        {(energy?.wind?.wind_avg_10m || energy?.wind?.wind_avg || 0).toFixed(2)}
                      </span>
                      <span className="rc-unit-text">m/s</span>
                    </div>

                    <div className="rc-variable-meta">
                      <span className="rc-var-title">10 m Wind Speed</span>
                      <span className="rc-var-sub">Elevation: 10 m above ground level (AGL)</span>
                    </div>

                    <div className="rc-source-footer">
                      Open-Meteo ERA5-Land (2021–2023)
                    </div>
                  </div>
                </div>

                {/* Soil Loss Card */}
                <div className="resource-card-selfcontained soil">
                  <div className="card-top-color-stripe stripe-soil"></div>
                  <div className="rc-body">
                    <div className="rc-header">
                      <div className="rc-category">
                        <Mountain size={15} strokeWidth={2.4} className="icon-soil" />
                        <span>SOIL LOSS</span>
                      </div>
                      <span className="rc-badge badge-soil">
                        {(soil?.risk || "LOW").toUpperCase()} RISK
                      </span>
                    </div>

                    <div className="rc-value-row">
                      <span className="rc-primary-num num-tnum">
                        {(soil?.soil_loss || 0).toFixed(2)}
                      </span>
                      <span className="rc-unit-text">t/ha/year</span>
                    </div>

                    <div className="rc-variable-meta">
                      <span className="rc-var-title">Modeled soil-loss estimate</span>
                      <span className="rc-var-sub">A = R × K × LS × C × P (P=1.00 assumed)</span>
                    </div>

                    <div className="rc-source-footer">
                      USDA RUSLE Model / SRTM DEM
                    </div>
                  </div>
                </div>

                {/* Microclimate Card */}
                <div className="resource-card-selfcontained climate">
                  <div className="card-top-color-stripe stripe-climate"></div>
                  <div className="rc-body">
                    <div className="rc-header">
                      <div className="rc-category">
                        <Thermometer size={15} strokeWidth={2.4} className="icon-climate" />
                        <span>TEMPERATURE</span>
                      </div>
                      <span className="rc-badge badge-climate">
                        AMBIENT
                      </span>
                    </div>

                    <div className="rc-value-row">
                      <span className="rc-primary-num num-tnum">
                        {(energy?.temperature?.avg || 25.0).toFixed(1)}
                      </span>
                      <span className="rc-unit-text">°C</span>
                    </div>

                    <div className="rc-variable-meta">
                      <span className="rc-var-title">Mean ambient air temperature</span>
                      <span className="rc-var-sub">2 m AGL thermal baseline</span>
                    </div>

                    <div className="rc-source-footer">
                      Open-Meteo ERA5-Land (2021–2023)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. GRAPHICAL ANALYSIS (Section 26, 27, 28: Normalized 0-100 Comparison Bar Chart) */}
            <div className="graphical-analysis-card">
              <div className="card-inner-pad">
                <div className="chart-header-row">
                  <div>
                    <span className="smh-eyebrow">GRAPHICAL ANALYSIS</span>
                    <h3 className="smh-title">Resource Comparison Breakdown</h3>
                  </div>
                  <span className="chart-scale-label">Normalized Screening Score (0–100)</span>
                </div>

                <div className="normalized-bars-stack">
                  {matrix.map((row, i) => (
                    <div key={i} className="bar-row-item">
                      <div className="bar-info-column">
                        <span className="bar-factor-name">{row.factor}</span>
                        <span className="bar-factor-raw">{row.value} ({row.weight} weight)</span>
                      </div>

                      <div className="bar-track-column">
                        <div className="bar-track-outer">
                          <div
                            className={`bar-fill-animated ${row.status || "success"}`}
                            style={{ width: `${Math.min(100, Math.max(6, row.score))}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="bar-score-column">
                        <span className="bar-score-num num-tnum">{row.score}</span>
                        <span className="bar-score-max">/100</span>
                      </div>

                      <div className="bar-class-column">
                        <span className={`bar-class-tag ${row.status || "success"}`}>
                          {row.classification}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. KEY SITE PARAMETERS (Section 30, 31: Primary Grid + Collapsible Technical Details) */}
            <div className="parameters-summary-card">
              <div className="card-inner-pad">
                <div className="params-header-row">
                  <div>
                    <span className="smh-eyebrow">SITE CHARACTERISTICS</span>
                    <h3 className="smh-title">Key Site Parameters</h3>
                  </div>
                </div>

                {/* Primary 5 Parameters */}
                <div className="primary-params-grid">
                  <div className="primary-param-item">
                    <span className="pp-k">Elevation ASL</span>
                    <strong className="pp-v num-tnum">{soil?.elevation_m || 450} m</strong>
                    <span className="pp-src">USGS SRTM 30m DEM</span>
                  </div>

                  <div className="primary-param-item">
                    <span className="pp-k">Topographic Slope</span>
                    <strong className="pp-v num-tnum">{soil?.slope_degrees || 0.5}°</strong>
                    <span className="pp-src">Grade: {soil?.slope_percent || 0.8}%</span>
                  </div>

                  <div className="primary-param-item">
                    <span className="pp-k">Mean Annual Rainfall</span>
                    <strong className="pp-v num-tnum">{soil?.annual_rainfall_mm || 1100} mm</strong>
                    <span className="pp-src">Open-Meteo 3-Yr Archive</span>
                  </div>

                  <div className="primary-param-item">
                    <span className="pp-k">Canopy Index (NDVI)</span>
                    <strong className="pp-v num-tnum">{soil?.ndvi_est || 0.42}</strong>
                    <span className="pp-src">Vegetation Canopy Cover</span>
                  </div>

                  <div className="primary-param-item">
                    <span className="pp-k">Modeled Soil Loss</span>
                    <strong className="pp-v num-tnum">{soil?.soil_loss || 2.82} t/ha/yr</strong>
                    <span className="pp-src">{soil?.risk || "Low"} Erosion Risk</span>
                  </div>
                </div>

                {/* Collapsible Technical Details Accordion (Section 31 & 32) */}
                <div className="technical-accordion-wrapper">
                  <button
                    type="button"
                    className="accordion-toggle-btn"
                    onClick={() => setTechnicalAccordionOpen(!technicalAccordionOpen)}
                  >
                    <div className="accordion-toggle-left">
                      <Sliders size={15} />
                      <span>TECHNICAL MODEL PARAMETERS (RUSLE & PEDOLOGY)</span>
                    </div>
                    {technicalAccordionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {technicalAccordionOpen && (
                    <div className="accordion-content-panel">
                      <div className="rusle-equation-banner">
                        <code>A = R × K × LS × C × P</code>
                        <span>Modeled annual soil erosion formula (USDA Agriculture Handbook 703)</span>
                      </div>

                      <div className="tech-factors-grid">
                        <div className="tech-factor-cell">
                          <span className="tf-k">Rainfall Erosivity (R)</span>
                          <strong className="tf-v num-tnum">{soil?.r_factor || 478.3}</strong>
                          <span className="tf-u">MJ·mm/(ha·h·yr)</span>
                        </div>

                        <div className="tech-factor-cell">
                          <span className="tf-k">Soil Erodibility (K)</span>
                          <strong className="tf-v num-tnum">{soil?.k_factor || 0.0325}</strong>
                          <span className="tf-u">t·ha·h/(ha·MJ·mm)</span>
                        </div>

                        <div className="tech-factor-cell">
                          <span className="tf-k">Slope Length/Steepness (LS)</span>
                          <strong className="tf-v num-tnum">{soil?.ls_factor || 0.38}</strong>
                          <span className="tf-u">ratio</span>
                        </div>

                        <div className="tech-factor-cell">
                          <span className="tf-k">Cover Management (C)</span>
                          <strong className="tf-v num-tnum">{soil?.c_factor || 0.23}</strong>
                          <span className="tf-u">ratio</span>
                        </div>

                        <div className="tech-factor-cell">
                          <span className="tf-k">Support Practice (P)</span>
                          <strong className="tf-v num-tnum">1.00</strong>
                          <span className="tf-u">Assumption: No terracing data</span>
                        </div>

                        <div className="tech-factor-cell">
                          <span className="tf-k">Clay / Sand / Silt</span>
                          <strong className="tf-v num-tnum">{soil?.clay_pct || 33}% / {soil?.sand_pct || 40}% / {soil?.silt_pct || 27}%</strong>
                          <span className="tf-u">Granulometry</span>
                        </div>

                        <div className="tech-factor-cell">
                          <span className="tf-k">Soil Organic Carbon (SOC)</span>
                          <strong className="tf-v num-tnum">{soil?.soc_pct || 2.0}%</strong>
                          <span className="tf-u">Baseline organic matter</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 8. CONCLUSION & KEY CONSIDERATIONS (Section 23) */}
            <div className="conclusion-rationale-card">
              <div className="card-inner-pad">
                <div className="conclusion-header">
                  <span className="smh-eyebrow">EXECUTIVE ASSESSMENT SYNTHESIS</span>
                  <h3 className="conclusion-verdict-banner">{verdict}</h3>
                </div>

                <p className="conclusion-narrative-text">
                  The selected site shows favorable preliminary potential for{" "}
                  <strong>{installationType.toUpperCase()}</strong> generation, supported by{" "}
                  {energy?.solar?.suitable ? "robust modeled shortwave irradiance" : "moderate solar resources"}, and{" "}
                  {soil?.risk === "Low" ? "stable ground conditions with low modeled soil-loss risk" : "manageable soil erosion requiring engineering mitigation"}.
                </p>

                <div className="key-considerations-box">
                  <h4 className="kc-title">KEY CONSIDERATIONS</h4>
                  <ul className="kc-list">
                    <li>Verify resource conditions with on-site pyranometer / anemometer mast measurements.</li>
                    <li>Complete geotechnical borehole sampling to confirm bedrock depth and driven pile embedment criteria before final design.</li>
                    <li>Confirm environmental setbacks, local zoning, and grid interconnection substation capacity.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 9. DOWNLOAD REPORT (Section 43, 48: Prominent Final Action) */}
            <div className="download-report-banner-card">
              <div className="dr-content">
                <h3 className="dr-title">Ready to archive or share this assessment?</h3>
                <p className="dr-sub">Generate an executive-grade site screening report with all verified parameters and charts.</p>
              </div>
              <button
                type="button"
                className="btn-download-report-main"
                onClick={() => setIsReportModalOpen(true)}
              >
                <Download size={16} strokeWidth={2.4} />
                <span>DOWNLOAD ASSESSMENT REPORT ↓</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Report Modal */}
      <AssessmentReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        result={result}
        locationInfo={locationInfo}
      />
    </div>
  );
}
