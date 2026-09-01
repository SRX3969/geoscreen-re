import ee

ee.Initialize(project="eternal-algebra-491904-k3")

# One test location
point = ee.Geometry.Point([78.895, 20.495])

# Load SRTM elevation dataset
srtm = ee.Image("USGS/SRTMGL1_003")

# Get elevation at our point
elevation = srtm.sample(
    region=point,
    scale=30,
    geometries=True
).first()

print(elevation.getInfo())