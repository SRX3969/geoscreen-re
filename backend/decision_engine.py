from energy.energy_analyzer import assess_suitability
from soil.soil_analyzer import assess_soil


def evaluate_site(
    latitude,
    longitude,
    site_area,
    installation_type="hybrid"
):
    """
    Evaluate a site using both energy potential
    and soil erosion risk.
    """

    # Run energy analysis
    energy_result = assess_suitability(
        latitude,
        longitude,
        installation_type
    )

    # Run soil analysis
    soil_result = assess_soil(
        latitude,
        longitude,
        site_area
    )

    energy_score = energy_result["score"]
    soil_risk = soil_result["risk"]

    # -----------------------------------------
    # FINAL SITE DECISION
    # -----------------------------------------

    if energy_score == "HIGH":

        if soil_risk == "Low":
            final_decision = "HIGHLY SUITABLE"

        elif soil_risk == "Moderate":
            final_decision = "SUITABLE"

        elif soil_risk == "High":
            final_decision = "CONDITIONALLY SUITABLE"

        else:
            final_decision = "NOT SUITABLE"

    elif energy_score == "MEDIUM":

        if soil_risk in ["Low", "Moderate"]:
            final_decision = "SUITABLE"

        else:
            final_decision = "CONDITIONALLY SUITABLE"

    else:
        final_decision = "NOT SUITABLE"

    return {
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "site_area_km2": site_area
        },

        "installation_type": installation_type,

        "energy": energy_result,

        "soil": soil_result,

        "final_decision": final_decision
    }