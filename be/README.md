# TravelTo Backend (Spring Boot)

## Kien truc thu muc

- auth/: Dang nhap Google va tra JWT
- security/: JWT filter, security config
- user/: Nguoi dung va role
- province/: Tinh/thanh va thong ke tour
- tour/: Danh sach tour va chi tiet tour
- booking/: Dat tour cua user, quan tri booking cho admin
- bootstrap/: Seed du lieu ban dau
- config/: Config app, HTTP client, properties
- common/: Base entity va exception handler

## API chinh

- `POST /api/v1/auth/google`
- `GET /api/v1/provinces/overview`
- `GET /api/v1/tours`
- `GET /api/v1/tours/{id}`
- `GET /api/v1/home/highlights`
- `POST /api/v1/bookings` (USER/ADMIN)
- `GET /api/v1/bookings/me` (USER/ADMIN)
- `GET /api/v1/admin/bookings` (ADMIN)
- `PATCH /api/v1/admin/bookings/{id}/status` (ADMIN)

## Run

```bash
./mvnw test
./mvnw spring-boot:run
```

## Moi truong

Xem file `.env.example` de cau hinh nhanh.
