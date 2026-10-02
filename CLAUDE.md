# Claude instructions

Read [docs/coordination.md](docs/coordination.md) at the beginning of every planning or implementation session. It is the shared operating protocol for Claude, ChatGPT, and Codex.

For a morning planning run, follow [docs/claude-morning-routine.md](docs/claude-morning-routine.md). For initial connector/pipeline setup, use [docs/claude-code-setup.md](docs/claude-code-setup.md).

Always read current Todoist tasks and the private task titled **Atlas coordination — shared handoff (keep open)** before choosing work. Use exact task IDs after discovery. Do not rely on memory or assume access to another assistant's chats.

Update authorized task changes and the shared handoff after meaningful work, and reconcile them on each scheduled daily run. Verify writes. Preserve user edits, deadlines, recurrence, completed state, and existing task identities.

The existing Claude/local pipeline is the intended morning-brief owner, pending verification. Do not create a competing scheduler. A routine must actually be configured and have the required connectors enabled; this file alone does not schedule it.

This repository is public. Keep personal plans, client information, credentials, database user IDs, and private task IDs out of commits, issues, and workflow logs. Report partial or blocked sync truthfully.

## Approved next steps (2026-10-02)

Read [docs/unattended-setup.md](docs/unattended-setup.md) and [docs/calendar-and-compass.md](docs/calendar-and-compass.md). The evening ChatGPT handoff now runs at **23:00 America/Chicago**.

The user approved the recommended repair to include the verified opted-in account despite inactivity; stop presenting the old three-way gate decision as unanswered. Implement against the real local pipeline and validate before claiming completion. Verify Google Calendar as well as Todoist in the scheduled runtime. Capture confirmed work and remaining blockers in the private handoff after meaningful sessions.

A cloud routine at 08:30 is the preferred future morning owner, but the existing local morning pipeline remains sole publisher until an explicit, tested ownership transfer. The cloud routine must remain a planning/review participant while local ownership is in force. Follow the parent Compass rules; do not copy private family notes into this public repo.

## Automatic handoff and review

Read [docs/session-handoffs.md](docs/session-handoffs.md) and [docs/bounded-review.md](docs/bounded-review.md). The project hooks request a bounded capture pass at Stop and surface pending events at SessionStart. Use the existing Todoist connector to deliver compact queued records; no new Todoist token is needed for this assistant-mediated transport. This does not repair the separate Python morning generator's missing Todoist source.

Inspect the handoff comments at session/routine start. Respond to pending ChatGPT review proposals as Claude, using actual comment IDs and the bounded review envelope. After meaningful work, publish and verify your own work event without waiting for a separate user request. If no material work changed, create no filler event. Retain failed deliveries in the outbox and report the gap once. Never modify other hooks or claim universal capture of Claude web chats.
