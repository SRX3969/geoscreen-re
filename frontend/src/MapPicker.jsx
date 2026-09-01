import { useEffect, useState } from "react";
import {
  useMap,
  useMapEvents,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 12);
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
      const newPoint = [
        event.latlng.lat,
        event.latlng.lng,
      ];

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
    <Marker position={position}>
      <Popup>
        <strong>Selected Site</strong>
        <br />
        Latitude: {position[0].toFixed(5)}
        <br />
        Longitude: {position[1].toFixed(5)}
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
      alert("Select at least 3 points.");
      return;
    }

    const area = calculateArea(points);

    onAreaCalculated(area.toFixed(2));

    setDrawing(false);
  };

  const clearBoundary = () => {
    setPoints([]);
    setDrawing(false);
    onAreaCalculated("");
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
        <Polygon positions={points} />
      )}

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          gap: "8px",
        }}
      >
        {!drawing && (
          <button onClick={startDrawing}>
            Draw Site
          </button>
        )}

        {drawing && (
          <button onClick={finishDrawing}>
            Finish
          </button>
        )}

        {points.length > 0 && (
          <button onClick={clearBoundary}>
            Clear
          </button>
        )}
      </div>
    </>
  );
}