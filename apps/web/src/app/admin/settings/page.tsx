"use client";

import Link from "next/link";
import { Card, List, Typography } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminSettingsPage() {
  const items = [
    ["Store settings", "/admin/settings/store"],
    ["Payment settings", "/admin/settings/payment"],
    ["Delivery settings", "/admin/settings/delivery"],
  ];
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Settings</Typography.Title>}>
        <List dataSource={items} renderItem={([label, href]) => <List.Item><Link href={href}>{label}</Link></List.Item>} />
      </Card>
    </AdminShell>
  );
}
