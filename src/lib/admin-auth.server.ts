import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";
import { getRequestHeader } from "@tanstack/react-start/server";

export async function requireAdmin(): Promise<User> {
  const authorization = getRequestHeader("authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) throw new Error("Sign in to continue.");

  const url = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase server configuration is missing.");

  const supabase = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) throw new Error("Your session is invalid or expired. Sign in again.");
  if (data.user.app_metadata?.role !== "admin") {
    throw new Error("This account is not authorized to use the admin area.");
  }

  return data.user;
}
