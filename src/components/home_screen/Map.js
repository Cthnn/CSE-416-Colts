import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import Toolbar from './Toolbar.js';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

const MapComponent = ({props}) => {
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
          
          
          var features = e.features
          var bounds = new mapboxgl.LngLatBounds();

          document.getElementById('state-selection').value = 'AL';

          features.forEach(function(feature){
            feature.geometry.coordinates.forEach(function(coord){
              coord.forEach(function(coordinate_pair){
                bounds.extend(coordinate_pair)
              })
            })
          })
          map.flyTo({
            center: bounds.getCenter(),
            zoom: 6
          })
          makeVisible('AL', map);
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

          document.getElementById('state-selection').value = 'FL';

          features.forEach(function(feature){
            feature.geometry.coordinates.forEach(function(coord){
              coord.forEach(function(coordinate_pair){
                bounds.extend(coordinate_pair)
              })
            })
          })
          map.flyTo({
            center: bounds.getCenter(),
            zoom: 6
          })
          makeVisible('FL', map);
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
          var features = e.features
          var bounds = new mapboxgl.LngLatBounds();

          document.getElementById('state-selection').value = 'TX';
          console.log(document.getElementById('state-selection').value);

          features.forEach(function(feature){
            feature.geometry.coordinates.forEach(function(coord){
              coord.forEach(function(coordinate_pair){
                bounds.extend(coordinate_pair)
              })
            })
          })
          map.flyTo({
            center: bounds.getCenter(),
            zoom: 6
          })
          makeVisible('TX', map); 
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


function makeVisible(state, map){
  var enable = false;
  if(enable){
    var layers = ['AL-layer','FL-layer','TX-layer'];
    var layer_id = -1;
    for(var i = 0; i < layers.length; i++){
      if(layers[i].substring(0,2) == state){
        layer_id = i;
        break;
      }
    }
    if(layer_id != -1){
      for(var i = 0; i < layers.length; i++){
        if(i == layer_id){
          map.setLayoutProperty(layers[layer_id], 'visibility', 'visible');
        }
        else{
          map.setLayoutProperty(layers[i], 'visibility', 'none');
        }
      }
    }
  }
}

export default MapComponent;