 
  //test ajax
  fetch('https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/item/voyages')
  .then(r => r.json())
  .then(r => {
    console.log(r)
    document.querySelector('.voyage').innerText = r['voyages-label']
    document.querySelector('.description').innerHTML = r['voyages-description']
    document.querySelector('.prix').innerText = r['voyages-prix']
  })

