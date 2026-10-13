export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      admin_events: {
        Row: {
          agenda: Json;
          city: string | null;
          created_at: string;
          date: string;
          eligibility: string;
          format: string;
          id: string;
          image: string;
          location: string;
          organizer: string;
          published: boolean;
          slug: string;
          summary: string;
          title: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          agenda?: Json;
          city?: string | null;
          created_at?: string;
          date: string;
          eligibility: string;
          format: string;
          id?: string;
          image: string;
          location: string;
          organizer: string;
          published?: boolean;
          slug: string;
          summary: string;
          title: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          agenda?: Json;
          city?: string | null;
          created_at?: string;
          date?: string;
          eligibility?: string;
          format?: string;
          id?: string;
          image?: string;
          location?: string;
          organizer?: string;
          published?: boolean;
          slug?: string;
          summary?: string;
          title?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      ambassador_applications: {
        Row: {
          availability: string;
          college: string;
          consent: boolean;
          course_year: string;
          created_at: string;
          email: string;
          experience: string | null;
          id: string;
          motivation: string;
          name: string;
          profile_url: string | null;
          status: string;
        };
        Insert: {
          availability: string;
          college: string;
          consent?: boolean;
          course_year: string;
          created_at?: string;
          email: string;
          experience?: string | null;
          id?: string;
          motivation: string;
          name: string;
          profile_url?: string | null;
          status?: string;
        };
        Update: {
          availability?: string;
          college?: string;
          consent?: boolean;
          course_year?: string;
          created_at?: string;
          email?: string;
          experience?: string | null;
          id?: string;
          motivation?: string;
          name?: string;
          profile_url?: string | null;
          status?: string;
        };
        Relationships: [];
      };
      college_applications: {
        Row: {
          additional_info: string | null;
          city: string;
          community_size: string | null;
          consent: boolean;
          created_at: string;
          current_activities: string | null;
          ecell_name: string | null;
          email: string;
          id: string;
          institution_name: string;
          phone: string | null;
          rep_designation: string;
          rep_name: string;
          state: string;
          status: string;
          support_needed: string;
          website: string | null;
        };
        Insert: {
          additional_info?: string | null;
          city: string;
          community_size?: string | null;
          consent?: boolean;
          created_at?: string;
          current_activities?: string | null;
          ecell_name?: string | null;
          email: string;
          id?: string;
          institution_name: string;
          phone?: string | null;
          rep_designation: string;
          rep_name: string;
          state: string;
          status?: string;
          support_needed: string;
          website?: string | null;
        };
        Update: {
          additional_info?: string | null;
          city?: string;
          community_size?: string | null;
          consent?: boolean;
          created_at?: string;
          current_activities?: string | null;
          ecell_name?: string | null;
          email?: string;
          id?: string;
          institution_name?: string;
          phone?: string | null;
          rep_designation?: string;
          rep_name?: string;
          state?: string;
          status?: string;
          support_needed?: string;
          website?: string | null;
        };
        Relationships: [];
      };
      contact_enquiries: {
        Row: {
          consent: boolean;
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
          status: string;
          topic: string;
        };
        Insert: {
          consent?: boolean;
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
          status?: string;
          topic: string;
        };
        Update: {
          consent?: boolean;
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
          status?: string;
          topic?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          consent: boolean;
          created_at: string;
          email: string;
          event_slug: string;
          id: string;
          institution: string;
          name: string;
        };
        Insert: {
          consent?: boolean;
          created_at?: string;
          email: string;
          event_slug: string;
          id?: string;
          institution: string;
          name: string;
        };
        Update: {
          consent?: boolean;
          created_at?: string;
          email?: string;
          event_slug?: string;
          id?: string;
          institution?: string;
          name?: string;
        };
        Relationships: [];
      };
      program_applications: {
        Row: {
          accuracy_confirmed: boolean;
          answers: Json;
          applicant_type: string;
          biggest_challenge: string;
          city: string;
          consent: boolean;
          contact_ok: boolean;
          created_at: string;
          email: string;
          expected_outcome: string;
          full_name: string;
          heard_from: string;
          id: string;
          industry: string;
          phone: string;
          profile_url: string | null;
          program: string;
          stage: string;
          startup_name: string | null;
          status: string;
          terms_agreed: boolean;
          website_url: string | null;
          whatsapp_available: boolean;
          why_join: string;
        };
        Insert: {
          accuracy_confirmed?: boolean;
          answers?: Json;
          applicant_type: string;
          biggest_challenge: string;
          city: string;
          consent?: boolean;
          contact_ok?: boolean;
          created_at?: string;
          email: string;
          expected_outcome: string;
          full_name: string;
          heard_from: string;
          id?: string;
          industry: string;
          phone: string;
          profile_url?: string | null;
          program: string;
          stage: string;
          startup_name?: string | null;
          status?: string;
          terms_agreed?: boolean;
          website_url?: string | null;
          whatsapp_available?: boolean;
          why_join: string;
        };
        Update: {
          accuracy_confirmed?: boolean;
          answers?: Json;
          applicant_type?: string;
          biggest_challenge?: string;
          city?: string;
          consent?: boolean;
          contact_ok?: boolean;
          created_at?: string;
          email?: string;
          expected_outcome?: string;
          full_name?: string;
          heard_from?: string;
          id?: string;
          industry?: string;
          phone?: string;
          profile_url?: string | null;
          program?: string;
          stage?: string;
          startup_name?: string | null;
          status?: string;
          terms_agreed?: boolean;
          website_url?: string | null;
          whatsapp_available?: boolean;
          why_join?: string;
        };
        Relationships: [];
      };
      site_content: {
        Row: {
          key: string;
          updated_at: string;
          value: Json;
        };
        Insert: {
          key: string;
          updated_at?: string;
          value?: Json;
        };
        Update: {
          key?: string;
          updated_at?: string;
          value?: Json;
        };
        Relationships: [];
      };
      student_registrations: {
        Row: {
          city: string;
          consent: boolean;
          course_year: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          institution: string;
          interests: string[];
          marketing_opt_in: boolean;
          phone: string | null;
          preferred_channel: string;
          status: string;
        };
        Insert: {
          city: string;
          consent?: boolean;
          course_year?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          institution: string;
          interests?: string[];
          marketing_opt_in?: boolean;
          phone?: string | null;
          preferred_channel: string;
          status?: string;
        };
        Update: {
          city?: string;
          consent?: boolean;
          course_year?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          institution?: string;
          interests?: string[];
          marketing_opt_in?: boolean;
          phone?: string | null;
          preferred_channel?: string;
          status?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
