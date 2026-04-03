import type { Metadata } from "next";
import { AgendaContent } from "@/components/agenda/AgendaContent";

export const metadata: Metadata = {
  title: "Agenda",
  description:
    "Acompanhe a agenda de Eduardo Braide pelo Maranhão. Mapa interativo com cidades visitadas e km percorridos.",
};

export default function AgendaPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm font-semibold">Percorrendo o Maranhão</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Agenda pelo <span className="text-primary">Maranhão</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acompanhe as visitas de Braide por todo o estado. Cada cidade, cada história, cada compromisso.
          </p>
        </div>

        <AgendaContent />
      </div>
    </div>
  );
}
