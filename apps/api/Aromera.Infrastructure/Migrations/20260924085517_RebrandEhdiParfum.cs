using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Aromera.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RebrandEhdiParfum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HeroText",
                table: "Shops",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LogoUrl",
                table: "Shops",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Slogan",
                table: "Shops",
                type: "text",
                nullable: false,
                defaultValue: "");

            // Keep every foreign key attached to the original tenant. A slug collision
            // must fail the transaction rather than merge or orphan production data.
            migrationBuilder.Sql("""
                DO $$ BEGIN
                    IF EXISTS (SELECT 1 FROM "Shops" WHERE "Slug" = 'aromera')
                       AND EXISTS (SELECT 1 FROM "Shops" WHERE "Slug" = 'ehdi-parfum') THEN
                        RAISE EXCEPTION 'Both tenant slugs exist; resolve the collision before rebranding.';
                    END IF;
                END $$;
                UPDATE "Shops" SET "Name" = 'Əhdi Parfum', "Slug" = 'ehdi-parfum',
                    "Phone" = '+994556994666', "WhatsApp" = '+994556994666',
                    "Address" = 'Bakı şəhəri, Qara Qarayev küçəsi 74A',
                    "Email" = NULL, "Instagram" = NULL,
                    "LogoUrl" = '/brand/ehdi-hasan-logo.svg',
                    "Slogan" = 'BİR KEYFİYYƏT BRENDİ',
                    "HeroText" = 'Ətirinizi seçin. İziniz yadda qalsın.', "UpdatedAt" = NOW()
                WHERE "Slug" = 'aromera';
                UPDATE "ThemeSettings" SET "PrimaryColor" = '#171512', "AccentColor" = '#B99045'
                WHERE "ShopId" IN (SELECT "Id" FROM "Shops" WHERE "Slug" = 'ehdi-parfum');
                UPDATE "Products" SET "Brand" = CASE "Brand"
                    WHEN 'Aromera Private' THEN 'Əhdi Selection' WHEN 'Maison Aura' THEN 'Premium Collection'
                    WHEN 'Noir Atelier' THEN 'Signature Collection' ELSE "Brand" END,
                    "Name" = REPLACE("Name", 'Aromera ', ''),
                    "Description" = CASE WHEN "Description" LIKE '%Bakı ritminə uyğun%'
                        THEN REPLACE("Name", 'Aromera ', '') || ' haqqında ətraflı məlumat və mövcud seçimlər üçün mağaza ilə əlaqə saxlayın.'
                        ELSE REPLACE("Description", 'Aromera', 'Əhdi Parfum') END
                WHERE "ShopId" IN (SELECT "Id" FROM "Shops" WHERE "Slug" = 'ehdi-parfum');
                UPDATE "Products" p SET "Slug" = 'noir-essence', "MainImageUrl" = '/products/noir-essence.webp'
                WHERE p."Slug" = 'aromera-noir-essence'
                  AND p."ShopId" IN (SELECT "Id" FROM "Shops" WHERE "Slug" = 'ehdi-parfum')
                  AND NOT EXISTS (SELECT 1 FROM "Products" q WHERE q."ShopId" = p."ShopId" AND q."Slug" = 'noir-essence');
                UPDATE "Categories" SET "Description" = REPLACE("Description", 'Aromera', 'Əhdi Parfum')
                WHERE "ShopId" IN (SELECT "Id" FROM "Shops" WHERE "Slug" = 'ehdi-parfum');
                UPDATE "Categories" c SET "Name" = 'Premium seçimlər', "Slug" = 'premium-secimler'
                WHERE "Slug" = 'oud-kolleksiyasi' AND "ShopId" IN (SELECT "Id" FROM "Shops" WHERE "Slug" = 'ehdi-parfum')
                  AND NOT EXISTS (SELECT 1 FROM "Categories" q WHERE q."ShopId" = c."ShopId" AND q."Slug" = 'premium-secimler');
                UPDATE "Categories" c SET "Name" = 'Hədiyyə seçimləri', "Slug" = 'hediyye-secimleri'
                WHERE "Slug" = 'hediyyelik-setler' AND "ShopId" IN (SELECT "Id" FROM "Shops" WHERE "Slug" = 'ehdi-parfum')
                  AND NOT EXISTS (SELECT 1 FROM "Categories" q WHERE q."ShopId" = c."ShopId" AND q."Slug" = 'hediyye-secimleri');
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Business data is intentionally not reverted: later admin edits must survive rollback.
            migrationBuilder.DropColumn(
                name: "HeroText",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "LogoUrl",
                table: "Shops");

            migrationBuilder.DropColumn(
                name: "Slogan",
                table: "Shops");
        }
    }
}
