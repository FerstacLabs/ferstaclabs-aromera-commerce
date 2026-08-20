"use client";

import { Card, Table, Typography } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { customers } from "@/lib/admin-data";

export default function AdminCustomersPage() {
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Customers</Typography.Title>}>
        <Table rowKey="id" dataSource={customers} columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Phone", dataIndex: "phone" },
          { title: "Address", dataIndex: "address" },
        ]} />
      </Card>
    </AdminShell>
  );
}
