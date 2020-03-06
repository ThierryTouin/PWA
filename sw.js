console.log("hello depuis le service worker");

const cacheName = 'veille-techno-1.2';

self.addEventListener('install', evt => {
    console.log('install evt : ' , evt);

    const cachePromise = caches.open(cacheName).then( cache => {
        return cache.addAll([
            'index.html',
            'main.js',
            'vendors/bootstrap4.min.css',
            'style.css',
            'add_techno.html',
            'add_techno.js',
            'contact.html',
            'contact.js',
        ])
    });

    evt.waitUntil(cachePromise);
});

self.addEventListener('activate', evt => {
    console.log('activate evt : ', evt);

    let cacheCleanPromise = caches.keys().then( keys => {
        keys.forEach( key => {
            if (key !== cacheName) {
                return caches.delete(key);
            }
        })
    })

    evt.waitUntil(cacheCleanPromise);

});

self.addEventListener('fetch', evt => {

    /*
    if (!navigator.onLine) {
        const headers = { headers : { 'content-type' : 'text/html;charset=utf-8'}};
        evt.respondWith(new Response('<h1>Pas de connection Internet. éééé, Veuillez vous connecter !</h1>',headers));
    }
    */

    console.log('fetch evt sur url : ', evt.request.url);


    // Stratégie : cache only with network fallback
    /*
    evt.respondWith(
        caches.match( evt.request ).then( res => {
            console.log('Match with cache !');
            if (res) {
                console.log(`Url fetchée depuis le cache ${evt.request.url}`, res);
                return res;
            } 
            return fetch(evt.request).then( newResponse => {
                console.log(`Url récupérée sur le réseau puis mise en cache ${evt.request.url}`, res, newResponse);
                caches.open(cacheName).then( cache => cache.put(evt.request, newResponse));
                return newResponse.clone();
            })
            
        }    
    ))
    */

    // Stratégie : network with cache fallback
    evt.respondWith(

        fetch(evt.request).then(res => {
            console.log(`${evt.request.url} fetchée depuis le réseau`);
            caches.open(cacheName).then( cache => cache.put(evt.request, res));
            return res.clone();
        }).catch( err => {
            console.log(`${evt.request.url} fetchée depuis le cache`);
            return caches.match(evt.request)
        }
        )

    );

});


self.registration.showNotification('Notification depuis le service worker',{
    body : 'body de la notification persistante',
    actions : [
        {action : 'accept', title : 'accepter'},
        {action : 'refuse', title : 'refuser'}
    ]
});

self.addEventListener('notificationclose', evt => {
    console.log('notification fermée', evt);
});

self.addEventListener('notificationclick', evt => {
    if (evt.action === 'accept' ) {
        console.log('Vous avez accepté');
    } else if (evt.acion === 'refuse') {
        console.log('Vous avez refusé'); 
    } else {
        console.log('Vous avez cliqué sur la notification mais pas sur les boutons !');
    };

    evt.notification.close();
})