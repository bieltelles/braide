import type { Metadata } from "next";
import { PlanCategories } from "@/components/plan/PlanCategories";
import { SuggestionForm } from "@/components/plan/SuggestionForm";

export const metadata: Metadata = {
  title: "Plano de Governo",
  description:
    "Plano de governo participativo de Eduardo Braide para o Maranhão. Conheça as propostas e envie suas sugestões.",
};

export default function PlanoPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm font-semibold">Construído com o povo</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Plano de <span className="text-primary">Governo</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Um plano participativo, construído com os maranhenses.
            Conheça as propostas por área e envie suas sugestões.
          </p>
        </div>

        {/* Categories */}
        <PlanCategories />

        {/* Suggestion Form */}
        <SuggestionForm />
      </div>
    </div>
  );
}
