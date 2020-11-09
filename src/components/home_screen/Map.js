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
        map.addSource('AL-heat', {
          'type': 'geojson',
          'data':
          './alabama_heatmap.geojson'
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

        map.addLayer({
          id: 'AL-heat',
          type: 'heatmap',
          source: 'AL-heat',
          maxzoom: 15,
          paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
              property: 'WHITE',
              type: 'exponential',
              stops: [
                [1, 0],
                [62, 1]
              ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
              stops: [
                [11, 1],
                [15, 3]
              ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(236,222,239,0)',
              0.2, 'rgb(208,209,230)',
              0.4, 'rgb(166,189,219)',
              0.6, 'rgb(103,169,207)',
              0.8, 'rgb(28,144,153)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
              stops: [
                [11, 15],
                [15, 20]
              ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
              default: 1,
              stops: [
                [14, 1],
                [15, 0]
              ]
            },
          }
        }, 'waterway-label');
        

        map.on('click', 'AL-Layer', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Alabama")
            .addTo(map);
          
          
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
            .setHTML("Feature properties not normalized for now");
          
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
        map.on('click', 'FL-Layer', function (e) {
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML("Florida")
            .addTo(map);

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
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(VADemographic)
            .addTo(map);
      
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