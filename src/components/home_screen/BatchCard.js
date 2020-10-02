import React from 'react';
import './BatchCard.css';
import { Modal } from 'react-materialize';

class BatchCard extends React.Component {
    static createBatch(id, state, plans, compactness, population, group, status) {
        if (id == 0)
            return { id, title: 'Enacted Districtings', state, plans, compactness, population, group, status }
        return { id, title: 'Batch ' + id, state, plans, compactness, population, group, status }
    }

    handleDeleteClick = (e) => {
        e.stopPropagation();
        this.props.deleteBatch(this.props.batch)
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
            <div className="card z-depth-1 todo-list-link white" onClick={batch.status === "Complete" ? this.props.loadBatch.bind(this, batch) : () => { this.props.unloadBatch() }}>
                <div style={{ padding: "20px" }} className="card-content black-text">
                    <span className="blue-text">
                        <h4 style={{ display: 'inline-block', margin: "0px" }}>{batch.title}</h4>
                        <span className="badge">{batch.status}</span>
                    </span>
                    <a onClick={this.handleDeleteClick} style={{ position: "absolute", top: '0px', right: '0px', color: '#f44336', cursor: 'pointer' }}>
                        <i className="material-icons">delete</i>
                    </a>


                    <div style={this.props.active && batch.id !== 0 ? { display: "block" } : { display: "none" }}>
                        <table><tbody style={{ fontSize: "12px", padding: "0px !important" }}>
                            <tr>
                                <th>State:</th>
                                <td>{batch.state}</td>
                            </tr>
                            <tr>
                                <th>Plans:</th>
                                <td>{batch.plans}</td>
                            </tr>
                            <tr>
                                <th>Racial/Ethnic Group:</th>
                                <td>{batch.group}</td>
                            </tr>
                            <tr>
                                <th>Compactness:</th>
                                <td>{batch.compactness}</td>
                            </tr>
                            <tr>
                                <th>Population Deviation:</th>
                                <td>{batch.population}</td>
                            </tr>
                        </tbody></table>
                    </div>
                </div>
            </div>
        );
    }
}

export default BatchCard;