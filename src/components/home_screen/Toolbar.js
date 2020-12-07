import './Toolbar.css';
import * as Constants from './MapConstants.js';

class Toolbar {
    setState(state) {
        if (state !== Constants.States.NONE) {
            fetch('http://localhost:8080/state', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify(Constants.StateNames[state].toUpperCase())
            })
                .then(response => response.text())
                .then(result => {
                    console.log('Success:', result);
                }).catch(error => { console.error('Error:', error); });
        }
        this.changeLayer(this.map);
    }
    async getJobDistrictingGeoJson(map, jobId, districtingType) {
        let layer = map.getLayer(Constants.DistrictingTypeLayers[districtingType]);
        console.log(Constants.DistrictingTypeLayers[districtingType].toUpperCase());
        if (layer === undefined) {
            await fetch('http://localhost:8080/jobGeo', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify({ jobId: jobId, type: Constants.DistrictingType[districtingType].toUpperCase() })
            })
                .then(response => response.text())
                .then(result => {
                    console.log("Recieved Districting GeoJson");
                    //Job Districting functionality
                }).catch(error => {
                    console.error('Error:', error);
                });
        }
    }
    // this is binded to MapHelper
    async getDistrictGeoJson(map, state) {
        let layer = map.getLayer(Constants.DistrictLayers[state]);
        if (layer === undefined && state !== Constants.States.NONE) {
            await fetch('http://localhost:8080/district', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify(Constants.StateNames[state].toUpperCase())
            })
                .then(response => response.text())
                .then(result => {
                    console.log("recieved district data");
                    this.addDistrictSource(map, state, JSON.parse(result));
                    this.addDistrictLayer(map, state);
                }).catch(error => {
                    console.error('Error:', error);
                    // For debugging when server is offline
                    // this.addPrecinctSource(map, state, './'+Constants.StateNames[state].toLowerCase()+'-precincts.geojson');
                    // this.addPrecinctLayer(map,state);
                });
        }
    }
    // this is binded to MapHelper

    async getPrecinctGeoJson(map, state) {
        let layer = map.getLayer(Constants.PrecinctLayers[state]);
        if (layer === undefined && state !== Constants.States.NONE) {
            await fetch('http://localhost:8080/precinct', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify(Constants.StateNames[state].toUpperCase())
            })
                .then(response => response.text())
                .then(result => {
                    console.log("recieved precinct data");
                    this.addPrecinctSource(map, state, JSON.parse(result));
                    this.addPrecinctLayer(map, state);
                }).catch(error => {
                    console.error('Error:', error);
                    // For debugging when server is offline
                    // this.addPrecinctSource(map, state, './'+Constants.StateNames[state].toLowerCase()+'-precincts.geojson');
                    // this.addPrecinctLayer(map,state);
                });
        }
    }
    // this is binded to MapHelper
    async getHeatMapGeoJson(map, state) {
        let layer = map.getLayer(Constants.HeatMapLayers[state]);
        if (layer === undefined && state !== Constants.States.NONE) {
            await fetch('http://localhost:8080/heatmap', {
                headers: { "Content-Type": "application/json" },
                method: 'POST',
                body: JSON.stringify(Constants.StateNames[state].toUpperCase())
            })
                .then(response => response.text())
                .then(result => {
                    console.log("recieved heatmap data");
                    this.addHeatMapSource(map, state, JSON.parse(result));
                    // console.log(JSON.parse(result).features[0].properties);

                    let features = JSON.parse(result).features;
                    let found_features = undefined;
                    // for(var i = 0; i < features.length; i++){
                    //     let temp = features[i];
                    //     found_features = map.querySourceFeatures('AL-Precinct', {
                    //         sourceLayer: 'AL-Heatmap',
                    //         filter: ['==', ['get', "ID"], temp.properties.ID]
                    //     })
                    //     if(found_features !== undefined){
                    //         let feature = found_features[0];
                    //         if(feature !== undefined){
                    //             map.addSource(temp.properties.ID, {
                    //                 "type": "geojson",
                    //                 "data": feature.toJSON()
                    //             });
                    //             map.addLayer({
                    //             'id': temp.properties.ID,
                    //             'type': 'fill',
                    //             'source': temp.properties.ID,
                    //             'paint': {
                    //                 'fill-color': 'rgba(214,57,4,.4)',
                    //                 'fill-outline-color': 'rgba(0,0,0,1)'
                    //             }
                    //             });
                    //         }
                    //     }
                    // }
                    
                    // this.addHeatMapLayer(map, state);
                }).catch(error => {
                    console.error('Error:', error);
                    // For debugging when server is offline
                    // this.addHeatMapSource(map, state, './'+Constants.StateNames[state].toLowerCase()+'_heatmap.geojson');
                    // this.addHeatMapLayer(map,state);
                });
        }
    }

    onAdd(map) {
        this.map = map;
        this.container = document.createElement('div');
        this.subContainer = document.createElement('form');
        this.container.className = 'toolbar';

        this.stateText = document.createElement('p');
        this.stateSelect = document.createElement('select');
        this.setStateSelect(this.stateSelect, this.stateText, this.map);

        this.districtText = document.createElement('p');
        this.districtCheckbox = document.createElement('input');
        this.setDistrictCheckbox(this.districtCheckbox, this.districtText, this.map);

        this.precinctText = document.createElement('p');
        this.precinctCheckbox = document.createElement('input');
        this.setPrecinctCheckbox(this.precinctCheckbox, this.precinctText, this.map);

        this.heatText = document.createElement('p');
        this.heat = document.createElement('input');
        this.heatDropdown = document.createElement('select');
        this.setHeatMap(this.heat, this.heatDropdown, this.heatText, this.map);

        this.subContainer.appendChild(this.stateText);
        this.subContainer.appendChild(this.stateSelect);
        this.subContainer.appendChild(this.districtText);
        this.subContainer.appendChild(this.districtCheckbox);
        this.subContainer.appendChild(this.precinctText);
        this.subContainer.appendChild(this.precinctCheckbox);

        this.subContainer.appendChild(this.heatText);
        this.subContainer.appendChild(this.heat);
        this.subContainer.appendChild(this.heatDropdown);

        this.container.appendChild(this.subContainer);

        return this.container;
    }
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }

    displayLayer = (map) => {
        let selectedState = document.getElementById('state-selection').value;
        let districtButtonValue = document.getElementById('district-checkbox').checked;
        let precinctButtonValue = document.getElementById('precinct-checkbox').checked;
        let heatmapButtonValue = document.getElementById('heat-checkbox').checked;

        for (let state in Constants.States) {
            let districtLayerName = Constants.DistrictLayers[state];
            let districtLayerLineName = Constants.DistrictLineLayers[state];
            let precinctLayerName = Constants.PrecinctLayers[state];
            let heatLayerName = Constants.HeatMapLayers[state];
            let stateLayerName = Constants.StateLayers[state];

            if (map.getLayer(stateLayerName) !== undefined) {
                map.setLayoutProperty(stateLayerName, 'visibility', 'visible');
                map.setPaintProperty(stateLayerName, 'fill-color', Constants.DefaultColor);
            }
            if (selectedState !== Constants.States.NONE) {
                // this.determineHeatLayerProperty(heatmapButtonValue, heatLayerName, selectedState, state, map);
                this.determinePrecinctLayerProperty(precinctButtonValue, heatmapButtonValue, precinctLayerName, stateLayerName, selectedState, state, map);
                this.determineDistrictLayerProperty(districtButtonValue, districtLayerName, districtLayerLineName, stateLayerName, selectedState, state, map);
                if (!districtButtonValue && !precinctButtonValue) { //All states visible
                    this.determineStateLayerProperty(stateLayerName, selectedState, state, map);
                }
            }
            else { //Show just states now
                this.setToStateOnlyView(stateLayerName, districtLayerName, districtLayerLineName, precinctLayerName, map);
            }
        }
        this.removeSelectedFeatureLayer(map);
    }

    changeLayer = (map) => {
        let selectedState = document.getElementById('state-selection').value;
        let districtButtonValue = document.getElementById('district-checkbox').checked;
        let precinctButtonValue = document.getElementById('precinct-checkbox').checked;
        let heatmapButtonValue = document.getElementById('heat-checkbox').checked;

        if (districtButtonValue)
            this.getDistrictGeoJson(selectedState).then(() => this.displayLayer(map));
        if (precinctButtonValue)
            this.getPrecinctGeoJson(selectedState).then(() => this.displayLayer(map));
        // if (heatmapButtonValue)
        //     this.getHeatMapGeoJson(selectedState).then(() => this.displayLayer(map));

        if (selectedState === Constants.States.NONE || (!districtButtonValue && !precinctButtonValue && !heatmapButtonValue)) {
            this.displayLayer(map);
        }
    }
    determineDistrictLayerProperty = (districtButtonValue, districtLayerName, districtLayerLineName, stateLayerName, selectedState, state, map) => {
        if (districtButtonValue && selectedState === state && map.getLayer(districtLayerName) !== undefined && map.getLayer(districtLayerLineName) !== undefined) {
            map.setLayoutProperty(districtLayerName, 'visibility', 'visible');
            map.setLayoutProperty(districtLayerLineName, 'visibility', 'visible');
            map.setLayoutProperty(stateLayerName, 'visibility', 'none');
        } else {
            if (map.getLayer(districtLayerName) !== undefined && map.getLayer(districtLayerLineName) !== undefined) {
                map.setLayoutProperty(districtLayerName, 'visibility', 'none');
                map.setLayoutProperty(districtLayerLineName, 'visibility', 'none');
            }
        }
    }
    determinePrecinctLayerProperty = (precinctButtonValue, heatmapButtonValue, precinctLayerName, stateLayerName, selectedState, state, map) => {
        if (precinctButtonValue && selectedState === state && map.getLayer(precinctLayerName) !== undefined) {
            map.setLayoutProperty(precinctLayerName, 'visibility', 'visible');
            map.setLayoutProperty(stateLayerName, 'visibility', 'none');

            let race = document.getElementById("heatmap-select").value;
            this.setHeatMapColor(heatmapButtonValue, precinctLayerName, race, map);
        } else {
            if (map.getLayer(precinctLayerName) !== undefined)
                map.setLayoutProperty(precinctLayerName, 'visibility', 'none');
        }
    }
    setHeatMapColor = (heatButtonValue, precinctLayerName, race, map) => {
        if(!heatButtonValue){
            map.setPaintProperty(precinctLayerName, 'fill-color', Constants.DefaultColor);
        }
        else{
            map.setPaintProperty(precinctLayerName, 'fill-color', ['let','percentage',['/', ['to-number',['get', race]], ['to-number',['get', 'VAP_TOTAL']]],
                      [
                        'interpolate',
                        ['linear'],
                        ['var','percentage'],
                        0,
                        'rgb(33,102,172)',
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
                      ]
                    ])
        }

    }
    determineStateLayerProperty = (stateLayerName, selectedState, state, map) => {
        if (map.getLayer(stateLayerName) !== undefined) {
            map.setLayoutProperty(stateLayerName, 'visibility', 'visible');
            if (selectedState === state)
                map.setPaintProperty(stateLayerName, 'fill-color', Constants.SelectedColor);
            else
                map.setPaintProperty(stateLayerName, 'fill-color', Constants.DefaultColor);
        }
    }

    setToStateOnlyView = (stateLayerName, districtLayerName, districtLayerLineName, precinctLayerName, map) => {
        if (map.getLayer(stateLayerName) !== undefined)
            map.setLayoutProperty(stateLayerName, 'visibility', 'visible');
        if (map.getLayer(districtLayerName) !== undefined && map.getLayer(districtLayerLineName) !== undefined) {
            map.setLayoutProperty(districtLayerName, 'visibility', 'none');
            map.setLayoutProperty(districtLayerLineName, 'visibility', 'none');
        }
        if (map.getLayer(precinctLayerName) !== undefined)
            map.setLayoutProperty(precinctLayerName, 'visibility', 'none');
    }
    removeSelectedFeatureLayer = (map) => {
        if (map.getLayer(Constants.SelectedFeatureLayer) !== undefined) {
            map.removeLayer(Constants.SelectedFeatureLayer);
            map.removeSource(Constants.SelectedFeatureLayer);
        }
    }

    creatHeatMapOption(option) {
        let mapOption = document.createElement('option');
        mapOption.value = Constants.HeatMapMapping[option];
        mapOption.textContent = Constants.EthnicGroupNames[option];

        return mapOption;
    }

    setHeatMap(heatCheckbox, heatSelect, heatText, map) {
        heatText.textContent = 'Heatmap View'
        heatText.className = 'text';
        heatSelect.className = 'heatmap-select';
        heatSelect.id = 'heatmap-select';
        heatCheckbox.type = 'checkbox';
        heatCheckbox.className = 'view-button';

        for (let group in Constants.EthnicGroups)
            if (Constants.EthnicGroups[group] !== Constants.EthnicGroups.NONE)
                heatSelect.appendChild(this.creatHeatMapOption(group));

        heatCheckbox.id = 'heat-checkbox';
        heatText.addEventListener('click', () => {
            heatCheckbox.checked = !heatCheckbox.checked;
            this.changeLayer(map);
        })
        heatSelect.addEventListener('change', () => {
            this.changeLayer(map);
        })

        heatCheckbox.addEventListener('click', () => {
            this.changeLayer(map);
        })
    }

    setPrecinctCheckbox(precinctCheckbox, precinctText, map) {
        precinctText.className = 'text';
        precinctText.textContent = 'Precinct';
        precinctCheckbox.type = 'checkbox';
        precinctCheckbox.className = 'view-button';
        precinctCheckbox.name = 'view-choice';
        precinctCheckbox.id = 'precinct-checkbox';

        precinctCheckbox.addEventListener('click', () => {
            this.changeLayer(map);
        })
        precinctText.addEventListener('click', () => {
            precinctCheckbox.checked = !precinctCheckbox.checked;
            this.changeLayer(map);
        })
    }
    setDistrictCheckbox(districtCheckbox, districtText, map) {
        districtCheckbox.name = 'view-choice';
        districtCheckbox.id = 'district-checkbox';
        districtText.textContent = 'Districts';
        districtText.className = 'text';
        districtCheckbox.type = 'checkbox';
        districtCheckbox.className = 'view-button';

        districtCheckbox.addEventListener('click', () => {
            this.changeLayer(map);
        })
        districtText.addEventListener('click', () => {
            districtCheckbox.checked = !districtCheckbox.checked;
            this.changeLayer(map);
        })
    }

    createStateOption(option) {
        let stateOption = document.createElement('option');
        stateOption.value = Constants.States[option];
        stateOption.textContent = Constants.StateNames[option];

        return stateOption;
    }

    setStateSelect(stateSelect, stateSelectText, map) {
        stateSelect.className = 'state-select';

        for (let state in Constants.States)
            stateSelect.appendChild(this.createStateOption(state));

        stateSelectText.textContent = 'State';
        stateSelectText.className = 'text';
        stateSelect.name = 'view-choice';
        stateSelect.id = 'state-selection';

        stateSelect.addEventListener('change', (e) => {
            let state = e.target.value;
            let elem = document.getElementById('select-state-generation');

            if (state === Constants.States.NONE) {
                map.flyTo({
                    center: Constants.CountryCenter,
                    zoom: 5
                })
            } else {
                map.flyTo({
                    center: Constants.StateCenters[state],
                    zoom: 6
                })
            }
            elem.selectedIndex = Object.keys(Constants.States).indexOf(state);
            this.setState(state);
        })
    }

}

export default Toolbar;