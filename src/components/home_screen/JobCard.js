import React from 'react';
import './JobCard.css';
import * as Constants from './MapConstants.js';
import Summary from './Summary'

import { Modal, Button } from 'react-materialize';

class JobCard extends React.Component {
    static createJob(jobId, state, plans, compactness, populationDeviation, group, status) {
        return { jobId, title: 'Job ' + jobId, state, plans, compactness, populationDeviation, group, status }
    }

    handleDeleteClick = (e) => {
        e.stopPropagation();
        this.props.deleteJob(this.props.job)
    }

    handleDistrictingClick = (e) => {
        this.props.handleDistrictingClick(e.target.checked, e.target.value);
    }

    handleToggle = (e) => {
        console.log('hi')
        // document.getElementById('summary-button').click()
    }

    render() {
        const { job } = this.props
        const statusStyles = {
            COMPLETED: "badge green-text",
            ABORTED: "badge red-text",
        }

        const modalStyle = {
            overflow: 'hidden',
            height: '700px',
            width: '1200px'
        }

        return (
            <div className="card z-depth-1 todo-list-link white" onClick={job.status === "COMPLETED" ? this.props.loadJob.bind(this, job) : () => { this.props.unloadJob() }}>
                <div style={{ padding: "20px" }} className="card-content black-text">
                    <span className="blue-text">
                        <h4 style={{ display: 'inline-block', margin: "0px" }}>Job {job.jobId}</h4>
                        <span className={statusStyles[job.status] ? statusStyles[job.status] : "badge"}>{job.status}</span>
                    </span>
                    {job.jobId !== 0 &&
                        <div onClick={this.handleDeleteClick} style={{ position: "absolute", top: '0px', right: '0px', color: '#f44336', cursor: 'pointer' }}>
                            <i className="material-icons">delete</i>
                        </div>
                    }


                    <div style={this.props.active && job.jobId !== 0 ? { display: "block" } : { display: "none" }}>
                        <table><tbody style={{ fontSize: "12px", padding: "0px !important" }}>
                            <tr>
                                <th>State:</th>
                                <td>{Constants.StateIds[job.state.stateId]}</td>
                            </tr>
                            <tr>
                                <th>Plans:</th>
                                <td>{job.plans.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>Racial/Ethnic Group:</th>
                                <td>{Constants.EthnicGroupNames[job.ethnicGroup]}</td>
                            </tr>
                            <tr>
                                <th>Compactness:</th>
                                <td>{Constants.CompactNames[job.compactness]}</td>
                            </tr>
                            <tr>
                                <th>Population Deviation:</th>
                                <td>{job.populationDeviation}</td>
                            </tr>
                        </tbody></table>
                        <div style={job.status === "COMPLETED" ? { display: "block" } : { display: "none" }}>
                            <label className='districting-label'>Average
                                <input id='avg' value={Constants.DistrictingType.AVG} className='districting-button' onChange={this.handleDistrictingClick} type='checkbox' />
                            </label>
                            <label className='districting-label'>Extreme
                                <input id='ex' value={Constants.DistrictingType.EX} className='districting-button' onChange={this.handleDistrictingClick} type='checkbox' />
                            </label>
                            <a className="blue lighten-2 waves-effect waves-light btn modal-trigger" href="#plot-modal" style={{ position: 'absolute', right: '20px' }}>
                                <i className="material-icons" onClick={this.handleToggle()}>insert_chart</i>
                            </a>
                            <Modal id="plot-modal" className="modal" style={modalStyle}>
                                <Summary avg={this.props.avg} ex={this.props.ex} unloadJob={this.unloadJob} job={this.props.job} summary={this.props.summary} />
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default JobCard;