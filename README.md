# Bridal Belle Boutique

Wedding rental marketplace for the Rwandan market — from Gusaba through the reception.

A Yarn 4 monorepo with:

- **`apps/web`** — Next.js 15 (App Router), Tailwind, Framer Motion, shadcn-style UI
- **`apps/api`** — NestJS 10 + Prisma + PostgreSQL
- **`packages/shared`** — TypeScript types/enums shared between web and api

The legacy static-HTML + Express prototype lives in `legacy/` for reference.

---

## Prerequisites

- Node ≥ 20 (this repo's dev uses Node 26)
- Docker Desktop (for Postgres)
- Yarn 4 (project-pinned — installed automatically by `yarn install`)

> **Yarn**: this repo pins Yarn 4 via `.yarn/releases/`. Anyone running `yarn install` will use the right version automatically — no global install needed.

---

## Quick start

```bash
# 1. install all workspace dependencies
yarn install

# 2. start Postgres (Docker)
yarn db:up

# 3. set up the database schema + seed Rwandan wedding categories
yarn workspace @bbb/api prisma:migrate
yarn workspace @bbb/api prisma:seed

# 4. run both apps in dev mode (concurrent)
yarn dev
```

Then open:

- Web — http://localhost:3000
- API — http://localhost:4000/api/categories

Seeded admin login (Phase B will use this):

- email: `admin@bridalbelle.rw`
- password: `admin123`

---

## Useful scripts (run from repo root)

| Command | What it does |
| --- | --- |
| `yarn dev` | Run web + api in parallel |
| `yarn build` | Build all apps |
| `yarn lint` | Lint all workspaces |
| `yarn db:up` | Start the Postgres container |
| `yarn db:down` | Stop the Postgres container |
| `yarn db:logs` | Tail Postgres logs |
| `yarn workspace @bbb/api prisma:studio` | Open Prisma Studio at :5555 |
| `yarn workspace @bbb/api db:reset` | Drop + recreate + re-seed the DB |

---

## Repo layout

```
.
├── apps/
│   ├── api/        # NestJS + Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   └── src/
│   └── web/        # Next.js
│       ├── public/
│       └── src/
├── packages/
│   └── shared/     # shared TS types/enums
├── legacy/         # original prototype, kept for reference
├── docker-compose.yml
├── .env            # local env (not committed)
└── .env.example
```

---

## Roadmap

- ✅ **Phase A** — monorepo, foundation, schema, landing page
- ⏳ **Phase B** — item browsing, multi-item booking flow, customer auth, "my bookings"
- ⏳ **Phase C** — admin dashboard (item CRUD, booking management, image upload)
- 🔮 **Later** — payments (Stripe/Flutterwave), email/SMS notifications, blog
