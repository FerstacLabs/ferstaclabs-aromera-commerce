using Aromera.Domain;
using Microsoft.EntityFrameworkCore;

namespace Aromera.Infrastructure;

public static class SeedData
{
    public static async Task EnsureSeededAsync(AromeraDbContext db, IPasswordHasher hasher, CancellationToken cancellationToken = default)
    {
        if (await db.Shops.AnyAsync(cancellationToken)) return;

        var shop = new Shop
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
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

        var categoryNames = new[]
        {
            "Kişi ətirləri", "Qadın ətirləri", "Unisex ətirlər", "Oud kolleksiyası",
            "Hədiyyəlik setlər", "Yeni gələnlər", "Endirimli məhsullar"
        };
        var categories = categoryNames.Select((name, index) => new Category
        {
            Id = Guid.NewGuid(),
            ShopId = shop.Id,
            Name = name,
            Slug = Slugify(name),
            Description = $"{name} üçün Aromera seçimi",
            IsActive = true
        }).ToList();

        var imageBase = "https://images.unsplash.com/photo-";
        var imageIds = new[]
        {
            "1541643600914-78b084683601", "1594035910387-fea47794261f", "1587017539504-67cfbddac569",
            "1615634260167-c8cdede054de", "1608528577891-eb055944f2e2", "1595425959632-34f2822322ce",
            "1563170351-be82bc888aa4", "1592914610354-fd354ea45e48"
        };

        var productNames = new[]
        {
            "Aromera Noir Essence", "Velvet Oud", "Royal Amber", "Citrus Bloom", "Midnight Musk", "Golden Saffron",
            "Ocean Mist", "Rose Imperial", "Silver Cedar", "Amber Dusk", "White Neroli", "Satin Peony",
            "Tuscan Fig", "Sandal Veil", "Aqua Basil", "Cashmere Iris", "Oud Mirage", "Jasmine Aura",
            "Leather Noir", "Bergamot Silk", "Vanilla Ember", "Musk Atelier", "Pearl Garden", "Crimson Spice"
        };

        var products = productNames.Select((name, index) =>
        {
            var category = categories[index % categories.Count];
            var price = 64 + index * 5;
            return new Product
            {
                Id = Guid.NewGuid(),
                ShopId = shop.Id,
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
                MainImageUrl = $"{imageBase}{imageIds[index % imageIds.Length]}?auto=format&fit=crop&w=900&q=85",
                IsFeatured = index < 8,
                IsBestseller = index % 4 == 0,
                IsActive = true
            };
        }).ToList();

        var customers = new[]
        {
            new Customer { Id = Guid.NewGuid(), ShopId = shop.Id, Name = "Leyla Məmmədova", Phone = "+994 55 222 10 11", Address = "Nərimanov, Bakı" },
            new Customer { Id = Guid.NewGuid(), ShopId = shop.Id, Name = "Rauf Əliyev", Phone = "+994 50 333 20 22", Address = "Yasamal, Bakı" }
        };

        var orders = customers.Select((customer, index) => new Order
        {
            Id = Guid.NewGuid(),
            ShopId = shop.Id,
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

        db.Shops.Add(shop);
        db.Categories.AddRange(categories);
        db.Products.AddRange(products);
        db.Users.Add(new User
        {
            ShopId = shop.Id,
            Email = "admin@aromera.az",
            PasswordHash = hasher.Hash("Admin123!ChangeMe"),
            Role = "owner"
        });
        db.PaymentProviderSettings.AddRange(
            new PaymentProviderSetting { ShopId = shop.Id, Provider = "Mock", IsEnabled = true, IsTestMode = true },
            new PaymentProviderSetting { ShopId = shop.Id, Provider = "Epoint", IsEnabled = false, IsTestMode = true },
            new PaymentProviderSetting { ShopId = shop.Id, Provider = "Payriff", IsEnabled = false, IsTestMode = true });
        db.DeliverySettings.Add(new DeliverySetting { ShopId = shop.Id, Note = "Bakı daxili çatdırılma mövcuddur" });
        db.ThemeSettings.Add(new ThemeSetting { ShopId = shop.Id });
        db.Customers.AddRange(customers);
        db.Orders.AddRange(orders);
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
