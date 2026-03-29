# LifeFit — Frontend

Interface da aplicação **Fit.ai**: plataforma de fitness com planos de treino personalizados, sessões, estatísticas de consistência e assistente de IA personal trainer.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| Estilo | Tailwind CSS 4 |
| Componentes | shadcn/ui (Radix UI) |
| Autenticação | better-auth (`better-auth/react`) |
| Formulários | react-hook-form + Zod |
| Cliente HTTP | Orval (gerado a partir do OpenAPI da API) |
| Chat IA | Vercel AI SDK (`@ai-sdk/react`) |
| URL state | nuqs |
| Markdown | streamdown |
| Ícones | lucide-react |

---

## Funcionalidades

- Login com Google OAuth via better-auth
- **Onboarding** guiado por chat com IA até criação do primeiro plano de treino
- **Home** com treino do dia, streak e grid de consistência
- **Planos de treino** — visualização de dias e exercícios, iniciar e concluir treino
- **Stats** — heatmap de atividade, streak, taxa de conclusão e cards de métricas
- **Perfil** — dados do usuário e logout
- **Chat flutuante** com personal trainer IA disponível em todas as telas

---

## Pré-requisitos

- Node.js >= 20
- pnpm >= 10
- API do LifeFit rodando (ver [repositório do backend](../../LifeFit))

---

## Configuração

Crie um arquivo `.env.local` na raiz do projeto com:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_API_URL` | URL base da API backend |
| `NEXT_PUBLIC_BASE_URL` | URL do próprio app Next.js (usado no callback OAuth) |

---

## Como rodar

### Desenvolvimento

```bash
pnpm install
pnpm dev
```

### Build e produção

```bash
pnpm build
pnpm start
```

### Lint

```bash
pnpm lint
```

---

## Regenerar cliente HTTP

O cliente de fetch é gerado automaticamente via **Orval** a partir do schema OpenAPI da API. Para regenerar após mudanças no backend:

```bash
# A API precisa estar rodando para expor o /swagger.json
pnpm exec orval
```

O cliente gerado fica em `app/_lib/api/fetch-generated/`.

---

## Estrutura do projeto

```
app/
├── layout.tsx                  # Layout raiz (fonte Geist, providers)
├── page.tsx                    # Home — treino do dia, streak, consistência
├── auth/                       # Página de login (Google OAuth)
├── onboarding/                 # Onboarding com chat IA
├── stats/                      # Estatísticas e heatmap
├── profile/                    # Perfil do usuário
├── workout-plans/
│   └── [id]/
│       └── days/[dayId]/       # Detalhe do dia de treino
├── _components/                # Componentes globais (chat, bottom-nav, etc.)
└── _lib/
    ├── fetch.ts                # Fetch base configurado
    ├── auth-client.ts          # Cliente do better-auth
    ├── guards.ts               # Proteção de rotas
    └── api/
        └── fetch-generated/    # Cliente gerado pelo Orval

components/
└── ui/                         # Componentes shadcn/ui

lib/
└── utils.ts                    # Utilitários (cn, etc.)
```

---

## Rotas da aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Home — treino do dia e resumo |
| `/auth` | Login com Google |
| `/onboarding` | Configuração inicial via chat IA |
| `/stats` | Estatísticas de treino |
| `/profile` | Perfil do usuário |
| `/workout-plans/[id]` | Detalhe de um plano |
| `/workout-plans/[id]/days/[dayId]` | Dia de treino com exercícios |

---

## Backend

O backend (Fastify + Prisma + PostgreSQL) está em repositório separado: [`LifeFit`](../../LifeFit).
