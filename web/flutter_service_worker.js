'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "de742d07a3c74a664766a5d59b5d97ed",
"assets/AssetManifest.bin.json": "171a111205f4e07211559b2a467e0ae4",
"assets/AssetManifest.json": "c7a78f244ad20f79154d7ce78db74e81",
"assets/assets/instruction.png": "65320b526bd1c7bfa8512d4bf3d09bf8",
"assets/assets/kyunghee.png": "35f2df7137cb3b2f52ceb145ff9eca3f",
"assets/assets/map_replace.png": "b9769503459bea08bf666e23f162beb4",
"assets/assets/report.png": "0bdc2f5cdede8d94881476528a95e3d8",
"assets/assets/startup.png": "f0f7d2f14619350433b77c7709673aed",
"assets/assets/title.png": "35ad0702b028b66615e5706149f16258",
"assets/FontManifest.json": "e3ddcba6eb6ddb48344a8b45fe41c88e",
"assets/fonts/MAPLESTORY%2520BOLD.TTF": "b0a6a2693556296fa674f5e4de61810b",
"assets/fonts/MAPLESTORY%2520LIGHT.TTF": "fb932d042f385927ba59e9a690538709",
"assets/fonts/MaterialIcons-Regular.otf": "d4888f70e8f133c40d60ea47d66bb646",
"assets/fonts/NANUMBARUNGOTHIC.TTF": "0384532820e984ca0dc4a140d11b12d4",
"assets/fonts/NANUMBARUNGOTHICBOLD.TTF": "3b18e24ea5237f4d6e2731c17ca7f164",
"assets/fonts/NANUMBARUNGOTHICLIGHT.TTF": "2173408a75c7faf4db58547ecc024fdc",
"assets/fonts/NANUMSQUAREROUNDB.TTF": "ecc61bfabe0637e8367a734e718a4f8e",
"assets/fonts/NANUMSQUAREROUNDL.TTF": "924b9ea5f0305f8dc6371fc4f12da37a",
"assets/fonts/NANUMSQUAREROUNDR.TTF": "4ba97a2a508f59611d45c41e7414ba66",
"assets/fonts/NANUMSQUARE_0.TTF": "ed41466c091f92e47aee24c1962d369d",
"assets/fonts/NANUMSQUARE_ACL.TTF": "657050ee382d17287e986b273621ec95",
"assets/fonts/NANUMSQUARE_ACR.TTF": "0e1f2365ab61e1ea88d2fbdef3952fdb",
"assets/NOTICES": "51735b57fb4960329065baaef38ef8d2",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "49bb2c02e982d223a2173be842afd21c",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"flutter_bootstrap.js": "3b7f87baef10fc6f4c854f3a2830d16d",
"icons/Icon-192.png": "11f45281317fa1d8729594f7b86799da",
"icons/Icon-512.png": "ecb61e97c029b5a7aecfb0c8ecf3899c",
"index.html": "f079c84ff58bf975f19293bd58a9c133",
"/": "f079c84ff58bf975f19293bd58a9c133",
"main.dart.js": "b1daeae2c25185b5ac4d5cdc4d469bd2",
"manifest.json": "448d4d969f060a6d7093fc8596046f06",
"version.json": "57eb944564e0d1a847f4185bacb35772"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
