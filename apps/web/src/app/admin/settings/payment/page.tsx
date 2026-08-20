"use client";

import { Button, Card, Form, Input, Select, Switch, Typography, message } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";

export default function PaymentSettingsPage() {
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Payment settings</Typography.Title>}>
        <Form layout="vertical" initialValues={{ provider: "Mock", testMode: true }} onFinish={() => message.success("Saved")}>
          <Form.Item label="Provider" name="provider"><Select options={["Mock", "Epoint", "Payriff"].map((item) => ({ value: item, label: item }))} /></Form.Item>
          <Form.Item label="Public key" name="publicKey"><Input.Password /></Form.Item>
          <Form.Item label="Private key" name="privateKey"><Input.Password /></Form.Item>
          <Form.Item label="Merchant ID" name="merchantId"><Input /></Form.Item>
          <Form.Item label="Test mode" name="testMode" valuePropName="checked"><Switch /></Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </Card>
    </AdminShell>
  );
}
