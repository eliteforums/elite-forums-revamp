export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bulk_mail_campaigns: {
        Row: {
          body: string
          campaign_name: string
          completed_at: string | null
          created_at: string
          created_by: string | null
          failed_count: number | null
          id: string
          recipients: string[]
          sent_count: number | null
          status: string
          subject: string
        }
        Insert: {
          body: string
          campaign_name: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          failed_count?: number | null
          id?: string
          recipients: string[]
          sent_count?: number | null
          status?: string
          subject: string
        }
        Update: {
          body?: string
          campaign_name?: string
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          failed_count?: number | null
          id?: string
          recipients?: string[]
          sent_count?: number | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      careers: {
        Row: {
          created_at: string
          department: string | null
          description: string
          display_order: number
          id: string
          is_active: boolean
          location: string
          requirements: string[] | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description: string
          display_order?: number
          id?: string
          is_active?: boolean
          location?: string
          requirements?: string[] | null
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          location?: string
          requirements?: string[] | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_logos: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      offer_letters: {
        Row: {
          acceptance_deadline: string | null
          candidate_address: string | null
          candidate_email: string
          candidate_name: string
          created_at: string
          created_by: string | null
          department: string | null
          hr_manager_email: string | null
          hr_manager_name: string | null
          hr_manager_phone: string | null
          id: string
          joining_date: string
          letter_content: string | null
          location: string | null
          position: string
          salary: string
          status: string
          updated_at: string
        }
        Insert: {
          acceptance_deadline?: string | null
          candidate_address?: string | null
          candidate_email: string
          candidate_name: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          hr_manager_email?: string | null
          hr_manager_name?: string | null
          hr_manager_phone?: string | null
          id?: string
          joining_date: string
          letter_content?: string | null
          location?: string | null
          position: string
          salary: string
          status?: string
          updated_at?: string
        }
        Update: {
          acceptance_deadline?: string | null
          candidate_address?: string | null
          candidate_email?: string
          candidate_name?: string
          created_at?: string
          created_by?: string | null
          department?: string | null
          hr_manager_email?: string | null
          hr_manager_name?: string | null
          hr_manager_phone?: string | null
          id?: string
          joining_date?: string
          letter_content?: string | null
          location?: string | null
          position?: string
          salary?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string
          description: string
          display_order: number
          gradient: string
          id: string
          is_active: boolean
          link: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          gradient?: string
          id?: string
          is_active?: boolean
          link: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          gradient?: string
          id?: string
          is_active?: boolean
          link?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          created_at: string
          description: string
          display_order: number
          gradient: string
          id: string
          is_active: boolean
          link: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          gradient?: string
          id?: string
          is_active?: boolean
          link: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          gradient?: string
          id?: string
          is_active?: boolean
          link?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_tasks: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          email_body: string | null
          email_recipients: string[] | null
          email_subject: string | null
          id: string
          is_completed: boolean
          reminder_before_minutes: number | null
          reminder_sent: boolean
          scheduled_at: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          email_body?: string | null
          email_recipients?: string[] | null
          email_subject?: string | null
          id?: string
          is_completed?: boolean
          reminder_before_minutes?: number | null
          reminder_sent?: boolean
          scheduled_at: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          email_body?: string | null
          email_recipients?: string[] | null
          email_subject?: string | null
          id?: string
          is_completed?: boolean
          reminder_before_minutes?: number | null
          reminder_sent?: boolean
          scheduled_at?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          quote: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          quote?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          quote?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_programs: {
        Row: {
          category: string | null
          created_at: string
          description: string
          display_order: number
          duration: string
          gradient: string
          icon: string
          id: string
          is_active: boolean
          level: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          display_order?: number
          duration?: string
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          level?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          display_order?: number
          duration?: string
          gradient?: string
          icon?: string
          id?: string
          is_active?: boolean
          level?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
