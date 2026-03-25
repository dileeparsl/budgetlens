-- =============================================================================
-- BudgetLens — Supabase schema (run in SQL Editor)
-- All money columns store integer CENTS to avoid floating-point issues.
-- =============================================================================

-- ── Categories ───────────────────────────────────────────────────────────────

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  icon        text,
  color       text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_categories_user on public.categories(user_id);

alter table public.categories enable row level security;

create policy "Users manage own categories"
  on public.categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── Transactions ─────────────────────────────────────────────────────────────

create table if not exists public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  amount_cents  integer not null check (amount_cents > 0),
  type          text not null check (type in ('income', 'expense')),
  category_id   uuid not null references public.categories(id) on delete restrict,
  description   text,
  date          date not null default current_date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_transactions_user      on public.transactions(user_id);
create index if not exists idx_transactions_date      on public.transactions(user_id, date);
create index if not exists idx_transactions_category  on public.transactions(category_id);

alter table public.transactions enable row level security;

create policy "Users manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── Finance settings (one row per user) ──────────────────────────────────────

create table if not exists public.finance_settings (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null unique references auth.users(id) on delete cascade,
  monthly_income_cents  integer not null default 0,
  monthly_budget_cents  integer not null default 0,
  savings_target_cents  integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.finance_settings enable row level security;

create policy "Users manage own finance settings"
  on public.finance_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── Auto-update updated_at trigger ──────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_transactions_updated_at
  before update on public.transactions
  for each row execute function public.set_updated_at();

create trigger trg_finance_settings_updated_at
  before update on public.finance_settings
  for each row execute function public.set_updated_at();


-- ── Default categories (inserted per-user via backend on first use) ─────────
-- Alternatively, seed them with a function triggered on auth.users insert.
-- For the hackathon, the API seeds defaults on first GET /api/categories.
