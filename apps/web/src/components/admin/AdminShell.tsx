"use client";

import Link from "next/link";
import { Layout, Menu, theme } from "antd";
import { AppstoreOutlined, DashboardOutlined, OrderedListOutlined, SettingOutlined, TagsOutlined, TeamOutlined } from "@ant-design/icons";

const { Content, Sider } = Layout;

const items = [
  { key: "/admin", icon: <DashboardOutlined />, label: <Link href="/admin">Dashboard</Link> },
  { key: "/admin/products", icon: <AppstoreOutlined />, label: <Link href="/admin/products">Products</Link> },
  { key: "/admin/categories", icon: <TagsOutlined />, label: <Link href="/admin/categories">Categories</Link> },
  { key: "/admin/orders", icon: <OrderedListOutlined />, label: <Link href="/admin/orders">Orders</Link> },
  { key: "/admin/customers", icon: <TeamOutlined />, label: <Link href="/admin/customers">Customers</Link> },
  { key: "/admin/settings", icon: <SettingOutlined />, label: <Link href="/admin/settings">Settings</Link> },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { token } = theme.useToken();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: "white", fontWeight: 800, fontSize: 24, padding: 20 }}>Aromera</div>
        <Menu theme="dark" mode="inline" items={items} />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, background: token.colorBgLayout }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
