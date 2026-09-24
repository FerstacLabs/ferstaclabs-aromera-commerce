"use client";

import Link from "next/link";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import { AppstoreOutlined, DashboardOutlined, OrderedListOutlined, SettingOutlined, TagsOutlined, TeamOutlined } from "@ant-design/icons";

import { BrandLogo } from "@/components/BrandLogo";
import { useShop } from "@/components/ShopProvider";

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
  const shop = useShop();
  const { token } = theme.useToken();
  return (
    <ConfigProvider theme={{ token: { colorPrimary: shop.primaryColor, colorInfo: shop.accentColor, borderRadius: 6 }, components: { Layout: { siderBg: "#171512" }, Menu: { darkItemBg: "#171512", darkItemSelectedBg: "#665126" } } }}><Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <Link href="/" className="block p-4"><BrandLogo compact /><span className="mt-2 block text-xs text-white/70">{shop.name} Admin</span></Link>
        <Menu theme="dark" mode="inline" items={items} />
      </Sider>
      <Layout>
        <Content style={{ padding: 24, background: token.colorBgLayout }}>
          {children}
        </Content>
      </Layout>
    </Layout></ConfigProvider>
  );
}
