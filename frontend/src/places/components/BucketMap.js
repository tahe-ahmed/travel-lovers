import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './BucketMap.css';

const BucketMap = (props) => {

  const mapContainerRef = useRef(null);
  const [mapPlaces, setMapPlaces] = useState(props.placesData);
  const [userLocation] = useState([4.915358, 52.362460]);

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  //Longitude: 7.0262 | Latitude: 43.8411 | Zoom: 0.50

  useEffect(() => {
    setMapPlaces(props.placesData);
  }, [props]);

  useEffect(() => {
    if (mapPlaces) {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: userLocation,
        zoom: 1.00,
      });

      new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      map.on('load', function () {
        map.loadImage(
          'https://res.cloudinary.com/hyf/image/upload/v1602163627/samples/arho61uqcb5ehvfnzxqt.png',
          function (error, image) {
            if (error) throw error;
            map.addImage('custom-marker', image);
            map.addSource('places', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  ...mapPlaces.map((item) => {
                    return {
                      type: 'Feature',
                      properties: {
                        description: `
                          <h4>${item.title}</h4>
                          <div>${item.description}</div>`,

                      },
                      geometry: {
                        type: 'Point',
                        coordinates: [item.location.lng, item.location.lat],
                      },
                    };
                  }),
                ],
              },
            });
            // Add a layer showing the places.
            map.addLayer({
              id: 'places',
              type: 'symbol',
              source: 'places',
              layout: {
                'icon-image': 'custom-marker',
                'icon-allow-overlap': true,
                'icon-size': 0.9,
              },
            });
          }
        );

        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: true,
        });

        map.on('mouseenter', 'places', function (e) {
          map.getCanvas().style.cursor = 'pointer';

          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties.description;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.setLngLat(coordinates).setHTML(description).addTo(map);
        });

        map.on('mouseleave', 'places', function () {
          map.getCanvas().style.cursor = '';
          popup.remove();
        });
      });

    }
    // }
  }, [mapPlaces, userLocation]);



  return (
    <div
      className="map"
      ref={mapContainerRef}
    ></div>
  );
};

export default BucketMap;
