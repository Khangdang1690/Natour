// eslint-disable-next-line no-undef
export const displayMap = (locations) => {
  // Detailed logging of locations
  console.log('Raw Locations:', JSON.stringify(locations, null, 2));

  // Check if Mapbox is available and locations exist
  if (!mapboxgl || !locations || locations.length === 0) {
    console.error('Mapbox or locations not available');
    return;
  }

  // Validate access token
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('Mapbox Access Token is not defined');
    return;
  }

  // Use environment variable for Mapbox access token
  mapboxgl.accessToken = accessToken;
  console.log('Mapbox Access Token:', accessToken);

  // Find map container
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }

  // Validate and transform locations
  const validLocations = locations.filter(loc => {
    const isValid = loc.coordinates && 
                    Array.isArray(loc.coordinates) && 
                    loc.coordinates.length === 2 &&
                    !isNaN(loc.coordinates[0]) && 
                    !isNaN(loc.coordinates[1]);
    
    if (!isValid) {
      console.error('Invalid location:', loc);
    }
    return isValid;
  });

  console.log('Valid Locations:', JSON.stringify(validLocations, null, 2));

  // If no valid locations, use a default center
  const defaultCenter = [-118.113491, 34.111745]; // Los Angeles as default
  const center = validLocations.length > 0 
    ? validLocations[0].coordinates 
    : defaultCenter;

  // Create a new Mapbox map with explicit configuration
  const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',
    scrollZoom: false,
    center: center,
    zoom: 6,
    attributionControl: false,
    failIfMajorPerformanceCaveat: false
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl());

  // Add detailed error logging
  map.on('error', (e) => {
    console.error('Detailed Mapbox Error:', {
      error: e.error,
      message: e.error?.message,
      type: e.type,
      source: e.source
    });
  });

  // Manually calculate bounds
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  validLocations.forEach((loc) => {
    const [lng, lat] = loc.coordinates;
    
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);

    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.width = '32px';
    el.style.height = '40px';
    el.style.backgroundImage = 'url(/img/pin.png)';
    el.style.backgroundSize = 'cover';

    // Add marker
    new mapboxgl.Marker(el)
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
  });

  // Adjust map view
  if (validLocations.length > 1) {
    try {
      const padding = 1.2; // Add 20% padding
      const centerLng = (minLng + maxLng) / 2;
      const centerLat = (minLat + maxLat) / 2;

      map.setCenter([centerLng, centerLat]);
      
      // Calculate zoom based on longitude span
      const lngSpan = maxLng - minLng;
      const zoom = Math.max(4, Math.min(
        10, 
        Math.log2(360 / (lngSpan * padding))
      ));
      
      map.setZoom(zoom);
    } catch (error) {
      console.error('Error adjusting map view:', error);
    }
  }

  // Ensure map is fully loaded
  map.on('load', () => {
    console.log('Mapbox map loaded successfully');
  });
};