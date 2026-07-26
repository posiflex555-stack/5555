/*=========================================
   Service Worker V1
   إدارة فواتير السواقين
=========================================*/

const CACHE_NAME = "drivers-pos-v1.0.1";

const urlsToCache = [

"./",
"./index.html",
"./driver.html",
"./settings.html",
"./invoice-history.html",
"./style.css",

"./script.js",
"./driver.js",
"./settings.js",
  "./invoice-history.js", 
"./data.js",

"./manifest.json",

"./driver-icon-192.png",
"./driver-icon-512.png"

];

/*=========================================
    تثبيت
=========================================*/

self.addEventListener("install",event=>{

event.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>{

return cache.addAll(urlsToCache);

})

);

self.skipWaiting();

});

/*=========================================
    تشغيل
=========================================*/

self.addEventListener("activate",event=>{

event.waitUntil(

caches.keys()

.then(keys=>{

return Promise.all(

keys.map(key=>{

if(key!==CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});

/*=========================================
    جلب الملفات
=========================================*/

self.addEventListener("fetch",event=>{

event.respondWith(

caches.match(event.request)

.then(response=>{

if(response){

return response;

}

return fetch(event.request)

.then(networkResponse=>{

if(

event.request.method==="GET"

){

const clone=networkResponse.clone();

caches.open(CACHE_NAME)

.then(cache=>{

cache.put(event.request,clone);

});

}

return networkResponse;

})

.catch(()=>{

return caches.match("./index.html");

});

})

);

});
