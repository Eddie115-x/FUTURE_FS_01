-- SQL to update projects table structure to add the order_index column
-- Run this in your Supabase SQL editor if you already created the table from the older schema

-- Check if order_index column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'order_index'
    ) THEN
        ALTER TABLE projects ADD COLUMN order_index INTEGER;
    END IF;
END $$;

-- Check if published column exists, if not add it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'projects' AND column_name = 'published'
    ) THEN
        ALTER TABLE projects ADD COLUMN published BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Add display_order column as an alias for order_index using a VIEW
CREATE OR REPLACE VIEW projects_with_display_order AS
SELECT 
    p.*,
    p.order_index AS display_order
FROM 
    projects p;

-- Update any NULL order_index values to their row number to maintain existing order
-- This ensures all existing projects have a valid order_index
WITH indexed_projects AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 as new_index
    FROM projects
    WHERE order_index IS NULL
)
UPDATE projects p
SET order_index = ip.new_index
FROM indexed_projects ip
WHERE p.id = ip.id AND p.order_index IS NULL;

-- Create index on order_index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_projects_order_index ON projects(order_index);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for the projects table
-- Allow public read access to all projects
CREATE POLICY "Allow public read access" ON projects
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert, update, and delete
CREATE POLICY "Allow authenticated insert" ON projects
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON projects
    FOR UPDATE TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON projects
    FOR DELETE TO authenticated
    USING (true);

-- Add a trigger to keep display_order & order_index in sync if you directly work with the VIEW
CREATE OR REPLACE FUNCTION update_project_order() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.display_order IS DISTINCT FROM OLD.display_order THEN
        NEW.order_index := NEW.display_order;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
