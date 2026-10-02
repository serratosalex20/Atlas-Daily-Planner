# Claude Code setup prompt

Paste into Claude Code with this repository selected. This is a setup/verification task, distinct from the recurring morning prompt.

---

Pull the latest serratosalex20/Atlas-Daily-Planner changes without overwriting local work. Read CLAUDE.md, AGENTS.md, and docs/coordination.md. Help complete the coordinated daily system with ChatGPT/Codex and Todoist.

1. Read the private Todoist task "Atlas coordination — shared handoff (keep open)" and inspect current tasks. Use it as shared context; do not assume that either assistant sees the other's conversations.
2. Locate the existing local brief.py pipeline and any scheduler/configuration that currently generates Atlas's morning brief and notifications. Those scripts are not included in this repository. Inspect them before changing anything; report their actual paths, owner, schedule, and data sources privately.
3. Check the Atlas Supabase project's current status. If restoration is blocked by the active-free-project limit, report that dependency. Do not pause another project, purchase a plan, migrate the database, or reset data without a specific authorized choice.
4. Verify Todoist and Supabase read access in the execution environment that will actually run the routine. A connector in another Claude session is not proof of access here.
5. Update the existing pipeline to follow docs/coordination.md once its required access works: Todoist is the task ledger; ChatGPT writes an evening handoff; Claude reads it for the morning plan; only the verified existing morning writer publishes atlas_morning_brief. Preserve adopted Top 3 and human changes.
6. Use docs/claude-morning-routine.md for the current morning routine. If routine settings cannot be changed from here, provide the exact paste text and settings for me to apply; do not claim they were saved.
7. Inspect live schema, owner identity, and existing mappings before implementing a sync change. Store all secrets server-side. Keep private task references and handoffs out of this public repository. Do not build a parallel task database or duplicate scheduler.
8. Validate with an authorized real read and a narrow reversible update, read it back, and check the actual Atlas display. Confirm a second run does not duplicate records; a human change wins; unavailable connections report a clear partial-sync status.
9. Leave a private handoff with what actually works, exact remaining blockers, and the next step. Keep my daily list to one primary outcome and at most two supporting actions. Recommend a single bounded cleanup of old Todoist reminders, with no inferred completion.

Finish with a concise status: verified now / blocked / one action needed from me. Do not describe instruction files alone as a completed live synchronization system.

## Approved continuation — 2026-10-02

The recommended durable inactivity-gate repair is now approved. Continue with [unattended-setup.md](unattended-setup.md); do not ask the user to choose among the prior gate alternatives again. Also integrate Google Calendar and the parent Compass protocol from [calendar-and-compass.md](calendar-and-compass.md).

The ChatGPT evening run is **23:00 America/Chicago**. Read the private handoff for current verified project availability, account/calendar mapping, parent-record location and runtime blockers. Configure the existing routine where the actual installed version/account permits; otherwise provide one concrete setup step. Keep the existing publisher as owner until a tested transfer.
