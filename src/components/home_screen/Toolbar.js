import './Toolbar.css'

class Toolbar{
    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.sub_container = document.createElement('form');
        this.container.className = 'toolbar';

        this.left_text = document.createElement('p');
        this.left = document.createElement('select');
        this.left.className = 'state-select';

        this.state_option1 = document.createElement('option');
        this.state_option2 = document.createElement('option');
        this.state_option3 = document.createElement('option');

        this.state_option1.value = 'AL';
        this.state_option2.value = 'FL';
        this.state_option3.value = 'TX';

        this.state_option1.textContent = 'Alabama';
        this.state_option2.textContent = 'Florida';
        this.state_option3.textContent = 'Texas';

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
        this.heat.type = 'checkbox';
        this.heat.className = 'view-button';

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

        this.heat_dropdown.appendChild(this.option1);
        this.heat_dropdown.appendChild(this.option2);
        this.heat_dropdown.appendChild(this.option3);
        this.heat_dropdown.appendChild(this.option4);
        this.heat_dropdown.appendChild(this.option5);

        this.heat.id = 'heat-checkbox';

        
        
        // this.left_text.addEventListener('click', function(){
        //     document.getElementById('state-checkbox').checked = !document.getElementById('state-checkbox').checked;
        // })
        this.middle_text.addEventListener('click', function(){
            document.getElementById('district-checkbox').checked = !document.getElementById('district-checkbox').checked;
        })
        this.right_text.addEventListener('click', function(){
            document.getElementById('precinct-checkbox').checked = !document.getElementById('precinct-checkbox').checked;
        })
        this.heat_text.addEventListener('click', function(){
            document.getElementById('heat-checkbox').checked = !document.getElementById('heat-checkbox').checked;
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
    onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default Toolbar;