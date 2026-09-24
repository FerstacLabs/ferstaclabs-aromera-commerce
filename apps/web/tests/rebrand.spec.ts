import { expect, test } from "@playwright/test";

const pages = ["/", "/shop", "/shop/noir-essence", "/cart", "/checkout", "/checkout/success", "/checkout/failed", "/about", "/contact", "/return-policy", "/admin/login", "/admin", "/admin/products", "/admin/orders", "/admin/settings", "/admin/settings/store"];

test("required pages render with the new identity", async ({ page }) => {
  for (const path of pages) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("body")).not.toContainText(/Aromera|aromera\.az|50 555 55 55/);
    await expect(page).toHaveTitle(/Əhdi Parfum/);
  }
});

for (const width of [375, 430, 768, 1024, 1440]) {
  test(`responsive storefront at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of pages) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), { message: path }).toBe(true);
      if (path === "/") await page.screenshot({ path: `test-results/home-${width}.png`, fullPage: true });
    }
    if (width < 1024) {
      await page.goto("/");
      await page.getByRole("button", { name: "Menyunu aç" }).click();
      await expect(page.locator("#mobile-navigation")).toBeVisible();
      await page.locator("#mobile-navigation").getByRole("link", { name: "Əlaqə", exact: true }).click();
      await expect(page).toHaveURL(/contact/);
    }
  });
}

test("local product assets, contact links and old product redirect", async ({ page, request }) => {
  const products = await (await request.get("http://localhost:5000/api/ehdi-parfum/products")).json();
  for (const product of products) {
    expect(product.mainImageUrl).toMatch(/^\/products\/.+\.webp$/);
    expect((await request.get(product.mainImageUrl)).ok()).toBe(true);
  }
  await page.goto("/contact");
  await expect(page.locator('main a[href="tel:+994556994666"]')).toBeVisible();
  await expect(page.locator('main a[href="https://wa.me/994556994666"]')).toBeVisible();
  await page.goto("/shop/aromera-noir-essence");
  await expect(page).toHaveURL(/\/shop\/noir-essence$/);
});

test("image failure displays local fallback", async ({ page }) => {
  await page.route("**/_next/image?*", async (route) => {
    if (!route.request().url().includes("fallback-perfume")) await route.abort();
    else await route.continue();
  });
  await page.goto("/shop/noir-essence");
  const img = page.locator('main img').first();
  await expect(img).toHaveAttribute("src", /fallback-perfume/);
  await expect.poll(() => img.evaluate((node) => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
});

test("cart, card modal and safe confirmation retain their behavior", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto("/shop/noir-essence");
  await page.getByRole("button", { name: "Səbətə əlavə et" }).click();
  await expect(page.locator("header")).toContainText("Səbət (1)");
  await page.goto("/cart");
  await expect(page.getByRole("heading", { name: "Noir Essence" })).toBeVisible();
  await page.getByRole("button", { name: "Artır" }).click();
  await page.getByRole("button", { name: "Azalt" }).click();
  await page.getByRole("link", { name: "Sifarişi tamamla" }).click();
  await page.getByLabel("Ad Soyad", { exact: true }).fill("Local QA");
  await page.getByLabel("Telefon", { exact: true }).fill("0000000000");
  await page.getByLabel("Çatdırılma ünvanı", { exact: true }).fill("Local QA address");
  await page.getByRole("button", { name: "Sifarişi tamamla" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog")).toContainText("EH / Əhdi Parfum");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByLabel("Kart nömrəsi").fill("4242424242424242");
  await page.getByLabel("Bitmə tarixi").fill("12/30");
  await page.getByLabel("CVV", { exact: true }).fill("123");
  await page.getByLabel("Kart sahibinin adı").fill("Local QA");
  const confirmation = page.waitForRequest((req) => req.url().endsWith("/payments/mock/confirm"));
  await page.getByRole("button", { name: "Ödənişi tamamla" }).click();
  expect(Object.keys((await confirmation).postDataJSON()).sort()).toEqual(["orderId", "result"]);
  await expect(page).toHaveURL(/checkout\/success.*paymentStatus=paid/);
});

test("admin can persist store settings and complete product data", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("admin@aromera.az");
  await page.getByLabel("Password", { exact: true }).fill("Admin123!ChangeMe");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto("/admin/settings/store");
  await expect(page.getByLabel("Brend adı")).toHaveValue("Əhdi Parfum");
  await page.getByLabel("Sloqan").fill("BİR KEYFİYYƏT BRENDİ");
  await page.getByRole("button", { name: "Saxla", exact: true }).click();
  await expect(page.getByText("Mağaza məlumatları saxlanıldı")).toBeVisible();
  await page.goto("/admin/products/33333333-3333-3333-3333-333333333333");
  await expect(page.getByLabel("Ad", { exact: true })).toHaveValue("Noir Essence");
  await page.getByLabel("Həcm", { exact: true }).fill("50ml");
  if (await page.getByLabel("Şəkil ünvanı").count() === 0) await page.getByRole("button", { name: "Şəkil əlavə et", exact: true }).click();
  await page.getByLabel("Şəkil ünvanı").first().fill("/products/noir-essence.webp");
  await page.getByLabel("Şəkil təsviri").first().fill("Noir Essence");
  await page.getByRole("button", { name: "Saxla", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
});

test("cash and WhatsApp orders stay unpaid; card declines can retry", async ({ request }) => {
  const api = "http://localhost:5000/api/ehdi-parfum";
  const config = await (await request.get("http://localhost:5000/api/shops/by-slug/ehdi-parfum")).json();
  for (const paymentMethod of ["cash", "whatsapp", "card"]) {
    const response = await request.post(`${api}/checkout`, { data: { customerName: "Local QA", customerPhone: "000", deliveryAddress: "QA", deliveryMethod: "regions", paymentMethod, items: [{ productId: "33333333-3333-3333-3333-333333333333", quantity: 1 }] } });
    expect(response.ok()).toBe(true);
    const order = await response.json();
    expect(order.paymentStatus).toBe(paymentMethod === "card" ? "pending" : "unpaid");
    expect(order.paymentRequired).toBe(paymentMethod === "card");
    if (paymentMethod !== "card") {
      expect((await request.post(`${api}/payments/mock/confirm`, { data: { orderId: order.orderId, result: "success" } })).status()).toBe(400);
    }
    if (paymentMethod === "card") {
      const payment = await (await request.post(`${api}/payments/create`, { data: { orderId: order.orderId } })).json();
      expect(payment.requiresInternalCardModal).toBe(true);
      expect(payment.amount).toBe(27 + config.regionsFee);
      const declined = await (await request.post(`${api}/payments/mock/confirm`, { data: { orderId: order.orderId, result: "failed" } })).json();
      expect(declined.paymentStatus).toBe("failed");
      const paid = await (await request.post(`${api}/payments/mock/confirm`, { data: { orderId: order.orderId, result: "success" } })).json();
      expect(paid.paymentStatus).toBe("paid");
      const replay = await (await request.post(`${api}/payments/mock/confirm`, { data: { orderId: order.orderId, result: "failed" } })).json();
      expect(replay.paymentStatus).toBe("paid");
    }
  }
});
