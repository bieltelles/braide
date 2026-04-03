import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const cities = [
  { name: "São Luís", latitude: -2.5307, longitude: -44.2826, population: 1108975 },
  { name: "Imperatriz", latitude: -5.5189, longitude: -47.4616, population: 259337 },
  { name: "São José de Ribamar", latitude: -2.5491, longitude: -44.0589, population: 176008 },
  { name: "Timon", latitude: -5.0941, longitude: -42.8369, population: 167973 },
  { name: "Caxias", latitude: -4.8588, longitude: -43.3617, population: 164224 },
  { name: "Codó", latitude: -4.4553, longitude: -43.8856, population: 122597 },
  { name: "Paço do Lumiar", latitude: -2.5133, longitude: -44.1014, population: 119915 },
  { name: "Açailândia", latitude: -4.9470, longitude: -47.5003, population: 113121 },
  { name: "Bacabal", latitude: -4.2247, longitude: -44.7846, population: 104633 },
  { name: "Balsas", latitude: -7.5327, longitude: -46.0345, population: 97534 },
  { name: "Santa Inês", latitude: -3.6668, longitude: -45.3800, population: 87568 },
  { name: "Chapadinha", latitude: -3.7417, longitude: -43.3541, population: 79084 },
  { name: "Pinheiro", latitude: -2.5217, longitude: -45.0825, population: 82377 },
  { name: "Lago da Pedra", latitude: -4.0583, longitude: -45.1342, population: 50192 },
  { name: "Itapecuru-Mirim", latitude: -3.4000, longitude: -44.3500, population: 67570 },
  { name: "Zé Doca", latitude: -3.2697, longitude: -45.6553, population: 52486 },
  { name: "Barra do Corda", latitude: -5.5047, longitude: -45.2378, population: 88476 },
  { name: "Viana", latitude: -3.2219, longitude: -44.9961, population: 53612 },
  { name: "Coroatá", latitude: -4.1330, longitude: -44.1228, population: 67392 },
  { name: "Pedreiras", latitude: -4.5689, longitude: -44.5961, population: 42100 },
  { name: "Presidente Dutra", latitude: -5.2906, longitude: -44.4917, population: 48057 },
  { name: "Grajaú", latitude: -5.8189, longitude: -46.1386, population: 68876 },
  { name: "Buriticupu", latitude: -4.3233, longitude: -46.4131, population: 72358 },
  { name: "Tutóia", latitude: -2.7614, longitude: -42.2745, population: 54884 },
  { name: "Barreirinhas", latitude: -2.7583, longitude: -42.8267, population: 62458 },
  { name: "Colinas", latitude: -6.0258, longitude: -44.2489, population: 41298 },
  { name: "Cururupu", latitude: -1.8286, longitude: -44.8683, population: 35327 },
  { name: "Santa Luzia", latitude: -4.0700, longitude: -44.9108, population: 73547 },
  { name: "Alcântara", latitude: -2.4053, longitude: -44.4136, population: 22349 },
  { name: "Carolina", latitude: -7.3336, longitude: -47.4700, population: 24004 },
  { name: "Tuntum", latitude: -5.2558, longitude: -44.6353, population: 41642 },
  { name: "Rosário", latitude: -2.9397, longitude: -44.2522, population: 42217 },
  { name: "Araioses", latitude: -2.8914, longitude: -41.9050, population: 47694 },
  { name: "Paulo Ramos", latitude: -4.0000, longitude: -45.2333, population: 22174 },
  { name: "Estreito", latitude: -6.5614, longitude: -47.4428, population: 41936 },
  { name: "Porto Franco", latitude: -6.3394, longitude: -47.3981, population: 24018 },
  { name: "Governador Nunes Freire", latitude: -2.9053, longitude: -45.8839, population: 26414 },
  { name: "São Mateus do Maranhão", latitude: -4.0375, longitude: -44.4692, population: 42026 },
  { name: "Urbano Santos", latitude: -3.2092, longitude: -43.4036, population: 29001 },
  { name: "Miranda do Norte", latitude: -3.5633, longitude: -44.5831, population: 25747 },
];

async function main() {
  console.log("Seeding cities...");

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city,
    });
  }

  console.log(`Seeded ${cities.length} cities.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
