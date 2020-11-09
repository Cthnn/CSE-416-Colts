import React from 'react';
import { Row } from 'react-materialize';

import Plot from './Plot'
class Summary extends React.Component {
    render() {
        const {job} = this.props;
        const containerStyle = {
            display:'flex',
            justifyContent: 'center'
        }
        const contentStyle = {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        }
        return (

            <div className="summary_container" style={containerStyle}>
                <div className="summary_content" style={contentStyle}>
                    <h1 className="center">{job.title} Summary</h1>
                    <div style={{display:'block', width:'1000px',height:'1000px'}}><Plot summary={this.props.summary}></Plot></div>

                </div>
            </div>
        );
    }
}

export default Summary;