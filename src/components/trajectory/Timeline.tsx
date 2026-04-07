"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface TimelineDetail {
  text: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  highlight?: boolean;
  details?: TimelineDetail[];
}

const timeline: TimelineEvent[] = [
  {
    year: "1976",
    title: "Nascimento em São Luís",
    description:
      "Eduardo Salim Braide nasce em 12 de janeiro de 1976 em São Luís, Maranhão. Formou-se em Direito pela Universidade Federal do Maranhão (UFMA).",
  },
  {
    year: "2005",
    title: "Diretor-Presidente da CAEMA",
    description:
      "Aos 29 anos, assume a presidência da Companhia de Saneamento Ambiental do Maranhão (CAEMA) no governo José Reinaldo Tavares, sua primeira experiência como gestor público.",
  },
  {
    year: "2009",
    title: "Secretário do Orçamento Participativo",
    description:
      "Atua como Secretário do Orçamento Participativo de São Luís na gestão do prefeito João Castelo, aproximando a população das decisões de investimento da cidade.",
  },
  {
    year: "2010",
    title: "Eleito Deputado Estadual",
    description:
      "Eleito Deputado Estadual do Maranhão pelo PMN, iniciando sua trajetória no Legislativo com foco em saúde, educação e fiscalização.",
    details: [
      { text: "Ao longo de dois mandatos, apresentou 328 matérias legislativas na Assembleia do Maranhão" },
      { text: "Eleito 2° Vice-Presidente da Assembleia Legislativa (ALEMA)" },
    ],
  },
  {
    year: "2014",
    title: "Reeleito Deputado Estadual",
    description:
      "Reeleito com votação ampliada, consolida-se como uma das principais lideranças da Assembleia Legislativa do Maranhão.",
    details: [
      { text: "Ocupou o cargo de 2° Vice-Presidente da ALEMA" },
      { text: "Atuação destacada em pautas de saúde e educação" },
    ],
  },
  {
    year: "2018",
    title: "Eleito Deputado Federal",
    description:
      "Eleito Deputado Federal pelo Maranhão, levando as demandas do estado ao Congresso Nacional em Brasília.",
    details: [
      { text: "Titular da Comissão de Saúde da Câmara dos Deputados" },
      { text: "Autor do PL 1605/2019, que criou o Estatuto da Pessoa com Câncer — transformado na Lei Federal 14.238/2021" },
      { text: "Atuou nas comissões especiais do FUNDEB, da Reforma Tributária e da Política de Mobilidade Urbana" },
      { text: "Participou da comissão do PL 1095/19 sobre Reclusão por Maus-Tratos a Animais" },
    ],
  },
  {
    year: "2020",
    title: "Eleito Prefeito de São Luís",
    description:
      "Renuncia ao mandato de deputado federal e é eleito prefeito da capital maranhense, trazendo uma gestão focada em resultados concretos para a população.",
    highlight: true,
    details: [
      { text: "Assumiu em janeiro de 2021, em plena pandemia de Covid-19" },
      { text: "Coordenou a campanha de vacinação em massa na capital" },
    ],
  },
  {
    year: "2021–2024",
    title: "Transformação de São Luís",
    description:
      "Como prefeito, promove ampla transformação na infraestrutura da cidade: reforma de escolas, construção de creches de tempo integral, entrega de unidades de saúde e obras viárias em bairros da periferia.",
    highlight: true,
    details: [
      { text: "Mais de 170 escolas municipais reformadas e entregues com nova infraestrutura" },
      { text: "7 creches de tempo integral construídas, com mais em andamento" },
      { text: "Centros de saúde reestruturados em diversos bairros" },
      { text: "Programa 'Escola Nova' com reforma total e novos recursos pedagógicos" },
      { text: "Obras de pavimentação, drenagem e intervenções viárias em toda a cidade" },
      { text: "Reajuste salarial acumulado de +36% aos servidores municipais: 8,2% (2023) + 8% (2024) + 6% (2025) + 10% (2026) — o maior da história de São Luís" },
    ],
  },
  {
    year: "2024",
    title: "Reeleito com 70,12% dos votos",
    description:
      "Reeleito prefeito de São Luís em primeiro turno com 403.981 votos (70,12% dos válidos), a maior votação da história da cidade — um reconhecimento popular sem precedentes.",
    highlight: true,
    details: [
      { text: "Eleito em 1° turno, dispensando segundo turno" },
      { text: "Pesquisa AtlasIntel (dez/2025) o apontou como o prefeito com maior aprovação entre todas as capitais do Brasil: 82%" },
    ],
  },
  {
    year: "2026",
    title: "Pré-candidato a Governador",
    description:
      "Anuncia pré-candidatura ao Governo do Maranhão pelo PSD, com o compromisso de levar a transformação de São Luís para todo o estado. Lidera as pesquisas de intenção de voto.",
    highlight: true,
    details: [
      { text: "Anúncio feito em 31 de março de 2026, via redes sociais" },
      { text: "Deixa a prefeitura no prazo de desincompatibilização; a vice-prefeita Esmênia Miranda (PSD) assume" },
      { text: "Lidera pesquisas de intenção de voto segundo Paraná Pesquisas e Real Time Big Data" },
    ],
  },
];

function ExpandableDetails({ details }: { details: TimelineDetail[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-dark transition-colors cursor-pointer"
      >
        {isOpen ? "Ver menos" : `Mais detalhes (${details.length})`}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2 space-y-1.5"
          >
            {details.map((detail, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"
              >
                <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-primary/40 flex-shrink-0" />
                {detail.text}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

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
                  {event.details && event.details.length > 0 && (
                    <div className={isLeft ? "md:flex md:justify-end" : ""}>
                      <ExpandableDetails details={event.details} />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
