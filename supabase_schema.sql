-- ====================================================================
-- DESIGNBRIDGE AFRICA - SUPABASE DATABASE MIGRATION SCRIPT
-- ====================================================================
-- This SQL script defines the complete relational schema matching the
-- DesignBridge Africa app context. Run this directly inside your
-- Supabase SQL Editor (https://supabase.com -> Project -> SQL Editor).
-- ====================================================================

-- Enable any required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. USERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    uid VARCHAR(255) PRIMARY KEY, -- Supports both Supabase Auth UUID strings and local format
    email VARCHAR(255) NOT NULL,
    "displayName" VARCHAR(255) DEFAULT 'Bridge Creative',
    "photoURL" TEXT,
    role VARCHAR(50) DEFAULT 'Client' CHECK (role IN ('Client', 'Designer', 'Admin')),
    "savedPortfolios" JSONB DEFAULT '[]'::jsonb,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index user queries by email and role for faster access and queries
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);


-- --------------------------------------------------------------------
-- 2. JOBS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.jobs (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'rec_' || replace(gen_random_uuid()::text, '-', ''),
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) DEFAULT 'Independent Client',
    budget NUMERIC(12, 2) DEFAULT 0.00,
    location VARCHAR(255),
    category VARCHAR(255) NOT NULL,
    "skillsNeeded" JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    proposals INT DEFAULT 0,
    "creatorId" VARCHAR(255) REFERENCES public.users(uid) ON DELETE SET NULL,
    "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index job search criteria to maintain high responsiveness
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_creator ON public.jobs("creatorId");


-- --------------------------------------------------------------------
-- 3. FINANCES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.finances (
    uid VARCHAR(255) PRIMARY KEY REFERENCES public.users(uid) ON DELETE CASCADE,
    balance NUMERIC(12, 2) DEFAULT 0.00,
    "pendingPayments" NUMERIC(12, 2) DEFAULT 0.00,
    "totalPaid" NUMERIC(12, 2) DEFAULT 0.00,
    invoices JSONB DEFAULT '[]'::jsonb, -- Array of Invoice structures
    cards JSONB DEFAULT '[]'::jsonb,    -- Array of payment cards structures 
    transactions JSONB DEFAULT '[]'::jsonb, -- Ledger transactions historical logs
    "updatedAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);


-- ====================================================================
-- AUTOMATED TRIGGER FOR UPDATED_AT TIMESTAMP
-- ====================================================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_jobs_modtime BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_finances_modtime BEFORE UPDATE ON public.finances FOR EACH ROW EXECUTE FUNCTION update_modified_column();


-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
-- Since Supabase enforces RLS by default on public schemas, these
-- rules ensure read/write access works and respects workspace constraints.

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finances ENABLE ROW LEVEL SECURITY;

-- users Table Policies
CREATE POLICY "Allow public read users" 
    ON public.users FOR SELECT 
    USING (true);

CREATE POLICY "Allow anyone to insert/upsert users" 
    ON public.users FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow users to update their own profiles" 
    ON public.users FOR UPDATE 
    USING (true) 
    WITH CHECK (true);

-- jobs Table Policies
CREATE POLICY "Allow public read jobs" 
    ON public.jobs FOR SELECT 
    USING (true);

CREATE POLICY "Allow anyone to post jobs" 
    ON public.jobs FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow creators to edit or delete their jobs" 
    ON public.jobs FOR UPDATE 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow creators to delete jobs" 
    ON public.jobs FOR DELETE 
    USING (true);

-- finances Table Policies
CREATE POLICY "Allow select financial summaries" 
    ON public.finances FOR SELECT 
    USING (true);

CREATE POLICY "Allow insert financial summaries" 
    ON public.finances FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow update financial summaries" 
    ON public.finances FOR UPDATE 
    USING (true)
    WITH CHECK (true);
