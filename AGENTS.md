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

## Approved coordination extension (2026-10-02)

Read [docs/calendar-and-compass.md](docs/calendar-and-compass.md) and [docs/unattended-setup.md](docs/unattended-setup.md).
The evening reconciliation is now **23:00 America/Chicago**. Check Google Calendar before prioritizing, and maintain the parent Compass record when relevant confirmed context changes. Capture an evidence-based handoff after meaningful work without waiting for a separate daily prompt. Existing private handoff entries contain resolved account/calendar identifiers; do not commit them.

The user approved repair of the existing morning pipeline's inactivity gate for the verified opted-in owner, runtime Todoist/calendar integration, and explicit credential configuration. These are setup work, not permission to alter unrelated systems. Local files outside this repository require the actual host runtime. Record implementation and scheduler configuration as pending until tested.

Google Calendar writes follow the narrow rules in calendar-and-compass.md. Compass updates concern the parent's cloud records; do not access or export the child's device-private journal. ChatGPT/Codex is the current automated Compass journal writer; Claude reads and proposes changes through the handoff to avoid duplicate entries.
