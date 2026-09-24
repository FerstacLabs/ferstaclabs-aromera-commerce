using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Aromera.Application;
using Aromera.Domain;
using Aromera.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AromeraDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ISecretProtector, DevelopmentSecretProtector>();
builder.Services.AddScoped<IPaymentProvider, MockPaymentProvider>();
builder.Services.AddScoped<IPaymentProvider, EpointPaymentProvider>();
builder.Services.AddScoped<IPaymentProvider, PayriffPaymentProvider>();
builder.Services.AddScoped<PaymentProviderFactory>();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
    policy.WithOrigins(builder.Configuration["FrontendUrl"] ?? "http://localhost:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var jwtSecret = builder.Configuration["Jwt:Secret"] ?? "CHANGE_ME_TO_LONG_RANDOM_SECRET_CHANGE_ME";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });
builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AromeraDbContext>();
    await db.Database.MigrateAsync();
    await SeedData.EnsureSeededAsync(db, scope.ServiceProvider.GetRequiredService<IPasswordHasher>());
}

app.MapPost("/api/auth/login", async (LoginRequest request, AromeraDbContext db, IPasswordHasher hasher) =>
{
    var user = await db.Users.Include(x => x.Shop).FirstOrDefaultAsync(x => x.Email == request.Email && x.IsActive);
    if (user is null || !hasher.Verify(request.Password, user.PasswordHash)) return Results.Unauthorized();
    var claims = new[]
    {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role),
        new Claim("shopId", user.ShopId.ToString()),
        new Claim("shopSlug", user.Shop?.Slug ?? "")
    };
    var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)), SecurityAlgorithms.HmacSha256);
    var token = new JwtSecurityToken(builder.Configuration["Jwt:Issuer"], builder.Configuration["Jwt:Audience"], claims, expires: DateTime.UtcNow.AddHours(8), signingCredentials: credentials);
    return Results.Ok(new AuthResponse(new JwtSecurityTokenHandler().WriteToken(token), user.Email, user.Role, user.Shop?.Slug ?? "ehdi-parfum"));
});
app.MapPost("/api/auth/refresh", [Authorize] () => Results.Ok());
app.MapPost("/api/auth/logout", [Authorize] () => Results.NoContent());
app.MapGet("/api/auth/me", [Authorize] (ClaimsPrincipal user) => Results.Ok(new { email = user.FindFirstValue(ClaimTypes.Email), role = user.FindFirstValue(ClaimTypes.Role), shopSlug = user.FindFirstValue("shopSlug") }));

app.MapGet("/api/shops/by-slug/{slug}", async (string slug, AromeraDbContext db) =>
    await db.Shops.FirstOrDefaultAsync(x => x.Slug == (slug == "aromera" ? "ehdi-parfum" : slug) && x.IsActive) is { } shop ? Results.Ok(await ShopConfiguration(shop, db)) : Results.NotFound());
app.MapGet("/api/shops/current", async (AromeraDbContext db) =>
    await db.Shops.FirstOrDefaultAsync(x => x.Slug == "ehdi-parfum" && x.IsActive) is { } shop ? Results.Ok(await ShopConfiguration(shop, db)) : Results.NotFound());
app.MapGet("/api/admin/shop/settings", [Authorize] async (ClaimsPrincipal user, AromeraDbContext db) =>
    await CurrentShop(user, db) is { } shop ? Results.Ok(await ShopConfiguration(shop, db)) : Results.NotFound());
