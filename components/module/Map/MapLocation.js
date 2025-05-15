// components/MapComponent.js
import React, { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapLocation = ({ long, lat }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          "raster-tiles": {
            type: "raster",
            tiles: [
              "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
              "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "simple-tiles",
            type: "raster",
            source: "raster-tiles",
            paint: {},
          },
        ],
      },
      center: [long, lat], // Center the map on Tehran, Iran
      zoom: 17,
    });

    // Create a custom marker element
    const markerElem = document.createElement("div");
    markerElem.style.width = "80px";
    markerElem.style.height = "80px";
    markerElem.style.backgroundImage = "url(/images/marker.png)"; // Ensure this path is correct
    markerElem.style.backgroundSize = "contain";
    markerElem.style.backgroundRepeat = "no-repeat";

    // Add the custom marker to the map
    new maplibregl.Marker({ color: "#f65", element: markerElem })
      .setLngLat([long,lat]) // Coordinates for Tehran
      .addTo(map.current);
  }, []);

  return <div ref={mapContainer} className="map-box" />;
};

export default MapLocation;
