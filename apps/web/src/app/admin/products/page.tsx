"use client";

import Link from "next/link";
import { Button, Card, Table, Typography, Alert } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Product } from "@/lib/data";
import { adminRequest } from "@/lib/admin-api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { adminRequest<Product[]>("products").then(setProducts).catch((e) => setError(e.message)); }, []);
  return (
    <AdminShell>
      {error && <Alert type="error" title={error} />}
      <Card title={<Typography.Title level={3}>Products</Typography.Title>} extra={<Link href="/admin/products/new"><Button type="primary" icon={<PlusOutlined />}>New</Button></Link>}>
        <Table scroll={{ x: 680 }} rowKey="id" dataSource={products} columns={[
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
