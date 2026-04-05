"use client";

import { useEffect, useRef, useState } from "react";

interface CityCoord {
  name: string;
  latitude: number;
  longitude: number;
}

interface MapData {
  visitedCities: CityCoord[];
  upcomingCities: CityCoord[];
  route: CityCoord[];
}

interface AgendaMapProps {
  selectedCity?: string | null;
}

export function AgendaMap({ selectedCity }: AgendaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const [mapData, setMapData] = useState<MapData | null>(null);

  // Fetch map data from API
  useEffect(() => {
    fetch("/api/agenda-stats")
      .then((r) => r.json())
      .then((data) => {
        setMapData({
          visitedCities: data.visitedCities || [],
          upcomingCities: data.upcomingCities || [],
          route: data.route || [],
        });
      })
      .catch(() => {
        setMapData({ visitedCities: [], upcomingCities: [], route: [] });
      });
  }, []);

  // Init map when data is ready
  useEffect(() => {
    if (!mapRef.current || leafletMap.current || !mapData) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [-4.5, -44.8],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      // São Luís as starting point (always shown)
      const slzMarker = L.circleMarker([-2.531, -44.283], {
        radius: 10,
        fillColor: "#f59e0b",
        color: "#fff",
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);
      slzMarker.bindPopup(
        `<div style="text-align:center;font-family:system-ui">
          <strong>São Luís</strong><br/>
          <span style="color:#f59e0b;font-size:12px">⭐ Ponto de partida</span>
        </div>`
      );

      // Visited cities (completed events)
      mapData.visitedCities.forEach((city) => {
        if (city.name === "São Luís") return; // already drawn
        const marker = L.circleMarker([city.latitude, city.longitude], {
          radius: 8,
          fillColor: "#1e40af",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        marker.bindPopup(
          `<div style="text-align:center;font-family:system-ui">
            <strong>${city.name}</strong><br/>
            <span style="color:#1e40af;font-size:12px">✓ Visitada</span>
          </div>`
        );
      });

      // Upcoming cities (scheduled events)
      mapData.upcomingCities.forEach((city) => {
        const marker = L.circleMarker([city.latitude, city.longitude], {
          radius: 5,
          fillColor: "#94a3b8",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7,
        }).addTo(map);

        marker.bindPopup(
          `<div style="text-align:center;font-family:system-ui">
            <strong>${city.name}</strong><br/>
            <span style="color:#94a3b8;font-size:12px">Próximas visitas</span>
          </div>`
        );
      });

      // Draw route line (São Luís → visited cities in order)
      if (mapData.route.length > 1) {
        const routeCoords = mapData.route.map(
          (c) => [c.latitude, c.longitude] as [number, number]
        );
        L.polyline(routeCoords, {
          color: "#3b82f6",
          weight: 3,
          opacity: 0.5,
          dashArray: "8, 8",
        }).addTo(map);
      }

      // Fit bounds if there are markers
      const allCities = [...mapData.visitedCities, ...mapData.upcomingCities];
      if (allCities.length > 0) {
        const bounds = L.latLngBounds(
          allCities.map((c) => [c.latitude, c.longitude] as [number, number])
        );
        // Include São Luís
        bounds.extend([-2.531, -44.283]);
        map.fitBounds(bounds, { padding: [30, 30] });
      }

      leafletMap.current = map;
    };

    initMap();

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [mapData]);

  // Handle city click from EventList
  useEffect(() => {
    if (!leafletMap.current || !selectedCity || !mapData) return;
    const city =
      mapData.visitedCities.find((c) => c.name === selectedCity) ||
      mapData.upcomingCities.find((c) => c.name === selectedCity);
    if (city) {
      leafletMap.current.setView([city.latitude, city.longitude], 10, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedCity, mapData]);

  return (
    <div className="relative">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div
        ref={mapRef}
        className="w-full h-[500px] rounded-2xl border border-border/50 overflow-hidden shadow-lg"
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-border/50 z-[1000]">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            Partida
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-primary" />
            Visitada
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-400" />
            Próximas
          </span>
        </div>
      </div>
    </div>
  );
}
