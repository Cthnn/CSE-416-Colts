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

      const VADemographic = `
        <div>District 2 Demographics</div>
        <table style="font-size:10px; padding: 0px !important;">
        <tr>
          <th>White</th>
          <th>Black</th>
          <th>Hispanic</th>
          <th>Asian</th>
          <th>Pacific Islander</th>
          <th>American Indians</th>
        </tr>
        <tr>
          <th>73%</th>
          <th>12%</th>
          <th>1%</th>
          <th>5%</th>
          <th>1%</th>
          <th>6%</th>
        </tr>
        </table>
      `
      var toolbar = new Toolbar();
      map.addControl(toolbar, 'top-left');
      

      map.on('load', function () {
        // Add a source for the state polygons.
        map.resize();
        map.addSource('VA', {
          'type': 'geojson',
          'data':
          'https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/VA/shape.geojson'
        });
        map.addSource('AL', {
          'type': 'geojson',
          'data': 'https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/AL/shape.geojson'
      });
      map.addSource('FL', {
        'type': 'geojson',
        'data':
          'https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/FL/shape.geojson'
        });
        map.addSource('AL-Congressional', {
          'type': 'geojson',
          'data':
          'https://raw.githubusercontent.com/JeffreyBLewis/congressional-district-boundaries/master/Alabama_108_to_112.geojson'
        });
        map.addSource('FL-Congressional', {
          'type': 'geojson',
          'data':
          'https://raw.githubusercontent.com/JeffreyBLewis/congressional-district-boundaries/master/Florida_108_to_112.geojson'
        });
        map.addSource('VA-Congressional', {
          'type': 'geojson',
          'data':
          'https://raw.githubusercontent.com/JeffreyBLewis/congressional-district-boundaries/master/Virginia_108_to_112.geojson'
        });
        map.addSource('AL-Precinct', {
          'type': 'geojson',
          'data':
          './alabama-precincts.geojson'
        });
        map.addSource('FL-Precinct', {
          'type': 'geojson',
          'data':
          './florida-precincts.geojson'
        });
        map.addSource('VA-Precinct', {
          'type': 'geojson',
          'data':
          'virginia-precincts.geojson'
        });

        map.addLayer({
          'id': 'VA-Precincts',
          'type': 'fill',
          'source': 'VA-Precinct', 
          'layout':{
            'visibility':'none'
          },
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });

        map.addLayer({
          'id': 'AL-Precincts',
          'type': 'fill',
          'source': 'AL-Precinct',
          'layout':{
            'visibility':'none'
          },
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });

        map.addLayer({
          'id': 'FL-Precincts',
          'type': 'fill',
          'source': 'FL-Precinct',
          'layout':{
            'visibility':'none'
          },
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });

        map.addLayer({
          'id': 'AL-Districts',
          'type': 'fill',
          'source': 'AL-Congressional',
          'layout':{
            'visibility':'none'
          },
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        map.addLayer({
          'id': 'FL-Districts',
          'type': 'fill',
          'source': 'FL-Congressional',
          'layout':{
            'visibility':'none'
          },
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        map.addLayer({
          'id': 'VA-Districts',
          'type': 'fill',
          'source': 'VA-Congressional',
          'layout':{
            'visibility':'none'
          },
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(240, 240, 40, 1)'
          }
        });
        map.addLayer({
          'id': 'AL-Layer',
          'type': 'fill',
          'source': 'AL',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        

        map.on('click', 'AL-Layer', function (e) {
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
          console.log(bounds.getCenter());
          map.flyTo({
            center: bounds.getCenter(),
            zoom: 6
          })
          toolbar.changeLayer(map);
          var params = JSON.stringify({
            'name': 'Alabama'
          })
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });
        map.on('mouseenter', 'AL-Layer', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'AL-Layer', function () {
          map.getCanvas().style.cursor = '';
        });
        map.on('click', function (e){
          var district_button_value = document.getElementById('district-checkbox').checked;
          var precinct_button_value = document.getElementById('precinct-checkbox').checked;
          var features = null;
          if(precinct_button_value){
            features = map.queryRenderedFeatures(e.point, {layers: ['AL-Precincts','FL-Precincts','VA-Precincts']});
          }
          else{
            if(district_button_value){
              console.log("TESTTES");
              features = map.queryRenderedFeatures(e.point, {layers: ['AL-Districts','FL-Districts','VA-Districts']});
            }
          }
          // console.log(features);
          if(features === null || !features.length){
            return;
          }
          if (typeof map.getLayer('selectedFeature') !== "undefined" ){         
            map.removeLayer('selectedFeature');
            map.removeSource('selectedFeature');   
          }
          var feature = features[0];
          map.addSource('selectedFeature', {
            "type": "geojson",
            "data": feature.toJSON()
          });
          map.addLayer({
            'id': 'selectedFeature',
            'type': 'fill',
            'source': 'selectedFeature',
            'paint': {
              'fill-color': 'rgba(50, 50, 210, 0.4)',
              'fill-outline-color': 'rgba(50, 50, 210, 1)'
            }
          });
        })
        map.addLayer({
          'id': 'FL-Layer',
          'type': 'fill',
          'source': 'FL',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        
        map.on('click', 'FL-Layer', function (e) {
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
          // console.log(bounds.getCenter());
          map.flyTo({
            center: bounds.getCenter(),
            zoom: 6
          })
          toolbar.changeLayer(map);
          var params = JSON.stringify({
            'name': 'Florida'
          })
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });
        map.on('mouseenter', 'FL-Layer', function () {
        map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'FL-Layer', function () {
          map.getCanvas().style.cursor = '';
        });
        map.addLayer({
          'id': 'VA-Layer',
          'type': 'fill',
          'source': 'VA',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
        });
        
        map.on('click', 'VA-Layer', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(VADemographic)
            .addTo(map);
      
          var features = e.features
          var bounds = new mapboxgl.LngLatBounds();

          document.getElementById('state-selection').value = 'VA';
          console.log(document.getElementById('state-selection').value);

          features.forEach(function(feature){
            feature.geometry.coordinates.forEach(function(coord){
              coord.forEach(function(coordinate_pair){
                bounds.extend(coordinate_pair)
              })
            })
          })
          console.log(bounds.getCenter());
          map.flyTo({
            center: bounds.getCenter(),
            zoom: 5
          })
          toolbar.changeLayer(map);
          var params = JSON.stringify({
            'name': 'Virginia'
          })
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });
        map.on('mouseenter', 'VA-Layer', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'VA-Layer', function () {
          map.getCanvas().style.cursor = '';
        });
      });
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      return () => map.remove();
    }, []); 
    return<div className="map" ref={mapContainerRef} />;
};
function makeVisible(state, map) {
  var enable = false;
  if (enable) {
    var layers = ['AL-layer', 'FL-layer', 'TX-layer'];
    var layer_id = -1;
    for (var i = 0; i < layers.length; i++) {
      if (layers[i].substring(0, 2) == state) {
        layer_id = i;
        break;
      }
    }
    if (layer_id != -1) {
      for (var i = 0; i < layers.length; i++) {
        if (i == layer_id) {
          map.setLayoutProperty(layers[layer_id], 'visibility', 'visible');
        }
        else {
          map.setLayoutProperty(layers[i], 'visibility', 'none');
        }
      }
    }
  }
}


export default MapComponent;