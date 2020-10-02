import React from 'react';
import M from 'materialize-css';
import BatchCard from './BatchCard';
import { Modal } from 'react-materialize';

class Generate extends React.Component {
    constructor(props){
        super(props)
        this.compactnessTip = "<div>Explain what compactness is.</div><div> Valid inputs [0,100]</div>"
        this.populationTip = "<div>Explain what population deviation is.</div><div> Valid inputs [0,1].</div>"

        this.minMax = {
            plans: [100,10000],
            comp: [0,100],
            pop: [0,1]
        }

        this.state = {
            state: "0",
            plans: this.minMax['plans'][0],
            comp: this.minMax['comp'][0],
            pop: this.minMax['pop'][0],
            group: "0"
        }
    }

    inputValidation(e, name){
        let min = this.minMax[name][0]
        let max = this.minMax[name][1]

        if(e.target.value > max)
            e.target.value = max
        if(e.target.value < min)
            e.target.value = min

        let input = {}
        input[name] = e.target.value
        this.setState(input)
    }

    updateSelection(e, name){
        let input = {}
        input[name] = e.target.value
        this.setState(input)
    }

    enableGeneration(){
        return this.state.state != 0 && this.state.group != 0;
    }

    generatePlans(e){
        e.preventDefault();
        //send request to server
        this.props.incrementBatchNumber()
        this.props.batches.push(BatchCard.createBatch(this.props.batchNumber, this.state.state, this.state.plans, this.state.comp, this.state.pop, this.state.group, 'Queued'));
    }

    render() {
        const minMax = this.minMax
        return (
            <div className="container" style={{width: '80%'}}>
                <form onSubmit={this.handleSubmit}>
                    <label className="black-text">State</label>
                    <div className="input-field">
                        <select className="browser-default" onChange={e => {this.updateSelection(e, "state")}}>
                            <option value="0">None</option>
                            <option value="1">Alabama</option>
                            <option value="2">Florida</option>
                            <option value="3">Texas</option>
                        </select>
                    </div>
                    <div>
                        <label className="black-text" htmlFor="number_of_plans">Number of Plans</label>
                        <input className="active" type="number" min={minMax['plans'][0]} max={minMax['plans'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, 'plans')}} onChange={this.handleChangeDimensions} defaultValue={minMax['plans'][0]} />
                    </div>
                    <div>
                        <label className="black-text" htmlFor="compactness">Compactness</label>
                        <i className="tooltipped tiny material-icons grey-text" data-position="top" data-html="true" data-tooltip={this.compactnessTip}>info_outline</i>
                        <input className="active" type="number" min={minMax['comp'][0]} max={minMax['comp'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, 'comp')}} onChange={this.handleChangeDimensions} defaultValue={minMax['comp'][0]} />
                    </div>
                    <div>
                        <label className="black-text" htmlFor="population_deviation">Population Deviation</label>
                        <i className="tooltipped tiny material-icons grey-text" data-position="top" data-html="true" data-tooltip={this.populationTip}>info_outline</i>
                        <input className="active" type="number" step="0.01" min={minMax['pop'][0]} max={minMax['pop'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, 'pop')}} onChange={this.handleChangeDimensions} defaultValue={minMax['pop'][0]} />
                    </div>
                    <div>
                        <label className="black-text"  htmlFor="minority_group">Racial/Ethnic Group</label>
                        <div className="input-field">
                            <select className="browser-default" onChange={e => {this.updateSelection(e, "group")}}>
                                <option value="0">None</option>
                                <option value="Black">Black or African American</option>
                                <option value="Asian">Asian</option>
                                <option value="Hispanic">Hispanic or Latino</option>
                                <option value="Pacific Islander">Native Hawaiian and Other Pacific Islander</option>
                                <option value="American Indians">Native American and Alaska Native</option>
                            </select>
                        </div>
                    </div>
                    <br/>
                    <a type="submit" href="#modal1" onClick={e => {this.generatePlans(e)}}className="btn blue lighten-2 waves-effect waves-light col s12 modal-trigger" disabled={!this.enableGeneration()}>Generate Plans</a>
                </form>
                <Modal id="modal1" className="modal">
                    <div className="modal-content center-align">
                    <h4>Request Recieved</h4>
                    <p>The requested batch number is: {this.props.batchNumber}</p>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Generate;