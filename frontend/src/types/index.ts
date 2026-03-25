export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  is_default: boolean;
  created_at: string;
}

export interface CategoryCreate {
  name: string;
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount_cents: number;
  type: "income" | "expense";
  category_id: string;
  category_name: string | null;
  description: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  amount_cents: number;
  type: "income" | "expense";
  category_id: string;
  description?: string;
  date: string;
}

export interface TransactionList {
  data: Transaction[];
  count: number;
}

export interface FinanceSettings {
  id: string;
  user_id: string;
  monthly_income_cents: number;
  monthly_budget_cents: number;
  savings_target_cents: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryBreakdown {
  category_id: string;
  category_name: string | null;
  total_cents: number;
  count: number;
}

export interface MonthlySummary {
  month: string;
  total_income_cents: number;
  total_expense_cents: number;
  balance_cents: number;
  budget_cents: number;
  budget_used_pct: number;
  category_breakdown: CategoryBreakdown[];
}

export interface TrendPoint {
  month: string;
  total_income_cents: number;
  total_expense_cents: number;
}

export interface DashboardData {
  current_month: MonthlySummary;
  trends: TrendPoint[];
}
