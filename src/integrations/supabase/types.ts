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
      bonus_records: {
        Row: {
          amount: number
          bonus_type: string
          created_at: string
          description: string | null
          driver_name: string
          goal_id: string | null
          id: string
          paid_at: string | null
          status: string
        }
        Insert: {
          amount: number
          bonus_type: string
          created_at?: string
          description?: string | null
          driver_name: string
          goal_id?: string | null
          id?: string
          paid_at?: string | null
          status?: string
        }
        Update: {
          amount?: number
          bonus_type?: string
          created_at?: string
          description?: string | null
          driver_name?: string
          goal_id?: string | null
          id?: string
          paid_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "bonus_records_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "driver_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_settings: {
        Row: {
          commission_percentage: number
          created_at: string
          id: string
          is_active: boolean
          min_commission: number
          updated_at: string
        }
        Insert: {
          commission_percentage?: number
          created_at?: string
          id?: string
          is_active?: boolean
          min_commission?: number
          updated_at?: string
        }
        Update: {
          commission_percentage?: number
          created_at?: string
          id?: string
          is_active?: boolean
          min_commission?: number
          updated_at?: string
        }
        Relationships: []
      }
      driver_goals: {
        Row: {
          bonus_amount: number | null
          bonus_percentage: number | null
          created_at: string
          current_amount: number
          current_trips: number
          driver_name: string
          end_date: string
          goal_type: string
          id: string
          start_date: string
          status: string
          target_amount: number
          target_trips: number | null
          updated_at: string
        }
        Insert: {
          bonus_amount?: number | null
          bonus_percentage?: number | null
          created_at?: string
          current_amount?: number
          current_trips?: number
          driver_name: string
          end_date: string
          goal_type?: string
          id?: string
          start_date: string
          status?: string
          target_amount: number
          target_trips?: number | null
          updated_at?: string
        }
        Update: {
          bonus_amount?: number | null
          bonus_percentage?: number | null
          created_at?: string
          current_amount?: number
          current_trips?: number
          driver_name?: string
          end_date?: string
          goal_type?: string
          id?: string
          start_date?: string
          status?: string
          target_amount?: number
          target_trips?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      maintenance_schedules: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string
          driver_name: string
          id: string
          notes: string | null
          priority: string
          reminder_sent: boolean | null
          scheduled_date: string
          service_type: string
          status: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          driver_name: string
          id?: string
          notes?: string | null
          priority?: string
          reminder_sent?: boolean | null
          scheduled_date: string
          service_type: string
          status?: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string
          driver_name?: string
          id?: string
          notes?: string | null
          priority?: string
          reminder_sent?: boolean | null
          scheduled_date?: string
          service_type?: string
          status?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          related_id: string | null
          related_to: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          related_id?: string | null
          related_to?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          related_id?: string | null
          related_to?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      scheduled_trips: {
        Row: {
          created_at: string
          destination_address: string
          destination_lat: number | null
          destination_lng: number | null
          driver_id: string | null
          driver_name: string | null
          estimated_price: number | null
          id: string
          is_shared: boolean
          notes: string | null
          origin_address: string
          origin_lat: number | null
          origin_lng: number | null
          passengers_count: number
          phone: string | null
          scheduled_date: string
          status: string
          updated_at: string
          user_name: string
        }
        Insert: {
          created_at?: string
          destination_address: string
          destination_lat?: number | null
          destination_lng?: number | null
          driver_id?: string | null
          driver_name?: string | null
          estimated_price?: number | null
          id?: string
          is_shared?: boolean
          notes?: string | null
          origin_address: string
          origin_lat?: number | null
          origin_lng?: number | null
          passengers_count?: number
          phone?: string | null
          scheduled_date: string
          status?: string
          updated_at?: string
          user_name: string
        }
        Update: {
          created_at?: string
          destination_address?: string
          destination_lat?: number | null
          destination_lng?: number | null
          driver_id?: string | null
          driver_name?: string | null
          estimated_price?: number | null
          id?: string
          is_shared?: boolean
          notes?: string | null
          origin_address?: string
          origin_lat?: number | null
          origin_lng?: number | null
          passengers_count?: number
          phone?: string | null
          scheduled_date?: string
          status?: string
          updated_at?: string
          user_name?: string
        }
        Relationships: []
      }
      shared_trip_passengers: {
        Row: {
          created_at: string
          id: string
          passenger_name: string
          phone: string | null
          pickup_address: string
          pickup_lat: number | null
          pickup_lng: number | null
          status: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          passenger_name: string
          phone?: string | null
          pickup_address: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          status?: string
          trip_id: string
        }
        Update: {
          created_at?: string
          id?: string
          passenger_name?: string
          phone?: string | null
          pickup_address?: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          status?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_trip_passengers_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "scheduled_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          email: string | null
          id: string
          phone: string | null
          priority: string
          related_trip_id: string | null
          resolution: string | null
          resolved_at: string | null
          status: string
          subject: string
          ticket_number: string
          updated_at: string
          user_name: string
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string
          description: string
          email?: string | null
          id?: string
          phone?: string | null
          priority?: string
          related_trip_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          ticket_number: string
          updated_at?: string
          user_name: string
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          email?: string | null
          id?: string
          phone?: string | null
          priority?: string
          related_trip_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          ticket_number?: string
          updated_at?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_related_trip_id_fkey"
            columns: ["related_trip_id"]
            isOneToOne: false
            referencedRelation: "scheduled_trips"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sender_name: string
          sender_type: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sender_name?: string
          sender_type?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_payments: {
        Row: {
          amount: number
          commission_amount: number
          created_at: string
          currency: string
          description: string | null
          driver_amount: number
          driver_name: string | null
          id: string
          payment_method: string | null
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          trip_id: string | null
          updated_at: string
          user_email: string | null
          user_name: string
        }
        Insert: {
          amount: number
          commission_amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          driver_amount?: number
          driver_name?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          trip_id?: string | null
          updated_at?: string
          user_email?: string | null
          user_name: string
        }
        Update: {
          amount?: number
          commission_amount?: number
          created_at?: string
          currency?: string
          description?: string | null
          driver_amount?: number
          driver_name?: string | null
          id?: string
          payment_method?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          trip_id?: string | null
          updated_at?: string
          user_email?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_payments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "scheduled_trips"
            referencedColumns: ["id"]
          },
        ]
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
