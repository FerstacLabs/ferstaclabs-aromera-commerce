# Əhdi Parfum Commerce

The existing Next.js / ASP.NET Core 8 multi-tenant application, rebranded for **Əhdi Parfum** (Ehdi Hasan Parfumer's). Internal solution and namespace names remain AromeraCommerce.

## Structure

- `apps/web`: Next.js App Router, TypeScript, Tailwind, Ant Design admin.
- `apps/api`: ASP.NET Core 8, EF Core, PostgreSQL, JWT, payment providers.
- `apps/web/public/brand`: EH full logo, compact logo, monogram and SVG favicon.
- `apps/web/public/products`: local WebP perfume photography.

## Local Development

```powershell
cd apps/api
dotnet restore
dotnet run --project Aromera.Api
```

Configure `ConnectionStrings__DefaultConnection` for a local PostgreSQL database. Startup applies EF migrations before running the seed. In another terminal:

```powershell
cd apps/web
npm ci
npm run dev
```

Frontend environment example: `apps/web/.env.example`.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SHOP_SLUG=ehdi-parfum
```

Public contact details are centralized in the shop database, with verified offline defaults in `apps/web/src/lib/shop.ts`. Phone and WhatsApp: +994 55 699 46 66. Address: Bakı şəhəri, Qara Qarayev küçəsi 74A. No unverified email or social profile is displayed. WhatsApp links are derived from shop settings; `NEXT_PUBLIC_WHATSAPP_NUMBER` is no longer used.

## Rebrand Migration

`20260924085517_RebrandEhdiParfum` adds `Shop.LogoUrl`, `Shop.Slogan` and `Shop.HeroText`. It updates the **same** shop from `aromera` to `ehdi-parfum`, preserving its ID, legal name and VÖEN. Products, orders, users, delivery settings and payment configuration remain associated with that ID. A collision between both slugs aborts the transaction for manual resolution; it never creates a replacement tenant.

The migration clears the unverified public email/social fields, updates branding/theme, replaces legacy collection labels and renames the first product to Noir Essence. The old product URL redirects permanently. Old API tenant URLs remain compatible during deployment. Existing admin credentials and browser cart/auth storage keys are retained; stored cart labels migrate without clearing quantities.

Seed runs preserve admin edits, prices, stock, descriptions and activation flags. Missing seed products are inserted by `ShopId + Slug`; only legacy seed image paths are repaired. Settings are not reset at every startup. Catalog products remain temporary neutral content, not a claim about the real store's inventory or manufacturing.

Admin store settings persist brand name, legal name, VÖEN, phone, WhatsApp, address, logo, slogan, hero text and theme colors. Product editing persists all catalog fields and ordered image galleries. Public configuration and catalog reads revalidate every 60 seconds.

## Product Images

Product images are served from `apps/web/public/products`; product `MainImageUrl` should use `/products/{slug}.webp`. Images do not require external hosts at runtime. Cards, galleries and cart images fall back to `/products/fallback-perfume.webp`. The first product now uses `/products/noir-essence.webp`.

## Payment Behavior

Card orders are pending until the existing internal confirmation or hosted provider flow finishes. Cash and WhatsApp orders remain unpaid. The internal card form never sends PAN, expiry or CVV to the API: confirmation contains only `orderId` and `result`. Provider selection is pinned to the checkout payment: clients cannot downgrade hosted payments, confirm cash/WhatsApp through Mock, or reverse paid status with a replay. Epoint/Payriff hosted-provider architecture is unchanged; this rebrand does not complete their existing merchant integration stubs.

Checkout and cart read delivery prices from the shop's database configuration, and the API calculates the authoritative delivery amount.

Existing admin login credentials are unchanged. The development seed account remains `admin@aromera.az` with its existing password; this internal login identifier is not a public contact address. Change seeded credentials before public operation.

## Verification

```powershell
cd apps/api
dotnet build AromeraCommerce.sln
cd ../web
npm run lint
npm run build
npm run start -- -p 3005
```

Browser regression tests use local URLs only and Microsoft Edge via Playwright:

```powershell
cd apps/web
npm run test:e2e
```

Start the local API on port 5000 and web on 3005. The tests expect an isolated PostgreSQL QA database with `InitialCreate` applied, then `tests/rebrand-legacy-fixture.sql` loaded **before** API startup applies the rebrand migration. Never load this fixture into production. `tests/rebrand-assertions.sql` verifies tenant identity, historical orders/users, unchanged inventory/delivery and absence of duplicate seed products, including after restart.

Browser coverage includes /, /shop, /shop/[slug], /cart, /checkout, checkout success/failure, /about, /contact, /admin/login, /admin, /admin/products, /admin/orders, /admin/settings and store settings. Responsive checks cover 375, 430, 768, 1024 and 1440 pixels. Checkout tests cover card confirmation, decline/retry, cash, WhatsApp, image fallback and admin saves.

## Production Deployment

Deploy the API first, then the frontend. Keep the existing Railway PostgreSQL service and volume. Do not reset, delete or recreate the production database. Take a normal backup before the schema migration.

From the repository root, targeting the existing Railway service:

```powershell
railway up apps/api --path-as-root --service aromera-api --environment production --detach
```

The existing Dockerfile publishes the API. Container startup command is `dotnet Aromera.Api.dll`; startup automatically executes `Database.MigrateAsync()` and the idempotent seed. There is no separate destructive database command. Keep `ConnectionStrings__DefaultConnection`, JWT settings, payment settings and `FrontendUrl` unchanged.

Check Railway deployment health and logs before deploying the web app. Confirm `GET /api/shops/by-slug/ehdi-parfum` returns the original shop ID, new name, phone and slogan.

In the existing Vercel **aromera** project, update the Production (and relevant Preview) environment variable:

```env
NEXT_PUBLIC_SHOP_SLUG=ehdi-parfum
```

**Do not change NEXT_PUBLIC_API_URL.** No new mandatory backend environment variables are required. OpenGraph uses Vercel's production-domain environment value; `NEXT_PUBLIC_SITE_URL` is optional when a custom canonical domain is needed.

From the frontend directory linked to the existing Vercel project:

```powershell
cd apps/web
vercel --prod
```

The linked Vercel project's root directory is `.`, so upload from `apps/web`. These CLI commands deploy to existing projects. Git push alone should not be treated as proof of a healthy deployment; verify both dashboards and the public pages afterwards.
