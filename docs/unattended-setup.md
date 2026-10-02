# Approved unattended setup and verification

This setup was approved on 2026-10-02. Generic instructions live here; actual identities, credentials, calendar IDs, host paths and run evidence stay private.

## Repair the existing host pipeline

1. Pull current repository instructions without overwriting local work; read the latest private handoff.
2. Locate and inspect the existing local brief generator, wrapper, renderer and scheduler. Preserve unrelated jobs.
3. Repair the activity gate so the verified explicitly opted-in owner is included even without recent daily_state activity. Use deliberate private configuration for that owner, not a public hardcoded identity or every anonymous account. Do not change daily_state merely to satisfy the gate.
4. Integrate Todoist tasks/handoff and Google Calendar in the actual unattended runtime. Interactive connector access is not proof that a Python or scheduled process can use it. Reuse an available supported connector/credential route. Never put tokens in chat, public code, logs or broad config-file scans.
5. Read/merge current evidence. Prioritize one main outcome and up to two supporting actions; preserve adopted Top 3.
6. Upsert the existing morning-brief row using its live owner/date key. Validate raw markdown serialization, read-back equality and duplicate-free reruns. Do not assume an updated_at column.
7. An expected write that targets zero owners, fails, or cannot be verified must return a visible failure status. Keep partial-source availability distinct from success.
8. Store a private run summary with stage statuses, source timestamps, owner/date, writer and error category. Never log credentials or full sensitive source bodies.

## Automatic capture after work

Implementation is now in `scripts/coordination_outbox.py` and project hooks. Follow [session-handoffs.md](session-handoffs.md) to verify those hooks on the actual host and deliver through the existing Todoist connector. Read [bounded-review.md](bounded-review.md) for the comment inbox, cloud reviewer and morning transfer. Do not create a second outbox or overwrite existing host hooks.

In each connected assistant session, read current state at the start and save confirmed progress after meaningful work. Include source reference, project, changed fields, timestamp, task IDs and next action. A code commit is evidence of a change, not automatically proof of deployment or acceptance.

For Claude Code, inspect existing hooks before adding a narrowly scoped completion/session-end hook. Preserve other hooks. Queue a compact update durably and retry failures; do not rely only on a slow network call at session termination. Prevent hook recursion and duplicate updates. Regular Claude/ChatGPT sessions require the appropriate instructions and authorized tools; flag coverage gaps instead of promising visibility into every conversation.

## Morning routine and ownership

The desired cloud planning time is 08:30 America/Chicago. The existing local publisher remains sole writer until transfer is verified. While local ownership is in force, a cloud routine reviews and saves a proposal to the handoff only.

Inspect installed Claude Code version, account access and existing routines before using /schedule; reuse the existing cloud routine rather than creating another. Official routine docs: https://code.claude.com/docs/en/routines . Test the saved routine with the repository and required Todoist, Calendar and Supabase access. Do not claim a routine was configured without a saved identifier/read-back.

For cloud cutover, validate equivalent inputs and output first, then disable only the old overlapping publisher/notification path and transfer the private writer record. Preserve unrelated local backup/security work. Test while the user's computer is off. Any new paid API/reviewer or hosting service needs its cost and scope established before enablement.

## Acceptance evidence

- Claude work update reaches the shared record and the next ChatGPT reconciliation.
- ChatGPT handoff is consumed by the actual Claude routine.
- Calendar constraints alter planning correctly; reruns create no duplicate events.
- Repeated brief write creates one owner/date row and preserves adopted Top 3.
- Relevant parent Compass note is saved once; private child journal stays local.
- Failure simulation is reported accurately; no green success on a skipped write.
- Actual scheduled run succeeds; authenticated Atlas display is checked separately.

Stop at a missing required credential, authentication, inaccessible host, or unavailable routine-management capability and report the one setup action needed. Complete independent work and leave a private handoff. Instruction files alone are not an implemented bridge.
