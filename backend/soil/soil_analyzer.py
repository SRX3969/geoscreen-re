
import ee
import pandas as pd
import numpy as np

from .site_gen import boundaries




ee.Initialize(
    project="soil-erosion-506507"
)
def assess_soil(lat, long, site):



    # ==========================================
    # CREATE 100 SAMPLE POINTS
    # ==========================================

    # Change these coordinates for the user's site
    




    points = boundaries(lat,long,site)

    features = []

    point_id = 1

    for lat, lon in points:

        point = ee.Geometry.Point(
            [lon, lat]
        )

        feature = ee.Feature(
            point,
            {"point_id": point_id}
        )

        features.append(feature)

        point_id += 1


    collection = ee.FeatureCollection(
        features
    )


    # ==========================================
    # ELEVATION + SLOPE
    # ==========================================

    srtm = ee.Image(
        "USGS/SRTMGL1_003"
    )

    slope = ee.Terrain.slope(
        srtm
    )

    combined = srtm.addBands(
        slope
    )

    results = combined.sampleRegions(
        collection=collection,
        scale=30,
        geometries=True
    )

    data = results.getInfo()

    rows = []

    for feature in data["features"]:

        row = feature["properties"]

        coordinates = feature["geometry"]["coordinates"]

        row["longitude"] = coordinates[0]
        row["latitude"] = coordinates[1]

        rows.append(row)


    df = pd.DataFrame(rows)


    # ==========================================
    # CLAY
    # ==========================================

    soil = ee.Image(
        "OpenLandMap/SOL/SOL_CLAY-WFRACTION_USDA-3A1A1A_M/v02"
    )

    clay = soil.select("b0")

    soil_results = clay.sampleRegions(
        collection=collection,
        scale=250
    )

    soil_data = soil_results.getInfo()

    soil_rows = []

    for feature in soil_data["features"]:
        soil_rows.append(
            feature["properties"]
        )

    soil_df = pd.DataFrame(
        soil_rows
    )

    soil_df = soil_df.rename(
        columns={
            "b0": "clay"
        }
    )
    print("DF COLUMNS:", df.columns.tolist())
    print("SOIL DF COLUMNS:", soil_df.columns.tolist())
    df = df.merge(
        soil_df,
        on="point_id"
    )


    # ==========================================
    # LAND COVER
    # ==========================================

    landcover = ee.ImageCollection(
        "ESA/WorldCover/v200"
    ).first()

    landcover = landcover.select(
        "Map"
    )

    land_results = landcover.sampleRegions(
        collection=collection,
        scale=10
    )

    land_data = land_results.getInfo()

    land_rows = []

    for feature in land_data["features"]:
        land_rows.append(
            feature["properties"]
        )

    land_df = pd.DataFrame(
        land_rows
    )

    land_df = land_df.rename(
        columns={
            "Map": "land_cover"
        }
    )

    df = df.merge(
        land_df,
        on="point_id"
    )


    # ==========================================
    # ANNUAL RAINFALL
    # ==========================================

    rain = ee.ImageCollection(
        "UCSB-CHG/CHIRPS/DAILY"
    )

    rain_2025 = rain.filterDate(
        "2025-01-01",
        "2026-01-01"
    )

    annual_rain = rain_2025.select(
        "precipitation"
    ).sum()

    rain_results = annual_rain.sampleRegions(
        collection=collection,
        scale=5566
    )

    rain_data = rain_results.getInfo()

    rain_rows = []

    for feature in rain_data["features"]:
        rain_rows.append(
            feature["properties"]
        )

    rain_df = pd.DataFrame(
        rain_rows
    )

    rain_df = rain_df.rename(
        columns={
            "precipitation": "annual_rainfall"
        }
    )

    df = df.merge(
        rain_df,
        on="point_id"
    )


    # ==========================================
    # FIXED SENTINEL-2 NDVI WITH CLOUD MASKING
    # ==========================================

    sentinel = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED")

    # 1. Cloud masking helper function using the QA60 band
    def mask_s2_clouds(image):
        qa = image.select('QA60')
        # Bits 10 and 11 represent clouds and cirrus respectively
        cloud_bit_mask = 1 << 10
        cirrus_bit_mask = 1 << 11
        # Both flags must be set to zero for clear conditions
        mask = qa.bitwiseAnd(cloud_bit_mask).eq(0).And(
            qa.bitwiseAnd(cirrus_bit_mask).eq(0))
        return image.updateMask(mask).divide(10000) # Scale pixel values to 0-1

    # 2. Filter collection, apply the mask, and calculate the true median
    sentinel_2025 = (sentinel
        .filterDate("2025-01-01", "2026-01-01")
        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20)) # Pre-filter cloudy tiles
        .map(mask_s2_clouds))

    sentinel_median = sentinel_2025.median()

    # 3. Calculate clear-sky NDVI
    ndvi = sentinel_median.normalizedDifference(["B8", "B4"]).rename("NDVI")

    ndvi_results = ndvi.sampleRegions(
        collection=collection,
        scale=10
    )

    ndvi_data = ndvi_results.getInfo()
    ndvi_rows = []
    for feature in ndvi_data["features"]:
        ndvi_rows.append(feature["properties"])

    ndvi_df = pd.DataFrame(ndvi_rows)
    df = df.merge(ndvi_df, on="point_id")

    # ==========================================
    # SAND
    # ==========================================

    sand_image = ee.Image(
        "OpenLandMap/SOL/SOL_SAND-WFRACTION_USDA-3A1A1A_M/v02"
    ).select(
        "b0"
    )

    sand_results = sand_image.sampleRegions(
        collection=collection,
        scale=250
    )

    sand_data = sand_results.getInfo()

    sand_rows = []

    for feature in sand_data["features"]:
        sand_rows.append(
            feature["properties"]
        )

    sand_df = pd.DataFrame(
        sand_rows
    )

    sand_df = sand_df.rename(
        columns={
            "b0": "sand"
        }
    )

    df = df.merge(
        sand_df,
        on="point_id"
    )


    # ==========================================
    # SILT
    # ==========================================

    df["silt"] = (
        100
        - df["clay"]
        - df["sand"]
    )


    # ==========================================
    # ORGANIC CARBON
    # ==========================================

    soc_image = ee.Image(
        "OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02"
    ).select(
        "b0"
    )

    soc_results = soc_image.sampleRegions(
        collection=collection,
        scale=250
    )

    soc_data = soc_results.getInfo()

    soc_rows = []

    for feature in soc_data["features"]:
        soc_rows.append(
            feature["properties"]
        )

    soc_df = pd.DataFrame(
        soc_rows
    )

    soc_df = soc_df.rename(
        columns={
            "b0": "soc"
        }
    )

    df = df.merge(
        soc_df,
        on="point_id"
    )

    # ==========================================
    # FIXED RUSLE K FACTOR WITH SOC CORRECTION
    # ==========================================

    # OpenLandMap SOC is in (5 * g/kg). Convert it to an organic matter percentage (%)
    # 1 g/kg = 0.1%. So: (raw_soc * 5) * 0.1 = raw_soc * 0.5
    om_percent = df["soc"] * 0.5

    # Standard RUSLE Organic Matter Correction Factor (forg)
    forg = 0.4351 + 0.5649 * np.exp(-0.1583 * om_percent)

    # The rest of your K-factor calculations can now run smoothly:
    fcsand = 0.2 + 0.3 * np.exp(-0.0256 * df["sand"] * (1 - df["silt"] / 100))
    fclsi = (df["silt"] / (df["clay"] + df["silt"])) ** 0.3
    fsand = 1 - (0.7 * (1 - df["sand"] / 100) / ((1 - df["sand"] / 100) + np.exp(5.51 + 22.9 * (1 - df["sand"] / 100))))

    df["K"] = fcsand * fclsi * forg * fsand * 0.1317



    # ==========================================
    # FIXED RUSLE LS FACTOR (Standard Bounded)
    # ==========================================

    slope_percent = np.tan(np.radians(df["slope"])) * 100

    # Cap the slope percent to prevent exponential inflation in extreme terrain
    slope_percent = np.clip(slope_percent, 0.1, 50) 

    # Standard RUSLE parameter adjustments based on slope steepness
    df["LS"] = np.where(
        slope_percent < 9,
        (slope_percent / 9) ** 0.4,
        (slope_percent / 9) ** 0.6
    )

    # ==========================================
    # FIXED RUSLE C FACTOR (Van der Knijff et al.)
    # ==========================================
    # alpha=2 and beta=1 is the international standard conversion profile.
    # It ensures lush vegetation properly drives erosion risk down toward zero.

    # Clip NDVI safely to avoid dividing by zero if a pixel hits exactly 1.0
    safe_ndvi = np.clip(df["NDVI"], -1.0, 0.999)

    df["C"] = np.exp(-2 * (safe_ndvi / (1 - safe_ndvi)))


    # ==========================================
    # RUSLE P FACTOR
    # ==========================================

    # No conservation-practice information
    df["P"] = 1


    # ==========================================
    # R FACTOR
    # ==========================================

    # Instead of using raw rainfall, apply a standard Indian climatic proxy formula:
    # R = 79 + 0.363 * (Annual Rainfall in mm)
    # For ultra-arid regions like Leh (~100mm), this drastically scales down the 

    df["R"] = 79 + (0.363 * df["annual_rainfall"])

    # ==========================================
    # RUSLE SOIL LOSS
    # ==========================================

    df["soil_loss"] = (
        df["R"]
        * df["K"]
        * df["LS"]
        * df["C"]
        * df["P"]
    )


    # ==========================================
    # OVERALL SITE RESULT
    # ==========================================

    site_soil_loss = df[
        "soil_loss"
    ].mean()


    # ==========================================
    # FIXED RISK CLASSIFICATION
    # ==========================================

    if site_soil_loss < 5:

        site_risk = "Low"

    elif site_soil_loss < 10:

        site_risk = "Moderate"

    elif site_soil_loss < 20:

        site_risk = "High"

    else:

        site_risk = "Very High"


    # ==========================================
    # SAVE DATASET
    # ==========================================

    df.to_csv(
        "erosion_dataset.csv",
        index=False
    )
    return {
        "soil_loss": round(float(site_soil_loss), 3),
        "risk": site_risk
    }


    # ==========================================
    # FINAL USER RESULT
    # ==========================================

    print()
    print("==========================================")
    print("        LAND EROSION ASSESSMENT")


    print(
        f"Average estimated soil loss: "
        f"{site_soil_loss:.3f} t/ha/year"
    )

    print(
        f"Overall erosion risk: "
        f"{site_risk}"
    )
if __name__ == "__main__":

    print("Enter the central lat and longitude of the site (in degrees)")

    lat = float(input("Latitude: "))
    long = float(input("Longitude: "))

    print("Enter the site area for the same (km^2)")

    site = float(input("Site area: "))

    result = assess_soil(lat, long, site)

    print()
    print("==========================================")
    print("        LAND EROSION ASSESSMENT")
    print()

    print(
        f"Average estimated soil loss: "
        f"{result['soil_loss']:.3f} t/ha/year"
    )

    print(
        f"Overall erosion risk: "
        f"{result['risk']}"
    )


