-- =============================================
-- FORETRACK AI - DATABASE SCHEMA
-- =============================================
-- A comprehensive expense tracking and financial management application
-- Powered by Supabase (PostgreSQL)
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUM TYPES
-- =============================================

-- Budget period options
CREATE TYPE budget_period AS ENUM (
    'daily',
    'weekly',
    'monthly',
    'quarterly',
    'yearly'
);

-- Recurrence frequency for recurring expenses/income
CREATE TYPE recurrence_frequency AS ENUM (
    'daily',
    'weekly',
    'biweekly',
    'monthly',
    'quarterly',
    'yearly'
);

-- Transaction type
CREATE TYPE transaction_type AS ENUM (
    'income',
    'expense'
);

-- Savings goal status
CREATE TYPE goal_status AS ENUM (
    'active',
    'completed',
    'paused',
    'cancelled'
);

-- Income source types
CREATE TYPE income_source AS ENUM (
    'Salary',
    'Freelance',
    'Business',
    'Investments',
    'Rental',
    'Gifts',
    'Refunds',
    'Other'
);

-- =============================================
-- TABLES
-- =============================================

-- =============================================
-- CATEGORIES TABLE
-- =============================================
-- Stores expense/income categories (both default and user-created)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT '📦',
    color VARCHAR(20) NOT NULL DEFAULT '#6366f1',
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    parent_category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_category UNIQUE(user_id, name)
);

-- Indexes for categories
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_parent ON categories(parent_category_id);
CREATE INDEX idx_categories_is_default ON categories(is_default);

-- =============================================
-- TAGS TABLE
-- =============================================
-- Custom tags for organizing expenses
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL DEFAULT '#6366f1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_tag UNIQUE(user_id, name)
);

-- Indexes for tags
CREATE INDEX idx_tags_user_id ON tags(user_id);

-- =============================================
-- EXPENSES TABLE
-- =============================================
-- Main expense/transaction records
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    transaction_type transaction_type NOT NULL DEFAULT 'expense',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    notes TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    time TIME,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    merchant VARCHAR(255),
    payment_method VARCHAR(50),
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurring_expense_id UUID,
    receipt_url TEXT,
    is_tax_deductible BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for expenses
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date DESC);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_transaction_type ON expenses(transaction_type);
CREATE INDEX idx_expenses_user_date ON expenses(user_id, date DESC);
CREATE INDEX idx_expenses_user_category ON expenses(user_id, category);
CREATE INDEX idx_expenses_recurring ON expenses(recurring_expense_id) WHERE recurring_expense_id IS NOT NULL;

-- =============================================
-- EXPENSE_TAGS TABLE (Junction Table)
-- =============================================
-- Many-to-many relationship between expenses and tags
CREATE TABLE expense_tags (
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (expense_id, tag_id)
);

-- Indexes for expense_tags
CREATE INDEX idx_expense_tags_expense ON expense_tags(expense_id);
CREATE INDEX idx_expense_tags_tag ON expense_tags(tag_id);

-- =============================================
-- EXPENSE_ATTACHMENTS TABLE
-- =============================================
-- Receipt and document attachments for expenses
CREATE TABLE expense_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size INTEGER,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for expense_attachments
CREATE INDEX idx_expense_attachments_expense ON expense_attachments(expense_id);

-- =============================================
-- BUDGETS TABLE
-- =============================================
-- Budget limits per category/overall
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name VARCHAR(100),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    period budget_period NOT NULL DEFAULT 'monthly',
    start_date DATE,
    end_date DATE,
    alert_threshold DECIMAL(5, 2) NOT NULL DEFAULT 80.00 CHECK (alert_threshold >= 0 AND alert_threshold <= 100),
    alert_enabled BOOLEAN NOT NULL DEFAULT true,
    rollover_enabled BOOLEAN NOT NULL DEFAULT false,
    rollover_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_category_budget UNIQUE(user_id, category, period)
);

-- Indexes for budgets
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_category_id ON budgets(category_id);
CREATE INDEX idx_budgets_is_active ON budgets(is_active);
CREATE INDEX idx_budgets_user_active ON budgets(user_id, is_active);

