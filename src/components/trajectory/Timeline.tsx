"use client";

import { motion } from "motion/react";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
}

const timeline: TimelineEvent[] = [
  {
    year: "2004",
    title: "Início na vida pública",
    description:
      "Eleito Vereador de São Luís com expressiva votação, começando uma trajetória dedicada ao povo maranhense.",
  },
  {
    year: "2006",
    title: "Deputado Estadual",
    description:
      "Eleito Deputado Estadual do Maranhão, atuando em pautas de saúde, educação e infraestrutura.",
  },
  {
    year: "2010",
    title: "Reeleito Deputado Estadual",
    description:
      "Reeleito com votação ampliada, consolidando-se como uma das principais lideranças da Assembleia Legislativa.",
  },
  {
    year: "2014",
    title: "Deputado Federal",
    description:
      "Eleito Deputado Federal pelo Maranhão, levando as demandas do estado ao Congresso Nacional em Brasília.",
  },
  {
    year: "2018",
    title: "Reeleito Deputado Federal",
    description:
      "Reeleito com mais de 100 mil votos, um dos deputados mais votados do estado. Atuação forte em comissões estratégicas.",
  },
  {
    year: "2020",
    title: "Eleito Prefeito de São Luís",
    description:
      "Eleito prefeito da capital maranhense com ampla maioria, trazendo uma nova gestão focada em resultados para a cidade.",
    highlight: true,
  },
  {
    year: "2021-2024",
    title: "Transformação de São Luís",
    description:
      "Como prefeito, realizou a maior transformação urbana da história de São Luís: pavimentação de mais de 1.500 ruas, revitalização do Centro Histórico, reforma de UBS, construção de creches e escolas, e programas sociais inovadores.",
    highlight: true,
  },
  {
    year: "2024",
    title: "Reeleito com 70% dos votos",
    description:
      "Reeleito prefeito de São Luís com mais de 403 mil votos (70%), a maior votação da história da cidade, um reconhecimento popular sem precedentes.",
    highlight: true,
  },
  {
    year: "2026",
    title: "Pré-candidato a Governador",
    description:
      "Com o mesmo compromisso que transformou São Luís, agora busca levar desenvolvimento e oportunidades para todo o Maranhão.",
    highlight: true,
  },
];

export function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary-light to-accent" />

      <div className="space-y-12">
        {timeline.map((event, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={event.year}
              initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`relative flex items-start gap-6 md:gap-0 ${
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Dot */}
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10">
                <div
                  className={`w-4 h-4 rounded-full border-4 ${
                    event.highlight
                      ? "bg-accent border-accent/30 shadow-lg shadow-accent/30"
                      : "bg-primary border-primary/30"
                  }`}
                />
              </div>

              {/* Content */}
              <div className={`ml-12 md:ml-0 md:w-1/2 ${isLeft ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                <div
                  className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                    event.highlight
                      ? "bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 hover:shadow-primary/10"
                      : "bg-white border-border/50 hover:shadow-border/20"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                      event.highlight
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {event.year}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mb-2">{event.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
