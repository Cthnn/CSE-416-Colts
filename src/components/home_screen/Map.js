import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import Toolbar from './Toolbar.js';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    
    useEffect(() => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        // See style options here: https://docs.mapbox.com/api/maps/#styles
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-100.04, 38.907],
        zoom: 3
      });

      var toolbar = new Toolbar();
      map.addControl(toolbar, 'top-left');

      map.on('load', function () {
        // Add a source for the state polygons.
        map.resize();
        map.addSource('states', {
          'type': 'geojson',
          'data':
          'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'
        });
        
        map.addLayer({
          'id': 'states-layer',
          'type': 'fill',
          'source': 'states',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        
        map.on('click', 'states-layer', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.name)
            .addTo(map);

          var features = e.features
          var bounds = new mapboxgl.LngLatBounds();

          features.forEach(function(feature){
            console.log(feature.geometry);
            feature.geometry.coordinates.forEach(function(coord){
              coord.forEach(function(coordinate_pair){
                bounds.extend(coordinate_pair)
              })
              
            })
          })
          map.flyTo({
            center: bounds.getCenter(),
            zoom: 4
          })
        });
        
        map.on('mouseenter', 'states-layer', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'states-layer', function () {
          map.getCanvas().style.cursor = '';
        });
      });

      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      return () => map.remove();
    }, []); 

    return <div className="map" ref={mapContainerRef} />;
};

export default MapComponent;