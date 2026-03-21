import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASESCAN_API = "https://api.basescan.org/api";
const BASESCAN_KEY = process.env.BASESCAN_API_KEY!;

// ETH price approximation for volume calc (updated periodically)
const ETH_PRICE_USD = 2000;

interface BasescanTx {
  hash: string;
  from: string;
  to: string;
  value: string; // in wei
  timeStamp: string;
  isError: string;
}

async function fetchWalletTxs(wallet: string): Promise<BasescanTx[]> {
  const since = Math.floor(Date.now() / 1000) - 86400; // last 24h
  const url = new URL(BASESCAN_API);
  url.searchParams.set("module", "account");
  url.searchParams.set("action", "txlist");
  url.searchParams.set("address", wallet);
  url.searchParams.set("startblock", "0");
  url.searchParams.set("endblock", "99999999");
  url.searchParams.set("sort", "desc");
  url.searchParams.set("apikey", BASESCAN_KEY);

  const res = await fetch(url.toString(), { next: { revalidate: 0 } });
  const json = await res.json();

  if (json.status !== "1" || !Array.isArray(json.result)) return [];

  // Filter to last 24h and non-error txs
  return json.result.filter(
    (tx: BasescanTx) =>
      parseInt(tx.timeStamp) >= since && tx.isError === "0"
  );
}

function weiToUsd(weiStr: string): number {
  const eth = parseInt(weiStr) / 1e18;
  return parseFloat((eth * ETH_PRICE_USD).toFixed(2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId } = body as { agentId: string };

    if (!agentId) {
      return Response.json({ error: "agentId required" }, { status: 400 });
    }

    // Get agent from DB
    const { data: agent, error: agentErr } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (agentErr || !agent) {
      return Response.json({ error: "Agent not found" }, { status: 404 });
    }

    // Fetch transactions from Basescan
    const txs = await fetchWalletTxs(agent.wallet);

    if (txs.length === 0) {
      return Response.json({ indexed: 0, message: "No new transactions in last 24h" });
    }

    // Aggregate
    const totalVolume = txs.reduce((sum, tx) => sum + weiToUsd(tx.value), 0);
    const txCount = txs.length;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const sourceId = `${agentId}_${today}`;

    // Check for existing stamp with same source_id (dedup)
    const { data: existing } = await supabase
      .from("stamps")
      .select("id")
      .eq("source_id", sourceId)
      .single();

    if (existing) {
      return Response.json({ indexed: 0, message: "Already indexed for today" });
    }

    // Build stamp description
    const volumeStr =
      totalVolume > 0
        ? ` · Volume: $${totalVolume.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
        : "";
    const description = `Executed ${txCount} transaction${txCount !== 1 ? "s" : ""} on Base${volumeStr}`;

    // Insert indexed stamp
    const stampData = {
      creator_name: agent.name,
      creator_wallet: agent.wallet,
      subject_type: "agent" as const,
      agent_platform: agent.platform || "Custom",
      stamp_type: "trade" as const,
      description,
      verification_level: "onchain" as const,
      index_status: "indexed" as const,
      source_type: "onchain" as const,
      source_id: sourceId,
      indexed_at: new Date().toISOString(),
      agent_id: agentId,
      ...(totalVolume > 0 && { metrics_volume: parseFloat(totalVolume.toFixed(2)) }),
      score: Math.min(100, Math.round(txCount * 3 + (totalVolume > 0 ? 20 : 0))),
    };

    const { error: insertErr } = await supabase
      .from("stamps")
      .insert([stampData]);

    if (insertErr) {
      return Response.json({ error: insertErr.message }, { status: 500 });
    }

    // Update agent last_indexed
    await supabase
      .from("agents")
      .update({ last_indexed: new Date().toISOString() })
      .eq("id", agentId);

    return Response.json({
      indexed: 1,
      txCount,
      volumeUsd: totalVolume,
      sourceId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}

// GET: index all registered agents (for cron use)
export async function GET(request: NextRequest) {
  // Simple secret check to prevent abuse
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== "stampx-cron-2024") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: agents } = await supabase.from("agents").select("*");
  if (!agents || agents.length === 0) {
    return Response.json({ indexed: 0, agents: 0 });
  }

  const results = [];
  for (const agent of agents) {
    try {
      const txs = await fetchWalletTxs(agent.wallet);
      if (txs.length === 0) {
        results.push({ agentId: agent.id, indexed: 0 });
        continue;
      }

      const totalVolume = txs.reduce((sum: number, tx: BasescanTx) => sum + weiToUsd(tx.value), 0);
      const txCount = txs.length;
      const today = new Date().toISOString().split("T")[0];
      const sourceId = `${agent.id}_${today}`;

      const { data: existing } = await supabase
        .from("stamps")
        .select("id")
        .eq("source_id", sourceId)
        .single();

      if (existing) {
        results.push({ agentId: agent.id, indexed: 0, reason: "duplicate" });
        continue;
      }

      const volumeStr =
        totalVolume > 0
          ? ` · Volume: $${totalVolume.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
          : "";
      const description = `Executed ${txCount} transaction${txCount !== 1 ? "s" : ""} on Base${volumeStr}`;

      await supabase.from("stamps").insert([{
        creator_name: agent.name,
        creator_wallet: agent.wallet,
        subject_type: "agent",
        agent_platform: agent.platform || "Custom",
        stamp_type: "trade",
        description,
        verification_level: "onchain",
        index_status: "indexed",
        source_type: "onchain",
        source_id: sourceId,
        indexed_at: new Date().toISOString(),
        agent_id: agent.id,
        ...(totalVolume > 0 && { metrics_volume: parseFloat(totalVolume.toFixed(2)) }),
        score: Math.min(100, Math.round(txCount * 3 + (totalVolume > 0 ? 20 : 0))),
      }]);

      await supabase
        .from("agents")
        .update({ last_indexed: new Date().toISOString() })
        .eq("id", agent.id);

      results.push({ agentId: agent.id, indexed: 1, txCount });
    } catch {
      results.push({ agentId: agent.id, error: "failed" });
    }
  }

  return Response.json({ results, agentsProcessed: agents.length });
}
