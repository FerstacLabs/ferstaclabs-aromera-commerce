"use client";

import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { dashboard, orders } from "@/lib/admin-data";

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <Typography.Title level={2}>Əhdi Parfum — İdarəetmə Paneli</Typography.Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}><Card><Statistic title="Today orders" value={dashboard.todayOrders} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="Total revenue" value={dashboard.totalRevenue} suffix="AZN" /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="Pending orders" value={dashboard.pendingOrders} /></Card></Col>
        <Col xs={24} md={6}><Card><Statistic title="Low stock" value={dashboard.lowStockProducts} /></Card></Col>
      </Row>
      <Card style={{ marginTop: 16 }} title="Today orders">
        <Table rowKey="id" pagination={false} dataSource={orders} columns={[
          { title: "Order", dataIndex: "orderNumber" },
          { title: "Customer", dataIndex: "customerName" },
          { title: "Status", dataIndex: "status" },
          { title: "Total", dataIndex: "total", render: (value) => `${value} AZN` },
        ]} />
      </Card>
    </AdminShell>
  );
}
