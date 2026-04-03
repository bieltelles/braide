"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { KmCounter } from "./KmCounter";
import { EventList } from "./EventList";

const AgendaMap = dynamic(
  () => import("./AgendaMap").then((mod) => mod.AgendaMap),
  { ssr: false, loading: () => <div className="w-full h-[500px] rounded-2xl bg-muted animate-pulse" /> }
);

const filters = [
  { value: "all", label: "Todos" },
  { value: "upcoming", label: "Próximos" },
  { value: "past", label: "Realizados" },
];

export function AgendaContent() {
  const [filter, setFilter] = useState("all");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  return (
    <>
      <KmCounter />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Map */}
        <div className="lg:col-span-3">
          <AgendaMap selectedCity={selectedCity} />
        </div>

        {/* Events */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  filter === f.value
                    ? "bg-primary text-white shadow-md"
                    : "bg-white text-muted-foreground border border-border/50 hover:bg-muted"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
            <EventList filter={filter} onCityClick={setSelectedCity} />
          </div>
        </div>
      </div>
    </>
  );
}
