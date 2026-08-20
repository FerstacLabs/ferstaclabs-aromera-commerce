"use client";

import { Button, Card, Form, Input, InputNumber, Typography, message } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";

export default function DeliverySettingsPage() {
  return (
    <AdminShell>
      <Card title={<Typography.Title level={3}>Delivery settings</Typography.Title>}>
        <Form layout="vertical" initialValues={{ bakuFee: 5, regionsFee: 8, freeDeliveryFrom: 150, note: "Bakı daxili çatdırılma mövcuddur" }} onFinish={() => message.success("Saved")}>
          <Form.Item label="Baku fee" name="bakuFee"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Regions fee" name="regionsFee"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Free delivery from" name="freeDeliveryFrom"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="Note" name="note"><Input /></Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form>
      </Card>
    </AdminShell>
  );
}
