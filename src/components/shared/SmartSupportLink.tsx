"use client";

import { useSession, signIn } from "next-auth/react";
import { Users } from "lucide-react";
import { type ReactNode, type MouseEvent } from "react";

interface SmartSupportLinkProps {
  children: ReactNode;
  className?: string;
  /** Which HTML element wrapper to use */
  as?: "a" | "button";
}

/**
 * Smart #SouBraide link:
 * - Not logged in → triggers Google sign-in (redirects back to /#apoie)
 * - Logged in, not supporter → scrolls to #apoie section
 * - Logged in, already supporter → scrolls to #mapa-apoiadores (the map)
 */
export function SmartSupportLink({ children, className, as: Tag = "a" }: SmartSupportLinkProps) {
  const { data: session, status } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = session?.user as any;
  const isSupporter = user?.isSupporter;

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();

    if (status === "loading") return;

    if (!session) {
      // Not logged in → sign in directly
      signIn("google", { callbackUrl: "/#apoie" });
      return;
    }

    if (isSupporter) {
      // Already supporter → scroll to map
      const mapEl = document.getElementById("mapa-apoiadores");
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    // Logged in but not supporter → scroll to support section
    const apoieEl = document.getElementById("apoie");
    if (apoieEl) {
      apoieEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Tag href="#apoie" onClick={handleClick} className={className}>
      {children}
    </Tag>
  );
}
