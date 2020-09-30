import React from 'react';
import BatchCard from './BatchCard';

class BatchLinks extends React.Component {
    render() {
        const {batches} = this.props
        return (
            <div className="batch-list white section">
                <div className="zard z-depth-0">
                    {batches && batches.map(batch => {
                        return (
                            <div key={batch.id}>
                                 <BatchCard loadBatch={this.props.loadBatch} batch={batch}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default BatchLinks