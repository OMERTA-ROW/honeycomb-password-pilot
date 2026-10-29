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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      account_activity: {
        Row: {
          event: string
          id: string
          occurred_at: string
          user_id: string
        }
        Insert: {
          event: string
          id?: string
          occurred_at?: string
          user_id: string
        }
        Update: {
          event?: string
          id?: string
          occurred_at?: string
          user_id?: string
        }
        Relationships: []
      }
      account_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          label: string
          last_seen_at: string
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id: string
          label?: string
          last_seen_at?: string
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          label?: string
          last_seen_at?: string
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      autonomy_events: {
        Row: {
          actor_id: string
          detail: string
          event: string
          id: string
          occurred_at: string
          task_id: string | null
          user_id: string
        }
        Insert: {
          actor_id: string
          detail?: string
          event: string
          id?: string
          occurred_at?: string
          task_id?: string | null
          user_id: string
        }
        Update: {
          actor_id?: string
          detail?: string
          event?: string
          id?: string
          occurred_at?: string
          task_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      autonomy_grants: {
        Row: {
          granted_at: string
          granted_by: string
          revoked_at: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by: string
          revoked_at?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string
          revoked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "autonomy_grants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      autonomy_tasks: {
        Row: {
          capabilities: string[]
          created_at: string
          id: string
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          capabilities: string[]
          created_at?: string
          id?: string
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          capabilities?: string[]
          created_at?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "autonomy_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string
          id: string
          preferences: Json
        }
        Insert: {
          created_at?: string
          display_name?: string
          id: string
          preferences?: Json
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          preferences?: Json
        }
        Relationships: []
      }
      test_records: {
        Row: {
          created_at: string
          id: string
          label: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testing_audit: {
        Row: {
          actor_id: string | null
          event: string
          id: string
          occurred_at: string
          subject_id: string | null
        }
        Insert: {
          actor_id?: string | null
          event: string
          id?: string
          occurred_at?: string
          subject_id?: string | null
        }
        Update: {
          actor_id?: string | null
          event?: string
          id?: string
          occurred_at?: string
          subject_id?: string | null
        }
        Relationships: []
      }
      testing_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          created_by: string
          email: string
          expires_at: string
          id: string
          revoked_at: string | null
          role: string
          token_hash: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          created_by: string
          email: string
          expires_at: string
          id?: string
          revoked_at?: string | null
          role: string
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          created_by?: string
          email?: string
          expires_at?: string
          id?: string
          revoked_at?: string | null
          role?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "testing_invitations_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          active: boolean
          can_invite: boolean
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          active?: boolean
          can_invite?: boolean
          created_at?: string
          role: string
          user_id: string
        }
        Update: {
          active?: boolean
          can_invite?: boolean
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_testing_invitation: {
        Args: { invite_token_hash: string }
        Returns: undefined
      }
      account_session_active: { Args: never; Returns: boolean }
      autonomy_authorized: { Args: never; Returns: boolean }
      autonomy_redact: { Args: { input: string }; Returns: string }
      create_autonomy_task: {
        Args: { task_capabilities: string[]; task_title: string }
        Returns: string
      }
      manage_testing_member: {
        Args: {
          invite_permission: boolean
          is_active: boolean
          new_role: string
          target_user: string
        }
        Returns: undefined
      }
      register_account_session: { Args: never; Returns: string }
      revoke_account_session: {
        Args: { target_id: string }
        Returns: undefined
      }
      revoke_other_account_sessions: { Args: never; Returns: undefined }
      revoke_testing_invitation: {
        Args: { target_invite: string }
        Returns: undefined
      }
      set_autonomy_grant: {
        Args: { allowed: boolean; target_user: string }
        Returns: undefined
      }
      set_autonomy_task_status: {
        Args: { new_status: string; target_task: string }
        Returns: undefined
      }
      testing_inviter: { Args: never; Returns: boolean }
      testing_member: { Args: never; Returns: boolean }
      testing_owner: { Args: never; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
