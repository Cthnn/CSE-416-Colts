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
        map.addSource('TX', {
          'type': 'geojson',
          'data':
          'https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/TX/shape.geojson'
        });
        map.addSource('AL', {
          'type': 'geojson',
          'data':
          'https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/AL/shape.geojson'
        });
        map.addSource('FL', {
          'type': 'geojson',
          'data':
          'https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/FL/shape.geojson'
        });
        map.addLayer({
          'id': 'AL-layer',
          'type': 'fill',
          'source': 'AL',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        
        map.on('click', 'AL-layer', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Alabama")
            .addTo(map);
        });
        map.on('mouseenter', 'AL-layer', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'AL-layer', function () {
          map.getCanvas().style.cursor = '';
        });
        
        map.addLayer({
          'id': 'FL-layer',
          'type': 'fill',
          'source': 'FL',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        
        map.on('click', 'FL-layer', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Florida")
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
        map.on('mouseenter', 'FL-layer', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'FL-layer', function () {
          map.getCanvas().style.cursor = '';
        });
        map.addLayer({
          'id': 'TX-layer',
          'type': 'fill',
          'source': 'TX',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        
        map.on('click', 'TX-layer', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Texas")
            .addTo(map);
        });
        map.on('mouseenter', 'TX-layer', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'TX-layer', function () {
          map.getCanvas().style.cursor = '';
        });
      });

      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
      
      return () => map.remove();
    }, []); 

    return<div className="map" ref={mapContainerRef} />;
};

export default MapComponent;