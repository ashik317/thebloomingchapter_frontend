# The Blooming Chapter — Frontend (Shop + Admin CRM)

Next.js 14 (App Router), React, TypeScript and Tailwind.
This is the website (books, café, flowers, customer dashboard) and the admin CRM.
It needs the **separate backend project** (`thebloomingchapter_backend`) running.

```
thebloomingchapter_frontend/
├── src/app/(shop)/       public shop, cart, checkout, login, customer dashboard
├── src/app/crm/          admin CRM (orders, payments, books, menu, flowers, users, chat)
├── src/components/       UI, PDF reader, chat, payment buttons
├── src/context/          auth + cart state
├── src/lib/api.ts        axios client (reads NEXT_PUBLIC_API_URL)
├── docker-compose.yml    frontend only, port 3000
├── Dockerfile
└── .env.example
```

## 1. Point it at the backend

```bash
cp .env.example .env.local      # local dev   (use .env for Docker)
```

| Variable | Example |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000/api` (production: `https://api.yourdomain.com/api`) |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | same as the backend's `GOOGLE_CLIENT_ID`; the Google button hides when empty |

On the **backend**, add this site's address to `CORS_ALLOWED_ORIGINS` and set
`FRONTEND_URL` to it, otherwise the browser will block API calls and email/payment
links will point to the wrong place.

## 2. Run (development)

```bash
npm install
npm run dev                     # http://localhost:3000
```

## 3. Run with Docker

```bash
cp .env.example .env
docker compose up -d --build    # http://localhost:3000
```

`NEXT_PUBLIC_*` values are baked in at build time — rebuild after changing them.

## Pages

- Shop: `/`, `/books`, `/books/<slug>`, `/read/<slug>`, `/cafe`, `/flowers`, `/cart`, `/checkout`
- Account: `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`
- Customer dashboard: `/dashboard` (orders, library, notifications, messages, profile)
- Admin CRM: `/crm/login`, then `/crm` (orders, payments, books, catalog, menu, flowers, users, messages, notifications)

Demo logins (when the backend is seeded):
Admin `admin@thebloomingchapter.local` / `Admin@12345` · Customer `reader@thebloomingchapter.local` / `Reader@12345`

## Where to change things

- Colours and fonts: `tailwind.config.ts`, `src/app/globals.css`
- Shop name: `src/components/Navbar.tsx`, `src/components/Footer.tsx`
