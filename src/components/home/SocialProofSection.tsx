"use client";

import { useState, useEffect, useCallback } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { SocialProof } from "./SocialProof";

interface Supporter {
  id: string;
  name: string | null;
  image: string | null;
  city: string | null;
}

interface CityGroup {
  name: string;
  lat: number;
  lng: number;
  count: number;
  supporters: { id: string; name: string | null; image: string | null }[];
}

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

export function SocialProofSection() {
  const [supporters, setSupporters] = useState<Supporter[]>(mockSupporters);
  const [totalCount, setTotalCount] = useState(1247);
  const [cities, setCities] = useState<CityGroup[]>([]);
  const [loaded, setLoaded] = useState(false);
  const geo = useGeolocation();

  const fetchSupporters = useCallback(() => {
    const params = new URLSearchParams();
    if (geo.coords) {
      params.set("lat", String(geo.coords.latitude));
      params.set("lng", String(geo.coords.longitude));
    }

    fetch(`/api/supporters?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.supporters?.length) setSupporters(data.supporters);
        if (data.count) setTotalCount(data.count);
        if (data.cities?.length) setCities(data.cities);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [geo.coords]);

  // Initial load once geo resolves
  useEffect(() => {
    if (geo.loading) return;
    fetchSupporters();
  }, [geo.loading, fetchSupporters]);

  // Listen for "supporters-updated" event (fired by SmartSupportLink after registering)
  useEffect(() => {
    const handler = () => fetchSupporters();
    window.addEventListener("supporters-updated", handler);
    return () => window.removeEventListener("supporters-updated", handler);
  }, [fetchSupporters]);

  if (!loaded) return null;

  return (
    <SocialProof
      supporters={supporters}
      totalCount={totalCount}
      cities={cities}
      userLat={geo.coords?.latitude || 0}
      userLng={geo.coords?.longitude || 0}
    />
  );
}
