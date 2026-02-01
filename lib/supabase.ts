import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// ENUM TYPES
// =============================================

export type BudgetPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type RecurrenceFrequency =
  | "daily"
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type TransactionType = "income" | "expense";

export type GoalStatus = "active" | "completed" | "paused" | "cancelled";

// =============================================
// CATEGORY
// =============================================

export type Category = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  description?: string | null;
  is_default: boolean;
  parent_category_id?: string | null;
  sort_order: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryInsert = Omit<
  Category,
  | "id"
  | "created_at"
  | "updated_at"
  | "is_default"
  | "sort_order"
  | "is_archived"
> & {
  is_default?: boolean;
  sort_order?: number;
  is_archived?: boolean;
};

export type CategoryUpdate = Partial<
  Omit<Category, "id" | "user_id" | "created_at" | "updated_at">
>;

// =============================================
// TAG
// =============================================

export type Tag = {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
};

export type TagInsert = Omit<Tag, "id" | "created_at">;

// =============================================
// EXPENSE
// =============================================

export type Expense = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  transaction_type: TransactionType;
  category_id?: string | null;
  category: string;
  description?: string | null;
  notes?: string | null;
  date: string;
  time?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  merchant?: string | null;
  payment_method?: string | null;
  is_recurring: boolean;
  recurring_expense_id?: string | null;
  receipt_url?: string | null;
  is_tax_deductible: boolean;
  created_at: string;
  updated_at: string;
  // Virtual fields for joined data
  tags?: Tag[];
  attachments?: ExpenseAttachment[];
};

export type ExpenseInsert = Omit<
  Expense,
  | "id"
  | "created_at"
  | "updated_at"
  | "is_recurring"
  | "is_tax_deductible"
  | "tags"
  | "attachments"
> & {
  is_recurring?: boolean;
  is_tax_deductible?: boolean;
};

export type ExpenseUpdate = Partial<
  Omit<
    Expense,
    "id" | "user_id" | "created_at" | "updated_at" | "tags" | "attachments"
  >
>;

// =============================================
// EXPENSE TAG (Junction Table)
// =============================================

export type ExpenseTag = {
  expense_id: string;
  tag_id: string;
  created_at: string;
};

// =============================================
// EXPENSE ATTACHMENT
// =============================================

export type ExpenseAttachment = {
  id: string;
  expense_id: string;
  file_name: string;
  file_url: string;
  file_type?: string | null;
  file_size?: number | null;
  thumbnail_url?: string | null;
  created_at: string;
};

export type ExpenseAttachmentInsert = Omit<
  ExpenseAttachment,
  "id" | "created_at"
>;

// =============================================
// BUDGET
// =============================================

export type Budget = {
  id: string;
  user_id: string;
  name?: string | null;
  category_id?: string | null;
  category: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  start_date?: string | null;
  end_date?: string | null;
  alert_threshold: number;
  alert_enabled: boolean;
  rollover_enabled: boolean;
  rollover_amount: number;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type BudgetInsert = Omit<
  Budget,
  | "id"
  | "created_at"
  | "updated_at"
  | "alert_threshold"
  | "alert_enabled"
  | "rollover_enabled"
  | "rollover_amount"
  | "is_active"
> & {
  alert_threshold?: number;
  alert_enabled?: boolean;
  rollover_enabled?: boolean;
  rollover_amount?: number;
  is_active?: boolean;
};

export type BudgetUpdate = Partial<
  Omit<Budget, "id" | "user_id" | "created_at" | "updated_at">
>;

// =============================================
// RECURRING EXPENSE
// =============================================

export type RecurringExpense = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  transaction_type: TransactionType;
  category_id?: string | null;
  category: string;
  description: string;
  merchant?: string | null;
  payment_method?: string | null;
  frequency: RecurrenceFrequency;
  start_date: string;
  end_date?: string | null;
  next_occurrence: string;
  day_of_month?: number | null;
  day_of_week?: number | null;
  is_active: boolean;
  auto_create: boolean;
  notify_before_days: number;
  last_created_at?: string | null;
  times_created: number;
  notes?: string | null;
  created_at: string;
  updated_at: string;
};

export type RecurringExpenseInsert = Omit<
  RecurringExpense,
  | "id"
  | "created_at"
  | "updated_at"
  | "is_active"
  | "auto_create"
  | "notify_before_days"
  | "times_created"
> & {
  is_active?: boolean;
  auto_create?: boolean;
  notify_before_days?: number;
  times_created?: number;
};

export type RecurringExpenseUpdate = Partial<
  Omit<RecurringExpense, "id" | "user_id" | "created_at" | "updated_at">
>;

// =============================================
// SAVINGS GOAL
// =============================================

export type SavingsGoal = {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  target_amount: number;
  current_amount: number;
  currency: string;
  icon: string;
  color: string;
  target_date?: string | null;
  status: GoalStatus;
  priority: number;
  monthly_contribution?: number | null;
  auto_deduct: boolean;
  linked_account?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type SavingsGoalInsert = Omit<
  SavingsGoal,
  | "id"
  | "created_at"
  | "updated_at"
  | "current_amount"
  | "status"
  | "priority"
  | "auto_deduct"
> & {
  current_amount?: number;
  status?: GoalStatus;
  priority?: number;
  auto_deduct?: boolean;
};

export type SavingsGoalUpdate = Partial<
  Omit<SavingsGoal, "id" | "user_id" | "created_at" | "updated_at">
>;

// =============================================
// INCOME
// =============================================

export type IncomeSource =
  | "Salary"
  | "Freelance"
  | "Business"
  | "Investments"
  | "Rental"
  | "Gifts"
  | "Refunds"
  | "Other";

export type Income = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  source: IncomeSource;
  description?: string | null;
  date: string;
  is_recurring: boolean;
  recurring_frequency?: RecurrenceFrequency | null;
  created_at: string;
  updated_at: string;
};

