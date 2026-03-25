"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { cn, formatCents, formatMonth } from "@/lib/utils";
import type { MonthlySummary } from "@/types";

const CATEGORY_BAR_TONES: [string, string][] = [
  ["from-primary", "to-primary-container"],
  ["from-secondary", "to-secondary-container"],
  ["from-tertiary", "to-tertiary-container"],
  ["from-primary-fixed/80", "to-primary/70"],
];

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="h-4 w-32 animate-pulse rounded-lg bg-surface-container-high" />
        <div className="h-12 w-3/4 max-w-md animate-pulse rounded-xl bg-surface-container-high" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl bg-surface-container-high"
          />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-xl bg-surface-container-high" />
      <div className="space-y-3">
        <div className="h-6 w-48 animate-pulse rounded-lg bg-surface-container-high" />
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-surface-container-high"
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [data, setData] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.summary
      .monthly()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || "Could not load summary");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const monthLabel = data ? formatMonth(data.month) : "";

  const budgetSpentCents = useMemo(() => {
    if (!data) return 0;
    return Math.round((data.budget_cents * data.budget_used_pct) / 100);
  }, [data]);

  const maxCategoryCents = useMemo(() => {
    if (!data?.category_breakdown.length) return 1;
    return Math.max(
      ...data.category_breakdown.map((c) => c.total_cents),
      1,
    );
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-surface">
        <div className="ghost-border rounded-xl bg-surface-container p-8 text-center">
          <p className="font-[family-name:var(--font-display)] text-lg text-on-surface">
            Something went wrong
          </p>
          <p className="mt-2 text-on-surface-variant">
            {error ?? "No data available. Try again later."}
          </p>
        </div>
      </div>
    );
  }

  const overBudget = data.budget_used_pct > 100;
  const barWidthPct = Math.min(data.budget_used_pct, 100);
  const balancePositive = data.balance_cents >= 0;

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

      <div className="relative space-y-10">
        <header className="space-y-2">
          <p className="text-sm tracking-wide text-on-surface-variant">
            Welcome back
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-on-surface md:text-5xl"
          >
            {monthLabel}
          </h1>
          <p className="max-w-2xl text-on-surface-variant">
            Your month at a glance — income, spending, and how your budget is
            holding up.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="ghost-border rounded-xl bg-surface-container p-6 transition hover:bg-surface-container-high/80">
            <p className="text-sm tracking-wide text-on-surface-variant">
              Total income
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-tertiary md:text-4xl">
              {formatCents(data.total_income_cents)}
            </p>
          </div>
          <div className="ghost-border rounded-xl bg-surface-container p-6 transition hover:bg-surface-container-high/80">
            <p className="text-sm tracking-wide text-on-surface-variant">
              Total expenses
            </p>
            <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-primary md:text-4xl">
              {formatCents(data.total_expense_cents)}
            </p>
          </div>
          <div className="ghost-border rounded-xl bg-surface-container p-6 transition hover:bg-surface-container-high/80">
            <p className="text-sm tracking-wide text-on-surface-variant">
              Balance
            </p>
            <p
              className={cn(
                "mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums md:text-4xl",
                balancePositive ? "text-tertiary" : "text-error",
              )}
            >
              {formatCents(data.balance_cents)}
            </p>
          </div>
        </section>

        <section className="ghost-border rounded-xl bg-surface-container-low p-6 md:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-on-surface">
                Budget progress
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {data.budget_cents > 0 ? (
                  <>
                    <span className="text-on-surface">
                      {formatCents(budgetSpentCents)}
                    </span>
                    {" of "}
                    <span className="text-on-surface">
                      {formatCents(data.budget_cents)}
                    </span>
                    {" budget used"}
                  </>
                ) : (
                  "No monthly budget set yet."
                )}
              </p>
            </div>
            <div className="text-right">
              <span
                className={cn(
                  "font-[family-name:var(--font-display)] text-2xl font-semibold tabular-nums",
                  overBudget ? "text-error" : "text-secondary",
                )}
              >
                {data.budget_cents > 0
                  ? `${data.budget_used_pct.toFixed(0)}%`
                  : "—"}
              </span>
              {overBudget && data.budget_cents > 0 && (
                <p className="text-xs text-error">Over budget</p>
              )}
            </div>
          </div>
          <div className="mt-6 h-4 w-full overflow-hidden rounded-full bg-surface-container-high">
            {data.budget_cents > 0 ? (
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 ease-out",
                  overBudget ? "bg-error" : "gradient-primary",
                )}
                style={{ width: `${barWidthPct}%` }}
              />
            ) : (
              <div className="h-full w-0" />
            )}
          </div>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-on-surface">
            Spending by category
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Relative share of expenses this month
          </p>

          {data.category_breakdown.length === 0 ? (
            <div className="mt-6 rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant">
              No categorized expenses this month yet.
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {data.category_breakdown.map((row, index) => {
                const share =
                  data.total_expense_cents > 0
                    ? (row.total_cents / data.total_expense_cents) * 100
                    : 0;
                const barRel = (row.total_cents / maxCategoryCents) * 100;
                const [from, to] =
                  CATEGORY_BAR_TONES[index % CATEGORY_BAR_TONES.length];
                return (
                  <li
                    key={row.category_id}
                    className="ghost-border rounded-xl bg-surface-container p-4 md:p-5"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-medium text-on-surface">
                        {row.category_name ?? "Uncategorized"}
                      </span>
                      <span className="shrink-0 tabular-nums text-secondary">
                        {formatCents(row.total_cents)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-surface-container-high">
                        <div
                          className={cn(
                            "h-full rounded-full bg-gradient-to-r",
                            from,
                            to,
                          )}
                          style={{ width: `${barRel}%` }}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right text-xs tabular-nums text-on-surface-variant">
                        {share.toFixed(0)}%
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
