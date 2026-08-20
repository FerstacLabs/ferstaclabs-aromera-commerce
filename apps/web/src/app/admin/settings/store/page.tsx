"use client";

import { Button, Card, Form, Input, Typography, message } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { shop } from "@/lib/data";

export default function StoreSettingsPage() {
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Store settings</Typography.Title>}>
        <Form layout="vertical" initialValues={{ name: shop.name, phone: shop.phone, whatsapp: shop.whatsapp, instagram: shop.instagram, address: shop.address }} onFinish={() => message.success("Saved")}>
          <Form.Item label="Name" name="name"><Input /></Form.Item>
          <Form.Item label="Phone" name="phone"><Input /></Form.Item>
          <Form.Item label="WhatsApp" name="whatsapp"><Input /></Form.Item>
          <Form.Item label="Instagram" name="instagram"><Input /></Form.Item>
          <Form.Item label="Address" name="address"><Input /></Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </Card>
    </AdminShell>
  );
}
