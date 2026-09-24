-- Run only in an empty local QA database after the InitialCreate migration.
DO $$
DECLARE
  tenant uuid := '22222222-2222-2222-2222-222222222222';
  category uuid := gen_random_uuid();
  customer uuid := gen_random_uuid();
  product uuid := '33333333-3333-3333-3333-333333333333';
  order_id uuid := gen_random_uuid();
BEGIN
  INSERT INTO "Shops" ("Id", "Name", "Slug", "LegalName", "Voen", "Phone", "WhatsApp", "Email", "Instagram", "Address", "IsActive", "CreatedAt", "UpdatedAt")
  VALUES (tenant, 'Aromera', 'aromera', 'Keep existing legal name', '1234567890', '+994505555555', '+994505555555', 'salam@aromera.az', '@aromera.az', 'Baku', true, NOW(), NOW());
  INSERT INTO "Categories" VALUES (category, tenant, 'Oud kolleksiyası', 'oud-kolleksiyasi', 'Aromera seçimi', true);
  INSERT INTO "Products" ("Id", "ShopId", "CategoryId", "Name", "Slug", "Brand", "Gender", "ShortDescription", "Description", "Price", "StockQuantity", "Volume", "Concentration", "MainImageUrl", "IsFeatured", "IsBestseller", "IsActive", "CreatedAt", "UpdatedAt")
  VALUES (product, tenant, category, 'Aromera Noir Essence', 'aromera-noir-essence', 'Aromera Private', 'unisex', 'Description', 'Bakı ritminə uyğun', 27, 2, '50ml', 'EDP', '/products/aromera-noir-essence.webp', true, true, true, NOW(), NOW());
  INSERT INTO "Customers" ("Id", "ShopId", "Name", "Phone", "CreatedAt") VALUES (customer, tenant, 'QA Customer', '000', NOW());
  INSERT INTO "Orders" ("Id", "ShopId", "CustomerId", "OrderNumber", "Status", "PaymentStatus", "Subtotal", "DeliveryFee", "Total", "CustomerName", "CustomerPhone", "DeliveryAddress", "CreatedAt", "UpdatedAt")
  VALUES (order_id, tenant, customer, 'LEGACY-ORDER', 'paid', 'paid', 27, 5, 32, 'QA Customer', '000', 'QA', NOW(), NOW());
  INSERT INTO "OrderItems" VALUES (gen_random_uuid(), order_id, product, 'Aromera Noir Essence', 1, 27, 27);
  INSERT INTO "PaymentProviderSettings" ("Id", "ShopId", "Provider", "IsEnabled", "IsTestMode", "CreatedAt", "UpdatedAt") VALUES (gen_random_uuid(), tenant, 'Mock', true, true, NOW(), NOW());
  INSERT INTO "DeliverySettings" VALUES (gen_random_uuid(), tenant, 6, 9, 160, 'Bakı üzrə çatdırılma imkanı');
  INSERT INTO "ThemeSettings" VALUES (gen_random_uuid(), tenant, '#111111', '#b89146');
  INSERT INTO "Users" VALUES (gen_random_uuid(), tenant, 'existing-owner@example.invalid', 'preserve-this-hash', 'owner', true, NOW());
  INSERT INTO "Shops" ("Id", "Name", "Slug", "Phone", "WhatsApp", "Address", "IsActive", "CreatedAt", "UpdatedAt")
  VALUES (gen_random_uuid(), 'Other Tenant', 'other-tenant', 'unchanged', 'unchanged', 'unchanged', true, NOW(), NOW());
END $$;
