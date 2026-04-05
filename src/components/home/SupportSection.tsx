"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { SupportButton } from "./SupportButton";

export function SupportSection() {
  const { data: session, status } = useSession();
  const [isSupporter, setIsSupporter] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      setChecking(false);
      return;
    }
    // Check if already supporter
    fetch("/api/supporters")
      .then((r) => r.json())
      .then((data) => {
        const found = data.supporters?.find(
          (s: { id: string }) => s.id === (session.user as { id?: string }).id
        );
        if (found) setIsSupporter(true);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [session, status]);

  const handleSupport = async (city?: string) => {
    try {
      const res = await fetch("/api/supporters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      if (res.ok) setIsSupporter(true);
    } catch {}
  };

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/#apoie" });
  };

  if (checking && status === "loading") return null;

  return (
    <SupportButton
      isAuthenticated={!!session?.user}
      isSupporter={isSupporter}
      userName={session?.user?.name || null}
      userImage={session?.user?.image || null}
      onSupport={handleSupport}
      onSignIn={handleSignIn}
    />
  );
}
