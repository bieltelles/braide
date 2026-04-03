"use client";

import { SupportButton } from "./SupportButton";
import { signIn } from "next-auth/react";

export function SupportSection() {
  const handleSupport = async () => {
    try {
      await fetch("/api/supporters", { method: "POST" });
    } catch (error) {
      console.error("Failed to register support:", error);
    }
  };

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/#apoie" });
  };

  // For now, show the unauthenticated state
  return (
    <SupportButton
      isAuthenticated={false}
      isSupporter={false}
      onSupport={handleSupport}
      onSignIn={handleSignIn}
    />
  );
}
