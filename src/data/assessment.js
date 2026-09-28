// The readiness framework. Questions and scoring are a structured self-assessment
// method, not a benchmark: no industry averages are implied.
// Each answer scores 0–3. "na" answers are left out of the pillar score.
// phase: which 30-day block of the go-live plan the follow-up action belongs to.

const SCALE = (a, b, c, d) => [
  { v: 0, label: a },
  { v: 1, label: b },
  { v: 2, label: c },
  { v: 3, label: d },
];

export const PILLARS = [
  {
    id: "process",
    name: "Process & product fit",
    blurb: "Is the work the robot will do defined well enough to automate?",
    questions: [
      {
        id: "p1",
        q: "Do you hold dimensions, weights and packaging type for the SKUs in scope?",
        options: SCALE("No item data", "For some SKUs", "For most SKUs", "Complete and kept up to date"),
        action: "Complete item master data (dimensions, weight, packaging) for every SKU in the pilot scope.",
        phase: 1,
      },
      {
        id: "p2",
        q: "Is the target picking or packing process written down as standard work?",
        options: SCALE("Not documented", "Informal notes", "Documented, not validated", "Documented and followed"),
        action: "Write the pilot process as standard work: steps, handovers, cycle expectations and exceptions.",
        phase: 1,
      },
      {
        id: "p3",
        q: "Is it defined who handles items the robot cannot pick, and how?",
        options: SCALE("Not considered", "Discussed", "Defined, not staffed", "Defined and staffed"),
        action: "Define the exception path for items the robot cannot handle: who resolves them, where, and within what time.",
        phase: 2,
      },
      {
        id: "p4",
        q: "Have you chosen a specific pilot area and SKU segment?",
        options: SCALE("No", "Candidate areas only", "Chosen, volumes unknown", "Chosen, with volume data"),
        action: "Pick one pilot area and SKU segment, and pull its order-line volumes by hour and weekday.",
        phase: 1,
      },
    ],
  },
  {
    id: "systems",
    name: "Data & systems integration",
    blurb: "Can the robot get orders and send confirmations without manual work?",
    questions: [
      {
        id: "s1",
        q: "Can your WMS/WCS exchange orders and confirmations through a documented interface?",
        options: SCALE("No interface", "Unknown", "Possible, needs development", "Documented interface available"),
        action: "Confirm the WMS/WCS interface (orders out, confirmations back) and share its specification with the supplier.",
        phase: 1,
      },
      {
        id: "s2",
        q: "Is a stable network and power supply available at the planned station?",
        options: SCALE("No", "Unknown", "Needs upgrade", "Yes, verified on site"),
        action: "Survey the station location for network coverage and power, and book any upgrade work.",
        phase: 1,
      },
      {
        id: "s3",
        q: "Is there a named IT owner with time allocated to the integration?",
        options: SCALE("No", "Informally", "Named, no time allocated", "Named, time allocated"),
        action: "Name an IT owner for the integration and agree their allocated time for the pilot.",
        phase: 1,
      },
      {
        id: "s4",
        q: "Have you agreed what operational data the system records, where it is stored and who can access it?",
        options: SCALE("Not discussed", "Discussed", "Drafted", "Agreed in writing"),
        action: "Agree in writing what data the system logs, where it is stored, retention, and who can access it.",
        phase: 2,
        refs: ["MR", "BETRVG87"],
      },
    ],
  },
  {
    id: "safety",
    name: "Safety & EU compliance",
    blurb: "Will the installation meet workplace-safety law and the Machinery Regulation?",
    questions: [
      {
        id: "c1",
        q: "Will a workplace risk assessment be carried out for the robot cell before it is used?",
        options: SCALE("Not planned", "Assumed the supplier covers it", "Planned, no owner", "Planned, with owner and date"),
        action: "Schedule the employer's risk assessment for the robot cell before first use. A CE mark does not replace it.",
        phase: 1,
        refs: ["BETRSICHV", "WED"],
        critical: true,
      },
      {
        id: "c2",
        q: "Will the supplier provide the EU declaration of conformity and CE marking, and state which legal basis applies?",
        options: SCALE("Not asked", "Assumed", "Requested", "Received or contractually agreed"),
        action: "Ask the supplier for the EU declaration of conformity and whether the machine is placed on the market under Directive 2006/42/EC or Regulation (EU) 2023/1230.",
        phase: 1,
        refs: ["MR"],
        critical: true,
      },
      {
        id: "c3",
        q: "Is it clear who becomes responsible if integration adds guards or changes the safety control system?",
        options: SCALE("Not considered", "Unclear", "Discussed", "Agreed in the contract"),
        action: "Agree in the contract who carries manufacturer obligations if the integration counts as a substantial modification (Art. 18).",
        phase: 1,
        refs: ["MR"],
      },
      {
        id: "c4",
        q: "Have you asked whether any machine-learning component performs a safety function, and how safety software versions and logs are kept?",
        options: SCALE("Not asked", "Unsure what to ask", "Asked, awaiting answer", "Answered in writing"),
        action: "Ask whether ML performs any safety function (Annex I Part A points 5–6) and how safety-software versions and decision logs are retained (Annex III 1.2.1).",
        phase: 2,
        refs: ["MR"],
      },
    ],
  },
  {
    id: "people",
    name: "People & works council",
    blurb: "Are employees and their representatives part of the plan?",
    questions: [
      {
        id: "w1",
        q: "Have employee representatives (e.g. the works council) been informed at the planning stage?",
        options: SCALE("No", "Informally", "Scheduled", "Informed, with documents"),
        na: "No employee representation at this site",
        action: "Inform the works council in good time, with documents, about the planned installation and its AI use.",
        phase: 1,
        refs: ["BETRVG90", "WED"],
      },
      {
        id: "w2",
        q: "Have you checked whether the system's data could be used to monitor employee behaviour or performance?",
        options: SCALE("Not considered", "Aware, not checked", "Checked, agreement pending", "Checked and agreed"),
        na: "No employee representation at this site",
        action: "Check whether any logged data could monitor employees; if so, reach an agreement with the works council before go-live.",
        phase: 2,
        refs: ["BETRVG87"],
      },
      {
        id: "w3",
        q: "Is there a training and information plan for operators and people working near the cell?",
        options: SCALE("No", "Supplier training only", "Drafted", "Scheduled"),
        action: "Plan training for operators and information for everyone working near the cell, including abnormal situations.",
        phase: 2,
        refs: ["WED"],
      },
      {
        id: "w4",
        q: "Have you planned how affected roles change (tasks, redeployment, ergonomics)?",
        options: SCALE("No", "Discussed", "Drafted", "Agreed with the team"),
        action: "Map how each affected role changes, including ergonomics and physical and psychological load.",
        phase: 2,
        refs: ["BETRSICHV", "EUOSHA"],
      },
    ],
  },
  {
    id: "business",
    name: "Business case & governance",
    blurb: "Will you be able to prove the pilot worked, and decide what's next?",
    questions: [
      {
        id: "b1",
        q: "Have you measured baseline KPIs for the pilot area (throughput, error rate, cost per order line)?",
        options: SCALE("No", "Estimates only", "Partly measured", "Measured over several weeks"),
        action: "Measure the baseline for at least several weeks: throughput per hour, error rate, cost per order line.",
        phase: 1,
        critical: true,
      },
      {
        id: "b2",
        q: "Are go / no-go criteria for the pilot agreed in writing?",
        options: SCALE("No", "Informal", "Drafted", "Signed off"),
        action: "Write and sign off go / no-go criteria for the pilot before it starts.",
        phase: 1,
      },
      {
        id: "b3",
        q: "Are an executive sponsor and a day-to-day project owner named?",
        options: SCALE("Neither", "One of them", "Both, part-time", "Both, with clear mandate"),
        action: "Name an executive sponsor and a day-to-day project owner with a clear mandate.",
        phase: 1,
      },
      {
        id: "b4",
        q: "Is the budget approved, including integration, and does the timeline account for 14 January 2027?",
        options: SCALE("No", "Indicative", "Approved, timeline open", "Approved, timeline set"),
        action: "Approve the full budget (hardware, integration, training) and fix a timeline that accounts for the 14 January 2027 change in legal basis.",
        phase: 3,
        refs: ["MR"],
      },
    ],
  },
];

