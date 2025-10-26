# Therapy Center — Starter Monorepo

This is a minimal starter (web + api + db) to get you running locally.

## Quick start
```bash
cp .env.example .env
docker compose up -d

pnpm install
pnpm -F @tc/db prisma migrate dev
pnpm -F @tc/db prisma db seed

pnpm -F api dev         # http://localhost:4000
pnpm -F web dev         # http://localhost:3000
```
# therapy-center
# therapy-center
