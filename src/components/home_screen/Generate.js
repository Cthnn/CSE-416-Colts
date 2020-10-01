import React from 'react';

class Generate extends React.Component {
    inputValidation(e, min, max){
        if(e.target.value > max)
            e.target.value = max
        if(e.target.value < min)
            e.target.value = min
    }

    render() {
        const minMax = {
            plans: [100,10000],
            comp: [0,100],
            pop: [0,1]
        }

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <label>State</label>
                    <div className="input-field">
                        <select className="browser-default">
                            <option value="0" >None</option>
                            <option value="1">Alabama</option>
                            <option value="2">Florida</option>
                            <option value="3">Texas</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="number_of_plans">Number of Plans</label>
                        <input className="active" type="number" min={minMax['plans'][0]} max={minMax['plans'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, minMax['plans'][0], minMax['plans'][1])}} onChange={this.handleChangeDimensions} defaultValue={minMax['plans'][0]} />
                    </div>
                    <div>
                        <label htmlFor="compactness">Compactness</label>
                        <input className="active" type="number" min={minMax['comp'][0]} max={minMax['comp'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, minMax['comp'][0], minMax['comp'][1])}} onChange={this.handleChangeDimensions} defaultValue={minMax['comp'][0]} />
                    </div>
                    <div>
                        <label htmlFor="population_deviation">Population Deviation</label>
                        <input className="active" type="number" step="0.01" min={minMax['pop'][0]} max={minMax['pop'][1]} id='tempWidth' onBlur={e => {this.inputValidation(e, minMax['pop'][0], minMax['pop'][1])}} onChange={this.handleChangeDimensions} defaultValue={minMax['pop'][0]} />
                    </div>
                    <div>
                        <label htmlFor="minority_group">Minority Group</label>
                        <div className="input-field">
                            <select className="browser-default">
                                <option value="0">None</option>
                                <option value="1">Black</option>
                                <option value="2">Hispanic</option>
                                <option value="3">Asian</option>
                            </select>
                        </div>
                    </div>
                    <br/>
                    <button type="submit" className="btn blue lighten-2 waves-effect waves-light col s12">Generate Plans</button>
                </form>
            </div>
        );
    }
}
export default Generate;