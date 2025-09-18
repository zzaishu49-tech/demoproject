export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: 'manager' | 'employee' | 'client'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: 'manager' | 'employee' | 'client'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'manager' | 'employee' | 'client'
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          client_id: string
          client_name: string
          deadline: string
          progress_percentage: number
          assigned_employees: string[]
          created_at: string
          updated_at: string
          status: 'active' | 'completed' | 'on_hold'
          priority: 'low' | 'medium' | 'high'
        }
        Insert: {
          id?: string
          title: string
          description: string
          client_id: string
          client_name: string
          deadline: string
          progress_percentage?: number
          assigned_employees?: string[]
          created_at?: string
          updated_at?: string
          status?: 'active' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high'
        }
        Update: {
          id?: string
          title?: string
          description?: string
          client_id?: string
          client_name?: string
          deadline?: string
          progress_percentage?: number
          assigned_employees?: string[]
          created_at?: string
          updated_at?: string
          status?: 'active' | 'completed' | 'on_hold'
          priority?: 'low' | 'medium' | 'high'
        }
      }
      stages: {
        Row: {
          id: string
          project_id: string
          name: string
          notes: string
          progress_percentage: number
          approval_status: 'pending' | 'approved' | 'rejected'
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          notes?: string
          progress_percentage?: number
          approval_status?: 'pending' | 'approved' | 'rejected'
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          notes?: string
          progress_percentage?: number
          approval_status?: 'pending' | 'approved' | 'rejected'
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      comment_tasks: {
        Row: {
          id: string
          stage_id: string | null
          project_id: string
          text: string
          added_by: string
          author_name: string
          author_role: 'manager' | 'employee' | 'client'
          status: 'open' | 'in-progress' | 'done'
          assigned_to: string | null
          deadline: string | null
          timestamp: string
          is_global: boolean
        }
        Insert: {
          id?: string
          stage_id?: string | null
          project_id: string
          text: string
          added_by: string
          author_name: string
          author_role: 'manager' | 'employee' | 'client'
          status?: 'open' | 'in-progress' | 'done'
          assigned_to?: string | null
          deadline?: string | null
          timestamp?: string
          is_global?: boolean
        }
        Update: {
          id?: string
          stage_id?: string | null
          project_id?: string
          text?: string
          added_by?: string
          author_name?: string
          author_role?: 'manager' | 'employee' | 'client'
          status?: 'open' | 'in-progress' | 'done'
          assigned_to?: string | null
          deadline?: string | null
          timestamp?: string
          is_global?: boolean
        }
      }
      files: {
        Row: {
          id: string
          stage_id: string | null
          project_id: string
          filename: string
          file_url: string
          uploaded_by: string
          uploader_name: string
          timestamp: string
          size: number
          file_type: string
          category: 'reference' | 'content' | 'assets' | 'requirements' | 'other'
          description: string | null
          download_count: number
          last_downloaded: string | null
          last_downloaded_by: string | null
          is_archived: boolean
          tags: string[]
        }
        Insert: {
          id?: string
          stage_id?: string | null
          project_id: string
          filename: string
          file_url: string
          uploaded_by: string
          uploader_name: string
          timestamp?: string
          size: number
          file_type: string
          category?: 'reference' | 'content' | 'assets' | 'requirements' | 'other'
          description?: string | null
          download_count?: number
          last_downloaded?: string | null
          last_downloaded_by?: string | null
          is_archived?: boolean
          tags?: string[]
        }
        Update: {
          id?: string
          stage_id?: string | null
          project_id?: string
          filename?: string
          file_url?: string
          uploaded_by?: string
          uploader_name?: string
          timestamp?: string
          size?: number
          file_type?: string
          category?: 'reference' | 'content' | 'assets' | 'requirements' | 'other'
          description?: string | null
          download_count?: number
          last_downloaded?: string | null
          last_downloaded_by?: string | null
          is_archived?: boolean
          tags?: string[]
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          contact_info: string
          estimated_amount: number
          notes: string
          created_at: string
          updated_at: string
          created_by: string
        }
        Insert: {
          id?: string
          name: string
          contact_info: string
          estimated_amount: number
          notes?: string
          created_at?: string
          updated_at?: string
          created_by: string
        }
        Update: {
          id?: string
          name?: string
          contact_info?: string
          estimated_amount?: number
          notes?: string
          created_at?: string
          updated_at?: string
          created_by?: string
        }
      }
      brochure_projects: {
        Row: {
          id: string
          client_id: string
          client_name: string
          status: 'draft' | 'ready_for_design' | 'in_design' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          client_name: string
          status?: 'draft' | 'ready_for_design' | 'in_design' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          client_name?: string
          status?: 'draft' | 'ready_for_design' | 'in_design' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      brochure_pages: {
        Row: {
          id: string
          project_id: string
          page_number: number
          approval_status: 'pending' | 'approved' | 'rejected'
          is_locked: boolean
          locked_by: string | null
          locked_by_name: string | null
          locked_at: string | null
          content: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          page_number: number
          approval_status?: 'pending' | 'approved' | 'rejected'
          is_locked?: boolean
          locked_by?: string | null
          locked_by_name?: string | null
          locked_at?: string | null
          content?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          page_number?: number
          approval_status?: 'pending' | 'approved' | 'rejected'
          is_locked?: boolean
          locked_by?: string | null
          locked_by_name?: string | null
          locked_at?: string | null
          content?: Json
          created_at?: string
          updated_at?: string
        }
      }
      page_comments: {
        Row: {
          id: string
          page_id: string
          text: string
          added_by: string
          author_name: string
          author_role: 'manager' | 'employee' | 'client'
          timestamp: string
          marked_done: boolean
          action_type: 'comment' | 'lock' | 'unlock' | 'approval' | null
        }
        Insert: {
          id?: string
          page_id: string
          text: string
          added_by: string
          author_name: string
          author_role: 'manager' | 'employee' | 'client'
          timestamp?: string
          marked_done?: boolean
          action_type?: 'comment' | 'lock' | 'unlock' | 'approval' | null
        }
        Update: {
          id?: string
          page_id?: string
          text?: string
          added_by?: string
          author_name?: string
          author_role?: 'manager' | 'employee' | 'client'
          timestamp?: string
          marked_done?: boolean
          action_type?: 'comment' | 'lock' | 'unlock' | 'approval' | null
        }
      }
      download_history: {
        Row: {
          id: string
          file_id: string
          downloaded_by: string
          downloader_name: string
          download_date: string
          file_name: string
          file_size: number
        }
        Insert: {
          id?: string
          file_id: string
          downloaded_by: string
          downloader_name: string
          download_date?: string
          file_name: string
          file_size: number
        }
        Update: {
          id?: string
          file_id?: string
          downloaded_by?: string
          downloader_name?: string
          download_date?: string
          file_name?: string
          file_size?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}