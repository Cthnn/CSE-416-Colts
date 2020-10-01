import './Toolbar.css'

class Toolbar{
    onAdd(map){
        this.map = map;
        this.container = document.createElement('div');
        this.container.className = 'toolbar';

        this.left_container = document.createElement('div');
        this.left_text = document.createElement('p');
        this.left = document.createElement('input');

        this.left_container.className = 'sub-container';
        this.left_text.textContent = 'Districts';
        this.left_text.className = 'text';
        this.left.type = 'checkbox';
        this.left.className = 'view-button';

        this.right_container = document.createElement('div');
        this.right_text = document.createElement('p');
        this.right = document.createElement('input');

        this.right_text.className = 'text';
        this.right_container.className = 'text';
        this.right_text.textContent = 'Precinct';
        this.right.type = 'checkbox';
        this.right.className = 'view-button';
        
        this.left_container.appendChild(this.left_text);
        this.left_container.appendChild(this.left);
        this.left_container.appendChild(this.right_text);
        this.left_container.appendChild(this.right);

        this.container.append(this.left_container);

        return this.container;
    }
    onRemove(){
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}

export default Toolbar;