"use client";

import Link from "next/link";
import { Button, Card, Table, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AdminShell } from "@/components/admin/AdminShell";
import { products } from "@/lib/data";

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Products</Typography.Title>} extra={<Link href="/admin/products/new"><Button type="primary" icon={<PlusOutlined />}>New</Button></Link>}>
        <Table rowKey="id" dataSource={products} columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Brand", dataIndex: "brand" },
          { title: "Stock", dataIndex: "stockQuantity" },
          { title: "Price", dataIndex: "price", render: (value) => `${value} AZN` },
          { title: "Status", dataIndex: "isActive", render: (value) => value ? "active" : "inactive" },
          { title: "", render: (_, row) => <Link href={`/admin/products/${row.id}`}>Edit</Link> },
        ]} />
      </Card>
    </AdminShell>
  );
}
