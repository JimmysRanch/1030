export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          user_id: string;
          org_id: string;
          full_name: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          org_id: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          org_id?: string;
          full_name?: string | null;
          role?: string;
          created_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          org_id: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          email: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          first_name: string;
          last_name: string;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          email?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {};
    Functions: {
      current_org_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_org_member: {
        Args: { target_org: string };
        Returns: boolean;
      };
    };
    Enums: {};
  };
}
