# Robot-Ready

A free go-live readiness kit for European warehouses deploying AI picking robots.

- **Readiness assessment**: 20 questions across process, systems, safety & EU compliance, people & works council, and business case, with blockers and a generated 90-day plan.
- **Payback calculator**: the hourly labour cost default comes from Eurostat (`lc_lci_lev`, NACE H, 2025). All other inputs are the user's own; no invented prices.
- **2027 rulebook**: plain-English guide to Regulation (EU) 2023/1230 (applies 14 January 2027), the AI Omnibus, Directive 2009/104/EC and German BetrSichV / BetrVG, with ten questions to ask a robot supplier.
- **Pilot KPI tracker**: weekly metrics with CSV export.
- **AI readiness memo**: a Vercel function calls the Claude API, grounded only in the sourced facts on the page.

Every figure links to its source; see `src/data/sources.js`.

## Run locally

```bash
npm install
npm run dev
```

The AI memo needs `ANTHROPIC_API_KEY` set in the Vercel project's environment variables.

Independent project, not affiliated with any robot manufacturer or integrator. Guidance, not legal advice.
