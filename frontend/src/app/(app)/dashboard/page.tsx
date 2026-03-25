"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "@/lib/api";
import { formatCents, formatMonth } from "@/lib/utils";
import type { DashboardData } from "@/types";

const CATEGORY_COLORS = [
  "#2ddbde",
  "#94d3c1",
  "#67e100",
  "#ffb4ab",
  "#5af8fb",
  "#008486",
  "#FF6B6B",
  "#4ECDC4",
] as const;

const INCOME_BAR = "#67e100";
const EXPENSE_BAR = "#2ddbde";

function formatYAxisTick(cents: number): string {
  const dollars = cents / 100;
  if (Math.abs(dollars) >= 1_000_000)
    return `$${(dollars / 1_000_000).toFixed(1)}M`;
  if (Math.abs(dollars) >= 1_000) return `$${(dollars / 1_000).toFixed(1)}k`;
  return `$${Math.round(dollars)}`;
}

function TrendsTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
    fill?: string;
  }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-surface-container-high px-4 py-3 shadow-lg">
      <p className="mb-2 font-medium text-on-surface">{label}</p>
      <div className="space-y-1.5 text-sm">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{
                backgroundColor: p.color ?? p.fill ?? INCOME_BAR,
              }}
            />
            <span className="text-on-surface-variant">{p.name}</span>
            <span className="font-medium text-on-surface">
              {formatCents(p.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      category_name: string | null;
      display_name: string;
      total_cents: number;
    };
  }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  const name = p.payload.display_name;
  const total = p.payload.total_cents;
  return (
    <div className="rounded-xl bg-surface-container-high px-4 py-3 shadow-lg">
      <p className="font-medium text-on-surface">{name}</p>
      <p className="mt-1 text-sm text-primary">{formatCents(total)}</p>
    </div>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-xl bg-surface-container-low p-5">
      <div className="mb-2 h-3 w-24 animate-pulse rounded bg-surface-container-high" />
      <div className="h-8 w-32 animate-pulse rounded bg-surface-container-high" />
    </div>
  );
}

function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={`flex min-h-[320px] animate-pulse items-center justify-center rounded-xl bg-surface-container-low ${className ?? ""}`}
    >
      <div className="h-48 w-full max-w-md rounded-lg bg-surface-container-high/60" />
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api.summary
      .dashboard(6)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e: unknown) => {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const trendsChart =
    data?.trends.map((t) => ({
      monthLabel: formatMonth(t.month),
      income: t.total_income_cents,
      expense: t.total_expense_cents,
    })) ?? [];

  const pieData =
    data?.current_month.category_breakdown
      .filter((c) => c.total_cents > 0)
      .map((c) => ({
        ...c,
        display_name: c.category_name?.trim() || "Uncategorized",
      })) ?? [];

  const cm = data?.current_month;

  return (
    <div className="min-h-full bg-surface">
      <header className="mb-8">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-on-surface">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Income, spending, and category mix at a glance.
        </p>
      </header>

      {error && (
        <div
          className="mb-6 rounded-xl bg-surface-container-high px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Summary stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
            <StatSkeleton />
          </>
        ) : cm ? (
          <>
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Income
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-tertiary">
                {formatCents(cm.total_income_cents)}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Expenses
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-primary">
                {formatCents(cm.total_expense_cents)}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Balance
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-on-surface">
                {formatCents(cm.balance_cents)}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-on-surface-variant">
                Budget used
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-on-surface">
                {cm.budget_used_pct.toFixed(1)}%
              </p>
              <p className="mt-1 text-xs text-on-surface-variant">
                of {formatCents(cm.budget_cents)} budget
              </p>
            </div>
          </>
        ) : null}
      </section>

      {/* Spending trends */}
      <section className="mb-8">
        <div className="rounded-xl bg-surface-container p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-on-surface">
            Spending trends
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Income vs expenses over the last 6 months
          </p>
          <div className="mt-6 h-[320px] w-full">
            {loading ? (
              <ChartSkeleton className="min-h-[320px]" />
            ) : trendsChart.length === 0 ? (
              <div className="flex h-[320px] items-center justify-center rounded-xl bg-surface-container-low text-sm text-on-surface-variant">
                No trend data yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={trendsChart}
                  margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
                  barCategoryGap="18%"
                >
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: "#bdc9ca", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tickFormatter={formatYAxisTick}
                    tick={{ fill: "#bdc9ca", fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={56}
                  />
                  <Tooltip
                    content={<TrendsTooltip />}
                    cursor={{ fill: "rgba(45, 219, 222, 0.06)" }}
                  />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill={INCOME_BAR}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expenses"
                    fill={EXPENSE_BAR}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {!loading && trendsChart.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: INCOME_BAR }}
                />
                <span className="text-on-surface-variant">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: EXPENSE_BAR }}
                />
                <span className="text-on-surface-variant">Expenses</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category mix */}
      <section>
        <div className="rounded-xl bg-surface-container p-6">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-on-surface">
            Category mix
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            This month&apos;s spending by category
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)] lg:items-center">
            <div className="h-[300px] w-full min-w-0">
              {loading ? (
                <ChartSkeleton className="min-h-[300px]" />
              ) : pieData.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center rounded-xl bg-surface-container-low text-sm text-on-surface-variant">
                  No category spending this month.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="total_cents"
                      nameKey="display_name"
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={112}
                      paddingAngle={2}
                      strokeWidth={0}
                    >
                      {pieData.map((_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CategoryTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            {!loading && pieData.length > 0 && (
              <ul className="space-y-3">
                {pieData.map((cat, i) => (
                  <li
                    key={cat.category_id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-on-surface">
                        {cat.display_name}
                      </p>
                      <p className="text-on-surface-variant">
                        {formatCents(cat.total_cents)}
                        <span className="ml-2 text-xs opacity-80">
                          ({cat.count}{" "}
                          {cat.count === 1 ? "transaction" : "transactions"})
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
