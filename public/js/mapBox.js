export const displayMap = (locations) => {
  var map = new maplibregl.Map({
    container: 'map',
    style:
      'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', // stylesheet location
    //   center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
    scrollZoom: false,
    //   light: {
    //     anchor: 'viewport',
    //     color: 'white',
    //     intensity: 0.4,
    //   },
  });

  const bounds = new maplibregl.LngLatBounds();
  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    // adding marker
    new maplibregl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new maplibregl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} : ${loc.description} </p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 200, left: 100, right: 100 },
  });
};
