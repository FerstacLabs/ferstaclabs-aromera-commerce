"use client";

import Link from "next/link";
import { Card, Select, Table, Typography } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { orders, orderStatuses } from "@/lib/admin-data";

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Orders</Typography.Title>}>
        <Table rowKey="id" dataSource={orders} columns={[
          { title: "Order", dataIndex: "orderNumber" },
          { title: "Customer", dataIndex: "customerName" },
          { title: "Phone", dataIndex: "customerPhone" },
          { title: "Total", dataIndex: "total", render: (value) => `${value} AZN` },
          { title: "Status", dataIndex: "status", render: (value) => <Select defaultValue={value} options={orderStatuses.map((item) => ({ value: item, label: item }))} style={{ minWidth: 170 }} /> },
          { title: "Payment method", dataIndex: "paymentMethod" },
          { title: "Payment status", dataIndex: "paymentStatus" },
          { title: "Created", dataIndex: "createdAt", render: (value) => new Date(value).toLocaleDateString("az-AZ") },
          { title: "", render: (_, row) => <Link href={`/admin/orders/${row.id}`}>Open</Link> },
        ]} />
      </Card>
    </AdminShell>
  );
}
