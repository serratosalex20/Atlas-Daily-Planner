// Atlas Daily OS — service worker
// v1: minimal install-enabler. Push notification handler will be added in the Tier 3
// commit (depends on VAPID keys being provisioned + atlas_push_subscriptions table).
//
// Why this file exists at all: Chrome's PWA install prompt only appears when a service
// worker with a fetch handler is registered against the site, even if the fetch handler
// is a no-op. iOS Safari is laxer (manifest alone is enough), but adding the SW now
// gives identical install UX across iOS, Android, and desktop Chrome/Edge.

const SW_VERSION = 'atlas-os-v1';

self.addEventListener('install', (event) => {
  // skipWaiting() lets the new SW activate immediately on update instead of waiting
  // for all clients to close. Safe because we don't have a cache that would invalidate.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // claim() means this SW takes control of open pages on the *first* load, not just
  // subsequent ones. Important for the first-time install experience.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Deliberate no-op. Required for Chrome's installability check to pass.
  // Future versions may add offline-first caching for the shell HTML + supabase-js,
  // but for now we let the network handle everything (the app is < 100KB anyway).
});

/* ===== WEB PUSH ===== */
// Fired when a push payload arrives from the send-push Edge Function (via the push
// service: FCM on Android/desktop Chrome, APNs on iOS, Mozilla autopush on Firefox).
self.addEventListener('push', (event) => {
  let data = { title: 'Atlas', body: 'Time to check in.', tag: 'atlas-reminder', url: 'https://atlas-daily-planner.vercel.app' };
  if (event.data) {
    try { data = Object.assign(data, event.data.json()); }
    catch (e) { data.body = event.data.text(); }
  }
  // Test pushes stick around (requireInteraction) so you can confirm they arrived
  // even if Windows Focus Assist tries to bury them. Real reminders fade normally.
  const isTest = (data.tag || '').indexOf('atlas-test') === 0;
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: data.tag,                            // dedupes back-to-back same-tag
      renotify: true,                           // force re-display on repeat sends
      vibrate: [120, 60, 120],                  // mobile only, no-op on desktop
      silent: false,                            // override Chrome's "auto-silent for chatty sites"
      requireInteraction: isTest,               // test pushes persist; real reminders fade
      data: { url: data.url },
    })
  );
});

// When the user taps the notification: focus an existing tab if one is open,
// otherwise open a new one. Same-origin URL only.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil((async () => {
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
