import React from 'react';
import './BatchCard.css';

class BatchCard extends React.Component {
    static createBatch(jobId, state, runs, compactness, populationDeviation, group, status) {
        if (jobId === 0)
            return { jobId, title: 'Enacted Districtings', state, runs, compactness, populationDeviation, group, status }
        return { jobId, title: 'Batch ' + jobId, state, runs, compactness, populationDeviation, group, status }
    }

    handleDeleteClick = (e) => {
        e.stopPropagation();
        this.props.deleteBatch(this.props.batch)
    }

    render() {
        const { batch } = this.props
        // console.log(batch)

        const statusStyles = {
            COMPLETED: "badge green-text",
            ABORTED: "badge red-text",
        }

        return (
            <div className="card z-depth-1 todo-list-link white" onClick={batch.status === "COMPLETED" ? this.props.loadBatch.bind(this, batch) : () => { this.props.unloadBatch() }}>
                <div style={{ padding: "20px" }} className="card-content black-text">
                    <span className="blue-text">
                        <h4 style={{ display: 'inline-block', margin: "0px" }}>Batch {batch.jobId}</h4>
                        <span className={statusStyles[batch.status]? statusStyles[batch.status]: "badge"}>{batch.status}</span>
                    </span>
                    {batch.jobId !== 0 &&
                        <div onClick={this.handleDeleteClick} style={{ position: "absolute", top: '0px', right: '0px', color: '#f44336', cursor: 'pointer' }}>
                            <i className="material-icons">delete</i>
                        </div>
                    }


                    <div style={this.props.active && batch.jobId !== 0 ? { display: "block" } : { display: "none" }}>
                        <table><tbody style={{ fontSize: "12px", padding: "0px !important" }}>
                            <tr>
                                <th>State:</th>
                                <td>{batch.state}</td>
                            </tr>
                            <tr>
                                <th>Plans:</th>
                                <td>{batch.runs}</td>
                            </tr>
                            <tr>
                                <th>Racial/Ethnic Group:</th>
                                <td>{batch.ethnicGroup}</td>
                            </tr>
                            <tr>
                                <th>Compactness:</th>
                                <td>{batch.compactness}</td>
                            </tr>
                            <tr>
                                <th>Population Deviation:</th>
                                <td>{batch.populationDeviation}</td>
                            </tr>
                        </tbody></table>
                    </div>
                </div>
            </div>
        );
    }
}

export default BatchCard;