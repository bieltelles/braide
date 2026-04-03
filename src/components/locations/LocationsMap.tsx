"use client";

import { useEffect, useRef } from "react";

interface SupportPoint {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  type: string;
  phone?: string;
  openHours?: string;
}

const typeColors: Record<string, string> = {
  comite: "#1e40af",
  adesivo: "#f59e0b",
  bandeira: "#059669",
};

const typeLabels: Record<string, string> = {
  comite: "Comitê",
  adesivo: "Ponto de Adesivo",
  bandeira: "Ponto de Bandeira",
};

const mockLocations: SupportPoint[] = [
  { id: "1", name: "Comitê Central São Luís", address: "Av. dos Holandeses, 1000 - Calhau", city: "São Luís", latitude: -2.4912, longitude: -44.2335, type: "comite", phone: "(98) 3XXX-0001", openHours: "Seg-Sáb 8h-18h" },
  { id: "2", name: "Comitê Centro Histórico", address: "Rua Portugal, 200 - Centro", city: "São Luís", latitude: -2.5297, longitude: -44.2825, type: "comite", phone: "(98) 3XXX-0002", openHours: "Seg-Sex 9h-17h" },
  { id: "3", name: "Ponto de Adesivo - Cohama", address: "Av. Daniel de La Touche, 500", city: "São Luís", latitude: -2.5100, longitude: -44.2650, type: "adesivo", openHours: "Seg-Sáb 8h-12h" },
  { id: "4", name: "Comitê Imperatriz", address: "Av. Babaçulândia, 800 - Centro", city: "Imperatriz", latitude: -5.5189, longitude: -47.4616, type: "comite", phone: "(99) 3XXX-0003", openHours: "Seg-Sáb 8h-18h" },
  { id: "5", name: "Ponto de Bandeira - Turu", address: "Av. São Luís Rei de França, 1200", city: "São Luís", latitude: -2.5200, longitude: -44.2450, type: "bandeira", openHours: "Seg-Sex 8h-14h" },
  { id: "6", name: "Comitê Timon", address: "Rua Coronel Saíba, 150 - Centro", city: "Timon", latitude: -5.0941, longitude: -42.8369, type: "comite", phone: "(99) 3XXX-0004", openHours: "Seg-Sex 9h-17h" },
  { id: "7", name: "Ponto de Adesivo - Caxias", address: "Praça Gonçalves Dias, s/n", city: "Caxias", latitude: -4.8588, longitude: -43.3617, type: "adesivo", openHours: "Seg-Sáb 8h-12h" },
  { id: "8", name: "Comitê Bacabal", address: "Av. Manoel Inácio, 600", city: "Bacabal", latitude: -4.2247, longitude: -44.7846, type: "comite", phone: "(99) 3XXX-0005", openHours: "Seg-Sex 9h-17h" },
];

interface LocationsMapProps {
  selectedCity?: string | null;
  selectedType: string;
}

export function LocationsMap({ selectedCity, selectedType }: LocationsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      const map = L.map(mapRef.current!, {
        center: [-4.0, -44.5],
        zoom: 7,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      leafletMap.current = map;
      updateMarkers(L);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateMarkers = (L: any) => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const filtered = mockLocations.filter((loc) => {
        if (selectedType !== "all" && loc.type !== selectedType) return false;
        if (selectedCity && loc.city !== selectedCity) return false;
        return true;
      });

      filtered.forEach((loc) => {
        const color = typeColors[loc.type] || "#1e40af";
        const marker = L.circleMarker([loc.latitude, loc.longitude], {
          radius: 9,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(leafletMap.current!);

        marker.bindPopup(
          `<div style="font-family:system-ui;min-width:180px">
            <strong>${loc.name}</strong><br/>
            <span style="font-size:12px;color:#64748b">${loc.address}</span><br/>
            <span style="font-size:11px;color:${color};font-weight:600">${typeLabels[loc.type]}</span>
            ${loc.phone ? `<br/><span style="font-size:12px">📞 ${loc.phone}</span>` : ""}
            ${loc.openHours ? `<br/><span style="font-size:12px">🕐 ${loc.openHours}</span>` : ""}
          </div>`
        );

        markersRef.current.push(marker);
      });
    };

    initMap();

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [selectedCity, selectedType]);

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
            Comitê
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent" />
            Adesivo
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-success" />
            Bandeira
          </span>
        </div>
      </div>
    </div>
  );
}
