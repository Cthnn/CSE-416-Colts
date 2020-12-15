import React from 'react';
import * as Constants from './MapConstants.js';
import { Row } from 'react-materialize';

import Plot from './Plot'
class Summary extends React.Component {
    handleToggle(){
        this.props.toggle(this.props.job);
    }

    render() {
        const {job} = this.props;
        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }

        return (
            <div className="col s4 m5" style={contentStyle}>
                <a className="red lighten-2 waves-effect waves-light btn-small" style={{marginLeft: "auto", right: '0px', width:"fit-content", padding: "0px 8px"}} onClick = {this.handleToggle.bind(this)}>
                    <i className="material-icons" >cancel</i>
                </a>
                <h2 className="center" style={{marginTop: "0px"}}>{job?"Job " + job.jobId:""} {job?Constants.EthnicGroupNicknames[job.ethnicGroup]:""} VAP Per District</h2>
                <div><Plot avg={this.props.avg} ex={this.props.ex} summary={this.props.summary}></Plot></div>
            </div>
        );
    }
}

export default Summary;