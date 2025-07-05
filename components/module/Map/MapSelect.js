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
  if (!initialized || !marker.current) return;

  // Validate position format and values
  const validatePosition = (pos) => {
    return (
      Array.isArray(pos) &&
      pos.length === 2 &&
      typeof pos[0] === 'number' &&
      typeof pos[1] === 'number' &&
      !isNaN(pos[0]) &&
      !isNaN(pos[1]) &&
      pos[0] >= -180 &&
      pos[0] <= 180 &&
      pos[1] >= -90 &&
      pos[1] <= 90
    );
  };

  // Use default Tehran coordinates if position is invalid
  const safePosition = validatePosition(position) 
    ? position 
    : [51.3890, 35.6892]; // [lng, lat] of Tehran

  try {
    // Set marker position
    marker.current.setLngLat(safePosition);
    
    // Fly to position if map is available
    if (map.current) {
      map.current.flyTo({
        center: safePosition,
        essential: true,
         // Optional: Set appropriate zoom level
      });
    }
  } catch (error) {
    console.error('Error updating map position:', error);
    
    // Fallback to default position if error occurs
    if (marker.current) {
      marker.current.setLngLat([51.3890, 35.6892]);
    }
    if (map.current) {
      map.current.flyTo({
        center: [51.3890, 35.6892],
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