export const BANDS = [
  { min: 85, label: "Go-live ready", tone: "good" },
  { min: 70, label: "Pilot-ready, with gaps", tone: "ok" },
  { min: 40, label: "Foundations needed", tone: "warn" },
  { min: 0, label: "Not ready yet", tone: "bad" },
];

export const PHASES = [
  { n: 1, title: "Days 1–30 · Prepare", goal: "Owners, data, safety paperwork and baseline in place." },
  { n: 2, title: "Days 31–60 · Pilot", goal: "Run the pilot cell with exception handling and training live." },
  { n: 3, title: "Days 61–90 · Decide & scale", goal: "Review against go / no-go criteria and plan the roll-out." },
];

// Actions that always belong in the plan, whatever the score.
export const FIXED_PLAN = {
  2: ["Track the pilot weekly in the KPI tracker and share results with the sponsor."],
  3: [
    "Hold the go / no-go review against the signed-off criteria.",
    "Re-run this assessment and compare scores before committing to roll-out.",
  ],
};

export function scoreAnswers(answers) {
  const pillars = PILLARS.map((p) => {
    let got = 0;
    let max = 0;
    let answered = 0;
    for (const q of p.questions) {
      const a = answers[q.id];
      if (a === undefined) continue;
      answered++;
      if (a === "na") continue;
      got += a;
      max += 3;
    }
    return {
      id: p.id,
      name: p.name,
      answered,
      total: p.questions.length,
      pct: max ? Math.round((got / max) * 100) : null,
    };
  });
  const scored = pillars.filter((p) => p.pct !== null);
  const overall = scored.length
    ? Math.round(scored.reduce((s, p) => s + p.pct, 0) / scored.length)
    : null;
  const complete = pillars.every((p) => p.answered === p.total);
  const band = overall === null ? null : BANDS.find((b) => overall >= b.min);

  const blockers = [];
  const actions = [];
  for (const p of PILLARS) {
    for (const q of p.questions) {
      const a = answers[q.id];
      if (a === undefined || a === "na" || a === 3) continue;
      if (q.critical && a === 0) blockers.push({ ...q, pillar: p.name });
      actions.push({ ...q, pillar: p.name, gap: 3 - a, priority: (3 - a) * (q.critical ? 2 : 1) });
    }
  }
  actions.sort((x, y) => y.priority - x.priority);
  return { pillars, overall, band, complete, blockers, actions };
}
