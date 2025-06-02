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
      companies: {
        Row: {
          cik: string | null
          created_at: string | null
          employee_count: number | null
          fiscal_year_end: string | null
          founded_year: number | null
          headquarters: string | null
          id: string
          industry: string | null
          ir_url: string | null
          market_cap: number | null
          name: string
          sector: string | null
          sub_industry: string | null
          symbol: string
          website: string | null
        }
        Insert: {
          cik?: string | null
          created_at?: string | null
          employee_count?: number | null
          fiscal_year_end?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          ir_url?: string | null
          market_cap?: number | null
          name: string
          sector?: string | null
          sub_industry?: string | null
          symbol: string
          website?: string | null
        }
        Update: {
          cik?: string | null
          created_at?: string | null
          employee_count?: number | null
          fiscal_year_end?: string | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          ir_url?: string | null
          market_cap?: number | null
          name?: string
          sector?: string | null
          sub_industry?: string | null
          symbol?: string
          website?: string | null
        }
        Relationships: []
      }
      deck_downloads: {
        Row: {
          deck_id: string
          downloaded_at: string | null
          file_format: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          deck_id: string
          downloaded_at?: string | null
          file_format?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          deck_id?: string
          downloaded_at?: string | null
          file_format?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deck_downloads_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "ma_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deck_downloads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ma_deck_tags: {
        Row: {
          deck_id: string
          tag: string
        }
        Insert: {
          deck_id: string
          tag: string
        }
        Update: {
          deck_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "ma_deck_tags_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "ma_decks"
            referencedColumns: ["id"]
          }
        ]
      }
      ma_decks: {
        Row: {
          category: string
          company_id: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          deal_date: string | null
          deal_type: string | null
          deal_value: string | null
          description: string | null
          download_count: number | null
          file_formats: string[] | null
          file_size: string | null
          id: string
          is_featured: boolean | null
          is_popular: boolean | null
          is_premium: boolean | null
          rating: number | null
          rating_count: number | null
          slide_count: number | null
          subcategory: string | null
          thumbnail_storage_path: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          company_id?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_date?: string | null
          deal_type?: string | null
          deal_value?: string | null
          description?: string | null
          download_count?: number | null
          file_formats?: string[] | null
          file_size?: string | null
          id?: string
          is_featured?: boolean | null
          is_popular?: boolean | null
          is_premium?: boolean | null
          rating?: number | null
          rating_count?: number | null
          slide_count?: number | null
          subcategory?: string | null
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          company_id?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          deal_date?: string | null
          deal_type?: string | null
          deal_value?: string | null
          description?: string | null
          download_count?: number | null
          file_formats?: string[] | null
          file_size?: string | null
          id?: string
          is_featured?: boolean | null
          is_popular?: boolean | null
          is_premium?: boolean | null
          rating?: number | null
          rating_count?: number | null
          slide_count?: number | null
          subcategory?: string | null
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ma_decks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ma_decks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ma_slides: {
        Row: {
          created_at: string | null
          deck_id: string
          description: string | null
          id: string
          image_url: string | null
          slide_number: number
          storage_path: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deck_id: string
          description?: string | null
          id?: string
          image_url?: string | null
          slide_number: number
          storage_path: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deck_id?: string
          description?: string | null
          id?: string
          image_url?: string | null
          slide_number?: number
          storage_path?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ma_slides_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "ma_decks"
            referencedColumns: ["id"]
          }
        ]
      }
      presentation_tags: {
        Row: {
          presentation_id: string
          tag: string
        }
        Insert: {
          presentation_id: string
          tag: string
        }
        Update: {
          presentation_id?: string
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "presentation_tags_presentation_id_fkey"
            columns: ["presentation_id"]
            isOneToOne: false
            referencedRelation: "presentations"
            referencedColumns: ["id"]
          }
        ]
      }
      presentations: {
        Row: {
          company_id: string | null
          company_symbol: string
          created_at: string | null
          date: string
          file_size: string | null
          file_type: string | null
          id: string
          slide_count: number | null
          storage_path: string | null
          summary: string | null
          thumbnail_storage_path: string | null
          thumbnail_url: string | null
          title: string
          url: string
          view_count: number | null
        }
        Insert: {
          company_id?: string | null
          company_symbol: string
          created_at?: string | null
          date: string
          file_size?: string | null
          file_type?: string | null
          id?: string
          slide_count?: number | null
          storage_path?: string | null
          summary?: string | null
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          title: string
          url: string
          view_count?: number | null
        }
        Update: {
          company_id?: string | null
          company_symbol?: string
          created_at?: string | null
          date?: string
          file_size?: string | null
          file_type?: string | null
          id?: string
          slide_count?: number | null
          storage_path?: string | null
          summary?: string | null
          thumbnail_storage_path?: string | null
          thumbnail_url?: string | null
          title?: string
          url?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_company_symbol"
            columns: ["company_symbol"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["symbol"]
          },
          {
            foreignKeyName: "presentations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      scraping_jobs: {
        Row: {
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          error: string | null
          id: string
          next_scheduled: string | null
          presentations_found: number | null
          started_at: string | null
          status: string
        }
        Insert: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          next_scheduled?: string | null
          presentations_found?: number | null
          started_at?: string | null
          status: string
        }
        Update: {
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          error?: string | null
          id?: string
          next_scheduled?: string | null
          presentations_found?: number | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "scraping_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      user_favorites: {
        Row: {
          created_at: string | null
          deck_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deck_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          deck_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "ma_decks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_download_count: {
        Args: {
          deck_id: string
        }
        Returns: undefined
      }
      update_deck_rating: {
        Args: {
          deck_id: string
          new_rating: number
        }
        Returns: undefined
      }
      update_popular_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never