namespace Aromera.Application;

public sealed record LoginRequest(string Email, string Password);
public sealed record AuthResponse(string Token, string Email, string Role, string ShopSlug);
public sealed record CheckoutItem(Guid ProductId, int Quantity);
public sealed record CheckoutRequest(
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    string DeliveryAddress,
    string? Note,
    string DeliveryMethod,
    string PaymentMethod,
    List<CheckoutItem> Items);

public sealed record PaymentCreateRequest(Guid OrderId, string Provider);
public sealed record PaymentResult(Guid OrderId, string Status, string RedirectUrl, string Provider);
public sealed record UpsertProductRequest(
    Guid? CategoryId,
    string Name,
    string Slug,
    string Brand,
    string Gender,
    string ShortDescription,
    string Description,
    decimal Price,
    decimal? OldPrice,
    int StockQuantity,
    string Volume,
    string Concentration,
    string MainImageUrl,
    bool IsFeatured,
    bool IsBestseller,
    bool IsActive);
