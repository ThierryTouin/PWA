console.log("hello depuis le service worker");

self.addEventListener('install', evt => {
    console.log('install evt : ' , evt);
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
})