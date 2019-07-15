let map;
let data = '';
const baseUrl = 'http://127.0.0.1:5000'
const energyRatingColours = {
  'A+++': '#00a652',
  'A++': '#50b849',
  'A+': '#c0d731',
  'A': '#fef200',
  'B': '#fcb913',
  'C': '#f37020',
  'D': '#ed1b24',
}
let markerGroup; // For adding and removing markers to the map

function initialiseMap() {
  // Centred on the UK
  map = L.map('map').setView([55.505, -4.2], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  markerGroup = L.layerGroup().addTo(map);
}

function initialiseUI() {
  const uiDiv = document.getElementById('ui');
  const dropdown = document.createElement('select');
  for (let la in localAuthorities) {
    const option = document.createElement('option');
    option.setAttribute('value', localAuthorities[la]);
    option.textContent = la;
    dropdown.appendChild(option);
  }
  dropdown.addEventListener('change', onDropdownChange);
  uiDiv.appendChild(dropdown);
}

function onDropdownChange(event) {
  // Get the data for a particular local authority
  const laCode = event.target.value;
  ajaxRequest(`/la-data/${laCode}`, onResponse);
}

function ajaxRequest(url, onSuccess, method='GET', body) {
  const req = new XMLHttpRequest();
  req.open(method, baseUrl + url);
  req.onload = onSuccess;
  if (body) {
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  }
  req.send(JSON.stringify(body));
}

function onPostcodeResponse() {
  markerGroup.clearLayers();
  const postcodeData = JSON.parse(this.responseText).result;
  for (row of data['rows']) {
    const matchingRow = postcodeData.find(
      p => p.result['postcode'] === row['postcode']
    ).result;
    const { latitude, longitude } = matchingRow;
    row['latitude'] = latitude;
    row['longitude'] = longitude;
    const circleOptions = {
      radius: 200,
      stroke: false,
      fillColor: energyRatingColours[row['current-energy-rating']],
      fillOpacity: 0.8
    }
    markerGroup.addLayer(
      L.circle(L.latLng(latitude, longitude), circleOptions)
    );
  }
  const lats = data['rows'].map(row => row['latitude']);
  const longs = data['rows'].map(row => row['longitude']);
  map.fitBounds([
    [Math.min(...lats), Math.min(...longs)],
    [Math.max(...lats), Math.max(...longs)]
  ]);
}

function onResponse() {
  console.log(this.status);
  if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
    data = JSON.parse(this.responseText);
    const postcodes = data.rows.map(row => row['postcode'].replace(' ', ''));
    // Now look up postcodes
    ajaxRequest('/postcodes', onPostcodeResponse, 'POST', postcodes);
  }
}

// Create the map
initialiseMap();
// Create the UI
initialiseUI();
