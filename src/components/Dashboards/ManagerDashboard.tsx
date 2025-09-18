@@ .. @@
 import React, { useState } from 'react';
-import { useData } from '../../context/DataContext';
-import { useAuth } from '../../context/AuthContext';
+import { useData } from '../../context/SupabaseDataContext';
+import { useAuth } from '../../context/SupabaseAuthContext';
 import { ProjectCard } from '../Projects/ProjectCard';
 import { ProjectModal } from '../Projects/ProjectModal';
 import { TaskCard } from '../Tasks/TaskCard';
 import { StorageManager } from '../Storage/StorageManager';
 import { CommentManager } from '../Comments/CommentManager';
 import { BrochureReview } from '../Brochure/BrochureReview';
 import { DocumentDownloadCenter } from '../Documents/DocumentDownloadCenter';
 import { StageDetail } from '../Stages/StageDetail';
 import { Project, User, Lead } from '../../types';
@@ .. @@
 } from 'lucide-react';

-// Mock employees data
-const mockEmployees: User[] = [
-  { id: '2', name: 'Rakesh Gupta', email: 'employee@xeetrack.com', role: 'employee' },
-  { id: '4', name: 'Meera Iyer', email: 'meera@xeetrack.com', role: 'employee' },
-  { id: '6', name: 'Amit Patel', email: 'amit@xeetrack.com', role: 'employee' }
-];
-
 interface ManagerDashboardProps {
   activeView: string;
   onViewChange: (view: string) => void;
 }

 export function ManagerDashboard({ activeView, onViewChange }: ManagerDashboardProps) {
-  const { projects, stages, commentTasks, leads, createLead, updateLead, deleteLead } = useData();
+  const { projects, stages, commentTasks, leads, employees, createLead, updateLead, deleteLead, loading } = useData();
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [filterStatus, setFilterStatus] = useState('all');
   const [filterEmployee, setFilterEmployee] = useState('all');
   const [filterPriority, setFilterPriority] = useState('all');
   const [showProjectDetail, setShowProjectDetail] = useState(false);
   const [projectDetailTab, setProjectDetailTab] = useState('brochure');
   
   // Lead management state
   const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
   const [editingLead, setEditingLead] = useState<Lead | null>(null);
   const [leadForm, setLeadForm] = useState({
     name: '',
     contact_info: '',
     estimated_amount: 0,
     notes: ''
   });

+  if (loading) {
+    return (
+      <div className="p-6">
+        <div className="flex items-center justify-center py-12">
+          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
+        </div>
+      </div>
+    );
+  }
+
   const filteredProjects = projects.filter(project => {
@@ .. @@
           <select
             value={filterEmployee}
             onChange={(e) => setFilterEmployee(e.target.value)}
             className="pl-10 pr-8 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
           >
             <option value="all">All Employees</option>
-            {mockEmployees.map(employee => (
+            {employees.filter(emp => emp.role === 'employee').map(employee => (
               <option key={employee.id} value={employee.id}>{employee.name}</option>
             ))}
           </select>
@@ .. @@
             <tbody className="divide-y divide-gray-200">
               {filteredProjects.map(project => {
-                const assignedEmployeeNames = mockEmployees
+                const assignedEmployeeNames = employees
                   .filter(emp => project.assigned_employees.includes(emp.id))
                   .map(emp => emp.name);
@@ .. @@
             <tbody className="divide-y divide-gray-200">
-              {mockEmployees.map(employee => {
+              {employees.filter(emp => emp.role === 'employee').map(employee => {
                 const assignedProjects = projects.filter(p => p.assigned_employees.includes(employee.id));
                 const avgProgress = assignedProjects.length > 0 
                   ? Math.round(assignedProjects.reduce((sum, p) => sum + p.progress_percentage, 0) / assignedProjects.length)
                   : 0;
@@ .. @@
       <ProjectModal
         isOpen={isProjectModalOpen}
         onClose={() => setIsProjectModalOpen(false)}
-        employees={mockEmployees}
+        employees={employees}
       />
     </div>
   );