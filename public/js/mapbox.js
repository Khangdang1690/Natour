/* eslint-disable */
export const displayMap = locations => {
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'https://api.mapbox.com/styles/v1/khangdang123/cm5adqlcq00pn01su5n31dbee.html?title=copy&access_token=pk.eyJ1Ijoia2hhbmdkYW5nMTIzIiwiYSI6ImNtNWFiZDMyejNhcTEya3B1eDZwc3ZwdGIifQ.uTPDMWolmqvZ9feRjoZxhw&zoomwheel=true&fresh=true#2/38/-34',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};