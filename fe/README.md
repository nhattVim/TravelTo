# TravelTo Frontend (Next.js 16)

Frontend cua TravelTo su dung:

- Next.js 16 App Router
- Auth.js (NextAuth) dang nhap Google
- Server Actions cho dat tour va admin update trang thai

## Cau truc thu muc

- src/app/: Route pages (home, tours, login, bookings, admin)
- src/app/api/auth/[...nextauth]/: Auth.js route handler
- src/components/: UI theo module (home, tours, layout, shared)
- src/lib/api/: API client public/private + auth exchange
- src/types/: Domain types va next-auth type augmentation
- src/auth.ts: Cau hinh Auth.js
- src/proxy.ts: Bao ve route bookings/admin theo session va role

## Chay local

```bash
npm install
npm run dev
```

Frontend mac dinh tai `http://localhost:3000`.

## Build va lint

```bash
npm run lint
npm run build
```

## Moi truong

Tao file `.env.local` tu `.env.example` va cap nhat:

- `NEXT_PUBLIC_API_BASE_URL`
- `AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
