using Aromera.Domain;
using Microsoft.EntityFrameworkCore;

namespace Aromera.Infrastructure;

public sealed class AromeraDbContext(DbContextOptions<AromeraDbContext> options) : DbContext(options)
{
    public DbSet<Shop> Shops => Set<Shop>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<PaymentProviderSetting> PaymentProviderSettings => Set<PaymentProviderSetting>();
    public DbSet<DeliverySetting> DeliverySettings => Set<DeliverySetting>();
    public DbSet<ThemeSetting> ThemeSettings => Set<ThemeSetting>();
    public DbSet<InventoryLog> InventoryLogs => Set<InventoryLog>();
    public DbSet<Coupon> Coupons => Set<Coupon>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Shop>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<Category>().HasIndex(x => new { x.ShopId, x.Slug }).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(x => new { x.ShopId, x.Slug }).IsUnique();
        modelBuilder.Entity<Order>().HasIndex(x => new { x.ShopId, x.OrderNumber }).IsUnique();

        modelBuilder.Entity<Product>().Property(x => x.Price).HasPrecision(12, 2);
        modelBuilder.Entity<Product>().Property(x => x.OldPrice).HasPrecision(12, 2);
        modelBuilder.Entity<Order>().Property(x => x.Subtotal).HasPrecision(12, 2);
        modelBuilder.Entity<Order>().Property(x => x.DeliveryFee).HasPrecision(12, 2);
        modelBuilder.Entity<Order>().Property(x => x.Total).HasPrecision(12, 2);
        modelBuilder.Entity<OrderItem>().Property(x => x.UnitPrice).HasPrecision(12, 2);
        modelBuilder.Entity<OrderItem>().Property(x => x.Total).HasPrecision(12, 2);
        modelBuilder.Entity<Payment>().Property(x => x.Amount).HasPrecision(12, 2);
        modelBuilder.Entity<DeliverySetting>().Property(x => x.BakuFee).HasPrecision(12, 2);
        modelBuilder.Entity<DeliverySetting>().Property(x => x.RegionsFee).HasPrecision(12, 2);
        modelBuilder.Entity<DeliverySetting>().Property(x => x.FreeDeliveryFrom).HasPrecision(12, 2);
        modelBuilder.Entity<Coupon>().Property(x => x.DiscountAmount).HasPrecision(12, 2);
    }
}
