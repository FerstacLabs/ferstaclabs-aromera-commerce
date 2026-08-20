using Aromera.Domain;
using Microsoft.EntityFrameworkCore;

namespace Aromera.Infrastructure;

public static class SeedData
{
    public static async Task EnsureSeededAsync(AromeraDbContext db, IPasswordHasher hasher, CancellationToken cancellationToken = default)
    {
        var shopId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var shop = await db.Shops.FirstOrDefaultAsync(x => x.Slug == "aromera", cancellationToken);
        if (shop is null)
        {
            shop = new Shop
            {
                Id = shopId,
                Name = "Aromera",
                Slug = "aromera",
                LegalName = "Aromera MMC",
                Voen = "0000000001",
                Phone = "+994 50 555 55 55",
                WhatsApp = "+994 50 555 55 55",
                Email = "salam@aromera.az",
                Instagram = "@aromera.az",
                Address = "Bakı, Azərbaycan"
            };
            db.Shops.Add(shop);
        }
        else
        {
            shopId = shop.Id;
            shop.Name = "Aromera";
            shop.Phone = "+994 50 555 55 55";
            shop.WhatsApp = "+994 50 555 55 55";
            shop.Address = "Bakı, Azərbaycan";
            shop.IsActive = true;
            shop.UpdatedAt = DateTimeOffset.UtcNow;
        }

        var categoryNames = new[]
        {
            "Kişi ətirləri", "Qadın ətirləri", "Unisex ətirlər", "Oud kolleksiyası",
            "Hədiyyəlik setlər", "Yeni gələnlər", "Endirimli məhsullar"
        };
        var categories = new List<Category>();
        var existingCategories = await db.Categories.Where(x => x.ShopId == shopId).ToDictionaryAsync(x => x.Slug, cancellationToken);
        foreach (var name in categoryNames)
        {
            var slug = Slugify(name);
            if (!existingCategories.TryGetValue(slug, out var category))
            {
                category = new Category { Id = Guid.NewGuid(), ShopId = shopId, Slug = slug };
                db.Categories.Add(category);
            }
            category.Name = name;
            category.Description = $"{name} üçün Aromera seçimi";
            category.IsActive = true;
            categories.Add(category);
        }

        var productNames = new[]
        {
            "Aromera Noir Essence", "Velvet Oud", "Royal Amber", "Citrus Bloom", "Midnight Musk", "Golden Saffron",
            "Ocean Mist", "Rose Imperial", "Silver Cedar", "Amber Dusk", "White Neroli", "Satin Peony",
            "Tuscan Fig", "Sandal Veil", "Aqua Basil", "Cashmere Iris", "Oud Mirage", "Jasmine Aura",
            "Leather Noir", "Bergamot Silk", "Vanilla Ember", "Musk Atelier", "Pearl Garden", "Crimson Spice"
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
                Brand = index % 3 == 0 ? "Aromera Private" : index % 3 == 1 ? "Maison Aura" : "Noir Atelier",
                Gender = index % 3 == 0 ? "unisex" : index % 3 == 1 ? "qadın" : "kişi",
                ShortDescription = "Zərif notlarla gündəlik stilə premium toxunuş.",
                Description = $"{name} isti, təmiz və yadda qalan akkordları birləşdirən seçilmiş ətirdir. Bakı ritminə uyğun uzunömürlü, səliqəli və hədiyyə üçün ideal kompozisiya kimi hazırlanıb.",
                Price = price,
                OldPrice = index % 5 == 0 ? price + 18 : null,
                StockQuantity = 8 + index,
                Volume = index % 3 == 0 ? "50ml" : index % 3 == 1 ? "75ml" : "100ml",
                Concentration = index % 3 == 0 ? "EDP" : index % 3 == 1 ? "Parfum" : "EDT",
                MainImageUrl = $"/products/{Slugify(name)}.svg",
                IsFeatured = index < 8,
                IsBestseller = index % 4 == 0,
                IsActive = true
            };
        }).ToList();

        var existingProducts = await db.Products.Where(x => x.ShopId == shopId).ToDictionaryAsync(x => x.Slug, cancellationToken);
        var products = new List<Product>();
        foreach (var template in productTemplates)
        {
            if (!existingProducts.TryGetValue(template.Slug, out var product))
            {
                product = template;
                db.Products.Add(product);
            }
            else
            {
                product.CategoryId = template.CategoryId;
                product.Name = template.Name;
                product.Brand = template.Brand;
                product.Gender = template.Gender;
                product.ShortDescription = template.ShortDescription;
                product.Description = template.Description;
                product.Price = template.Price;
                product.OldPrice = template.OldPrice;
                product.StockQuantity = Math.Max(product.StockQuantity, template.StockQuantity);
                product.Volume = template.Volume;
                product.Concentration = template.Concentration;
                product.MainImageUrl = template.MainImageUrl;
                product.IsFeatured = template.IsFeatured;
                product.IsBestseller = template.IsBestseller;
                product.IsActive = true;
                product.UpdatedAt = DateTimeOffset.UtcNow;
            }
            products.Add(product);
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