-- =============================================
-- RECURRING_EXPENSES TABLE
-- =============================================
-- Templates for recurring transactions
CREATE TABLE recurring_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    transaction_type transaction_type NOT NULL DEFAULT 'expense',
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    merchant VARCHAR(255),
    payment_method VARCHAR(50),
    frequency recurrence_frequency NOT NULL DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    next_occurrence DATE NOT NULL,
    day_of_month INTEGER CHECK (day_of_month >= 1 AND day_of_month <= 31),
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    is_active BOOLEAN NOT NULL DEFAULT true,
    auto_create BOOLEAN NOT NULL DEFAULT true,
    notify_before_days INTEGER NOT NULL DEFAULT 3 CHECK (notify_before_days >= 0),
    last_created_at TIMESTAMPTZ,
    times_created INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add foreign key reference from expenses to recurring_expenses
ALTER TABLE expenses 
ADD CONSTRAINT fk_expenses_recurring 
FOREIGN KEY (recurring_expense_id) 
REFERENCES recurring_expenses(id) 
ON DELETE SET NULL;

-- Indexes for recurring_expenses
CREATE INDEX idx_recurring_expenses_user_id ON recurring_expenses(user_id);
CREATE INDEX idx_recurring_expenses_next_occurrence ON recurring_expenses(next_occurrence);
CREATE INDEX idx_recurring_expenses_is_active ON recurring_expenses(is_active);
CREATE INDEX idx_recurring_expenses_user_active ON recurring_expenses(user_id, is_active);

