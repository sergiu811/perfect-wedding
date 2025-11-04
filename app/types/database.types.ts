// Auto-generated types from Supabase
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > app/types/database.types.ts

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
      profiles: {
        Row: {
          id: string
          role: 'couple' | 'vendor' | 'admin'
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          business_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'couple' | 'vendor' | 'admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          business_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'couple' | 'vendor' | 'admin'
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          business_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      weddings: {
        Row: {
          id: string
          user_id: string
          partner1_name: string
          partner2_name: string
          wedding_date: string
          guest_count: number
          budget_min: number | null
          budget_max: number | null
          location: string
          wedding_type: string | null
          language: string
          referral_source: string | null
          themes: string[]
          color_palette: string[]
          venue_preference: string | null
          formality_level: string | null
          venue_types: string[]
          music_styles: string[]
          vendor_categories: string[]
          preferred_contact_method: string | null
          current_stage: string | null
          help_tasks: string[]
          notifications: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          partner1_name: string
          partner2_name: string
          wedding_date: string
          guest_count: number
          budget_min?: number | null
          budget_max?: number | null
          location: string
          wedding_type?: string | null
          language?: string
          referral_source?: string | null
          themes?: string[]
          color_palette?: string[]
          venue_preference?: string | null
          formality_level?: string | null
          venue_types?: string[]
          music_styles?: string[]
          vendor_categories?: string[]
          preferred_contact_method?: string | null
          current_stage?: string | null
          help_tasks?: string[]
          notifications?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          partner1_name?: string
          partner2_name?: string
          wedding_date?: string
          guest_count?: number
          budget_min?: number | null
          budget_max?: number | null
          location?: string
          wedding_type?: string | null
          language?: string
          referral_source?: string | null
          themes?: string[]
          color_palette?: string[]
          venue_preference?: string | null
          formality_level?: string | null
          venue_types?: string[]
          music_styles?: string[]
          vendor_categories?: string[]
          preferred_contact_method?: string | null
          current_stage?: string | null
          help_tasks?: string[]
          notifications?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          wedding_id: string
          name: string
          email: string | null
          phone: string | null
          relationship: string
          rsvp_status: 'yes' | 'no' | 'pending'
          meal_preference: string | null
          plus_ones: number
          table_number: string | null
          invited_date: string | null
          gift_status: 'pending' | 'received' | 'na' | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          name: string
          email?: string | null
          phone?: string | null
          relationship: string
          rsvp_status?: 'yes' | 'no' | 'pending'
          meal_preference?: string | null
          plus_ones?: number
          table_number?: string | null
          invited_date?: string | null
          gift_status?: 'pending' | 'received' | 'na' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          relationship?: string
          rsvp_status?: 'yes' | 'no' | 'pending'
          meal_preference?: string | null
          plus_ones?: number
          table_number?: string | null
          invited_date?: string | null
          gift_status?: 'pending' | 'received' | 'na' | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          vendor_id: string
          title: string
          category: 'venue' | 'photo_video' | 'music_dj' | 'sweets' | 'decorations' | 'invitations'
          description: string
          price_min: number | null
          price_max: number | null
          location: string
          contact_method: string | null
          tags: string[]
          specific_fields: Json | null
          images: string[]
          videos: string[]
          portfolio: string[]
          service_region: string | null
          available_days: string[]
          lead_time: number | null
          rating: number
          review_count: number
          view_count: number
          booking_count: number
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          title: string
          category: 'venue' | 'photo_video' | 'music_dj' | 'sweets' | 'decorations' | 'invitations'
          description: string
          price_min?: number | null
          price_max?: number | null
          location: string
          contact_method?: string | null
          tags?: string[]
          specific_fields?: Json | null
          images?: string[]
          videos?: string[]
          portfolio?: string[]
          service_region?: string | null
          available_days?: string[]
          lead_time?: number | null
          rating?: number
          review_count?: number
          view_count?: number
          booking_count?: number
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vendor_id?: string
          title?: string
          category?: 'venue' | 'photo_video' | 'music_dj' | 'sweets' | 'decorations' | 'invitations'
          description?: string
          price_min?: number | null
          price_max?: number | null
          location?: string
          contact_method?: string | null
          tags?: string[]
          specific_fields?: Json | null
          images?: string[]
          videos?: string[]
          portfolio?: string[]
          service_region?: string | null
          available_days?: string[]
          lead_time?: number | null
          rating?: number
          review_count?: number
          view_count?: number
          booking_count?: number
          is_active?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          service_id: string
          user_id: string
          rating: number
          comment: string
          images: string[]
          created_at: string
        }
        Insert: {
          id?: string
          service_id: string
          user_id: string
          rating: number
          comment: string
          images?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          user_id?: string
          rating?: number
          comment?: string
          images?: string[]
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          wedding_id: string
          service_id: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          event_date: string
          total_price: number | null
          deposit_paid: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          service_id: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          event_date: string
          total_price?: number | null
          deposit_paid?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          service_id?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          event_date?: string
          total_price?: number | null
          deposit_paid?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      seating_charts: {
        Row: {
          id: string
          wedding_id: string
          tables: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wedding_id: string
          tables?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wedding_id?: string
          tables?: Json
          created_at?: string
          updated_at?: string
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
      user_role: 'couple' | 'vendor' | 'admin'
      rsvp_status: 'yes' | 'no' | 'pending'
      gift_status: 'pending' | 'received' | 'na'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
      service_category: 'venue' | 'photo_video' | 'music_dj' | 'sweets' | 'decorations' | 'invitations'
    }
  }
}
