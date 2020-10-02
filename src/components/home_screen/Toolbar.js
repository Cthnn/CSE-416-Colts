import './Toolbar.css'

class Toolbar{
    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.sub_container = document.createElement('form');
        this.container.className = 'toolbar';

        this.left_text = document.createElement('p');
        this.left = document.createElement('input');

        this.left_text.textContent = 'State';
        this.left_text.className = 'text';
        this.left.type = 'checkbox';
        this.left.className = 'view-button';
        
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

        this.left.id = 'state-checkbox';
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

        this.option1.value = 'Alabama';
        this.option1.textContent = 'Alabama';
        this.option2.value = 'Florida';
        this.option2.textContent = 'Florida';
        this.option3.value = 'Texas';
        this.option3.textContent = 'Texas';
        this.heat_dropdown.appendChild(this.option1);
        this.heat_dropdown.appendChild(this.option2);
        this.heat_dropdown.appendChild(this.option3);

        this.heat.id = 'heat-checkbox';

        
        
        this.left_text.addEventListener('click', function(){
            document.getElementById('state-checkbox').checked = !document.getElementById('state-checkbox').checked;
        })
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