import React from 'react';

class Generate extends React.Component {
    inputValidation(e, min, max){
        if(e.target.value > max)
            e.target.value = max
        if(e.target.value < min)
            e.target.value = min
    }

    render() {

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit}>
                    <label>State</label>
                    <div class="input-field">
                        <select className="browser-default">
                            <option value="" >None</option>
                            <option value="1">Alabama</option>
                            <option value="2">Florida</option>
                            <option value="3">Texas</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="number_of_plans">Number of Plans</label>
                        <input className="active" type="number" min="100" max="10000" id='tempWidth' onChange={this.handleChangeDimensions}defaultValue={0} />
                    </div>
                    <div>
                        <label htmlFor="compactness">Compactness</label>
                        <input className="active" type="number" min="0" max="100" id='tempWidth' onChange={this.handleChangeDimensions} defaultValue={0} />
                    </div>
                    <div>
                        <label htmlFor="population_deviation">Population Deviation</label>
                        <input className="active" type="number" step="0.01" min="0" max="1"id='tempWidth' onChange={this.handleChangeDimensions} defaultValue={0} />
                    </div>
                    <div>
                        <label htmlFor="minority_group">Minority Group</label>
                        <div class="input-field">
                            <select className="browser-default">
                                <option value="" disabled selected>None</option>
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