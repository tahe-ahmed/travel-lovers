import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import icon from "./favicon.png";
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

const Map = ({ center, zoom, style, className }) => {
  const mapContainerRef = useRef(null);

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [center.lng, center.lat],
      zoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    map.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    map.on('load', function () {
      map.loadImage(
        icon,
        function (error, image) {
          if (error) throw error;
          map.addImage('custom-marker', image);
          map.addSource('places', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [center.lng, center.lat],
                },
              }]
            },
          });

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
        closeOnClick: false,
      });

      map.on('mouseleave', 'places', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
      });
    });
  }, [center, zoom]);

  return (
    <div
      className={`map ${className}`}
      ref={mapContainerRef}
      style={style}
    ></div>
  );
};

export default Map;
