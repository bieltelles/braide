"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-16">
      <div className="text-center px-4">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
          Algo deu errado
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          Ocorreu um erro inesperado. Por favor, tente novamente.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="w-4 h-4" />
            Tentar Novamente
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline">
              <Home className="w-4 h-4" />
              Início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
