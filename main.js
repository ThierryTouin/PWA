console.log('hello depuis main');
const technosDiv = document.querySelector('#technos');

function loadTechnologies(technos) {
    fetch('http://localhost:3001/technos')
        .then(response => {
            response.json()
                .then(technos => {
                    const allTechnos = technos.map(t => `<div><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`)
                            .join('');
            
                    technosDiv.innerHTML = allTechnos; 
                });
        })
        .catch(console.error);
}

loadTechnologies(technos);


/* si mon navigateur supporte les service worker alors j'enregistre le mien */
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js')
        .then(registration => {
            // public vapid generated with web-push
            const publicKey = 'BLMflY-U7mnhIoVU0E9xNHpeq55hL-Tcng2MfF6fU4ZsnrTMPi9H4xrUS1dkRsGsElpkmrCxSBGAcUCz_ULUodQ';

            registration.pushManager.getSubscription().then(subscription => {
                if (subscription) {
                    console.log('subscribtion',subscription);
                    extractKeysFromArrayBuffer(subscription);
                    return subscription;

                } else {
                    // ask for the subscription
                    const convertedKey = urlBase64ToUint8Array(publicKey);
                    return registration.pushManager.subscribe({
                        userVisibleOnly : true,
                        applicationServerKey : convertedKey 
                    })
                    .then(newSubscription => {
                        console.log('newSubscription', newSubscription);
                        extractKeysFromArrayBuffer(newSubscription);                      
                    })
                }
            })
        })
        .catch(err => console.log(err));
}


/* gestion du cache */
if (window.caches) {
    //caches.open('veille-techno-1.0');
    //caches.open('other-1.0');

    /*
    caches.open('veille-techno-1.0').then( cache => {
        cache.addAll([
            'index.html',
            'main.js',
            'vendors/bootstrap4.min.css'
        ])
    })
    */

    caches.keys().then(console.log);
}


/* Notifications */
if (window.Notification && window.Notification !== 'denied') {
    Notification.requestPermission( perm => {
        if(perm === 'granted') {
            const options = {
                body : 'salut, je suis le body de la notification',
                icon : 'images/icons/icon-72x72.png'
            }

            //const notif = new Notification('Hello notification',options);
        } else {
            console.log('L\'autorisation de recevoir des notifications a été refusée');
        }
    })
}

function extractKeysFromArrayBuffer(subscription) {
    // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
    const keyArrayBuffer = subscription.getKey('p256dh');
    const authArrayBuffer = subscription.getKey('auth');
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)));
    console.log('p256dh key', keyArrayBuffer, p256dh);
    console.log('auth key', authArrayBuffer, auth);
}


function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  
