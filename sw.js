console.log("hello depuis le service worker");

const cacheName = 'veille-techno-1.0';

self.addEventListener('install', evt => {
    console.log('install evt : ' , evt);
    caches.open(cacheName).then( cache => {
        cache.addAll([
            'index.html',
            'main.js',
            'vendors/bootstrap4.min.css',
            'style.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
    })
})

self.addEventListener('activate', evt => {
    console.log('activate evt : ', evt);
})

self.addEventListener('fetch', evt => {

    if (!navigator.onLine) {
        const headers = { headers : { 'content-type' : 'text/html;charset=utf-8'}};
        evt.respondWith(new Response('<h1>Pas de connection Internet. éééé, Veuillez vous connecter !</h1>',headers));
    }

    console.log('fetch evt sur url : ', evt.request.url);


    // Stratégie : cache only with network fallback
    evt.respondWith(
        caches.match( evt.request ).then( res => {
            console.log('Match with cache !');
            if (res) {
                return res;
            } 
            return fetch(evt.request).then( newResponse => {
                caches.open(cacheName).then( cache => cache.put(evt.resquest, newResponse));
                return newResponse.clone();
            })
            
        }    
    ))
})