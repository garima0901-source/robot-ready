import { CHANGES, EMPLOYER_DUTIES, SUPPLIER_QUESTIONS, TIMELINE } from "../data/regulation.js";
import { Cite, Section } from "./common.jsx";

export function Compliance() {
  return (
    <Section
      id="rules"
      eyebrow="Step 4 · The 2027 rulebook"
      title="What changes for AI robots on 14 January 2027"
      lede="From that date, machinery placed on the EU market follows Regulation (EU) 2023/1230 instead of the Machinery Directive. The obligations below sit mainly with manufacturers — but warehouses buy, integrate and operate the machines, so they need the right answers from suppliers."
    >
      <ol className="timeline">
        {TIMELINE.map((t) => (
          <li key={t.date} className={t.key ? "key" : ""}>
            <time>{t.date}</time>
            <div>
              <strong>{t.title}</strong>
              <p>{t.text} {t.cite && <span className="muted">({t.cite})</span>} <Cite ids={t.refs} /></p>
            </div>
          </li>
        ))}
      </ol>

      <h3 className="mt">Seven provisions that matter for AI picking systems <Cite ids={["MR"]} /></h3>
      <div className="cards3">
        {CHANGES.map((c) => (
          <div key={c.title} className="card">
            <p className="cite-tag">{c.cite}</p>
            <h4>{c.title}</h4>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      <h3 className="mt">Your duties as the employer — these apply already</h3>
      <div className="cards3">
        {EMPLOYER_DUTIES.map((d) => (
          <div key={d.title} className="card">
            <p className="cite-tag">{d.cite}</p>
            <h4>{d.title}</h4>
            <p>{d.text} <Cite ids={d.refs} /></p>
          </div>
        ))}
      </div>

      <h3 className="mt">Ten questions to put to your robot supplier</h3>
      <div className="card">
        <ol className="questions">
          {SUPPLIER_QUESTIONS.map((s) => (
            <li key={s.q}>
              {s.q} <span className="cite-tag inline">{s.cite}</span>
            </li>
          ))}
        </ol>
        <button
          className="btn ghost"
          onClick={() =>
            navigator.clipboard?.writeText(
              SUPPLIER_QUESTIONS.map((s, i) => `${i + 1}. ${s.q} (${s.cite})`).join("\n")
            )
          }
        >
          Copy questions
        </button>
      </div>
      <p className="muted small">
        Summaries in plain English; check the exact wording in the linked texts. German provisions apply to German sites
        only. This is guidance, not legal advice.
      </p>
    </Section>
  );
}
