import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents, Marker, Popup, Polygon } from "react-leaflet";
import L from "leaflet";
import { Layers, MapPin, Maximize2, PenTool, Check, Trash2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Custom Leaflet marker icon with clean GIS styling
const customGisIcon = L.divIcon({
  className: "custom-gis-pin",
  html: `
    <div class="pin-anchor">
      <div class="pin-ring"></div>
      <div class="pin-center"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -18],
});

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      map.flyTo(position, Math.max(map.getZoom(), 9), {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [position, map]);

  return null;
}

function MapClickHandler({ position, setPosition, drawing, setPoints }) {
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
    <Marker position={position} icon={customGisIcon}>
      <Popup className="clean-gis-popup">
        <div className="popup-body">
          <strong className="popup-title">Selected Assessment Point</strong>
          <div className="popup-coords">
            {position[0].toFixed(5)}° N, {position[1].toFixed(5)}° E
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

export default function MapPanel({
  position,
  setPosition,
  siteArea,
  onAreaCalculated,
  locationInfo
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
      alert("Click at least 3 points on the map to define a site boundary.");
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

  // Legitimate tile services with truthful attribution (Section 16)
  const streetUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const streetAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors';

  const satelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
  const satelliteAttribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

  return (
    <div className="map-panel-card">
      {/* Top Map Toolbar */}
      <div className="map-toolbar">
        <div className="map-status-info">
          <div className="map-site-name">
            <MapPin size={13} strokeWidth={2.2} className="map-pin-icon" />
            <span className="name-text">{locationInfo?.locality || "Selected Site"}</span>
            <span className="admin-text">
              {locationInfo?.admin_line ? `• ${locationInfo.admin_line}` : ""}
            </span>
          </div>
        </div>

        <div className="map-controls-group">
          {/* Boundary Drawing Controls */}
          {drawing ? (
            <div className="drawing-actions">
              <span className="drawing-hint">
                {points.length} point{points.length !== 1 ? "s" : ""} placed
              </span>
              <button
                type="button"
                className="btn-map-control btn-save-draw"
                onClick={finishDrawing}
                title="Finish site polygon"
              >
                <Check size={13} strokeWidth={2.5} />
                <span>Apply</span>
              </button>
              <button
                type="button"
                className="btn-map-control btn-cancel-draw"
                onClick={clearDrawing}
                title="Cancel boundary drawing"
              >
                <Trash2 size={13} strokeWidth={2.2} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-map-control"
              onClick={startDrawing}
              title="Draw site boundary polygon to calculate area"
            >
              <PenTool size={13} strokeWidth={2.2} />
              <span>Draw Boundary</span>
            </button>
          )}

          {/* Legitimate Layer Selector (Section 16) */}
          <div className="layer-toggle-wrap">
            <button
              type="button"
              className={`btn-layer ${mapLayer === "satellite" ? "layer-active" : ""}`}
              onClick={() => setMapLayer("satellite")}
              title="Satellite Imagery (Esri World Imagery)"
            >
              Satellite
            </button>
            <button
              type="button"
              className={`btn-layer ${mapLayer === "street" ? "layer-active" : ""}`}
              onClick={() => setMapLayer("street")}
              title="Cartographic Streets (OpenStreetMap)"
            >
              Streets
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="map-leaflet-wrapper">
        <MapContainer
          center={position}
          zoom={9}
          scrollWheelZoom={true}
          className="geoscreen-leaflet-container"
        >
          <MapController position={position} />

          <TileLayer
            key={mapLayer}
            attribution={mapLayer === "satellite" ? satelliteAttribution : streetAttribution}
            url={mapLayer === "satellite" ? satelliteUrl : streetUrl}
            maxZoom={18}
          />

          <MapClickHandler
            position={position}
            setPosition={setPosition}
            drawing={drawing}
            setPoints={setPoints}
          />

          {points.length >= 3 && (
            <Polygon
              positions={points}
              pathOptions={{
                color: "#1F8A5B",
                fillColor: "#1F8A5B",
                fillOpacity: 0.22,
                weight: 2,
                dashArray: "4 4",
              }}
            />
          )}
        </MapContainer>

        {/* Live Coordinate HUD Overlay */}
        <div className="map-coords-hud">
          <span>{position[0].toFixed(5)}° N, {position[1].toFixed(5)}° E</span>
          <span className="hud-sep">•</span>
          <span>Footprint: {siteArea} km²</span>
        </div>
      </div>
    </div>
  );
}
