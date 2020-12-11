import React from 'react';
import * as Constants from './MapConstants.js';

class MapPopUp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div >{this.props.features.ID + " Demographics"}</div>
                <table>
                    <tbody>
                        <tr>
                            <th>Race</th>
                            <th>Vap Population</th>
                            <th>Total Population</th>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{this.props.features.VAP_TOTAL.toLocaleString()}</td>
                            <td>{this.props.features.TOTAL.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.WHITE}</td>
                            <td>{this.props.features.R2.toLocaleString()}</td>
                            <td>{this.props.features.T2.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.BLACK}</td>
                            <td>{this.props.features.R3.toLocaleString()}</td>
                            <td>{this.props.features.T3.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.NATIVE_AMERICAN}</td>
                            <td>{this.props.features.R4.toLocaleString()}</td>
                            <td>{this.props.features.T4.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.ASIAN}</td>
                            <td>{this.props.features.R5.toLocaleString()}</td>
                            <td>{this.props.features.T5.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.PACIFIC_ISLANDER}</td>
                            <td>{this.props.features.R6.toLocaleString()}</td>
                            <td>{this.props.features.T6.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.HISPANIC}</td>
                            <td>{this.props.features.R8.toLocaleString()}</td>
                            <td>{this.props.features.T8.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MapPopUp;