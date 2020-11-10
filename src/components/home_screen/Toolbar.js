import './Toolbar.css';
import * as Constants from './MapConstants.js';

class Toolbar {
    getDistrictGeoJson(map, state){
        var layer = map.getLayer(Constants.DistrictLayers[state]);
        if(layer == undefined){
            this.addDistrictSource(map, state);
            this.addDistrictLayer(map, state);
            // var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            // fetch('http://localhost:8080/district', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
            //     console.log("success");
            //     this.addDistrictSource(map, state, result);
            //     this.addDistrictLayer(map,state);
            // }).catch(error => {console.error('Error:', error);});
        }
    }

    getPrecinctGeoJson(map, state){
        var layer = map.getLayer(Constants.PrecinctLayers[state]);
        if(layer == undefined){
            this.addPrecinctSource(map, state);
            this.addPrecinctLayer(map, state);
            // var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            // fetch('http://localhost:8080/precinct', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
            //     console.log("success");
            //     this.addPrecinctSource(map, state, result);
            //     this.addPrecinctLayer(map,state);
            // }).catch(error => {console.error('Error:', error);});
        }
    }

    getHeatMapGeoJson(map, state){
        var layer = map.getLayer(Constants.HeatMapLayers[state]);
        if(layer == undefined){
            this.addHeatMapSource(map, state);
            this.addHeatMapLayer(map, state);
            // var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            // fetch('http://localhost:8080/heatmap', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
            //     console.log("success");
            //     this.addHeatMapSource(map, state, result);
            //     this.addHeatMapLayer(map,state);
            // }).catch(error => {console.error('Error:', error);});
        }
    }

