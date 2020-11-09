import React from 'react';
import BatchCard from './BatchCard';

class BatchLinks extends React.Component {

    state = {active: 0}

    setActive = (id) => {
        this.setState({active: id})
    }

    render() {
        const {batches} = this.props
        const cardStyleOn = {
            boxShadow: '0 0 5px 2px #0277bd',
        }

        const cardStyleOff = {
            boxShadow: 'none',
        }

        return (
            <div className="batch-list white section">
                <div className="card z-depth-0">
                    {batches && batches.map(batch => {
                        return (
                            <div style={this.state.active === batch.jobId? cardStyleOn : cardStyleOff} key={batch.jobId} onClick={() => {this.setActive(batch.jobId)}}>
                                 <BatchCard loadBatch={this.props.loadBatch} unloadBatch={this.props.unloadBatch} deleteBatch={this.props.deleteBatch} batch={batch} active={this.state.active === batch.jobId}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default BatchLinks