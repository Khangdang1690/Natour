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

  // Create a new Mapbox map
  const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12',
    scrollZoom: false,
    center: center,
    zoom: 6
  });

  // Add detailed error logging
  map.on('error', (e) => {
    console.error('Detailed Mapbox Error:', {
      error: e.error,
      message: e.error?.message,
      type: e.type,
      source: e.source
    });
  });

  // Create bounds manually to avoid fitBounds error
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
  });

  // Only adjust bounds if we have multiple locations
  if (validLocations.length > 1) {
    try {
      // Calculate padding and adjust map view
      const padding = 1.2; // Add 20% padding
      const lngSpan = maxLng - minLng;
      const latSpan = maxLat - minLat;

      const centerLng = (minLng + maxLng) / 2;
      const centerLat = (minLat + maxLat) / 2;

      map.setCenter([centerLng, centerLat]);
      
      // Calculate appropriate zoom level
      const zoom = Math.min(
        map.getZoom(), 
        Math.log2(360 / (lngSpan * padding))
      );
      
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