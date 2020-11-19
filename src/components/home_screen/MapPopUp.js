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
                            <td>{this.props.features.VAP_TOTAL}</td>
                            <td>{this.props.features.TOTAL}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.WHITE}</td>
                            <td>{this.props.features.R2}</td>
                            <td>{this.props.features.T2}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.BLACK}</td>
                            <td>{this.props.features.R3}</td>
                            <td>{this.props.features.T3}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.NATIVE_AMERICAN}</td>
                            <td>{this.props.features.R4}</td>
                            <td>{this.props.features.T4}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.ASIAN}</td>
                            <td>{this.props.features.R5}</td>
                            <td>{this.props.features.T5}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.NATIVE_AMERICAN}</td>
                            <td>{this.props.features.R6}</td>
                            <td>{this.props.features.T6}</td>
                        </tr>
                        <tr>
                            <td>{Constants.EthnicGroupNicknames.HISPANIC}</td>
                            <td>{this.props.features.R8}</td>
                            <td>{this.props.features.T8}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default MapPopUp;