"use client";

import { useEffect, useRef, useState } from "react";

interface CityGroup {
  name: string;
  lat: number;
  lng: number;
  count: number;
  supporters: { id: string; name: string | null; image: string | null }[];
}

interface SupportersMapProps {
  cities: CityGroup[];
  userLat: number;
  userLng: number;
}

export function SupportersMap({ cities, userLat, userLng }: SupportersMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      const center: [number, number] = userLat && userLng
        ? [userLat, userLng]
        : [-4.5, -44.5];

      const map = L.map(mapRef.current!, {
        center,
        zoom: userLat ? 9 : 7,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 18,
      }).addTo(map);

      leafletMap.current = map;

      // Add city markers as custom div markers with avatars
      cities.forEach((city) => {
        const size = Math.min(60, Math.max(32, 28 + Math.log2(city.count + 1) * 8));
        const firstImage = city.supporters.find((s) => s.image)?.image;

        const icon = L.divIcon({
          className: "supporter-marker",
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              background: ${firstImage ? `url(${firstImage}) center/cover` : "linear-gradient(135deg, #1e40af, #3b82f6)"};
              border: 3px solid #fff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              position: relative;
              transition: transform 0.2s;
            ">
              <div style="
                position: absolute;
                bottom: -4px;
                right: -4px;
                background: #f59e0b;
                color: #fff;
                font-size: 10px;
                font-weight: 700;
                min-width: 20px;
                height: 20px;
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 4px;
                border: 2px solid #fff;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              ">${city.count}</div>
              ${!firstImage ? `<span style="color:#fff;font-weight:700;font-size:${size * 0.35}px">${city.name.charAt(0)}</span>` : ""}
            </div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);

        // Popup with supporter avatars
        const avatarsHtml = city.supporters
          .slice(0, 6)
          .map((s) =>
            s.image
              ? `<div style="width:36px;height:36px;border-radius:50%;overflow:hidden;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.15);flex-shrink:0">
                  <img src="${s.image}" style="width:100%;height:100%;object-fit:cover" alt="${s.name || ""}" />
                </div>`
              : `<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1e40af,#3b82f6);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:14px;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.15);flex-shrink:0">${(s.name || "?").charAt(0)}</div>`
          )
          .join("");

        const remaining = city.count - 6;

        marker.bindPopup(
          `<div style="font-family:system-ui;min-width:200px;max-width:260px;padding:4px 0">
            <div style="font-weight:700;font-size:15px;margin-bottom:2px;color:#1e293b">${city.name}</div>
            <div style="font-size:12px;color:#f59e0b;font-weight:600;margin-bottom:8px">${city.count} apoiador${city.count > 1 ? "es" : ""}</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center">
              ${avatarsHtml}
              ${remaining > 0 ? `<div style="width:36px;height:36px;border-radius:50%;background:#eff6ff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#1e40af;border:2px dashed #93c5fd">+${remaining}</div>` : ""}
            </div>
          </div>`,
          { maxWidth: 280 }
        );

        marker.on("mouseover", function () {
          const el = marker.getElement();
          if (el) el.style.transform += " scale(1.15)";
        });
        marker.on("mouseout", function () {
          const el = marker.getElement();
          if (el) el.style.transform = el.style.transform.replace(" scale(1.15)", "");
        });
      });

      // User location marker
      if (userLat && userLng) {
        const userIcon = L.divIcon({
          className: "user-location-marker",
          html: `
            <div style="
              width: 16px; height: 16px; border-radius: 50%;
              background: #3b82f6; border: 3px solid #fff;
              box-shadow: 0 0 0 4px rgba(59,130,246,0.3), 0 2px 8px rgba(0,0,0,0.2);
            "></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<div style="font-family:system-ui;font-size:13px;font-weight:600;color:#3b82f6">Você está aqui</div>');
      }

      // Fit bounds
      if (cities.length > 0) {
        const bounds = L.latLngBounds(cities.map((c) => [c.lat, c.lng] as [number, number]));
        if (userLat && userLng) bounds.extend([userLat, userLng]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
      }
    };

    initMap();

    return () => {
      leafletMap.current?.remove();
      leafletMap.current = null;
    };
  }, [cities, userLat, userLng]);

  return (
    <div className="relative">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div
        ref={mapRef}
        className="w-full h-[500px] sm:h-[550px] rounded-2xl border border-border/50 overflow-hidden shadow-xl"
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-border/50 z-[1000]">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary-light" />
            Apoiadores
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-accent" />
            Contagem
          </span>
          {userLat > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-200" />
              Você
            </span>
          )}
        </div>
      </div>

      {/* Top right: total */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-border/50 z-[1000]">
        <div className="text-xs text-muted-foreground">Total em</div>
        <div className="font-bold text-primary text-sm">{cities.length} cidades</div>
      </div>

      {/* Selected city detail panel */}
      {selectedCity && (
        <div className="absolute top-4 left-4 bg-white rounded-xl p-4 shadow-lg border border-border/50 z-[1000] max-w-[240px]">
          <button
            onClick={() => setSelectedCity(null)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground text-lg cursor-pointer"
          >
            &times;
          </button>
          <h4 className="font-bold text-foreground text-sm">{selectedCity.name}</h4>
          <p className="text-xs text-accent font-semibold mb-2">{selectedCity.count} apoiadores</p>
          <div className="flex flex-wrap gap-1">
            {selectedCity.supporters.slice(0, 8).map((s) => (
              <div key={s.id} className="w-8 h-8 rounded-full overflow-hidden border border-white shadow-sm">
                {s.image ? (
                  <img src={s.image} alt={s.name || ""} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold">
                    {(s.name || "?").charAt(0)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
