import React from 'react';
import './JobCard.css';
import * as Constants from './MapConstants.js';

import { Button } from 'react-materialize';

class JobCard extends React.Component {
    static createJob(jobId, state, plans, compactness, populationDeviation, group, status) {
        if (jobId === 0)
            return { jobId, title: 'Enacted Districtings', state, plans, compactness, populationDeviation, group, status }
        return { jobId, title: 'Job ' + jobId, state, plans, compactness, populationDeviation, group, status }
    }

    handleDeleteClick = (e) => {
        e.stopPropagation();
        this.props.deleteJob(this.props.job)
    }

    handleAverageClick = (e) => {
        let avgElement = document.getElementById('average-input');
        let checkValue = e.target.checked;
        let type =Constants.DistrictingType.AVG;
        if(checkValue){
            avgElement.value = type;
        }
        else{
            avgElement.value = Constants.DistrictingType.NONE;
        }
        avgElement.click()
    }
    handleExtremeClick = (e) => {
        let exElement = document.getElementById('extreme-input');
        let checkValue = e.target.checked;
        let type =Constants.DistrictingType.EX;
        if(checkValue){
            exElement.value = type;
        }
        else{
            exElement.value = Constants.DistrictingType.NONE;
        }
        exElement.click()
    }
    setJobId = (e, type) => {
        let jobType = document.getElementById('job-type');
        let checkValue = e.target.checked;
        if(checkValue){
            jobType.value = type;
        }
        else{
            jobType.value = Constants.CurrentEnactedDistrictingJobId;
        }
        jobType.click()
    }

    render() {
        const { job } = this.props
        // console.log(job)

        const statusStyles = {
            COMPLETED: "badge green-text",
            ABORTED: "badge red-text",
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
                                <td>{job.state}</td>
                            </tr>
                            <tr>
                                <th>Plans:</th>
                                <td>{job.plans}</td>
                            </tr>
                            <tr>
                                <th>Racial/Ethnic Group:</th>
                                <td>{job.ethnicGroup}</td>
                            </tr>
                            <tr>
                                <th>Compactness:</th>
                                <td>{job.compactness}</td>
                            </tr>
                            <tr>
                                <th>Population Deviation:</th>
                                <td>{job.populationDeviation}</td>
                            </tr>
                        </tbody></table>
                        <label className = 'districting-label'>Average
                            <input className = 'districting-button' onChange={(e)=>{this.setJobId(e, job.jobId); this.handleAverageClick(e)}} type = 'checkbox' />
                        </label>
                        <label className = 'districting-label'>Extreme
                            <input className = 'districting-button' onChange={(e)=>{this.setJobId(e, job.jobId); this.handleExtremeClick(e, Constants.DistrictingType.EX)}}  type = 'checkbox' />
                        </label>
                    </div>
                </div>
            </div>
        );
    }
}

export default JobCard;