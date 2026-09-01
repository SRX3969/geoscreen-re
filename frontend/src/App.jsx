import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MapPicker from "./MapPicker";
import "leaflet/dist/leaflet.css";
import "./App.css";

function App() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mapPosition, setMapPosition] = useState(null);
  const [siteArea, setSiteArea] = useState("");
  const [installationType, setInstallationType] = useState("solar");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const evaluateSite = async () => {
    if (!latitude || !longitude || !siteArea) {
      setError("Please provide latitude, longitude and site area.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: Number(latitude),
          longitude: Number(longitude),
          site_area_km2: Number(siteArea),
          installation_type: installationType,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to evaluate the site.");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        "Could not connect to the assessment service. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMapPosition = (position) => {
    setMapPosition(position);
    setLatitude(position[0].toFixed(5));
    setLongitude(position[1].toFixed(5));
  };

  return (
    <div className="app">

      {/* NAVIGATION */}
      <nav className="navbar">
        <div className="brand">
          <div className="brand-mark">RE</div>
          <div>
            <strong>Renewable Assessment</strong>
            <span>Site screening platform</span>
          </div>
        </div>

        <div className="nav-status">
          <span className="status-dot"></span>
          Assessment system
        </div>
      </nav>

      <main className="container">

        {/* HEADER */}
        <section className="page-header">
          <div>
            <p className="section-label">SITE ASSESSMENT</p>

            <h1>Renewable energy site screening</h1>

            <p className="page-description">
              Evaluate the renewable-energy potential and soil
              conditions of a proposed site using geographic
              coordinates and environmental resource data.
            </p>
          </div>
        </section>


        {/* LOCATION + MAP */}
        <section className="assessment-layout">

          <div className="card site-details">

            <div className="card-header">
              <div>
                <p className="section-label">01 / SITE</p>
                <h2>Site information</h2>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group">
                <label>Latitude</label>

                <input
                  type="number"
                  step="any"
                  placeholder="23.00000"
                  value={latitude}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLatitude(value);

                    const lat = Number(value);
                    const lon = Number(longitude);

                    if (
                      value !== "" &&
                      longitude !== "" &&
                      lat >= -90 &&
                      lat <= 90 &&
                      lon >= -180 &&
                      lon <= 180
                    ) {
                      setMapPosition([lat, lon]);
                    }
                  }}
                />
              </div>


              <div className="form-group">
                <label>Longitude</label>

                <input
                  type="number"
                  step="any"
                  placeholder="45.00000"
                  value={longitude}
                  onChange={(e) => {
                    const value = e.target.value;
                    setLongitude(value);

                    const lat = Number(latitude);
                    const lon = Number(value);

                    if (
                      latitude !== "" &&
                      value !== "" &&
                      lat >= -90 &&
                      lat <= 90 &&
                      lon >= -180 &&
                      lon <= 180
                    ) {
                      setMapPosition([lat, lon]);
                    }
                  }}
                />
              </div>


              <div className="form-group">
                <label>Site area</label>

                <div className="input-with-unit">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    placeholder="7.00"
                    value={siteArea}
                    onChange={(e) => setSiteArea(e.target.value)}
                  />

                  <span>km²</span>
                </div>
              </div>


              <div className="form-group">
                <label>Installation type</label>

                <select
                  value={installationType}
                  onChange={(e) =>
                    setInstallationType(e.target.value)
                  }
                >
                  <option value="solar">Solar</option>
                  <option value="wind">Wind</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

            </div>


            <div className="coordinates-note">
              <span className="info-icon">i</span>

              <span>
                Enter coordinates manually or select a location
                directly on the map.
              </span>
            </div>


            <button
              className="analyze-button"
              onClick={evaluateSite}
              disabled={loading}
            >
              {loading ? (
                "Running assessment..."
              ) : (
                <>
                  Run site assessment
                  <span>→</span>
                </>
              )}
            </button>


            {error && (
              <div className="error">
                {error}
              </div>
            )}

          </div>


          {/* MAP */}

          <div className="card map-card">

            <div className="map-header">
              <div>
                <p className="section-label">LOCATION</p>
                <h2>Site map</h2>
              </div>

              <span className="map-badge">
                Interactive
              </span>
            </div>

            <div className="map-wrapper">

              <MapContainer
                center={[20, 78]}
                zoom={5}
                className="site-map"
              >

                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapPicker
                  position={mapPosition}
                  setPosition={handleMapPosition}
                  onAreaCalculated={(area) => {
                    setSiteArea(area);
                  }}
                />

              </MapContainer>

            </div>

            <div className="map-footer">
              <span>
                Click the map to select a location
              </span>

              {mapPosition && (
                <span>
                  {mapPosition[0].toFixed(4)},
                  {" "}
                  {mapPosition[1].toFixed(4)}
                </span>
              )}
            </div>

          </div>

        </section>


        {/* RESULTS */}

        {result && (
          <section className="results-section">

            <div className="results-header">
              <div>
                <p className="section-label">
                  02 / ASSESSMENT
                </p>

                <h2>Assessment results</h2>
              </div>

              <div className="decision">
                <span>OVERALL SUITABILITY</span>
                <strong>{result.final_decision}</strong>
              </div>
            </div>


            <div className="results-grid">

              {/* SOLAR */}

              <div className="result-card">

                <div className="result-card-top">
                  <span className="result-number">
                    01
                  </span>

                  <span className="result-status">
                    {result.energy.solar.suitable
                      ? "Suitable"
                      : "Not suitable"}
                  </span>
                </div>

                <h3>Solar resource</h3>

                <div className="metric">
                  <strong>
                    {result.energy.solar.ghi_avg}
                  </strong>

                  <span>W/m²</span>
                </div>

                <p>
                  Average global horizontal irradiance
                </p>

              </div>


              {/* WIND */}

              <div className="result-card">

                <div className="result-card-top">
                  <span className="result-number">
                    02
                  </span>

                  <span className="result-status">
                    {result.energy.wind.suitable
                      ? "Suitable"
                      : "Not suitable"}
                  </span>
                </div>

                <h3>Wind resource</h3>

                <div className="metric">
                  <strong>
                    {result.energy.wind.wind_avg}
                  </strong>

                  <span>m/s</span>
                </div>

                <p>
                  Average wind speed at the assessed site
                </p>

              </div>


              {/* SOIL */}

              <div className="result-card">

                <div className="result-card-top">
                  <span className="result-number">
                    03
                  </span>

                  <span className="result-status">
                    {result.soil.risk} risk
                  </span>
                </div>

                <h3>Soil erosion</h3>

                <div className="metric">
                  <strong>
                    {result.soil.soil_loss}
                  </strong>

                  <span>t/ha/yr</span>
                </div>

                <p>
                  Estimated annual soil loss
                </p>

              </div>


              {/* TEMPERATURE */}

              <div className="result-card">

                <div className="result-card-top">
                  <span className="result-number">
                    04
                  </span>
                </div>

                <h3>Temperature</h3>

                <div className="metric">
                  <strong>
                    {result.energy.temperature.avg}
                  </strong>

                  <span>°C</span>
                </div>

                <p>
                  Average temperature for the assessed location
                </p>

              </div>

            </div>


            {/* SUMMARY */}

            <div className="assessment-summary">

              <div>
                <p className="section-label">
                  ASSESSMENT SUMMARY
                </p>

                <h3>
                  Preliminary site screening indicates{" "}
                  {result.final_decision.toLowerCase()}.
                </h3>
              </div>

              <p>
                The assessment combines renewable-energy resource
                indicators with estimated soil erosion risk.
                Results are intended for preliminary site screening
                and should be followed by detailed engineering,
                environmental and geotechnical studies.
              </p>

            </div>


            {/* SITE DETAILS */}

            <div className="site-summary">

              <p className="section-label">
                SITE PARAMETERS
              </p>

              <div className="site-summary-grid">

                <div>
                  <span>Latitude</span>
                  <strong>
                    {result.location.latitude}
                  </strong>
                </div>

                <div>
                  <span>Longitude</span>
                  <strong>
                    {result.location.longitude}
                  </strong>
                </div>

                <div>
                  <span>Area</span>
                  <strong>
                    {result.location.site_area_km2} km²
                  </strong>
                </div>

                <div>
                  <span>Technology</span>
                  <strong>
                    {result.installation_type}
                  </strong>
                </div>

              </div>

            </div>

          </section>
        )}

      </main>


      <footer>
        <div>
          <strong>Renewable Assessment Platform</strong>
          <span>Preliminary site screening tool</span>
        </div>

        <span>
          Energy resource + soil assessment
        </span>
      </footer>

    </div>
  );
}

export default App;