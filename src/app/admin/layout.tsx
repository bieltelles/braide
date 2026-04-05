"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Download,
  MapPin,
  Users,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/apoiadores", label: "Apoiadores", icon: Users },
  { href: "/admin/sugestoes", label: "Sugestões", icon: MessageSquare },
  { href: "/admin/eventos", label: "Eventos", icon: Calendar },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/pontos-de-apoio", label: "Pontos de Apoio", icon: MapPin },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="pt-16 min-h-screen bg-muted/30">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col fixed top-16 bottom-0 border-r border-border/50 bg-white">
          <div className="p-4 border-b border-border/50">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao site
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile nav */}
        <div className="lg:hidden fixed top-16 left-0 right-0 z-40 bg-white border-b border-border/50 px-4 py-2 overflow-x-auto">
          <div className="flex gap-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 lg:ml-64 p-6 lg:p-8 mt-12 lg:mt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
