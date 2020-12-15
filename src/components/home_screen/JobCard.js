import React from 'react';
import './JobCard.css';
import * as Constants from './MapConstants.js';
import Summary from './Summary'

import { Modal, Button } from 'react-materialize';

class JobCard extends React.Component {
    static createJob(jobId, state, plans, compactness, populationDeviation, group, status) {
        return { jobId, title: 'Job ' + jobId, state, plans, compactness, populationDeviation, group, status }
    }

    handleUnloadJob = () =>{
        this.props.unloadJob();
        let job = this.props.job;
        let avgElement = document.getElementById('avg'+job.jobId);
        let exElement = document.getElementById('ex'+job.jobId);
        avgElement.checked = false;
        exElement.checked = false;
    }
    handleDeleteClick = (e) => {
        e.stopPropagation();
        this.props.deleteJob(this.props.job)
    }

    handleDistrictingClick = (e) => {
        let job = this.props.job;
        // this.props.map._controls[2].changeState(this.props.job, this.props.map);
        this.props.map._controls[2].changeLayer(this.props.map);

    }
    setToolbarJob(map, job){

    }
    handleToggle = (e) => {
        this.props.toggle(this.props.job);
    }
    setTitlecase(string){
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
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
            <div className="card z-depth-1 todo-list-link white" onClick={job.status === "COMPLETED" ? this.props.loadJob.bind(this, job) : this.handleUnloadJob}>
                <div style={{ padding: "20px" }} className="card-content black-text">
                    <span className="blue-text">
                        <h4 style={{ display: 'inline-block', margin: "0px" }}>Job {job.jobId}</h4>
                        <span className={statusStyles[job.status] ? statusStyles[job.status] : "badge"}>{this.setTitlecase(job.status)}</span>
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
                                <td>{job.populationDeviation*100}%</td>
                            </tr>
                            <tr>
                                <th>Run Location:</th>
                                <td>{(job.slurmId == 0)?"Server":"Seawulf"}</td>
                            </tr>
                        </tbody></table>
                        <div style={job.status === "COMPLETED" ? { display: "block" } : { display: "none" }}>
                            <a className="blue lighten-2 waves-effect waves-light btn-small" style={{ position: 'absolute', right: '20px', padding: "0px 14px"}} onClick={this.handleToggle}>
                                <i className="material-icons" >insert_chart</i>
                            </a>
                            <label className='districting-label'>Average
                                <input id={'avg'+job.jobId} value={Constants.DistrictingType.AVG} className='districting-button' onChange={this.handleDistrictingClick}type='checkbox' />
                            </label>
                            <label className='districting-label'>Extreme
                                <input id={'ex'+job.jobId} value={Constants.DistrictingType.EX} className='districting-button' onChange={this.handleDistrictingClick} type='checkbox' />
                            </label>
                            {/* <Modal id="plot-modal" className="modal" style={modalStyle}>
                                <Summary avg={this.props.avg} ex={this.props.ex} unloadJob={this.unloadJob} job={this.props.job} summary={this.props.summary} />
                            </Modal> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default JobCard;