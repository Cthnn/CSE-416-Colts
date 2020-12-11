    import './Toolbar.css';
import * as Constants from './MapConstants.js';
import { ContinuousColorLegend } from 'react-vis';

class Toolbar {
    constructor(){
        this.total_VAP = this.initializeTotalVAP();
        this.generateTotalVAP();
    }
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
                    this.precinct_amount = JSON.parse(result).features.length;
                }).catch(error => {
                    console.error('Error:', error);
                    // For debugging when server is offline
                    // this.addPrecinctSource(map, state, './'+Constants.StateNames[state].toLowerCase()+'-precincts.geojson');
                    // this.addPrecinctLayer(map,state);
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
                this.determineHeatMapLegendDisplay(precinctButtonValue, heatmapButtonValue, selectedState);
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

        if (districtButtonValue)
            this.getDistrictGeoJson(selectedState).then(() => this.displayLayer(map));
        if (precinctButtonValue)
            this.getPrecinctGeoJson(selectedState).then(() => this.displayLayer(map));

        if (selectedState === Constants.States.NONE || (!districtButtonValue && !precinctButtonValue)) {
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
    determineHeatMapLegendDisplay = (precinctButtonValue, heatmapButtonValue, selectedState) => {
        let race = document.getElementById("heatmap-select").value;
        let legend = document.getElementById('heatmap-legend');
        let total = this.total_VAP[selectedState][race];
        let precinct_amount = Constants.PrecinctAmounts[selectedState];
        let percentages = [.5, .7, .9, 1, 1.5, 2, 2.5];
        let average = total/precinct_amount;
        console.log(legend.childNodes) // 8, 0 index is title
        if(precinctButtonValue && heatmapButtonValue && selectedState !== Constants.States.NONE){
            for(var i = 1; i < legend.childNodes.length;i++){
                var current_percentage = percentages[i-1];
                var calculation = Math.trunc(current_percentage*average);
                if(i == 1){
                    legend.childNodes[i].childNodes[1].innerText = '< ' + calculation.toString();
                }
                else if(i == legend.childNodes.length-1){
                    var previous = Math.trunc(percentages[i-2]*average);
                    legend.childNodes[i].childNodes[1].innerText = '> ' + previous.toString();
                }
                else{
                    // console.log(current_percentage[i-2]);
                    var previous = Math.trunc(percentages[i-2]*average);
                    legend.childNodes[i].childNodes[1].innerText = previous.toString() + '-' + calculation.toString();
                }
                
            }
            legend.style.display = 'block';
        }  
        else{
            legend.style.display = 'none';
        }
    }
    determinePrecinctLayerProperty = (precinctButtonValue, heatmapButtonValue, precinctLayerName, stateLayerName, selectedState, state, map) => {
 
        if (precinctButtonValue && selectedState === state && map.getLayer(precinctLayerName) !== undefined) {
            map.setLayoutProperty(precinctLayerName, 'visibility', 'visible');
            map.setLayoutProperty(stateLayerName, 'visibility', 'none');

            let race = document.getElementById("heatmap-select").value;
            this.setHeatMapColor(heatmapButtonValue, precinctLayerName, selectedState, race, map);
        } else {
            if (map.getLayer(precinctLayerName) !== undefined){
                map.setLayoutProperty(precinctLayerName, 'visibility', 'none');
            }
        }
    }
    setHeatMapColor = (heatButtonValue, precinctLayerName, selectedState, race, map) => {
        if(!heatButtonValue){
            map.setPaintProperty(precinctLayerName, 'fill-color', Constants.DefaultColor);
        }
        else{
            let total = this.total_VAP[selectedState][race];
            map.setPaintProperty(precinctLayerName, 'fill-color', ['let','percentage',
            ['/', ['to-number',['get', race], 0], ['to-number', total/Constants.PrecinctAmounts[selectedState], 1]],
                    [
                    'interpolate',
                    ['linear'],
                    ['to-number',['var','percentage'], 0],
                    0.5,
                    '#fee0d2',
                    0.7,
                    '#fcbba1',
                    0.9,
                    '#fc9272',
                    1.0,
                    '#fb6a4a',
                    1.1,
                    '#ef3b2c',
                    1.7,
                    '#cb181d',
                    2.5,
                    '#a50f15'
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
        let legend = document.getElementById('heatmap-legend');
        legend.style.display = 'none';
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
    async generateTotalVAP(){
        for(let state in Constants.States){
            if(state !== Constants.States.NONE){
                this.getDistrictInfo(state);
            }
        }
    }
    initializeTotalVAP(){
        var object = {};
        for(let state in Constants.States){
            if(state !== Constants.States.NONE){
                object[state] = {
                    'R2': 0,
                    'R3': 0,
                    'R4': 0,
                    'R5': 0,
                    'R6': 0,
                    'R7': 0,
                    'R8': 0,
                }
            }
        }
        return object;
    }
    getDistrictInfo = (state) => {
        fetch('http://localhost:8080/district', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(Constants.StateNames[state].toUpperCase())
        })
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result).features;
            for(var i = 0; i < data.length; i++){
                this.total_VAP[state].R2 += data[i].properties.R2;
                this.total_VAP[state].R3 += data[i].properties.R3;
                this.total_VAP[state].R4 += data[i].properties.R4;
                this.total_VAP[state].R5 += data[i].properties.R5;
                this.total_VAP[state].R6 += data[i].properties.R6;
                this.total_VAP[state].R7 += data[i].properties.R7;
                this.total_VAP[state].R8 += data[i].properties.R8;
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    }

}

export default Toolbar;