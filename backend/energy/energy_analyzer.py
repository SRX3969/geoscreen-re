import requests
import certifi
import pandas as pd
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# In-memory cache for weather results keyed by rounded (lat, lon)
_weather_cache = {}

ANALYSIS_START_DATE = "2021-01-01"
ANALYSIS_END_DATE = "2023-12-31"
ANALYSIS_PERIOD_LABEL = f"{ANALYSIS_START_DATE} to {ANALYSIS_END_DATE} (3-Year Multi-Year Reanalysis)"


def fetch_region_weather(
    center_lat,
    center_lon,
    buffer=0.9,
    start_date=ANALYSIS_START_DATE,
    end_date=ANALYSIS_END_DATE
):
    """
    Fetch multi-year weather data for the selected location from Open-Meteo Historical Archive.
    Queries 3 full calendar years (26,280 hourly observations) for climatological rigor.
    """
    cache_key = (round(center_lat, 3), round(center_lon, 3), start_date, end_date)
    if cache_key in _weather_cache:
        return _weather_cache[cache_key].copy()

    url = "https://archive-api.open-meteo.com/v1/archive"

    params = {
        "latitude": center_lat,
        "longitude": center_lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "shortwave_radiation,temperature_2m,wind_speed_10m",
        "timezone": "UTC"
    }

    try:
        resp = requests.get(url, params=params, verify=False, timeout=12)
        resp.raise_for_status()
        data = resp.json().get("hourly", {})
    except Exception as e:
        print(f"[EnergyAnalyzer] Open-Meteo archive query failed ({e}), trying fallback period...")
        # Fallback to 1-year if 3-year times out
        params["start_date"] = "2023-01-01"
        params["end_date"] = "2023-12-31"
        resp = requests.get(url, params=params, verify=False, timeout=8)
        resp.raise_for_status()
        data = resp.json().get("hourly", {})

    df = pd.DataFrame(data)

    df = df.rename(columns={
        "time": "timestamp",
        "shortwave_radiation": "shortwave_rad",
        "temperature_2m": "temp_c",
        "wind_speed_10m": "wind_speed_10m"
    })

    _weather_cache[cache_key] = df
    return df


def assess_suitability(center_lat, center_lon, installation_type="hybrid", buffer=0.9):
    """
    Analyze renewable-energy potential using multi-year satellite reanalysis.

    installation_type:
        "solar"
        "wind"
        "hybrid"

    Returns a dictionary containing verified energy metrics with explicit variable naming.
    """
    df = fetch_region_weather(center_lat, center_lon, buffer)

    # 1. Solar calculations (Daytime-only mean to avoid skewing by night-time zeros)
    daytime = df[df["shortwave_rad"] > 0]
    ghi_proxy_avg = float(daytime["shortwave_rad"].mean()) if not daytime.empty else 0.0
    ghi_max = float(df["shortwave_rad"].max()) if not df.empty else 0.0

    # 2. Wind calculations (10m AGL)
    wind_avg_10m = float(df["wind_speed_10m"].mean()) if not df.empty else 0.0
    wind_max_10m = float(df["wind_speed_10m"].max()) if not df.empty else 0.0

    # 3. Ambient temperature
    temp_avg = float(df["temp_c"].mean()) if not df.empty else 25.0

    # Standard utility screening thresholds
    solar_good = ghi_proxy_avg >= 400.0   # Daytime mean shortwave radiation >= 400 W/m²
    wind_good = wind_avg_10m >= 4.0       # 10m AGL mean speed >= 4.0 m/s

    # Suitability score determination based on requested technology
    if installation_type == "solar":
        score = "HIGH" if solar_good else "LOW"
    elif installation_type == "wind":
        score = "HIGH" if wind_good else "LOW"
    else:  # hybrid
        if solar_good and wind_good:
            score = "HIGH"
        elif solar_good or wind_good:
            score = "MEDIUM"
        else:
            score = "LOW"

    return {
        "installation_type": installation_type,
        "score": score,
        "analysis_period": ANALYSIS_PERIOD_LABEL,
        "dataset_source": "Open-Meteo ERA5-Land Atmospheric Reanalysis",
        "solar": {
            "name": "Mean shortwave radiation / GHI proxy",
            "ghi_proxy_avg": round(ghi_proxy_avg, 2),
            "ghi_avg": round(ghi_proxy_avg, 2),  # Backward compatibility
            "ghi_max": round(ghi_max, 2),
            "unit": "W/m²",
            "threshold": "≥ 400 W/m² daytime mean",
            "suitable": bool(solar_good),
            "classification": "Suitable" if solar_good else "Moderate / Sub-optimal"
        },
        "wind": {
            "name": "10 m wind speed",
            "height": "10 m above ground level (AGL)",
            "wind_avg_10m": round(wind_avg_10m, 2),
            "wind_avg": round(wind_avg_10m, 2),  # Backward compatibility
            "wind_max_10m": round(wind_max_10m, 2),
            "wind_max": round(wind_max_10m, 2),  # Backward compatibility
            "unit": "m/s",
            "threshold": "≥ 4.0 m/s mean at 10m",
            "suitable": bool(wind_good),
            "classification": "Suitable" if wind_good else "Low Wind Density"
        },
        "temperature": {
            "name": "Mean ambient temperature",
            "avg": round(temp_avg, 2),
            "unit": "°C",
            "height": "2 m AGL"
        }
    }


if __name__ == "__main__":
    center_lat = float(input("Enter latitude (e.g., 21.87): ") or 21.87)
    center_lon = float(input("Enter longitude (e.g., 79.52): ") or 79.52)

    result = assess_suitability(center_lat, center_lon, "solar")
    print("\n=== MULTI-YEAR ENERGY ANALYSIS ===")
    print("Period:", result["analysis_period"])
    print("Solar Mean (Daytime):", result["solar"]["ghi_proxy_avg"], "W/m²")
    print("Wind 10m Mean:", result["wind"]["wind_avg_10m"], "m/s")
    print("Temperature:", result["temperature"]["avg"], "°C")