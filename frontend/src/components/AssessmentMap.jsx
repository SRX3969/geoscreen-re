import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom Leaflet marker icon with clean GIS aesthetics
const customPinIcon = L.divIcon({
  className: "gis-map-pin",
  html: `
    <div class="gis-pin-wrapper">
      <div class="gis-pin-head">
        <div class="gis-pin-core"></div>
      </div>
      <div class="gis-pin-pulse"></div>
    </div>
  `,
  iconSize: [36, 42],
  iconAnchor: [18, 38],
  popupAnchor: [0, -38],
});

function MapController({ position, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      map.flyTo(position, zoom || Math.max(map.getZoom(), 8), {
        duration: 1.4,
        easeLinearity: 0.25
      });
    }
  }, [position, zoom, map]);

  return null;
}

function MapClickHandler({ position, setPosition, drawing, points, setPoints }) {
  useMapEvents({
    click(event) {
      const newPoint = [event.latlng.lat, event.latlng.lng];
      if (drawing) {
        setPoints((prev) => [...prev, newPoint]);
      } else {
        setPosition(newPoint);
      }
    },
  });

  if (!position || drawing) {
    return null;
  }

  return (
    <Marker position={position} icon={customPinIcon}>
      <Popup className="gis-popup">
        <div className="popup-inner">
          <div className="popup-badge">Target Site Coordinate</div>
          <div className="popup-coords">
            <span>Lat: {position[0].toFixed(5)}°N</span>
            <span>Lon: {position[1].toFixed(5)}°E</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function calculatePolygonAreaKm2(points) {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];
    const x1 = p1[1] * 111.32 * Math.cos((p1[0] * Math.PI) / 180);
    const y1 = p1[0] * 110.57;
    const x2 = p2[1] * 111.32 * Math.cos((p2[0] * Math.PI) / 180);
    const y2 = p2[0] * 110.57;
    area += x1 * y2 - x2 * y1;
  }
  return Math.abs(area / 2);
}

export default function AssessmentMap({
  position,
  setPosition,
  siteArea,
  onAreaCalculated,
}) {
  const [mapLayer, setMapLayer] = useState("satellite"); // 'satellite' | 'street'
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  const startDrawing = () => {
    setPoints([]);
    setDrawing(true);
  };

  const finishDrawing = () => {
    if (points.length < 3) {
      alert("Please click at least 3 points across the site boundary on the map.");
      return;
    }
    const calculated = calculatePolygonAreaKm2(points);
    onAreaCalculated(calculated.toFixed(2));
    setDrawing(false);
  };

  const clearDrawing = () => {
    setPoints([]);
    setDrawing(false);
  };

  const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const satelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="assessment-map-card">
      {/* Map Card Header */}
      <div className="map-card-header">
        <div className="map-header-left">
          <span className="step-tag">GEOSPATIAL VIEWER</span>
          <h2 className="card-title">Interactive GIS Viewer</h2>
        </div>

        {/* Map Layer Switcher Tabs */}
        <div className="map-layer-switcher">
          <button
            type="button"
            className={`layer-switch-btn ${mapLayer === "satellite" ? "layer-active" : ""}`}
            onClick={() => setMapLayer("satellite")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20" /></svg>
            Satellite Imagery
          </button>
          <button
            type="button"
            className={`layer-switch-btn ${mapLayer === "street" ? "layer-active" : ""}`}
            onClick={() => setMapLayer("street")}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg>
            Topographic / Streets
          </button>
        </div>
      </div>

      {/* Map Viewport Area */}
      <div className="map-canvas-wrapper">
        <MapContainer
          center={position || [21.87577, 79.52266]}
          zoom={7}
          className="leaflet-geoscreen-map"
          zoomControl={false}
        >
          <TileLayer
            key={mapLayer}
            attribution={mapLayer === "satellite" ? "&copy; Esri &mdash; Earthstar Geographics" : "&copy; OpenStreetMap contributors"}
            url={mapLayer === "satellite" ? satelliteUrl : streetUrl}
            maxZoom={18}
          />

          <MapController position={position} />

          <MapClickHandler
            position={position}
            setPosition={setPosition}
            drawing={drawing}
            points={points}
            setPoints={setPoints}
          />

          {points.length >= 2 && (
            <Polygon
              positions={points}
              pathOptions={{
                color: "#22c55e",
                fillColor: "#16a34a",
                fillOpacity: 0.35,
                weight: 2.5,
                dashArray: drawing ? "6, 6" : undefined,
              }}
            />
          )}
        </MapContainer>

        {/* Floating Map Controls Overlay (Top-Right) */}
        <div className="floating-map-controls">
          {!drawing && (
            <button
              type="button"
              className="map-action-tool"
              onClick={startDrawing}
              title="Click map to create polygon perimeter and compute area"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              Draw Boundary
            </button>
          )}

          {drawing && (
            <div className="drawing-actions-group">
              <button
                type="button"
                className="map-action-tool tool-confirm"
                onClick={finishDrawing}
              >
                ✓ Finish ({points.length} pts)
              </button>
              <button
                type="button"
                className="map-action-tool tool-cancel"
                onClick={clearDrawing}
              >
                ✕ Cancel
              </button>
            </div>
          )}

          {points.length > 0 && !drawing && (
            <button
              type="button"
              className="map-action-tool tool-secondary"
              onClick={clearDrawing}
            >
              Clear Boundary
            </button>
          )}
        </div>

        {/* Floating Coordinates HUD Overlay (Bottom-Left) */}
        <div className="floating-coords-hud">
          <div className="hud-indicator">
            <span className="hud-pulse-radar"></span>
            <span className="hud-label">GPS LOCK</span>
          </div>
          {position ? (
            <div className="hud-values">
              <span>{position[0].toFixed(5)}°N</span>
              <span className="hud-sep">•</span>
              <span>{position[1].toFixed(5)}°E</span>
              {siteArea && (
                <>
                  <span className="hud-sep">•</span>
                  <span className="hud-area">{siteArea} km²</span>
                </>
              )}
            </div>
          ) : (
            <div className="hud-values">Click on map to select</div>
          )}
        </div>
      </div>

      {/* Map Card Footer */}
      <div className="map-card-footer">
        <div className="footer-legend">
          <span className="legend-item"><span className="legend-dot dot-marker"></span> Location Pin</span>
          <span className="legend-item"><span className="legend-dot dot-boundary"></span> Site Boundary Polygon</span>
        </div>
        <div className="footer-instructions">
          Click map to relocate • Use drawing tool to delineate site bounds
        </div>
      </div>
    </div>
  );
}
