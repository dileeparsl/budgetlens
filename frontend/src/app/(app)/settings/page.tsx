"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth-provider";
import { api } from "@/lib/api";
import { formatCents } from "@/lib/utils";
import type { FinanceSettings } from "@/types";

function centsToDollarInput(cents: number): string {
  if (!Number.isFinite(cents)) return "";
  return (cents / 100).toFixed(2);
}

function parseDollarsToCents(value: string): number | null {
  const cleaned = value.replace(/[$,\s]/g, "").trim();
  if (cleaned === "") return null;
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-24 animate-pulse rounded-lg bg-surface-container-high" />
        <div className="h-10 w-48 animate-pulse rounded-xl bg-surface-container-high" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl bg-surface-container-high"
          />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-surface-container-high" />
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<FinanceSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [savingsTarget, setSavingsTarget] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.settings.get();
      setSaved(data);
      setMonthlyIncome(centsToDollarInput(data.monthly_income_cents));
      setMonthlyBudget(centsToDollarInput(data.monthly_budget_cents));
      setSavingsTarget(centsToDollarInput(data.savings_target_cents));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load settings");
      setSaved(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!success) return;
    const t = window.setTimeout(() => setSuccess(false), 4500);
    return () => window.clearTimeout(t);
  }, [success]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const incomeCents = parseDollarsToCents(monthlyIncome);
    const budgetCents = parseDollarsToCents(monthlyBudget);
    const savingsCents = parseDollarsToCents(savingsTarget);

    if (
      incomeCents === null ||
      budgetCents === null ||
      savingsCents === null
    ) {
      setError("Enter valid dollar amounts (e.g. 5000 or 5000.00).");
      return;
    }

    setSaving(true);
    try {
      const updated = await api.settings.update({
        monthly_income_cents: incomeCents,
        monthly_budget_cents: budgetCents,
        savings_target_cents: savingsCents,
      });
      setSaved(updated);
      setMonthlyIncome(centsToDollarInput(updated.monthly_income_cents));
      setMonthlyBudget(centsToDollarInput(updated.monthly_budget_cents));
      setSavingsTarget(centsToDollarInput(updated.savings_target_cents));
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save settings",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-surface">
        <div
          className="pointer-events-none absolute -right-32 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-surface">
      <div
        className="pointer-events-none absolute -right-32 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-tertiary/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl space-y-10">
        <header className="space-y-2">
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-on-surface md:text-5xl">
            Settings
          </h1>
          <p className="text-on-surface-variant">
            Manage your monthly financial targets
          </p>
        </header>

        {success && (
          <div
            className="ghost-border rounded-xl bg-surface-container-low px-4 py-3 text-center text-sm font-medium text-tertiary"
            role="status"
          >
            Settings updated!
          </div>
        )}

        {error && (
          <div
            className="ghost-border rounded-xl bg-error/10 px-4 py-3 text-center text-sm text-error"
            role="alert"
          >
            {error}
          </div>
        )}

        <section className="ghost-border rounded-xl bg-surface-container-low p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-on-surface">
            Profile
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Signed in as
          </p>
          <p className="mt-4 rounded-xl bg-surface-container-highest px-4 py-3 text-on-surface">
            {user?.email ?? "—"}
          </p>
        </section>

        {saved && (
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="ghost-border rounded-xl bg-surface-container p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Monthly income
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-tertiary">
                {formatCents(saved.monthly_income_cents)}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">Saved</p>
            </div>
            <div className="ghost-border rounded-xl bg-surface-container p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Monthly budget
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-primary">
                {formatCents(saved.monthly_budget_cents)}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">Saved</p>
            </div>
            <div className="ghost-border rounded-xl bg-surface-container p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Savings target
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-semibold tabular-nums text-on-surface">
                {formatCents(saved.savings_target_cents)}
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">Saved</p>
            </div>
          </section>
        )}

        <section className="rounded-xl bg-surface-container p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-on-surface">
            Finance targets
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Enter amounts in dollars. We store values in cents for accuracy.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="monthly-income"
                className="block text-sm font-medium text-on-surface"
              >
                Monthly income
              </label>
              <input
                id="monthly-income"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="0.00"
                className="focus-ring w-full rounded-xl bg-surface-container-highest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50"
              />
              <p className="text-sm text-on-surface-variant">
                Expected income each month before taxes (as you prefer to track
                it).
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="monthly-budget"
                className="block text-sm font-medium text-on-surface"
              >
                Monthly budget
              </label>
              <input
                id="monthly-budget"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="0.00"
                className="focus-ring w-full rounded-xl bg-surface-container-highest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50"
              />
              <p className="text-sm text-on-surface-variant">
                Total spending cap you want to stay within each month.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="savings-target"
                className="block text-sm font-medium text-on-surface"
              >
                Savings target
              </label>
              <input
                id="savings-target"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={savingsTarget}
                onChange={(e) => setSavingsTarget(e.target.value)}
                placeholder="0.00"
                className="focus-ring w-full rounded-xl bg-surface-container-highest px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50"
              />
              <p className="text-sm text-on-surface-variant">
                How much you aim to set aside monthly toward savings goals.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="gradient-primary w-full rounded-full px-8 py-3.5 text-sm font-semibold text-on-primary shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
