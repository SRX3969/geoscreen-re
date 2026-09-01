# Soil & Erosion Risk Assessment for Renewable Energy Site Selection

## 1. What am I building?

I am building the **soil and environmental risk component** of a larger renewable-energy site-selection system.

The complete system has two major components:

1. **Energy Yield Prediction** — handled by my teammate.

   * Predicts expected solar/wind energy output.
   * Uses historical generation and meteorological features such as irradiance, temperature, wind speed, humidity, and cloud cover.

2. **Soil & Erosion Risk Assessment** — my component.

   * Evaluates whether the land around a proposed renewable-energy site has environmental and soil-related risks.
   * Focuses on terrain, soil composition, rainfall, vegetation, and land use.
   * Produces an erosion/degradation risk assessment.

The two components will eventually be combined so that the system can answer both:

> **"How much energy can this location produce?"**

and

> **"How environmentally and physically suitable is the land?"**

---

# 2. What problem am I solving?

Choosing a renewable-energy site based only on energy production is incomplete.

A location may have excellent sunlight or wind conditions but still be problematic because of:

* steep terrain,
* highly erodible soil,
* heavy rainfall,
* poor vegetation protection,
* unsuitable land use,
* water bodies,
* or other environmental constraints.

The goal of my component is therefore to provide an **early-stage environmental screening system**.

It should help identify locations where soil and terrain conditions create higher erosion or land-degradation risk before a site is considered a strong renewable-energy candidate.

This is a **proof-of-concept screening tool**, not a replacement for geological surveys, engineering studies, environmental clearances, or professional site investigations.

---

# 3. What is the input?

A latitude and longitude represent only a **point**.

A renewable-energy installation, however, occupies an **area of land**.

Therefore, the system will not treat the coordinate as the entire site.

Instead, the user will provide:

* **Central latitude**
* **Central longitude**
* **Proposed site area in km²**
* **Installation type** — solar or wind

The latitude and longitude represent the **center/reference point of the proposed site**.

The site area tells the system how much surrounding land needs to be evaluated.

For the initial proof-of-concept, the area can be represented using a regular geometric region around the center point. Multiple sample points will be evaluated within that region rather than relying on a single coordinate.

A future version could allow the user to draw or upload the exact site boundary on a map.

---

# 4. Why do I evaluate multiple points?

Environmental conditions can change significantly across a relatively small area.

For example, a site could contain:

* flat land on one side,
* a steep section on another,
* different soil characteristics,
* different vegetation,
* or a section classified as unsuitable land use.

If I evaluate only the center coordinate, I could incorrectly classify the entire site.

Therefore:

```text
Center coordinate + site area
            ↓
Generate multiple points inside the site
            ↓
Evaluate each point
            ↓
Combine the results
            ↓
Produce one assessment for the entire site
```

The site is therefore treated as a **spatial area**, not a single point.

---

# 5. What data does the soil component need?

For each sampled location inside the proposed site, the system will obtain environmental features.

### Soil composition

Examples:

* Sand
* Silt
* Clay
* Organic carbon

These describe the physical and chemical characteristics of the soil.

### Terrain

Examples:

* Elevation
* Slope

Slope is particularly important because steeper terrain can increase runoff and erosion risk.

### Rainfall

Rainfall information represents the amount and/or intensity of precipitation affecting the location.

Rainfall becomes particularly important when combined with:

* steep slopes,
* erodible soil,
* and low vegetation protection.

### Vegetation

Vegetation cover helps protect soil from rainfall and surface runoff.

NDVI (Normalized Difference Vegetation Index) can be used as an indicator of vegetation density.

### Land use

The system should distinguish between different types of land, such as:

* Agricultural
* Forest
* Bare/disturbed land
* Built-up
* Water

Land use is important because environmental risk and practical site suitability are not determined by soil properties alone.

For example, a location could have excellent soil conditions but still be unusable because it is a water body or built-up area.

---

# 6. How will erosion risk be calculated?

The primary scientific framework considered for the erosion component is **RUSLE — Revised Universal Soil Loss Equation**.

Conceptually:

```text
Environmental data
       ↓
Soil erodibility
       +
Slope/terrain
       +
Rainfall
       +
Vegetation/land management
       ↓
RUSLE
       ↓
Estimated erosion risk
```

RUSLE provides an estimate of soil loss/erosion rather than directly determining whether a solar farm can legally or physically be constructed.

The resulting erosion information will therefore be used as a **risk indicator**.

The exact RUSLE factors and data sources will be finalized during implementation based on the quality and availability of the datasets.

---

# 7. Am I using Machine Learning for the soil component?

**Not necessarily.**

The original idea proposed training a Random Forest using RUSLE-generated labels.

After examining the architecture, this was rejected for the initial version.

The reason is important:

If I calculate:

```text
soil + slope + rainfall + vegetation
             ↓
           RUSLE
             ↓
        risk label
```

and then train:

```text
soil + slope + rainfall + vegetation
             ↓
       Random Forest
             ↓
       same risk label
```

the ML model is largely learning to reproduce the RUSLE-derived rules.

Without a reliable dataset containing real-world observations or expert-validated suitability labels, the ML model would not necessarily provide meaningful additional intelligence.

Therefore, the initial soil component will use a **scientific risk-assessment pipeline rather than forcing machine learning into the problem**.

