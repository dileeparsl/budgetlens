import { supabase } from "./supabase";
import type {
  Category,
  CategoryCreate,
  Transaction,
  TransactionCreate,
  TransactionList,
  FinanceSettings,
  MonthlySummary,
  DashboardData,
} from "@/types";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
      ...(init.headers as Record<string, string>),
    },
  });

  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail || `API ${res.status}`);
  }
  return res.json();
}

export const api = {
  categories: {
    list: () => request<Category[]>("/api/categories"),
    create: (data: CategoryCreate) =>
      request<Category>("/api/categories", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<CategoryCreate>) =>
      request<Category>(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/categories/${id}`, { method: "DELETE" }),
  },

  transactions: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return request<TransactionList>(`/api/transactions${qs}`);
    },
    create: (data: TransactionCreate) =>
      request<Transaction>("/api/transactions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<TransactionCreate>) =>
      request<Transaction>(`/api/transactions/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<void>(`/api/transactions/${id}`, { method: "DELETE" }),
  },

  settings: {
    get: () => request<FinanceSettings>("/api/finance-settings"),
    update: (data: {
      monthly_income_cents: number;
      monthly_budget_cents: number;
      savings_target_cents: number;
    }) =>
      request<FinanceSettings>("/api/finance-settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  summary: {
    monthly: (year?: number, month?: number) => {
      const params = new URLSearchParams();
      if (year) params.set("year", String(year));
      if (month) params.set("month", String(month));
      const qs = params.toString() ? `?${params}` : "";
      return request<MonthlySummary>(`/api/summary/monthly${qs}`);
    },
    dashboard: (months = 6) =>
      request<DashboardData>(`/api/summary/dashboard?months=${months}`),
  },
};
