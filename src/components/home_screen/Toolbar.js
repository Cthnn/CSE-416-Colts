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
        this.left.type = 'radio';
        this.left.className = 'view-button';
        
        this.middle_text = document.createElement('p');
        this.middle = document.createElement('input');

        this.middle_text.textContent = 'Districts';
        this.middle_text.className = 'text';
        this.middle.type = 'radio';
        this.middle.className = 'view-button';

        this.right_text = document.createElement('p');
        this.right = document.createElement('input');

        this.right_text.className = 'text';
        this.right_text.textContent = 'Precinct';
        this.right.type = 'radio';
        this.right.className = 'view-button';

        this.left.name = 'view-choice';
        this.middle.name = 'view-choice';
        this.right.name = 'view-choice';

        this.heat_text = document.createElement('p');
        this.heat = document.createElement('input');

        this.heat_text.textContent = 'Heatmap View'
        this.heat_text.className = 'text';
        this.heat.type = 'checkbox';
        this.heat.className = 'view-button';
        
        this.left_text.addEventListener('click', function(){
            this.left.checked = !this.left.checked;
        })
        // this.left_text.onclick = function(){
        //     this.left.checked = !this.left.checked;
        // }

        this.sub_container.appendChild(this.left_text);
        this.sub_container.appendChild(this.left);
        this.sub_container.appendChild(this.middle_text);
        this.sub_container.appendChild(this.middle);
        this.sub_container.appendChild(this.right_text);
        this.sub_container.appendChild(this.right);

        this.sub_container.appendChild(this.heat_text);
        this.sub_container.appendChild(this.heat);

        this.container.appendChild(this.sub_container);

        return this.container;
    }
    onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default Toolbar;