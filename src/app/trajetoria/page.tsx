import type { Metadata } from "next";
import { Timeline } from "@/components/trajectory/Timeline";
import { Achievements } from "@/components/trajectory/Achievements";
import { ShareButton } from "@/components/shared/ShareButton";

export const metadata: Metadata = {
  title: "Trajetória Política",
  description:
    "Conheça a trajetória política de Eduardo Braide: do legislativo à prefeitura mais aprovada do Brasil.",
};

export default function TrajetoriaPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 mb-4">
            <span className="text-sm font-semibold">Mais de 20 anos de vida pública</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Trajetória <span className="text-primary">Política</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Uma carreira dedicada ao Maranhão, com resultados comprovados que falam por si.
            Do legislativo à prefeitura mais aprovada entre todas as capitais do Brasil.
          </p>
          <ShareButton text="Conheça a trajetória política de Eduardo Braide!" />
        </div>

        {/* Timeline */}
        <Timeline />

        {/* Achievements */}
        <Achievements />
      </div>
    </div>
  );
}
