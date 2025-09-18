@@ .. @@
 import React, { useState } from 'react';
-import { useAuth } from '../../context/AuthContext';
-import { useData } from '../../context/DataContext';
+import { useAuth } from '../../context/SupabaseAuthContext';
+import { useData } from '../../context/SupabaseDataContext';
 import { Project } from '../../types';
 import { StageApproval } from '../Stages/StageApproval';
 import { StorageManager } from '../Storage/StorageManager';
 import { CommentManager } from '../Comments/CommentManager';
 import { BrochureDesign } from '../Brochure/BrochureDesign';
 import { ClientFeedbackReport } from '../Reports/ClientFeedbackReport';
 import { CheckSquare, Layers, Upload, MessageSquare, Eye, TrendingUp, Clock, CheckCircle, BarChart3, Briefcase, FileText, User, Calendar } from 'lucide-react';

 interface ClientDashboardProps {
   activeView: string;
   onViewChange: (view: string) => void;
 }

 export function ClientDashboard({ activeView, onViewChange }: ClientDashboardProps) {
   const { user } = useAuth();
-  const { projects, stages, commentTasks, brochureProjects } = useData();
+  const { projects, stages, commentTasks, brochureProjects, loading } = useData();
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [showProjectDetail, setShowProjectDetail] = useState(false);
   const [projectDetailTab, setProjectDetailTab] = useState('stages');
   const [showFeedbackReport, setShowFeedbackReport] = useState(false);
   const [selectedBrochureProject, setSelectedBrochureProject] = useState(null);

+  if (loading) {
+    return (
+      <div className="p-6">
+        <div className="flex items-center justify-center py-12">
+          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
+        </div>
+      </div>
+    );
+  }
+
   // Get client's projects
   const clientProjects = projects.filter(project => project.client_id === user?.id);
   const clientProject = clientProjects[0]; // Focus on first project for simplicity