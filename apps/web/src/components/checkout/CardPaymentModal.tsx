"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useShop } from "@/components/ShopProvider";
import { LockKeyhole, X } from "lucide-react";

type CardPaymentModalProps = {
  open: boolean;
  amount: number;
  currency: string;
  orderNumber: string;
  processing?: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: (result: "success" | "failed") => Promise<void>;
};

type FieldErrors = Partial<Record<"cardNumber" | "expiry" | "cvv" | "cardholderName", string>>;

export function CardPaymentModal({ open, amount, currency, orderNumber, processing, error, onCancel, onConfirm }: CardPaymentModalProps) {
  const shop = useShop();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const total = useMemo(() => `${amount.toFixed(2)} ${currency}`, [amount, currency]);
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.querySelector<HTMLInputElement>("input")?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !processing) onCancel();
      if (event.key !== "Tab") return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keyboard);
    return () => { document.removeEventListener("keydown", keyboard); previous?.focus(); };
  }, [open, processing, onCancel]);

  if (!open) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validateCard({ cardNumber, expiry, cvv, cardholderName });
    setFieldErrors(validation.errors);
    if (!validation.valid) return;
    await onConfirm(validation.result);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 px-4 py-6 backdrop-blur-sm">
      <div ref={dialog} role="dialog" aria-modal="true" aria-label="Kartla ödəniş" className="max-h-[90svh] overflow-y-auto w-full max-w-[480px] overflow-hidden rounded-lg border border-[var(--line)] bg-[#fffdf8] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] bg-[#171513] p-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#d9bd7d]">EH / {shop.name}</p>
            <h2 className="display mt-1 text-3xl font-bold">Kartla ödəniş</h2>
          </div>
          <button aria-label="Bağla" className="rounded p-1 text-white/80 hover:bg-white/10" onClick={onCancel} type="button">
            <X size={22} />
          </button>
        </div>

        <form className="grid gap-4 p-5" onSubmit={submit}>
          <div className="rounded-md border border-[var(--line)] bg-[#f7f0e3] p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--soft-ink)]">Sifariş</span>
              <strong className="break-all text-right">{orderNumber}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--soft-ink)]">Cəmi</span>
              <strong className="text-xl">{total}</strong>
            </div>
          </div>

          <Field label="Kart nömrəsi" error={fieldErrors.cardNumber}>
            <input
              className="field"
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              value={cardNumber}
              onChange={(event) => setCardNumber(formatCardNumber(event.target.value))}
              autoComplete="cc-number"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Bitmə tarixi" error={fieldErrors.expiry}>
              <input
                className="field"
                inputMode="numeric"
                placeholder="AA/İİ"
                value={expiry}
                onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                autoComplete="cc-exp"
              />
            </Field>
            <Field label="CVV" error={fieldErrors.cvv}>
              <input
                className="field"
                inputMode="numeric"
                placeholder="123"
                type="password"
                value={cvv}
                onChange={(event) => setCvv(onlyDigits(event.target.value).slice(0, 4))}
                autoComplete="cc-csc"
              />
            </Field>
          </div>

          <Field label="Kart sahibinin adı" error={fieldErrors.cardholderName}>
            <input
              className="field uppercase"
              placeholder="AD SOYAD"
              value={cardholderName}
              onChange={(event) => setCardholderName(event.target.value.toUpperCase())}
              autoComplete="cc-name"
            />
          </Field>

          {error ? <p className="rounded-md bg-[#fff1f1] p-3 text-sm font-semibold text-[#8c2d2d]">{error}</p> : null}

          <div className="flex items-center gap-2 text-xs text-[var(--soft-ink)]">
            <LockKeyhole size={15} />
            <span>Kart məlumatları saxlanılmır.</span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <button className="ghost-button w-full" disabled={processing} onClick={onCancel} type="button">Ləğv et</button>
            <button className="gold-button w-full" disabled={processing} type="submit">{processing ? "Emal olunur..." : "Ödənişi tamamla"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold">{label}</span>
      {children}
      {error ? <span className="text-sm text-[#9c2f2f]">{error}</span> : null}
    </label>
  );
}

function validateCard(values: { cardNumber: string; expiry: string; cvv: string; cardholderName: string }) {
  const digits = onlyDigits(values.cardNumber);
  const errors: FieldErrors = {};
  if (digits.length !== 16) errors.cardNumber = "Kart nömrəsi 16 rəqəmdən ibarət olmalıdır.";
  if (!isValidExpiry(values.expiry)) errors.expiry = "Bitmə tarixi düzgün və aktiv olmalıdır.";
  if (!/^\d{3,4}$/.test(values.cvv)) errors.cvv = "CVV 3 və ya 4 rəqəm olmalıdır.";
  if (!values.cardholderName.trim()) errors.cardholderName = "Kart sahibinin adını daxil edin.";
  if (Object.keys(errors).length > 0) return { valid: false as const, errors, result: "failed" as const };

  if (digits === "4000000000009995") {
    return { valid: true as const, errors, result: "failed" as const };
  }
  if (digits === "4242424242424242" || digits === "4000000000000002") {
    return { valid: true as const, errors, result: "success" as const };
  }
  return {
    valid: false as const,
    errors: { cardNumber: "Bu kart nömrəsi hazırkı ödəniş yoxlaması üçün qəbul edilmir." },
    result: "failed" as const,
  };
}

function isValidExpiry(value: string) {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  const [monthText, yearText] = value.split("/");
  const month = Number(monthText);
  const year = 2000 + Number(yearText);
  if (month < 1 || month > 12) return false;
  const now = new Date();
  const expiryDate = new Date(year, month, 0, 23, 59, 59);
  return expiryDate >= now;
}

function formatCardNumber(value: string) {
  return onlyDigits(value).slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}
