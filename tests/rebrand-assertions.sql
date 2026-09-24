DO $$
BEGIN
  IF (SELECT COUNT(*) FROM "Shops") <> 2 THEN RAISE EXCEPTION 'Unexpected tenant count'; END IF;
  IF NOT EXISTS (SELECT 1 FROM "Shops" WHERE "Id" = '22222222-2222-2222-2222-222222222222' AND "Slug" = 'ehdi-parfum' AND "LegalName" = 'Keep existing legal name' AND "Voen" = '1234567890') THEN RAISE EXCEPTION 'Tenant identity or legal data changed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM "Shops" WHERE "Slug" = 'other-tenant' AND "Phone" = 'unchanged') THEN RAISE EXCEPTION 'Other tenant changed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM "Products" WHERE "Id" = '33333333-3333-3333-3333-333333333333' AND "Slug" = 'noir-essence' AND "Price" = 27 AND "StockQuantity" = 2 AND "MainImageUrl" = '/products/noir-essence.webp') THEN RAISE EXCEPTION 'Product identity, price or stock changed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM "Orders" WHERE "OrderNumber" = 'LEGACY-ORDER' AND "ShopId" = '22222222-2222-2222-2222-222222222222' AND "PaymentStatus" = 'paid' AND "Total" = 32) THEN RAISE EXCEPTION 'Order changed'; END IF;
  IF NOT EXISTS (SELECT 1 FROM "Users" WHERE "Email" = 'existing-owner@example.invalid' AND "PasswordHash" = 'preserve-this-hash' AND "ShopId" = '22222222-2222-2222-2222-222222222222') THEN RAISE EXCEPTION 'User changed'; END IF;
  IF (SELECT COUNT(*) FROM "Products" WHERE "ShopId" = '22222222-2222-2222-2222-222222222222') <> 24 THEN RAISE EXCEPTION 'Seed products duplicated'; END IF;
  IF NOT EXISTS (SELECT 1 FROM "DeliverySettings" WHERE "BakuFee" = 6 AND "RegionsFee" = 9 AND "FreeDeliveryFrom" = 160) THEN RAISE EXCEPTION 'Delivery settings overwritten'; END IF;
END $$;
