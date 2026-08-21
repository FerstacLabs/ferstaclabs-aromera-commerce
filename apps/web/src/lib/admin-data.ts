export const dashboard = {
  todayOrders: 6,
  totalRevenue: 1840,
  pendingOrders: 3,
  lowStockProducts: 5,
};

export const orders = [
  { id: "o1", orderNumber: "ARO-20260820-1001", customerName: "Leyla Məmmədova", customerPhone: "+994 55 222 10 11", status: "paid", paymentMethod: "Kartla ödəniş", paymentStatus: "paid", total: 146, createdAt: "2026-08-20T11:30:00Z" },
  { id: "o2", orderNumber: "ARO-20260820-1002", customerName: "Rauf Əliyev", customerPhone: "+994 50 333 20 22", status: "packed", paymentMethod: "Çatdırılma zamanı", paymentStatus: "unpaid", total: 178, createdAt: "2026-08-20T13:10:00Z" },
  { id: "o3", orderNumber: "ARO-20260820-1003", customerName: "Nigar Həsənova", customerPhone: "+994 70 444 30 33", status: "awaiting_payment", paymentMethod: "Kartla ödəniş", paymentStatus: "pending", total: 92, createdAt: "2026-08-20T15:42:00Z" },
];

export const customers = [
  { id: "c1", name: "Leyla Məmmədova", phone: "+994 55 222 10 11", address: "Nərimanov, Bakı" },
  { id: "c2", name: "Rauf Əliyev", phone: "+994 50 333 20 22", address: "Yasamal, Bakı" },
  { id: "c3", name: "Nigar Həsənova", phone: "+994 70 444 30 33", address: "Xətai, Bakı" },
];

export const orderStatuses = ["pending", "awaiting_payment", "paid", "confirmed", "packed", "shipped", "delivered", "cancelled", "refunded"];
export const paymentStatuses = ["unpaid", "pending", "paid", "failed", "cancelled", "refunded"];
