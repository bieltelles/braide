import type { Metadata } from "next";
import { LocationsContent } from "@/components/locations/LocationsContent";

export const metadata: Metadata = {
  title: "Pontos de Apoio",
  description:
    "Encontre comitês, pontos de adesivo e bandeiras de Eduardo Braide perto de você.",
};

export default function PontosDeApoioPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm font-semibold">Encontre perto de você</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Pontos de <span className="text-primary">Apoio</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre comitês, pontos de adesivo e bandeiras em todo o Maranhão.
            Visite o ponto mais próximo e pegue seus materiais.
          </p>
        </div>

        <LocationsContent />
      </div>
    </div>
  );
}