app.MapPut("/api/admin/shop/settings", [Authorize] async (ShopSettingsRequest input, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shop = await CurrentShop(user, db);
    if (shop is null) return Results.NotFound();
    shop.Name = input.Name; shop.Phone = input.Phone; shop.WhatsApp = input.WhatsApp; shop.Address = input.Address;
    if (string.IsNullOrWhiteSpace(input.Name) || !System.Text.RegularExpressions.Regex.IsMatch(input.PrimaryColor ?? "", "^#[0-9a-fA-F]{6}$")
        || !System.Text.RegularExpressions.Regex.IsMatch(input.AccentColor ?? "", "^#[0-9a-fA-F]{6}$"))
        return Results.BadRequest(new { message = "Ad və rəngləri yoxlayın." });
    shop.LegalName = input.LegalName; shop.Voen = input.Voen; shop.LogoUrl = input.LogoUrl;
    shop.Slogan = input.Slogan; shop.HeroText = input.HeroText; shop.UpdatedAt = DateTimeOffset.UtcNow;
    var theme = await db.ThemeSettings.FirstOrDefaultAsync(x => x.ShopId == shop.Id);
    if (theme is null) { theme = new ThemeSetting { ShopId = shop.Id }; db.ThemeSettings.Add(theme); }
    theme.PrimaryColor = input.PrimaryColor!; theme.AccentColor = input.AccentColor!;
    await db.SaveChangesAsync();
    return Results.Ok(await ShopConfiguration(shop, db));
});

app.MapGet("/api/{shopSlug}/categories", async (string shopSlug, AromeraDbContext db) =>
    await db.Categories.Where(x => x.ShopId == db.Shops.Where(s => s.Slug == (shopSlug == "aromera" ? "ehdi-parfum" : shopSlug)).Select(s => s.Id).FirstOrDefault() && x.IsActive).OrderBy(x => x.Name).ToListAsync());
app.MapGet("/api/{shopSlug}/products", async (string shopSlug, string? q, string? category, string? gender, string? brand, decimal? minPrice, decimal? maxPrice, AromeraDbContext db) =>
{
    var shop = await db.Shops.FirstOrDefaultAsync(x => x.Slug == (shopSlug == "aromera" ? "ehdi-parfum" : shopSlug) && x.IsActive);
    if (shop is null) return Results.NotFound();
    var query = db.Products.Include(x => x.Category).Where(x => x.ShopId == shop.Id && x.IsActive);
    if (!string.IsNullOrWhiteSpace(q)) query = query.Where(x => x.Name.ToLower().Contains(q.ToLower()) || x.Brand.ToLower().Contains(q.ToLower()));
    if (!string.IsNullOrWhiteSpace(category)) query = query.Where(x => x.Category != null && x.Category.Slug == category);
    if (!string.IsNullOrWhiteSpace(gender)) query = query.Where(x => x.Gender == gender);
    if (!string.IsNullOrWhiteSpace(brand)) query = query.Where(x => x.Brand == brand);
    if (minPrice.HasValue) query = query.Where(x => x.Price >= minPrice.Value);
    if (maxPrice.HasValue) query = query.Where(x => x.Price <= maxPrice.Value);
    return Results.Ok(await query.OrderByDescending(x => x.IsFeatured).ThenBy(x => x.Name).ToListAsync());
});
app.MapGet("/api/{shopSlug}/products/{slug}", async (string shopSlug, string slug, AromeraDbContext db) =>
{
    var shop = await db.Shops.FirstOrDefaultAsync(x => x.Slug == (shopSlug == "aromera" ? "ehdi-parfum" : shopSlug) && x.IsActive);
    if (shop is null) return Results.NotFound();
    var product = await db.Products.Include(x => x.Category).FirstOrDefaultAsync(x => x.ShopId == shop.Id && x.Slug == slug && x.IsActive);
    if (product is not null) product.Images = await db.ProductImages.Where(x => x.ProductId == product.Id).OrderBy(x => x.SortOrder).ToListAsync();
    return product is null ? Results.NotFound() : Results.Ok(product);
});

