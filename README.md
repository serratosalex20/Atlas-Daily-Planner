# Atlas Daily Planner

Atlas Daily OS is a static browser app with local caching and Supabase-backed daily state, scheduled tasks, journals, and a morning-brief display.

## Coordinated planning

- [Shared operating rules](docs/coordination.md)
- [Claude morning routine prompt](docs/claude-morning-routine.md)
- [Claude Code setup and verification prompt](docs/claude-code-setup.md)
- [Claude instructions](CLAUDE.md) and [Codex/agent instructions](AGENTS.md)

Todoist is the task ledger. Atlas presents daily focus and records routines. GitHub stores code and operating instructions. Personal plans, private handoffs, task IDs, and client details belong in authenticated systems, not this public repository.

The coordination documents are instructions, not an installed sync service. Each assistant needs its own working connectors and scheduled run. A repo edit does not reconfigure a Claude routine or give either assistant access to the other's private conversations.

## Existing app storage

- `index.html`: current app; local cache plus Supabase sync.
- `daily_state`: daily inputs and user-selected Top 3.
- `atlas_scheduled_tasks`: date-targeted Atlas tasks.
- `atlas_morning_brief`: suggested `top3` and `brief_md`, read by the existing app.
- `supabase/functions/send-push/index.ts`: authenticated push endpoint.
- `reminders/`: calendar reminder files.

The app references an existing local morning-brief pipeline (`brief.py`), which is not included in this repository. Locate and inspect that pipeline before adding another brief writer or scheduler. `README.txt` contains the original deployment instructions; its local-storage-only note predates cloud sync.
