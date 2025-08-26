  //test ajax
  fetch('https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/item/voyages')
  .then(r => r.json())
  .then(r => {
    console.log(r)
    document.querySelector('.voyage').innerText = r['voyages-label']
  })