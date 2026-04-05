"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Clock, Building2, Tag, Flag, Loader2 } from "lucide-react";

interface SupportPoint {
  id: string;
  name: string;
  address: string;
  city: { id: string; name: string } | null;
  type: string;
  phone?: string | null;
  openHours?: string | null;
}

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  comite: { label: "Comitê", icon: Building2, color: "bg-primary/10 text-primary" },
  adesivo: { label: "Ponto de Adesivo", icon: Tag, color: "bg-accent/10 text-accent-dark" },
  bandeira: { label: "Ponto de Bandeira", icon: Flag, color: "bg-success/10 text-success" },
};

const fallbackLocations: SupportPoint[] = [
  { id: "1", name: "Comitê Central São Luís", address: "Av. dos Holandeses, 1000 - Calhau", city: { id: "1", name: "São Luís" }, type: "comite", phone: "(98) 3XXX-0001", openHours: "Seg-Sáb 8h-18h" },
  { id: "2", name: "Comitê Centro Histórico", address: "Rua Portugal, 200 - Centro", city: { id: "2", name: "São Luís" }, type: "comite", phone: "(98) 3XXX-0002", openHours: "Seg-Sex 9h-17h" },
  { id: "3", name: "Ponto de Adesivo - Cohama", address: "Av. Daniel de La Touche, 500", city: { id: "3", name: "São Luís" }, type: "adesivo", openHours: "Seg-Sáb 8h-12h" },
  { id: "4", name: "Comitê Imperatriz", address: "Av. Babaçulândia, 800 - Centro", city: { id: "4", name: "Imperatriz" }, type: "comite", phone: "(99) 3XXX-0003", openHours: "Seg-Sáb 8h-18h" },
  { id: "5", name: "Ponto de Bandeira - Turu", address: "Av. São Luís Rei de França, 1200", city: { id: "5", name: "São Luís" }, type: "bandeira", openHours: "Seg-Sex 8h-14h" },
  { id: "6", name: "Comitê Timon", address: "Rua Coronel Saíba, 150 - Centro", city: { id: "6", name: "Timon" }, type: "comite", phone: "(99) 3XXX-0004", openHours: "Seg-Sex 9h-17h" },
  { id: "7", name: "Ponto de Adesivo - Caxias", address: "Praça Gonçalves Dias, s/n", city: { id: "7", name: "Caxias" }, type: "adesivo", openHours: "Seg-Sáb 8h-12h" },
  { id: "8", name: "Comitê Bacabal", address: "Av. Manoel Inácio, 600", city: { id: "8", name: "Bacabal" }, type: "comite", phone: "(99) 3XXX-0005", openHours: "Seg-Sex 9h-17h" },
];

interface LocationsListProps {
  selectedType: string;
  selectedCity: string;
  onCityClick: (city: string) => void;
}

export function LocationsList({ selectedType, selectedCity, onCityClick }: LocationsListProps) {
  const [locations, setLocations] = useState<SupportPoint[]>(fallbackLocations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/locations")
      .then((r) => r.json())
      .then((data) => {
        if (data.locations?.length) {
          setLocations(data.locations);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = locations.filter((loc) => {
    const cityName = loc.city?.name || "";
    if (selectedType !== "all") {
      const types = loc.type ? loc.type.split(",") : [];
      if (!types.includes(selectedType)) return false;
    }
    if (selectedCity && cityName !== selectedCity) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Carregando pontos de apoio...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filtered.map((loc, i) => {
        const types = loc.type ? loc.type.split(",") : [];
        const firstConfig = typeConfig[types[0]] || typeConfig.comite;
        const FirstIcon = firstConfig.icon;
        const cityName = loc.city?.name || "";
        return (
          <motion.div
            key={loc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-border/50 p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => onCityClick(cityName)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-lg ${firstConfig.color} flex items-center justify-center flex-shrink-0`}>
                <FirstIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-sm text-foreground truncate">{loc.name}</h3>
                  {types.map((t) => {
                    const cfg = typeConfig[t];
                    return cfg ? (
                      <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    ) : null;
                  })}
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-primary flex-shrink-0" />
                    {loc.address} - {cityName}
                  </p>
                  {loc.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-primary flex-shrink-0" />
                      {loc.phone}
                    </p>
                  )}
                  {loc.openHours && (
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-primary flex-shrink-0" />
                      {loc.openHours}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>Nenhum ponto de apoio encontrado para este filtro.</p>
        </div>
      )}
    </div>
  );
}
