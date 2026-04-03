"use client";

import { useState, useEffect } from "react";
import { SocialProof } from "./SocialProof";

interface Supporter {
  id: string;
  name: string | null;
  image: string | null;
  city: string | null;
}

export function SocialProofSection() {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // For now, use mock data. In production, fetch from /api/supporters
    const mockSupporters: Supporter[] = Array.from({ length: 30 }, (_, i) => ({
      id: `mock-${i}`,
      name: [
        "Maria Silva", "João Santos", "Ana Costa", "Pedro Oliveira", "Lucia Ferreira",
        "Carlos Souza", "Fernanda Lima", "Ricardo Almeida", "Patrícia Rocha", "Marcos Ribeiro",
        "Juliana Martins", "Bruno Carvalho", "Camila Araújo", "Diego Nascimento", "Isabela Gomes",
        "Rafael Barbosa", "Amanda Pereira", "Thiago Moreira", "Larissa Correia", "Felipe Azevedo",
        "Gabriela Cardoso", "Matheus Teixeira", "Beatriz Monteiro", "Leonardo Pinto", "Natália Dias",
        "Gustavo Mendes", "Mariana Castro", "Rodrigo Reis", "Aline Duarte", "Vinícius Lopes"
      ][i],
      image: null,
      city: [
        "São Luís", "Imperatriz", "Timon", "Caxias", "Codó",
        "Paço do Lumiar", "Açailândia", "Bacabal", "Balsas", "Santa Inês",
        "São José de Ribamar", "Chapadinha", "Pinheiro", "Lago da Pedra", "Itapecuru-Mirim",
        "São Luís", "Imperatriz", "Timon", "Caxias", "Codó",
        "São Luís", "Bacabal", "Balsas", "Santa Inês", "Pinheiro",
        "São Luís", "Imperatriz", "São Luís", "Timon", "Caxias"
      ][i],
    }));

    setSupporters(mockSupporters);
    setTotalCount(1247);
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  return <SocialProof supporters={supporters} totalCount={totalCount} />;
}
