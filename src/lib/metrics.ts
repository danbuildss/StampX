"use server";

import { supabase } from "./supabase";
import { CTOMetrics } from "./types";

export async function computeCTOMetrics(): Promise<CTOMetrics> {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const ago24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const ago48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const [
    { count: total_stamps },
    { count: stamps_today },
    { count: human_stamps_today },
    { count: agent_stamps_today },
    { count: pending_review },
    { count: live_stamps },
    { count: total_agents },
    { count: active_agents_24h },
    { count: approved_total },
    { count: rejected_total },
    { data: all_agents },
  ] = await Promise.all([
    supabase.from("stamps").select("*", { count: "exact", head: true }),
    supabase.from("stamps").select("*", { count: "exact", head: true }).gte("created_at", todayStart.toISOString()),
    supabase.from("stamps").select("*", { count: "exact", head: true }).eq("subject_type", "human").gte("created_at", todayStart.toISOString()),
    supabase.from("stamps").select("*", { count: "exact", head: true }).eq("subject_type", "agent").gte("created_at", todayStart.toISOString()),
    supabase.from("stamps").select("*", { count: "exact", head: true }).eq("index_status", "indexed"),
    supabase.from("stamps").select("*", { count: "exact", head: true }).eq("index_status", "claimed"),
    supabase.from("agents").select("*", { count: "exact", head: true }),
    supabase.from("agents").select("*", { count: "exact", head: true }).gte("last_indexed", ago24h.toISOString()),
    supabase.from("review_actions").select("*", { count: "exact", head: true }).eq("action", "approved"),
    supabase.from("review_actions").select("*", { count: "exact", head: true }).eq("action", "rejected"),
    supabase.from("agents").select("id, last_indexed"),
  ]);

  const inactive_agents_48h = (all_agents || []).filter((a) => {
    if (!a.last_indexed) return true;
    return new Date(a.last_indexed) < ago48h;
  }).length;

  const approved = approved_total || 0;
  const rejected = rejected_total || 0;
  const total_reviewed = approved + rejected;
  const approval_rate =
    total_reviewed > 0 ? Math.round((approved / total_reviewed) * 100) : 0;

  return {
    total_stamps: total_stamps || 0,
    stamps_today: stamps_today || 0,
    human_stamps_today: human_stamps_today || 0,
    agent_stamps_today: agent_stamps_today || 0,
    pending_review: pending_review || 0,
    live_stamps: live_stamps || 0,
    approved_total: approved,
    rejected_total: rejected,
    approval_rate,
    total_agents: total_agents || 0,
    active_agents_24h: active_agents_24h || 0,
    inactive_agents_48h,
  };
}
