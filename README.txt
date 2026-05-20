ATLAS — DAILY OS  ·  deploy in ~60 seconds
===========================================

EASIEST (no account, instant URL):
1. Go to  app.netlify.com/drop
2. Drag this whole folder onto the page.
3. You get a live https:// URL immediately. Open it on your phone →
   Share → "Add to Home Screen." Done — it's now an app icon.

YOUR STACK (Vercel):
1. Install once:   npm i -g vercel
2. In this folder: vercel
   (it opens a browser to log in, then deploys — accept the defaults)
3. For the permanent URL:  vercel --prod
4. Open the URL on your phone → Add to Home Screen.

NOTES
- Everything saves to your phone's local storage (checkmarks, tasks,
  Top 3, and your daily log/history all persist).
- To update the schedule later, just ask Atlas for a new index.html,
  drop it in, and redeploy (or run `vercel --prod` again).
