export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      material_analysis: {
        Row: {
          biodegradability_rating: number | null
          carbon_footprint: number | null
          certification_ids: string[] | null
          created_at: string
          eco_score: number
          id: string
          impact_description: string
          material_name: string
          product_id: string | null
          recyclability_rating: number | null
          water_usage: number | null
        }
        Insert: {
          biodegradability_rating?: number | null
          carbon_footprint?: number | null
          certification_ids?: string[] | null
          created_at?: string
          eco_score: number
          id?: string
          impact_description: string
          material_name: string
          product_id?: string | null
          recyclability_rating?: number | null
          water_usage?: number | null
        }
        Update: {
          biodegradability_rating?: number | null
          carbon_footprint?: number | null
          certification_ids?: string[] | null
          created_at?: string
          eco_score?: number
          id?: string
          impact_description?: string
          material_name?: string
          product_id?: string | null
          recyclability_rating?: number | null
          water_usage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "material_analysis_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      material_certifications: {
        Row: {
          created_at: string
          description: string
          id: string
          issuing_body: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          issuing_body: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          issuing_body?: string
          name?: string
        }
        Relationships: []
      }
      material_scans: {
        Row: {
          confidence_score: number | null
          created_at: string
          detected_materials: Json
          id: string
          product_id: string | null
          scan_data: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          detected_materials: Json
          id?: string
          product_id?: string | null
          scan_data: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          detected_materials?: Json
          id?: string
          product_id?: string | null
          scan_data?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_scans_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: string
          items: Json
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          items: Json
          payment_method?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          items?: Json
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_verification_requests: {
        Row: {
          id: string
          product_id: string | null
          reviewed_at: string | null
          reviewer_notes: string | null
          seller_id: string | null
          status: string | null
          submitted_at: string
          verification_data: Json | null
        }
        Insert: {
          id?: string
          product_id?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          seller_id?: string | null
          status?: string | null
          submitted_at?: string
          verification_data?: Json | null
        }
        Update: {
          id?: string
          product_id?: string | null
          reviewed_at?: string | null
          reviewer_notes?: string | null
          seller_id?: string | null
          status?: string | null
          submitted_at?: string
          verification_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_verification_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_verification_requests_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand: string
          carbon_footprint: number | null
          category: string
          created_at: string
          description: string | null
          eco_features: string[]
          id: string
          image_url: string | null
          materials: string[] | null
          price: number
          seller_id: string | null
          sustainability_score: number
          title: string
        }
        Insert: {
          brand: string
          carbon_footprint?: number | null
          category: string
          created_at?: string
          description?: string | null
          eco_features: string[]
          id?: string
          image_url?: string | null
          materials?: string[] | null
          price: number
          seller_id?: string | null
          sustainability_score: number
          title: string
        }
        Update: {
          brand?: string
          carbon_footprint?: number | null
          category?: string
          created_at?: string
          description?: string | null
          eco_features?: string[]
          id?: string
          image_url?: string | null
          materials?: string[] | null
          price?: number
          seller_id?: string | null
          sustainability_score?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          eco_score: number | null
          favorite_brands: string[] | null
          id: string
          notification_settings: Json | null
          preferences: Json | null
          preferred_categories: string[] | null
          sustainability_points: number | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          eco_score?: number | null
          favorite_brands?: string[] | null
          id: string
          notification_settings?: Json | null
          preferences?: Json | null
          preferred_categories?: string[] | null
          sustainability_points?: number | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          eco_score?: number | null
          favorite_brands?: string[] | null
          id?: string
          notification_settings?: Json | null
          preferences?: Json | null
          preferred_categories?: string[] | null
          sustainability_points?: number | null
          username?: string | null
        }
        Relationships: []
      }
      purchases: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          total_price: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          total_price: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          business_address: string | null
          business_description: string | null
          business_name: string
          contact_email: string
          contact_phone: string | null
          created_at: string
          id: string
          verification_documents: Json | null
          verified: boolean | null
        }
        Insert: {
          business_address?: string | null
          business_description?: string | null
          business_name: string
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          id: string
          verification_documents?: Json | null
          verified?: boolean | null
        }
        Update: {
          business_address?: string | null
          business_description?: string | null
          business_name?: string
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          id?: string
          verification_documents?: Json | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_product_eco_score: {
        Args: { p_product_id: string }
        Returns: number
      }
      process_checkout: {
        Args: {
          p_user_id: string
          p_total_amount: number
          p_cart_items: Json[]
        }
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
