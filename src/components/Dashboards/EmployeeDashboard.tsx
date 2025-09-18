import React, { useState } from 'react';
import { useAuth } from '../../context/SupabaseAuthContext';
import { useData } from '../../context/SupabaseDataContext';
import { ProjectCard } from '../Projects/ProjectCard';
import { TaskCard } from '../Tasks/TaskCard';
import { Project } from '../../types';

export function EmployeeDashboard({ activeView, onViewChange }: EmployeeDashboardProps) {
  const { user } = useAuth();
  const { projects, commentTasks, stages, loading } = useData();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  // const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [projectDetailTab, setProjectDetailTab] = useState('tasks');

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  // Filter projects assigned to current employee
  const assignedProjects = projects.filter(project => 
    project.assigned_employees.includes(user?.id || '')
  );

  const renderProjects = () => {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
        </div>
      </div>
    );
  };
}