SubTrack — a personal subscriptions tracker built with Next.js (App Router), Supabase Auth (JWT), and Prisma.

## Getting Started

### 1) Create a Supabase project

- Create a new project in Supabase.
- Enable Email / Password auth.
- Copy:
	- Project URL
	- Anon public key
	- Postgres connection strings (pooler + direct)

### 2) Configure env vars

Copy [.env.example](.env.example) to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL` (pooler recommended)
- `DIRECT_URL` (direct connection for Prisma migrations)

### 3) Apply database schema

Run Prisma migrate (requires your env vars set):

```bash
npm run prisma:migrate -- --name init
```

### 4) Run the app

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### App routes

- `/login` — sign in/sign up (Supabase JWT)
- `/dashboard` — summary + upcoming payments
- `/subscriptions` — CRUD list
- `/subscriptions/[id]` — details
