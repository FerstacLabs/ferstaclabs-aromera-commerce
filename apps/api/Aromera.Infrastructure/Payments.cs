using Aromera.Application;
using Aromera.Domain;

namespace Aromera.Infrastructure;

public interface ISecretProtector
{
    string Protect(string value);
    string Unprotect(string value);
}

public sealed class DevelopmentSecretProtector : ISecretProtector
{
    public string Protect(string value) => Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(value));
    public string Unprotect(string value) => System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(value));
}

public interface IPaymentProvider
{
    string Name { get; }
    Task<PaymentResult> CreateAsync(Shop shop, Order order, CancellationToken cancellationToken);
    Task<bool> ValidateCallbackAsync(Dictionary<string, string> payload, CancellationToken cancellationToken);
}

public sealed class MockPaymentProvider : IPaymentProvider
{
    public string Name => "Mock";

    public Task<PaymentResult> CreateAsync(Shop shop, Order order, CancellationToken cancellationToken)
    {
        return Task.FromResult(new PaymentResult(order.Id, "paid", $"/checkout/success?orderId={order.Id}", Name));
    }

    public Task<bool> ValidateCallbackAsync(Dictionary<string, string> payload, CancellationToken cancellationToken)
    {
        return Task.FromResult(true);
    }
}

public sealed class EpointPaymentProvider : IPaymentProvider
{
    public string Name => "Epoint";

    public Task<PaymentResult> CreateAsync(Shop shop, Order order, CancellationToken cancellationToken)
    {
        // TODO: Add real Epoint merchant credentials per shop and sign request payload with private key.
        var redirectUrl = $"https://epoint.az/payments/start?order={order.OrderNumber}&amount={order.Total:0.00}";
        return Task.FromResult(new PaymentResult(order.Id, "pending", redirectUrl, Name));
    }

    public Task<bool> ValidateCallbackAsync(Dictionary<string, string> payload, CancellationToken cancellationToken)
    {
        // TODO: Validate Epoint callback signature against the shop owner's private key.
        return Task.FromResult(payload.Count > 0);
    }
}

public sealed class PayriffPaymentProvider : IPaymentProvider
{
    public string Name => "Payriff";

    public Task<PaymentResult> CreateAsync(Shop shop, Order order, CancellationToken cancellationToken)
    {
        // TODO: Add real Payriff merchant credentials per shop and call Payriff order endpoint.
        var redirectUrl = $"/checkout/failed?provider=payriff&orderId={order.Id}";
        return Task.FromResult(new PaymentResult(order.Id, "pending", redirectUrl, Name));
    }

    public Task<bool> ValidateCallbackAsync(Dictionary<string, string> payload, CancellationToken cancellationToken)
    {
        // TODO: Validate Payriff callback signature when live credentials are configured.
        return Task.FromResult(payload.Count > 0);
    }
}

public sealed class PaymentProviderFactory(IEnumerable<IPaymentProvider> providers)
{
    public IPaymentProvider Get(string? provider)
    {
        return providers.FirstOrDefault(x => x.Name.Equals(provider ?? "Mock", StringComparison.OrdinalIgnoreCase))
            ?? providers.First(x => x.Name == "Mock");
    }
}
