// Atlas Daily OS — send-push Edge Function
//
// Sends a Web Push notification to every device subscribed for the authenticated user.
//
// Auth: caller must include their Supabase JWT in the Authorization header. RLS on
// atlas_push_subscriptions then scopes the SELECT to only that user's rows.
//
// Secrets (set in Supabase dashboard → Edge Functions → Secrets):
//   VAPID_PRIVATE_KEY   (32-byte raw private key, base64url)
//   VAPID_SUBJECT       optional, defaults to mailto:serratosalex20@gmail.com
//
// Public VAPID key is hardcoded below because it is, by design, public.
//
// Request body: { title?: string, body?: string, tag?: string, url?: string }
// Response:     { sent: number, failed: number, deadRemoved: number }

// deno-lint-ignore-file no-explicit-any
import webpush from 'npm:web-push@3.6.7';
import { createClient } from 'npm:@supabase/supabase-js@2.45.4';

const VAPID_PUBLIC = 'BAo_6citaaOGfWkdEG3YfLySs1mi_jHWIufeag0i4vurDG0jmJZmJoHsC4IHyqyeS_DDfTdfmygcRuKd11rdfTg';
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY');
const VAPID_SUBJECT = Deno.env.get('VAPID_SUBJECT') || 'mailto:serratosalex20@gmail.com';

if (!VAPID_PRIVATE) {
  console.error('[send-push] VAPID_PRIVATE_KEY env var is not set. Function will 500 until configured.');
} else {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
}

Deno.serve(async (req: Request) => {
  // CORS preflight + browser invocation support
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, content-type, apikey, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders });

  if (!VAPID_PRIVATE) {
    return new Response(JSON.stringify({ error: 'VAPID_PRIVATE_KEY not configured on server.' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Forward the caller's JWT so RLS applies — we only ever see this user's rows.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Invalid auth' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: any = {};
  try { body = await req.json(); } catch { /* ignore — defaults below */ }

  const payload = JSON.stringify({
    title: body.title || 'Atlas',
    body:  body.body  || 'Time to check in.',
    tag:   body.tag   || 'atlas-reminder',
    url:   body.url   || 'https://atlas-daily-planner.vercel.app',
  });

  const { data: subs, error: subErr } = await supabase
    .from('atlas_push_subscriptions')
    .select('id, endpoint, p256dh, auth');

  if (subErr) {
    return new Response(JSON.stringify({ error: subErr.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  if (!subs || subs.length === 0) {
    return new Response(JSON.stringify({ sent: 0, failed: 0, deadRemoved: 0, note: 'No subscriptions for this user' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const results = await Promise.allSettled(subs.map((s: any) => {
    const subscription = { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } };
    return webpush.sendNotification(subscription, payload);
  }));

  // Prune dead subscriptions (410 Gone or 404 Not Found from the push service).
  const deadIds: string[] = [];
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      const sc = (r.reason as any)?.statusCode;
      if (sc === 410 || sc === 404) deadIds.push(subs[i].id);
    }
  });
  if (deadIds.length) {
    await supabase.from('atlas_push_subscriptions').delete().in('id', deadIds);
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - sent;
  return new Response(JSON.stringify({ sent, failed, deadRemoved: deadIds.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
