import Anthropic from "@anthropic-ai/sdk";
import { SOURCES } from "../src/data/sources.js";
import { CHANGES, EMPLOYER_DUTIES, TIMELINE } from "../src/data/regulation.js";

const client = new Anthropic();

// The advisor may only use facts from this block. Built from the same data files
// the site renders, so the model and the page can never disagree.
const FACTS = [
  "KEY DATES",
  ...TIMELINE.map((t) => `- ${t.date}: ${t.title}. ${t.text}`),
  "",
  "WHAT THE MACHINERY REGULATION (EU) 2023/1230 CHANGES FOR AI ROBOTS",
  ...CHANGES.map((c) => `- ${c.title} (${c.cite}): ${c.text}`),
  "",
  "EMPLOYER DUTIES",
  ...EMPLOYER_DUTIES.map((d) => `- ${d.title} (${d.cite}): ${d.text}`),
  "",
  "SOURCES",
  ...Object.values(SOURCES).map((s) => `- ${s.short}: ${s.url}`),
].join("\n");

const SYSTEM = `You are the Robot-Ready advisor. You help operations leaders at European warehouses prepare to deploy AI picking robots.

You receive the user's readiness self-assessment results and a short description of their operation. Write a concise readiness memo in Markdown with these sections:
## Where you stand
## Top three risks to your go-live
## What to ask your robot supplier
## Your first 30 days

Rules:
- Use only the facts in the FACTS block and what the user told you. Never invent statistics, prices, benchmarks, company names, or deadlines.
- When you mention a legal requirement, cite the provision exactly as written in FACTS (for example "Annex III 1.2.1").
- If the user's description leaves something unclear, say what they should find out rather than guessing.
- Plain, direct English. Short paragraphs and bullet points. No more than about 450 words.
- End with one line: "This memo is guidance, not legal advice."

FACTS
${FACTS}`;

const MAX_CONTEXT = 2000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Use POST." });
    return;
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(503).json({ error: "The AI advisor isn't configured on this deployment yet." });
    return;
  }

  const { context = "", results } = req.body || {};
  if (!results || !Array.isArray(results.pillars)) {
    res.status(400).json({ error: "Complete the assessment first." });
    return;
  }

  const summary = [
    `Overall readiness: ${results.overall}% (${results.band})`,
    ...results.pillars.map((p) => `- ${p.name}: ${p.pct === null ? "not scored" : p.pct + "%"}`),
    "",
    "Open gaps (highest priority first):",
    ...(results.actions || []).slice(0, 12).map((a) => `- [${a.pillar}] ${a.q} → ${a.answer}`),
    "",
    `Operation description from the user: ${String(context).slice(0, MAX_CONTEXT) || "(none given)"}`,
  ].join("\n");

  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5",
      max_tokens: 8000,
      thinking: { type: "adaptive" },
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      messages: [{ role: "user", content: summary }],
    });

    if (response.stop_reason === "refusal") {
      res.status(422).json({ error: "The advisor couldn't answer this request. Try rephrasing your description." });
      return;
    }
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();
    res.status(200).json({ memo: text });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: "The advisor is busy. Please try again in a minute." });
    } else if (err instanceof Anthropic.APIError) {
      console.error("Anthropic API error", err.status, err.message);
      res.status(502).json({ error: "The advisor is unavailable right now." });
    } else {
      console.error(err);
      res.status(500).json({ error: "Something went wrong." });
    }
  }
}
