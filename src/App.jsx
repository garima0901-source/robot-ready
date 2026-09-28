import { scoreAnswers } from "./data/assessment.js";
import { MR_DATE } from "./data/regulation.js";
import { RETRIEVED, SOURCES } from "./data/sources.js";
import { Assessment, Results } from "./components/Assessment.jsx";
import { BusinessCase } from "./components/BusinessCase.jsx";
import { Compliance } from "./components/Compliance.jsx";
import { KpiTracker } from "./components/KpiTracker.jsx";
import { Advisor } from "./components/Advisor.jsx";
import { Cite, useLocal } from "./components/common.jsx";

function daysUntil(iso) {
  const target = new Date(`${iso}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((target - now) / 86400000);
}

const NAV = [
  ["#assess", "Assess"],
  ["#results", "Plan"],
  ["#case", "Business case"],
  ["#rules", "2027 rules"],
  ["#kpis", "KPIs"],
  ["#advisor", "AI memo"],
];

export default function App() {
  const [answers, setAnswers] = useLocal("rr-answers", {});
  const result = scoreAnswers(answers);
  const days = daysUntil(MR_DATE);

  return (
    <>
      <header className="top">
        <div className="wrap row between">
          <a href="#" className="brand">
            <span className="mark" aria-hidden="true">RR</span> Robot-Ready
          </a>
          <nav>
            {NAV.map(([href, label]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <p className="eyebrow">For warehouse & intralogistics teams in Europe</p>
            <h1>Is your warehouse ready for AI picking robots?</h1>
            <p className="lede">
              A free go-live readiness kit: a 20-question assessment, a 90-day plan, a payback calculator built on
              Eurostat data, a plain-English guide to the 2027 EU machinery rules, and a KPI tracker for your pilot.
            </p>
            <div className="row">
              <a className="btn" href="#assess">Start the assessment</a>
              <a className="btn ghost" href="#rules">Read the 2027 rules</a>
            </div>

            <div className="stats">
              <div className="stat accent">
                <strong>{days > 0 ? days : 0}</strong>
                <span>days until the EU Machinery Regulation applies on 14 January 2027 <Cite ids={["MR"]} /></span>
              </div>
              <div className="stat">
                <strong>102,900</strong>
                <span>transportation & logistics robots sold worldwide in 2024, up 14% <Cite ids={["IFR"]} /></span>
              </div>
              <div className="stat">
                <strong>€30.6/h</strong>
                <span>average labour cost in EU transportation & storage, 2025 <Cite ids={["EUROSTAT"]} /></span>
              </div>
              <div className="stat">
                <strong>3 in 5</strong>
                <span>workers in the EU-28 report musculoskeletal complaints, the most prevalent work-related health problem (EU-OSHA, 2019) <Cite ids={["EUOSHA"]} /></span>
              </div>
            </div>
          </div>
        </section>

        <Assessment answers={answers} setAnswers={setAnswers} result={result} />
        <Results result={result} />
        <BusinessCase />
        <Compliance />
        <KpiTracker />
        <Advisor result={result} answers={answers} />

        <section id="sources" className="section">
          <div className="wrap">
            <p className="eyebrow">Sources</p>
            <h2>Every number, and where it comes from</h2>
            <p className="lede">All sources checked on {RETRIEVED}. Primary legal texts are linked to EUR-Lex and gesetze-im-internet.de.</p>
            <ol className="sources">
              {Object.entries(SOURCES).map(([id, s]) => (
                <li key={id} id={`src-${id}`}>
                  <a href={s.url} target="_blank" rel="noreferrer">{s.title}</a>
                  <span className="muted"> — {s.publisher}</span>
                  <p className="small">Used for: {s.used}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="wrap">
          <p>
            Robot-Ready is an independent project by Garima. It is not affiliated with any robot manufacturer, integrator or
            authority. The assessment is a self-check framework, not a benchmark; the regulation summaries are guidance, not
            legal advice.
          </p>
          <p className="muted small">Built with React, Vercel and the Claude API.</p>
        </div>
      </footer>
    </>
  );
}
