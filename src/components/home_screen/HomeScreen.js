import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import { Modal, Button } from 'react-materialize';

class HomeScreen extends Component {

    render() {
        const containerStyle = {
            border: '1px solid',
            
        }
        const flexStyle ={
            flex-direction: 'row'
        }

        return (
            <div className = "HomeComponentComponents" style = {flexStyle}>
                <div className="row white" onKeyDown={this.handleKeyDown}>
                    <div className="col s6 m3 user_input" style={containerStyle}>
                        <label>Select State</label>
                        <div class="input-field col s12">
                            <select className="browser-default">
                                <option value="" disabled selected>None</option>
                                <option value="1">Alabama</option>
                                <option value="2">Florida</option>
                                <option value="3">Texas</option>
                            </select>
                        </div>

                        <Tabs>
                            <TabList>
                                <Tab>Plans</Tab>
                                <Tab>Summaries</Tab>
                                <Tab>View</Tab>
                            </TabList>

                            <TabPanel>
                                <div className="container">
                                    <form onSubmit={this.handleSubmit}>
                                        <div>
                                            <label htmlFor="number_of_plans">Number of Plans</label>
                                            <input className="active" type="number" id='tempWidth' onChange={this.handleChangeDimensions} defaultValue={0} />
                                        </div>
                                        <div>
                                            <label htmlFor="compactness">Compactness</label>
                                            <input className="active" type="number" id='tempWidth' onChange={this.handleChangeDimensions} defaultValue={0} />
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
                                        <div className="col s3 input-field">
                                            <button type="submit" className="btn blue lighten-2 z-depth-0">Generate</button>
                                        </div>
                                    </form>
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <h2>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore velit, omnis beatae tempora fugit autem aspernatur modi repellendus minus, tenetur placeat, provident doloribus repudiandae excepturi aperiam neque fugiat sint non.</h2>
                            </TabPanel>
                            <TabPanel>
                                <RadioGroup onChange={this.onChange} vertical>
                                    <RadioButton value="congressional disctricts" rootColor="gray" pointColor="blue">
                                        Congressional Districts
                                    </RadioButton>
                                    <RadioButton value="precincts" rootColor="gray" pointColor="blue">
                                        Precincts
                                    </RadioButton>
                                </RadioGroup>
                                <a className="blue lighten-2 waves-effect waves-light btn modal-trigger" href="#modal1">
                                    <i className="material-icons">insert_chart</i>
                                </a>
                                <Modal id="modal1" className="modal">
                                    <div className="modal-content">
                                        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nam modi exercitationem eos dolore voluptas cupiditate quia mollitia. Quia officia vel quos tempora dicta, corporis ut, alias consectetur laboriosam odio aliquid?</p>
                                    </div>
                                </Modal>
                            </TabPanel>
                        </Tabs>
                    </div>
                </div>
                <MapComponent></MapComponent>
            </div>
        )
    }
}


export default HomeScreen;