Machine learning can be considered later if a suitable labelled dataset becomes available.

---

# 8. What will the soil component output?

For a proposed site, the system should eventually provide something like:

```text
Site:
20.5° N, 78.9° E

Area:
2 km²

Erosion Risk:
Medium

Risk Factors:
- Moderate slope
- Highly erodible soil in parts of the site
- Low vegetation protection

Land-use concerns:
None detected
```

The exact output format will be finalized during implementation.

The important idea is that the system should provide both:

1. **A numerical/continuous risk score**
2. **An understandable risk category**

For example:

* Low Risk
* Moderate Risk
* High Risk

---

# 9. What happens to the site as a whole?

The system will evaluate many points within the proposed area.

For example:

```text
Point 1 → Low risk
Point 2 → Low risk
Point 3 → Moderate risk
Point 4 → High risk
Point 5 → Low risk
...
```

The individual measurements will then be aggregated into a site-level assessment.

Possible site-level indicators include:

* Average erosion risk
* Maximum erosion risk
* Percentage of the site with high risk
* Average slope
* Maximum slope
* Percentage of the site occupied by unsuitable land use

This is more meaningful than simply looking at the center coordinate.

---

# 10. What is the final integrated system?

The final system should combine my soil/environmental assessment with my teammate's energy prediction model.

The architecture is:

```text
                 USER
                   │
          latitude + longitude
          site area + time
          installation type
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
   ENERGY MODEL       SOIL/ENVIRONMENT
          │                 │
          ▼                 ▼
 Expected energy       Erosion risk
     output              score
          │                 │
          └────────┬────────┘
                   ▼
             UNIFIED OUTPUT
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    Energy       Land       Overall
    Yield        Risk       Assessment
```

The purpose is not simply to display two unrelated predictions.

The final system should help answer:

> **"Is this a good renewable-energy site when both energy potential and land/environmental risk are considered?"**

For example:

```text
Energy potential: HIGH
Erosion risk: LOW

→ Strong candidate
```

or:

```text
Energy potential: HIGH
Erosion risk: HIGH

→ Energy potential is good, but environmental risk requires attention
```

---

# 11. What is NOT part of the first version?

To prevent the project from becoming unnecessarily complicated, the following are **not initial priorities**:

* Training a Random Forest for soil suitability
* Creating artificial ML labels
* Feature-importance analysis
* Searching for alternative sites within 5 km
* Automatically replacing a failed site
* Professional geological certification
* Exact engineering feasibility
* Full environmental-impact assessment
* Allowing users to draw arbitrary site polygons

These can be considered later.

The **5–10 km alternative-site search is a future feature**, not part of the current first implementation.

---

# 12. Development strategy

The project will be built incrementally rather than attempting the entire system at once.

### Phase 1 — Understand and obtain the data

Start with one coordinate.

Verify that the required data sources can provide:

* soil properties,
* elevation/slope,
* rainfall,
* vegetation,
* land use.

Do not begin with hundreds of locations.

### Phase 2 — Evaluate one site

Take one center coordinate and one proposed site area.

Generate several points inside the site and obtain their environmental features.

### Phase 3 — Calculate erosion risk

Implement the selected erosion-risk methodology, including RUSLE where appropriate.

Test the calculation manually on a small number of locations.

### Phase 4 — Convert point information into site information

Aggregate the measurements across the entire proposed area.

Produce:

* site-level risk score,
* risk category,
* important environmental indicators,
* land-use constraints.

### Phase 5 — Scale the pipeline

Once one site works correctly, automate the process for many locations.

### Phase 6 — Integrate with the energy model

Connect the soil-risk output with the teammate's energy prediction output.

### Phase 7 — Build the user-facing system

Create the final interface where a user provides:

```text
Latitude
Longitude
Site area
Date/time window
Installation type
```

and receives a combined energy + environmental assessment.

---

# 13. Final objective

The final objective is to build a **proof-of-concept, location-aware renewable-energy site screening system**.

Given a proposed site, the system should:

1. Identify the area surrounding the supplied center coordinate.
2. Evaluate environmental conditions across that area.
3. Estimate soil/erosion risk using relevant geospatial data and scientific methods.
4. Produce an understandable site-level environmental risk assessment.
5. Combine that assessment with the predicted energy yield from the teammate's model.
6. Present a unified view of **energy potential versus environmental/land risk**.

The central idea is:

> **A renewable-energy site should not be judged only by how much energy it can produce. It should also be evaluated for the condition and environmental risk of the land on which the installation will be placed.**

The project therefore aims to demonstrate how **geospatial data + environmental science + energy forecasting** can be combined into a single decision-support system.

---

## Current Scope Decision

**For the first implementation:**

```text
INPUT
  ↓
Center coordinate + site area
  ↓
Multiple points across the proposed site
  ↓
Soil + terrain + rainfall + vegetation + land-use data
  ↓
Erosion-risk calculation
  ↓
Site-level risk assessment
  ↓
Combine with teammate's energy prediction
  ↓
UNIFIED RENEWABLE-ENERGY SITE ASSESSMENT
```

**No soil Random Forest for now.**

**No 5 km alternative search for now.**

**No assumption that one coordinate represents an entire solar farm.**

Those three decisions eliminate most of the unnecessary complexity that caused the project to become confusing in the first place.

