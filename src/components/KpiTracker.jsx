import { Section, eur, num, useLocal } from "./common.jsx";

const COLS = [
  { k: "week", label: "Week", type: "text" },
  { k: "attempts", label: "Pick attempts" },
  { k: "success", label: "Successful picks" },
  { k: "interventions", label: "Human interventions" },
  { k: "scheduled", label: "Scheduled hours" },
  { k: "running", label: "Hours available" },
  { k: "cost", label: "Total cost (€)" },
];

const blank = (n) => ({ week: `Week ${n}`, attempts: "", success: "", interventions: "", scheduled: "", running: "", cost: "" });

function metrics(r) {
  const n = (k) => (r[k] === "" ? null : Number(r[k]));
  const a = n("attempts"), s = n("success"), i = n("interventions"), sch = n("scheduled"), run = n("running"), c = n("cost");
  return {
    successRate: a && s !== null ? (s / a) * 100 : null,
    per1000: a && i !== null ? (i / a) * 1000 : null,
    picksPerHour: run && s !== null ? s / run : null,
    availability: sch && run !== null ? (run / sch) * 100 : null,
    costPerPick: s && c !== null ? c / s : null,
  };
}

export function KpiTracker() {
  const [rows, setRows] = useLocal("rr-kpi", [blank(1)]);
  const update = (idx, k, v) => setRows(rows.map((r, i) => (i === idx ? { ...r, [k]: v } : r)));

  const exportCsv = () => {
    const head = [...COLS.map((c) => c.label), "Pick success %", "Interventions per 1,000 picks", "Picks per available hour", "Availability %", "Cost per pick €"];
    const lines = rows.map((r) => {
      const m = metrics(r);
      return [...COLS.map((c) => r[c.k]), m.successRate, m.per1000, m.picksPerHour, m.availability, m.costPerPick]
        .map((v) => (v === null || v === undefined ? "" : typeof v === "number" ? v.toFixed(2) : `"${String(v).replace(/"/g, '""')}"`))
        .join(",");
    });
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "robot-ready-kpis.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Section
      id="kpis"
      eyebrow="Step 5 · Pilot KPI tracker"
      title="Measure the pilot the same way every week"
      lede="Five metrics a sponsor can read at a glance. Enter your own weekly totals; nothing is pre-filled and no benchmark is implied."
    >
      <div className="card scroll-x">
        <table className="kpi">
          <thead>
            <tr>
              {COLS.map((c) => <th key={c.k}>{c.label}</th>)}
              <th>Success</th>
              <th>Interv. / 1k</th>
              <th>Picks / h</th>
              <th>Avail.</th>
              <th>€ / pick</th>
              <th aria-label="Remove" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => {
              const m = metrics(r);
              return (
                <tr key={idx}>
                  {COLS.map((c) => (
                    <td key={c.k}>
                      <input
                        type={c.type || "number"}
                        min="0"
                        value={r[c.k]}
                        aria-label={`${c.label}, row ${idx + 1}`}
                        onChange={(e) => update(idx, c.k, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="out">{m.successRate === null ? "—" : `${num(m.successRate)}%`}</td>
                  <td className="out">{num(m.per1000, 2)}</td>
                  <td className="out">{num(m.picksPerHour, 0)}</td>
                  <td className="out">{m.availability === null ? "—" : `${num(m.availability)}%`}</td>
                  <td className="out">{eur(m.costPerPick, 3)}</td>
                  <td>
                    {rows.length > 1 && (
                      <button className="link" aria-label="Remove row" onClick={() => setRows(rows.filter((_, i) => i !== idx))}>×</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="row">
          <button className="btn ghost" onClick={() => setRows([...rows, blank(rows.length + 1)])}>+ Add week</button>
          <button className="btn ghost" onClick={exportCsv}>Export CSV</button>
        </div>
      </div>
      <dl className="defs">
        <dt>Pick success</dt><dd>successful picks ÷ pick attempts</dd>
        <dt>Interventions per 1,000</dt><dd>human interventions (remote or on-site) ÷ attempts × 1,000</dd>
        <dt>Picks per hour</dt><dd>successful picks ÷ hours the system was available</dd>
        <dt>Availability</dt><dd>hours available ÷ scheduled hours</dd>
        <dt>Cost per pick</dt><dd>total weekly cost of the cell ÷ successful picks</dd>
      </dl>
    </Section>
  );
}
