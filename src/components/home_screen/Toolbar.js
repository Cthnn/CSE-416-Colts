import './Toolbar.css';
import * as Constants from './MapConstants.js';

class Toolbar {
    setState(state) {
        if (state !== Constants.States.NONE) {
            let params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            fetch('http://localhost:8080/state', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params })
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
    // this is binded to MapHelper
    async getDistrictGeoJson(map, state) {
        let layer = map.getLayer(Constants.DistrictLayers[state]);
        if (layer === undefined && state !== Constants.States.NONE) {
            let params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            await fetch('http://localhost:8080/district', {headers:{"Content-Type":"application/json"},method: 'POST',body:params})
            .then(response => response.text())
            .then(result => {
                console.log("recieved district data");
                this.addDistrictSource(map, state, JSON.parse(result));
                this.addDistrictLayer(map,state);
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
            let params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            await fetch('http://localhost:8080/precinct', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params })
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
            let params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            await fetch('http://localhost:8080/heatmap', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params })
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
        this.sub_container = document.createElement('form');
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

        this.heat_text = document.createElement('p');
        this.heat = document.createElement('input');
        this.heat_dropdown = document.createElement('select');
        this.setHeatMap(this.heat, this.heat_dropdown, this.heat_text, this.map);

        this.districtType = document.createElement('input');
        this.setDistrictType(this.districtType, this.map)

        this.sub_container.appendChild(this.stateText);
        this.sub_container.appendChild(this.stateSelect);
        this.sub_container.appendChild(this.districtText);
        this.sub_container.appendChild(this.districtCheckbox);
        this.sub_container.appendChild(this.precinctText);
        this.sub_container.appendChild(this.precinctCheckbox);

        this.sub_container.appendChild(this.heat_text);
        this.sub_container.appendChild(this.heat);
        this.sub_container.appendChild(this.heat_dropdown);
        this.sub_container.appendChild(this.districtType);

        this.container.appendChild(this.sub_container);

        return this.container;
    }
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }

    displayLayer = (map) => {
        let selected_state = document.getElementById('state-selection').value;
        let district_button_value = document.getElementById('district-checkbox').checked;
        let precinct_button_value = document.getElementById('precinct-checkbox').checked;
        let heatmap_button_value = document.getElementById('heat-checkbox').checked;

        for (let state in Constants.States) {
            let district_layer_name = Constants.DistrictLayers[state];
            let district_line_layer_name = Constants.DistrictLineLayers[state];
            let precinct_layer_name = Constants.PrecinctLayers[state];
            let heat_layer_name = Constants.HeatMapLayers[state];
            let state_layer_name = Constants.StateLayers[state];

            if(map.getLayer(state_layer_name) !== undefined){
                map.setLayoutProperty(state_layer_name, 'visibility', 'visible');
                map.setPaintProperty(state_layer_name, 'fill-color', Constants.DefaultColor);
            }
            if (selected_state !== Constants.States.NONE) {
                this.determineHeatLayerProperty(heatmap_button_value, heat_layer_name, selected_state, state, map);
                this.determinePrecinctLayerProperty(precinct_button_value, precinct_layer_name, state_layer_name, selected_state, state, map);
                this.determineDistrictLayerProperty(district_button_value, district_layer_name, district_line_layer_name, state_layer_name, selected_state, state, map);
                
                if (!district_button_value && !precinct_button_value) { //All states visible
                    this.determineStateLayerProperty(state_layer_name, selected_state, state, map);
                }
            }
            else { //Show just states now
                this.setToStateOnlyView(state_layer_name, district_layer_name, district_line_layer_name, precinct_layer_name, map);
            }
        }
        this.removeSelectedFeatureLayer(map);
    }
    
    changeLayer = (map) => {
        let selected_state = document.getElementById('state-selection').value;
        let district_button_value = document.getElementById('district-checkbox').checked;
        let precinct_button_value = document.getElementById('precinct-checkbox').checked;
        let heatmap_button_value = document.getElementById('heat-checkbox').checked;
        let district_type_value = document.getElementById('district-type').value;

        console.log(selected_state);
        if (district_button_value)
            this.getDistrictGeoJson(selected_state).then(() => this.displayLayer(map));
        if (precinct_button_value)
            this.getPrecinctGeoJson(selected_state).then(() => this.displayLayer(map));
        if (heatmap_button_value)
            this.getHeatMapGeoJson(selected_state).then(() => this.displayLayer(map));

        // if(!district_button_value && !precinct_button_value && !heatmap_button_value)
        if (selected_state === Constants.States.NONE || (!district_button_value && !precinct_button_value && !heatmap_button_value)) {
            this.displayLayer(map);
        }
    }
    determineDistrictLayerProperty = (district_button_value, district_layer_name, district_line_layer_name, state_layer_name, selected_state, state, map) => {
        if (district_button_value && selected_state === state && map.getLayer(district_layer_name) !== undefined && map.getLayer(district_line_layer_name) !== undefined) {
            map.setLayoutProperty(district_layer_name, 'visibility', 'visible');
            map.setLayoutProperty(district_line_layer_name, 'visibility', 'visible');
            map.setLayoutProperty(state_layer_name, 'visibility', 'none');
        } else {
            if (map.getLayer(district_layer_name) !== undefined && map.getLayer(district_line_layer_name) !== undefined){
                map.setLayoutProperty(district_layer_name, 'visibility', 'none');
                map.setLayoutProperty(district_line_layer_name, 'visibility', 'none');
            } 
        }
    }
    determinePrecinctLayerProperty = (precinct_button_value, precinct_layer_name, state_layer_name, selected_state, state, map) => {
        if (precinct_button_value && selected_state === state && map.getLayer(precinct_layer_name) !== undefined) {
            map.setLayoutProperty(precinct_layer_name, 'visibility', 'visible');
            map.setLayoutProperty(state_layer_name, 'visibility', 'none');
        } else {
            if (map.getLayer(precinct_layer_name) !== undefined)
                map.setLayoutProperty(precinct_layer_name, 'visibility', 'none');
        }
    }
    determineHeatLayerProperty = (heatmap_button_value, heat_layer_name, selected_state, state, map) => {
        if (heatmap_button_value && selected_state === state && map.getLayer(heat_layer_name) !== undefined) {
            let race = document.getElementById("heatmap-select").value;
            map.setPaintProperty(heat_layer_name, 'heatmap-weight', {
                property: race,
                type: 'exponential',
                stops: [
                    [1, 0],
                    [62, 1]
                ]
            });
            map.setLayoutProperty(heat_layer_name, 'visibility', 'visible');
        } else {
            if (map.getLayer(heat_layer_name) !== undefined)
                map.setLayoutProperty(heat_layer_name, 'visibility', 'none');
        }
    }
    determineStateLayerProperty = (state_layer_name, selected_state, state, map) => {
        if(map.getLayer(state_layer_name) !== undefined){
            map.setLayoutProperty(state_layer_name, 'visibility', 'visible');
            if (selected_state === state)
                map.setPaintProperty(state_layer_name, 'fill-color', Constants.SelectedColor);
            else
                map.setPaintProperty(state_layer_name, 'fill-color', Constants.DefaultColor);
        }
    }

    setToStateOnlyView = (state_layer_name, district_layer_name, district_line_layer_name, precinct_layer_name, map) => {
        if (map.getLayer(state_layer_name) !== undefined)
            map.setLayoutProperty(state_layer_name, 'visibility', 'visible');
        if (map.getLayer(district_layer_name) !== undefined && map.getLayer(district_line_layer_name) !== undefined){
            map.setLayoutProperty(district_layer_name, 'visibility', 'none');
            map.setLayoutProperty(district_line_layer_name, 'visibility', 'none');
        }
        if (map.getLayer(precinct_layer_name) !== undefined)
            map.setLayoutProperty(precinct_layer_name, 'visibility', 'none');
    }
    removeSelectedFeatureLayer = (map) => {
        if (map.getLayer(Constants.SelectedFeatureLayer) !== undefined){
            map.removeLayer(Constants.SelectedFeatureLayer);
            map.removeSource(Constants.SelectedFeatureLayer);
        }
    }
    
    setDistrictType(districtType, map) {
        districtType.className = 'district-type';
        districtType.id = 'district-type';
        districtType.setAttribute('type', 'hidden');
        districtType.addEventListener('click', () => {
            this.changeLayer(map)
        })
    }

    creatHeatMapOption(option){
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

        for(let group in Constants.EthnicGroups)
            if(Constants.EthnicGroups[group] !== Constants.EthnicGroups.NONE)
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

    createStateOption(option){
        let stateOption = document.createElement('option');
        stateOption.value = Constants.States[option];
        stateOption.textContent = Constants.StateNames[option];

        return stateOption;
    }

    setStateSelect(stateSelect, stateSelectText, map) {
        stateSelect.className = 'state-select';

        for(let state in Constants.States)
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