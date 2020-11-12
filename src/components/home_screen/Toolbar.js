import './Toolbar.css';
import * as Constants from './MapConstants.js';

class Toolbar {
    setState(state){
        if(state != 'None'){
            var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
            console.log('Success:', result); 
            this.changeLayer(this.map);
            }).catch(error => {console.error('Error:', error);});
        }
        else{
            this.changeLayer(this.map);
        }
    }
    // this is binded to MapHelper
    async getDistrictGeoJson(map, state){
        var layer = map.getLayer(Constants.DistrictLayers[state]);
        if(layer == undefined && state != 'None'){
            this.addDistrictSource(map, state);
            this.addDistrictLayer(map,state);
            // var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            // fetch('http://localhost:8080/district', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
            //     console.log("success");
            //     this.addDistrictSource(map, state, result);
            //     this.addDistrictLayer(map,state);
            // }).catch(error => {console.error('Error:', error);});
        }
    }
    // this is binded to MapHelper
    async getPrecinctGeoJson(map, state){
        var layer = map.getLayer(Constants.PrecinctLayers[state]);
        if(layer == undefined && state != 'None'){
            var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            await fetch('http://localhost:8080/precinct', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
                console.log("recieved precinct data");
                console.log(result);
                this.addPrecinctSource(map, state, JSON.parse(result));
                this.addPrecinctLayer(map,state);
            }).catch(error => {
                console.error('Error:', error);
                // For debugging when server is offline
                // this.addPrecinctSource(map, state, './'+Constants.StateNames[state].toLowerCase()+'-precincts.geojson');
                // this.addPrecinctLayer(map,state);
            });
        }
    }
    // this is binded to MapHelper
    async getHeatMapGeoJson(map, state){
        var layer = map.getLayer(Constants.HeatMapLayers[state]);
        if(layer == undefined && state != 'None'){
            var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            await fetch('http://localhost:8080/heatmap', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
                console.log("recieved heatmap data");
                this.addHeatMapSource(map, state, JSON.parse(result));
                this.addHeatMapLayer(map,state);
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

        this.sub_container.appendChild(this.stateText);
        this.sub_container.appendChild(this.stateSelect);
        this.sub_container.appendChild(this.districtText);
        this.sub_container.appendChild(this.districtCheckbox);
        this.sub_container.appendChild(this.precinctText);
        this.sub_container.appendChild(this.precinctCheckbox);

        this.sub_container.appendChild(this.heat_text);
        this.sub_container.appendChild(this.heat);
        this.sub_container.appendChild(this.heat_dropdown);

        this.container.appendChild(this.sub_container);

        return this.container;
    }
    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
    setHeatMap(heatCheckbox, heatSelect, heatText, map){
        heatText.textContent = 'Heatmap View'
        heatText.className = 'text';
        heatSelect.className = 'heatmap-select';
        heatSelect.id = 'heatmap-select';
        heatCheckbox.type = 'checkbox';
        heatCheckbox.className = 'view-button';

        this.option1 = document.createElement('option');
        this.option2 = document.createElement('option');
        this.option3 = document.createElement('option');
        this.option4 = document.createElement('option');
        this.option5 = document.createElement('option');

        this.option1.value = 'white';
        this.option1.textContent = 'White American';
        this.option2.value = 'black';
        this.option2.textContent = 'Black or African American';
        this.option3.value = 'native';
        this.option3.textContent = 'Native American and Alaska Native';
        this.option4.value = 'asian';
        this.option4.textContent = 'Asian American';
        this.option5.value = 'pacific';
        this.option5.textContent = 'Native Hawaiian and Other Pacific Islander';

        heatSelect.appendChild(this.option1);
        heatSelect.appendChild(this.option2);
        heatSelect.appendChild(this.option3);
        heatSelect.appendChild(this.option4);
        heatSelect.appendChild(this.option5);

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

    setPrecinctCheckbox(precinctCheckbox, precinctText, map){
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
    setDistrictCheckbox(districtCheckbox, districtText, map){
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
    setStateSelect(stateSelect, stateSelectText, map){
        this.state_option0 = document.createElement('option');
        this.state_option1 = document.createElement('option');
        this.state_option2 = document.createElement('option');
        this.state_option3 = document.createElement('option');

        this.state_option0.value = 'None';
        this.state_option1.value = 'AL';
        this.state_option2.value = 'FL';
        this.state_option3.value = 'VA';

        this.state_option1.textContent = 'None';
        this.state_option1.textContent = 'Alabama';
        this.state_option2.textContent = 'Florida';
        this.state_option3.textContent = 'Virginia';

        stateSelect.className = 'state-select';

        stateSelect.appendChild(this.state_option0);
        stateSelect.appendChild(this.state_option1);
        stateSelect.appendChild(this.state_option2);
        stateSelect.appendChild(this.state_option3);

        stateSelectText.textContent = 'State';
        stateSelectText.className = 'text';
        stateSelect.name = 'view-choice';
        stateSelect.id = 'state-selection';

        stateSelect.addEventListener('change', (e) => {
            var state = e.target.value;
            var elem = document.getElementById('select-state-generation');

            if (state === 'None') {
                map.flyTo({
                    center: [-100.04, 38.907],
                    zoom: 3
                })
                elem.selectedIndex = '0';
            }else{
                map.flyTo({
                    center: Constants.StateCenters[state],
                    zoom: 6
                })
                elem.selectedIndex = Object.keys(Constants.States).indexOf(state) + 1;
            }
            this.setState(state);
        })
    }
    displayLayer = (map) => {
        var selected_state = document.getElementById('state-selection').value;
        var district_button_value = document.getElementById('district-checkbox').checked;
        var precinct_button_value = document.getElementById('precinct-checkbox').checked;
        var heatmap_button_value = document.getElementById('heat-checkbox').checked;
        console.log(selected_state + " " + district_button_value);

        for (var state in Constants.States) {
            var district_layer_name = Constants.DistrictLayers[state];
            var precinct_layer_name = Constants.PrecinctLayers[state];
            var heat_layer_name = Constants.HeatMapLayers[state];
            var state_layer_name = Constants.StateLayers[state];

            map.setLayoutProperty(state_layer_name, 'visibility', 'visible');
            map.setPaintProperty(state_layer_name, 'fill-color',  'rgba(200, 100, 240, 0.4)');
            if(selected_state != 'None'){
                if(heatmap_button_value && selected_state == state && map.getLayer(heat_layer_name) != undefined){
                    var race = document.getElementById("heatmap-select").value;
                    map.setPaintProperty(heat_layer_name, 'heatmap-weight',{
                        property: race,
                        type: 'exponential',
                        stops: [
                            [1, 0],
                            [62, 1]
                        ]
                        });
                    map.setLayoutProperty(heat_layer_name, 'visibility', 'visible');
                }else{
                    if(map.getLayer(heat_layer_name) != undefined)
                        map.setLayoutProperty(heat_layer_name, 'visibility', 'none');
                }

                if(precinct_button_value && selected_state == state && map.getLayer(precinct_layer_name) != undefined){
                    map.setLayoutProperty(precinct_layer_name, 'visibility', 'visible');
                    map.setLayoutProperty(state_layer_name, 'visibility', 'none');
                }else{
                    if(map.getLayer(precinct_layer_name) != undefined)
                        map.setLayoutProperty(precinct_layer_name, 'visibility', 'none');
                }
                if(district_button_value  && selected_state == state && map.getLayer(district_layer_name) != undefined){
                    map.setLayoutProperty(district_layer_name, 'visibility', 'visible');
                    map.setLayoutProperty(state_layer_name, 'visibility', 'none');
                }else{
                    if(map.getLayer(district_layer_name) != undefined)
                        map.setLayoutProperty(district_layer_name, 'visibility', 'none');
                }
                if(!district_button_value && !precinct_button_value){
                    map.setLayoutProperty(state_layer_name, 'visibility', 'visible');
                    if(selected_state == state)
                        map.setPaintProperty(state_layer_name, 'fill-color',  'rgba(252, 215, 3, 0.2)');
                    else
                        map.setPaintProperty(state_layer_name, 'fill-color',  'rgba(200, 100, 240, 0.2)');
                }
            }
            else{ //Show just states now
                map.setLayoutProperty(state_layer_name, 'visibility', 'visible');
                if(map.getLayer(district_layer_name) != undefined)
                    map.setLayoutProperty(district_layer_name, 'visibility', 'none');
                if(map.getLayer(precinct_layer_name) != undefined)
                    map.setLayoutProperty(precinct_layer_name, 'visibility', 'none');
            }
        }
    }

    changeLayer = (map) => {
        var selected_state = document.getElementById('state-selection').value;
        var district_button_value = document.getElementById('district-checkbox').checked;
        var precinct_button_value = document.getElementById('precinct-checkbox').checked;
        var heatmap_button_value = document.getElementById('heat-checkbox').checked;
        console.log(selected_state);
        if(district_button_value)
            this.getDistrictGeoJson(selected_state).then(() => this.displayLayer(map));
        if(precinct_button_value)
            this.getPrecinctGeoJson(selected_state).then(() => this.displayLayer(map));
        if(heatmap_button_value)
            this.getHeatMapGeoJson(selected_state).then(() => this.displayLayer(map));

        // if(!district_button_value && !precinct_button_value && !heatmap_button_value)
        if(selected_state == 'None' || (!district_button_value && !precinct_button_value && !heatmap_button_value)){
            this.displayLayer(map);
        }
    }
}

export default Toolbar;