app.MapPost("/api/{shopSlug}/checkout", async (string shopSlug, CheckoutRequest request, AromeraDbContext db, IConfiguration configuration) =>
{
    if (request.Items.Count == 0 || string.IsNullOrWhiteSpace(request.CustomerName) || string.IsNullOrWhiteSpace(request.CustomerPhone))
        return Results.BadRequest(new { message = "Məlumatları tam doldurun." });
    var shop = await db.Shops.FirstOrDefaultAsync(x => x.Slug == (shopSlug == "aromera" ? "ehdi-parfum" : shopSlug) && x.IsActive);
    if (shop is null) return Results.NotFound();
    var productIds = request.Items.Select(x => x.ProductId).ToList();
    var products = await db.Products.Where(x => x.ShopId == shop.Id && productIds.Contains(x.Id) && x.IsActive).ToListAsync();
    if (products.Count != productIds.Count) return Results.BadRequest(new { message = "Səbətdə mövcud olmayan məhsul var." });

    var customer = new Customer { ShopId = shop.Id, Name = request.CustomerName, Phone = request.CustomerPhone, Email = request.CustomerEmail, Address = request.DeliveryAddress };
    var order = new Order
    {
        ShopId = shop.Id,
        CustomerId = customer.Id,
        OrderNumber = $"EH-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}",
        Status = request.PaymentMethod == "card" ? "awaiting_payment" : "pending",
        PaymentStatus = request.PaymentMethod == "card" ? "pending" : "unpaid",
        CustomerName = request.CustomerName,
        CustomerPhone = request.CustomerPhone,
        CustomerEmail = request.CustomerEmail,
        DeliveryAddress = request.DeliveryAddress,
        Note = request.Note
    };
    foreach (var item in request.Items)
    {
        var product = products.First(x => x.Id == item.ProductId);
        var quantity = Math.Max(1, item.Quantity);
        order.Items.Add(new OrderItem { OrderId = order.Id, ProductId = product.Id, ProductName = product.Name, Quantity = quantity, UnitPrice = product.Price, Total = product.Price * quantity });
    }
    order.Subtotal = order.Items.Sum(x => x.Total);
    var delivery = await db.DeliverySettings.FirstOrDefaultAsync(x => x.ShopId == shop.Id) ?? new DeliverySetting();
    order.DeliveryFee = order.Subtotal >= delivery.FreeDeliveryFrom ? 0 : request.DeliveryMethod == "regions" ? delivery.RegionsFee : delivery.BakuFee;
    order.Total = order.Subtotal + order.DeliveryFee;
    db.Customers.Add(customer);
    db.Orders.Add(order);

    var providerName = request.PaymentMethod == "card"
        ? configuration["Payments:DefaultProvider"] ?? "Mock"
        : request.PaymentMethod == "whatsapp" ? "WhatsApp" : "Cash";
    var payment = new Payment { ShopId = shop.Id, OrderId = order.Id, Provider = providerName, Amount = order.Total, Status = request.PaymentMethod == "card" ? "pending" : "unpaid" };
    db.Payments.Add(payment);
    await db.SaveChangesAsync();

    var successUrl = $"/checkout/success?orderNumber={Uri.EscapeDataString(order.OrderNumber)}&paymentStatus={order.PaymentStatus}";
    return Results.Ok(new CheckoutResponse(
        order.Id,
        order.OrderNumber,
        request.PaymentMethod == "card",
        providerName,
        order.PaymentStatus,
        request.PaymentMethod == "card" ? null : successUrl));
});

