import React from 'react';
import './JobCard.css';

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

    setDistrictType = (type) => {
        var districtType = document.getElementById('district-type');
        districtType.value = type;
        districtType.click()
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
                        <Button className="blue lighten-2" style={{ position: "absolute", top: '50px', right: '20px', cursor: 'pointer' }} onClick={() => this.setDistrictType('average')}>average</Button>
                        <Button className="red lighten-2" style={{ position: "absolute", top: '100px', right: '20px', cursor: 'pointer' }} onClick={() => this.setDistrictType('extreme')}>extreme</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default JobCard;