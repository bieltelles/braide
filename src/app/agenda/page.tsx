import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agenda",
  description: "Acompanhe a agenda de Eduardo Braide pelo Maranhão. Mapa interativo com cidades visitadas.",
};

export default function AgendaPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Agenda pelo <span className="text-primary">Maranhão</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Acompanhe as visitas de Braide por todo o estado.
          </p>
        </div>
        <div className="text-center text-muted-foreground py-20">
          Em breve: Mapa interativo do Maranhão com calendário de eventos e contador de km.
        </div>
      </div>
    </div>
  );
}
