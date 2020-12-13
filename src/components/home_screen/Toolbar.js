    import './Toolbar.css';
import * as Constants from './MapConstants.js';
import { ContinuousColorLegend } from 'react-vis';

class Toolbar {
    constructor(){
        this.total_VAP = this.initializeTotalVAP();
        this.generateTotalVAP();
        
        this.map = null;
        this.job = null;
        this.average = false;
        this.extreme = false;
    }
    setState(state, map) {
        // console.log(map);
        if(map !== undefined){
            this.removeAllDistrictingLayers();
        }
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
        // console.log(map);
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
    async getDistrictingGeoJson(map, job, state, type, key){
        let layer = map.getLayer(Constants.DistrictingTypeLayers[type]);
        let src = map.getSource(Constants.DistrictingSource[key]);
        // console.log(src);
        // console.log(layer);
        // console.log(job.status);
        // console.log(Constants.Completed)
        // console.log(Constants.StateNames[state].toUpperCase())
        // console.log(job.state.stateName);
        if(src === undefined && layer === undefined && job.status === Constants.Completed && Constants.StateNames[state].toUpperCase() === job.state.stateName){
            let params = JSON.stringify({jobId: job.jobId, type: type.toUpperCase()});
            await fetch('http://localhost:8080/jobGeo', {
                    headers: { "Content-Type": "application/json" },
                    method: 'POST',
                    body: params
                })
                .then(response => response.text())
                .then(result => {
                    console.log("recieved jobGeo districting geojson");
                    console.log(JSON.parse(result));
                    this.addDistrictingSource(map, key, JSON.parse(result));
                    this.addDistrictingLayer(map, key);
                    
                }).catch(error => { console.error('Error:', error); });
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

    displayLayer = (map, job) => {
        // console.log(map.style);
        let selectedState = document.getElementById('state-selection').value;
        let districtButtonValue = document.getElementById('district-checkbox').checked;
        let precinctButtonValue = document.getElementById('precinct-checkbox').checked;
        let heatmapButtonValue = document.getElementById('heat-checkbox').checked;
        let averageButtonValue = false;
        let extremeButtonValue = false;
        if(job !== null && Constants.StateIdKeys[job.state.stateId]){
            let averageButton = document.getElementById('avg'+job.jobId);
            let extremeButton = document.getElementById('ex'+job.jobId);
            if(averageButton !== null &&  extremeButton !== null){
                averageButtonValue = document.getElementById('avg'+job.jobId).checked;
                extremeButtonValue = document.getElementById('ex'+job.jobId).checked;
                var temp = '';
                let averageLayer = Constants.DistrictingTypeLayers.AVG;
                let extremeLayer = Constants.DistrictingTypeLayers.EX;
                let averageLine = Constants.DistrictingLineLayers.AVG;
                let extremeLine = Constants.DistrictingLineLayers.EX;
                // console.log(job);
                // console.log(selectedState);
                // this.determineDistrictingLayerProperty(averageButtonValue, averageLayer, job, 'ALABAMA', map);
                // this.determineDistrictingLayerProperty(extremeButtonValue, extremeLayer, job, 'ALABAMA', map);
                let stateLayerName = Constants.StateLayers[selectedState];
                this.determineDistrictingLayerProperty(averageButtonValue, averageLayer, averageLine, stateLayerName, job, selectedState, map);
                this.determineDistrictingLayerProperty(extremeButtonValue, extremeLayer, extremeLine, stateLayerName, job, selectedState, map);
            }
        }

        for (let state in Constants.States) {
            let districtLayerName = Constants.DistrictLayers[state];
            let districtLayerLineName = Constants.DistrictLineLayers[state];
            let precinctLayerName = Constants.PrecinctLayers[state];
            let stateLayerName = Constants.StateLayers[state];
            // console.log(selectedState + " " + state);
            
            if (selectedState !== state && map.getLayer(stateLayerName) !== undefined) {
                map.setLayoutProperty(stateLayerName, 'visibility', 'visible');
                map.setPaintProperty(stateLayerName, 'fill-color', Constants.DefaultColor);
            }
            if (selectedState !== Constants.States.NONE) {
                this.determinePrecinctLayerProperty(precinctButtonValue, heatmapButtonValue, precinctLayerName, stateLayerName, selectedState, state, map);
                this.determineDistrictLayerProperty(districtButtonValue, districtLayerName, districtLayerLineName, stateLayerName, selectedState, state, map);
                this.determineHeatMapLegendDisplay(precinctButtonValue, heatmapButtonValue, selectedState);
                this.determineDistrictingLegendDisplay(districtButtonValue, averageButtonValue, extremeButtonValue);
                if (!districtButtonValue && !precinctButtonValue && !(averageButtonValue || extremeButtonValue)) { //All states visible
                    this.determineStateLayerProperty(stateLayerName, selectedState, state, map);
                }
            }
            else { //Show just states now
                this.setToStateOnlyView(stateLayerName, districtLayerName, districtLayerLineName, precinctLayerName, map);
                this.removeAllDistrictingLayers();
            }
            
        }
        // let averageLine = map.getLayer(Constants.DistrictingLineLayers.AVG);
        // let extremeLine = map.getLayer(Constants.DistrictingLineLayers.EX);
        // if(map.getLayer(averageLine) !== undefined){
        //     map.moveLayer(averageLine);
        // }
        // if(map.getLayer(extremeLine) !== undefined){
        //     map.moveLayer(extremeLine);
        // }
        this.moveDistrictingLayer(map);
        this.removeSelectedFeatureLayer(map);
    }

    changeLayer = (map) => {
        // console.log("Changing...");
        let selectedState = document.getElementById('state-selection').value;
        let districtButtonValue = document.getElementById('district-checkbox').checked;
        let precinctButtonValue = document.getElementById('precinct-checkbox').checked;
        let averageButtonValue = null;
        let extremeButtonValue = null;

        let job = this.job;
        if(this.job !== null){
            let averageButton = document.getElementById('avg'+job.jobId);
            let extremeButton = document.getElementById('ex'+job.jobId);
            if(averageButton !== null && extremeButton !== null){
                averageButtonValue = averageButton.checked;
                extremeButtonValue = extremeButton.checked;
            }
        }        
        // console.log(averageButtonValue);
        if(averageButtonValue !== null && averageButtonValue && selectedState !== Constants.States.NONE){
            this.getDistrictingGeoJson(job, selectedState, Constants.DistrictingType.AVG, Constants.DistrictingKey.AVG).then(() =>this.displayLayer(map,job));
        }
        if(extremeButtonValue !== null && extremeButtonValue && selectedState !==Constants.States.NONE){
            this.getDistrictingGeoJson(job, selectedState, Constants.DistrictingType.EX, Constants.DistrictingKey.EX).then(() =>this.displayLayer(map,job));
        }
        if (districtButtonValue)
            this.getDistrictGeoJson(selectedState).then(() => this.displayLayer(map, job));
        if (precinctButtonValue)
            this.getPrecinctGeoJson(selectedState).then(() => this.displayLayer(map, job));

        this.determineToolbarVisibility(selectedState);
        if (selectedState === Constants.States.NONE || (!districtButtonValue && !precinctButtonValue)) {
            this.displayLayer(map, job);
        }
        // let averageLine = map.getLayer(Constants.DistrictingLineLayers.AVG);
        // let extremeLine = map.getLayer(Constants.DistrictingLineLayers.EX);
        // if(map.getLayer(averageLine) !== undefined){
        //     map.moveLayer(averageLine);
        // }
        // if(map.getLayer(extremeLine) !== undefined){
        //     map.moveLayer(extremeLine);
        // }
        this.moveDistrictingLayer(map);
        
    }
    determineDistrictingLayerProperty = (buttonValue, layer, lineLayer, stateLayer, job, selectedState, map) => {
        if(buttonValue && selectedState === Constants.StateIdKeys[job.state.stateId] && map.getLayer(layer) !==undefined){
            map.setLayoutProperty(layer, 'visibility', 'visible');
            map.setLayoutProperty(lineLayer, 'visibility', 'visible');
            map.setLayoutProperty(stateLayer, 'visibility', 'none');
        }
        else{
            if(map.getLayer(layer) !== undefined){
                // console.log(map.getLayer(layer));
                map.setLayoutProperty(layer,'visibility', 'none');
                map.setLayoutProperty(lineLayer, 'visibility', 'none');
            }
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
    determineDistrictingLegendDisplay = (districtButtonValue, averageButtonValue, extremeButtonValue) => {
        let districtingLegend = document.getElementById('districting-legend');
        if(districtButtonValue || (averageButtonValue !== null && averageButtonValue) || (extremeButtonValue !== null && extremeButtonValue)){
            districtingLegend.style.display = 'block';
        }
        else{
            districtingLegend.style.display = 'none';
        }
    }
    determineHeatMapLegendDisplay = (precinctButtonValue, heatmapButtonValue, selectedState) => {
        let race = document.getElementById("heatmap-select").value;
        let legend = document.getElementById('heatmap-legend');
        let total = this.total_VAP[selectedState][race];
        let precinct_amount = Constants.PrecinctAmounts[selectedState];
        let percentages = [.5, .7, .9, 1, 1.5, 2, 2.5];
        let average = total/precinct_amount;
        // console.log(legend.childNodes[0]);
        if(precinctButtonValue && heatmapButtonValue && selectedState !== Constants.States.NONE){
            // console.log(legend.childNodes);
            for(var i = 1; i < legend.childNodes.length;i++){
                // console.log(legend.childNodes[i].childNodes);
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
            // let districtLayerLineName = Constants.DistrictLineLayers[state];
            // console.log(map.getStyle());
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
            let districtLayerLineName = Constants.DistrictLineLayers[selectedState];
            if(map.getLayer(districtLayerLineName) !== undefined){
                map.moveLayer(districtLayerLineName);
            }
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
    removeAllDistrictingLayers(){
        let map = this.map;
        // console.log("Removing all layers and sources");
        for(let type in Constants.DistrictingTypeLayers){
            // console.log(map.getLayer(Constants.DistrictingTypeLayers[type]))
            // console.log(map.getSource(Constants.DistrictingSource[type]))
            if(map.getLayer(Constants.DistrictingTypeLayers[type]) !== undefined){
                map.removeLayer(Constants.DistrictingTypeLayers[type]);
                map.removeLayer(Constants.DistrictingLineLayers[type]);
            }
            if(map.getSource(Constants.DistrictingSource[type]) !== undefined){
                map.removeSource(Constants.DistrictingSource[type]);
            }
        }
    }
    changeState(job, map){
        // console.log(job);
        // console.log(map);
        let state = Constants.StateIdKeys[job.state.stateId];
        document.getElementById('state-selection').value = Constants.States[state];
        document.getElementById('select-state-generation').selectedIndex = Object.keys(Constants.States).indexOf(state);
        map.flyTo({
            center: Constants.StateCenters[state],
            zoom: 6
        })
        this.changeLayer(map);
    }
    determineToolbarVisibility = (selectedState) => {
        let heatmapButton = document.getElementById('heat-checkbox');
        let districtButton = document.getElementById('district-checkbox');
        let precinctButton = document.getElementById('precinct-checkbox');
        let heatText = document.getElementById('heat-text');
        let districtText = document.getElementById('district-text');
        let precinctText = document.getElementById('precinct-text');
        let heatSelect = document.getElementById('heatmap-select');
        if(selectedState === Constants.States.NONE){
            heatmapButton.style.display = 'none';
            districtButton.style.display = 'none';
            precinctButton.style.display = 'none';
            heatText.style.display = 'none';
            districtText.style.display = 'none';
            precinctText.style.display = 'none';
            heatSelect.style.display = 'none';
        }
        else{
            heatmapButton.style.display = 'inline-block';
            districtButton.style.display = 'inline-block';
            precinctButton.style.display = 'inline-block';
            heatText.style.display = 'inline-block';
            districtText.style.display = 'inline-block';
            precinctText.style.display = 'inline-block';
            heatSelect.style.display = 'inline-block';
        }
    }
    createHeatMapOption(option) {
        let mapOption = document.createElement('option');
        mapOption.value = Constants.HeatMapMapping[option];
        mapOption.textContent = Constants.EthnicGroupNames[option];

        return mapOption;
    }

    setHeatMap(heatCheckbox, heatSelect, heatText, map) {
        heatText.textContent = 'Heatmap View'
        heatText.className = 'text';
        heatText.id = 'heat-text';
        heatSelect.className = 'heatmap-select';
        heatSelect.id = 'heatmap-select';
        heatCheckbox.type = 'checkbox';
        heatCheckbox.className = 'view-button';

        for (let group in Constants.EthnicGroups)
            if (Constants.EthnicGroups[group] !== Constants.EthnicGroups.NONE)
                heatSelect.appendChild(this.createHeatMapOption(group));

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
        precinctText.id = 'precinct-text';
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
        districtText.id='district-text';
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
        stateSelectText.className = 'state-text';
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
    setJob = (job) => {
        this.job = job;
    }
    moveDistrictingLayer(map){
        let averageDistricting = map.getLayer(Constants.DistrictingTypeLayers.AVG); 
        let averageLine = map.getLayer(Constants.DistrictingLineLayers.AVG);
        let extremeDistricting = map.getLayer(Constants.DistrictingTypeLayers.EX); 
        let extremeLine = map.getLayer(Constants.DistrictingLineLayers.EX);
        if(map.getLayer(averageLine) !== undefined){
            map.moveLayer(averageLine);
            map.moveLayer(averageDistricting);
        }
        if(map.getLayer(extremeLine) !== undefined){
            map.moveLayer(extremeLine);
            map.moveLayer(extremeDistricting);
        }
    }

}

export default Toolbar;