    onAdd(map) {
        this.map = map;
        this.container = document.createElement('div');
        this.sub_container = document.createElement('form');
        this.container.className = 'toolbar';

        this.left_text = document.createElement('p');
        this.left = document.createElement('select');
        this.left.className = 'state-select';

        this.state_option0 = document.createElement('option');
        this.state_option1 = document.createElement('option');
        this.state_option2 = document.createElement('option');
        this.state_option3 = document.createElement('option');

        this.state_option0.value = 'None';
        this.state_option1.value = Constants.States.AL;
        this.state_option2.value = Constants.States.FL;
        this.state_option3.value = Constants.States.VA;

        this.state_option1.textContent = 'None';
        this.state_option1.textContent = Constants.StateNames.AL;
        this.state_option2.textContent = Constants.StateNames.FL;
        this.state_option3.textContent = Constants.StateNames.VA;

        this.left.appendChild(this.state_option0);
        this.left.appendChild(this.state_option1);
        this.left.appendChild(this.state_option2);
        this.left.appendChild(this.state_option3);

        this.left_text.textContent = 'State';
        this.left_text.className = 'text';

        this.middle_text = document.createElement('p');
        this.middle = document.createElement('input');

        this.middle_text.textContent = 'Districts';
        this.middle_text.className = 'text';
        this.middle.type = 'checkbox';
        this.middle.className = 'view-button';

        this.right_text = document.createElement('p');
        this.right = document.createElement('input');

        this.right_text.className = 'text';
        this.right_text.textContent = 'Precinct';
        this.right.type = 'checkbox';
        this.right.className = 'view-button';

        this.left.name = 'view-choice';
        this.middle.name = 'view-choice';
        this.right.name = 'view-choice';

        this.left.id = 'state-selection';
        this.middle.id = 'district-checkbox';
        this.right.id = 'precinct-checkbox';

        this.heat_text = document.createElement('p');
        this.heat = document.createElement('input');
        this.heat_dropdown = document.createElement('select');

        this.heat_text.textContent = 'Heatmap View'
        this.heat_text.className = 'text';
        this.heat_dropdown.className = 'heatmap-select';
        this.heat_dropdown.id = 'heatmap-select';
        this.heat.type = 'checkbox';
        this.heat.className = 'view-button';

        this.option1 = document.createElement('option');
        this.option2 = document.createElement('option');
        this.option3 = document.createElement('option');
        this.option4 = document.createElement('option');
        this.option5 = document.createElement('option');
        this.option6 = document.createElement('option');

        this.option1.value = 'T2';
        this.option1.textContent = 'White American';
        this.option2.value = 'T3';
        this.option2.textContent = 'Black or African American';
        this.option3.value = 'T4';
        this.option3.textContent = 'Native American and Alaska Native';
        this.option4.value = 'T5';
        this.option4.textContent = 'Asian American';
        this.option5.value = 'T6';
        this.option5.textContent = 'Native Hawaiian and Other Pacific Islander';
        this.option6.value = 'T8';
        this.option6.textContent = 'Hispanic or Latino';

        this.heat_dropdown.appendChild(this.option1);
        this.heat_dropdown.appendChild(this.option2);
        this.heat_dropdown.appendChild(this.option3);
        this.heat_dropdown.appendChild(this.option4);
        this.heat_dropdown.appendChild(this.option5);
        this.heat_dropdown.appendChild(this.option6);

        this.heat.id = 'heat-checkbox';
        //state
        this.left.addEventListener('change', (e) => {
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
            
            var params = JSON.stringify(Constants.StateNames[state].toUpperCase());
            console.log(params);
            fetch('http://localhost:8080/state', {headers:{"Content-Type":"application/json"},method: 'POST',body:params}).then(response => response.text()).then(result => {
                console.log('Success:', result);
                this.changeLayer(map);
            }).catch(error => {console.error('Error:', error);});
        })

        //district
        this.middle.addEventListener('click', () => {
            this.changeLayer(map);
        })
        //precinct
        this.right.addEventListener('click', () => {
            this.changeLayer(map);
        })
        //heatmap
        this.heat_dropdown.addEventListener('change', () => {
            this.changeLayer(map);
        })

        this.heat.addEventListener('click', () => {
            this.changeLayer(map);

            // var button = document.getElementById('heat-checkbox');
            // var state = document.getElementById('state-selection').value;
            // var ethnicGroup = document.getElementById('heatmap-select').value;
            

            // if(button.checked){
            //     var params = JSON.stringify({
            //         's': Constants.StateNames[state].toUpperCase(),
            //         'eg': ethnicGroup
            //     })
            //     fetch('http://localhost:8080/heatmap', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params }).then(response => response.text()).then(result => { console.log('Success:', result); }).catch(error => { console.error('Error:', error); });

            // }
        })

        this.sub_container.appendChild(this.left_text);
        this.sub_container.appendChild(this.left);
        this.sub_container.appendChild(this.middle_text);
        this.sub_container.appendChild(this.middle);
        this.sub_container.appendChild(this.right_text);
        this.sub_container.appendChild(this.right);

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

    changeLayer = (map) => {
        var selected_state = document.getElementById('state-selection').value;
        var district_button_value = document.getElementById('district-checkbox').checked;
        var precinct_button_value = document.getElementById('precinct-checkbox').checked;
        var heatmap_button_value = document.getElementById('heat-checkbox').checked;

        if(district_button_value){
            this.getDistrictGeoJson(selected_state);
        }

        if(precinct_button_value){
            this.getPrecinctGeoJson(selected_state);
        }

        if(heatmap_button_value){
            this.getHeatMapGeoJson(selected_state);
        }

        for (var state in Constants.States) {
            var district_layer_name = Constants.DistrictLayers[state];
            var precinct_layer_name = Constants.PrecinctLayers[state];
            var heat_layer_name = Constants.HeatMapLayers[state];
            var state_layer_name = Constants.StateLayers[state];

            map.setLayoutProperty(state_layer_name, 'visibility', 'visible');
            map.setPaintProperty(state_layer_name, 'fill-color',  'rgba(200, 100, 240, 0.4)');

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
    }
}

export default Toolbar;