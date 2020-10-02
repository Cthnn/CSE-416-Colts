import React from 'react';

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
        this.props.action(input);
        this.setState(input)
    }

    enableGeneration(){
        console.log(this.state)
        return this.state.state != 0 && this.state.group != 0;
    }

    render() {
        const minMax = this.minMax
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <label>State</label>
                    <div className="input-field">
                        <select className="browser-default" onChange={e => {this.updateSelection(e, "state")}}>
                            <option value="0">None</option>
                            <option value="1">Alabama</option>
                            <option value="2">Florida</option>
                            <option value="3">Texas</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="number_of_plans">Number of Plans</label>
                        <input className="active" type="number" min={minMax['plans'][0]} max={minMax['plans'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, 'plans')}} onChange={this.handleChangeDimensions} defaultValue={minMax['plans'][0]} />
                    </div>
                    <div>
                        <label htmlFor="compactness">Compactness</label>
                        <i className="tooltipped tiny material-icons" data-position="top" data-html="true" data-tooltip={this.compactnessTip}>info_outline</i>
                        <input className="active" type="number" min={minMax['comp'][0]} max={minMax['comp'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, 'comp')}} onChange={this.handleChangeDimensions} defaultValue={minMax['comp'][0]} />
                    </div>
                    <div>
                        <label htmlFor="population_deviation">Population Deviation</label>
                        <i className="tooltipped tiny material-icons" data-position="top" data-html="true" data-tooltip={this.populationTip}>info_outline</i>
                        <input className="active" type="number" step="0.01" min={minMax['pop'][0]} max={minMax['pop'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, 'pop')}} onChange={this.handleChangeDimensions} defaultValue={minMax['pop'][0]} />
                    </div>
                    <div>
                        <label htmlFor="minority_group">Minority Group</label>
                        <div className="input-field">
                            <select className="browser-default" onChange={e => {this.updateSelection(e, "group")}}>
                                <option value="0">None</option>
                                <option value="1">Black</option>
                                <option value="2">Hispanic</option>
                                <option value="3">Asian</option>
                            </select>
                        </div>
                    </div>
                    <br/>
                    <button type="submit" className="btn blue lighten-2 waves-effect waves-light col s12" disabled={!this.enableGeneration()}>Generate Plans</button>
                </form>
            </div>
        );
    }
}
export default Generate;