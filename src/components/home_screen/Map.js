import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';
import * as Constants from './MapConstants.js';
import Toolbar from './Toolbar.js';

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
    var layer = Constants.StateLayers[state];
    map.addLayer({
      'id': layer,
      'type': 'fill',
      'source': Constants.States[state],
      'paint': {
        'fill-color': 'rgba(200, 100, 240, 0.4)',
        'fill-outline-color': 'rgba(200, 100, 240, 1)'
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
      document.getElementById('select-state-generation').selectedIndex = Object.keys(Constants.States).indexOf(state) + 1;

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
        'fill-color': 'rgba(200, 100, 240, 0.2)',
        'fill-outline-color': 'rgba(100, 100, 100, 1)'
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
        'fill-color': 'rgba(200, 100, 240, 0.2)',
        'fill-outline-color': 'rgba(200, 100, 240, 1)'
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
        center: [-100.04, 38.907],
        zoom: 3
      });

      map.addControl(toolbar, 'top-left');
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

      toolbar.getDistrictGeoJson = toolbar.getDistrictGeoJson.bind(mapHelper, map);
      toolbar.getPrecinctGeoJson = toolbar.getPrecinctGeoJson.bind(mapHelper, map);
      toolbar.getHeatMapGeoJson = toolbar.getHeatMapGeoJson.bind(mapHelper, map);

      map.on('load', function () {
        // Add a source for the state polygons.
        map.resize();

        for(var state in Constants.States) {
          mapHelper.addStateSource(map, state);
          mapHelper.addStateLayer(map, state, toolbar);
        }


        map.on('click', function (e){
          var district_button_value = document.getElementById('district-checkbox').checked;
          var precinct_button_value = document.getElementById('precinct-checkbox').checked;
          var features = null;
          if(precinct_button_value){
            var layers = [];
            for(var layer in Constants.PrecinctLayers){
              if(map.getLayer(Constants.PrecinctLayers[layer]) != undefined)
                layers.push(Constants.PrecinctLayers[layer]);
            }
            features = map.queryRenderedFeatures(e.point, {layers: layers});
          }
          else{
            if(district_button_value){
              var layers = [];
              for(var layer in Constants.DistrictLayers){
                if(map.getLayer(Constants.DistrictLayers[layer]) != undefined)
                  layers.push(Constants.DistrictLayers[layer]);
              }
              features = map.queryRenderedFeatures(e.point, {layers: layers});
            }
          }
          //console.log(features);
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
            .setHTML(Constants.VADemographic);
          
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
        });
      });
      return () => map.remove();
    }, []); 
    return<div className="map" ref={mapContainerRef} />;
};


export default MapComponent;