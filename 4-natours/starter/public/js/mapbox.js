// eslint-disable-next-line no-undef

export const displayMap = (locations) => {
  // Replace 'your-access-token' with your Mapbox access token
  mapboxgl.accessToken =
    'pk.eyJ1Ijoia2hhbmdkYW5nMTIzIiwiYSI6ImNtNWFkN20ydTRqb2wycXBrZzR2bjZmN3cifQ.DkirAUCUzQoY_hipyjowXw';

  // Create a new Mapbox map
  const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 9.5,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
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
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
}