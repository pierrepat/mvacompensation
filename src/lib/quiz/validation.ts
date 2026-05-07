const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_ALLOWED_RE = /^[A-Za-zÀ-ÿ' -]+$/;
const BLACKLIST = new Set(["test", "qwerty", "asdf", "fake", "name", "aaa", "bbb"]);

export function validateEmail(v: string): string | null {
  const t = v.trim();
  if (!t) return "required";
  if (!EMAIL_RE.test(t)) return "invalid_email";
  return null;
}

export function validateName(v: string): string | null {
  const t = v.trim();
  const letters = t.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length < 2) return "too_short";
  if (!NAME_ALLOWED_RE.test(t)) return "invalid_name";
  if (BLACKLIST.has(letters.toLowerCase())) return "invalid_name";
  if (/^(.)\1{2,}$/.test(letters.toLowerCase())) return "invalid_name";
  return null;
}

export function normalizePhone(v: string): string {
  const d = v.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) return d.slice(1);
  if (d.length === 10) return d;
  return "";
}

export function validatePhone(v: string): string | null {
  const n = normalizePhone(v);
  if (!n) return "invalid_phone";
  if (/^(\d)\1{9}$/.test(n)) return "invalid_phone";
  if (n === "1234567890") return "invalid_phone";
  if (n[0] === "0" || n[0] === "1") return "invalid_phone";
  if (n[3] === "0" || n[3] === "1") return "invalid_phone";
  return null;
}

export function formatPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (!d) return "";
  if (d.length < 4) return `(${d}`;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

export function validateOtp(v: string): string | null {
  if (!/^\d{6}$/.test(v.trim())) return "invalid_otp";
  return null;
}
