function initialiseMap() {
  // Centred on the UK
  const map = L.map('map').setView([55.505, -4.2], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
}

function ajaxRequest(url, onSuccess, method='GET') {
  const req = new XMLHttpRequest();
  req.open(method, baseUrl + url);
  req.onload = onSuccess;
  req.send(null);
}

let data = '';
initialiseMap();
const baseUrl = 'http://127.0.0.1:5000'
ajaxRequest('/la-data/E09000012', function() {
  console.log(this.status);
  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    data = JSON.parse(this.responseText);
    const postcodes = data.rows.map(row => row['postcode'].replace(' ', ''));
    // Now look up postcodes
    ajaxRequest('/postcodes/' + postcodes.join('|'), function() {
      const postcodeData = JSON.parse(this.responseText).result;
      data['rows'].forEach(row => {
        const matchingRow = postcodeData.find(p => p.result['postcode'] === row['postcode']).result;
        row['latitude'] = matchingRow['latitude'];
        row['longitude'] = matchingRow['longitude'];
      })
    }, 'POST');
  }
});
