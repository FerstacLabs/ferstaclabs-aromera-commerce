using Aromera.Domain;
using Microsoft.EntityFrameworkCore;

namespace Aromera.Infrastructure;

public static class SeedData
{
    public static async Task EnsureSeededAsync(AromeraDbContext db, IPasswordHasher hasher, CancellationToken cancellationToken = default)
    {
        var shopId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var shop = await db.Shops.FirstOrDefaultAsync(x => x.Slug == "ehdi-parfum" || x.Slug == "aromera", cancellationToken);
        if (shop is null)
        {
            shop = new Shop
            {
                Id = shopId,
                Name = "Əhdi Parfum",
                Slug = "ehdi-parfum",
                Phone = "+994556994666",
                WhatsApp = "+994556994666",
                Address = "Bakı şəhəri, Qara Qarayev küçəsi 74A"
            };
            db.Shops.Add(shop);
        }
        else
        {
            shopId = shop.Id;
        }

        var categoryNames = new[]
        {
            "Kişi ətirləri", "Qadın ətirləri", "Unisex ətirlər", "Premium seçimlər",
            "Hədiyyə seçimləri", "Yeni gələnlər", "Endirimli məhsullar"
        };
        var categories = new List<Category>();
        var existingCategories = await db.Categories.Where(x => x.ShopId == shopId).ToDictionaryAsync(x => x.Slug, cancellationToken);
        foreach (var name in categoryNames)
        {
            var slug = Slugify(name);
            if (!existingCategories.TryGetValue(slug, out var category))
            {
                category = new Category { Id = Guid.NewGuid(), ShopId = shopId, Slug = slug, Name = name, Description = $"{name} ilə tanış olun" };
                db.Categories.Add(category);
            }
            categories.Add(category);
        }

        var productNames = new[]
        {
            "Noir Essence", "Midnight Musk", "Oud Mirage", "Silver Cedar", "Citrus Bloom", "Golden Saffron",
            "Ocean Mist", "Rose Imperial", "Velvet Oud", "Royal Amber", "Tuscan Fig", "White Neroli",
            "Amber Veil", "Saffron Night", "Musk Royale", "Bergamot Sky", "Vanilla Dusk", "Cedar Wood",
            "Rose Noir", "Aqua Vetiver", "Jasmine Cloud", "Noir Absolute", "Imperial Oud", "Fresh Amber"
        };
        var legacySlugBySlug = new Dictionary<string, string>
        {
            ["noir-essence"] = "aromera-noir-essence",
            ["amber-veil"] = "amber-dusk",
            ["saffron-night"] = "satin-peony",
            ["musk-royale"] = "sandal-veil",
            ["bergamot-sky"] = "aqua-basil",
            ["vanilla-dusk"] = "cashmere-iris",
            ["cedar-wood"] = "jasmine-aura",
            ["rose-noir"] = "leather-noir",
            ["aqua-vetiver"] = "bergamot-silk",
            ["jasmine-cloud"] = "vanilla-ember",
            ["noir-absolute"] = "musk-atelier",
            ["imperial-oud"] = "pearl-garden",
            ["fresh-amber"] = "crimson-spice"
        };

        var productTemplates = productNames.Select((name, index) =>
        {
            var category = categories[index % categories.Count];
            var price = 64 + index * 5;
            return new Product
            {
                Id = Guid.NewGuid(),
                ShopId = shopId,
                CategoryId = category.Id,
                Name = name,
                Slug = Slugify(name),
                Brand = index % 3 == 0 ? "Əhdi Selection" : index % 3 == 1 ? "Premium Collection" : "Signature Collection",
                Gender = index % 3 == 0 ? "unisex" : index % 3 == 1 ? "qadın" : "kişi",
                ShortDescription = "Zərif notlarla gündəlik stilə premium toxunuş.",
                Description = $"{name} haqqında ətraflı məlumat və mövcud seçimlər üçün mağaza ilə əlaqə saxlayın.",
                Price = price,
                OldPrice = index % 5 == 0 ? price + 18 : null,
                StockQuantity = 8 + index,
                Volume = index % 3 == 0 ? "50ml" : index % 3 == 1 ? "75ml" : "100ml",
                Concentration = index % 3 == 0 ? "EDP" : index % 3 == 1 ? "Parfum" : "EDT",
                MainImageUrl = $"/products/{Slugify(name)}.webp",
                IsFeatured = index < 8,
                IsBestseller = index % 4 == 0,
                IsActive = true
            };
        }).ToList();

        var existingProducts = await db.Products.Where(x => x.ShopId == shopId).ToDictionaryAsync(x => x.Slug, cancellationToken);
        var products = new List<Product>();
        foreach (var template in productTemplates)
        {
            if (!existingProducts.TryGetValue(template.Slug, out var product)
                && legacySlugBySlug.TryGetValue(template.Slug, out var legacySlug)
                && existingProducts.TryGetValue(legacySlug, out var legacyProduct))
            {
                product = legacyProduct;
                product.Slug = template.Slug;
            }

            if (product is null)
            {
                product = template;
                db.Products.Add(product);
            }
            else
            {
                // Only repair legacy seed images; preserve inventory and admin edits on restart.
                if (string.IsNullOrWhiteSpace(product.MainImageUrl) || product.MainImageUrl.EndsWith(".svg")
                    || product.MainImageUrl.Contains("unsplash.com"))
                    product.MainImageUrl = template.MainImageUrl;
            }
            products.Add(product);
        }

        var seededSlugs = productTemplates.Select(x => x.Slug).ToHashSet();
        foreach (var legacySlug in legacySlugBySlug.Values)
        {
            if (existingProducts.TryGetValue(legacySlug, out var legacyProduct) && !seededSlugs.Contains(legacyProduct.Slug))
            {
                legacyProduct.IsActive = false;
                legacyProduct.UpdatedAt = DateTimeOffset.UtcNow;
            }
        }

        var customers = new[]
        {
            new Customer { Id = Guid.NewGuid(), ShopId = shopId, Name = "Leyla Məmmədova", Phone = "+994 55 222 10 11", Address = "Nərimanov, Bakı" },
            new Customer { Id = Guid.NewGuid(), ShopId = shopId, Name = "Rauf Əliyev", Phone = "+994 50 333 20 22", Address = "Yasamal, Bakı" }
        };

        var orders = customers.Select((customer, index) => new Order
        {
            Id = Guid.NewGuid(),
            ShopId = shopId,
            CustomerId = customer.Id,
            OrderNumber = $"ARO-{DateTime.UtcNow:yyyyMMdd}-{1000 + index}",
            Status = index == 0 ? "paid" : "packed",
            PaymentStatus = "paid",
            Subtotal = products[index].Price * 2,
            DeliveryFee = 0,
            Total = products[index].Price * 2,
            CustomerName = customer.Name,
            CustomerPhone = customer.Phone,
            DeliveryAddress = customer.Address ?? "",
            Note = "Hədiyyə paketi əlavə edin"
        }).ToList();

        foreach (var (order, index) in orders.Select((value, index) => (value, index)))
        {
            order.Items.Add(new OrderItem
            {
                OrderId = order.Id,
                ProductId = products[index].Id,
                ProductName = products[index].Name,
                Quantity = 2,
                UnitPrice = products[index].Price,
                Total = products[index].Price * 2
            });
        }

        if (!await db.Users.AnyAsync(x => x.Email == "admin@aromera.az", cancellationToken))
        {
            db.Users.Add(new User
            {
                ShopId = shopId,
                Email = "admin@aromera.az",
                PasswordHash = hasher.Hash("Admin123!ChangeMe"),
                Role = "owner"
            });
        }

        if (!await db.PaymentProviderSettings.AnyAsync(x => x.ShopId == shopId, cancellationToken))
        {
            db.PaymentProviderSettings.AddRange(
                new PaymentProviderSetting { ShopId = shopId, Provider = "Mock", IsEnabled = true, IsTestMode = true },
                new PaymentProviderSetting { ShopId = shopId, Provider = "Epoint", IsEnabled = false, IsTestMode = true },
                new PaymentProviderSetting { ShopId = shopId, Provider = "Payriff", IsEnabled = false, IsTestMode = true });
        }

        if (!await db.DeliverySettings.AnyAsync(x => x.ShopId == shopId, cancellationToken))
            db.DeliverySettings.Add(new DeliverySetting { ShopId = shopId, Note = "Bakı daxili çatdırılma mövcuddur" });

        if (!await db.ThemeSettings.AnyAsync(x => x.ShopId == shopId, cancellationToken))
            db.ThemeSettings.Add(new ThemeSetting { ShopId = shopId });

        if (!await db.Orders.AnyAsync(x => x.ShopId == shopId, cancellationToken))
        {
            db.Customers.AddRange(customers);
            db.Orders.AddRange(orders);
        }
        await db.SaveChangesAsync(cancellationToken);
    }

    private static string Slugify(string value)
    {
        return value.ToLowerInvariant()
            .Replace("ə", "e").Replace("ı", "i").Replace("ö", "o").Replace("ü", "u")
            .Replace("ğ", "g").Replace("ş", "s").Replace("ç", "c")
            .Replace(" ", "-").Replace("'", "");
    }
}
