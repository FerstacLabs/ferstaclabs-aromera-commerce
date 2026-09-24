"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Form, Input, InputNumber, Select, Switch, Typography, message, Alert } from "antd";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminRequest } from "@/lib/admin-api";
import type { Category, Product } from "@/lib/data";

export function ProductFormPage({ title }: { title: string }) {
  const params = useParams<{ id?: string }>();
  const router = useRouter();
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([adminRequest<Category[]>("categories"), params.id ? adminRequest<Product[]>("products") : Promise.resolve([] as Product[])]).then(([list, products]) => {
      setCategories(list);
      if (params.id) {
        const product = products.find((p) => p.id === params.id);
        if (!product) throw new Error("Məhsul tapılmadı.");
        form.setFieldsValue(product);
      }
      setReady(true);
    }).catch((e) => setError(e.message));
  }, [form, params.id]);
  async function save(values: Product) {
    setSaving(true);
    try {
      await adminRequest(params.id ? `products/${params.id}` : "products", { method: params.id ? "PUT" : "POST", body: JSON.stringify(values) });
      message.success("Məhsul saxlanıldı"); router.push("/admin/products");
    } catch (e) { message.error(e instanceof Error ? e.message : "Saxlanmadı"); }
    finally { setSaving(false); }
  }
  return <AdminShell><Typography.Title level={2}>{title}</Typography.Title>
    {error && <Alert type="error" title={error} />}
    <Form form={form} layout="vertical" disabled={!ready} onFinish={save} initialValues={{ isActive: true, isFeatured: false, isBestseller: false, price: 0, stockQuantity: 0, brand: "", gender: "unisex", volume: "", concentration: "", shortDescription: "", description: "", mainImageUrl: "/products/fallback-perfume.webp", images: [] }} style={{ maxWidth: 900 }}>
      <div className="grid gap-x-5 sm:grid-cols-2">
        <Form.Item label="Ad" name="name" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item label="Slug" name="slug" rules={[{ required: true, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ }]}><Input /></Form.Item>
        <Form.Item label="Kateqoriya" name="categoryId" rules={[{ required: true }]}><Select options={categories.map((item) => ({ value: item.id, label: item.name }))} /></Form.Item>
        <Form.Item label="Brend / kolleksiya" name="brand"><Input /></Form.Item>
        <Form.Item label="Cins" name="gender"><Select options={["kişi", "qadın", "unisex"].map((value) => ({ value, label: value }))} /></Form.Item>
        <Form.Item label="Həcm" name="volume"><Input /></Form.Item>
        <Form.Item label="Konsentrasiya" name="concentration"><Input /></Form.Item>
        <Form.Item label="Qiymət" name="price" rules={[{ required: true }]}><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
        <Form.Item label="Əvvəlki qiymət" name="oldPrice"><InputNumber min={0} style={{ width: "100%" }} /></Form.Item>
        <Form.Item label="Stok" name="stockQuantity" rules={[{ required: true }]}><InputNumber min={0} precision={0} style={{ width: "100%" }} /></Form.Item>
      </div>
      <Form.Item label="Əsas şəkil" name="mainImageUrl" rules={[{ required: true }]}><Input /></Form.Item>
      <Form.List name="images">{(fields, { add, remove }) => <div className="mb-5">
        {fields.map(({ key, name, ...rest }) => <div className="flex items-start gap-3" key={key}><Form.Item {...rest} name={[name, "url"]} label="Şəkil ünvanı" rules={[{ required: true }]} className="flex-1"><Input /></Form.Item><Form.Item {...rest} name={[name, "alt"]} label="Şəkil təsviri" className="flex-1"><Input /></Form.Item><Button className="mt-7" onClick={() => remove(name)}>Sil</Button></div>)}
        <Button onClick={() => add({ url: "", alt: "" })}>Şəkil əlavə et</Button>
      </div>}</Form.List>
      <Form.Item label="Qısa təsvir" name="shortDescription"><Input.TextArea rows={2} /></Form.Item>
      <Form.Item label="Təsvir" name="description"><Input.TextArea rows={4} /></Form.Item>
      <div className="flex flex-wrap gap-8">{[["isActive", "Aktiv"], ["isFeatured", "Seçilmiş"], ["isBestseller", "Çox seçilən"]].map(([name, label]) => <Form.Item key={name} label={label} name={name} valuePropName="checked"><Switch /></Form.Item>)}</div>
      <Button type="primary" htmlType="submit" loading={saving} disabled={!ready}>Saxla</Button>
    </Form>
  </AdminShell>;
}
