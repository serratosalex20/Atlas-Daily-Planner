# Agent instructions

Read [docs/coordination.md](docs/coordination.md) before planning, changing tasks, or implementing synchronization. All assistants use that protocol.

## ChatGPT / Codex role

- Reconcile current Todoist tasks and update the private **Atlas coordination — shared handoff (keep open)** task after relevant authorized work and on scheduled daily runs.
- Use Todoist as the task ledger; read the current handoff before every planning run.
- Leave the existing Claude/local pipeline as morning-brief writer until ownership is explicitly handed off and verified. Do not write competing Atlas briefs or add another morning notification by default.
- Preserve human changes and exact task IDs. Never infer completion from an expired due date or a task disappearing from active results.
- This public repository holds generic instructions and code, not private plans or operational records.
- Connector or scheduler availability must be tested. Never describe configured instructions as working live sync.

For code changes, inspect the existing implementation and preserve unrelated work. Verify behavior in proportion to the change. Do not alter live schema, reset data, pause other projects, change billing, or deploy an unrelated redesign as part of a planning run.
