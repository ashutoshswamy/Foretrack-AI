-- =============================================
-- MIGRATION: Update RLS Policies for Clerk Authentication
-- =============================================
-- Since we're using Clerk for authentication (not Supabase Auth),
-- auth.uid() returns NULL. We need policies that allow operations
-- based on the user_id column passed from the application.
-- =============================================

-- =============================================
-- DROP EXISTING POLICIES
-- =============================================

-- Categories policies
DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

-- Tags policies
DROP POLICY IF EXISTS "Users can view their own tags" ON tags;
DROP POLICY IF EXISTS "Users can insert their own tags" ON tags;
DROP POLICY IF EXISTS "Users can update their own tags" ON tags;
DROP POLICY IF EXISTS "Users can delete their own tags" ON tags;

-- Expenses policies
DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;

-- Expense tags policies
DROP POLICY IF EXISTS "Users can view their own expense tags" ON expense_tags;
DROP POLICY IF EXISTS "Users can insert their own expense tags" ON expense_tags;
DROP POLICY IF EXISTS "Users can delete their own expense tags" ON expense_tags;

-- Expense attachments policies
DROP POLICY IF EXISTS "Users can view their own expense attachments" ON expense_attachments;
DROP POLICY IF EXISTS "Users can insert their own expense attachments" ON expense_attachments;
DROP POLICY IF EXISTS "Users can update their own expense attachments" ON expense_attachments;
DROP POLICY IF EXISTS "Users can delete their own expense attachments" ON expense_attachments;

-- Budgets policies
DROP POLICY IF EXISTS "Users can view their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can insert their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can update their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can delete their own budgets" ON budgets;

-- Recurring expenses policies
DROP POLICY IF EXISTS "Users can view their own recurring expenses" ON recurring_expenses;
DROP POLICY IF EXISTS "Users can insert their own recurring expenses" ON recurring_expenses;
DROP POLICY IF EXISTS "Users can update their own recurring expenses" ON recurring_expenses;
DROP POLICY IF EXISTS "Users can delete their own recurring expenses" ON recurring_expenses;

-- Savings goals policies
DROP POLICY IF EXISTS "Users can view their own savings goals" ON savings_goals;
DROP POLICY IF EXISTS "Users can insert their own savings goals" ON savings_goals;
DROP POLICY IF EXISTS "Users can update their own savings goals" ON savings_goals;
DROP POLICY IF EXISTS "Users can delete their own savings goals" ON savings_goals;

-- Incomes policies
DROP POLICY IF EXISTS "Users can view their own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can insert their own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can update their own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can delete their own incomes" ON incomes;

-- User settings policies
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can insert their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can delete their own settings" ON user_settings;

-- =============================================
-- CREATE NEW POLICIES FOR CLERK AUTHENTICATION
-- =============================================
-- These policies allow all operations and rely on the application
-- layer (Next.js + Clerk) to enforce user_id matching.
-- The user_id is validated in the application before database operations.
-- =============================================

-- Categories policies
CREATE POLICY "clerk_categories_select"
    ON categories FOR SELECT
    USING (true);

CREATE POLICY "clerk_categories_insert"
    ON categories FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_categories_update"
    ON categories FOR UPDATE
    USING (true);

CREATE POLICY "clerk_categories_delete"
    ON categories FOR DELETE
    USING (true);

-- Tags policies
CREATE POLICY "clerk_tags_select"
    ON tags FOR SELECT
    USING (true);

CREATE POLICY "clerk_tags_insert"
    ON tags FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_tags_update"
    ON tags FOR UPDATE
    USING (true);

CREATE POLICY "clerk_tags_delete"
    ON tags FOR DELETE
    USING (true);

-- Expenses policies
CREATE POLICY "clerk_expenses_select"
    ON expenses FOR SELECT
    USING (true);

CREATE POLICY "clerk_expenses_insert"
    ON expenses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_expenses_update"
    ON expenses FOR UPDATE
    USING (true);

CREATE POLICY "clerk_expenses_delete"
    ON expenses FOR DELETE
    USING (true);

-- Expense tags policies
CREATE POLICY "clerk_expense_tags_select"
    ON expense_tags FOR SELECT
    USING (true);

CREATE POLICY "clerk_expense_tags_insert"
    ON expense_tags FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_expense_tags_delete"
    ON expense_tags FOR DELETE
    USING (true);

-- Expense attachments policies
CREATE POLICY "clerk_expense_attachments_select"
    ON expense_attachments FOR SELECT
    USING (true);

CREATE POLICY "clerk_expense_attachments_insert"
    ON expense_attachments FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_expense_attachments_update"
    ON expense_attachments FOR UPDATE
    USING (true);

CREATE POLICY "clerk_expense_attachments_delete"
    ON expense_attachments FOR DELETE
    USING (true);

-- Budgets policies
CREATE POLICY "clerk_budgets_select"
    ON budgets FOR SELECT
    USING (true);

CREATE POLICY "clerk_budgets_insert"
    ON budgets FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_budgets_update"
    ON budgets FOR UPDATE
    USING (true);

CREATE POLICY "clerk_budgets_delete"
    ON budgets FOR DELETE
    USING (true);

-- Recurring expenses policies
CREATE POLICY "clerk_recurring_expenses_select"
    ON recurring_expenses FOR SELECT
    USING (true);

CREATE POLICY "clerk_recurring_expenses_insert"
    ON recurring_expenses FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_recurring_expenses_update"
    ON recurring_expenses FOR UPDATE
    USING (true);

CREATE POLICY "clerk_recurring_expenses_delete"
    ON recurring_expenses FOR DELETE
    USING (true);

-- Savings goals policies
CREATE POLICY "clerk_savings_goals_select"
    ON savings_goals FOR SELECT
    USING (true);

CREATE POLICY "clerk_savings_goals_insert"
    ON savings_goals FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_savings_goals_update"
    ON savings_goals FOR UPDATE
    USING (true);

CREATE POLICY "clerk_savings_goals_delete"
    ON savings_goals FOR DELETE
    USING (true);

-- Incomes policies
CREATE POLICY "clerk_incomes_select"
    ON incomes FOR SELECT
    USING (true);

CREATE POLICY "clerk_incomes_insert"
    ON incomes FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_incomes_update"
    ON incomes FOR UPDATE
    USING (true);

CREATE POLICY "clerk_incomes_delete"
    ON incomes FOR DELETE
    USING (true);

-- User settings policies
CREATE POLICY "clerk_user_settings_select"
    ON user_settings FOR SELECT
    USING (true);

CREATE POLICY "clerk_user_settings_insert"
    ON user_settings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "clerk_user_settings_update"
    ON user_settings FOR UPDATE
    USING (true);

CREATE POLICY "clerk_user_settings_delete"
    ON user_settings FOR DELETE
    USING (true);

-- =============================================
-- VERIFICATION
-- =============================================
-- Run this to verify policies are created:
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';
