import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AssessmentPage from "./pages/AssessmentPage";
import MethodologyPage from "./pages/MethodologyPage";
import DataSourcesPage from "./pages/DataSourcesPage";

import "./App.css";

function App() {
  const [latitude, setLatitude] = useState("12.29291");
  const [longitude, setLongitude] = useState("76.67244");
  const [siteArea, setSiteArea] = useState("5.00");
  const [installationType, setInstallationType] = useState("solar");
  const [mapPosition, setMapPosition] = useState([12.29291, 76.67244]);

  const [locationInfo, setLocationInfo] = useState({
    locality: "Mysuru",
    district: "Mysuru District",
    state: "Karnataka",
    country: "India",
    admin_line: "Karnataka, India",
    display_name: "Mysuru, Karnataka, India"
  });

  const [result, setResult] = useState(null);
  const [backendOnline, setBackendOnline] = useState(null);

  // Periodic health check
  useEffect(() => {
    const checkEngine = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/health");
        setBackendOnline(res.ok);
      } catch (err) {
        setBackendOnline(false);
      }
    };
    checkEngine();
    const interval = setInterval(checkEngine, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleNewAssessment = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <BrowserRouter>
      <div className="geoscreen-app-shell">
        {/* Global Glassmorphic Navigation (Section 2 & 6) */}
        <Navigation
          backendOnline={backendOnline}
          onNewAssessment={handleNewAssessment}
        />

        {/* Multi-Page Routes (Section 1) */}
        <main className="geoscreen-page-viewport">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/assessment"
              element={
                <AssessmentPage
                  latitude={latitude}
                  setLatitude={setLatitude}
                  longitude={longitude}
                  setLongitude={setLongitude}
                  siteArea={siteArea}
                  setSiteArea={setSiteArea}
                  installationType={installationType}
                  setInstallationType={setInstallationType}
                  mapPosition={mapPosition}
                  setMapPosition={setMapPosition}
                  locationInfo={locationInfo}
                  setLocationInfo={setLocationInfo}
                  result={result}
                  setResult={setResult}
                />
              }
            />
            <Route path="/methodology" element={<MethodologyPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Clean Footer (Section 60) */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;