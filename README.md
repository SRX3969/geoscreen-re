# GEOSCREEN — Geospatial Renewable Intelligence

> **Preliminary Geospatial Renewable Energy & Soil Loss Site Screening Platform**

GEOSCREEN is a high-precision geospatial intelligence application for preliminary screening of prospective utility-scale renewable energy installations (Solar PV, Wind, and Hybrid Co-generation) combined with physical soil loss risk evaluation via the Revised Universal Soil Loss Equation (RUSLE).

---

## 🌟 Key Features

- **Automatic Reverse Geocoding**: Real-time administrative identification (locality, district, state, country) via OpenStreetMap Nominatim with caching and debouncing.
- **Multi-Year Climate Reanalysis**: Queries 3 full calendar years (26,280 hourly observations, 2021–2023) from the Open-Meteo ERA5-Land historical atmospheric archive for solar irradiance, 10m wind speed, and ambient temperature.
- **Physical Soil Loss Modeling (RUSLE)**: Computes annual soil erosion ($A = R \times K \times LS \times C \times P$) utilizing USGS SRTM 30m Global DEM topography, multi-year precipitation, and regional soil granulometry.
- **Technology-Driven Multi-Criteria Decision Engine**:
  - **Solar PV**: 70% Solar Irradiance Proxy + 30% Soil/Topographic Stability.
  - **Wind**: 70% 10m Wind Speed + 30% Soil/Topographic Stability.
  - **Hybrid**: 40% Solar + 40% Wind + 20% Soil/Topographic Stability.
- **Scientific Transparency**:
  - Model-based Preliminary Screening Score ($0$–$100$) with explicit methodology disclaimer.
  - Transparent Data Confidence indicator with technical parameter breakdowns.
  - Clear separation between primary data sources and derived mathematical estimates.
- **Interactive GIS Mapping**: Leaflet-based map with dual-layer support (OpenStreetMap cartography and genuine Esri World Imagery high-resolution satellite tiles) and polygon boundary drawing.

---

## 🏗️ Architecture

```
├── backend/
│   ├── app.py                     # FastAPI service with /evaluate & /reverse-geocode
│   ├── decision_engine.py         # Multi-criteria scoring & technology weighting
│   ├── energy/
│   │   └── energy_analyzer.py     # 3-year ERA5-Land reanalysis & solar/wind indicators
│   └── soil/
│       └── soil_analyzer.py       # USGS SRTM 30m DEM slope & RUSLE physical equations
├── frontend/
│   ├── src/
│   │   ├── components/            # Header, Location HUD, MapPanel, Results, ResourceCards,
│   │   │                          # CriteriaMatrix, SiteParameters, Rationale, DataSources
│   │   ├── App.jsx                # Main 10-part assessment application flow
│   │   ├── App.css                # Production GIS design system & Inter typography
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Backend Setup (Python 3.10+)

```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```

The FastAPI backend will be available at `http://127.0.0.1:8000` with Swagger documentation at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (Node.js 18+)

```bash
cd frontend
npm install
npm run dev
```

The application interface will launch at `http://localhost:5173/` or `http://localhost:5174/`.

---

## 📊 Scientific Data Sources

| Source | Parameter | Resolution / Baseline |
| :--- | :--- | :--- |
| **Open-Meteo ERA5-Land** | Shortwave radiation, 10m wind velocity, 2m air temp | 0.1° (~11 km) gridded, 2021–2023 hourly observations |
| **USGS SRTM Global DEM** | Elevation, terrain slope gradients | 1 arc-second (~30 m) topography |
| **Open-Meteo Precipitation Archive** | Annualized cumulative precipitation for RUSLE R-Factor | 0.1° gridded, 3-year multi-year mean |
| **OpenStreetMap Nominatim** | Administrative reverse geocoding | Point-level coordinate lookup |
| **USDA RUSLE Empirical Model** | Annual soil erosion estimate ($A = R \times K \times LS \times C \times P$) | Derived mathematical composite model |

---

## ⚖️ Scientific Disclaimer

This assessment provides preliminary, model-based site screening. It does not replace detailed resource measurement (such as on-site met mast anemometry or pyranometry), geotechnical borehole investigations, environmental impact assessments, or detailed engineering feasibility studies.

---

## 📄 License

MIT License. Developed for preliminary geospatial climate intelligence and renewable energy screening.
