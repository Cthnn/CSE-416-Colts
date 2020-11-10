import React, { useRef, useEffect } from 'react';
import mapboxgl, { LngLatBounds } from 'mapbox-gl';
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
        //Set source of GEOJSON and set the layers for it. PROBABLY NEED TO CHANGE SO WE CAN FETCH FILES FROM SERVER. CAN KEEP FOR STATE LAYER
        setSources(map);
        setLayers(map);
        //Set mouse events for the different types of layers. (Mostly just cursor changes)
        setMouseEvents(map);
        map.resize();
        
        //Trigger for only state layer
        map.on('click', 'AL-Layer', function (e) {
          var features = e.features
          goToCenterOfState(features, map); // Will center map onto the state
          setSelectedState('AL', '1'); // Sync up state selection with toolbar and generator selec
          
          toolbar.changeLayer(map); // Change layer
          var params = JSON.stringify('ALABAMA')  // Fetch
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });

        map.on('click', 'FL-Layer', function (e) {
          var features = e.features
          goToCenterOfState(features, map);
          setSelectedState('FL', '2');
          
          toolbar.changeLayer(map);
          var params = JSON.stringify('FLORIDA');
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });

        map.on('click', 'VA-Layer', function (e) {
          var features = e.features
          goToCenterOfState(features, map);
          setSelectedState('VA', '3');

          toolbar.changeLayer(map);
          var params = JSON.stringify('VIRGINIA');
          fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {console.log('Success:', result);}).catch(error => {console.error('Error:', error);});
        });
        
        // Functionality for this listener is for precinct/district view related logic
        map.on('click', function (e){
          var district_button_value = document.getElementById('district-checkbox').checked;
          var precinct_button_value = document.getElementById('precinct-checkbox').checked;
          var features = queryLayers(e.point, precinct_button_value, district_button_value, map); //Queries rendered layers to see which features are within click
          //Check if the spot clicked was a feature
          if(features === null || !features.length){
            return;
          }
          //Check if there is already another selected feature, if so delete it so we can create a new one
          if (typeof map.getLayer('selectedFeature') !== "undefined" ){         
            map.removeLayer('selectedFeature');
            map.removeSource('selectedFeature');   
          }
          //Create a new layer of the selected feature and a popup with relevant data
          var feature = features[0];
          createSelectedFeatureLayer(map, feature);
          createPopup(e.lngLat, "INSERT PRECINCT INFORMATION", map);
        })
      });
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      return () => map.remove();
    }, []); 
    return<div className="map" ref={mapContainerRef} />;
};

function queryLayers(point, precinct_button_value, district_button_value, map){
  var features = null;
  if(precinct_button_value){
    features = map.queryRenderedFeatures(point, {layers: ['AL-Precincts','FL-Precincts','VA-Precincts']});
  }
  else{
    if(district_button_value){
      features = map.queryRenderedFeatures(point, {layers: ['AL-Districts','FL-Districts','VA-Districts']});
    }
  }
  return features;
}
function createSelectedFeatureLayer(map, feature){
  
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
}
function createPopup(lngLat, html_info, map){
  new mapboxgl.Popup()
    .setLngLat(lngLat)
    .setHTML(html_info)
    .addTo(map);
}
function setSelectedState(state, stateIndex){
  document.getElementById('state-selection').value = state;
  var elem = document.getElementById('select-state-generation');
  elem.selectedIndex = stateIndex;
}
function goToCenterOfState(features, map){
  map.flyTo({
    center: findCenterOfState(features),
    zoom: 5
  })
}
function findCenterOfState(features){
  var bounds = new mapboxgl.LngLatBounds();
  features.forEach(function(feature){
    feature.geometry.coordinates.forEach(function(coord){
      coord.forEach(function(coordinate_pair){
        bounds.extend(coordinate_pair)
      })
    })
  })
  return bounds.getCenter();
}
function setMouseEvents(map){
  //SET FOR STATE LAYER
  map.on('mouseenter', 'AL-Layer', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'AL-Layer', function () {
    map.getCanvas().style.cursor = '';
  });
  map.on('mouseenter', 'FL-Layer', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
  map.on('mouseleave', 'FL-Layer', function () {
    map.getCanvas().style.cursor = '';
  });
  map.on('mouseenter', 'VA-Layer', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'VA-Layer', function () {
    map.getCanvas().style.cursor = '';
  });

  //SET FOR PRECINCTS LAYER
  map.on('mouseenter', 'AL-Precincts', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'AL-Precincts', function () {
    map.getCanvas().style.cursor = '';
  });
  map.on('mouseenter', 'FL-Precincts', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
  map.on('mouseleave', 'FL-Precincts', function () {
    map.getCanvas().style.cursor = '';
  });
  map.on('mouseenter', 'VA-Precincts', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'VA-Precincts', function () {
    map.getCanvas().style.cursor = '';
  });

  //SET FOR DISTRICT LAYER
  map.on('mouseenter', 'AL-Districts', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'AL-Districts', function () {
    map.getCanvas().style.cursor = '';
  });
  map.on('mouseenter', 'FL-Districts', function () {
    map.getCanvas().style.cursor = 'pointer';
    });
  map.on('mouseleave', 'FL-Districts', function () {
    map.getCanvas().style.cursor = '';
  });
  map.on('mouseenter', 'VA-Districts', function () {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'VA-Districts', function () {
    map.getCanvas().style.cursor = '';
  });
}
function setSources(map){
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
}
function setLayers(map){
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
    'id': 'FL-Layer',
    'type': 'fill',
    'source': 'FL',
    'paint': {
      'fill-color': 'rgba(200, 100, 240, 0.4)',
      'fill-outline-color': 'rgba(200, 100, 240, 1)'
    }
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
}

export default MapComponent;