app.MapPost("/api/{shopSlug}/payments/create", async (string shopSlug, PaymentCreateRequest request, AromeraDbContext db, PaymentProviderFactory factory) =>
{
    var shop = await db.Shops.FirstOrDefaultAsync(x => x.Slug == (shopSlug == "aromera" ? "ehdi-parfum" : shopSlug) && x.IsActive);
    var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == request.OrderId && shop != null && x.ShopId == shop.Id);
    if (shop is null || order is null) return Results.NotFound();
    var payment = await db.Payments.FirstOrDefaultAsync(x => x.ShopId == shop.Id && x.OrderId == order.Id);
    if (payment is null) return Results.BadRequest();
    // Checkout selects the provider; a browser cannot downgrade a hosted payment to Mock.
    var providerName = payment.Provider;
    if (providerName is "Cash" or "WhatsApp" || (request.Provider is not null && !request.Provider.Equals(providerName, StringComparison.OrdinalIgnoreCase)))
        return Results.BadRequest();

    if (providerName.Equals("Mock", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Ok(new PaymentCreateResponse(order.Id, order.OrderNumber, "Mock", order.Total, "AZN", true, null, null));
    }

    var result = await factory.Get(providerName).CreateAsync(shop, order, CancellationToken.None);
    var redirect = string.IsNullOrWhiteSpace(result.RedirectUrl) ? null : result.RedirectUrl;
    return Results.Ok(new PaymentCreateResponse(
        order.Id,
        order.OrderNumber,
        result.Provider,
        order.Total,
        "AZN",
        false,
        redirect,
        redirect));
});
app.MapPost("/api/{shopSlug}/payments/mock/confirm", async (string shopSlug, MockPaymentConfirmRequest request, AromeraDbContext db) =>
{
    if (request.Result is not ("success" or "failed")) return Results.BadRequest(new { message = "Yanlış ödəniş nəticəsi." });
    var shop = await db.Shops.FirstOrDefaultAsync(x => x.Slug == (shopSlug == "aromera" ? "ehdi-parfum" : shopSlug) && x.IsActive);
    var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == request.OrderId && shop != null && x.ShopId == shop.Id);
    if (shop is null || order is null) return Results.NotFound();
    var payment = await db.Payments.FirstOrDefaultAsync(x => x.ShopId == shop.Id && x.OrderId == order.Id);
    if (payment is null || !payment.Provider.Equals("Mock", StringComparison.OrdinalIgnoreCase)) return Results.BadRequest();
    if (payment.Status == "paid") return Results.Ok(new { orderId = order.Id, orderNumber = order.OrderNumber, status = payment.Status, paymentStatus = order.PaymentStatus });

    if (request.Result == "success")
    {
        payment.Status = "paid";
        payment.ProviderTransactionId ??= $"mock_{order.Id:N}";
        order.PaymentStatus = "paid";
        order.Status = "paid";
    }
    else
    {
        payment.Status = "failed";
        order.PaymentStatus = "failed";
        order.Status = "awaiting_payment";
    }
    payment.UpdatedAt = DateTimeOffset.UtcNow;
    order.UpdatedAt = DateTimeOffset.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(new { orderId = order.Id, orderNumber = order.OrderNumber, status = payment.Status, paymentStatus = order.PaymentStatus });
});
app.MapPost("/api/{shopSlug}/payments/epoint/callback", async (string shopSlug, Dictionary<string, string> payload, PaymentProviderFactory factory) =>
    await factory.Get("Epoint").ValidateCallbackAsync(payload, CancellationToken.None) ? Results.Ok() : Results.BadRequest());
app.MapPost("/api/{shopSlug}/payments/payriff/callback", async (string shopSlug, Dictionary<string, string> payload, PaymentProviderFactory factory) =>
    await factory.Get("Payriff").ValidateCallbackAsync(payload, CancellationToken.None) ? Results.Ok() : Results.BadRequest());
app.MapGet("/api/{shopSlug}/payments/{orderId:guid}/status", async (string shopSlug, Guid orderId, AromeraDbContext db) =>
    await db.Payments.FirstOrDefaultAsync(x => x.OrderId == orderId) is { } payment ? Results.Ok(payment) : Results.NotFound());

