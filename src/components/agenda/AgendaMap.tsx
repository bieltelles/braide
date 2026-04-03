"use client";

import { useEffect, useRef } from "react";

interface CityMarker {
  name: string;
  latitude: number;
  longitude: number;
  visited: boolean;
}

const cities: CityMarker[] = [
  { name: "São Luís", latitude: -2.5307, longitude: -44.2826, visited: true },
  { name: "Imperatriz", latitude: -5.5189, longitude: -47.4616, visited: false },
  { name: "Timon", latitude: -5.0941, longitude: -42.8369, visited: false },
  { name: "Caxias", latitude: -4.8588, longitude: -43.3617, visited: true },
  { name: "Codó", latitude: -4.4553, longitude: -43.8856, visited: true },
  { name: "Bacabal", latitude: -4.2247, longitude: -44.7846, visited: true },
  { name: "Balsas", latitude: -7.5327, longitude: -46.0345, visited: false },
  { name: "Santa Inês", latitude: -3.6668, longitude: -45.3800, visited: true },
  { name: "Chapadinha", latitude: -3.7417, longitude: -43.3541, visited: true },
  { name: "Pinheiro", latitude: -2.5217, longitude: -45.0825, visited: true },
  { name: "Barra do Corda", latitude: -5.5047, longitude: -45.2378, visited: true },
  { name: "Açailândia", latitude: -4.9470, longitude: -47.5003, visited: false },
  { name: "Barreirinhas", latitude: -2.7583, longitude: -42.8267, visited: true },
  { name: "Carolina", latitude: -7.3336, longitude: -47.4700, visited: false },
];

interface AgendaMapProps {
  selectedCity?: string | null;
}

export function AgendaMap({ selectedCity }: AgendaMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix default marker icons
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

      cities.forEach((city) => {
        const color = city.visited ? "#1e40af" : "#94a3b8";
        const radius = city.visited ? 8 : 5;

        const marker = L.circleMarker([city.latitude, city.longitude], {
          radius,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        marker.bindPopup(
          `<div style="text-align:center;font-family:system-ui">
            <strong>${city.name}</strong><br/>
            <span style="color:${city.visited ? "#1e40af" : "#94a3b8"};font-size:12px">
              ${city.visited ? "✓ Visitada" : "Próximas visitas"}
            </span>
          </div>`
        );
      });

      // Draw route lines between visited cities
      const visitedCoords = cities
        .filter((c) => c.visited)
        .map((c) => [c.latitude, c.longitude] as [number, number]);

      if (visitedCoords.length > 1) {
        L.polyline(visitedCoords, {
          color: "#3b82f6",
          weight: 2,
          opacity: 0.4,
          dashArray: "8, 8",
        }).addTo(map);
      }

      leafletMap.current = map;
    };

    initMap();

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, []);

  useEffect(() => {
    if (!leafletMap.current || !selectedCity) return;
    const city = cities.find((c) => c.name === selectedCity);
    if (city) {
      leafletMap.current.setView([city.latitude, city.longitude], 10, {
        animate: true,
        duration: 0.5,
      });
    }
  }, [selectedCity]);

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