-- =============================================
-- SAVINGS_GOALS TABLE
-- =============================================
-- Financial savings goals
CREATE TABLE savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    target_amount DECIMAL(15, 2) NOT NULL CHECK (target_amount > 0),
    current_amount DECIMAL(15, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    icon VARCHAR(50) NOT NULL DEFAULT '🎯',
    color VARCHAR(20) NOT NULL DEFAULT '#6366f1',
    target_date DATE,
    status goal_status NOT NULL DEFAULT 'active',
    priority INTEGER NOT NULL DEFAULT 1 CHECK (priority >= 1 AND priority <= 10),
    monthly_contribution DECIMAL(15, 2),
    auto_deduct BOOLEAN NOT NULL DEFAULT false,
    linked_account VARCHAR(255),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for savings_goals
CREATE INDEX idx_savings_goals_user_id ON savings_goals(user_id);
CREATE INDEX idx_savings_goals_status ON savings_goals(status);
CREATE INDEX idx_savings_goals_user_status ON savings_goals(user_id, status);
CREATE INDEX idx_savings_goals_target_date ON savings_goals(target_date);

-- =============================================
-- INCOMES TABLE
-- =============================================
-- Income records
CREATE TABLE incomes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    source income_source NOT NULL DEFAULT 'Other',
    description TEXT,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    recurring_frequency recurrence_frequency,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for incomes
CREATE INDEX idx_incomes_user_id ON incomes(user_id);
CREATE INDEX idx_incomes_date ON incomes(date DESC);
CREATE INDEX idx_incomes_source ON incomes(source);
CREATE INDEX idx_incomes_user_date ON incomes(user_id, date DESC);

-- =============================================
-- USER_SETTINGS TABLE
-- =============================================
-- User preferences and settings
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL UNIQUE,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    locale VARCHAR(10) NOT NULL DEFAULT 'en-IN',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    date_format VARCHAR(20) NOT NULL DEFAULT 'DD/MM/YYYY',
    first_day_of_week INTEGER NOT NULL DEFAULT 1 CHECK (first_day_of_week >= 0 AND first_day_of_week <= 6),
    fiscal_month_start INTEGER NOT NULL DEFAULT 4 CHECK (fiscal_month_start >= 1 AND fiscal_month_start <= 12),
    
    -- Notification preferences
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    budget_alert_enabled BOOLEAN NOT NULL DEFAULT true,
    weekly_summary_enabled BOOLEAN NOT NULL DEFAULT true,
    monthly_report_enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- Display preferences
    theme VARCHAR(20) NOT NULL DEFAULT 'light',
    compact_view BOOLEAN NOT NULL DEFAULT false,
    show_decimals BOOLEAN NOT NULL DEFAULT true,
    default_view VARCHAR(20) NOT NULL DEFAULT 'dashboard',
    
    -- Privacy settings
    data_export_enabled BOOLEAN NOT NULL DEFAULT true,
    analytics_enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- AI preferences
    ai_suggestions_enabled BOOLEAN NOT NULL DEFAULT true,
    ai_auto_categorize BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for user_settings
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- =============================================
-- VIEWS
-- =============================================

-- =============================================
-- MONTHLY EXPENSE SUMMARY VIEW
-- =============================================
-- Aggregated monthly expense data by category
CREATE OR REPLACE VIEW monthly_expense_summary AS
SELECT 
    user_id,
    TO_CHAR(date, 'YYYY-MM') AS month,
    category,
    transaction_type,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount,
    MIN(amount) AS min_amount,
    MAX(amount) AS max_amount
FROM expenses
GROUP BY user_id, TO_CHAR(date, 'YYYY-MM'), category, transaction_type
ORDER BY month DESC, total_amount DESC;

-- =============================================
-- BUDGET STATUS VIEW
-- =============================================
-- Current budget usage status
CREATE OR REPLACE VIEW budget_status AS
SELECT 
    b.id,
    b.user_id,
    b.category,
    b.amount AS budget_amount,
    b.period,
    b.alert_threshold,
    COALESCE(
        (SELECT SUM(e.amount) 
         FROM expenses e 
         WHERE e.user_id = b.user_id 
           AND e.category = b.category
           AND e.transaction_type = 'expense'
           AND e.date >= CASE b.period
               WHEN 'daily' THEN CURRENT_DATE
               WHEN 'weekly' THEN DATE_TRUNC('week', CURRENT_DATE)
               WHEN 'monthly' THEN DATE_TRUNC('month', CURRENT_DATE)
               WHEN 'quarterly' THEN DATE_TRUNC('quarter', CURRENT_DATE)
               WHEN 'yearly' THEN DATE_TRUNC('year', CURRENT_DATE)
           END
           AND e.date < CASE b.period
               WHEN 'daily' THEN CURRENT_DATE + INTERVAL '1 day'
               WHEN 'weekly' THEN DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
               WHEN 'monthly' THEN DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
               WHEN 'quarterly' THEN DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months'
               WHEN 'yearly' THEN DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
           END
        ), 0
    ) AS spent_amount,
    ROUND(
        COALESCE(
            (SELECT SUM(e.amount) * 100.0 / b.amount
             FROM expenses e 
             WHERE e.user_id = b.user_id 
               AND e.category = b.category
               AND e.transaction_type = 'expense'
               AND e.date >= CASE b.period
                   WHEN 'daily' THEN CURRENT_DATE
                   WHEN 'weekly' THEN DATE_TRUNC('week', CURRENT_DATE)
                   WHEN 'monthly' THEN DATE_TRUNC('month', CURRENT_DATE)
                   WHEN 'quarterly' THEN DATE_TRUNC('quarter', CURRENT_DATE)
                   WHEN 'yearly' THEN DATE_TRUNC('year', CURRENT_DATE)
               END
               AND e.date < CASE b.period
                   WHEN 'daily' THEN CURRENT_DATE + INTERVAL '1 day'
                   WHEN 'weekly' THEN DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
                   WHEN 'monthly' THEN DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
                   WHEN 'quarterly' THEN DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months'
                   WHEN 'yearly' THEN DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
               END
            ), 0
        ), 2
    ) AS percentage_used,
    b.amount - COALESCE(
        (SELECT SUM(e.amount) 
         FROM expenses e 
         WHERE e.user_id = b.user_id 
           AND e.category = b.category
           AND e.transaction_type = 'expense'
           AND e.date >= CASE b.period
               WHEN 'daily' THEN CURRENT_DATE
               WHEN 'weekly' THEN DATE_TRUNC('week', CURRENT_DATE)
               WHEN 'monthly' THEN DATE_TRUNC('month', CURRENT_DATE)
               WHEN 'quarterly' THEN DATE_TRUNC('quarter', CURRENT_DATE)
               WHEN 'yearly' THEN DATE_TRUNC('year', CURRENT_DATE)
           END
           AND e.date < CASE b.period
               WHEN 'daily' THEN CURRENT_DATE + INTERVAL '1 day'
               WHEN 'weekly' THEN DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
               WHEN 'monthly' THEN DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
               WHEN 'quarterly' THEN DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months'
               WHEN 'yearly' THEN DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year'
           END
        ), 0
    ) AS remaining_amount
FROM budgets b
WHERE b.is_active = true;

-- =============================================
-- FUNCTIONS
-- =============================================

-- =============================================
-- CALCULATE BUDGET SPENT FUNCTION
-- =============================================
-- Calculate total spent for a specific budget period
CREATE OR REPLACE FUNCTION calculate_budget_spent(
    p_user_id TEXT,
    p_category VARCHAR(100),
    p_period budget_period
) RETURNS DECIMAL(15, 2) AS $$
DECLARE
    v_spent DECIMAL(15, 2);
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    -- Calculate period boundaries
    CASE p_period
        WHEN 'daily' THEN
            v_start_date := CURRENT_DATE;
            v_end_date := CURRENT_DATE + INTERVAL '1 day';
        WHEN 'weekly' THEN
            v_start_date := DATE_TRUNC('week', CURRENT_DATE)::DATE;
            v_end_date := (DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week')::DATE;
        WHEN 'monthly' THEN
            v_start_date := DATE_TRUNC('month', CURRENT_DATE)::DATE;
            v_end_date := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month')::DATE;
        WHEN 'quarterly' THEN
            v_start_date := DATE_TRUNC('quarter', CURRENT_DATE)::DATE;
            v_end_date := (DATE_TRUNC('quarter', CURRENT_DATE) + INTERVAL '3 months')::DATE;
        WHEN 'yearly' THEN
            v_start_date := DATE_TRUNC('year', CURRENT_DATE)::DATE;
            v_end_date := (DATE_TRUNC('year', CURRENT_DATE) + INTERVAL '1 year')::DATE;
    END CASE;
    
    -- Calculate spent amount
    SELECT COALESCE(SUM(amount), 0)
    INTO v_spent
    FROM expenses
    WHERE user_id = p_user_id
      AND category = p_category
      AND transaction_type = 'expense'
      AND date >= v_start_date
      AND date < v_end_date;
    
    RETURN v_spent;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CREATE DEFAULT CATEGORIES FUNCTION
-- =============================================
-- Creates default expense categories for a new user
CREATE OR REPLACE FUNCTION create_default_categories(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
    -- Insert default expense categories
    INSERT INTO categories (user_id, name, icon, color, is_default, sort_order)
    VALUES
        (p_user_id, 'Food & Dining', '🍔', '#ef4444', true, 1),
        (p_user_id, 'Transportation', '🚗', '#f97316', true, 2),
        (p_user_id, 'Shopping', '🛒', '#eab308', true, 3),
        (p_user_id, 'Entertainment', '🎬', '#22c55e', true, 4),
        (p_user_id, 'Bills & Utilities', '💡', '#3b82f6', true, 5),
        (p_user_id, 'Healthcare', '🏥', '#ec4899', true, 6),
        (p_user_id, 'Education', '📚', '#8b5cf6', true, 7),
        (p_user_id, 'Travel', '✈️', '#06b6d4', true, 8),
        (p_user_id, 'Personal Care', '💅', '#f43f5e', true, 9),
        (p_user_id, 'Home & Garden', '🏠', '#84cc16', true, 10),
        (p_user_id, 'Gifts & Donations', '🎁', '#a855f7', true, 11),
        (p_user_id, 'Insurance', '🛡️', '#64748b', true, 12),
        (p_user_id, 'Investments', '📈', '#14b8a6', true, 13),
        (p_user_id, 'Subscriptions', '📱', '#6366f1', true, 14),
        (p_user_id, 'Other', '📦', '#78716c', true, 15)
    ON CONFLICT (user_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- CREATE DEFAULT USER SETTINGS FUNCTION
-- =============================================
-- Creates default settings for a new user
CREATE OR REPLACE FUNCTION create_default_user_settings(p_user_id TEXT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO user_settings (user_id)
    VALUES (p_user_id)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- UPDATE TIMESTAMP TRIGGER FUNCTION
-- =============================================
-- Automatically updates the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- TRIGGERS
-- =============================================

-- Update timestamps for all tables with updated_at column
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
    BEFORE UPDATE ON expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at
    BEFORE UPDATE ON budgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_expenses_updated_at
    BEFORE UPDATE ON recurring_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at
    BEFORE UPDATE ON savings_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incomes_updated_at
    BEFORE UPDATE ON incomes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
-- Enable RLS on all tables

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view their own categories"
    ON categories FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own categories"
    ON categories FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own categories"
    ON categories FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own categories"
    ON categories FOR DELETE
    USING (auth.uid()::text = user_id);

-- Tags policies
CREATE POLICY "Users can view their own tags"
    ON tags FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own tags"
    ON tags FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own tags"
    ON tags FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own tags"
    ON tags FOR DELETE
    USING (auth.uid()::text = user_id);

-- Expenses policies
CREATE POLICY "Users can view their own expenses"
    ON expenses FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own expenses"
    ON expenses FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own expenses"
    ON expenses FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own expenses"
    ON expenses FOR DELETE
    USING (auth.uid()::text = user_id);

-- Expense tags policies (access through expense ownership)
CREATE POLICY "Users can view their own expense tags"
    ON expense_tags FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM expenses WHERE expenses.id = expense_id AND auth.uid()::text = expenses.user_id
    ));

CREATE POLICY "Users can insert their own expense tags"
    ON expense_tags FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM expenses WHERE expenses.id = expense_id AND auth.uid()::text = expenses.user_id
    ));

CREATE POLICY "Users can delete their own expense tags"
    ON expense_tags FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM expenses WHERE expenses.id = expense_id AND auth.uid()::text = expenses.user_id
    ));