var admin = app.MapGroup("/api/admin").RequireAuthorization();
admin.MapGet("/products", async (ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var products = await db.Products.Include(x => x.Category).Where(x => x.ShopId == shopId).OrderBy(x => x.Name).ToListAsync();
    var ids = products.Select(x => x.Id).ToList();
    var images = await db.ProductImages.Where(x => ids.Contains(x.ProductId)).OrderBy(x => x.SortOrder).ToListAsync();
    foreach (var product in products) product.Images = images.Where(x => x.ProductId == product.Id).ToList();
    return products;
});
admin.MapPost("/products", async (UpsertProductRequest request, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var categoryId = request.CategoryId ?? await db.Categories.Where(x => x.ShopId == shopId).Select(x => x.Id).FirstAsync();
    if (!await db.Categories.AnyAsync(x => x.Id == categoryId && x.ShopId == shopId)) return Results.BadRequest();
    if (await db.Products.AnyAsync(x => x.ShopId == shopId && x.Slug == request.Slug)) return Results.Conflict();
    var product = new Product { ShopId = shopId, CategoryId = categoryId };
    ApplyProduct(product, request);
    db.Products.Add(product);
    await ReplaceProductImages(db, product.Id, request.Images);
    await db.SaveChangesAsync();
    return Results.Created($"/api/admin/products/{product.Id}", product);
});
admin.MapPut("/products/{id:guid}", async (Guid id, UpsertProductRequest request, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var product = await db.Products.FirstOrDefaultAsync(x => x.Id == id && x.ShopId == shopId);
    if (product is null) return Results.NotFound();
    if (request.CategoryId.HasValue && !await db.Categories.AnyAsync(x => x.Id == request.CategoryId && x.ShopId == shopId)) return Results.BadRequest();
    if (await db.Products.AnyAsync(x => x.ShopId == shopId && x.Slug == request.Slug && x.Id != id)) return Results.Conflict();
    ApplyProduct(product, request);
    await ReplaceProductImages(db, product.Id, request.Images);
    product.UpdatedAt = DateTimeOffset.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(product);
});
admin.MapDelete("/products/{id:guid}", async (Guid id, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var product = await db.Products.FirstOrDefaultAsync(x => x.Id == id && x.ShopId == shopId);
    if (product is null) return Results.NotFound();
    product.IsActive = false;
    await db.SaveChangesAsync();
    return Results.NoContent();
});
admin.MapGet("/categories", async (ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    return await db.Categories.Where(x => x.ShopId == shopId).ToListAsync();
});
admin.MapPost("/categories", async (Category input, ClaimsPrincipal user, AromeraDbContext db) =>
{
    input.Id = Guid.NewGuid(); input.ShopId = ShopId(user);
    db.Categories.Add(input); await db.SaveChangesAsync(); return Results.Created($"/api/admin/categories/{input.Id}", input);
});
admin.MapPut("/categories/{id:guid}", async (Guid id, Category input, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var category = await db.Categories.FirstOrDefaultAsync(x => x.Id == id && x.ShopId == shopId);
    if (category is null) return Results.NotFound();
    category.Name = input.Name; category.Slug = input.Slug; category.Description = input.Description; category.IsActive = input.IsActive;
    await db.SaveChangesAsync(); return Results.Ok(category);
});
admin.MapDelete("/categories/{id:guid}", async (Guid id, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var category = await db.Categories.FirstOrDefaultAsync(x => x.Id == id && x.ShopId == shopId);
    if (category is null) return Results.NotFound();
    category.IsActive = false; await db.SaveChangesAsync(); return Results.NoContent();
});
admin.MapGet("/orders", async (ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var rows = await db.Orders
        .Include(x => x.Items)
        .Where(x => x.ShopId == shopId)
        .OrderByDescending(x => x.CreatedAt)
        .Select(order => new
        {
            order.Id,
            order.OrderNumber,
            order.CustomerName,
            order.CustomerPhone,
            order.Total,
            order.Status,
            order.PaymentStatus,
            PaymentProvider = db.Payments.Where(payment => payment.OrderId == order.Id).Select(payment => payment.Provider).FirstOrDefault() ?? "Cash",
            order.CreatedAt,
            order.Items
        })
        .ToListAsync();
    return rows.Select(order => new
    {
        order.Id,
        order.OrderNumber,
        order.CustomerName,
        order.CustomerPhone,
        order.Total,
        order.Status,
        order.PaymentStatus,
        PaymentMethod = order.PaymentProvider is "Mock" or "Epoint" or "Payriff"
            ? "Kartla ödəniş"
            : order.PaymentProvider == "WhatsApp" ? "WhatsApp ilə sifariş" : "Çatdırılma zamanı",
        order.CreatedAt,
        order.Items
    });
});
admin.MapGet("/orders/{id:guid}", async (Guid id, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    return await db.Orders.Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == id && x.ShopId == shopId) is { } order ? Results.Ok(order) : Results.NotFound();
});
admin.MapPut("/orders/{id:guid}/status", async (Guid id, Dictionary<string, string> body, ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var order = await db.Orders.FirstOrDefaultAsync(x => x.Id == id && x.ShopId == shopId);
    if (order is null) return Results.NotFound();
    order.Status = body.GetValueOrDefault("status", order.Status);
    order.UpdatedAt = DateTimeOffset.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok(order);
});
admin.MapGet("/dashboard", async (ClaimsPrincipal user, AromeraDbContext db) =>
{
    var shopId = ShopId(user);
    var orders = await db.Orders.Where(x => x.ShopId == shopId).ToListAsync();
    var lowStock = await db.Products.CountAsync(x => x.ShopId == shopId && x.StockQuantity <= 10);
    return Results.Ok(new
    {
        todayOrders = orders.Count(x => x.CreatedAt.Date == DateTimeOffset.UtcNow.Date),
        totalRevenue = orders.Where(x => x.PaymentStatus == "paid").Sum(x => x.Total),
        pendingOrders = orders.Count(x => x.Status is "pending" or "awaiting_payment"),
        lowStockProducts = lowStock
    });
});

