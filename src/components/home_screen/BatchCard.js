import React from 'react';

class BatchCard extends React.Component {
    render() {
        const { batch } = this.props
        return (
            <div className="card z-depth-1 todo-list-link white">
                <div className="card-content black-text">
                    <span className="card-title blue-text">{ batch.title }</span>
                </div>
            </div>
        );
    }
}
export default BatchCard;