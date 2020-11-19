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
                    this.changeLayer(this.map);
                }).catch(error => { console.error('Error:', error); });
        }
        else {
            this.changeLayer(this.map);
        }
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
                    this.addHeatMapLayer(map, state);
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

        this.averageInput = document.createElement('input');
        this.setAverageInputElement(this.averageInput, this.map)

        this.extremeInput = document.createElement('input');
        this.setExtremeInputElement(this.extremeInput, this.map)

        this.jobInput = document.createElement('input');
        this.setJobInput(this.jobInput, this.map)

        this.subContainer.appendChild(this.stateText);
        this.subContainer.appendChild(this.stateSelect);
        this.subContainer.appendChild(this.districtText);
        this.subContainer.appendChild(this.districtCheckbox);
        this.subContainer.appendChild(this.precinctText);
        this.subContainer.appendChild(this.precinctCheckbox);

        this.subContainer.appendChild(this.heatText);
        this.subContainer.appendChild(this.heat);
        this.subContainer.appendChild(this.heatDropdown);

        this.subContainer.appendChild(this.jobInput);
        this.subContainer.appendChild(this.averageInput);
        this.subContainer.appendChild(this.extremeInput);

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
                this.determineHeatLayerProperty(heatmapButtonValue, heatLayerName, selectedState, state, map);
                this.determinePrecinctLayerProperty(precinctButtonValue, precinctLayerName, stateLayerName, selectedState, state, map);
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

        let averageValue = document.getElementById('average-input').value;
        let extremeValue = document.getElementById('extreme-input').value;
        let jobIdValue = document.getElementById('job-type').value;
        let districtingTypes = [];
        districtingTypes.push(averageValue, extremeValue);

        // console.log(averageValue + " " + extremeValue + " "+ jobIdValue);
        for (var i = 0; i < districtingTypes.length; i++) {
            for (let type in Constants.DistrictingType) {
                if (Constants.DistrictingType.NONE !== districtingTypes[i]) {
                    if (Constants.DistrictingType[type] === districtingTypes[i] && districtButtonValue && selectedState !== Constants.States.NONE) {
                        // console.log(type +": "+districtingTypes[i]);
                        this.getJobDistrictingGeoJson(jobIdValue, type);
                    }
                }
            }
        }

        // console.log(selectedState);
        if (districtButtonValue)
            this.getDistrictGeoJson(selectedState).then(() => this.displayLayer(map));
        if (precinctButtonValue)
            this.getPrecinctGeoJson(selectedState).then(() => this.displayLayer(map));
        if (heatmapButtonValue)
            this.getHeatMapGeoJson(selectedState).then(() => this.displayLayer(map));

        // if(!districtButtonValue && !precinctButtonValue && !heatmapButtonValue)
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
    determinePrecinctLayerProperty = (precinctButtonValue, precinctLayerName, stateLayerName, selectedState, state, map) => {
        if (precinctButtonValue && selectedState === state && map.getLayer(precinctLayerName) !== undefined) {
            map.setLayoutProperty(precinctLayerName, 'visibility', 'visible');
            map.setLayoutProperty(stateLayerName, 'visibility', 'none');
        } else {
            if (map.getLayer(precinctLayerName) !== undefined)
                map.setLayoutProperty(precinctLayerName, 'visibility', 'none');
        }
    }
    determineHeatLayerProperty = (heatmapButtonValue, heatLayerName, selectedState, state, map) => {
        if (heatmapButtonValue && selectedState === state && map.getLayer(heatLayerName) !== undefined) {
            let race = document.getElementById("heatmap-select").value;
            map.setPaintProperty(heatLayerName, 'heatmap-weight', {
                property: race,
                type: 'exponential',
                stops: [
                    [1, 0],
                    [62, 1]
                ]
            });
            map.setLayoutProperty(heatLayerName, 'visibility', 'visible');
        } else {
            if (map.getLayer(heatLayerName) !== undefined)
                map.setLayoutProperty(heatLayerName, 'visibility', 'none');
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

    setAverageInputElement(averageInput, map) {
        averageInput.className = 'average-input';
        averageInput.id = 'average-input';
        averageInput.setAttribute('type', 'hidden');
        averageInput.value = Constants.DistrictingType.NONE;
        averageInput.addEventListener('click', () => {
            this.changeLayer(map)
        })
    }

    setExtremeInputElement(extremeInput, map) {
        extremeInput.className = 'extreme-input';
        extremeInput.id = 'extreme-input';
        extremeInput.setAttribute('type', 'hidden');
        extremeInput.value = Constants.DistrictingType.NONE;
        extremeInput.addEventListener('click', () => {
            this.changeLayer(map)
        })
    }
    setJobInput(jobType, map) {
        jobType.className = 'job-type';
        jobType.id = 'job-type';
        jobType.setAttribute('type', 'hidden');
        jobType.value = Constants.CurrentEnactedDistrictingJobId;
        jobType.addEventListener('click', () => {
            this.changeLayer(map)
        })
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