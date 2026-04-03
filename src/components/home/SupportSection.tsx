"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { SupportButton } from "./SupportButton";

export function SupportSection() {
  const { data: session } = useSession();
  const [isSupporter, setIsSupporter] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/supporters")
        .then((r) => r.json())
        .then((data) => {
          if (data.isSupporter) setIsSupporter(true);
        })
        .catch(() => {});
    }
  }, [session]);

  const handleSupport = async () => {
    try {
      const res = await fetch("/api/supporters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) setIsSupporter(true);
    } catch {}
  };

  const handleSignIn = (provider: string) => {
    signIn(provider);
  };

  return (
    <SupportButton
      isAuthenticated={!!session?.user}
      isSupporter={isSupporter}
      onSupport={handleSupport}
      onSignIn={handleSignIn}
    />
  );
}
