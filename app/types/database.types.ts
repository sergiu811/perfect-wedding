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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          deposit_paid: number | null
          event_date: string
          id: string
          notes: string | null
          service_id: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number | null
          updated_at: string | null
          wedding_id: string
        }
        Insert: {
          created_at?: string | null
          deposit_paid?: number | null
          event_date: string
          id?: string
          notes?: string | null
          service_id: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number | null
          updated_at?: string | null
          wedding_id: string
        }
        Update: {
          created_at?: string | null
          deposit_paid?: number | null
          event_date?: string
          id?: string
          notes?: string | null
          service_id?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number | null
          updated_at?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          created_at: string | null
          email: string | null
          gift_status: Database["public"]["Enums"]["gift_status"] | null
          id: string
          invited_date: string | null
          meal_preference: string | null
          name: string
          notes: string | null
          phone: string | null
          plus_ones: number | null
          relationship: string
          rsvp_status: Database["public"]["Enums"]["rsvp_status"] | null
          table_number: string | null
          updated_at: string | null
          wedding_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          gift_status?: Database["public"]["Enums"]["gift_status"] | null
          id?: string
          invited_date?: string | null
          meal_preference?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          plus_ones?: number | null
          relationship: string
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"] | null
          table_number?: string | null
          updated_at?: string | null
          wedding_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          gift_status?: Database["public"]["Enums"]["gift_status"] | null
          id?: string
          invited_date?: string | null
          meal_preference?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          plus_ones?: number | null
          relationship?: string
          rsvp_status?: Database["public"]["Enums"]["rsvp_status"] | null
          table_number?: string | null
          updated_at?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guests_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: false
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          business_hours: string | null
          business_name: string | null
          created_at: string | null
          facebook: string | null
          first_name: string | null
          id: string
          instagram: string | null
          last_name: string | null
          location: string | null
          phone: string | null
          pinterest: string | null
          profile_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          service_areas: string | null
          specialties: string[] | null
          starting_price: number | null
          updated_at: string | null
          website: string | null
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          business_hours?: string | null
          business_name?: string | null
          created_at?: string | null
          facebook?: string | null
          first_name?: string | null
          id: string
          instagram?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          pinterest?: string | null
          profile_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          service_areas?: string | null
          specialties?: string[] | null
          starting_price?: number | null
          updated_at?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          business_hours?: string | null
          business_name?: string | null
          created_at?: string | null
          facebook?: string | null
          first_name?: string | null
          id?: string
          instagram?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          pinterest?: string | null
          profile_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          service_areas?: string | null
          specialties?: string[] | null
          starting_price?: number | null
          updated_at?: string | null
          website?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string
          created_at: string | null
          id: string
          images: string[] | null
          rating: number
          service_id: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          rating: number
          service_id: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          id?: string
          images?: string[] | null
          rating?: number
          service_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      seating_charts: {
        Row: {
          created_at: string | null
          id: string
          tables: Json | null
          updated_at: string | null
          wedding_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          tables?: Json | null
          updated_at?: string | null
          wedding_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          tables?: Json | null
          updated_at?: string | null
          wedding_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seating_charts_wedding_id_fkey"
            columns: ["wedding_id"]
            isOneToOne: true
            referencedRelation: "weddings"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          available_days: string[] | null
          booking_count: number | null
          category: Database["public"]["Enums"]["service_category"]
          contact_method: string | null
          created_at: string | null
          description: string
          id: string
          images: string[] | null
          is_active: boolean | null
          is_featured: boolean | null
          lead_time: number | null
          location: string
          packages: Json | null
          portfolio: string[] | null
          price_max: number | null
          price_min: number | null
          rating: number | null
          review_count: number | null
          service_region: string | null
          specific_fields: Json | null
          tags: string[] | null
          title: string
          updated_at: string | null
          vendor_id: string
          videos: string[] | null
          view_count: number | null
        }
        Insert: {
          available_days?: string[] | null
          booking_count?: number | null
          category: Database["public"]["Enums"]["service_category"]
          contact_method?: string | null
          created_at?: string | null
          description: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          lead_time?: number | null
          location: string
          packages?: Json | null
          portfolio?: string[] | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          review_count?: number | null
          service_region?: string | null
          specific_fields?: Json | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          vendor_id: string
          videos?: string[] | null
          view_count?: number | null
        }
        Update: {
          available_days?: string[] | null
          booking_count?: number | null
          category?: Database["public"]["Enums"]["service_category"]
          contact_method?: string | null
          created_at?: string | null
          description?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_featured?: boolean | null
          lead_time?: number | null
          location?: string
          packages?: Json | null
          portfolio?: string[] | null
          price_max?: number | null
          price_min?: number | null
          rating?: number | null
          review_count?: number | null
          service_region?: string | null
          specific_fields?: Json | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          vendor_id?: string
          videos?: string[] | null
          view_count?: number | null
        }
        Relationships: []
      }
      weddings: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          color_palette: string[] | null
          created_at: string | null
          current_stage: string | null
          formality_level: string | null
          guest_count: number
          help_tasks: string[] | null
          id: string
          language: string | null
          location: string
          music_styles: string[] | null
          notifications: string[] | null
          partner1_name: string
          partner2_name: string
          preferred_contact_method: string | null
          referral_source: string | null
          themes: string[] | null
          updated_at: string | null
          user_id: string
          vendor_categories: string[] | null
          venue_preference: string | null
          venue_types: string[] | null
          wedding_date: string
          wedding_type: string | null
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          color_palette?: string[] | null
          created_at?: string | null
          current_stage?: string | null
          formality_level?: string | null
          guest_count: number
          help_tasks?: string[] | null
          id?: string
          language?: string | null
          location: string
          music_styles?: string[] | null
          notifications?: string[] | null
          partner1_name: string
          partner2_name: string
          preferred_contact_method?: string | null
          referral_source?: string | null
          themes?: string[] | null
          updated_at?: string | null
          user_id: string
          vendor_categories?: string[] | null
          venue_preference?: string | null
          venue_types?: string[] | null
          wedding_date: string
          wedding_type?: string | null
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          color_palette?: string[] | null
          created_at?: string | null
          current_stage?: string | null
          formality_level?: string | null
          guest_count?: number
          help_tasks?: string[] | null
          id?: string
          language?: string | null
          location?: string
          music_styles?: string[] | null
          notifications?: string[] | null
          partner1_name?: string
          partner2_name?: string
          preferred_contact_method?: string | null
          referral_source?: string | null
          themes?: string[] | null
          updated_at?: string | null
          user_id?: string
          vendor_categories?: string[] | null
          venue_preference?: string | null
          venue_types?: string[] | null
          wedding_date?: string
          wedding_type?: string | null
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
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      gift_status: "pending" | "received" | "na"
      rsvp_status: "yes" | "no" | "pending"
      service_category:
        | "venue"
        | "photo_video"
        | "music_dj"
        | "sweets"
        | "decorations"
        | "invitations"
      user_role: "couple" | "vendor" | "admin"
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
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      gift_status: ["pending", "received", "na"],
      rsvp_status: ["yes", "no", "pending"],
      service_category: [
        "venue",
        "photo_video",
        "music_dj",
        "sweets",
        "decorations",
        "invitations",
      ],
      user_role: ["couple", "vendor", "admin"],
    },
  },
} as const
