"use client";

import { useState, useEffect } from "react";

interface GeoState {
  coords: { latitude: number; longitude: number } | null;
  error: boolean;
  loading: boolean;
}

// Module-level singleton so multiple components share one result
let cachedState: GeoState | null = null;
let listeners: ((state: GeoState) => void)[] = [];
let requested = false;

function notifyAll(state: GeoState) {
  cachedState = state;
  listeners.forEach((fn) => fn(state));
}

function requestOnce() {
  if (requested) return;
  requested = true;

  if (typeof navigator === "undefined" || !navigator.geolocation) {
    notifyAll({ coords: null, error: true, loading: false });
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      notifyAll({
        coords: { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
        error: false,
        loading: false,
      });
    },
    () => {
      notifyAll({ coords: null, error: true, loading: false });
    },
    { timeout: 6000, maximumAge: 300000 }
  );
}

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>(
    cachedState || { coords: null, error: false, loading: true }
  );

  useEffect(() => {
    if (cachedState) {
      setState(cachedState);
      return;
    }

    listeners.push(setState);
    requestOnce();

    return () => {
      listeners = listeners.filter((fn) => fn !== setState);
    };
  }, []);

  return state;
}
