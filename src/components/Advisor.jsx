import { useState } from "react";
import { Section, useLocal } from "./common.jsx";
import { resultsForAdvisor } from "./Assessment.jsx";

// Minimal Markdown → React: headings, bullets, numbered lists, bold. The model's
// text is never injected as HTML.
function Memo({ text }) {
  const inline = (s, key) =>
    s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? <strong key={`${key}-${i}`}>{part.slice(2, -2)}</strong> : part
    );
  const out = [];
  let list = null;
  const flush = () => {
    if (list) out.push(list.ordered ? <ol key={out.length}>{list.items}</ol> : <ul key={out.length}>{list.items}</ul>);
    list = null;
  };
  text.split("\n").forEach((raw, i) => {
    const line = raw.trim();
    const bullet = line.match(/^[-*]\s+(.*)/);
    const numbered = line.match(/^\d+[.)]\s+(.*)/);
    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push(<li key={i}>{inline((bullet || numbered)[1], i)}</li>);
      return;
    }
    flush();
    if (!line) return;
    if (line.startsWith("### ")) out.push(<h4 key={i}>{inline(line.slice(4), i)}</h4>);
    else if (line.startsWith("## ")) out.push(<h3 key={i}>{inline(line.slice(3), i)}</h3>);
    else if (line.startsWith("# ")) out.push(<h3 key={i}>{inline(line.slice(2), i)}</h3>);
    else out.push(<p key={i}>{inline(line, i)}</p>);
  });
  flush();
  return <div className="memo">{out}</div>;
}

export function Advisor({ result, answers }) {
  const [context, setContext] = useLocal("rr-context", "");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const ready = result.overall !== null;

  const ask = async () => {
    setLoading(true);
    setError("");
    setMemo("");
    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, results: resultsForAdvisor(result, answers) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "The advisor is unavailable right now.");
      setMemo(data.memo);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section
      id="advisor"
      eyebrow="Step 6 · AI readiness memo"
      title="Turn your answers into a one-page memo"
      lede="Claude reads your assessment and a short description of your operation, then drafts a memo for your leadership team. It is instructed to use only the sourced facts on this page — no invented numbers."
    >
      <div className="card">
        <label className="field">
          <span>Describe the operation (optional)</span>
          <textarea
            rows={5}
            maxLength={2000}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Fashion e-commerce fulfilment site in NRW, two shifts, pilot planned at the returns-to-stock station, works council in place, supplier not yet chosen."
          />
          <small>{context.length}/2000 · Don't include personal data. Your text is sent to the Claude API to write the memo.</small>
        </label>
        <button className="btn" disabled={!ready || loading} onClick={ask}>
          {loading ? "Writing your memo…" : "Write my memo"}
        </button>
        {!ready && <p className="muted small">Answer the assessment first.</p>}
        {error && <p className="warn-text">{error}</p>}
        {memo && (
          <>
            <p className="ai-label">AI-generated draft · check before sharing</p>
            <Memo text={memo} />
          </>
        )}
      </div>
    </Section>
  );
}
