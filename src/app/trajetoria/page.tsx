import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trajetória Política",
  description: "Conheça a trajetória política de Eduardo Braide e seus resultados como prefeito de São Luís.",
};

export default function TrajetoriaPage() {
  return (
    <div className="pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground mb-4">
            Trajetória <span className="text-primary">Política</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mais de 20 anos de vida pública dedicados ao Maranhão.
          </p>
        </div>
        <div className="text-center text-muted-foreground py-20">
          Em breve: Timeline interativa com conquistas e resultados.
        </div>
      </div>
    </div>
  );
}
