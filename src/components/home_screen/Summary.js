import React from 'react';
import { Row } from 'react-materialize';

import Plot from './Plot'
class Summary extends React.Component {
    render() {
        const {job} = this.props;
        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
        }

        return (
            <div className="col s4 m5" style={contentStyle}>
                <h2 className="center">{job?"Job " + job.jobId:""} VAP Box Plot Per District</h2>
                <div><Plot avg={this.props.avg} ex={this.props.ex} summary={this.props.summary}></Plot></div>
            </div>
        );
    }
}

export default Summary;