// Service worker : permet à l'appli de s'ouvrir même avec une mauvaise connexion
const CACHE = 'f489-v2';
const FICHIERS = ['./', 'index.html', 'style.css', 'script.js', 'manifest.json',
  'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  // chaque fichier est gardé séparément : un fichier manquant ne bloque plus l'installation
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FICHIERS.map(f => c.add(f).catch(() => {})))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Internet d'abord (pour avoir les mises à jour), sinon la copie gardée
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copie = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copie));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
