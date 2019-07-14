function initialiseMap() {
  // Centred on the UK
  const map = L.map('map').setView([55.505, -4.2], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}


initialiseMap();
