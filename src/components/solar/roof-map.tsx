"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type Map as MapLibreMap, type Marker } from "maplibre-gl";

import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  /** WGS84 Latitude des Hauses (Mittelpunkt der Karte). */
  lat: number;
  lon: number;
  /** Wenn true: Sonnendach-Eignungsraster wird als Overlay angezeigt. */
  showSonnendach?: boolean;
  /** Aufruf, wenn der User auf die Karte klickt (für alternative Dachauswahl). */
  onMapClick?: (lat: number, lon: number) => void;
  className?: string;
};

/**
 * Interaktive Karte mit swisstopo-Luftbild (SWISSIMAGE) und optionalem
 * Sonnendach-Eignungsraster vom BFE als Overlay. Klick auf die Karte
 * propagiert die WGS84-Koordinaten zurück an den Parent.
 */
export function RoofMap({
  lat,
  lon,
  showSonnendach = true,
  onMapClick,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [ready, setReady] = useState(false);

  // Map-Initialisierung — einmalig pro Mount.
  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          swissimage: {
            type: "raster",
            tiles: [
              "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg",
            ],
            tileSize: 256,
            attribution: "© swisstopo",
            maxzoom: 19,
          },
          sonnendach: {
            type: "raster",
            tiles: [
              "https://wmts.geo.admin.ch/1.0.0/ch.bfe.solarenergie-eignung-daecher/default/current/3857/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© BFE Sonnendach.ch",
            maxzoom: 20,
          },
        },
        layers: [
          {
            id: "swissimage-layer",
            type: "raster",
            source: "swissimage",
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: "sonnendach-layer",
            type: "raster",
            source: "sonnendach",
            minzoom: 14,
            maxzoom: 22,
            layout: { visibility: showSonnendach ? "visible" : "none" },
            paint: { "raster-opacity": 0.55 },
          },
        ],
      },
      center: [lon, lat],
      zoom: 19,
      maxZoom: 21,
      minZoom: 8,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

    map.on("load", () => setReady(true));
    map.on("click", (e) => {
      onMapClick?.(e.lngLat.lat, e.lngLat.lng);
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Map nur beim Mount initialisieren; Updates kommen über andere Effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Marker + Karten-Position aktualisieren wenn lat/lon ändern.
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.flyTo({ center: [lon, lat], zoom: 19, speed: 1.2 });

    if (markerRef.current) {
      markerRef.current.setLngLat([lon, lat]);
    } else {
      const el = document.createElement("div");
      el.className =
        "size-5 rounded-full border-[3px] border-[color:var(--solar-gold)] bg-[color:var(--solar-navy)] shadow-[0_0_0_4px_rgba(245,184,65,0.25)]";
      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([lon, lat])
        .addTo(mapRef.current);
    }
  }, [lat, lon, ready]);

  // Sonnendach-Layer sichtbar / unsichtbar schalten.
  useEffect(() => {
    if (!mapRef.current || !ready) return;
    mapRef.current.setLayoutProperty(
      "sonnendach-layer",
      "visibility",
      showSonnendach ? "visible" : "none",
    );
  }, [showSonnendach, ready]);

  return (
    <div
      ref={containerRef}
      className={
        className ??
        "h-72 w-full overflow-hidden rounded-2xl border border-border sm:h-80"
      }
    />
  );
}
