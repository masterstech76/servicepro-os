export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type JobStatus =
  | "unassigned"
  | "assigned"
  | "on_the_way"
  | "in_progress"
  | "completed"
  | "cancelled";

export type UserRole = "owner" | "technician";
export type PricingType = "flat" | "hourly";
export type InvoiceStatus = "draft" | "sent" | "paid" | "void";
export type PaymentKind = "deposit" | "remaining" | "tip" | "refund";
export type PaymentStatus = "pending" | "succeeded" | "failed";
export type LineItemKind = "labor" | "parts" | "fee" | "discount";
export type SmsTemplate =
  | "booked"
  | "on_the_way"
  | "completed"
  | "rescheduled"
  | "cancelled"
  | "payment_link"
  | "slot_lost";

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          slug: string;
          phone: string | null;
          email: string | null;
          timezone: string;
          currency: string;
          tax_rate_bps: number;
          tax_applies_to: "parts" | "parts_and_labor";
          deposit_pct: number;
          tip_presets: number[];
          slot_interval_minutes: number;
          buffer_minutes: number;
          min_notice_hours: number;
          max_advance_days: number;
          cancellation_window_hours: number;
          hold_minutes: number;
          review_url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["businesses"]["Row"]> & {
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Row"]>;
      };
      profiles: {
        Row: {
          id: string;
          business_id: string;
          role: UserRole;
          technician_id: string | null;
          full_name: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          business_id: string;
          role: UserRole;
          technician_id?: string | null;
          full_name?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
      service_areas: {
        Row: {
          id: string;
          business_id: string;
          zip: string;
          city: string | null;
          state: string | null;
          surcharge_cents: number;
          active: boolean;
        };
        Insert: {
          id?: string;
          business_id: string;
          zip: string;
          city?: string | null;
          state?: string | null;
          surcharge_cents?: number;
          active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["service_areas"]["Row"]>;
      };
      business_hours: {
        Row: {
          id: string;
          business_id: string;
          day_of_week: number;
          open_time: string | null;
          close_time: string | null;
          is_closed: boolean;
        };
        Insert: {
          id?: string;
          business_id: string;
          day_of_week: number;
          open_time?: string | null;
          close_time?: string | null;
          is_closed?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["business_hours"]["Row"]>;
      };
      business_closures: {
        Row: {
          id: string;
          business_id: string;
          closed_on: string;
          reason: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          closed_on: string;
          reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["business_closures"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          category: string | null;
          skill_tag: string;
          pricing_type: PricingType;
          price_cents: number;
          duration_minutes: number;
          min_billable_minutes: number;
          deposit_pct_override: number | null;
          active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          category?: string | null;
          skill_tag: string;
          pricing_type?: PricingType;
          price_cents: number;
          duration_minutes: number;
          min_billable_minutes?: number;
          deposit_pct_override?: number | null;
          active?: boolean;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      technicians: {
        Row: {
          id: string;
          business_id: string;
          user_id: string | null;
          name: string;
          phone: string;
          email: string | null;
          skills: string[];
          zip_codes: string[];
          commission_pct: number;
          color: string;
          home_lat: number | null;
          home_lng: number | null;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          user_id?: string | null;
          name: string;
          phone: string;
          email?: string | null;
          skills?: string[];
          zip_codes?: string[];
          commission_pct?: number;
          color?: string;
          home_lat?: number | null;
          home_lng?: number | null;
          active?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["technicians"]["Row"]>;
      };
      technician_hours: {
        Row: {
          id: string;
          business_id: string;
          technician_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          technician_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
        };
        Update: Partial<Database["public"]["Tables"]["technician_hours"]["Row"]>;
      };
      technician_time_off: {
        Row: {
          id: string;
          business_id: string;
          technician_id: string;
          starts_at: string;
          ends_at: string;
          reason: string | null;
        };
        Insert: {
          id?: string;
          business_id: string;
          technician_id: string;
          starts_at: string;
          ends_at: string;
          reason?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["technician_time_off"]["Row"]>;
      };
      customers: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          phone: string;
          email: string;
          stripe_customer_id: string | null;
          stripe_payment_method_id: string | null;
          card_brand: string | null;
          card_last4: string | null;
          sms_opt_out: boolean;
          sms_consent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          phone: string;
          email: string;
          stripe_customer_id?: string | null;
          stripe_payment_method_id?: string | null;
          card_brand?: string | null;
          card_last4?: string | null;
          sms_opt_out?: boolean;
          sms_consent_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["customers"]["Row"]>;
      };
      jobs: {
        Row: {
          id: string;
          job_number: number;
          business_id: string;
          customer_id: string;
          service_id: string;
          technician_id: string | null;
          status: JobStatus;
          scheduled_start: string;
          scheduled_end: string;
          address_line1: string;
          address_line2: string | null;
          city: string;
          state: string;
          zip: string;
          lat: number | null;
          lng: number | null;
          issue_text: string | null;
          issue_photos: string[];
          before_photos: string[];
          after_photos: string[];
          estimated_total_cents: number;
          deposit_cents: number;
          deposit_payment_intent_id: string | null;
          deposit_paid_at: string | null;
          total_cents: number | null;
          tip_cents: number;
          billable_minutes: number | null;
          notes_internal: string | null;
          tech_notes: string | null;
          cancel_reason: string | null;
          cancelled_at: string | null;
          on_the_way_at: string | null;
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["jobs"]["Row"]> & {
          business_id: string;
          customer_id: string;
          service_id: string;
          scheduled_start: string;
          scheduled_end: string;
          address_line1: string;
          city: string;
          state: string;
          zip: string;
          estimated_total_cents: number;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Row"]>;
      };
      invoices: {
        Row: {
          id: string;
          business_id: string;
          job_id: string;
          invoice_number: string;
          public_token: string;
          status: InvoiceStatus;
          labor_cents: number;
          parts_cents: number;
          fees_cents: number;
          discount_cents: number;
          subtotal_cents: number;
          tax_rate_bps: number;
          tax_cents: number;
          total_cents: number;
          deposit_paid_cents: number;
          tip_cents: number;
          amount_due_cents: number;
          stripe_checkout_session_id: string | null;
          sent_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["invoices"]["Row"]> & {
          business_id: string;
          job_id: string;
          invoice_number: string;
        };
        Update: Partial<Database["public"]["Tables"]["invoices"]["Row"]>;
      };
      invoice_line_items: {
        Row: {
          id: string;
          business_id: string;
          invoice_id: string;
          kind: LineItemKind;
          description: string;
          quantity: number;
          unit_price_cents: number;
          taxable: boolean;
          amount_cents: number;
          sort_order: number;
        };
        Insert: {
          id?: string;
          business_id: string;
          invoice_id: string;
          kind: LineItemKind;
          description: string;
          quantity?: number;
          unit_price_cents: number;
          taxable?: boolean;
          amount_cents: number;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["invoice_line_items"]["Row"]>;
      };
      payments: {
        Row: {
          id: string;
          business_id: string;
          job_id: string;
          invoice_id: string | null;
          kind: PaymentKind;
          method: "card" | "cash" | "check" | "other";
          status: PaymentStatus;
          amount_cents: number;
          stripe_payment_intent_id: string | null;
          stripe_charge_id: string | null;
          stripe_refund_id: string | null;
          recorded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          job_id: string;
          invoice_id?: string | null;
          kind: PaymentKind;
          method?: "card" | "cash" | "check" | "other";
          status?: PaymentStatus;
          amount_cents: number;
          stripe_payment_intent_id?: string | null;
          stripe_charge_id?: string | null;
          stripe_refund_id?: string | null;
          recorded_by?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Row"]>;
      };
      slot_holds: {
        Row: {
          id: string;
          business_id: string;
          service_id: string;
          zip: string;
          starts_at: string;
          ends_at: string;
          expires_at: string;
          ip_hash: string | null;
          payload: Json | null;
          stripe_payment_intent_id: string | null;
          converted_job_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          service_id: string;
          zip: string;
          starts_at: string;
          ends_at: string;
          expires_at: string;
          ip_hash?: string | null;
          payload?: Json | null;
          stripe_payment_intent_id?: string | null;
          converted_job_id?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["slot_holds"]["Row"]>;
      };
      job_events: {
        Row: {
          id: string;
          business_id: string;
          job_id: string;
          actor_id: string | null;
          actor_label: string | null;
          event_type: string;
          from_status: JobStatus | null;
          to_status: JobStatus | null;
          meta: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          job_id: string;
          actor_id?: string | null;
          actor_label?: string | null;
          event_type: string;
          from_status?: JobStatus | null;
          to_status?: JobStatus | null;
          meta?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["job_events"]["Row"]>;
      };
      sms_log: {
        Row: {
          id: string;
          business_id: string;
          job_id: string | null;
          customer_id: string | null;
          template: SmsTemplate;
          to_phone: string;
          body: string;
          provider: string;
          provider_sid: string | null;
          status: string | null;
          error: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          job_id?: string | null;
          customer_id?: string | null;
          template: SmsTemplate;
          to_phone: string;
          body: string;
          provider: string;
          provider_sid?: string | null;
          status?: string | null;
          error?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sms_log"]["Row"]>;
      };
      stripe_events: {
        Row: {
          id: string;
          type: string;
          processed_at: string;
        };
        Insert: {
          id: string;
          type: string;
          processed_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stripe_events"]["Row"]>;
      };
    };
    Functions: {
      slot_capacity: {
        Args: {
          p_business: string;
          p_service: string;
          p_zip: string;
          p_start: string;
        };
        Returns: number;
      };
      get_available_slots: {
        Args: {
          p_business: string;
          p_service: string;
          p_zip: string;
          p_from: string;
          p_to: string;
        };
        Returns: Array<{
          slot_start: string;
          slot_end: string;
          remaining: number;
        }>;
      };
      hold_slot: {
        Args: {
          p_business: string;
          p_service: string;
          p_zip: string;
          p_start: string;
          p_ip_hash: string;
          p_payload?: Json;
        };
        Returns: string;
      };
      convert_hold_to_job: {
        Args: {
          p_hold: string;
          p_payment_intent: string;
          p_deposit_cents: number;
        };
        Returns: string;
      };
      assign_job: {
        Args: {
          p_job: string;
          p_tech: string | null;
          p_actor: string;
          p_force?: boolean;
        };
        Returns: Database["public"]["Tables"]["jobs"]["Row"];
      };
      transition_job: {
        Args: {
          p_job: string;
          p_to: JobStatus;
          p_actor: string;
          p_actor_role: string;
          p_meta?: Json;
        };
        Returns: Database["public"]["Tables"]["jobs"]["Row"];
      };
      reschedule_job: {
        Args: {
          p_job: string;
          p_new_start: string;
          p_actor: string;
        };
        Returns: Database["public"]["Tables"]["jobs"]["Row"];
      };
      purge_expired_holds: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
  };
}
