import requests
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from decision_engine import evaluate_site


app = FastAPI(
    title="GEOSCREEN API",
    description="Backend API for Geospatial Renewable Energy & Soil Loss Site Screening",
    version="2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache for reverse geocoding to prevent redundant external API hits
_geocode_cache = {}


class SiteRequest(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0, description="Latitude between -90 and 90")
    longitude: float = Field(..., ge=-180.0, le=180.0, description="Longitude between -180 and 180")
    site_area_km2: float = Field(..., gt=0.0, description="Proposed site area in km^2")
    installation_type: str = Field(default="solar", description="Installation type: solar, wind, or hybrid")


@app.get("/")
def home():
    return {
        "status": "online",
        "brand": "GEOSCREEN",
        "service": "Geospatial Renewable Intelligence API",
        "version": "2.0"
    }


@app.get("/health")
def health():
    return {"status": "healthy", "service": "GEOSCREEN"}


@app.get("/reverse-geocode")
def reverse_geocode(
    lat: float = Query(..., ge=-90.0, le=90.0),
    lon: float = Query(..., ge=-180.0, le=180.0)
):
    """
    Reverse geocode coordinates using OpenStreetMap Nominatim with caching,
    proper User-Agent, timeout, and defensive error handling.
    """
    cache_key = (round(lat, 4), round(lon, 4))
    if cache_key in _geocode_cache:
        return _geocode_cache[cache_key]

    try:
        url = "https://nominatim.openstreetmap.org/reverse"
        headers = {
            "User-Agent": "GEOSCREEN-RenewableIntelligence/2.0 (geoscreen-assessment@energy.local)"
        }
        params = {
            "lat": lat,
            "lon": lon,
            "format": "jsonv2",
            "addressdetails": 1,
            "zoom": 14
        }
        resp = requests.get(url, params=params, headers=headers, timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            address = data.get("address", {})

            # 1. Identify locality (finest administrative granularity)
            locality = (
                address.get("city") or
                address.get("town") or
                address.get("village") or
                address.get("hamlet") or
                address.get("suburb") or
                address.get("municipality") or
                address.get("county") or
                data.get("name") or
                "Local Area"
            )

            # 2. Administrative details
            district = address.get("state_district") or address.get("county") or ""
            state = address.get("state") or address.get("province") or address.get("region") or ""
            country = address.get("country") or ""

            # 3. Format clean administrative subtitle
            admin_parts = []
            if district and district.lower() != locality.lower():
                admin_parts.append(district)
            if state and state.lower() != locality.lower() and state.lower() != district.lower():
                admin_parts.append(state)
            if country:
                admin_parts.append(country)

            admin_line = ", ".join(admin_parts) if admin_parts else (state or country or "Region")

            result = {
                "locality": locality,
                "district": district,
                "state": state,
                "country": country,
                "admin_line": admin_line,
                "display_name": data.get("display_name", f"{locality}, {admin_line}"),
                "status": "success"
            }
            _geocode_cache[cache_key] = result
            return result
    except Exception as err:
        print(f"[ReverseGeocode] Query failed ({err}); providing graceful fallback.")

    fallback = {
        "locality": "Location name unavailable",
        "district": "",
        "state": "",
        "country": "",
        "admin_line": "Administrative details unavailable",
        "display_name": "Location name unavailable",
        "status": "unavailable"
    }
    return fallback


@app.post("/evaluate")
def evaluate(request: SiteRequest):
    try:
        result = evaluate_site(
            latitude=request.latitude,
            longitude=request.longitude,
            site_area=request.site_area_km2,
            installation_type=request.installation_type.lower()
        )
        return result
    except Exception as err:
        print(f"[API Error] /evaluate failed: {err}")
        raise HTTPException(
            status_code=500,
            detail=f"Error evaluating site: {str(err)}"
        )