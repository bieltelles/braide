import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plano de Governo",
  description: "Plano de governo participativo de Eduardo Braide para o Maranhão. Envie suas sugestões.",
};

export default function PlanoPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Plano de <span className="text-primary">Governo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um plano participativo, construído com o povo maranhense.
          </p>
        </div>
        <div className="text-center text-muted-foreground py-20">
          Em breve: Plano de governo detalhado com sistema de sugestões participativas.
        </div>
      </div>
    </div>
  );
}
