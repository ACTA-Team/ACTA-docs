-- Migration 0003: recreate contact_messages without RLS

-- WARNING:
-- This migration disables Row Level Security on contact_messages.
-- The table will be fully writable/readable according to database role privileges.

-- If the table already exists, drop it (including any old policies)
drop table if exists public.contact_messages cascade;

-- Recreate the table from scratch, WITHOUT RLS
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  locale text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Explicitly ensure RLS is disabled (default, but we state it for clarity)
alter table public.contact_messages disable row level security;

