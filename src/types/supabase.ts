// src/types/supabase.ts
// Drop-in Supabase schema types — fixes all `never` errors from untyped clients
// UPDATED: BSF tables added (bsf_checklist_items, bsf_shipments,
//          bsf_production_log, bsf_milestone_status)

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      // ── Existing tables (unchanged) ──────────────────────────────────────
      bookings: {
        Row: {
          id: string
          booking_reference: string
          resource_id: string
          guest_id: string
          status: string
          check_in_date: string
          check_out_date: string
          adults: number
          children: number
          nights: number
          rate_per_night: number
          total_amount: number
          currency: string
          special_requests: string | null
          source: string
          cancelled_at: string | null
          cancellation_reason: string | null
          checked_in_at: string | null
          checked_out_at: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          updated_by: string | null
          notes: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      guests: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          country_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      resources: {
        Row: {
          id: string
          name: string
          is_active: boolean
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      booking_audit_logs: {
        Row: {
          id: string
          action: string
          booking_id: string | null
          resource_id: string | null
          actor_id: string | null
          ip_address: string
          user_agent: string
          metadata: Json
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          guest_id: string
          method: string
          status: string
          currency: string
          amount: number
          amount_captured: number
          amount_refunded: number
          fee_amount: number
          net_amount: number
          provider_payment_id: string | null
          method_details: Json
          metadata: Json
          failure_code: string | null
          failure_message: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      refunds: {
        Row: {
          id: string
          payment_id: string
          booking_id: string
          status: string
          amount: number
          currency: string
          reason: string
          notes: string | null
          provider_refund_id: string | null
          failure_code: string | null
          failure_message: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      payment_audit_logs: {
        Row: {
          id: string
          action: string
          payment_id: string | null
          refund_id: string | null
          booking_id: string | null
          actor_id: string | null
          before_state: Json | null
          after_state: Json | null
          metadata: Json
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      mpesa_transactions: {
        Row: {
          id: string
          booking_id: string
          phone_number: string
          amount: number
          merchant_request_id: string
          checkout_request_id: string
          status: string
          account_reference: string
          transaction_desc: string
          result_code: string | null
          result_desc: string | null
          mpesa_receipt_number: string | null
          initiated_at: string
          completed_at: string | null
          created_at: string
          updated_at: string
          [key: string]: unknown
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      mpesa_audit_logs: {
        Row: {
          id: string
          action: string
          transaction_id: string | null
          booking_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      rooms: {
        Row: {
          id: string
          name: string
          type: string
          floor: string
          capacity: number
          status: string
          rate_bo: number
          rate_bb: number
          rate_hb: number
          rate_fb: number
          amenities: string[]
          notes: string | null
          last_cleaned: string | null
          current_booking_id: string | null
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      maintenance_blocks: {
        Row: {
          id: string
          room_id: string
          room_name: string
          start_date: string
          end_date: string
          note: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          status: string
          priority: string
          source: string
          assigned_to: string | null
          reply: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      admin_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          role: string
          avatar_url: string | null
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }
      receipts: {
        Row: {
          id: string
          payment_id: string
          booking_id: string | null
          mpesa_receipt: string
          amount: number
          phone_number: string | null
          transaction_date: string | null
          checkout_request_id: string
          merchant_request_id: string
          issued_at: string
        }
        Insert: Record<string, unknown>
        Update: Record<string, unknown>
      }

      // ── BSF tables (NEW) ─────────────────────────────────────────────────
      bsf_checklist_items: {
        Row: {
          id:           string
          completed:    boolean
          completed_by: string | null
          completed_at: string | null
          updated_at:   string
        }
        Insert: {
          id:           string
          completed?:   boolean
          completed_by?: string | null
          completed_at?: string | null
          updated_at?:  string
        }
        Update: {
          completed?:    boolean
          completed_by?: string | null
          completed_at?: string | null
          updated_at?:   string
        }
      }

      bsf_shipments: {
        Row: {
          id:              string
          week_of:         string
          product_id:      string
          committed_kg:    number
          actual_kg:       number | null
          qc_passed:       boolean | null
          tracking_number: string | null
          carrier:         string | null
          notes:           string | null
          dispatched_at:   string | null
          created_by:      string | null
          created_at:      string
          updated_at:      string
        }
        Insert: {
          id?:             string
          week_of:         string
          product_id:      string
          committed_kg:    number
          actual_kg?:      number | null
          qc_passed?:      boolean | null
          tracking_number?: string | null
          carrier?:        string | null
          notes?:          string | null
          dispatched_at?:  string | null
          created_by?:     string | null
        }
        Update: Record<string, unknown>
      }

      bsf_production_log: {
        Row: {
          id:            string
          week_of:       string
          eggs_kg:       number
          neonates_kg:   number
          larvae_kg:     number
          mortality_pct: number | null
          feed_input_kg: number | null
          notes:         string | null
          logged_by:     string | null
          created_at:    string
        }
        Insert: {
          id?:            string
          week_of:        string
          eggs_kg:        number
          neonates_kg?:   number
          larvae_kg?:     number
          mortality_pct?: number | null
          feed_input_kg?: number | null
          notes?:         string | null
          logged_by?:     string | null
        }
        Update: Record<string, unknown>
      }

      bsf_milestone_status: {
        Row: {
          id:         string
          status:     string
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id:          string
          status?:     string
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          status?:     string
          updated_by?: string | null
          updated_at?: string
        }
      }
    }
    Views:     Record<string, never>
    Functions: Record<string, never>
    Enums:     Record<string, never>
  }
}