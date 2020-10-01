import React from 'react';
class Summary extends React.Component {
    render() {
        const {batch} = this.props;
        return (
            <div className="summary_container">
                <div className="left-align container">
                    <a className="blue lighten-2 waves-effect waves-light btn modal-trigger" onClick={this.props.unloadBatch}>
                        <i className="material-icons">arrow_back</i>
                    </a>
                </div>
                <div className="summary_content">
                    <h1 className="card_title black-text center">{batch.title}</h1>
                </div>
            </div>
        );
    }
}

export default Summary;