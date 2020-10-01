import React from 'react';

class Summary extends React.Component {
    render() {
        const {batch} = this.props;
        const backStyle = {
            marginRight: '20px',
        }

        return (
            <div className="summary_container">
                <div style={backStyle} className="right blue lighten-2 waves-effect waves-light btn modal-trigger" onClick={this.props.unloadBatch}>
                    <i className="material-icons">arrow_back</i>
                </div>

                <div className="summary_content">
                    <h1 className="card_title black-text center">{batch.title}</h1>
                </div>
            </div>
        );
    }
}

export default Summary;