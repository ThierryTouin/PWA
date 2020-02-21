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
        .catch(err => console.log(err));
}


/* gestion du cache */
if (window.caches) {
    //caches.open('veille-techno-1.0');
    //caches.open('other-1.0');

    caches.open('veille-techno-1.0').then( cache => {
        cache.addAll([
            'index.html',
            'main.js',
            'vendors/bootstrap4.min.css'
        ])
    })


    caches.keys().then(console.log);
}