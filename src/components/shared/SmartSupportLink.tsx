"use client";

import { useSession, signIn } from "next-auth/react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { findNearestCity } from "@/lib/geo-utils";
import { type ReactNode, type MouseEvent, useState } from "react";
import { Loader2 } from "lucide-react";

interface SmartSupportLinkProps {
  children: ReactNode;
  className?: string;
  as?: "a" | "button";
}

/**
 * Smart #SouBraide button:
 * - Not logged in → sign in, redirect back to /#apoie (SupportSection handles auto-register on return)
 * - Logged in, not supporter → register support, refresh map, scroll to map
 * - Already supporter → scroll to map
 */
export function SmartSupportLink({ children, className, as: Tag = "a" }: SmartSupportLinkProps) {
  const { data: session, status, update } = useSession();
  const geo = useGeolocation();
  const [registering, setRegistering] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;
  const isSupporter = user?.isSupporter;

  const scrollToMap = () => {
    // Small delay to allow map re-render after data refresh
    setTimeout(() => {
      const mapEl = document.getElementById("mapa-apoiadores");
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: "smooth" });
      }
    }, 300);
  };

  const registerAndScroll = async () => {
    setRegistering(true);
    try {
      const body: Record<string, unknown> = {};

      if (geo.coords) {
        const nearest = findNearestCity(geo.coords.latitude, geo.coords.longitude);
        if (nearest) body.city = nearest.name;
        body.latitude = geo.coords.latitude;
        body.longitude = geo.coords.longitude;
      }

      const res = await fetch("/api/supporters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        // Refresh session so isSupporter is updated everywhere
        await update();
        // Tell SocialProofSection (and any listener) to reload data
        window.dispatchEvent(new CustomEvent("supporters-updated"));
        scrollToMap();
      }
    } catch {
      // Fallback: scroll to #apoie section so user can use manual flow
      const el = document.getElementById("apoie");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } finally {
      setRegistering(false);
    }
  };

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    if (status === "loading" || registering) return;

    // Not logged in → sign in (on return, will land on /#apoie and SupportSection auto-registers)
    if (!session) {
      signIn("google", { callbackUrl: "/#apoie" });
      return;
    }

    // Already supporter → just scroll to map
    if (isSupporter) {
      scrollToMap();
      return;
    }

    // Logged in but not supporter → register now, then scroll to map
    await registerAndScroll();
  };

  if (registering) {
    return (
      <Tag href="#apoie" className={className} onClick={(e: MouseEvent) => e.preventDefault()}>
        <Loader2 className="w-4 h-4 animate-spin" />
        Registrando...
      </Tag>
    );
  }

  return (
    <Tag href="#apoie" onClick={handleClick} className={className}>
      {children}
    </Tag>
  );
}
