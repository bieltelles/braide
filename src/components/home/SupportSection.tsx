"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { findNearestCity } from "@/lib/geo-utils";
import { SupportButton } from "./SupportButton";

export function SupportSection() {
  const { data: session, status, update } = useSession();
  const geo = useGeolocation();
  const [isSupporter, setIsSupporter] = useState(false);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [autoRegistering, setAutoRegistering] = useState(false);
  const autoRegisterAttempted = useRef(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;
  const isAuthenticated = !!user;

  // Check supporter status from session
  useEffect(() => {
    if (user?.isSupporter) {
      setIsSupporter(true);
      if (user?.city) setDetectedCity(user.city);
    }
  }, [user]);

  // Auto-register when returning from OAuth (URL has #apoie) + geo available
  useEffect(() => {
    if (!isAuthenticated || isSupporter || autoRegisterAttempted.current || status === "loading") return;
    if (geo.loading) return;

    autoRegisterAttempted.current = true;

    if (geo.coords) {
      const nearest = findNearestCity(geo.coords.latitude, geo.coords.longitude);
      if (nearest) {
        setDetectedCity(nearest.name);
        setAutoRegistering(true);
        fetch("/api/supporters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            city: nearest.name,
            latitude: geo.coords.latitude,
            longitude: geo.coords.longitude,
          }),
        })
          .then(async (r) => {
            if (r.ok) {
              setIsSupporter(true);
              await update();
              // Notify map to reload and scroll to it
              window.dispatchEvent(new CustomEvent("supporters-updated"));
              setTimeout(() => {
                const mapEl = document.getElementById("mapa-apoiadores");
                if (mapEl) mapEl.scrollIntoView({ behavior: "smooth" });
              }, 300);
            }
          })
          .catch(() => {})
          .finally(() => setAutoRegistering(false));
        return;
      }
    }
    // Geo failed or city too far — fallback shown by SupportButton
  }, [isAuthenticated, isSupporter, status, geo.loading, geo.coords, update]);

  const handleManualSupport = async (city: string) => {
    try {
      const body: Record<string, unknown> = { city };
      if (geo.coords) {
        body.latitude = geo.coords.latitude;
        body.longitude = geo.coords.longitude;
      }
      const res = await fetch("/api/supporters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setIsSupporter(true);
        setDetectedCity(city);
        await update();
        // Notify map and scroll to it
        window.dispatchEvent(new CustomEvent("supporters-updated"));
        setTimeout(() => {
          const mapEl = document.getElementById("mapa-apoiadores");
          if (mapEl) mapEl.scrollIntoView({ behavior: "smooth" });
        }, 300);
      }
    } catch {}
  };

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/#apoie" });
  };

  if (status === "loading") return null;

  return (
    <SupportButton
      isAuthenticated={isAuthenticated}
      isSupporter={isSupporter}
      userName={user?.name || null}
      userImage={user?.image || null}
      detectedCity={detectedCity}
      geoLoading={geo.loading}
      geoAvailable={!!geo.coords}
      autoRegistering={autoRegistering}
      onManualSupport={handleManualSupport}
      onSignIn={handleSignIn}
    />
  );
}
