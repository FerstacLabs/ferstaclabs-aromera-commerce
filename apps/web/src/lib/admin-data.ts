export const dashboard = {
  todayOrders: 6,
  totalRevenue: 1840,
  pendingOrders: 3,
  lowStockProducts: 5,
};

export const orders = [
  { id: "o1", orderNumber: "ARO-20260820-1001", customerName: "Leyla Məmmədova", status: "paid", paymentStatus: "paid", total: 146 },
  { id: "o2", orderNumber: "ARO-20260820-1002", customerName: "Rauf Əliyev", status: "packed", paymentStatus: "paid", total: 178 },
  { id: "o3", orderNumber: "ARO-20260820-1003", customerName: "Nigar Həsənova", status: "awaiting_payment", paymentStatus: "pending", total: 92 },
];

export const customers = [
  { id: "c1", name: "Leyla Məmmədova", phone: "+994 55 222 10 11", address: "Nərimanov, Bakı" },
  { id: "c2", name: "Rauf Əliyev", phone: "+994 50 333 20 22", address: "Yasamal, Bakı" },
  { id: "c3", name: "Nigar Həsənova", phone: "+994 70 444 30 33", address: "Xətai, Bakı" },
];

export const orderStatuses = ["pending", "awaiting_payment", "paid", "confirmed", "packed", "shipped", "delivered", "cancelled", "refunded"];
export const paymentStatuses = ["unpaid", "pending", "paid", "failed", "cancelled", "refunded"];