-- Expense attachments policies
CREATE POLICY "Users can view their own expense attachments"
    ON expense_attachments FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM expenses WHERE expenses.id = expense_id AND auth.uid()::text = expenses.user_id
    ));

CREATE POLICY "Users can insert their own expense attachments"
    ON expense_attachments FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM expenses WHERE expenses.id = expense_id AND auth.uid()::text = expenses.user_id
    ));

CREATE POLICY "Users can update their own expense attachments"
    ON expense_attachments FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM expenses WHERE expenses.id = expense_id AND auth.uid()::text = expenses.user_id
    ));

CREATE POLICY "Users can delete their own expense attachments"
    ON expense_attachments FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM expenses WHERE expenses.id = expense_id AND auth.uid()::text = expenses.user_id
    ));

-- Budgets policies
CREATE POLICY "Users can view their own budgets"
    ON budgets FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own budgets"
    ON budgets FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own budgets"
    ON budgets FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own budgets"
    ON budgets FOR DELETE
    USING (auth.uid()::text = user_id);

-- Recurring expenses policies
CREATE POLICY "Users can view their own recurring expenses"
    ON recurring_expenses FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own recurring expenses"
    ON recurring_expenses FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own recurring expenses"
    ON recurring_expenses FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own recurring expenses"
    ON recurring_expenses FOR DELETE
    USING (auth.uid()::text = user_id);

