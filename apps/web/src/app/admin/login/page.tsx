"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Form, Input, Typography, message } from "antd";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(values: { email: string; password: string }) {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("aromera-admin-token", data.token);
      }
      message.success("Daxil oldunuz");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f6f1e8", padding: 16 }}>
      <Card style={{ width: "min(420px, 100%)" }}>
        <Typography.Title level={2}>Aromera Admin</Typography.Title>
        <Form layout="vertical" onFinish={submit} initialValues={{ email: "admin@aromera.az" }}>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}><Input.Password /></Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>Login</Button>
        </Form>
      </Card>
    </main>
  );
}
