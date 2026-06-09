// Atlas Daily OS — service worker
// v2: diagnostic logging. Every lifecycle/push event writes to an in-memory ring
// buffer AND broadcasts to all open page clients via postMessage so the page can
// surface a debug panel on mobile (where DevTools is out of reach).
//
// Why this file exists at all: Chrome's PWA install prompt only appears when a
// service worker with a fetch handler is registered against the site. The push
// handler also lives here because Web Push notifications can ONLY be displayed
// from a service worker context.

const SW_VERSION = 'atlas-os-v2';

/* ===== DIAGNOSTIC RING BUFFER + BROADCAST ===== */
// In-memory only (SWs can't reach localStorage). The page mirrors these events
// into a UI panel via the 'message' channel below.
const SW_LOG = [];
const SW_LOG_MAX = 50;

function swLog(level, msg, data) {
  const entry = { t: Date.now(), v: SW_VERSION, level: level, msg: msg, data: data || null };
  SW_LOG.push(entry);
  if (SW_LOG.length > SW_LOG_MAX) SW_LOG.shift();
  try { console.log('[SW]', entry.level, entry.msg, entry.data || ''); } catch (_) {}
  // Fire-and-forget broadcast. matchAll is async; we don't await — push events
  // are time-sensitive and waitUntil() already governs the real work.
  self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    .then(function (cs) {
      cs.forEach(function (c) { try { c.postMessage({ kind: 'sw-log', entry: entry }); } catch (_) {} });
    })
    .catch(function () {});
}

// Allow the page to request the prior buffer (e.g. on reload / panel open).
self.addEventListener('message', function (event) {
  const d = event.data || {};
  if (d.kind === 'get-sw-log') {
    try { event.source && event.source.postMessage({ kind: 'sw-log-snapshot', log: SW_LOG.slice() }); } catch (_) {}
  } else if (d.kind === 'clear-sw-log') {
    SW_LOG.length = 0;
    try { event.source && event.source.postMessage({ kind: 'sw-log-cleared' }); } catch (_) {}
  }
});

/* ===== LIFECYCLE ===== */
self.addEventListener('install', function (event) {
  swLog('info', 'install', { version: SW_VERSION });
  // skipWaiting() lets the new SW activate immediately on update instead of waiting
  // for all clients to close. Safe because we don't have a cache that would invalidate.
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  swLog('info', 'activate', { version: SW_VERSION });
  // claim() means this SW takes control of open pages on the *first* load, not just
  // subsequent ones. Important for the first-time install experience.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  // Deliberate no-op. Required for Chrome's installability check to pass.
});

/* ===== WEB PUSH ===== */
// Fired when a push payload arrives from the send-push Edge Function (via the push
// service: FCM on Android/desktop Chrome, APNs on iOS, Mozilla autopush on Firefox).
self.addEventListener('push', function (event) {
  swLog('info', 'push:received', { hasData: !!event.data, perm: (self.Notification && self.Notification.permission) || 'unknown' });

  let data = { title: 'Atlas', body: 'Time to check in.', tag: 'atlas-reminder', url: 'https://atlas-daily-planner.vercel.app' };
  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
      swLog('info', 'push:parsed-json', { title: data.title, tag: data.tag, hasBody: !!data.body });
    } catch (e) {
      try {
        data.body = event.data.text();
        swLog('warn', 'push:fallback-text', { len: data.body && data.body.length });
      } catch (e2) {
        swLog('error', 'push:parse-failed', { err: String(e2) });
      }
    }
  } else {
    swLog('warn', 'push:no-data', { note: 'using defaults — likely a wake-only push' });
  }

  const isTest = (data.tag || '').indexOf('atlas-test') === 0;
  const opts = {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: data.tag,
    renotify: true,
    vibrate: [120, 60, 120],
    silent: false,
    requireInteraction: isTest,
    data: { url: data.url },
  };

  event.waitUntil((async function () {
    try {
      swLog('info', 'push:showing', { title: data.title, tag: data.tag, isTest: isTest });
      await self.registration.showNotification(data.title, opts);
      swLog('info', 'push:show-resolved');
      // Verify it actually exists in the notification tray. If count is 0 here,
      // the OS layer (Focus Assist, DND, notification budget) is suppressing.
      const got = await self.registration.getNotifications({ tag: data.tag });
      swLog(got.length ? 'info' : 'warn', 'push:verify-after-show', {
        count: got.length,
        tagsFound: got.map(function (n) { return n.tag; })
      });
    } catch (err) {
      swLog('error', 'push:show-failed', {
        err: String(err),
        name: err && err.name,
        stack: err && err.stack ? err.stack.slice(0, 300) : null
      });
    }
  })());
});

// Some push services send a payload-less wake-up; this also fires when the browser
// rotates the endpoint. We log so we can spot silent re-subscribe needs.
self.addEventListener('pushsubscriptionchange', function (event) {
  swLog('warn', 'pushsubscriptionchange', {
    oldEndpoint: event.oldSubscription && event.oldSubscription.endpoint,
    newEndpoint: event.newSubscription && event.newSubscription.endpoint
  });
});

/* ===== NOTIFICATION INTERACTION ===== */
self.addEventListener('notificationclick', function (event) {
  swLog('info', 'notificationclick', { tag: event.notification.tag, url: (event.notification.data || {}).url });
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async function () {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url && c.url.indexOf(self.location.origin) === 0 && 'focus' in c) {
        if ('navigate' in c) { try { await c.navigate(target); } catch (_) {} }
        return c.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});

self.addEventListener('notificationclose', function (event) {
  swLog('info', 'notificationclose', { tag: event.notification.tag });
});
