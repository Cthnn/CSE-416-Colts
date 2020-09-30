import React from 'react';

class BatchCard extends React.Component {
    static createBatch(id, state, plans, compactness, population, group, status){
        return {id, title: 'Batch ' + id, state, plans, compactness, population, group, status}
    }

    render() {
        const { batch } = this.props
        const propertyStyle = {
            display: 'inline-block',
        }
        const divStyle = {
            height: '20px',
        }

        return (
            <div
                className="card z-depth-1 todo-list-link white"
                onClick={this.props.loadBatch.bind(this, batch)}
            >
                <div className="card-content black-text">
                    <span className="blue-text">
                        <h3 style={{display:'inline-block'}}>{batch.title}</h3> 
                        <span className="black-text right">{batch.status}</span>
                    </span>
                    
                    <div className="" style={divStyle}><h5 style={propertyStyle}>State:</h5> {batch.state}</div>
                    <div className="" style={divStyle}><h5 style={propertyStyle}>Plans:</h5> {batch.plans}</div>
                    <div className="" style={divStyle}><h5 style={propertyStyle}>Group:</h5> {batch.group}</div>
                    <div className="" style={divStyle}><h5 style={propertyStyle}>Compactness:</h5> {batch.compactness}</div>
                    <div className="" style={divStyle}><h5 style={propertyStyle}>Population equality threshold:</h5> {batch.population}</div>


                </div>
            </div>
        );
    }
}

export default BatchCard;