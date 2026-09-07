import { useEffect, useState } from "react";
import L from "leaflet";
import {
  useMap,
  useMapEvents,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";

// Custom high-resolution SVG pin icon for Leaflet
const customPinIcon = L.divIcon({
  className: "custom-map-pin",
  html: `
    <div style="
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #173d2a;
      color: white;
      border: 2px solid #ffffff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      cursor: pointer;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: #a3e635;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position && Array.isArray(position) && position.length === 2) {
      map.flyTo(position, Math.max(map.getZoom(), 8), { duration: 1.2 });
    }
  }, [position, map]);

  return null;
}

function MapClickHandler({
  position,
  setPosition,
  drawing,
  points,
  setPoints,
}) {
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
      <Popup>
        <div style={{ padding: "4px", fontSize: "12px", lineHeight: "1.4" }}>
          <strong style={{ color: "#173d2a" }}>Target Assessment Site</strong>
          <br />
          <span>Lat: {position[0].toFixed(5)}°</span>
          <br />
          <span>Lon: {position[1].toFixed(5)}°</span>
        </div>
      </Popup>
    </Marker>
  );
}

function calculateArea(points) {
  if (points.length < 3) {
    return 0;
  }

  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const p1 = points[i];
    const p2 = points[(i + 1) % points.length];

    const x1 =
      p1[1] *
      111.32 *
      Math.cos((p1[0] * Math.PI) / 180);

    const y1 = p1[0] * 110.57;

    const x2 =
      p2[1] *
      111.32 *
      Math.cos((p2[0] * Math.PI) / 180);

    const y2 = p2[0] * 110.57;

    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);
}

export default function MapPicker({
  position,
  setPosition,
  onAreaCalculated,
}) {
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);

  const startDrawing = () => {
    setPoints([]);
    setDrawing(true);
  };

  const finishDrawing = () => {
    if (points.length < 3) {
      alert("Please click at least 3 points on the map to define the site perimeter.");
      return;
    }

    const area = calculateArea(points);
    onAreaCalculated(area.toFixed(2));
    setDrawing(false);
  };

  const clearBoundary = () => {
    setPoints([]);
    setDrawing(false);
  };

  return (
    <>
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
            color: "#173d2a",
            fillColor: "#3d8758",
            fillOpacity: 0.35,
            weight: 2,
            dashArray: drawing ? "6, 6" : undefined,
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          top: "14px",
          right: "14px",
          zIndex: 1000,
          display: "flex",
          gap: "8px",
        }}
      >
        {!drawing && (
          <button
            type="button"
            className="map-control-btn"
            onClick={startDrawing}
            title="Click to draw polygon boundaries"
          >
            ✏️ Draw Site
          </button>
        )}

        {drawing && (
          <>
            <button
              type="button"
              className="map-control-btn btn-finish"
              onClick={finishDrawing}
            >
              ✓ Complete ({points.length} pts)
            </button>
            <button
              type="button"
              className="map-control-btn btn-cancel"
              onClick={clearBoundary}
            >
              ✕ Cancel
            </button>
          </>
        )}

        {points.length > 0 && !drawing && (
          <button
            type="button"
            className="map-control-btn btn-clear"
            onClick={clearBoundary}
          >
            Clear Boundary
          </button>
        )}
      </div>
    </>
  );
}