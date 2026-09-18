export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      app_versions: {
        Row: {
          apk_path: string
          app_id: string
          changelog: string | null
          created_at: string
          file_size_bytes: number | null
          id: string
          is_latest: boolean
          version: string
          version_code: number | null
        }
        Insert: {
          apk_path: string
          app_id: string
          changelog?: string | null
          created_at?: string
          file_size_bytes?: number | null
          id?: string
          is_latest?: boolean
          version: string
          version_code?: number | null
        }
        Update: {
          apk_path?: string
          app_id?: string
          changelog?: string | null
          created_at?: string
          file_size_bytes?: number | null
          id?: string
          is_latest?: boolean
          version?: string
          version_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "app_versions_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "mobile_apps"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author: string
          cover_image_url: string | null
          created_at: string
          featured: boolean
          id: string
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          reading_time_minutes: number | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_logos: {
        Row: {
          created_at: string
          featured: boolean
          id: string
          logo_url: string
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          featured?: boolean
          id?: string
          logo_url: string
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          featured?: boolean
          id?: string
          logo_url?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          last_message_preview: string | null
          starred: boolean
          subject: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          last_message_preview?: string | null
          starred?: boolean
          subject?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          last_message_preview?: string | null
          starred?: boolean
          subject?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          cover_image_url: string | null
          created_at: string
          featured: boolean
          icon: string | null
          id: string
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          icon?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          color?: string | null
          cover_image_url?: string | null
          created_at?: string
          featured?: boolean
          icon?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          attachment_name: string | null
          attachment_path: string | null
          budget: string | null
          created_at: string
          delivery_at: string | null
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          service_interest: string | null
          subject: string | null
        }
        Insert: {
          attachment_name?: string | null
          attachment_path?: string | null
          budget?: string | null
          created_at?: string
          delivery_at?: string | null
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          service_interest?: string | null
          subject?: string | null
        }
        Update: {
          attachment_name?: string | null
          attachment_path?: string | null
          budget?: string | null
          created_at?: string
          delivery_at?: string | null
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          service_interest?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      downloads: {
        Row: {
          app_id: string
          created_at: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
          version_id: string | null
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          version_id?: string | null
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
          version_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "mobile_apps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "app_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "app_versions_public"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_apps: {
        Row: {
          category_id: string | null
          created_at: string
          download_url: string | null
          featured: boolean
          features: Json | null
          icon_url: string | null
          id: string
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          min_android_version: string | null
          name: string
          screenshot_urls: string[] | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          tagline: string | null
          tech_stack: string[] | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          download_url?: string | null
          featured?: boolean
          features?: Json | null
          icon_url?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_android_version?: string | null
          name: string
          screenshot_urls?: string[] | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tagline?: string | null
          tech_stack?: string[] | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          download_url?: string | null
          featured?: boolean
          features?: Json | null
          icon_url?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          min_android_version?: string | null
          name?: string
          screenshot_urls?: string[] | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tagline?: string | null
          tech_stack?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mobile_apps_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_name: string | null
          attachment_path: string | null
          body: string
          conversation_id: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          attachment_name?: string | null
          attachment_path?: string | null
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          attachment_name?: string | null
          attachment_path?: string | null
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_categories: {
        Row: {
          category_id: string
          project_id: string
        }
        Insert: {
          category_id: string
          project_id: string
        }
        Update: {
          category_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_categories_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          project_id: string
          service_id: string
        }
        Insert: {
          project_id: string
          service_id: string
        }
        Update: {
          project_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_type: string | null
          created_at: string
          duration: string | null
          featured: boolean
          gallery_urls: string[] | null
          github_url: string | null
          id: string
          live_url: string | null
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          primary_category_id: string | null
          results: Json | null
          role: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          tech_stack: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          year: number | null
        }
        Insert: {
          client_type?: string | null
          created_at?: string
          duration?: string | null
          featured?: boolean
          gallery_urls?: string[] | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          primary_category_id?: string | null
          results?: Json | null
          role?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          client_type?: string | null
          created_at?: string
          duration?: string | null
          featured?: boolean
          gallery_urls?: string[] | null
          github_url?: string | null
          id?: string
          live_url?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          primary_category_id?: string | null
          results?: Json | null
          role?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          tech_stack?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_primary_category_id_fkey"
            columns: ["primary_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          category_id: string
          service_id: string
        }
        Insert: {
          category_id: string
          service_id: string
        }
        Update: {
          category_id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_categories_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          cover_image_url: string | null
          created_at: string
          deliverables: Json | null
          featured: boolean
          icon: string | null
          id: string
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          pricing_note: string | null
          short_description: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          technologies: string[] | null
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          deliverables?: Json | null
          featured?: boolean
          icon?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          pricing_note?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          technologies?: string[] | null
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          deliverables?: Json | null
          featured?: boolean
          icon?: string | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          pricing_note?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          technologies?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_title: string | null
          avatar_url: string | null
          company: string | null
          created_at: string
          featured: boolean
          id: string
          quote: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          author_name: string
          author_title?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          quote: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          author_name?: string
          author_title?: string | null
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          quote?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      app_versions_public: {
        Row: {
          app_id: string | null
          changelog: string | null
          created_at: string | null
          file_size_bytes: number | null
          id: string | null
          is_latest: boolean | null
          version: string | null
          version_code: number | null
        }
        Insert: {
          app_id?: string | null
          changelog?: string | null
          created_at?: string | null
          file_size_bytes?: number | null
          id?: string | null
          is_latest?: boolean | null
          version?: string | null
          version_code?: number | null
        }
        Update: {
          app_id?: string | null
          changelog?: string | null
          created_at?: string | null
          file_size_bytes?: number | null
          id?: string | null
          is_latest?: boolean | null
          version?: string | null
          version_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "app_versions_app_id_fkey"
            columns: ["app_id"]
            isOneToOne: false
            referencedRelation: "mobile_apps"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      content_status: "draft" | "published" | "archived"
      user_role: "user" | "admin"
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
    Enums: {
      content_status: ["draft", "published", "archived"],
      user_role: ["user", "admin"],
    },
  },
} as const
