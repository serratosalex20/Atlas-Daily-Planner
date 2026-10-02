# Shared daily coordination protocol

## Purpose

Maintain one coherent plan across Todoist, Atlas Daily Planner, Claude, and ChatGPT/Codex. Reduce duplicate tasks and reminders. Favor completion of existing commitments over adding projects.

Use **America/Chicago** for date boundaries, deadlines, and schedule configuration; use UTC timestamps with offsets for audit entries. Do not hardcode CDT or UTC-5 year-round.

## Authority and ownership

| Information | Authoritative location | Update rule |
| --- | --- | --- |
| Task identity, completion, priority, due date, recurrence | Todoist | Update the existing task by ID after a fresh read |
| Habits, checkmarks, reflections, user-selected Top 3 | Atlas authenticated storage | Preserve user choices and history |
| Suggested daily plan | Existing `atlas_morning_brief` row | One verified Claude/local pipeline writer per user/date |
| Cross-assistant context and status | Private Todoist handoff task | Read before work; merge an evidence-based handoff afterward |
| Generic operating instructions and app code | This GitHub repository | Never store private planning data here |
| Actual appointments | Connected calendar, when accessible | A task due time is not proof of an appointment |

Recent explicit human instructions take precedence over assistant proposals. Human edits must not be replaced just because another assistant has a newer run timestamp.

The private handoff task is named **Atlas coordination — shared handoff (keep open)**. Discover it in the existing Daily OS project, save its returned ID privately, and update it in place. If it has been intentionally closed, do not recreate or reopen it automatically. If multiple matches exist, resolve the ambiguity rather than guessing.

## Current operating arrangement

- ChatGPT/Codex reconciles Todoist and leaves a private handoff during its daily evening run.
- Claude's existing morning routine reads the handoff and current task state, then generates the morning brief.
- The morning brief is a suggestion. The app's existing **Adopt** action remains the way to replace a user's Top 3.
- Before any Atlas write, verify database availability, live table schema, the actual account owner, and the existing local pipeline. Source code describes a `brief.py` pipeline outside this repo; do not invent its path or assume it is running.
- Do not add a new scheduler, push sender, or second brief writer until the existing owner has been located and a handoff is recorded privately.
- Prompts and instruction files do not implement a real-time two-way Todoist bridge. Until a verified bridge exists, keep task references in the private brief/handoff and report task reconciliation separately from Atlas refresh.

## Every planning run

1. Read the current repo instructions and private handoff. Check the run's date in America/Chicago.
2. Read current Todoist projects and tasks; paginate to completion and deduplicate by ID. Include due/overdue work, next-seven-day commitments, and relevant undated tasks. Exclude onboarding tasks from priority selection.
3. Check completion records or individual tasks when needed. Missing from active results does not prove completion. Verify known blockers and current commitments with connected sources when available.
4. If access to any source fails, label it unavailable with its last verified timestamp. Keep independent work moving. Never claim full sync from a successful notification.
5. Choose **one primary outcome**, with **at most two supporting actions**. Base the decision on hard deadlines, consequences, near-term revenue, client commitments, available time, and dependencies. Preserve family, health, and rest commitments.
6. Describe each selected action as a concrete next step, an estimated duration, and a definition of done. Include its exact Todoist ID/link privately. Do not fill all three slots when one is enough.
7. Apply only authorized, evidence-backed task changes. Leave speculative opportunities and unconfirmed old projects out of today's plan.
8. Re-read immediately before writing. Preserve unrelated fields. Read back after writing; if the write outcome is uncertain, inspect it before retrying.
9. Update the handoff with verified changes, blockers, current priority, next action, actor, timestamp, task IDs, source evidence, and per-system success/failure.
10. Send one short useful update. Avoid duplicate morning messages. On routine maintenance runs, notify only for changed priorities, decisions, deadlines, or blockers; do not repeat the same blocker every day.

When a task is explicitly requested or completed during a conversation, record that change promptly if authorized access is available. Other chats are not automatically shared. Record only evidence accessible to the current run, and state any context gap.

## Avoid duplicate or destructive updates

- First match an existing exact ID; otherwise inspect candidate title/project matches. Do not create a fresh copy merely because the wording changed.
- Keep the original task when moving it. Never use delete-and-recreate as a shortcut.
- Preserve true deadlines and recurring rules. An estimated work date is not a deadline.
- Never complete a task, check a habit, or close a day without evidence.
- Do not bulk-roll old recurring tasks forward or mark expired events complete. Ask for one bounded cleanup decision when needed.
- API priorities can differ from UI labels. Verify the connector's mapping before writing.
- Re-read shared descriptions and append/merge only the relevant section. Preserve recent human and other-agent edits. Todoist read/write is not a transaction: if an overlapping edit is detected, reconcile it and report unresolved conflicts.
- Daily handoff sections should have one entry per actor/date, replacing that actor's own entry on retries rather than duplicating it.
- An automated task needs a stable private source reference or dedupe key. A retry must update the same record.
- When Atlas task mapping is not verified, do not create duplicate `atlas_scheduled_tasks` rows for Todoist items.
- Do not touch credentials, spending, public posts, outreach, other projects, or production code during a routine planning run without task-specific authorization.

## Private handoff format

Use this structure in the private Todoist task description; the values never belong in this repository:

- **State:** timezone; current writer ownership; connected sources; last successful read/write per system.
- **Plan:** target local date; primary outcome; up to two supporting actions; task IDs; estimates; definitions of done; human-approved vs proposed.
- **Evidence:** source and timestamp; completion confirmations; changed commitments.
- **Changes:** actor and run key; task IDs created/updated; fields changed; verification result.
- **Blockers/conflicts:** exact failure; affected component; next safe action; whether already reported.
- **Next handoff:** who acts next and what they need to read.

Keep the handoff compact. Do not include raw credentials, journals, sensitive family records, or copied client documents.

## Atlas readiness and verification

Before enabling automated writes:
- Confirm the correct Supabase project is active and an authorized read works.
- Inspect live `atlas_morning_brief` columns, unique keys, permissions, and owner-scoped access. Its migration is not present in this repository; do not assume the entire schema from the frontend query.
- Resolve the authenticated account owner; never use a guessed UUID or the first database user.
- Reuse the established pipeline and preserve RLS. Never expose a service-role key to the browser or public repo.
- Upsert only the intended user's local-date brief with the existing key after a fresh read. Preserve human-selected `daily_state.payload.top3`.
- Read back the brief and confirm it appears after refreshing Atlas in an authorized session.
- Confirm a repeated run creates no duplicate task/brief and does not overwrite a newer human edit.
- Record actual last successful sync times. A queued automation or API acceptance is not end-to-end verification.

If Atlas is unavailable, Todoist remains useful. Record **Todoist updated; Atlas blocked**, not **fully synced**. Scheduling permission or project-list access is not proof that the database is reachable.

## Keep the daily system light

- Morning: read the handoff, choose one main outcome, show at most two supporting actions.
- End of day: record verified completion, identify the blocker, prepare the next workday.
- Weekly: review stale work, paused projects, and the coming week's commitments; make at most three weekly outcomes.
- Prefer a short income-producing or client-delivery action over another system improvement when the system is already usable.
- Research creates at most one proposed action when genuinely relevant; do not convert every finding into work.
