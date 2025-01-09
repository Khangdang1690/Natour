// eslint-disable-next-line no-undef
export const displayMap = (locations) => {
  // Check if Mapbox is available and locations exist
  if (!mapboxgl || !locations || locations.length === 0) {
    console.error('Mapbox or locations not available');
    return;
  }

  // Use environment variable for Mapbox access token
  mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  console.log('Mapbox Access Token:', mapboxgl.accessToken);

  // Find map container
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }

  // Create a new Mapbox map
  const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',
    scrollZoom: false,
    // Add default center and zoom if no locations
    center: locations[0]?.coordinates || [0, 0],
    zoom: 6
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl());

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
  });

  // Only fit bounds if there are multiple locations
  if (locations.length > 1) {
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  }

  // Ensure map is fully loaded
  map.on('load', () => {
    console.log('Mapbox map loaded successfully');
  });

  map.on('error', (e) => {
    console.error('Mapbox error:', e);
  });
};