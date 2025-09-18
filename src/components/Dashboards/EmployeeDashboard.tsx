@@ .. @@
 import React, { useState } from 'react';
-import { useAuth } from '../../context/AuthContext';
-import { useData } from '../../context/DataContext';
+import { useAuth } from '../../context/SupabaseAuthContext';
+import { useData } from '../../context/SupabaseDataContext';
 import { ProjectCard } from '../Projects/ProjectCard';
 import { TaskCard } from '../Tasks/TaskCard';
 import { Project } from '../../types';
@@ .. @@
 export function EmployeeDashboard({ activeView, onViewChange }: EmployeeDashboardProps) {
   const { user } = useAuth();
-  const { projects, commentTasks, stages } = useData();
+  const { projects, commentTasks, stages, loading } = useData();
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [filterStatus, setFilterStatus] = useState('all');
   const [filterPriority, setFilterPriority] = useState('all');
   // const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [showProjectDetail, setShowProjectDetail] = useState(false);
   const [projectDetailTab, setProjectDetailTab] = useState('tasks');

+  if (loading) {
+    return (
+      <div className="p-6">
+        <div className="flex items-center justify-center py-12">
+          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
+        </div>
+      </div>
+    );
+  }
+
   // Filter projects assigned to current employee
   const assignedProjects = projects.filter(project => 
     project.assigned_employees.includes(user?.id || '')
   );
@@ .. @@
   const renderProjects = () => {
-    // Mock employees data for filtering (same as Manager)
-    const mockEmployees = [
-      { id: '2', name: 'Rakesh Gupta', email: 'employee@xeetrack.com', role: 'employee' },
-      { id: '4', name: 'Meera Iyer', email: 'meera@xeetrack.com', role: 'employee' },
-      { id: '6', name: 'Amit Patel', email: 'amit@xeetrack.com', role: 'employee' }
-    ];
-
     return (
       <div className="space-y-8">
         <div className="flex justify-between items-center">