export type IncomeInsert = Omit<
  Income,
  "id" | "created_at" | "updated_at" | "is_recurring"
> & {
  is_recurring?: boolean;
};

export type IncomeUpdate = Partial<
  Omit<Income, "id" | "user_id" | "created_at" | "updated_at">
>;

// =============================================
// USER SETTINGS
// =============================================

export type UserSettings = {
  id: string;
  user_id: string;
  currency: string;
  locale: string;
  timezone: string;
  date_format: string;
  first_day_of_week: number;
  fiscal_month_start: number;

  // Notification preferences
  email_notifications: boolean;
  push_notifications: boolean;
  budget_alert_enabled: boolean;
  weekly_summary_enabled: boolean;
  monthly_report_enabled: boolean;

  // Display preferences
  theme: string;
  compact_view: boolean;
  show_decimals: boolean;
  default_view: string;

  // Privacy settings
  data_export_enabled: boolean;
  analytics_enabled: boolean;

  // AI preferences
  ai_suggestions_enabled: boolean;
  ai_auto_categorize: boolean;

  created_at: string;
  updated_at: string;
};

export type UserSettingsInsert = Omit<
  UserSettings,
  "id" | "created_at" | "updated_at"
> & {
  locale?: string;
  timezone?: string;
  date_format?: string;
  first_day_of_week?: number;
  fiscal_month_start?: number;
  email_notifications?: boolean;
  push_notifications?: boolean;
  budget_alert_enabled?: boolean;
  weekly_summary_enabled?: boolean;
  monthly_report_enabled?: boolean;
  theme?: string;
  compact_view?: boolean;
  show_decimals?: boolean;
  default_view?: string;
  data_export_enabled?: boolean;
  analytics_enabled?: boolean;
  ai_suggestions_enabled?: boolean;
  ai_auto_categorize?: boolean;
};

export type UserSettingsUpdate = Partial<
  Omit<UserSettings, "id" | "user_id" | "created_at" | "updated_at">
>;

// =============================================
// VIEW TYPES (for computed/aggregated data)
// =============================================

export type MonthlyExpenseSummary = {
  user_id: string;
  month: string;
  category: string;
  transaction_type: TransactionType;
  transaction_count: number;
  total_amount: number;
  avg_amount: number;
  min_amount: number;
  max_amount: number;
};

export type BudgetStatus = {
  id: string;
  user_id: string;
  category: string;
  budget_amount: number;
  period: BudgetPeriod;
  alert_threshold: number;
  spent_amount: number;
  percentage_used: number;
  remaining_amount: number;
};

// =============================================
// HELPER TYPES
// =============================================

export type ExpenseWithRelations = Expense & {
  category_details?: Category | null;
  tags?: Tag[];
  attachments?: ExpenseAttachment[];
};

export type BudgetWithSpent = Budget & {
  spent: number;
  percentage: number;
  remaining: number;
};

export type CategoryWithExpenseCount = Category & {
  expense_count: number;
  total_spent: number;
};

// =============================================
// DATABASE SCHEMA TYPE (for Supabase client)
// =============================================

export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: Expense;
        Insert: ExpenseInsert;
        Update: ExpenseUpdate;
      };
      budgets: {
        Row: Budget;
        Insert: BudgetInsert;
        Update: BudgetUpdate;
      };
      incomes: {
        Row: Income;
        Insert: IncomeInsert;
        Update: IncomeUpdate;
      };
      categories: {
        Row: Category;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      tags: {
        Row: Tag;
        Insert: TagInsert;
        Update: Partial<Omit<Tag, "id" | "user_id" | "created_at">>;
      };
      expense_tags: {
        Row: ExpenseTag;
        Insert: Omit<ExpenseTag, "created_at">;
        Update: never;
      };
      expense_attachments: {
        Row: ExpenseAttachment;
        Insert: ExpenseAttachmentInsert;
        Update: Partial<
          Omit<ExpenseAttachment, "id" | "expense_id" | "created_at">
        >;
      };
      recurring_expenses: {
        Row: RecurringExpense;
        Insert: RecurringExpenseInsert;
        Update: RecurringExpenseUpdate;
      };
      savings_goals: {
        Row: SavingsGoal;
        Insert: SavingsGoalInsert;
        Update: SavingsGoalUpdate;
      };
      user_settings: {
        Row: UserSettings;
        Insert: UserSettingsInsert;
        Update: UserSettingsUpdate;
      };
    };
    Views: {
      monthly_expense_summary: {
        Row: MonthlyExpenseSummary;
      };
      budget_status: {
        Row: BudgetStatus;
      };
    };
    Functions: {
      calculate_budget_spent: {
        Args: { p_user_id: string; p_category: string; p_period: BudgetPeriod };
        Returns: number;
      };
      create_default_categories: {
        Args: { p_user_id: string };
        Returns: void;
      };
    };
  };
};
