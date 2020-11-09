import React from 'react';
import JobCard from './JobCard';

class JobLinks extends React.Component {

    state = {active: 0}

    setActive = (id) => {
        this.setState({active: id})
    }

    render() {
        const {jobs} = this.props
        const cardStyleOn = {
            boxShadow: '0 0 5px 2px #0277bd',
        }

        const cardStyleOff = {
            boxShadow: 'none',
        }

        return (
            <div className="job-list white section">
                <div className="card z-depth-0">
                    {jobs && jobs.map(job => {
                        return (
                            <div style={this.state.active === job.jobId? cardStyleOn : cardStyleOff} key={job.jobId} onClick={() => {this.setActive(job.jobId)}}>
                                 <JobCard loadJob={this.props.loadJob} unloadJob={this.props.unloadJob} deleteJob={this.props.deleteJob} job={job} active={this.state.active === job.jobId}/>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default JobLinks