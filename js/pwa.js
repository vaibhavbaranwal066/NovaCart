if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("PWA: Service Worker Registered"))
      .catch(err => console.log("SW error", err));
  });
}
