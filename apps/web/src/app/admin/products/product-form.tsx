"use client";

import { Button, Card, Form, Input, InputNumber, Select, Switch, Typography, message } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { categories } from "@/lib/data";

export function ProductFormPage({ title }: { title: string }) {
  return (
    <AdminShell>
      <Card>
        <Typography.Title level={3}>{title}</Typography.Title>
        <Form layout="vertical" onFinish={() => message.success("Saved")}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Category" name="categoryId"><Select options={categories.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item>
          <Form.Item label="Brand" name="brand"><Input /></Form.Item>
          <Form.Item label="Gender" name="gender"><Select options={["kişi", "qadın", "unisex"].map((item) => ({ value: item, label: item }))} /></Form.Item>
          <Form.Item label="Price" name="price"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Stock" name="stockQuantity"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Image URL" name="mainImageUrl"><Input /></Form.Item>
          <Form.Item label="Active" name="isActive" valuePropName="checked"><Switch defaultChecked /></Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </Card>
    </AdminShell>
  );
}
