import { useState } from "react";
import { PILLARS, PHASES, FIXED_PLAN } from "../data/assessment.js";
import { Cite, Section } from "./common.jsx";

export function Assessment({ answers, setAnswers, result }) {
  const [active, setActive] = useState(0);
  const pillar = PILLARS[active];
  const answeredCount = Object.keys(answers).length;
  const totalQ = PILLARS.reduce((s, p) => s + p.questions.length, 0);

  const pick = (qid, v) => setAnswers((prev) => ({ ...prev, [qid]: v }));

  return (
    <Section
      id="assess"
      eyebrow="Step 1 · Readiness assessment"
      title="Twenty questions, five areas"
      lede="Answer for one planned deployment. The score is a structured self-check against the framework below, not a comparison with other warehouses."
    >
      <div className="progress" aria-label={`${answeredCount} of ${totalQ} answered`}>
        <div style={{ width: `${(answeredCount / totalQ) * 100}%` }} />
      </div>
      <p className="muted small">{answeredCount} of {totalQ} answered</p>

      <div className="tabs" role="tablist">
        {PILLARS.map((p, i) => {
          const r = result.pillars[i];
          return (
            <button
              key={p.id}
              role="tab"
              aria-selected={i === active}
              className={i === active ? "tab on" : "tab"}
              onClick={() => setActive(i)}
            >
              <span>{p.name}</span>
              <small>{r.answered}/{r.total}</small>
            </button>
          );
        })}
      </div>

      <div className="card">
        <p className="muted">{pillar.blurb}</p>
        {pillar.questions.map((q, n) => (
          <fieldset key={q.id} className="q">
            <legend>
              <span className="qn">{n + 1}</span>
              {q.q}
              {q.refs && <Cite ids={q.refs} />}
              {q.critical && <span className="tag">Gate</span>}
            </legend>
            <div className="opts">
              {q.options.map((o) => (
                <button
                  key={o.v}
                  className={answers[q.id] === o.v ? "opt on" : "opt"}
                  onClick={() => pick(q.id, o.v)}
                  aria-pressed={answers[q.id] === o.v}
                >
                  {o.label}
                </button>
              ))}
              {q.na && (
                <button
                  className={answers[q.id] === "na" ? "opt na on" : "opt na"}
                  onClick={() => pick(q.id, "na")}
                  aria-pressed={answers[q.id] === "na"}
                >
                  {q.na}
                </button>
              )}
            </div>
          </fieldset>
        ))}
        <div className="row between">
          <button className="btn ghost" disabled={active === 0} onClick={() => setActive(active - 1)}>
            ← Previous
          </button>
          {active < PILLARS.length - 1 ? (
            <button className="btn" onClick={() => setActive(active + 1)}>Next area →</button>
          ) : (
            <a className="btn" href="#results">See my results →</a>
          )}
        </div>
      </div>
      <p className="muted small">
        Questions marked <span className="tag">Gate</span> are go-live gates: answering the lowest option flags a blocker.
        Answers are kept only in this browser.{" "}
        {answeredCount > 0 && (
          <button className="link" onClick={() => setAnswers({})}>Clear answers</button>
        )}
      </p>
    </Section>
  );
}

function Ring({ value, tone }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className={`ring ${tone || ""}`} role="img" aria-label={`${value ?? 0}%`}>
      <circle cx="60" cy="60" r={r} className="track" />
      <circle
        cx="60"
        cy="60"
        r={r}
        className="bar"
        strokeDasharray={c}
        strokeDashoffset={c - (c * (value ?? 0)) / 100}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="66" textAnchor="middle">{value === null ? "–" : `${value}%`}</text>
    </svg>
  );
}

export function Results({ result }) {
  const { overall, band, pillars, blockers, actions, complete } = result;
  const byPhase = { 1: [], 2: [], 3: [] };
  for (const a of actions) byPhase[a.phase].push(a.action);
  for (const [k, list] of Object.entries(FIXED_PLAN)) byPhase[k].push(...list);

  return (
    <Section
      id="results"
      eyebrow="Step 2 · Results & go-live plan"
      title="Where you stand"
      lede={complete ? "Based on all twenty answers." : "Partial result: answer every question for a complete picture."}
    >
      {overall === null ? (
        <div className="card empty">Answer at least one question to see your score.</div>
      ) : (
        <>
          <div className="grid2">
            <div className="card center">
              <Ring value={overall} tone={band?.tone} />
              <p className={`band ${band?.tone}`}>{band?.label}</p>
              <p className="muted small">Bands: 85+ go-live ready · 70–84 pilot-ready · 40–69 foundations · &lt;40 not ready</p>
            </div>
            <div className="card">
              <h3>By area</h3>
              {pillars.map((p) => (
                <div key={p.id} className="meter">
                  <div className="row between">
                    <span>{p.name}</span>
                    <strong>{p.pct === null ? "—" : `${p.pct}%`}</strong>
                  </div>
                  <div className="meter-track"><div style={{ width: `${p.pct ?? 0}%` }} /></div>
                </div>
              ))}
            </div>
          </div>

          {blockers.length > 0 && (
            <div className="card alert">
              <h3>Go-live blockers</h3>
              <ul>
                {blockers.map((b) => (
                  <li key={b.id}>
                    <strong>{b.pillar}:</strong> {b.action}
                    {b.refs && <Cite ids={b.refs} />}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {actions.length > 0 && (
            <div className="card">
              <h3>Top priorities</h3>
              <ol className="priorities">
                {actions.slice(0, 5).map((a) => (
                  <li key={a.id}>
                    <span className="muted small">{a.pillar}</span>
                    <p>{a.action}{a.refs && <Cite ids={a.refs} />}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <h3 className="mt">Your 90-day go-live plan</h3>
          <div className="plan">
            {PHASES.map((ph) => (
              <div key={ph.n} className="card phase">
                <p className="phase-title">{ph.title}</p>
                <p className="muted small">{ph.goal}</p>
                <ul>
                  {byPhase[ph.n].length ? byPhase[ph.n].map((t, i) => <li key={i}>{t}</li>) : <li className="muted">No open gaps in this phase.</li>}
                </ul>
              </div>
            ))}
          </div>
          <div className="row">
            <button className="btn ghost" onClick={() => window.print()}>Print / save as PDF</button>
          </div>
        </>
      )}
    </Section>
  );
}

// Flattened view of the results for the AI advisor.
export function resultsForAdvisor(result, answers) {
  const labels = {};
  for (const p of PILLARS) for (const q of p.questions) labels[q.id] = q;
  return {
    overall: result.overall,
    band: result.band?.label,
    pillars: result.pillars.map(({ name, pct }) => ({ name, pct })),
    actions: result.actions.map((a) => ({
      pillar: a.pillar,
      q: a.q,
      answer: labels[a.id].options.find((o) => o.v === answers[a.id])?.label,
    })),
  };
}
