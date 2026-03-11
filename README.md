# TravelTo Monorepo

TravelTo la he thong website du lich gom:

- Backend Spring Boot 4 (API auth, phan quyen, tour, booking)
- Frontend Next.js 16 App Router (landing page, danh sach tour, login Google, booking, admin)

## Cau truc thu muc

- be/: Backend API theo clean module domain
- fe/: Frontend Next.js App Router

## Chay nhanh local

### 1) Backend

```bash
cd be
./mvnw test
./mvnw spring-boot:run
```

Backend mac dinh chay o `http://localhost:8080`.

### 2) Frontend

```bash
cd fe
npm install
npm run dev
```

Frontend mac dinh chay o `http://localhost:3000`.

## Google Login Flow

1. User dang nhap Google tai frontend thong qua NextAuth.
2. Frontend gui `id_token` sang backend endpoint `/api/v1/auth/google`.
3. Backend xac thuc token voi Google token info API.
4. Backend tao/cap nhat user, gan role USER/ADMIN theo email config, tra JWT noi bo.
5. Frontend luu JWT backend trong session de goi API booking/admin.

## Ghi chu

- Co seed du lieu tinh thanh + tour mau khi app khoi dong lan dau.
- Role ADMIN duoc xac dinh boi bien moi truong `ADMIN_EMAIL`.
- File `NUL` dang ton tai trong repo theo trang thai hien tai cua ban va duoc giu nguyen.
