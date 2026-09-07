import React from "react";
import { MapPin } from "lucide-react";

export default function AssessmentIntro({ benchmarks, activeBenchmark, onSelectBenchmark }) {
  return (
    <section className="assessment-intro-section" id="assessment">
      <div className="intro-container">
        <div className="intro-eyebrow">GEOSPATIAL RENEWABLE ASSESSMENT</div>
        <h1 className="intro-heading">
          Evaluate a site using geographic, environmental and renewable-resource data.
        </h1>

        {/* Reference Locations */}
        {benchmarks && benchmarks.length > 0 && (
          <div className="benchmark-bar">
            <span className="benchmark-label">
              <MapPin size={13} strokeWidth={2.2} />
              Reference Sites:
            </span>
            <div className="benchmark-chips">
              {benchmarks.map((item, idx) => {
                const isSelected = activeBenchmark === item.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`benchmark-chip ${isSelected ? "chip-selected" : ""}`}
                    onClick={() => onSelectBenchmark(item)}
                    title={`${item.desc} (${item.lat}°N, ${item.lon}°E)`}
                  >
                    <span className="chip-name">{item.name}</span>
                    <span className="chip-tech">{item.type.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
