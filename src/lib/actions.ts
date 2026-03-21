"use server";

import { supabase } from "./supabase";
import { Stamp, Agent } from "./types";

// =============================================
// STAMP ACTIONS
// =============================================

export async function createStamp(
  data: Omit<Stamp, "id" | "created_at">
): Promise<{ data: Stamp | null; error: string | null }> {
  const { data: stamp, error } = await supabase
    .from("stamps")
    .insert([data])
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: stamp, error: null };
}

export async function getStamp(
  id: string
): Promise<{ data: Stamp | null; error: string | null }> {
  const { data, error } = await supabase
    .from("stamps")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getStamps(options?: {
  subject_type?: string;
  verification_level?: string;
  index_status?: string;
  limit?: number;
}): Promise<{ data: Stamp[]; error: string | null }> {
  let query = supabase
    .from("stamps")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(options?.limit || 50);

  if (options?.subject_type && options.subject_type !== "all") {
    query = query.eq("subject_type", options.subject_type);
  }
  if (options?.verification_level && options.verification_level !== "all") {
    query = query.eq("verification_level", options.verification_level);
  }
  if (options?.index_status && options.index_status !== "all") {
    query = query.eq("index_status", options.index_status);
  }

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getStampsByWallet(
  wallet: string
): Promise<{ data: Stamp[]; error: string | null }> {
  const { data, error } = await supabase
    .from("stamps")
    .select("*")
    .eq("creator_wallet", wallet)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getRelatedStamps(
  stampId: string,
  creatorWallet: string | undefined,
  stampType: string
): Promise<Stamp[]> {
  const { data } = await supabase
    .from("stamps")
    .select("*")
    .neq("id", stampId)
    .or(
      `creator_wallet.eq.${creatorWallet || "none"},stamp_type.eq.${stampType}`
    )
    .limit(3);

  return data || [];
}

// =============================================
// AGENT ACTIONS
// =============================================

export async function createAgent(
  data: Omit<Agent, "id" | "created_at">
): Promise<{ data: Agent | null; error: string | null }> {
  const { data: agent, error } = await supabase
    .from("agents")
    .insert([data])
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: agent, error: null };
}

export async function getAgents(): Promise<{ data: Agent[]; error: string | null }> {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function getAgent(
  id: string
): Promise<{ data: Agent | null; error: string | null }> {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function getStampsByAgent(
  agentId: string
): Promise<{ data: Stamp[]; error: string | null }> {
  const { data, error } = await supabase
    .from("stamps")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error: error.message };
  return { data: data || [], error: null };
}

export async function updateAgentLastIndexed(
  agentId: string
): Promise<void> {
  await supabase
    .from("agents")
    .update({ last_indexed: new Date().toISOString() })
    .eq("id", agentId);
}
