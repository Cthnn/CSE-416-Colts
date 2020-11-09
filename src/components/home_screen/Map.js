import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import Toolbar from './Toolbar.js';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;


const addHeatMapLayer = (map, state) => {
  map.addLayer({
    id: state+'-HeatMap',
    type: 'heatmap',
    source: state+'-heat',
    layout:{
      visibility:'none'
    },
    maxzoom: 15,
    paint: {
      // increase weight as diameter breast height increases
      'heatmap-weight': {
        property: 'T2',
        type: 'exponential',
        stops: [
          [1, 0],
          [62, 1]
        ]
      },
      // increase intensity as zoom level increases
      'heatmap-intensity': {
        stops: [
          [3, 0.1],
          [6, 1],
          [10, 3]
        ]
      },
      // assign color values be applied to points depending on their density
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)'
        ],
      // increase radius as zoom increases
      'heatmap-radius': {
        stops: [
          [3, 1],
          [6, 10],
          [11, 50],
          [12, 200]
        ]
      },
    }
  }, 'waterway-label');
}

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
        <div style="text-align: center;">Precinct 2 Demographics</div>
        <table style="font-size:10px; padding: 0px !important;">
        <tr>
          <th>Race</th>
          <th>Population</th>
        </tr>
        <tr>
          <td>White</td>
          <td>12401</td>
        </tr>
        <tr>
          <td>Black</td>
          <td>5835</td>
        </tr>
        <tr>
          <td>Hispanic</td>
          <td>2551</td>
        </tr>
        <tr>
          <td>Asian</td>
          <td>515</td>
        </tr>
        <tr>
          <td>American Indians</td>
          <td>84</td>
        </tr>
        <tr>
          <td>Pacific Islander</td>
          <td>243</td>
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
        map.addSource('AL-heat', {
          'type': 'geojson',
          'data':
          './alabama_heatmap.geojson'
        });
        map.addSource('FL-heat', {
          'type': 'geojson',
          'data':
          './florida_heatmap.geojson'
        });
        map.addSource('VA-heat', {
          'type': 'geojson',
          'data':
          './virginia_heatmap.geojson'
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

        addHeatMapLayer(map, 'AL');
        addHeatMapLayer(map, 'FL');
        addHeatMapLayer(map, 'VA');
        
        map.on('click', function (e){
          var district_button_value = document.getElementById('district-checkbox').checked;
          var precinct_button_value = document.getElementById('precinct-checkbox').checked;
          var features = null;
          if(precinct_button_value){
            features = map.queryRenderedFeatures(e.point, {layers: ['AL-Precincts','FL-Precincts','VA-Precincts']});
          }
          else{
            if(district_button_value){
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
          console.log(feature);
          var popup = new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(VADemographic);
          
          //Change position in CSS
          popup.id = 'precinct-popup';
          popup.addTo(map);

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
        map.on('click', 'AL-Layer', function (e) {          
          var features = e.features
          var bounds = new mapboxgl.LngLatBounds();

          document.getElementById('state-selection').value = 'AL';
          var elem = document.getElementById('select-state-generation');
          elem.selectedIndex = '1';

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
          var params = JSON.stringify('ALABAMA')
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });
        map.on('click', 'FL-Layer', function (e) {
          var features = e.features
          var bounds = new mapboxgl.LngLatBounds();

          document.getElementById('state-selection').value = 'FL';
          var elem = document.getElementById('select-state-generation');
          elem.selectedIndex = '2';

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
          toolbar.changeLayer(map);
          var params = JSON.stringify('FLORIDA');
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });    
        map.on('click', 'VA-Layer', function (e) {
          var features = e.features
          var bounds = new mapboxgl.LngLatBounds();

          document.getElementById('state-selection').value = 'VA';
          var elem = document.getElementById('select-state-generation');
          elem.selectedIndex = '3';
          // console.log(document.getElementById('state-selection').value);

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
            zoom: 5
          })
          toolbar.changeLayer(map);
          var params = JSON.stringify('VIRGINIA');
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
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
        map.on('mouseenter', 'AL-Layer', function () {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'AL-Layer', function () {
          map.getCanvas().style.cursor = '';
        });
        map.addLayer({
          'id': 'FL-Layer',
          'type': 'fill',
          'source': 'FL',
          'paint': {
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
          }
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


export default MapComponent;