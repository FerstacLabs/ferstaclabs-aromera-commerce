"use client";

import { Button, Card, Form, Input, Table, Typography, message } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { categories } from "@/lib/data";

export default function AdminCategoriesPage() {
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Categories</Typography.Title>}>
        <Form layout="inline" onFinish={() => message.success("Saved")} style={{ marginBottom: 16 }}>
          <Form.Item name="name" rules={[{ required: true }]}><Input placeholder="Category name" /></Form.Item>
          <Form.Item name="slug" rules={[{ required: true }]}><Input placeholder="slug" /></Form.Item>
          <Button type="primary" htmlType="submit">Add</Button>
        </Form>
        <Table rowKey="id" dataSource={categories} columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Slug", dataIndex: "slug" },
          { title: "Description", dataIndex: "description" },
        ]} />
      </Card>
    </AdminShell>
  );
}
