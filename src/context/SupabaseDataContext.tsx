import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Project, Stage, CommentTask, File, Lead, User, BrochureProject, BrochurePage, PageComment, DownloadHistory } from '../types';
import { useAuth } from './SupabaseAuthContext';

interface DataContextType {
  projects: Project[];
  stages: Stage[];
  commentTasks: CommentTask[];
  files: File[];
  leads: Lead[];
  employees: User[];
  brochureProjects: BrochureProject[];
  brochurePages: BrochurePage[];
  pageComments: PageComment[];
  downloadHistory: DownloadHistory[];
  loading: boolean;
  
  // Project management
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Stage management
  updateStageProgress: (stageId: string, progress: number) => Promise<void>;
  updateStageApproval: (stageId: string, status: 'approved' | 'rejected', comment?: string) => Promise<void>;
  
  // Comment/Task management
  addCommentTask: (data: Omit<CommentTask, 'id' | 'timestamp'>) => Promise<void>;
  updateCommentTaskStatus: (taskId: string, status: 'open' | 'in-progress' | 'done') => Promise<void>;
  
  // File management
  uploadFile: (fileData: Omit<File, 'id' | 'timestamp'>) => Promise<void>;
  downloadFile: (fileId: string) => Promise<void>;
  updateFileMetadata: (fileId: string, metadata: Partial<File>) => Promise<void>;
  
