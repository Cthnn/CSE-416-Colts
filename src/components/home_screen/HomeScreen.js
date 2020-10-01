import React, { Component } from 'react';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { RadioGroup, RadioButton } from 'react-radio-buttons';
import { Modal } from 'react-materialize';
import Generate from './Generate';
import BatchLinks from './BatchLinks';
import Map from './Map';
import Summary from './Summary'
import BatchCard from './BatchCard';

class HomeScreen extends Component {
    state = {
        // activeBatch: { id: '1', title: 'Batch 1', content: 'blah blah blah' }
        activeBatch: null
    }

    loadBatch = (batch) => {
        this.setState({activeBatch: batch});
    }

    unloadBatch = () => {
        this.setState({activeBatch: null});
    }

    render() {
        const containerStyle = {
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
        }

        const batches = [
            BatchCard.createBatch(1, 'Texas', 2000, 10, 20, 'Asian', 'Complete', 2000),
            BatchCard.createBatch(2, 'Alabama', 5000, 80, 10, 'Black', 'InProgress', 2400),
            BatchCard.createBatch(3, 'Florida', 400, 30, 100, 'Hispanic', 'Aborted', 0),
        ]

        return (
            <div className="HomeComponentComponents">
                <div className="row white" onKeyDown={this.handleKeyDown}>
                    <div className="col s6 m3 white user_input" style={containerStyle}>

                        <Tabs>
                            <TabList>
                                <Tab onClick={this.unloadBatch}>Generate</Tab>
                                <Tab>Results</Tab>
                            </TabList>

                            <TabPanel>
                                <Generate />
                            </TabPanel>
                            <TabPanel>
                                <BatchLinks loadBatch={this.loadBatch.bind(this)} batches={batches} />
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div>
                        {this.state.activeBatch &&
                            <div className="grey lighten-4" style={containerStyle}>
                                <Summary unloadBatch={this.unloadBatch} batch={this.state.activeBatch}/>
                            </div>  
                        }
                        {!this.state.activeBatch &&
                            <Map className="col s6 m9 offset-s6 offset-m3"></Map>
                        }
                    </div>
                </div>
            </div>
        )
    }
}


export default HomeScreen;
