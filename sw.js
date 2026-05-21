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