  // Lead management
  createLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  
  // Brochure management
  createBrochureProject: (clientId: string, clientName: string) => Promise<string>;
  updateBrochureProject: (id: string, updates: Partial<BrochureProject>) => Promise<void>;
  saveBrochurePage: (pageData: Omit<BrochurePage, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  getBrochurePages: (projectId: string) => BrochurePage[];
  addPageComment: (comment: Omit<PageComment, 'id' | 'timestamp'>) => Promise<void>;
  getPageComments: (pageId: string) => PageComment[];
  approveBrochurePage: (pageId: string, status: 'approved' | 'rejected', comment?: string) => Promise<void>;
  lockBrochurePage: (pageId: string) => Promise<void>;
  unlockBrochurePage: (pageId: string) => Promise<void>;
  
  // Utility functions
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [commentTasks, setCommentTasks] = useState<CommentTask[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const [brochureProjects, setBrochureProjects] = useState<BrochureProject[]>([]);
  const [brochurePages, setBrochurePages] = useState<BrochurePage[]>([]);
  const [pageComments, setPageComments] = useState<PageComment[]>([]);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshData();
    } else {
      // Clear data when not authenticated
      setProjects([]);
      setStages([]);
      setCommentTasks([]);
      setFiles([]);
      setLeads([]);
      setEmployees([]);
      setBrochureProjects([]);
      setBrochurePages([]);
      setPageComments([]);
      setDownloadHistory([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const refreshData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await Promise.all([
        loadProjects(),
        loadStages(),
        loadCommentTasks(),
        loadFiles(),
        loadLeads(),
        loadEmployees(),
        loadBrochureProjects(),
        loadBrochurePages(),
        loadPageComments(),
        loadDownloadHistory()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setProjects(data || []);
  };

  const loadStages = async () => {
    const { data, error } = await supabase
      .from('stages')
      .select('*')
      .order('order', { ascending: true });

    if (error) throw error;
    setStages(data || []);
  };

  const loadCommentTasks = async () => {
    const { data, error } = await supabase
      .from('comment_tasks')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;
    setCommentTasks(data || []);
  };

  const loadFiles = async () => {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('is_archived', false)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    setFiles(data || []);
  };

  const loadLeads = async () => {
    if (user?.role !== 'manager') return;
    
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setLeads(data || []);
  };

  const loadEmployees = async () => {
    if (user?.role !== 'manager') return;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('role', ['employee', 'client'])
      .order('name', { ascending: true });

    if (error) throw error;
    setEmployees(data || []);
  };

  const loadBrochureProjects = async () => {
    const { data, error } = await supabase
      .from('brochure_projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    setBrochureProjects(data || []);
  };

  const loadBrochurePages = async () => {
    const { data, error } = await supabase
      .from('brochure_pages')
      .select('*')
      .order('page_number', { ascending: true });

    if (error) throw error;
    setBrochurePages(data || []);
  };

  const loadPageComments = async () => {
    const { data, error } = await supabase
      .from('page_comments')
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) throw error;
    setPageComments(data || []);
  };

  const loadDownloadHistory = async () => {
    const { data, error } = await supabase
      .from('download_history')
      .select('*')
      .order('download_date', { ascending: false });

    if (error) throw error;
    setDownloadHistory(data || []);
  };

  // Project management functions
  const createProject = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();

    if (error) throw error;

    // Create default stages for the new project
    const defaultStages = [
      { name: 'Planning', order: 0 },
      { name: 'Design', order: 1 },
      { name: 'Development', order: 2 },
      { name: 'QC', order: 3 },
      { name: 'Launch', order: 4 }
    ];

    const stageInserts = defaultStages.map(stage => ({
      project_id: data.id,
      name: stage.name,
      order: stage.order,
      notes: '',
      progress_percentage: 0,
      approval_status: 'pending' as const
    }));

    await supabase.from('stages').insert(stageInserts);
    
    await refreshData();
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await loadProjects();
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await refreshData();
  };

  // Stage management functions
  const updateStageProgress = async (stageId: string, progress: number) => {
    const { error } = await supabase
      .from('stages')
      .update({ progress_percentage: progress })
      .eq('id', stageId);

    if (error) throw error;
    await loadStages();
  };

  const updateStageApproval = async (stageId: string, status: 'approved' | 'rejected', comment?: string) => {
    const { error } = await supabase
      .from('stages')
      .update({ approval_status: status })
      .eq('id', stageId);

    if (error) throw error;

    if (comment) {
      const stage = stages.find(s => s.id === stageId);
      if (stage) {
        await addCommentTask({
          stage_id: stageId,
          project_id: stage.project_id,
          text: comment,
          added_by: user!.id,
          author_name: user!.name,
          author_role: user!.role,
          status: 'open'
        });
      }
    }

    await loadStages();
  };

  // Comment/Task management functions
  const addCommentTask = async (data: Omit<CommentTask, 'id' | 'timestamp'>) => {
    const { error } = await supabase
      .from('comment_tasks')
      .insert([data]);

    if (error) throw error;
    await loadCommentTasks();
  };

  const updateCommentTaskStatus = async (taskId: string, status: 'open' | 'in-progress' | 'done') => {
    const { error } = await supabase
      .from('comment_tasks')
      .update({ status })
      .eq('id', taskId);

    if (error) throw error;
    await loadCommentTasks();
  };

  // File management functions
  const uploadFile = async (fileData: Omit<File, 'id' | 'timestamp'>) => {
    const { error } = await supabase
      .from('files')
      .insert([fileData]);

    if (error) throw error;
    await loadFiles();
  };

  const downloadFile = async (fileId: string) => {
    // Update download count
    const { error: updateError } = await supabase
      .from('files')
      .update({ 
        download_count: supabase.sql`download_count + 1`,
        last_downloaded: new Date().toISOString(),
        last_downloaded_by: user!.id
      })
      .eq('id', fileId);

    if (updateError) throw updateError;

    // Add to download history
    const file = files.find(f => f.id === fileId);
    if (file) {
      await supabase
        .from('download_history')
        .insert([{
          file_id: fileId,
          downloaded_by: user!.id,
          downloader_name: user!.name,
          file_name: file.filename,
          file_size: file.size
        }]);
    }

    await Promise.all([loadFiles(), loadDownloadHistory()]);
  };

  const updateFileMetadata = async (fileId: string, metadata: Partial<File>) => {
    const { error } = await supabase
      .from('files')
      .update(metadata)
      .eq('id', fileId);

    if (error) throw error;
    await loadFiles();
  };

  // Lead management functions
  const createLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('leads')
      .insert([{ ...leadData, created_by: user!.id }]);

    if (error) throw error;
    await loadLeads();
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const { error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await loadLeads();
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await loadLeads();
  };

  // Brochure management functions
  const createBrochureProject = async (clientId: string, clientName: string): Promise<string> => {
    const { data, error } = await supabase
      .from('brochure_projects')
      .insert([{ client_id: clientId, client_name: clientName }])
      .select()
      .single();

    if (error) throw error;
    await loadBrochureProjects();
    return data.id;
  };

  const updateBrochureProject = async (id: string, updates: Partial<BrochureProject>) => {
    const { error } = await supabase
      .from('brochure_projects')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
    await loadBrochureProjects();
  };

  const saveBrochurePage = async (pageData: Omit<BrochurePage, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase
      .from('brochure_pages')
      .upsert([pageData], { 
        onConflict: 'project_id,page_number',
        ignoreDuplicates: false 
      });

    if (error) throw error;
    await loadBrochurePages();
  };

  const getBrochurePages = (projectId: string): BrochurePage[] => {
    return brochurePages
      .filter(page => page.project_id === projectId)
      .sort((a, b) => a.page_number - b.page_number);
  };

  const addPageComment = async (commentData: Omit<PageComment, 'id' | 'timestamp'>) => {
    const { error } = await supabase
      .from('page_comments')
      .insert([commentData]);

    if (error) throw error;
    await loadPageComments();
  };

  const getPageComments = (pageId: string): PageComment[] => {
    return pageComments
      .filter(comment => comment.page_id === pageId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const approveBrochurePage = async (pageId: string, status: 'approved' | 'rejected', comment?: string) => {
    const { error } = await supabase
      .from('brochure_pages')
      .update({ approval_status: status })
      .eq('id', pageId);

    if (error) throw error;

    if (comment) {
      const actionText = status === 'approved' 
        ? `Page has been approved by ${user?.name || 'Manager'}: ${comment}`
        : `Page requires changes - ${user?.name || 'Manager'}: ${comment}`;
      
      await addPageComment({
        page_id: pageId,
        text: actionText,
        added_by: user!.id,
        author_name: user!.name,
        author_role: user!.role,
        marked_done: false,
        action_type: 'approval'
      });
    }

    await loadBrochurePages();
  };

  const lockBrochurePage = async (pageId: string) => {
    const { error } = await supabase
      .from('brochure_pages')
      .update({ 
        is_locked: true,
        locked_by: user!.id,
        locked_by_name: user!.name,
        locked_at: new Date().toISOString()
      })
      .eq('id', pageId);

    if (error) throw error;
    await loadBrochurePages();
  };

  const unlockBrochurePage = async (pageId: string) => {
    const { error } = await supabase
      .from('brochure_pages')
      .update({ 
        is_locked: false,
        locked_by: null,
        locked_by_name: null,
        locked_at: null
      })
      .eq('id', pageId);

    if (error) throw error;
    await loadBrochurePages();
  };

  // Placeholder functions for compatibility
  const globalComments: any[] = [];
  const tasks: any[] = [];
  const meetings: any[] = [];

  const addGlobalComment = async () => {};
  const scheduleMeeting = async () => {};
  const createTask = async () => {};
  const updateTaskStatus = async () => {};
  const uploadFileFromInput = async () => {};
  const downloadMultipleFiles = async () => {};
  const getDownloadHistory = () => downloadHistory;
  const getBrochureProjectsForReview = () => brochureProjects.filter(p => p.status === 'ready_for_design' || p.status === 'in_design');
  const markCommentDone = async () => {};

  return (
    <DataContext.Provider value={{
      projects,
      stages,
      commentTasks,
      files,
      leads,
      employees,
      brochureProjects,
      brochurePages,
      pageComments,
      downloadHistory,
      loading,
      createProject,
      updateProject,
      deleteProject,
      updateStageProgress,
      updateStageApproval,
      addCommentTask,
      updateCommentTaskStatus,
      uploadFile,
      downloadFile,
      updateFileMetadata,
      createLead,
      updateLead,
      deleteLead,
      createBrochureProject,
      updateBrochureProject,
      saveBrochurePage,
      getBrochurePages,
      addPageComment,
      getPageComments,
      approveBrochurePage,
      lockBrochurePage,
      unlockBrochurePage,
      refreshData,
      // Compatibility exports
      globalComments,
      tasks,
      meetings,
      addGlobalComment,
      scheduleMeeting,
      createTask,
      updateTaskStatus,
      uploadFileFromInput,
      downloadMultipleFiles,
      getDownloadHistory,
      getBrochureProjectsForReview,
      markCommentDone
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}