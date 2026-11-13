# NYC Christmas Trip

A trip planner page for Dec 20–24 that works on our phones. Answer Keep / Maybe / Pass for each place, and see the route map, the day-of guide and the list of tickets to book.

- **Hosting:** GitHub Pages (`index.html` is the whole app).
- **Sync:** Firebase Firestore. The config is in `config.js` and the access rules are in `firestore.rules`.
  Picks are stored under `trips/<code>/`, where `<code>` comes from the secret `#trip=...` part of our shared link.
  If `config.js` is empty, the page saves on each phone only.
- **On the phone:** open the shared link, then Share and Add to Home Screen.
