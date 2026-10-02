# Calendar and parent Compass coordination

## Google Calendar

Read the private handoff for verified account and calendar IDs. Inventory calendars when that mapping changes; paginate results. Use America/Chicago for planning and DST-aware event times, regardless of a calendar's stored default timezone.

Read upcoming events across the personal, work, family, Atlas Routine and education calendars. Check tomorrow in detail and the next seven days for deadlines/conflicts. Expand recurring instances and deduplicate shared copies. Optional subscription feeds are information, not automatic attendance. Course due-date entries are deadline signals, not necessarily an hour-long appointment or evidence of outstanding coursework.

Authorized daily maintenance:
- Create/update a confirmed commitment only when source evidence supplies the date, time, duration/end, target calendar, and the user's intent. Reuse the existing event ID.
- For personal focus planning, use the existing Atlas Routine calendar and reuse existing anchors before adding blocks. Only automatically move or revise clearly assistant-managed flexible blocks with no attendees; preserve human changes.
- Use a stable private source/task reference for every managed event and record calendar/event IDs in the private handoff. Re-read immediately before writes and verify afterward.
- Preserve fixed appointments, sleep/health and family blocks. Do not bulk-shift recurring series or remove old events just because they appear stale.
- Do not invite people, send event-change notifications to others, accept invitations, or modify attendee-bearing events without explicit authorization for that communication.
- Never turn every Todoist due date into a calendar event. Avoid duplicate reminders and overbooking.
- If a proposed time lacks enough information, retain a task/proposal rather than inventing an appointment.
- A late-evening background reconciliation does not mean the user is available for work then or needs a new calendar meeting.

## Parent Compass

The existing parent page is `kenzie.html`; its cloud data lives in `kenzie_journal`, `kenzie_progress`, and `kenzie_settings`. Verify live schema, owner and owner-scoped permissions before writes. Resolve the parent's non-anonymous account from verified identity in the private handoff, never from row order.

The child page `kenzie-kid.html` stores her journal and progress locally on her device. Do not read, upload, synchronize, or replace that private journal. The parent's journal is a different record.

ChatGPT/Codex currently owns automated parent-journal maintenance. Claude can read the parent record and leave proposed updates in the handoff; do not duplicate the evening writer's entry.

When relevant conversation evidence changes:
1. Read the recent parent record and current source evidence.
2. Append a concise dated parent note separating reported facts, explicit decisions, proposed activities, and confirmed outcomes.
3. Use a stable actor/date/source key; retries must not create another copy. Preserve all human and other-agent entries.
4. Record only useful developmental guidance. Avoid names/details of peers, raw transcripts, diagnoses, inferred motives, or a behavioral dossier.
5. Keep one optional practical focus at a time: connection, confidence, emotional skills, money skills, independence, communication, or character as supported by the conversation.
6. Mark activities, milestones, habits, or rewards complete only on explicit evidence. Never change birthday, age, checkmarks or adopted settings by inference.
7. Protect existing family calendar time. Do not introduce a new timed family commitment without sufficient scheduling evidence.
8. Read back the saved note; a database write is not proof of frontend display.

On days with no new relevant information, do not add a filler note or repeat the same recommendation. The weekly Life-Skills Mission should read the latest parent notes and known progress, offer one low-pressure activity, and record the mission as proposed rather than completed.

The curriculum and weekly focus currently live in frontend code. A journal update does not automatically rewrite the curriculum or the child's device-local experience. Report that distinction honestly.
