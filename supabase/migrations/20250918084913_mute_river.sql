/*
  # Initial Schema Setup for XeeTrack Project Management System

  1. New Tables
    - `users` - User accounts with role-based access
    - `projects` - Main project entities with client assignments
    - `stages` - Project stages with approval workflow
    - `comment_tasks` - Comments and tasks with status tracking
    - `files` - File management with metadata and download tracking
    - `leads` - Lead management for potential clients
    - `brochure_projects` - Brochure design projects
    - `brochure_pages` - Individual brochure pages with content
    - `page_comments` - Comments on brochure pages
    - `download_history` - File download tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Manager: Full access to all data
    - Employee: Access to assigned projects only
    - Client: Access to own projects only

  3. Features
    - UUID primary keys for all tables
    - Automatic timestamps
    - JSON content storage for flexible brochure pages
    - File categorization and tagging
    - Progress tracking and approval workflows
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('manager', 'employee', 'client')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  deadline date NOT NULL,
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  assigned_employees uuid[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold')),
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stages table
CREATE TABLE IF NOT EXISTS stages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  notes text DEFAULT '',
  progress_percentage integer DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Comment tasks table
CREATE TABLE IF NOT EXISTS comment_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_id uuid REFERENCES stages(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  text text NOT NULL,
  added_by uuid REFERENCES users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_role text NOT NULL CHECK (author_role IN ('manager', 'employee', 'client')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'done')),
  assigned_to uuid REFERENCES users(id) ON DELETE SET NULL,
  deadline date,
  timestamp timestamptz DEFAULT now(),
  is_global boolean DEFAULT false
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stage_id uuid REFERENCES stages(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  filename text NOT NULL,
  file_url text NOT NULL,
  uploaded_by uuid REFERENCES users(id) ON DELETE CASCADE,
  uploader_name text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  size bigint NOT NULL,
  file_type text NOT NULL,
  category text DEFAULT 'other' CHECK (category IN ('reference', 'content', 'assets', 'requirements', 'other')),
  description text,
  download_count integer DEFAULT 0,
  last_downloaded timestamptz,
  last_downloaded_by uuid REFERENCES users(id) ON DELETE SET NULL,
  is_archived boolean DEFAULT false,
  tags text[] DEFAULT '{}'
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  contact_info text NOT NULL,
  estimated_amount numeric(10,2) DEFAULT 0,
  notes text DEFAULT '',
  created_by uuid REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Brochure projects table
CREATE TABLE IF NOT EXISTS brochure_projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid REFERENCES users(id) ON DELETE CASCADE,
  client_name text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'ready_for_design', 'in_design', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Brochure pages table
CREATE TABLE IF NOT EXISTS brochure_pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid REFERENCES brochure_projects(id) ON DELETE CASCADE,
  page_number integer NOT NULL,
  approval_status text DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  is_locked boolean DEFAULT false,
  locked_by uuid REFERENCES users(id) ON DELETE SET NULL,
  locked_by_name text,
  locked_at timestamptz,
  content jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(project_id, page_number)
);

-- Page comments table
CREATE TABLE IF NOT EXISTS page_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id uuid REFERENCES brochure_pages(id) ON DELETE CASCADE,
  text text NOT NULL,
  added_by uuid REFERENCES users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  author_role text NOT NULL CHECK (author_role IN ('manager', 'employee', 'client')),
  timestamp timestamptz DEFAULT now(),
  marked_done boolean DEFAULT false,
  action_type text CHECK (action_type IN ('comment', 'lock', 'unlock', 'approval'))
);

-- Download history table
CREATE TABLE IF NOT EXISTS download_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_id uuid REFERENCES files(id) ON DELETE CASCADE,
  downloaded_by uuid REFERENCES users(id) ON DELETE CASCADE,
  downloader_name text NOT NULL,
  download_date timestamptz DEFAULT now(),
  file_name text NOT NULL,
  file_size bigint NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE brochure_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE brochure_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE download_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Users
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Managers can read all users" ON users
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- RLS Policies for Projects
CREATE POLICY "Managers can manage all projects" ON projects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

CREATE POLICY "Employees can read assigned projects" ON projects
  FOR SELECT TO authenticated
  USING (
    auth.uid()::text = ANY(assigned_employees::text[]) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

CREATE POLICY "Clients can read own projects" ON projects
  FOR SELECT TO authenticated
  USING (
    client_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- RLS Policies for Stages
CREATE POLICY "Users can read project stages" ON stages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND (
        p.client_id::text = auth.uid()::text OR
        auth.uid()::text = ANY(p.assigned_employees::text[]) OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role = 'manager'
        )
      )
    )
  );

CREATE POLICY "Managers and employees can update stages" ON stages
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role IN ('manager', 'employee')
    ) AND
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND (
        auth.uid()::text = ANY(p.assigned_employees::text[]) OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role = 'manager'
        )
      )
    )
  );

-- RLS Policies for Comment Tasks
CREATE POLICY "Users can read project comments" ON comment_tasks
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND (
        p.client_id::text = auth.uid()::text OR
        auth.uid()::text = ANY(p.assigned_employees::text[]) OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role = 'manager'
        )
      )
    )
  );

CREATE POLICY "Users can create comments on accessible projects" ON comment_tasks
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND (
        p.client_id::text = auth.uid()::text OR
        auth.uid()::text = ANY(p.assigned_employees::text[]) OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role = 'manager'
        )
      )
    )
  );

CREATE POLICY "Users can update own comments or assigned tasks" ON comment_tasks
  FOR UPDATE TO authenticated
  USING (
    added_by::text = auth.uid()::text OR
    assigned_to::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- RLS Policies for Files
CREATE POLICY "Users can read project files" ON files
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND (
        p.client_id::text = auth.uid()::text OR
        auth.uid()::text = ANY(p.assigned_employees::text[]) OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role = 'manager'
        )
      )
    )
  );

CREATE POLICY "Users can upload files to accessible projects" ON files
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_id AND (
        p.client_id::text = auth.uid()::text OR
        auth.uid()::text = ANY(p.assigned_employees::text[]) OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role = 'manager'
        )
      )
    )
  );

CREATE POLICY "Managers can update all files" ON files
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- RLS Policies for Leads
CREATE POLICY "Managers can manage all leads" ON leads
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- RLS Policies for Brochure Projects
CREATE POLICY "Users can read accessible brochure projects" ON brochure_projects
  FOR SELECT TO authenticated
  USING (
    client_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role IN ('manager', 'employee')
    )
  );

CREATE POLICY "Clients can create own brochure projects" ON brochure_projects
  FOR INSERT TO authenticated
  WITH CHECK (client_id::text = auth.uid()::text);

CREATE POLICY "Managers can update all brochure projects" ON brochure_projects
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

-- RLS Policies for Brochure Pages
CREATE POLICY "Users can read accessible brochure pages" ON brochure_pages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brochure_projects bp
      WHERE bp.id = project_id AND (
        bp.client_id::text = auth.uid()::text OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role IN ('manager', 'employee')
        )
      )
    )
  );

CREATE POLICY "Users can manage accessible brochure pages" ON brochure_pages
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brochure_projects bp
      WHERE bp.id = project_id AND (
        bp.client_id::text = auth.uid()::text OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role IN ('manager', 'employee')
        )
      )
    )
  );

-- RLS Policies for Page Comments
CREATE POLICY "Users can read accessible page comments" ON page_comments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM brochure_pages bp
      JOIN brochure_projects bpr ON bpr.id = bp.project_id
      WHERE bp.id = page_id AND (
        bpr.client_id::text = auth.uid()::text OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role IN ('manager', 'employee')
        )
      )
    )
  );

CREATE POLICY "Users can create comments on accessible pages" ON page_comments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brochure_pages bp
      JOIN brochure_projects bpr ON bpr.id = bp.project_id
      WHERE bp.id = page_id AND (
        bpr.client_id::text = auth.uid()::text OR
        EXISTS (
          SELECT 1 FROM users 
          WHERE id::text = auth.uid()::text AND role IN ('manager', 'employee')
        )
      )
    )
  );

-- RLS Policies for Download History
CREATE POLICY "Users can read own download history" ON download_history
  FOR SELECT TO authenticated
  USING (
    downloaded_by::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE id::text = auth.uid()::text AND role = 'manager'
    )
  );

CREATE POLICY "Users can create download history" ON download_history
  FOR INSERT TO authenticated
  WITH CHECK (downloaded_by::text = auth.uid()::text);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_employees ON projects USING GIN(assigned_employees);
CREATE INDEX IF NOT EXISTS idx_stages_project_id ON stages(project_id);
CREATE INDEX IF NOT EXISTS idx_comment_tasks_project_id ON comment_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_comment_tasks_stage_id ON comment_tasks(stage_id);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_stage_id ON files(stage_id);
CREATE INDEX IF NOT EXISTS idx_brochure_pages_project_id ON brochure_pages(project_id);
CREATE INDEX IF NOT EXISTS idx_page_comments_page_id ON page_comments(page_id);
CREATE INDEX IF NOT EXISTS idx_download_history_file_id ON download_history(file_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stages_updated_at BEFORE UPDATE ON stages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brochure_projects_updated_at BEFORE UPDATE ON brochure_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brochure_pages_updated_at BEFORE UPDATE ON brochure_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();