"use client";

import { useState } from "react";

interface BraideAvatarProps {
  size?: "sm" | "md";
  rounded?: "xl" | "full";
  className?: string;
}

export function BraideAvatar({ size = "md", rounded = "xl", className = "" }: BraideAvatarProps) {
  const [failed, setFailed] = useState(false);

  const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-lg";
  const roundedClass = rounded === "full" ? "rounded-full" : "rounded-xl";

  if (failed) {
    return (
      <div className={`${sizeClasses} ${roundedClass} bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold ${className}`}>
        EB
      </div>
    );
  }

  return (
    <div className={`${sizeClasses} ${roundedClass} overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/braide-profile.jpg"
        alt="Eduardo Braide"
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
