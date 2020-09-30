import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import { Modal, Button } from 'react-materialize';
import Generate from './Generate';
import BatchLinks from './BatchLinks';
import Map from './Map.js';

class HomeScreen extends Component {
    render() {
        const containerStyle = {
            height: 'calc(100vh - 64px)',
        }

        const batches = [
            {id: '1', title: 'Batch 1', content: 'blah blah blah'},
            {id: '2', title: 'Batch 2', content: 'blah blah blah'},
            {id: '3', title: 'Batch 3', content: 'blah blah blah'}
        ]

        return (
            <div className="HomeComponentComponents">
                <div className="row white" onKeyDown={this.handleKeyDown}>
                    <div className="col s6 m3 white user_input" style={containerStyle}>

                        <Tabs>
                            <TabList>
                                <Tab>Generate</Tab>
                                <Tab>Results</Tab>
                                <Tab>View</Tab>
                            </TabList>

                            <TabPanel>
                                <Generate/>
                            </TabPanel>
                            <TabPanel>
                                <BatchLinks batches={batches} />
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
                    <Map className="col s6 m9 offset-s6 offset-m3"></Map>
                </div>
            </div>
        )
    }
}


export default HomeScreen;
