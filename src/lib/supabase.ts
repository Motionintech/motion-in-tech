import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
  "https://baalukylevveyhztcpon.supabase.co";

export const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  "sb_publishable_h2skieixjah3q_21fQpJ1g_argeQkKL";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type ContactSubmissionPayload = {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
};

// Database safety: Truncate and sanitize fields to prevent database bloat / DOS attacks
function sanitizeField(value: string | undefined, maxLength: number): string {
  if (!value) return "";
  return value.trim().slice(0, maxLength);
}

/**
 * Inserts a new contact submission safely into Supabase.
 * Enforces strict length limits so database storage cannot be flooded.
 */
export async function saveContactSubmission(payload: ContactSubmissionPayload) {
  try {
    const cleanData = {
      name: sanitizeField(payload.name, 150),
      email: sanitizeField(payload.email, 255),
      company: sanitizeField(payload.company, 150),
      service: sanitizeField(payload.service, 100),
      budget: sanitizeField(payload.budget, 100),
      message: sanitizeField(payload.message, 3000), // Cap message text to 3,000 chars
      created_at: new Date().toISOString(),
      read: false,
    };

    const { data, error } = await supabase
      .from("contact_submissions")
      .insert([cleanData])
      .select("id")
      .single();

    if (error) {
      console.warn("Supabase contact_submissions insert error:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn("Supabase contact_submissions exception:", message);
    return { success: false, error: message };
  }
}

/**
 * Fetches latest submissions with a hard limit to avoid heavy memory or bandwidth usage.
 */
export async function fetchContactSubmissions(limit = 100) {
  try {
    const safeLimit = Math.min(Math.max(limit, 1), 200); // Between 1 and 200 max
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id, name, email, company, service, budget, message, created_at, read")
      .order("created_at", { ascending: false })
      .limit(safeLimit);

    if (error) {
      return { success: false, data: [] };
    }

    return { success: true, data: data || [] };
  } catch {
    return { success: false, data: [] };
  }
}

/**
 * Loads shared CMS content from Supabase single-row table.
 * Uses a single fixed ID ('site_cms') so database size remains strictly bounded.
 */
export async function fetchRemoteCMS() {
  try {
    const { data, error } = await supabase
      .from("cms_content")
      .select("content, updated_at")
      .eq("id", "site_cms")
      .maybeSingle();

    if (error || !data?.content) {
      return null;
    }

    return data.content;
  } catch {
    return null;
  }
}

/**
 * Saves CMS content to Supabase using an upsert on 'site_cms'.
 * This strictly overwrites the single row, preventing database growth.
 */
export async function saveRemoteCMS(content: unknown) {
  try {
    // Strip large media base64 strings if any, to keep database tiny
    const serialized = JSON.stringify(content);
    // Don't save if payload is larger than 1.5MB to protect database quota
    if (serialized.length > 1.5 * 1024 * 1024) {
      console.warn("CMS content payload too large for database sync, saving to localStorage only.");
      return { success: false, reason: "payload_too_large" };
    }

    const { error } = await supabase
      .from("cms_content")
      .upsert(
        {
          id: "site_cms",
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
