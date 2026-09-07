import React, { useState, useEffect, useRef, useCallback } from "react";
import Header from "./components/Header";
import AssessmentIntro from "./components/AssessmentIntro";
import SiteConfiguration from "./components/SiteConfiguration";
import MapPanel from "./components/MapPanel";
import AssessmentResult from "./components/AssessmentResult";
import ResourceAnalysis from "./components/ResourceAnalysis";
import CriteriaMatrix from "./components/CriteriaMatrix";
import SiteParametersTable from "./components/SiteParametersTable";
import Rationale from "./components/Rationale";
import DataSources from "./components/DataSources";
import Footer from "./components/Footer";

import "./App.css";

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

function App() {
  const [latitude, setLatitude] = useState("12.29291");
  const [longitude, setLongitude] = useState("76.67244");
  const [siteArea, setSiteArea] = useState("5.00");
  const [installationType, setInstallationType] = useState("solar");
  const [mapPosition, setMapPosition] = useState([12.29291, 76.67244]);
  const [activeBenchmark, setActiveBenchmark] = useState("Mysuru, Karnataka");

  const [locationInfo, setLocationInfo] = useState({
    locality: "Mysuru",
    district: "Mysuru District",
    state: "Karnataka",
    country: "India",
    admin_line: "Karnataka, India",
    display_name: "Mysuru, Karnataka, India"
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [error, setError] = useState("");
  const [backendOnline, setBackendOnline] = useState(null);

  const workspaceRef = useRef(null);
  const resultsRef = useRef(null);
  const geocodeTimerRef = useRef(null);

  // Health check on mount and interval
  useEffect(() => {
    const checkEngine = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/health");
        if (res.ok) {
          setBackendOnline(true);
        } else {
          setBackendOnline(false);
        }
      } catch (err) {
        setBackendOnline(false);
      }
    };
    checkEngine();
    const interval = setInterval(checkEngine, 20000);
    return () => clearInterval(interval);
  }, []);

  // Centralized Reverse Geocoding with Debounce (Section 13 & 14)
  const performReverseGeocode = useCallback(async (lat, lon) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/reverse-geocode?lat=${lat}&lon=${lon}`
      );
      if (res.ok) {
        const data = await res.json();
        setLocationInfo(data);
      } else {
        setLocationInfo((prev) => ({
          ...prev,
          locality: "Location name unavailable",
          admin_line: "Administrative details unavailable"
        }));
      }
    } catch (err) {
      console.warn("[ReverseGeocode] Backend query error:", err);
      setLocationInfo((prev) => ({
        ...prev,
        locality: "Location name unavailable",
        admin_line: "Administrative details unavailable"
      }));
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Debounced listener when latitude or longitude changes
  useEffect(() => {
    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);

    if (
      !isNaN(latNum) &&
      !isNaN(lonNum) &&
      latNum >= -90 &&
      latNum <= 90 &&
      lonNum >= -180 &&
      lonNum <= 180
    ) {
      // Sync map center if materially different
      if (
        Math.abs(mapPosition[0] - latNum) > 0.0001 ||
        Math.abs(mapPosition[1] - lonNum) > 0.0001
      ) {
        setMapPosition([latNum, lonNum]);
      }

      if (geocodeTimerRef.current) {
        clearTimeout(geocodeTimerRef.current);
      }

      geocodeTimerRef.current = setTimeout(() => {
        performReverseGeocode(latNum, lonNum);
      }, 400);
    }

    return () => {
      if (geocodeTimerRef.current) {
        clearTimeout(geocodeTimerRef.current);
      }
    };
  }, [latitude, longitude, performReverseGeocode]);

  // Validation
  const latNum = parseFloat(latitude);
  const lonNum = parseFloat(longitude);
  const areaNum = parseFloat(siteArea);
  const isFormValid =
    !isNaN(latNum) &&
    !isNaN(lonNum) &&
    !isNaN(areaNum) &&
    latNum >= -90 &&
    latNum <= 90 &&
    lonNum >= -180 &&
    lonNum <= 180 &&
    areaNum > 0;

  // Run Site Assessment
  const evaluateSite = async () => {
    if (!isFormValid) {
      setError("Please specify valid latitude (-90 to 90), longitude (-180 to 180), and footprint area (> 0 km²).");
      return;
    }

    setLoading(true);
    setError("");
    setLoadingStep("Retrieving environmental data");

    try {
      const step1Timer = setTimeout(() => {
        setLoadingStep("Evaluating renewable resources");
      }, 700);

      const step2Timer = setTimeout(() => {
        setLoadingStep("Calculating site indicators");
      }, 1400);

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

      clearTimeout(step1Timer);
      clearTimeout(step2Timer);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Environmental data could not be retrieved. Please try again.");
      }

      const data = await response.json();
      setResult(data);
      setBackendOnline(true);

      // Smooth scroll to results
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

  const handleSelectBenchmark = (item) => {
    setActiveBenchmark(item.name);
    setLatitude(item.lat);
    setLongitude(item.lon);
    setSiteArea(item.area);
    setInstallationType(item.type);
    setMapPosition([parseFloat(item.lat), parseFloat(item.lon)]);
    setError("");

    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleMapClickPosition = (pos) => {
    setMapPosition(pos);
    setLatitude(pos[0].toFixed(5));
    setLongitude(pos[1].toFixed(5));
    setActiveBenchmark(null);
  };

  const handleAreaCalculated = (areaStr) => {
    setSiteArea(areaStr);
  };

  const handleNewAssessment = () => {
    setResult(null);
    setError("");
    if (workspaceRef.current) {
      workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavigate = (target) => {
    if (target === "assessment") {
      if (workspaceRef.current) {
        workspaceRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else if (target === "methodology" || target === "data-sources") {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="geoscreen-root">
      {/* 1. HEADER (Section 10) */}
      <Header
        backendOnline={backendOnline}
        onNewAssessment={handleNewAssessment}
        onNavigate={handleNavigate}
      />

      <main className="main-content-layout">
        {/* 2. ASSESSMENT INTRO (Section 11) */}
        <AssessmentIntro
          benchmarks={BENCHMARK_SITES}
          activeBenchmark={activeBenchmark}
          onSelectBenchmark={handleSelectBenchmark}
        />

        {/* 3. SITE CONFIGURATION + MAP (Section 12, 13, 15) */}
        <section className="site-workspace-section" ref={workspaceRef} id="workspace">
          <div className="workspace-container">
            <div className="workspace-duo-grid">
              {/* Left Column: Configuration Panel */}
              <SiteConfiguration
                latitude={latitude}
                setLatitude={(v) => { setLatitude(v); setActiveBenchmark(null); }}
                longitude={longitude}
                setLongitude={(v) => { setLongitude(v); setActiveBenchmark(null); }}
                siteArea={siteArea}
                setSiteArea={(v) => { setSiteArea(v); setActiveBenchmark(null); }}
                installationType={installationType}
                setInstallationType={setInstallationType}
                locationInfo={locationInfo}
                isGeocoding={isGeocoding}
                onEvaluate={evaluateSite}
                loading={loading}
                loadingStep={loadingStep}
                error={error}
                isFormValid={isFormValid}
              />

              {/* Right Column: GIS Map Viewer */}
              <MapPanel
                position={mapPosition}
                setPosition={handleMapClickPosition}
                siteArea={siteArea}
                onAreaCalculated={handleAreaCalculated}
                locationInfo={locationInfo}
              />
            </div>
          </div>
        </section>

        {/* 4. ASSESSMENT RESULT (Section 20, 21, 22) */}
        {result && (
          <div ref={resultsRef} className="results-sequence-container">
            {/* Overall Result & Score */}
            <AssessmentResult result={result} />

            {/* 5. RESOURCE ANALYSIS (Section 32, 33) */}
            <ResourceAnalysis result={result} />

            {/* 6. MULTI-CRITERIA ANALYSIS (Section 34) */}
            <CriteriaMatrix result={result} />

            {/* 7. SITE PARAMETERS / RUSLE (Section 35, 28) */}
            <SiteParametersTable result={result} />

            {/* 8. RATIONALE (Section 36, 37) */}
            <Rationale result={result} />
          </div>
        )}

        {/* 9. DATA SOURCES / METHODOLOGY (Section 29, 30, 31) */}
        <DataSources result={result} />
      </main>

      {/* 10. FOOTER (Section 51) */}
      <Footer onScrollToTop={handleScrollToTop} />
    </div>
  );
}

export default App;