console.log("hello depuis le service worker");

self.addEventListener('install', evt => {
    console.log('install evt : ' , evt);
})

self.addEventListener('activate', evt => {
    console.log('activate evt : ', evt);
})

self.addEventListener('fetch', evt => {
    console.log('fetch evt sur url : ', evt.request.url);
})