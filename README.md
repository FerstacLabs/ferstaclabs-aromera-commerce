# Aromera Commerce

Multi-tenant e-commerce platform for retail shops in Azerbaijan. The first tenant is **Aromera**, a premium perfume storefront with its own products, branding, admin area, delivery settings, and payment configuration.

## Tech Stack

- `apps/web`: Next.js App Router, TypeScript, Tailwind CSS, Ant Design for `/admin`
- `apps/api`: ASP.NET Core 8 Web API, EF Core, PostgreSQL, JWT auth, Swagger
- Payments: provider abstraction with Mock, Epoint structure, and Payriff structure
- Local infrastructure: Docker Compose with PostgreSQL, API, optional pgAdmin

## Structure

```txt
apps/
  web/
  api/
    Aromera.Api/
    Aromera.Application/
    Aromera.Domain/
    Aromera.Infrastructure/
docker-compose.yml
README.md
```

## Local Setup

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Backend:

```bash
cd apps/api
dotnet restore
dotnet ef database update --project Aromera.Infrastructure --startup-project Aromera.Api
dotnet run --project Aromera.Api
```

Docker:

```bash
docker compose up --build
```

Swagger is available at `http://localhost:5000/swagger` in development.

## Environment Variables

Frontend example is in `apps/web/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SHOP_SLUG=aromera
NEXT_PUBLIC_WHATSAPP_NUMBER=994505555555
```

Backend example is in `apps/api/Aromera.Api/appsettings.example.json`. Environment variables can override nested settings, for example:

```bash
ConnectionStrings__DefaultConnection=Host=localhost;Port=5432;Database=aromera_commerce;Username=postgres;Password=postgres
Jwt__Secret=CHANGE_ME_TO_LONG_RANDOM_SECRET
Payments__DefaultProvider=Mock
```

## Seed Data

On startup, the API applies migrations and seeds the Aromera shop if the database is empty:

- 1 shop: `aromera`
- 7 categories
- 24 perfume products
- admin user
- payment provider settings
- delivery/theme settings
- initial customers and orders for dashboard data

Admin login:

```txt
Email: admin@aromera.az
Password: Admin123!ChangeMe
```

Passwords are stored with PBKDF2 hashing.

## Product Images

Product images are served from `apps/web/public/products`. Seeded product `MainImageUrl` values should use the `/products/{slug}.webp` format, for example `/products/midnight-musk.webp`. The seed routine also updates existing Aromera products by `ShopId + Slug` on startup so production databases with older external image URLs are corrected without duplicating products.

## API Highlights

- `POST /api/auth/login`
- `GET /api/shops/by-slug/{slug}`
- `GET /api/{shopSlug}/products`
- `GET /api/{shopSlug}/products/{slug}`
- `POST /api/{shopSlug}/checkout`
- `POST /api/{shopSlug}/payments/create`
- `POST /api/{shopSlug}/payments/epoint/callback`
- `POST /api/{shopSlug}/payments/payriff/callback`
- `GET /api/admin/orders`
- `PUT /api/admin/orders/{id}/status`

Admin endpoints read `shopId` from JWT claims so each admin only sees their own shop data.

## Payments

Each shop owns its payment configuration through `PaymentProviderSetting`.

- Mock: local provider that marks card orders as paid.
- Epoint: provider structure is present with TODO markers for merchant credentials and callback signature validation.
- Payriff: provider placeholder is present with TODO markers for live merchant API integration.

Do not place real private keys in frontend code or committed config files.

## Deployment Notes

Vercel:

1. Deploy `apps/web`.
2. Set `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SHOP_SLUG`, and `NEXT_PUBLIC_WHATSAPP_NUMBER`.
3. Configure image domains if adding new external image hosts.

Backend Docker hosting:

1. Build from `apps/api/Dockerfile`.
2. Provide PostgreSQL connection string and JWT settings as environment variables.
3. Run migrations on startup or via `dotnet ef database update`.
4. Set `FrontendUrl` to the production Vercel domain for CORS.

The API is ready for Render, Fly.io, Hetzner VPS, DigitalOcean App Platform, or any Docker host.

## Production Checklist

- Replace JWT secret with a long random value.
- Add real encryption implementation for payment credentials.
- Enable and validate Epoint/Payriff merchant credentials per shop.
- Confirm callback signature validation before live card payments.
- Restrict CORS to production domains.
- Add HTTPS reverse proxy settings for backend hosting.
- Add monitoring, backups, and log retention.
- Add CI for `dotnet build`, migrations, `npm run lint`, and `npm run build`.
