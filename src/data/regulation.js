// Plain-English summaries of the legal texts. Each item names the exact provision
// so a reader can check the wording in the source.

export const MR_DATE = "2027-01-14";

export const TIMELINE = [
  {
    date: "27 Jul 2026",
    title: "AI Omnibus in force",
    text: "Regulation (EU) 2026/1744 amends the AI Act. The Machinery Regulation moves from Section A to Section B of AI Act Annex I, so AI built into machinery is handled mainly through the Machinery Regulation.",
    refs: ["OMNIBUS", "OMNIBUS_ANALYSIS"],
  },
  {
    date: "14 Jan 2027",
    title: "Machinery Regulation applies",
    text: "Regulation (EU) 2023/1230 applies and the Machinery Directive 2006/42/EC is repealed. Machines placed on the market under the Directive before this date may still be made available.",
    refs: ["MR"],
    cite: "Art. 51(2), 52(1), 54",
    key: true,
  },
  {
    date: "2 Dec 2027",
    title: "AI Act: stand-alone high-risk rules",
    text: "High-risk obligations for Annex III AI systems apply (deferred by the AI Omnibus).",
    refs: ["OMNIBUS"],
  },
  {
    date: "2 Aug 2028",
    title: "AI Act: product-embedded high-risk rules",
    text: "High-risk obligations for AI embedded in products listed in AI Act Annex I apply (deferred by the AI Omnibus).",
    refs: ["OMNIBUS"],
  },
];

export const CHANGES = [
  {
    title: "Third-party checks where ML ensures safety",
    cite: "Annex I Part A, points 5–6; Art. 25(2)",
    text: "Safety components, and embedded systems, with fully or partially self-evolving behaviour using machine learning that ensure safety functions need a conformity procedure involving a notified body (EU type-examination, full quality assurance or unit verification). This applies only where machine learning ensures a safety function — not to AI that only plans grasps.",
  },
  {
    title: "Stay inside the defined task and movement space",
    cite: "Annex III 1.2.1",
    text: "Control systems of machinery with self-evolving behaviour must not cause actions beyond the defined task and movement space, and it must be possible at all times to correct the machine to keep it safe.",
  },
  {
    title: "Logs a regulator can ask for",
    cite: "Annex III 1.2.1",
    text: "Tracing logs of interventions and of safety-software versions uploaded after sale are kept for five years. For self-evolving systems, data on the safety-related decision-making process is recorded and kept for one year. Both exist only to show conformity on a reasoned request from a national authority.",
  },
  {
    title: "Protection against corruption",
    cite: "Annex III 1.1.9",
    text: "Connected devices or remote access must not lead to a hazardous situation. Safety-critical software and data must be protected against accidental or intentional corruption, and the machine must record evidence of interventions or software changes.",
  },
  {
    title: "Human–machine interaction",
    cite: "Annex III 1.1.6, 1.3.7",
    text: "For machines operating with varying levels of autonomy, the interface must suit the operators and, where relevant, the machine should communicate its planned actions in a comprehensible way. Psychological stress from interacting with the machine must be considered.",
  },
  {
    title: "Changing the machine can make you the manufacturer",
    cite: "Art. 3(16), Art. 18",
    text: "A 'substantial modification' — an unplanned physical or digital change that creates a new hazard or raises a risk requiring new guards, protective devices or stability measures — makes whoever carries it out subject to the manufacturer's obligations, including conformity assessment.",
  },
  {
    title: "Digital instructions, kept for 10 years",
    cite: "Art. 10(3), 10(7)",
    text: "Instructions may be digital but must be downloadable, printable and online for the product's expected lifetime and at least 10 years; paper copies are free on request at purchase. Manufacturers keep technical documentation for at least 10 years.",
  },
];

export const EMPLOYER_DUTIES = [
  {
    title: "Risk assessment before use (Germany)",
    cite: "BetrSichV § 3",
    text: "The employer assesses hazards before work equipment is used. A CE marking does not remove this duty. Physical and psychological loads must be included.",
    refs: ["BETRSICHV"],
  },
  {
    title: "Suitable, maintained equipment (EU)",
    cite: "Directive 2009/104/EC, Art. 3–4",
    text: "Employers must provide equipment that is suitable for the work, complies with applicable EU rules, and is maintained to that level throughout its working life.",
    refs: ["WED"],
  },
  {
    title: "Inform and train workers (EU)",
    cite: "Directive 2009/104/EC, Art. 8–10",
    text: "Workers get comprehensible information and training, including on abnormal situations, and are consulted. People working near the equipment must be made aware of its dangers too.",
    refs: ["WED"],
  },
  {
    title: "Works council: inform early, including AI (Germany)",
    cite: "BetrVG § 90",
    text: "The employer informs the works council in good time, with documents, about planned technical installations and work processes — the text explicitly includes the use of artificial intelligence — and consults on the effects on employees.",
    refs: ["BETRVG90"],
  },
  {
    title: "Works council: co-determination on monitoring (Germany)",
    cite: "BetrVG § 87(1) no. 6",
    text: "Introducing technical devices designed to monitor employee behaviour or performance requires the works council's co-determination.",
    refs: ["BETRVG87"],
  },
];

export const SUPPLIER_QUESTIONS = [
  { q: "Will this system be placed on the market under Directive 2006/42/EC or Regulation (EU) 2023/1230? Please share the EU declaration of conformity.", cite: "MR Art. 21, 51, 52" },
  { q: "Does any machine-learning component ensure a safety function? If yes, which notified body is involved and which conformity procedure is used?", cite: "MR Annex I Part A 5–6, Art. 25(2)" },
  { q: "How are the task and movement space defined and enforced, and how can we correct the system at any time?", cite: "MR Annex III 1.2.1" },
  { q: "Which intervention and safety-software version logs are kept, for how long, and where?", cite: "MR Annex III 1.2.1" },
  { q: "How is safety-critical software protected from corruption, and how are software changes and remote access recorded?", cite: "MR Annex III 1.1.9" },
  { q: "Which changes during integration (guards, cell layout, safety controls) would count as a substantial modification, and who carries the manufacturer's obligations then?", cite: "MR Art. 3(16), 18" },
  { q: "Where are the digital instructions, and can we get them on paper at purchase?", cite: "MR Art. 10(7)" },
  { q: "What operational data does the system record about the work area, and can any of it identify or measure individual employees?", cite: "BetrVG § 87(1) no. 6" },
  { q: "What documentation will you provide for our own risk assessment and for informing the works council?", cite: "BetrSichV § 3; BetrVG § 90" },
  { q: "What training do you provide for operators, maintenance staff and people working near the cell?", cite: "Directive 2009/104/EC Art. 9" },
];
