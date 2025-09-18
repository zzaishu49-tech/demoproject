/*
  # Seed Initial Data for XeeTrack

  1. Sample Users
    - Manager: Arjun Singh
    - Employees: Rakesh Gupta, Meera Iyer
    - Clients: Priya Sharma, Rajesh Kumar

  2. Sample Projects
    - Website for Xee Design
    - E-commerce Mobile App

  3. Sample Stages
    - Planning, Design, Development, QC, Launch

  4. Sample Data
    - Comments, files, leads for demonstration
*/

-- Insert sample users
INSERT INTO users (id, name, email, role) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Arjun Singh', 'manager@xeetrack.com', 'manager'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Rakesh Gupta', 'employee@xeetrack.com', 'employee'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Priya Sharma', 'client@xeetrack.com', 'client'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Meera Iyer', 'meera@xeetrack.com', 'employee'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Rajesh Kumar', 'rajesh@xeetrack.com', 'client')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, title, description, client_id, client_name, deadline, progress_percentage, assigned_employees, status, priority) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440101',
    'Website for Xee Design',
    'Complete website redesign and development for Xee Design agency with modern UI/UX, responsive design, and CMS integration',
    '550e8400-e29b-41d4-a716-446655440003',
    'Priya Sharma',
    '2025-03-15',
    65,
    ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004'],
    'active',
    'high'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440102',
    'E-commerce Mobile App',
    'Native mobile application for online shopping with payment gateway integration and inventory management',
    '550e8400-e29b-41d4-a716-446655440005',
    'Rajesh Kumar',
    '2025-04-30',
    30,
    ARRAY['550e8400-e29b-41d4-a716-446655440002'],
    'active',
    'medium'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample stages
INSERT INTO stages (id, project_id, name, notes, progress_percentage, approval_status, "order") VALUES
  ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440101', 'Planning', 'Project requirements gathering, wireframes, and technical specifications completed', 100, 'approved', 0),
  ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440101', 'Design', 'UI/UX design mockups and prototypes ready for client review', 90, 'pending', 1),
  ('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440101', 'Development', 'Frontend development in progress, backend API integration started', 45, 'pending', 2),
  ('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440101', 'QC', 'Quality control and testing phase', 0, 'pending', 3),
  ('550e8400-e29b-41d4-a716-446655440205', '550e8400-e29b-41d4-a716-446655440101', 'Launch', 'Final deployment and go-live', 0, 'pending', 4),
  ('550e8400-e29b-41d4-a716-446655440206', '550e8400-e29b-41d4-a716-446655440102', 'Planning', 'Mobile app requirements and user flow design', 80, 'approved', 0),
  ('550e8400-e29b-41d4-a716-446655440207', '550e8400-e29b-41d4-a716-446655440102', 'Design', 'Mobile UI/UX design for iOS and Android', 60, 'pending', 1),
  ('550e8400-e29b-41d4-a716-446655440208', '550e8400-e29b-41d4-a716-446655440102', 'Development', 'Native app development', 20, 'pending', 2),
  ('550e8400-e29b-41d4-a716-446655440209', '550e8400-e29b-41d4-a716-446655440102', 'QC', 'App testing and quality assurance', 0, 'pending', 3),
  ('550e8400-e29b-41d4-a716-446655440210', '550e8400-e29b-41d4-a716-446655440102', 'Launch', 'App store submission and launch', 0, 'pending', 4)
ON CONFLICT (id) DO NOTHING;

-- Insert sample comment tasks
INSERT INTO comment_tasks (id, stage_id, project_id, text, added_by, author_name, author_role, status, assigned_to) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440301',
    '550e8400-e29b-41d4-a716-446655440202',
    '550e8400-e29b-41d4-a716-446655440101',
    'Please update the color scheme to match our brand guidelines. The current blue is too dark.',
    '550e8400-e29b-41d4-a716-446655440003',
    'Priya Sharma',
    'client',
    'open',
    '550e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440302',
    '550e8400-e29b-41d4-a716-446655440203',
    '550e8400-e29b-41d4-a716-446655440101',
    'Need to implement responsive design for mobile devices',
    '550e8400-e29b-41d4-a716-446655440001',
    'Arjun Singh',
    'manager',
    'in-progress',
    '550e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440303',
    '550e8400-e29b-41d4-a716-446655440203',
    '550e8400-e29b-41d4-a716-446655440101',
    'Database optimization completed, performance improved by 40%',
    '550e8400-e29b-41d4-a716-446655440002',
    'Rakesh Gupta',
    'employee',
    'done',
    NULL
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample files
INSERT INTO files (id, stage_id, project_id, filename, file_url, uploaded_by, uploader_name, size, file_type, category, description, download_count, tags) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440401',
    '550e8400-e29b-41d4-a716-446655440201',
    '550e8400-e29b-41d4-a716-446655440101',
    'project-requirements.pdf',
    '#',
    '550e8400-e29b-41d4-a716-446655440001',
    'Arjun Singh',
    2048576,
    'pdf',
    'requirements',
    'Initial project requirements and specifications',
    5,
    ARRAY['requirements', 'initial', 'specifications']
  ),
  (
    '550e8400-e29b-41d4-a716-446655440402',
    '550e8400-e29b-41d4-a716-446655440202',
    '550e8400-e29b-41d4-a716-446655440101',
    'design-mockups.fig',
    '#',
    '550e8400-e29b-41d4-a716-446655440002',
    'Rakesh Gupta',
    5242880,
    'fig',
    'assets',
    'Figma design mockups for homepage and key pages',
    3,
    ARRAY['design', 'mockups', 'figma']
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample leads
INSERT INTO leads (id, name, contact_info, estimated_amount, notes, created_by) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440501',
    'Tech Startup Inc',
    'contact@techstartup.com, +91-9876543210',
    150000,
    'Interested in complete branding and web development package. Follow up scheduled for next week.',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440502',
    'Local Restaurant Chain',
    'manager@restaurantchain.com, +91-9876543211',
    75000,
    'Looking for mobile app development for food delivery. Budget confirmed.',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440503',
    'Fashion Boutique',
    'info@fashionboutique.com, +91-9876543212',
    50000,
    'E-commerce website with inventory management. Needs to integrate with existing POS system.',
    '550e8400-e29b-41d4-a716-446655440001'
  )
ON CONFLICT (id) DO NOTHING;