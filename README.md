# Eduardo Braide - Site de Campanha

Site oficial da pre-candidatura de **Eduardo Braide** ao Governo do Maranhao.

**[Acessar o Site](https://bieltelles.github.io/braide/)**

---

## Visao Geral

Plataforma web completa para a campanha eleitoral, com foco em engajamento popular, transparencia e participacao cidada.

### Paginas Publicas

| Pagina | Descricao |
|--------|-----------|
| **Homepage** | Hero animado, contadores estatisticos, mural de apoiadores, CTA de apoio, navegacao |
| **Trajetoria** | Timeline interativa 2004-2026, grid de conquistas como prefeito |
| **Agenda** | Mapa Leaflet do Maranhao com cidades visitadas, lista de eventos, contador de km |
| **Plano de Governo** | 6 areas tematicas expansiveis com metas, formulario de sugestoes participativo |
| **Downloads** | Grid filtravel de materiais (jingles, fotos, PDFs, videos) com contagem de downloads |
| **Pontos de Apoio** | Mapa com comites, pontos de adesivo e bandeira, filtros por tipo e cidade |

### Painel Administrativo (`/admin`)

| Modulo | Funcionalidade |
|--------|----------------|
| **Dashboard** | 6 cards com metricas, feed de atividade recente |
| **Sugestoes** | Moderacao com aprovar/rejeitar, filtros por status |
| **Eventos** | Listagem e criacao de eventos, gestao de agenda |
| **Downloads** | Tabela com ativar/desativar materiais, upload de novos |

### Funcionalidades Extras

- Botao flutuante de WhatsApp com mini-chat
- Compartilhamento social (WhatsApp, Facebook, copiar link)
- Loading skeletons para todas as paginas dinamicas
- Pagina 404 e error boundary customizadas
- PWA manifest (instalavel no celular)
- SEO completo (sitemap, robots.txt, OpenGraph)

---

## Stack Tecnologica

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | Next.js 16.2 (App Router) |
| **UI** | React 19 + TypeScript |
| **Estilo** | Tailwind CSS 4 |
| **Animacoes** | Motion (Framer Motion) |
| **Mapas** | Leaflet + React-Leaflet |
| **Icones** | Lucide React |
| **Componentes** | Radix UI + CVA |
| **Banco de Dados** | Prisma 7 + PostgreSQL |
| **Autenticacao** | Auth.js v5 (Google, Facebook) |
| **Deploy** | GitHub Pages (static export) |

---

## Estrutura do Projeto

```
src/
  app/
    page.tsx                  # Homepage
    layout.tsx                # Layout raiz (Navbar + Footer + WhatsApp)
    not-found.tsx             # Pagina 404
    error.tsx                 # Error boundary
    trajetoria/page.tsx       # Trajetoria politica
    agenda/page.tsx           # Agenda + mapa
    plano-de-governo/page.tsx # Plano participativo
    downloads/page.tsx        # Materiais para download
    pontos-de-apoio/page.tsx  # Mapa de comites
    admin/                    # Painel administrativo
      page.tsx                # Dashboard
      sugestoes/page.tsx      # Moderacao
      eventos/page.tsx        # Gestao de agenda
      downloads/page.tsx      # Gestao de materiais
  components/
    ui/                       # Componentes base (Button)
    shared/                   # Navbar, Footer, WhatsApp, Share
    home/                     # Hero, Stats, SocialProof, Support, CTA
    trajectory/               # Timeline, Achievements
    agenda/                   # AgendaMap, EventList, KmCounter
    plan/                     # PlanCategories, SuggestionForm
    downloads/                # DownloadGrid
    locations/                # LocationsMap, LocationsList
  lib/
    utils.ts                  # cn(), formatNumber()
    km-calculator.ts          # Haversine distance
    prisma.ts                 # Prisma client
    auth.ts                   # Auth.js config
prisma/
  schema.prisma               # 9 modelos de dados
  seed.ts                     # 40 cidades do MA
```

---

## Como Rodar Localmente

```bash
# Clonar o repositorio
git clone https://github.com/bieltelles/braide.git
cd braide

# Instalar dependencias
npm install

# Gerar Prisma Client
npx prisma generate

# Iniciar servidor de desenvolvimento
npm run dev
```

O site estara disponivel em `http://localhost:3000/braide`

### Build para Producao

```bash
# Build estatico (gera pasta /out)
npm run build

# Para deploy com banco de dados, remova output: "export" do next.config.ts
# e configure DATABASE_URL no .env
```

---

## Deploy

O site e deployado automaticamente no **GitHub Pages** via GitHub Actions ao fazer push na branch `main`.

**URL:** https://bieltelles.github.io/braide/

### Para deploy com backend completo (Vercel/VPS):

1. Remova `output: "export"` e `basePath` do `next.config.ts`
2. Configure as variaveis de ambiente (`.env.example`)
3. Execute `npx prisma migrate deploy`
4. Execute `npx prisma db seed` para dados iniciais

---

## Variaveis de Ambiente

Copie `.env.example` para `.env` e configure:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."
AUTH_FACEBOOK_ID="..."
AUTH_FACEBOOK_SECRET="..."
NEXT_PUBLIC_APP_URL="https://..."
```

---

## Licenca

Todos os direitos reservados. Eduardo Braide 2026.
