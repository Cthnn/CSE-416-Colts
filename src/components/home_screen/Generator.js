import React from 'react';
import M from 'materialize-css';
import JobCard from './JobCard';
import { Modal } from 'react-materialize';

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
            state: "0",
            plans: this.minMax['plans'][0],
            comp: this.minMax['comp'][0],
            pop: this.minMax['pop'][0],
            group: "0",
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

    updateSelection(e, name) {
        let input = {}
        input[name] = e.target.value
        this.setState(input)
        var element = document.getElementById('state-selection');
        if(e.target.value === "0"){ //None option
            element.selectedIndex = "0";
        }
        if(e.target.value === "Alabama"){
            element.selectedIndex = "1";
        }
        if(e.target.value === "Florida"){
            element.selectedIndex = "2";
        }
        if(e.target.value === "Virginia"){
            element.selectedIndex = "3";
        }
        element.dispatchEvent(new Event('change'));
    }

    enableGeneration() {
        return this.state.state !== 0 && this.state.group !== 0;
    }

    generatePlans(e) {
        e.preventDefault();
        //send request to server
        var params = JSON.stringify(this.state)
        fetch('http://localhost:8080/createJob', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params }).then(response => response.text()).then(result => { 
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
                        <select id = "select-state-generation" className="browser-default" onChange={e => { this.updateSelection(e, "state") }}>
                            <option value="0">None</option>
                            <option value="Alabama">Alabama</option>
                            <option value="Florida">Florida</option>
                            <option value="Virginia">Virginia</option>
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
                            <select className="browser-default" onChange={e => { this.updateSelection(e, "group") }}>
                                <option value="0">None</option>
                                <option value="BLACK">Black or African American</option>
                                <option value="ASIAN">Asian</option>
                                <option value="HISPANIC">Hispanic or Latino</option>
                                <option value="PACIFIC_ISLANDER">Native Hawaiian and Other Pacific Islander</option>
                                <option value="NATIVE_AMERICAN">Native American and Alaska Native</option>
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