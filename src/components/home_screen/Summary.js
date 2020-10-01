import React from 'react';
class Summary extends React.Component {
    render() {
        const {batch} = this.props;
        const backStyle = {
            marginRight: '20px',
        }

        return (
            <div className="summary_container">
                <div className="summary_content">
                    <h1 className="card_title black-text center">{batch.title}</h1>
                </div>
            </div>
        );
    }
}

export default Summary;