"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { LocationsList } from "./LocationsList";
import { Building2, Tag, Flag, LayoutGrid } from "lucide-react";

const LocationsMap = dynamic(
  () => import("./LocationsMap").then((mod) => mod.LocationsMap),
  { ssr: false, loading: () => <div className="w-full h-[500px] rounded-2xl bg-muted animate-pulse" /> }
);

const typeFilters = [
  { value: "all", label: "Todos", icon: LayoutGrid },
  { value: "comite", label: "Comitês", icon: Building2 },
  { value: "adesivo", label: "Adesivos", icon: Tag },
  { value: "bandeira", label: "Bandeiras", icon: Flag },
];

const cityOptions = [
  "", "São Luís", "Imperatriz", "Timon", "Caxias", "Bacabal",
];

export function LocationsContent() {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setSelectedType(f.value)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedType === f.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-muted-foreground border border-border/50 hover:bg-muted"
              }`}
            >
              <f.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{f.label}</span>
            </button>
          ))}
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border/50 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Todas as cidades</option>
          {cityOptions.filter(Boolean).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Map + List */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <LocationsMap selectedCity={selectedCity || null} selectedType={selectedType} />
        </div>
        <div className="lg:col-span-2">
          <div className="max-h-[500px] overflow-y-auto pr-1">
            <LocationsList
              selectedType={selectedType}
              selectedCity={selectedCity}
              onCityClick={setSelectedCity}
            />
          </div>
        </div>
      </div>
    </>
  );
}
