"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Heart, Check, Loader2, MapPin } from "lucide-react";
import { useState } from "react";
import { topCitiesByPopulation } from "@/lib/geo-utils";

interface SupportButtonProps {
  isAuthenticated: boolean;
  isSupporter: boolean;
  userName: string | null;
  userImage: string | null;
  detectedCity: string | null;
  geoLoading: boolean;
  geoAvailable: boolean;
  autoRegistering: boolean;
  onManualSupport: (city: string) => Promise<void>;
  onSignIn: (provider: string) => void;
}

export function SupportButton({
  isAuthenticated,
  isSupporter,
  userName,
  userImage,
  detectedCity,
  geoLoading,
  geoAvailable,
  autoRegistering,
  onManualSupport,
  onSignIn,
}: SupportButtonProps) {
  const [manualSaving, setManualSaving] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  // State: already supporter — show confirmation
  if (isSupporter) {
    return (
      <section id="apoie" className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border-4 border-success/30 shadow-lg">
              {userImage ? (
                <img src={userImage} alt={userName || ""} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-success to-success-light flex items-center justify-center text-white text-2xl font-bold">
                  <Check className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-2xl border border-success/20 mb-3">
              <Check className="w-5 h-5" />
              <span className="font-semibold">
                {userName ? `${userName}, você` : "Você"} já declarou apoio!
              </span>
            </div>
            {detectedCity && (
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {detectedCity}
              </p>
            )}
            <p className="mt-4 text-accent font-bold text-xl">#SouBraide</p>
          </motion.div>
        </div>
      </section>
    );
  }

  // State: authenticated, waiting for geo or auto-registering
  if (isAuthenticated && (geoLoading || autoRegistering)) {
    return (
      <section id="apoie" className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-3 border-primary/30 shadow-md">
              {userImage ? (
                <img src={userImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg">
                  {(userName || "?").charAt(0)}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">Detectando sua cidade...</span>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  // State: authenticated, geo failed — show fallback dropdown
  if (isAuthenticated && !geoAvailable) {
    const handleQuickSelect = async (city: string) => {
      if (city === "__search__") {
        setShowSearch(true);
        return;
      }
      setManualSaving(true);
      await onManualSupport(city);
      setManualSaving(false);
    };

    const handleSearchSelect = async (city: string) => {
      setManualSaving(true);
      await onManualSupport(city);
      setManualSaving(false);
    };

    return (
      <section id="apoie" className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden border-3 border-primary/30 shadow-md">
              {userImage ? (
                <img src={userImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg">
                  {(userName || "?").charAt(0)}
                </div>
              )}
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1">
              {userName ? `Olá, ${userName.split(" ")[0]}!` : "Quase lá!"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selecione sua cidade para declarar apoio:
            </p>

            {manualSaving ? (
              <div className="flex items-center justify-center gap-2 text-primary py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">Registrando...</span>
              </div>
            ) : !showSearch ? (
              <div className="max-w-xs mx-auto">
                <select
                  onChange={(e) => handleQuickSelect(e.target.value)}
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-xl border border-border/50 bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer mb-2"
                >
                  <option value="" disabled>Escolha sua cidade...</option>
                  {topCitiesByPopulation.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                  <option value="__search__">Outra cidade...</option>
                </select>
              </div>
            ) : (
              <div className="max-w-xs mx-auto relative">
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Digite o nome da cidade..."
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                {citySearch.length >= 2 && (
                  <CitySearchResults query={citySearch} onSelect={handleSearchSelect} />
                )}
                <button
                  onClick={() => setShowSearch(false)}
                  className="mt-2 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  Voltar para lista rápida
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  // State: not authenticated — show providers inline
  return (
    <section id="apoie" className="py-20 bg-gradient-to-br from-primary/5 via-white to-accent/5">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
            <Heart className="w-10 h-10 text-accent" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
            <span className="text-accent">#SouBraide</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
            Declare seu apoio a Eduardo Braide. Sua foto aparecerá no mapa de apoiadores
            e seus amigos poderão ver que você faz parte desse movimento.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
            <Button
              onClick={() => onSignIn("google")}
              className="bg-white border border-border text-foreground hover:bg-muted shadow-sm w-full sm:w-auto px-6 py-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Entrar com Google
            </Button>
            <Button
              onClick={() => onSignIn("facebook")}
              className="bg-[#1877F2] text-white hover:bg-[#166FE5] shadow-sm w-full sm:w-auto px-6 py-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Entrar com Facebook
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Ao entrar, sua foto e cidade serão coletadas automaticamente para o mapa de apoiadores.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/** Inline city search results (used only in fallback when geo fails) */
function CitySearchResults({ query, onSelect }: { query: string; onSelect: (city: string) => void }) {
  // Import the full cities list for search
  const [cities, setCities] = useState<string[]>([]);

  useState(() => {
    import("@/data/maranhao-cities").then((mod) => {
      setCities(mod.maranhaoCities.map((c) => c.name));
    });
  });

  const filtered = cities
    .filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8);

  if (filtered.length === 0) return null;

  return (
    <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-border/50 rounded-xl shadow-lg max-h-48 overflow-y-auto">
      {filtered.map((city) => (
        <button
          key={city}
          onClick={() => onSelect(city)}
          className="w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer"
        >
          {city}
        </button>
      ))}
    </div>
  );
}
