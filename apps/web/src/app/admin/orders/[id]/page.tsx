"use client";

import { Card, Descriptions, Select, Table, Typography } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { orderStatuses, orders, paymentStatuses } from "@/lib/admin-data";
import { products } from "@/lib/data";

export default function AdminOrderDetailPage() {
  const order = orders[0];
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>{order.orderNumber}</Typography.Title>}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Customer">{order.customerName}</Descriptions.Item>
          <Descriptions.Item label="Order status"><Select defaultValue={order.status} options={orderStatuses.map((item) => ({ value: item, label: item }))} /></Descriptions.Item>
          <Descriptions.Item label="Payment status"><Select defaultValue={order.paymentStatus} options={paymentStatuses.map((item) => ({ value: item, label: item }))} /></Descriptions.Item>
          <Descriptions.Item label="Total">{order.total} AZN</Descriptions.Item>
        </Descriptions>
        <Table style={{ marginTop: 16 }} pagination={false} rowKey="id" dataSource={products.slice(0, 2)} columns={[
          { title: "Product", dataIndex: "name" },
          { title: "Price", dataIndex: "price", render: (value) => `${value} AZN` },
        ]} />
      </Card>
    </AdminShell>
  );
}