app.Run();

static async Task<object> ShopConfiguration(Shop shop, AromeraDbContext db)
{
    var theme = await db.ThemeSettings.AsNoTracking().FirstOrDefaultAsync(x => x.ShopId == shop.Id) ?? new ThemeSetting();
    var delivery = await db.DeliverySettings.AsNoTracking().FirstOrDefaultAsync(x => x.ShopId == shop.Id) ?? new DeliverySetting();
    return new { shop.Id, shop.Name, shop.Slug, shop.LegalName, shop.Voen, shop.Phone, shop.WhatsApp,
        shop.Address, shop.LogoUrl, shop.Slogan, shop.HeroText, theme.PrimaryColor, theme.AccentColor,
        delivery = delivery.Note, delivery.BakuFee, delivery.RegionsFee, delivery.FreeDeliveryFrom };
}

static Guid ShopId(ClaimsPrincipal user) => Guid.Parse(user.FindFirstValue("shopId") ?? Guid.Empty.ToString());
static async Task<Shop?> CurrentShop(ClaimsPrincipal user, AromeraDbContext db)
{
    var shopId = ShopId(user);
    return await db.Shops.FirstOrDefaultAsync(x => x.Id == shopId);
}
static void ApplyProduct(Product product, UpsertProductRequest request)
{
    product.CategoryId = request.CategoryId ?? product.CategoryId;
    product.Name = request.Name; product.Slug = request.Slug; product.Brand = request.Brand; product.Gender = request.Gender;
    product.ShortDescription = request.ShortDescription; product.Description = request.Description;
    product.Price = request.Price; product.OldPrice = request.OldPrice; product.StockQuantity = request.StockQuantity;
    product.Volume = request.Volume; product.Concentration = request.Concentration; product.MainImageUrl = request.MainImageUrl;
    product.IsFeatured = request.IsFeatured; product.IsBestseller = request.IsBestseller; product.IsActive = request.IsActive;
}

static async Task ReplaceProductImages(AromeraDbContext db, Guid productId, List<ProductImageRequest>? images)
{
    if (images is null) return;
    db.ProductImages.RemoveRange(await db.ProductImages.Where(x => x.ProductId == productId).ToListAsync());
    db.ProductImages.AddRange(images.Where(x => !string.IsNullOrWhiteSpace(x.Url)).Select((x, index) =>
        new ProductImage { ProductId = productId, Url = x.Url, Alt = x.Alt, SortOrder = index }));
}
