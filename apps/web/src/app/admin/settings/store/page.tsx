"use client";
import { useEffect, useState } from "react";
import { Button, Form, Input, Typography, message, Alert } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminRequest } from "@/lib/admin-api";
import type { ShopConfig } from "@/lib/shop";

export default function StoreSettingsPage() {
  const [form] = Form.useForm();
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    adminRequest<ShopConfig>("shop/settings").then((data) => { form.setFieldsValue(data); setReady(true); }).catch((e) => setError(e.message));
  }, [form]);
  async function save(values: ShopConfig) {
    setSaving(true);
    try { await adminRequest("shop/settings", { method: "PUT", body: JSON.stringify(values) }); message.success("Mağaza məlumatları saxlanıldı"); }
    catch (e) { message.error(e instanceof Error ? e.message : "Saxlanmadı"); }
    finally { setSaving(false); }
  }
  return <AdminShell><Typography.Title level={2}>Mağaza ayarları</Typography.Title>
    {error && <Alert type="error" title={error} showIcon />}
    <Form form={form} layout="vertical" onFinish={save} disabled={!ready} style={{ maxWidth: 760 }}>
      <div className="grid gap-x-5 sm:grid-cols-2">
        {[["name", "Brend adı"], ["legalName", "Hüquqi ad"], ["voen", "VÖEN"], ["phone", "Telefon"], ["whatsApp", "WhatsApp"], ["address", "Ünvan"], ["logoUrl", "Loqo"], ["slogan", "Sloqan"]].map(([name, label]) => <Form.Item key={name} name={name} label={label} rules={["name", "phone", "whatsApp", "address"].includes(name) ? [{ required: true }] : []}><Input /></Form.Item>)}
      </div>
      <Form.Item name="heroText" label="Ana səhifə mətni"><Input.TextArea rows={2} /></Form.Item>
      <div className="flex flex-wrap gap-8">{[["primaryColor", "Əsas rəng"], ["accentColor", "Vurğu rəngi"]].map(([name, label]) => <Form.Item key={name} name={name} label={label} rules={[{ required: true, pattern: /^#[0-9a-f]{6}$/i }]}><Input type="color" style={{ width: 72, height: 44 }} /></Form.Item>)}</div>
      <Button type="primary" htmlType="submit" loading={saving} disabled={!ready}>Saxla</Button>
    </Form>
  </AdminShell>;
}
