-- Migration: 002_create_supermarkets_table
-- Description: Create supermarkets table for storing user's supermarket information
-- Date: 2026-01-30

-- ============================================
-- SUPERMARKETS TABLE
-- ============================================
-- This table stores information about supermarkets/stores
-- where users track product prices

CREATE TABLE IF NOT EXISTS public.supermarkets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
-- Index on user_id for faster queries when fetching user's supermarkets

CREATE INDEX IF NOT EXISTS idx_supermarkets_user_id ON public.supermarkets(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS to ensure users can only access their own supermarkets

ALTER TABLE public.supermarkets ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own supermarkets
CREATE POLICY "Users can view own supermarkets"
  ON public.supermarkets
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own supermarkets
CREATE POLICY "Users can insert own supermarkets"
  ON public.supermarkets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own supermarkets
CREATE POLICY "Users can update own supermarkets"
  ON public.supermarkets
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own supermarkets
CREATE POLICY "Users can delete own supermarkets"
  ON public.supermarkets
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================
-- Automatically update the updated_at timestamp when a row is modified
-- Note: Reuses the handle_updated_at function created in 001_create_users_table.sql

CREATE TRIGGER on_supermarkets_updated
  BEFORE UPDATE ON public.supermarkets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