-- Savings goals policies
CREATE POLICY "Users can view their own savings goals"
    ON savings_goals FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own savings goals"
    ON savings_goals FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own savings goals"
    ON savings_goals FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own savings goals"
    ON savings_goals FOR DELETE
    USING (auth.uid()::text = user_id);

-- Incomes policies
CREATE POLICY "Users can view their own incomes"
    ON incomes FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own incomes"
    ON incomes FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own incomes"
    ON incomes FOR UPDATE
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own incomes"
    ON incomes FOR DELETE
    USING (auth.uid()::text = user_id);

-- User settings policies
CREATE POLICY "Users can view their own settings"
    ON user_settings FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own settings"
    ON user_settings FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own settings"
    ON user_settings FOR UPDATE
    USING (auth.uid()::text = user_id);

-- =============================================
-- GRANTS (for authenticated users)
-- =============================================

-- Grant usage on all sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant necessary permissions on tables
GRANT SELECT, INSERT, UPDATE, DELETE ON categories TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON expenses TO authenticated;
GRANT SELECT, INSERT, DELETE ON expense_tags TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON expense_attachments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON budgets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON recurring_expenses TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON savings_goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON incomes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_settings TO authenticated;

-- Grant access to views
GRANT SELECT ON monthly_expense_summary TO authenticated;
GRANT SELECT ON budget_status TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION calculate_budget_spent TO authenticated;
GRANT EXECUTE ON FUNCTION create_default_categories TO authenticated;
GRANT EXECUTE ON FUNCTION create_default_user_settings TO authenticated;
