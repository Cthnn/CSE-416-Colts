import React from 'react';
import M from 'materialize-css';
import JobCard from './JobCard';
import { Modal } from 'react-materialize';
import * as Constants from './MapConstants.js';

class Generate extends React.Component {
    constructor(props) {
        super(props)
        this.compactnessTip = "<div>Explain what compactness is.</div><div> Valid inputs [0,100]</div>"
        this.populationTip = "<div>Explain what population deviation is.</div><div> Valid inputs [0,1].</div>"
        this.minMax = {
            plans: [100, 10000],
            comp: [0, 100],
            pop: [0, 1]
        }

        this.state = {
            state: Constants.States.NONE,
            plans: this.minMax['plans'][0],
            comp: this.minMax['comp'][0],
            pop: this.minMax['pop'][0],
            group: Constants.States.NONE,
            batchNumber: 0
        }
    }

    componentDidUpdate() {
        // console.log(this.state)
    }

    inputValidation(e, name) {
        let min = this.minMax[name][0]
        let max = this.minMax[name][1]

        if (e.target.value > max) {
            document.getElementById(name).value = max;
            e.target.value = max;
        }

        if (e.target.value < min) {
            document.getElementById(name).value = min;
            e.target.value = min;
        }

        let input = {}
        input[name] = Number(e.target.value)
        this.setState(input)
    }

    updateSelection(e) {
        let input = {group: e.target.value}
        this.setState(input)
    }
    updateState(e){
        let input = {state: e.target.value}
        this.setState(input)

        var element = document.getElementById('state-selection');
            element.selectedIndex = Object.keys(Constants.States).indexOf(e.target.value);
            element.dispatchEvent(new Event('change'));
    }

    enableGeneration() {
        return this.state.state !== Constants.States.NONE && this.state.group !== Constants.EthnicGroups.NONE;
    }

    generatePlans(e) {
        e.preventDefault();
        //send request to server
        var params = JSON.stringify({
            state: Constants.StateNames[this.state.state].toUpperCase(),
            plans: this.state.plans,
            comp: this.state.comp,
            pop: this.state.pop,
            group: this.state.group
        })
        fetch('http://localhost:8080/createJob', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params })
        .then(response => response.text())
        .then(result => { 
            console.log('Success:', result); 
            this.setState({batchNumber: result});
            M.Modal.getInstance(document.getElementById("modal1")).open();
        }).catch(error => { console.error('Error:', error); });
    }

    render() {
        const minMax = this.minMax
        return (
            <div className="container" style={{ width: '80%' }}>
                <form onSubmit={this.handleSubmit}>
                    <label className="black-text">State</label>
                    <div className="input-field">
                        <select id = "select-state-generation" className="browser-default" onChange={e => { this.updateState(e) }}>
                            <option value={Constants.States.NONE}>{Constants.StateNames.NONE}</option>
                            <option value={Constants.States.AL}>{Constants.StateNames.AL}</option>
                            <option value={Constants.States.FL}>{Constants.StateNames.FL}</option>
                            <option value={Constants.States.VA}>{Constants.StateNames.VA}</option>
                        </select>
                    </div>
                    <div>
                        <label className="black-text" htmlFor="number_of_plans">Number of Plans</label>
                        <input className="active" type="number" min={minMax['plans'][0]} max={minMax['plans'][1]} id='plans' onBlur={e => { this.inputValidation(e, 'plans') }} onChange={this.handleChangeDimensions} defaultValue={minMax['plans'][0]} />
                    </div>
                    <div>
                        <label className="black-text" htmlFor="compactness">Compactness</label>
                        <i className="tooltipped tiny material-icons grey-text" data-position="top" data-html="true" data-tooltip={this.compactnessTip}>info_outline</i>
                        <input className="active" type="number" min={minMax['comp'][0]} max={minMax['comp'][1]} id='comp' onBlur={e => { this.inputValidation(e, 'comp') }} onChange={this.handleChangeDimensions} defaultValue={minMax['comp'][0]} />
                    </div>
                    <div>
                        <label className="black-text" htmlFor="population_deviation">Population Deviation</label>
                        <i className="tooltipped tiny material-icons grey-text" data-position="top" data-html="true" data-tooltip={this.populationTip}>info_outline</i>
                        <input className="active" type="number" step="0.01" min={minMax['pop'][0]} max={minMax['pop'][1]} id='pop' onBlur={e => { this.inputValidation(e, 'pop') }} onChange={this.handleChangeDimensions} defaultValue={minMax['pop'][0]} />
                    </div>
                    <div>
                        <label className="black-text" htmlFor="minority_group">Racial/Ethnic Group</label>
                        <div className="input-field">
                            <select className="browser-default" onChange={e => { this.updateSelection(e) }}>
                                <option value={Constants.EthnicGroups.NONE}>{Constants.EthnicGroupNames.NONE}</option>
                                <option value={Constants.EthnicGroups.BLACK}>{Constants.EthnicGroupNames.BLACK}</option>
                                <option value={Constants.EthnicGroups.NATIVE_AMERICAN}>{Constants.EthnicGroupNames.NATIVE_AMERICAN}</option>
                                <option value={Constants.EthnicGroups.ASIAN}>{Constants.EthnicGroupNames.ASIAN}</option>
                                <option value={Constants.EthnicGroups.PACIFIC_ISLANDER}>{Constants.EthnicGroupNames.PACIFIC_ISLANDER}</option>
                                <option value={Constants.EthnicGroups.HISPANIC}>{Constants.EthnicGroupNames.HISPANIC}</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <a type="submit" onClick={e => { this.generatePlans(e) }} className="btn blue lighten-2 waves-effect waves-light col s12 modal-trigger" disabled={!this.enableGeneration()}>Generate Plans</a>
                </form>
                <Modal id="modal1" className="modal">
                    <div className="modal-content center-align">
                        <h4>Request Recieved</h4>
                        <p>The requested batch number is: {this.state.batchNumber}</p>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Generate;