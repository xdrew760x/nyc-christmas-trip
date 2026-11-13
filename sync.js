// Shared sync for the trip planner, using Firebase Firestore.
// Each trip's data lives under trips/<code>/..., and the code is the secret part
// of the link (#trip=...). It never goes to GitHub, and the Firestore rules
// refuse to list trips, so only someone with the link can read or write.
(() => {
  const CODE_RE = /^[A-Za-z0-9_-]{20,64}$/;

  function tripCode() {
    const fromHash = new URLSearchParams(location.hash.slice(1)).get("trip");
    let code = CODE_RE.test(fromHash || "") ? fromHash : null;
    if (!code) { try { code = localStorage.getItem("nyc-trip"); } catch {} }
    if (!CODE_RE.test(code || "")) {
      const bytes = crypto.getRandomValues(new Uint8Array(18));
      code = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_");
    }
    try { localStorage.setItem("nyc-trip", code); } catch {}
    if (fromHash !== code) history.replaceState(null, "", location.pathname + location.search + "#trip=" + code);
    return code;
  }

  window.openSharedDb = async () => {
    const cfg = window.FIREBASE_CONFIG;
    if (!cfg || !cfg.projectId || !window.firebase) {
      window.SYNC_OFF_MSG = "Saved on this phone only. Sync isn't set up yet.";
      return null;
    }
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
    const fs = app.firestore();
    // Keep a copy on the phone so the plan still opens on the subway with no signal.
    try { await fs.enablePersistence({ synchronizeTabs: true }); } catch {}
    const base = "trips/" + tripCode() + "/";
    return {
      doc: path => fs.doc(base + path),
      collection: path => fs.collection(base + path),
    };
  };
})();
