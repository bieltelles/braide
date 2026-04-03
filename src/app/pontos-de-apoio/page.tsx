import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pontos de Apoio",
  description: "Encontre comitês, pontos de adesivo e bandeiras de Eduardo Braide perto de você.",
};

export default function PontosDeApoioPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Pontos de <span className="text-primary">Apoio</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontre comitês e locais para materiais de campanha perto de você.
          </p>
        </div>
        <div className="text-center text-muted-foreground py-20">
          Em breve: Mapa com pontos de apoio por cidade.
        </div>
      </div>
    </div>
  );
}
