import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { JobApplication } from "./jobs.types";

type Database = {
  public: {
    Tables: {
      job_applications: {
        Row: JobApplication;
        Insert: Omit<JobApplication, "id" | "created_at" | "updated_at"> &
          Partial<Pick<JobApplication, "id" | "created_at" | "updated_at">>;
        Update: Partial<JobApplication>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let client: SupabaseClient<Database> | undefined;

export function isSupabaseConfigured() {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function getSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }

  client ??= createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: true,
      persistSession: true,
    },
  });

  return client;
}

export function isAdminUser(user: { app_metadata?: Record<string, unknown> }) {
  return user.app_metadata?.role === "admin";
}
