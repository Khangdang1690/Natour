// eslint-disable-next-line no-undef
export const displayMap = (locations) => {
  // Validate locations
  if (!locations || locations.length === 0) {
    console.error('No locations provided');
    return;
  }

  // Find map container
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found');
    return;
  }

  // Validate Mapbox and access token
  if (!mapboxgl) {
    console.error('Mapbox GL JS not loaded');
    return;
  }

  // Use access token from environment
  const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
  if (!accessToken) {
    console.error('Mapbox Access Token not found');
    return;
  }
  mapboxgl.accessToken = accessToken;
  console.log('Mapbox Access Token:', accessToken);

  // Log raw locations
  console.log('Raw Locations:', JSON.stringify(locations, null, 2));

  // Validate and filter locations
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

  // Use first valid location as center or default
  const center = validLocations.length > 0 
    ? validLocations[0].coordinates 
    : [-118.113491, 34.111745]; // Default to Los Angeles

  // Create map
  const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/standard-v1', 
    center: center,
    zoom: 6,
    projection: 'globe', 
    scrollZoom: false
  });

  // Add navigation and fullscreen controls
  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.FullscreenControl());

  // Style loading error handling
  map.on('styleimagemissing', (e) => {
    console.warn('Style image missing:', e);
    
    // Cycle through styles if current style fails
    currentStyleIndex = (currentStyleIndex + 1) % styles.length;
    map.setStyle(styles[currentStyleIndex]);
  });

  // Add markers and popups
  validLocations.forEach((loc) => {
    // Create marker element
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
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
  });

  // Fit bounds if multiple locations
  if (validLocations.length > 1) {
    const bounds = new mapboxgl.LngLatBounds();
    validLocations.forEach(loc => bounds.extend(loc.coordinates));
    
    map.fitBounds(bounds, {
      padding: 100,
      maxZoom: 10
    });
  }

  // Detailed error logging
  map.on('error', (e) => {
    console.error('Detailed Mapbox Error:', {
      error: e.error,
      message: e.error?.message,
      type: e.type,
      source: e.source
    });

    // Attempt to reload style if there's a loading error
    if (e.error && e.error.status === 403) {
      currentStyleIndex = (currentStyleIndex + 1) % styles.length;
      map.setStyle(styles[currentStyleIndex]);
    }
  });

  // Logging
  map.on('load', () => {
    console.log('Mapbox map loaded successfully');
  });

  map.on('error', (e) => {
    console.error('Mapbox Error:', e);
  });
};