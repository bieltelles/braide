"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X, MapPin, FileText, Download, Users, Calendar, ChevronRight } from "lucide-react";
import { SmartSupportLink } from "./SmartSupportLink";
import { BraideAvatar } from "./BraideAvatar";

const navLinks = [
  { href: "/trajetoria", label: "Trajetória", icon: ChevronRight },
  { href: "/agenda", label: "Agenda", icon: Calendar },
  { href: "/plano-de-governo", label: "Plano de Governo", icon: FileText },
  { href: "/downloads", label: "Downloads", icon: Download },
  { href: "/pontos-de-apoio", label: "Pontos de Apoio", icon: MapPin },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center gap-1">
              <BraideAvatar className="shadow-lg shadow-primary/20" />
              <div className="ml-2 hidden sm:block">
                <p className="text-sm font-bold text-primary leading-none">Eduardo Braide</p>
                <p className="text-xs text-muted-foreground">Governador do Maranhão</p>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <SmartSupportLink
              className="inline-flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-accent/25 hover:bg-accent-dark hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              #SouBraide
            </SmartSupportLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-96 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 transition-all"
              >
                <link.icon className="w-4 h-4 text-primary/60" />
                {link.label}
              </Link>
            ))}
            <SmartSupportLink
              className="flex items-center justify-center gap-2 mt-2 bg-accent text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-lg cursor-pointer"
            >
              <Users className="w-4 h-4" />
              #SouBraide
            </SmartSupportLink>
          </div>
        </div>
      </nav>
    </header>
  );
}
