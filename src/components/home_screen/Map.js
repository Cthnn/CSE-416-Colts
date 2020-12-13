import React from 'react';
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
  addDistrictingSource = (map, type, data) => {
    let source = map.getSource(Constants.DistrictingSource[type]);
    if(source === undefined){
      map.addSource(Constants.DistrictingSource[type], {
        'type': 'geojson',
        'data': data
      })
    }
  }

  addHeatMapSource = (map, state, data) => {
    map.addSource(Constants.HeatMaps[state], {
      'type': 'geojson',
      'data': data
    });
  }
  addDistrictingLayer = (map, type) => {
    let layer = map.getLayer(Constants.DistrictingTypeLayers[type]);
    if(layer === undefined){
      map.addLayer({
        'id': Constants.DistrictingTypeLayers[type],
        'type': 'fill',
        'source': Constants.DistrictingSource[type],
        // 'layout':{
        //   'visibility':'none'
        // },
        'paint': {
          'fill-color': Constants.DistrictingTypeColors[type],
          'fill-outline-color': Constants.DistrictingOutlineColors[type]
        }
      });
    }
    map.addLayer({
      'id': Constants.DistrictingLineLayers[type],
      'type': 'line',
      'source': Constants.DistrictingSource[type],
      'paint': {
        'line-color': Constants.DistrictingOutlineColors[type],
        'line-width': 2
      }
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
      console.log("in map.js")
      // console.log(map);
      toolbar.setState(state, map);
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
}
class MapComponent extends React.Component{
  componentDidMount(){
    const toolbar = new Toolbar();
    const mapHelper = new MapHelper();
    this.map = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/mapbox/light-v10',
      center: Constants.CountryCenter,
      zoom: 5
    });
    this.map.addControl(toolbar, 'top-left');
    this.map.addControl(new mapboxgl.NavigationControl(), "bottom-left");
    toolbar.getDistrictGeoJson = toolbar.getDistrictGeoJson.bind(mapHelper, this.map);
    toolbar.getPrecinctGeoJson = toolbar.getPrecinctGeoJson.bind(mapHelper, this.map);
    toolbar.getDistrictingGeoJson = toolbar.getDistrictingGeoJson.bind(mapHelper, this.map);
    toolbar.getJobDistrictingGeoJson = toolbar.getJobDistrictingGeoJson.bind(mapHelper, this.map);

    if(this.map){
      const map = this.map;
      this.props.passMap(map);

      map.on('load', function () {
        map.resize();
        addHeatmapLegend();
        addDistrictingLegend();

        for(let state in Constants.States) {
          if(Constants.States[state] !== Constants.States.NONE){
            mapHelper.addStateSource(map, state);
            mapHelper.addStateLayer(map, state, toolbar);
          }
        }

        map.on('click', function (e){
          let districtButtonValue = document.getElementById('district-checkbox').checked;
          let precinctButtonValue = document.getElementById('precinct-checkbox').checked;
          let features = getFeatures(precinctButtonValue, districtButtonValue, e.point, map);

          if(features === null || !features.length)
            return;

          let feature = features[0];
          addFeaturePopup(feature, map);
          addSelectedFeatureLayer(feature, map);
        });
      });
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }
  

  render(){
    return <div id='mapContainer'></div>
  }
}

function addFeaturePopup(feature, map){
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
function addHeatmapLegend(){
  var layers = ['< 50%', '70%', '90%', '100%', '150%', '200%', '> 250%'];
  var colors = ['#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15'];
  var legend = document.getElementById('heatmap-legend');
  var title = document.createElement('div');
  title.innerText = 'Population Range';
  title.style.fontWeight = 'bold';
  legend.appendChild(title);
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;
  
    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }
}
function addDistrictingLegend(){
  var layer_types = ['Enacted', 'Average', 'Extreme'];
  var colors = [Constants.OutlineDistrictColor, Constants.DistrictingLegendColor.AVG, Constants.DistrictingOutlineColors.EX];
  var districtingLegend = document.getElementById('districting-legend');
  var title = document.createElement('div');
  title.innerText = 'Districting Colors';
  title.style.fontWeight = 'bold';
  districtingLegend.appendChild(title);
  for(var i = 0; i < layer_types.length; i++){
    var layer = layer_types[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    districtingLegend.appendChild(item);
  }
}
function getFeatures(precinctButtonValue, districttButtonValue, point, map){
  let features = [];
  let layers = '';
  if(precinctButtonValue){
    layers = queryPrecinctLayers(map);
  }
  else{
    if(districttButtonValue){
      layers = queryDistrictLayers(map);
    }
    else{
      layers = queryDistrictingLayers(map);
    }
  }
  if(layers !== undefined && layers.length !== 0){
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
function queryDistrictingLayers(map){
  let layers = [];
  for(let layer in Constants.DistrictingTypeLayers){
    if(map.getLayer(Constants.DistrictingTypeLayers[layer]) !== undefined){
      layers.push(Constants.DistrictingTypeLayers[layer]);
    }
  }
  return layers;
}

export default MapComponent;