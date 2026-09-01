import requests
import certifi
import pandas as pd
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def fetch_region_weather(
    center_lat,
    center_lon,
    buffer=0.9,
    start_date="2020-05-15",
    end_date="2020-06-17"
):
    """
    Fetch weather data for the selected location.
    The center point is used as representative for the region.
    """

    url = "https://archive-api.open-meteo.com/v1/archive"

    params = {
        "latitude": center_lat,
        "longitude": center_lon,
        "start_date": start_date,
        "end_date": end_date,
        "hourly": "shortwave_radiation,temperature_2m,wind_speed_10m",
        "timezone": "Asia/Kolkata"
    }
    
    resp = requests.get(url, params=params, verify=False)
    resp.raise_for_status()

    data = resp.json()["hourly"]

    df = pd.DataFrame(data)

    df = df.rename(columns={
        "time": "timestamp",
        "shortwave_radiation": "ghi",
        "temperature_2m": "temp_c",
        "wind_speed_10m": "wind_speed_ms"
    })

    return df


def assess_suitability(center_lat, center_lon, installation_type="hybrid", buffer=0.9):
    """
    Analyze renewable-energy potential at a location.

    installation_type:
        "solar"
        "wind"
        "hybrid"

    Returns a dictionary containing all energy metrics.
    """

    df = fetch_region_weather(center_lat, center_lon, buffer)

    # Calculate metrics
    # Nighttime zero values are excluded from solar average.
    daytime = df[df["ghi"] > 0]

    ghi_avg = daytime["ghi"].mean()
    ghi_max = df["ghi"].max()

    wind_avg = df["wind_speed_ms"].mean()
    wind_max = df["wind_speed_ms"].max()

    temp_avg = df["temp_c"].mean()

    # Thresholds
    solar_good = ghi_avg >= 400
    wind_good = wind_avg >= 4.0

    # Determine suitability based on installation type
    if installation_type == "solar":

        if solar_good:
            score = "HIGH"
        else:
            score = "LOW"

    elif installation_type == "wind":

        if wind_good:
            score = "HIGH"
        else:
            score = "LOW"

    else:
        # Hybrid
        if solar_good and wind_good:
            score = "HIGH"
        elif solar_good or wind_good:
            score = "MEDIUM"
        else:
            score = "LOW"

    return {
        "installation_type": installation_type,

        "score": score,

        "solar": {
            "ghi_avg": round(float(ghi_avg), 2),
            "ghi_max": round(float(ghi_max), 2),
            "suitable": bool(solar_good)
        },

        "wind": {
            "wind_avg": round(float(wind_avg), 2),
            "wind_max": round(float(wind_max), 2),
            "suitable": bool(wind_good)
        },

        "temperature": {
            "avg": round(float(temp_avg), 2)
        }
    }


if __name__ == "__main__":

    center_lat = float(input("Enter latitude (e.g., 15.4): "))
    center_lon = float(input("Enter longitude (e.g., 77.0): "))

    print("\nChoose installation type:")
    print("1. Solar")
    print("2. Wind")
    print("3. Hybrid")

    choice = input("Enter choice: ")

    if choice == "1":
        installation_type = "solar"
    elif choice == "2":
        installation_type = "wind"
    else:
        installation_type = "hybrid"

    result = assess_suitability(
        center_lat,
        center_lon,
        installation_type
    )

    print("\n=== ENERGY ANALYSIS ===")
    print("Installation:", result["installation_type"])
    print("Energy Score:", result["score"])

    print("\nSolar:")
    print("Average GHI:", result["solar"]["ghi_avg"], "W/m²")
    print("Peak GHI:", result["solar"]["ghi_max"], "W/m²")
    print("Suitable:", result["solar"]["suitable"])

    print("\nWind:")
    print("Average Wind:", result["wind"]["wind_avg"], "m/s")
    print("Maximum Wind:", result["wind"]["wind_max"], "m/s")
    print("Suitable:", result["wind"]["suitable"])

    print("\nAverage Temperature:",
          result["temperature"]["avg"], "°C")