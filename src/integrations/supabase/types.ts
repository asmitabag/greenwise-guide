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
          created_at: string
          eco_score: number
          id: string
          impact_description: string
          material_name: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          eco_score: number
          id?: string
          impact_description: string
          material_name: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          eco_score?: number
          id?: string
          impact_description?: string
          material_name?: string
          product_id?: string | null
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
          id: string
          sustainability_points: number | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          sustainability_points?: number | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
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
        Args: {
          p_product_id: string
        }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
