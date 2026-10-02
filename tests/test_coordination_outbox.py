import importlib.util
import tempfile
from pathlib import Path
import unittest
from unittest.mock import patch

FILE = Path(__file__).resolve().parents[1] / "scripts" / "coordination_outbox.py"
spec = importlib.util.spec_from_file_location("outbox", FILE)
outbox = importlib.util.module_from_spec(spec)
spec.loader.exec_module(outbox)


class OutboxTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.payload = {"actor": "claude-code", "project": "example-project",
                        "source_ref": "turn:example", "summary": "A change was tested.",
                        "evidence": ["Targeted check passed."], "next_action": "Review the result."}

    def test_retry_has_one_event_and_preserves_timestamp(self):
        a = outbox.enqueue(self.root, "ExampleTask", self.payload)
        b = outbox.enqueue(self.root, "ExampleTask", self.payload)
        self.assertEqual(a, b)
        self.assertEqual(len(outbox.pending(self.root)), 1)

    def test_bad_readback_does_not_lose_pending_work(self):
        event = outbox.enqueue(self.root, "ExampleTask", self.payload)
        for comment in ({"id": "c", "task_id": "OtherTask", "content": outbox.render(event)},
                        {"id": "c", "task_id": "ExampleTask", "content": "truncated"}):
            with self.assertRaises(ValueError):
                outbox.acknowledge(self.root, event["event_id"], comment)
        self.assertEqual(len(outbox.pending(self.root)), 1)

    def test_verified_ack_survives_reenqueue(self):
        event = outbox.enqueue(self.root, "ExampleTask", self.payload)
        outbox.acknowledge(self.root, event["event_id"],
                          {"id": "comment1", "task_id": "ExampleTask", "content": outbox.render(event)})
        outbox.enqueue(self.root, "ExampleTask", self.payload)
        self.assertEqual(outbox.pending(self.root), [])

    def test_changed_evidence_is_a_new_event(self):
        outbox.enqueue(self.root, "ExampleTask", self.payload)
        outbox.enqueue(self.root, "ExampleTask", {**self.payload, "evidence": ["New test failed."]})
        self.assertEqual(len(outbox.pending(self.root)), 2)

    def test_hook_bounded_and_does_not_store_message(self):
        data = {"hook_event_name": "Stop", "session_id": "s", "last_assistant_message": "Private sentence"}
        self.assertEqual(outbox.hook(self.root, data)["decision"], "block")
        self.assertEqual(outbox.hook(self.root, data), {})
        self.assertEqual(outbox.hook(self.root, {**data, "stop_hook_active": True}), {})
        for p in self.root.rglob("*.json"):
            self.assertNotIn("Private sentence", p.read_text())

    def test_hook_ignores_subagent_and_interrupted_input(self):
        self.assertEqual(outbox.hook(self.root, {"hook_event_name": "Stop", "agent_id": "child"}), {})
        self.assertEqual(outbox.hook(self.root, {"hook_event_name": "SessionEnd"}), {})

    def test_unavailable_connector_remains_pending_on_next_start(self):
        outbox.enqueue(self.root, "ExampleTask", self.payload)
        context = outbox.hook(self.root, {"hook_event_name": "SessionStart"})
        self.assertIn("1 pending", context["hookSpecificOutput"]["additionalContext"])

    def test_no_transcript_or_credential_payload(self):
        with self.assertRaises(ValueError):
            outbox.validate({**self.payload, "transcript": "not allowed"})
        with self.assertRaises(ValueError):
            outbox.validate({**self.payload, "summary": "sk-ant-secretvalue"})

    def test_private_state_cannot_be_saved_in_repo(self):
        with patch.dict(outbox.os.environ, {"ATLAS_COORDINATION_STATE_DIR": str(outbox.ROOT / "private")}):
            with self.assertRaises(ValueError):
                outbox.state_dir()

    def test_event_id_cannot_escape_queue_directory(self):
        with self.assertRaises(ValueError):
            outbox.acknowledge(self.root, "../../other", {})


if __name__ == "__main__":
    unittest.main()
