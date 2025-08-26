if('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then( (regisration)=> {
                console.log('sw enregistré')
                console.log(regisration)
            })
            .catch( err => {
                console.log('sw registration failed: ' + err)
            })
    })
}