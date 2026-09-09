export type WeddingMemberRole = 'owner' | 'partner' | 'family' | 'viewer'
export type WeddingMemberStatus = 'pending' | 'accepted'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'cancelled'
export type RsvpStatus = 'pending' | 'confirmed' | 'declined'
export type InvitationStatus = 'not_sent' | 'sent' | 'delivered'
export type BudgetPaymentStatus = 'not_paid' | 'partially_paid' | 'fully_paid'
export type PaymentMethod = 'cash' | 'upi' | 'bank_transfer' | 'card' | 'other'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          full_name?: string | null
          avatar_url?: string | null
        }
        Relationships: []
      }
      weddings: {
        Row: {
          id: string
          bride_name: string
          groom_name: string
          wedding_date: string
          engagement_date: string | null
          reception_date: string | null
          wedding_venue: string | null
          reception_venue: string | null
          city: string | null
          expected_guest_count: number | null
          estimated_budget: number | null
          currency: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          bride_name: string
          groom_name: string
          wedding_date: string
          engagement_date?: string | null
          reception_date?: string | null
          wedding_venue?: string | null
          reception_venue?: string | null
          city?: string | null
          expected_guest_count?: number | null
          estimated_budget?: number | null
          currency?: string
          created_by: string
        }
        Update: {
          bride_name?: string
          groom_name?: string
          wedding_date?: string
          engagement_date?: string | null
          reception_date?: string | null
          wedding_venue?: string | null
          reception_venue?: string | null
          city?: string | null
          expected_guest_count?: number | null
          estimated_budget?: number | null
          currency?: string
        }
        Relationships: []
      }
      wedding_members: {
        Row: {
          id: string
          wedding_id: string
          user_id: string | null
          role: WeddingMemberRole
          invited_email: string | null
          status: WeddingMemberStatus
          created_at: string
        }
        Insert: {
          wedding_id: string
          user_id?: string | null
          role?: WeddingMemberRole
          invited_email?: string | null
          status?: WeddingMemberStatus
        }
        Update: {
          role?: WeddingMemberRole
          status?: WeddingMemberStatus
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          wedding_id: string
          name: string
          description: string | null
          category: string
          assigned_to: string | null
          due_date: string | null
          priority: TaskPriority
          status: TaskStatus
          estimated_cost: number | null
          actual_cost: number | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          wedding_id: string
          name: string
          description?: string | null
          category?: string
          assigned_to?: string | null
          due_date?: string | null
          priority?: TaskPriority
          status?: TaskStatus
          estimated_cost?: number | null
          actual_cost?: number | null
          notes?: string | null
          created_by: string
        }
        Update: {
          name?: string
          description?: string | null
          category?: string
          assigned_to?: string | null
          due_date?: string | null
          priority?: TaskPriority
          status?: TaskStatus
          estimated_cost?: number | null
          actual_cost?: number | null
          notes?: string | null
        }
        Relationships: []
      }
      guest_groups: {
        Row: {
          id: string
          wedding_id: string
          name: string
          notes: string | null
          created_at: string
        }
        Insert: {
          wedding_id: string
          name: string
          notes?: string | null
        }
        Update: {
          name?: string
          notes?: string | null
        }
        Relationships: []
      }
      guests: {
        Row: {
          id: string
          wedding_id: string
          guest_group_id: string | null
          name: string
          phone: string | null
          email: string | null
          total_guests: number
          child_count: number
          rsvp_status: RsvpStatus
          food_preference: string | null
          accommodation_required: boolean
          transportation_required: boolean
          invitation_status: InvitationStatus
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          wedding_id: string
          guest_group_id?: string | null
          name: string
          phone?: string | null
          email?: string | null
          total_guests?: number
          child_count?: number
          rsvp_status?: RsvpStatus
          food_preference?: string | null
          accommodation_required?: boolean
          transportation_required?: boolean
          invitation_status?: InvitationStatus
          notes?: string | null
          created_by: string
        }
        Update: {
          guest_group_id?: string | null
          name?: string
          phone?: string | null
          email?: string | null
          total_guests?: number
          child_count?: number
          rsvp_status?: RsvpStatus
          food_preference?: string | null
          accommodation_required?: boolean
          transportation_required?: boolean
          invitation_status?: InvitationStatus
          notes?: string | null
        }
        Relationships: []
      }
      budget_categories: {
        Row: {
          id: string
          wedding_id: string
          name: string
          created_at: string
        }
        Insert: {
          wedding_id: string
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      budget_items: {
        Row: {
          id: string
          wedding_id: string
          category_id: string | null
          description: string
          vendor: string | null
          planned_amount: number
          actual_amount: number | null
          amount_paid: number
          due_date: string | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          wedding_id: string
          category_id?: string | null
          description: string
          vendor?: string | null
          planned_amount?: number
          actual_amount?: number | null
          amount_paid?: number
          due_date?: string | null
          notes?: string | null
          created_by: string
        }
        Update: {
          category_id?: string | null
          description?: string
          vendor?: string | null
          planned_amount?: number
          actual_amount?: number | null
          amount_paid?: number
          due_date?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          wedding_id: string
          vendor: string | null
          description: string
          amount: number
          payment_date: string | null
          payment_method: PaymentMethod | null
          payment_status: BudgetPaymentStatus
          due_date: string | null
          reference_id: string | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          wedding_id: string
          vendor?: string | null
          description: string
          amount: number
          payment_date?: string | null
          payment_method?: PaymentMethod | null
          payment_status?: BudgetPaymentStatus
          due_date?: string | null
          reference_id?: string | null
          notes?: string | null
          created_by: string
        }
        Update: {
          vendor?: string | null
          description?: string
          amount?: number
          payment_date?: string | null
          payment_method?: PaymentMethod | null
          payment_status?: BudgetPaymentStatus
          due_date?: string | null
          reference_id?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          id: string
          wedding_id: string
          name: string
          category: string
          contact_person: string | null
          phone: string | null
          email: string | null
          website: string | null
          address: string | null
          quoted_amount: number | null
          final_amount: number | null
          advance_paid: number
          rating: number | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          wedding_id: string
          name: string
          category?: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          quoted_amount?: number | null
          final_amount?: number | null
          advance_paid?: number
          rating?: number | null
          notes?: string | null
          created_by: string
        }
        Update: {
          name?: string
          category?: string
          contact_person?: string | null
          phone?: string | null
          email?: string | null
          website?: string | null
          address?: string | null
          quoted_amount?: number | null
          final_amount?: number | null
          advance_paid?: number
          rating?: number | null
          notes?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          wedding_id: string
          name: string
          event_date: string
          start_time: string | null
          end_time: string | null
          venue: string | null
          description: string | null
          responsible_person: string | null
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          wedding_id: string
          name: string
          event_date: string
          start_time?: string | null
          end_time?: string | null
          venue?: string | null
          description?: string | null
          responsible_person?: string | null
          notes?: string | null
          created_by: string
        }
        Update: {
          name?: string
          event_date?: string
          start_time?: string | null
          end_time?: string | null
          venue?: string | null
          description?: string | null
          responsible_person?: string | null
          notes?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          id: string
          wedding_id: string
          vendor_id: string | null
          name: string
          category: string
          storage_path: string
          file_size: number
          mime_type: string
          notes: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          wedding_id: string
          vendor_id?: string | null
          name: string
          category?: string
          storage_path: string
          file_size: number
          mime_type: string
          notes?: string | null
          created_by: string
        }
        Update: {
          vendor_id?: string | null
          name?: string
          category?: string
          notes?: string | null
        }
        Relationships: []
      }
      inspiration_images: {
        Row: {
          id: string
          wedding_id: string
          category: string
          storage_path: string
          file_size: number
          mime_type: string
          notes: string | null
          is_favorite: boolean
          created_by: string
          created_at: string
        }
        Insert: {
          wedding_id: string
          category?: string
          storage_path: string
          file_size: number
          mime_type: string
          notes?: string | null
          is_favorite?: boolean
          created_by: string
        }
        Update: {
          category?: string
          notes?: string | null
          is_favorite?: boolean
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      create_wedding: {
        Args: {
          p_bride_name: string
          p_groom_name: string
          p_wedding_date: string
          p_engagement_date: string | null
          p_reception_date: string | null
          p_wedding_venue: string | null
          p_reception_venue: string | null
          p_city: string | null
          p_expected_guest_count: number | null
          p_estimated_budget: number | null
          p_currency: string
        }
        Returns: Database['public']['Tables']['weddings']['Row']
      }
    }
  }
}
