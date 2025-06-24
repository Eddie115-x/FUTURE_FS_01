# Project Display Order Update

This document provides information about the update to the project ordering system.

## Changes Made

1. Updated schema in `server/config/supabase-setup.sql` to include the `order_index` column
2. Updated the ProjectManager component to use `order_index` instead of `display_order`
3. Added a field in the project form to set the display order
4. Updated the Projects page to sort projects by `order_index` first, then by creation date
5. Created `server/config/update-projects-table.sql` to add the column to existing tables

## Important Notes

- Lower `order_index` values will display first on the Projects page
- The Projects page now orders by `order_index` (ascending) and then by creation date (descending)
- Existing projects with NULL `order_index` values will be automatically numbered based on their creation date when you run the update SQL

## How to Apply This Update

If you already created your Supabase tables using the previous schema, you'll need to run the update SQL:

1. Navigate to your Supabase project dashboard
2. Open the SQL Editor
3. Copy the contents of `server/config/update-projects-table.sql`
4. Paste and run the SQL in the Supabase SQL Editor
5. This will add the `order_index` column to existing tables and populate it with values

## Using the Display Order Field

In the ProjectManager component, you can now set a display order for each project. Lower numbers will appear first on the Projects page.
