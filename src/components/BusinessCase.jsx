import { LABOUR_COSTS } from "../data/labourCosts.js";
import { Cite, Section, eur, num, useLocal } from "./common.jsx";

const EMPTY = { geo: "DE", rate: "", hours: "", days: "", share: "", capex: "", opex: "" };

function Field({ label, hint, suffix, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className="input">
        <input
          type="number"
          inputMode="decimal"
          min="0"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {suffix && <em>{suffix}</em>}
      </div>
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function BusinessCase() {
  const [f, setF] = useLocal("rr-case", EMPTY);
  const set = (k) => (v) => setF({ ...f, [k]: v });

  const country = LABOUR_COSTS.find((c) => c.geo === f.geo) || LABOUR_COSTS[0];
  const rate = f.rate === "" ? country.value : Number(f.rate);
  const hours = Number(f.hours);
  const days = Number(f.days);
  const share = Number(f.share) / 100;
  const capex = Number(f.capex);
  const opex = f.opex === "" ? null : Number(f.opex);

  const haveLabour = f.hours !== "" && f.days !== "" && f.share !== "";
  const addressed = haveLabour ? hours * days * share * rate : null;
  const net = haveLabour && opex !== null ? addressed - opex : null;
  const payback = net !== null && f.capex !== "" && net > 0 ? (capex / net) * 12 : null;
  const fiveYear = net !== null && f.capex !== "" ? net * 5 - capex : null;

  return (
    <Section
      id="case"
      eyebrow="Step 3 · Business case"
      title="Payback, from your own numbers"
      lede="The only default is the hourly labour cost, taken from Eurostat. Everything else is yours to enter: there is no public price list for AI picking systems, so this calculator won't guess one."
    >
      <div className="grid2">
        <div className="card">
          <label className="field">
            <span>Country</span>
            <select value={f.geo} onChange={(e) => setF({ ...f, geo: e.target.value, rate: "" })}>
              {LABOUR_COSTS.map((c) => (
                <option key={c.geo} value={c.geo}>{c.name}</option>
              ))}
            </select>
          </label>
          <Field
            label="Hourly labour cost"
            suffix="€ / h"
            value={f.rate}
            placeholder={String(country.value)}
            onChange={set("rate")}
            hint={
              <>
                Default: {eur(country.value, 2)}, Eurostat {country.year}, transportation &amp; storage, total labour cost
                incl. non-wage costs, firms with 10+ staff <Cite ids={["EUROSTAT"]} />. Overwrite with your own figure.
              </>
            }
          />
          <Field label="Manual hours on the process today, per day" suffix="h" value={f.hours} onChange={set("hours")} placeholder="Your figure" />
          <Field label="Operating days per year" suffix="days" value={f.days} onChange={set("days")} placeholder="Your figure" />
          <Field label="Share of those hours the system takes over" suffix="%" value={f.share} onChange={set("share")} placeholder="Your estimate" hint="Be conservative: exceptions and replenishment usually stay manual." />
          <Field label="One-off investment (hardware, integration, training)" suffix="€" value={f.capex} onChange={set("capex")} placeholder="From your supplier quote" />
          <Field label="Annual running cost (software, service, maintenance)" suffix="€ / yr" value={f.opex} onChange={set("opex")} placeholder="From your supplier quote" />
          <button className="link" onClick={() => setF(EMPTY)}>Reset</button>
        </div>

        <div className="card results-card">
          <h3>Result</h3>
          <dl className="kv">
            <dt>Labour cost addressed per year</dt>
            <dd>{eur(addressed)}</dd>
            <dt>Net saving per year</dt>
            <dd>{eur(net)}</dd>
            <dt>Payback</dt>
            <dd>{payback === null ? "—" : `${num(payback, 1)} months`}</dd>
            <dt>5-year net</dt>
            <dd>{eur(fiveYear)}</dd>
          </dl>
          {net !== null && net <= 0 && <p className="warn-text">Running costs exceed the labour cost addressed, so there is no payback on these inputs.</p>}
          <p className="muted small">
            Formula: hours × days × share × hourly cost = labour cost addressed. Minus annual running cost = net saving.
            Payback = investment ÷ net saving. Excludes financing, depreciation, tax and throughput gains.
          </p>
          {f.geo === "DE" && (
            <p className="muted small">
              For reference, Germany's statutory minimum wage is €13.90/h from 1 January 2026 and €14.60/h from
              1 January 2027 <Cite ids={["MINWAGE"]} />. It is a wage floor, not a labour cost.
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}
