// components/MapComponent.js
import React, { useRef, useEffect, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const MapSelect = ({ position, setPosition, isEnable = true }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const [initialized, setInitialized] = useState(false);

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
      center: position || [51.3453, 35.5736], // Use provided position or default
      zoom: 12,
    });

    // Create a custom marker element
    const markerElem = document.createElement("div");
    markerElem.className = "map-marker";
    markerElem.style.width = "62px";
    markerElem.style.height = "62px";
    markerElem.style.backgroundImage = "url(/images/marker.png)";
    markerElem.style.backgroundSize = "contain";
    markerElem.style.backgroundRepeat = "no-repeat";
    markerElem.style.cursor = "pointer";

    // Add the custom marker to the map
    marker.current = new maplibregl.Marker({
      element: markerElem,
      draggable: isEnable,
    })
      .setLngLat(position || [51.3453, 35.5736])
      .addTo(map.current);

    // Handle marker drag end
    marker.current.on("dragend", () => {
      const lngLat = marker.current.getLngLat();
      setPosition([lngLat.lng, lngLat.lat]);
    });

    // Handle map click to move marker
    map.current.on("click", (e) => {
      if (!isEnable) return;
      marker.current.setLngLat(e.lngLat);
      setPosition([e.lngLat.lng, e.lngLat.lat]);
    });

    setInitialized(true);

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker position when prop changes
  useEffect(() => {
    if (initialized && marker.current && position) {
      marker.current.setLngLat([position[0], position[1]]);
      if (map.current) {
        map.current.flyTo({
          center: [position[0], position[1]],
          essential: true,
        });
      }
    }
  }, [position, initialized]);

  // Update map interactivity when isEnable changes
  useEffect(() => {
    if (!map.current || !marker.current) return;

    if (isEnable) {
      map.current.scrollZoom.enable();
      map.current.dragPan.enable();
      map.current.dragRotate.enable();
      map.current.touchZoomRotate.enable();
      map.current.doubleClickZoom.enable();
      marker.current.setDraggable(true);
    } else {
      map.current.scrollZoom.disable();
      map.current.dragPan.disable();
      map.current.dragRotate.disable();
      map.current.touchZoomRotate.disable();
      map.current.doubleClickZoom.disable();
      marker.current.setDraggable(false);
    }
  }, [isEnable]);

  return (
    <div
      ref={mapContainer}
      className="map-box-2"
      style={isEnable ? {width:"100%", height: "400px" ,borderRadius:"8px"} : null}
    />
  );
};

export default MapSelect;
