import { computeCTOMetrics } from "@/lib/metrics";
import { runRules } from "@/lib/rules";
import { createIncident, saveCTOReport } from "@/lib/actions";
import { CTOMetrics } from "@/lib/types";

function buildTemplateReport(metrics: CTOMetrics, recommendations: string[]): string {
  const humanPct =
    metrics.stamps_today > 0
      ? Math.round((metrics.human_stamps_today / metrics.stamps_today) * 100)
      : 0;

  const lines = [
    `StampX CTO Report — Daily`,
    ``,
    `PRODUCT`,
    `• Total live stamps: ${metrics.live_stamps}`,
    `• Stamps today: ${metrics.stamps_today}`,
    `• Human stamps today: ${metrics.human_stamps_today} (${humanPct}%)`,
    `• Agent indexed stamps today: ${metrics.agent_stamps_today}`,
    `• Pending review: ${metrics.pending_review}`,
    ``,
    `REVIEW`,
    `• Approved (all time): ${metrics.approved_total}`,
    `• Rejected (all time): ${metrics.rejected_total}`,
    `• Approval rate: ${metrics.approval_rate}%`,
    ``,
    `AGENTS`,
    `• Total registered: ${metrics.total_agents}`,
    `• Active in last 24h: ${metrics.active_agents_24h}`,
    `• Inactive >48h: ${metrics.inactive_agents_48h}`,
  ];

  if (recommendations.length > 0) {
    lines.push(``, `RECOMMENDED ACTIONS`);
    recommendations.forEach((r) => lines.push(`• ${r}`));
  }

  return lines.join("\n");
}

async function generateAISummary(
  metrics: CTOMetrics,
  recommendations: string[]
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const prompt = `You are the CTO Agent for StampX, a proof-of-work network for humans and AI agents.

Write a concise daily CTO report based on these metrics:

${buildTemplateReport(metrics, recommendations)}

Write in a clear, direct operator voice. Lead with the most important insight. Keep it under 200 words. Format with short paragraphs, no markdown headers.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.content?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

export async function POST() {
  try {
    // 1. Compute metrics
    const metrics = await computeCTOMetrics();

    // 2. Run rule engine
    const ruleResults = runRules(metrics);

    // 3. Create incidents for each new rule violation
    await Promise.all(
      ruleResults.map((r) =>
        createIncident({
          type: r.type,
          severity: r.severity,
          title: r.title,
          description: r.description,
        })
      )
    );

    // 4. Build recommendations list
    const recommendations = ruleResults.map((r) => r.title);

    // 5. Generate summary (AI if key available, else template)
    const aiSummary = await generateAISummary(metrics, recommendations);
    const summary = aiSummary ?? buildTemplateReport(metrics, recommendations);

    // 6. Save report
    const { data: report, error } = await saveCTOReport({
      report_type: "daily",
      summary,
      metrics_json: metrics,
      recommendations_json: recommendations,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ report, incidents_created: ruleResults.length });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
