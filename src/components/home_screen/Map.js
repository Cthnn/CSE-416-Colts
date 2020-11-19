import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import * as Constants from './MapConstants.js';
import Toolbar from './Toolbar.js';
import MapPopUp from './MapPopUp';
import ReactDOM from 'react-dom';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class MapHelper {
  addStateSource = (map, state) => {
    map.addSource(Constants.States[state], {
      'type': 'geojson',
      'data':
      'https://raw.githubusercontent.com/unitedstates/districts/gh-pages/states/'+state+'/shape.geojson'
    });
  }

  addDistrictSource = (map, state, data) => {
    map.addSource(Constants.Districts[state], {
      'type': 'geojson',
      'data': data
    });
  }

  addPrecinctSource = (map, state, data) => {
    map.addSource(Constants.Precincts[state], {
      'type': 'geojson',
      'data': data
    });
  }

  addHeatMapSource = (map, state, data) => {
    map.addSource(Constants.HeatMaps[state], {
      'type': 'geojson',
      'data': data
    });
  }

  addStateLayer = (map, state, toolbar) => {
    let layer = Constants.StateLayers[state];
    map.addLayer({
      'id': layer,
      'type': 'fill',
      'source': Constants.States[state],
      'paint': {
        'fill-color': Constants.DefaultColor,
        'fill-outline-color': Constants.OutlineStateColor
      }
    });

    map.on('mouseenter', layer, function () {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', layer, function () {
      map.getCanvas().style.cursor = '';
    });

    map.on('click', layer, function (e) {
      document.getElementById('state-selection').value = Constants.States[state];
      document.getElementById('select-state-generation').selectedIndex = Object.keys(Constants.States).indexOf(state);

      map.flyTo({
        center: Constants.StateCenters[state],
        zoom: 6
      })
      toolbar.setState(state);
    });
  }

  addDistrictLayer = (map, state) => {
    map.addLayer({
      'id': Constants.DistrictLayers[state],
      'type': 'fill',
      'source': Constants.Districts[state],
      'layout':{
        'visibility':'none'
      },
      'paint': {
        'fill-color': Constants.DefaultColor,
        'fill-outline-color': 'rgba(100, 100, 100, 1)'
      }
    }); 

    map.addLayer({
      'id': Constants.DistrictLineLayers[state],
      'type': 'line',
      'source': Constants.Districts[state],
      'layout':{
        'visibility':'none'
      },
      'paint': {
        'line-color': Constants.OutlineDistrictColor,
        'line-width': 2
      }
    }); 
  }

  addPrecinctLayer = (map, state) => {
    map.addLayer({
      'id': Constants.PrecinctLayers[state],
      'type': 'fill',
      'source': Constants.Precincts[state], 
      'layout':{
        'visibility':'none'
      },
      'paint': {
        'fill-color': Constants.DefaultColor,
        'fill-outline-color': Constants.OutlinePrecinctColor
      }
    });
  }

  addHeatMapLayer = (map, state) => {
    map.addLayer({
      id: Constants.HeatMapLayers[state],
      type: 'heatmap',
      source: Constants.HeatMaps[state],
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
}

const MapComponent = ({props}) => {
    const mapContainerRef = useRef(null);
    const toolbar = new Toolbar();
    const mapHelper = new MapHelper();

    useEffect(() => {
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        // See style options here: https://docs.mapbox.com/api/maps/#styles
        style: 'mapbox://styles/mapbox/light-v10',
        center: Constants.CountryCenter,
        zoom: 5
      });

      map.addControl(toolbar, 'top-left');
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      toolbar.getDistrictGeoJson = toolbar.getDistrictGeoJson.bind(mapHelper, map);
      toolbar.getPrecinctGeoJson = toolbar.getPrecinctGeoJson.bind(mapHelper, map);
      toolbar.getHeatMapGeoJson = toolbar.getHeatMapGeoJson.bind(mapHelper, map);
      toolbar.getJobDistrictingGeoJson = toolbar.getJobDistrictingGeoJson.bind(mapHelper, map);

      map.on('load', function () {
        // Add a source for the state polygons.
        map.resize();

        for(let state in Constants.States) {
          if(Constants.States[state] != Constants.States.NONE){
            mapHelper.addStateSource(map, state);
            mapHelper.addStateLayer(map, state, toolbar);
          }
        }

        map.on('click', function (e){
          let district_button_value = document.getElementById('district-checkbox').checked;
          let precinct_button_value = document.getElementById('precinct-checkbox').checked;
          let features = getFeatures(precinct_button_value, district_button_value, e.point, map);

          if(features === null || !features.length)
            return;

          let feature = features[0];
          addPrecinctPopUp(feature, map);
          addSelectedFeatureLayer(feature, map);
        });
      });
      return () => map.remove();
    }, []); 
    return<div className="map" ref={mapContainerRef} />;
};

function addPrecinctPopUp(feature, map){
  let demographicData = document.createElement('div');
  ReactDOM.render(<MapPopUp features = {feature.properties}/>, demographicData);
  let popup= new mapboxgl.Popup()
    .setLngLat([0,0])
    .setDOMContent(demographicData);
  popup.id = 'precinct-popup';
  popup.addTo(map);
}
function addSelectedFeatureLayer(feature, map){
  if (typeof map.getLayer(Constants.SelectedFeatureLayer) !== "undefined" ){         
    map.removeLayer(Constants.SelectedFeatureLayer);
    map.removeSource(Constants.SelectedFeatureLayer);   
  }
  
  map.addSource(Constants.SelectedFeatureLayer, {
    "type": "geojson",
    "data": feature.toJSON()
  });
  map.addLayer({
    'id': Constants.SelectedFeatureLayer,
    'type': 'fill',
    'source': Constants.SelectedFeatureLayer,
    'paint': {
      'fill-color': Constants.SelectedFeatureColor,
      'fill-outline-color': Constants.OutlineSelectedFeatureColor
    }
  });
}

function getFeatures(precinct_button_value, district_button_value, point, map){
  let features = [];
  let layers = '';
  if(precinct_button_value){
    layers = queryPrecinctLayers(map);
  }
  else{
    if(district_button_value){
      layers = queryDistrictLayers(map);
    }
  }
  if(layers.length != 0){
    features = map.queryRenderedFeatures(point, {layers: layers});
  }
  return features;
}
function queryPrecinctLayers(map){
  let layers = [];
  for(let layer in Constants.PrecinctLayers){
    if(map.getLayer(Constants.PrecinctLayers[layer]) !== undefined)
      layers.push(Constants.PrecinctLayers[layer]);
  }
  return layers;
}
function queryDistrictLayers(map){
  let layers = [];
  for(let layer in Constants.DistrictLayers){
    if(map.getLayer(Constants.DistrictLayers[layer]) !== undefined)
      layers.push(Constants.DistrictLayers[layer]);
  }
  return layers;
}

export default MapComponent;