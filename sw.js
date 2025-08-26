const version = 1.2

const urlsToCache = [
    "/",
    "/index.html",
    "/style.css",
    "/main.js",
    "/install.js",
    "/manifest.json",
    "/favicon.ico",
    "/register-sw.js",
    "/sw.js",
    "/icons/favicon-16x16.png",
    "/icons/favicon-256x256.png",
    "/icons/favicon-32x32.png",
    "/icons/favicon-96x96.png",
    "/screenshots/screenshot-landscape.png",
    "/screenshots/screenshot-portrait.png",
    "https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/item/voyages"
]

const cacheVersion = 1

const CACHE_NAME = `pwa-cache-${cacheVersion}`

//install
self.addEventListener('install', e => {
    console.log('sw installed')
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    )
    return self.skipWaiting()
})

self.addEventListener('activate', e => {
    console.log('sw actived')
    return self.clients.claim()
})


//proxy
// Intercepte toutes les requêtes réseau (fetch)
self.addEventListener("fetch", (e) => {
  // Ne prend en charge que les requêtes GET.
  // Pour POST/PUT/DELETE... on laisse le navigateur gérer (pas de respondWith).
  if (e.request.method !== "GET") return;

  // On remplace la réponse par notre logique de cache/réseau
  e.respondWith(
    // 1) Regarder d'abord dans le Cache Storage s'il existe déjà une réponse
    caches.match(e.request).then((cached) => {
      if (cached) return cached; // ✅ Ressource trouvée en cache → on la renvoie tout de suite (cache-first)

      // 2) Sinon, on va sur le réseau
      return fetch(e.request)
        .then((resp) => {
          // Les Response sont des streams consommables une seule fois.
          // On clone pour pouvoir à la fois renvoyer la réponse au navigateur ET l’enregistrer dans le cache.
          const clone = resp.clone();

          // On ne met en cache que si:
          // - la réponse est OK (status 200-299)
          // - la ressource est de même origine (évite de stocker des réponses opaques/CORS)
          if (
            resp.ok &&
            new URL(e.request.url).origin === self.location.origin
          ) {
            // Mise en cache en "runtime" (asynchrone, on n'attend pas)
            caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
          }

          // On renvoie la réponse réseau au navigateur
          return resp;
        })
        .catch(() => {
          // 3) Ici on arrive si le réseau échoue (offline, DNS, etc.)

          // Si la requête est une navigation (ex: refresh / saisie d'URL),
          // on renvoie l'index de la SPA pour avoir un fallback hors-ligne.
          if (e.request.mode === "navigate") {
            return caches.match("/index.html");
          }

          // Pour les autres requêtes (images, CSS, etc.) sans fallback spécifique,
          // on renvoie une réponse "Offline" 503.
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
          });
        });
    })
  );
});
