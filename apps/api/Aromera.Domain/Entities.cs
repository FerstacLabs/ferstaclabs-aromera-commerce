namespace Aromera.Domain;

public sealed class Shop
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string? LegalName { get; set; }
    public string? Voen { get; set; }
    public string Phone { get; set; } = "";
    public string WhatsApp { get; set; } = "";
    public string? Email { get; set; }
    public string? Instagram { get; set; }
    public string Address { get; set; } = "";
    public string LogoUrl { get; set; } = "/brand/ehdi-hasan-logo.svg";
    public string Slogan { get; set; } = "BİR KEYFİYYƏT BRENDİ";
    public string HeroText { get; set; } = "Ətirinizi seçin. İziniz yadda qalsın.";
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public Shop? Shop { get; set; }
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "owner";
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class Customer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public string Name { get; set; } = "";
    public string Phone { get; set; } = "";
    public string? Email { get; set; }
    public string? Address { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
}

public sealed class Product
{
    [System.ComponentModel.DataAnnotations.Schema.NotMapped]
    public List<ProductImage> Images { get; set; } = [];
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public Guid CategoryId { get; set; }
    public Category? Category { get; set; }
    public string Name { get; set; } = "";
    public string Slug { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Gender { get; set; } = "";
    public string ShortDescription { get; set; } = "";
    public string Description { get; set; } = "";
    public decimal Price { get; set; }
    public decimal? OldPrice { get; set; }
    public int StockQuantity { get; set; }
    public string Volume { get; set; } = "";
    public string Concentration { get; set; } = "";
    public string MainImageUrl { get; set; } = "";
    public bool IsFeatured { get; set; }
    public bool IsBestseller { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class ProductImage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public string Url { get; set; } = "";
    public string? Alt { get; set; }
    public int SortOrder { get; set; }
}

public sealed class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public string OrderNumber { get; set; } = "";
    public string Status { get; set; } = "pending";
    public string PaymentStatus { get; set; } = "unpaid";
    public decimal Subtotal { get; set; }
    public decimal DeliveryFee { get; set; }
    public decimal Total { get; set; }
    public string CustomerName { get; set; } = "";
    public string CustomerPhone { get; set; } = "";
    public string? CustomerEmail { get; set; }
    public string DeliveryAddress { get; set; } = "";
    public string? Note { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
    public List<OrderItem> Items { get; set; } = [];
}

public sealed class OrderItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = "";
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Total { get; set; }
}

public sealed class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public Guid OrderId { get; set; }
    public string Provider { get; set; } = "Mock";
    public string? ProviderTransactionId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "AZN";
    public string Status { get; set; } = "pending";
    public string? RawRequestJson { get; set; }
    public string? RawResponseJson { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class PaymentProviderSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public string Provider { get; set; } = "Mock";
    public string? PublicKeyEncrypted { get; set; }
    public string? PrivateKeyEncrypted { get; set; }
    public string? MerchantIdEncrypted { get; set; }
    public bool IsEnabled { get; set; }
    public bool IsTestMode { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class DeliverySetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public decimal BakuFee { get; set; } = 5;
    public decimal RegionsFee { get; set; } = 8;
    public decimal FreeDeliveryFrom { get; set; } = 150;
    public string Note { get; set; } = "Baki daxili catdirilma movcuddur";
}

public sealed class ThemeSetting
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public string PrimaryColor { get; set; } = "#171512";
    public string AccentColor { get; set; } = "#B99045";
}

public sealed class InventoryLog
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public Guid ProductId { get; set; }
    public int Change { get; set; }
    public string Reason { get; set; } = "";
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}

public sealed class Coupon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ShopId { get; set; }
    public string Code { get; set; } = "";
    public decimal DiscountAmount { get; set; }
    public bool IsActive { get; set; }
}
