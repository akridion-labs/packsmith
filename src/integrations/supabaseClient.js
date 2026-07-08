import { createClient } from "@supabase/supabase-js";
import { buildCloudAnalyticsPayload, normalizeCloudAnalyticsRow } from "../analyticsData.js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signInWithProvider(provider = "google", redirectPath = "/app") {
  if (!supabase) throw new Error("Supabase is not configured yet.");
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}${redirectPath}`,
    },
  });
  if (error) throw error;
}

export async function signInWithGoogle() {
  return signInWithProvider("google");
}

export async function signInWithFacebook() {
  return signInWithProvider("facebook");
}

export async function signOut() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function saveWaitlistLead({ email, source, consentVersion = "2026-07-02" }) {
  if (!supabase) throw new Error("Supabase is not configured yet.");
  const { error } = await supabase.from("waitlist_leads").insert({
    email,
    source,
    consent_version: consentVersion,
    privacy_accepted_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function upsertProfile(user) {
  if (!supabase || !user) return;
  const profile = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
    avatar_url: user.user_metadata?.avatar_url || "",
  };
  const { error } = await supabase.from("profiles").upsert(profile, { onConflict: "id" });
  if (error) throw error;
}

export async function saveTemplatePack({ userId, pack, brief, notionPayload }) {
  if (!supabase) throw new Error("Supabase is not configured yet.");
  const { data, error } = await supabase
    .from("template_packs")
    .insert({
      user_id: userId,
      name: pack.name,
      preset_id: pack.presetId || pack.id,
      brief_json: brief,
      pack_json: pack,
      notion_payload_json: notionPayload,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listTemplatePacks(userId) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("template_packs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(12);
  if (error) throw error;
  return data || [];
}

export async function saveLaunchEvent({ userId, packId, channel, assetType, content }) {
  if (!supabase) throw new Error("Supabase is not configured yet.");
  const { error } = await supabase.from("launch_events").insert({
    user_id: userId,
    pack_id: packId || null,
    channel,
    asset_type: assetType,
    content_json: content,
  });
  if (error) throw error;
}

export async function saveAnalyticsEvent({ event, userId = null, anonymousId = "" }) {
  if (!supabase) return null;
  const payload = buildCloudAnalyticsPayload(event, { userId, anonymousId });
  const { data, error } = await supabase.from("analytics_events").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function listAnalyticsEvents({ userId, limit = 250 }) {
  if (!supabase || !userId) return [];
  const { data, error } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).map(normalizeCloudAnalyticsRow);
}

export async function publishNotionWorkspace({ parentPageId, notionPayload }) {
  if (!supabase) throw new Error("Supabase is not configured yet.");
  const { data, error } = await supabase.functions.invoke("notion-publish", {
    body: {
      parentPageId,
      workspacePayload: notionPayload,
    },
  });
  if (error) throw error;
  return data;
}
