"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn, formatCents } from "@/lib/utils";
import type { Category, Transaction, TransactionCreate } from "@/types";

type FilterType = "all" | "income" | "expense";

function parseDollarsToCents(raw: string): number {
  const cleaned = raw.trim().replace(/[$,\s]/g, "");
  const n = parseFloat(cleaned);
  if (Number.isNaN(n) || n <= 0) {
    throw new Error("Enter a valid amount greater than zero.");
  }
  return Math.round(n * 100);
}

function centsToDollarField(cents: number): string {
  return (cents / 100).toFixed(2);
}

function formatDisplayDate(iso: string): string {
  const d = new Date(iso + (iso.includes("T") ? "" : "T12:00:00"));
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const emptyForm = (): {
  type: "income" | "expense";
  amountDollars: string;
  category_id: string;
  description: string;
  date: string;
} => ({
  type: "expense",
  amountDollars: "",
  category_id: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
});

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState<FilterType>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const data = await api.categories.list();
      setCategories(data);
    } catch (e) {
      setCategoriesError(e instanceof Error ? e.message : "Failed to load categories.");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const params: Record<string, string> = { limit: "200" };
      if (filterType !== "all") params.type = filterType;
      if (dateFrom) params.date_from = dateFrom;
      if (dateTo) params.date_to = dateTo;
      const res = await api.transactions.list(params);
      setTransactions(res.data);
      setTotalCount(res.count);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Failed to load transactions.");
    } finally {
      setListLoading(false);
    }
  }, [filterType, dateFrom, dateTo]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(t: Transaction) {
    setEditing(t);
    setForm({
      type: t.type,
      amountDollars: centsToDollarField(t.amount_cents),
      category_id: t.category_id,
      description: t.description ?? "",
      date: t.date.slice(0, 10),
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    let amount_cents: number;
    try {
      amount_cents = parseDollarsToCents(form.amountDollars);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Invalid amount.");
      return;
    }
    if (!form.category_id) {
      setFormError("Choose a category.");
      return;
    }

    const payload: TransactionCreate = {
      amount_cents,
      type: form.type,
      category_id: form.category_id,
      date: form.date,
    };
    const desc = form.description.trim();
    if (desc) payload.description = desc;

    setSaveLoading(true);
    try {
      if (editing) {
        await api.transactions.update(editing.id, payload);
      } else {
        await api.transactions.create(payload);
      }
      setModalOpen(false);
      await loadTransactions();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not save transaction.");
    } finally {
      setSaveLoading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await api.transactions.delete(deleteId);
      setDeleteId(null);
      await loadTransactions();
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Delete failed.");
      setDeleteId(null);
    } finally {
      setDeleteLoading(false);
    }
  }

  useEffect(() => {
    if (!modalOpen && !deleteId) return;
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") {
        setModalOpen(false);
        setDeleteId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, deleteId]);

  return (
    <div className="min-h-full bg-surface">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-on-surface">
          Transactions
        </h1>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 gradient-primary rounded-full px-6 py-3 text-sm font-semibold text-on-primary shadow-ambient transition hover:opacity-95 focus-visible:outline-none focus-ring"
        >
          <Plus className="h-4 w-4" />
          Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="flex flex-wrap gap-2">
          <span className="mr-2 self-center text-sm text-on-surface-variant">Type</span>
          {(["all", "income", "expense"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilterType(key)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                filterType === key
                  ? "gradient-primary text-on-primary"
                  : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface ghost-border"
              )}
            >
              {key === "all" ? "All" : key === "income" ? "Income" : "Expense"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex flex-col gap-1 text-xs text-on-surface-variant">
            From
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 text-sm focus-ring ghost-border"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-on-surface-variant">
            To
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 text-sm focus-ring ghost-border"
            />
          </label>
          {(dateFrom || dateTo) && (
            <button
              type="button"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="mb-0.5 rounded-full px-3 py-2 text-sm text-primary hover:underline"
            >
              Clear dates
            </button>
          )}
        </div>
      </div>

      {listError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-error-container/30 px-4 py-3 text-sm text-error ghost-border"
        >
          {listError}
        </div>
      )}

      {/* List */}
      {listLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl bg-surface-container ghost-border"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-xl bg-surface-container-low p-12 text-center ghost-border">
          <p className="text-on-surface-variant">
            No transactions match your filters. Add one to get started.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-on-surface-variant">
            Showing {transactions.length} of {totalCount} transaction
            {totalCount === 1 ? "" : "s"}
          </p>
          <ul className="flex flex-col gap-3">
            {transactions.map((t) => (
              <li key={t.id}>
                <article
                  className={cn(
                    "relative flex items-center justify-between gap-4 rounded-xl bg-surface-container p-4 transition-colors",
                    "hover:bg-surface-container-high ghost-border"
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <CategoryBadge categories={categories} categoryId={t.category_id} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-on-surface">
                        {t.description?.trim() || t.category_name || "Transaction"}
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        {formatDisplayDate(t.date)}
                        {t.category_name ? (
                          <span className="text-on-surface-variant/80">
                            {" "}
                            · {t.category_name}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span
                      className={cn(
                        "text-right font-[family-name:var(--font-display)] text-lg font-semibold tabular-nums",
                        t.type === "income" ? "text-tertiary" : "text-primary"
                      )}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCents(t.amount_cents)}
                    </span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-primary focus-visible:outline-none focus-ring"
                        aria-label="Edit transaction"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(t.id)}
                        className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-highest hover:text-error focus-visible:outline-none focus-ring"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="txn-modal-title"
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-surface-container-low p-6 shadow-ambient ghost-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="txn-modal-title"
              className="mb-6 font-[family-name:var(--font-display)] text-xl font-bold text-on-surface"
            >
              {editing ? "Edit transaction" : "Add transaction"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                  Type
                </span>
                <div className="flex gap-2">
                  {(["income", "expense"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: t }))}
                      className={cn(
                        "flex-1 rounded-xl px-4 py-3 text-sm font-medium transition",
                        form.type === t
                          ? t === "income"
                            ? "bg-surface-container-highest text-tertiary ghost-border"
                            : "bg-surface-container-highest text-primary ghost-border"
                          : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high ghost-border"
                      )}
                    >
                      {t === "income" ? "Income" : "Expense"}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                  Amount (USD)
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="0.00"
                  value={form.amountDollars}
                  onChange={(e) => setForm((f) => ({ ...f, amountDollars: e.target.value }))}
                  className="w-full bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 text-sm focus-ring ghost-border"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                  Category
                </span>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
                  disabled={categoriesLoading || !!categoriesError}
                  className="w-full appearance-none bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 text-sm focus-ring ghost-border"
                >
                  <option value="">
                    {categoriesLoading ? "Loading…" : "Select a category"}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon ? `${c.icon} ` : ""}
                      {c.name}
                    </option>
                  ))}
                </select>
                {categoriesError && (
                  <p className="mt-1 text-sm text-error">{categoriesError}</p>
                )}
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                  Description{" "}
                  <span className="font-normal normal-case text-on-surface-variant/70">
                    (optional)
                  </span>
                </span>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 text-sm focus-ring ghost-border"
                  placeholder="e.g. Weekly groceries"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                  Date
                </span>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 text-sm focus-ring ghost-border"
                />
              </label>

              {formError && (
                <p role="alert" className="text-sm text-error">
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-full bg-surface-container py-3 text-sm font-medium text-on-surface-variant transition hover:bg-surface-container-high ghost-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="flex-1 gradient-primary rounded-full py-3 text-sm font-semibold text-on-primary transition hover:opacity-95 disabled:opacity-50"
                >
                  {saveLoading ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => !deleteLoading && setDeleteId(null)}
        >
          <div
            role="alertdialog"
            aria-labelledby="del-title"
            className="w-full max-w-sm rounded-xl bg-surface-container-low p-6 shadow-ambient ghost-border"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="del-title" className="font-[family-name:var(--font-display)] text-lg font-bold text-on-surface">
              Are you sure?
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              This transaction will be permanently removed. This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteId(null)}
                className="flex-1 rounded-full bg-surface-container py-3 text-sm font-medium text-on-surface-variant ghost-border"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => void confirmDelete()}
                className="flex-1 rounded-full bg-error-container py-3 text-sm font-semibold text-error ghost-border"
              >
                {deleteLoading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryBadge({
  categories,
  categoryId,
}: {
  categories: Category[];
  categoryId: string;
}) {
  const cat = categories.find((c) => c.id === categoryId);
  const color = cat?.color ?? "#2ddbde";
  const emoji = cat?.icon?.trim() || null;

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg"
      style={{
        backgroundColor: `${color}22`,
        boxShadow: `inset 0 0 0 1px ${color}44`,
      }}
    >
      {emoji ? (
        <span aria-hidden>{emoji}</span>
      ) : (
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      )}
    </div>
  );
}
