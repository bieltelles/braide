"use client";

import { SupportButton } from "./SupportButton";

export function SupportSection() {
  const handleSupport = async () => {
    // In production, POST to /api/supporters
    console.log("Support registered");
  };

  const handleSignIn = (provider: string) => {
    // In production, use next-auth signIn
    console.log("Sign in with:", provider);
  };

  return (
    <SupportButton
      isAuthenticated={false}
      isSupporter={false}
      onSupport={handleSupport}
      onSignIn={handleSignIn}
    />
  );
}
