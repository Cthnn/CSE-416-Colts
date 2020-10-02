import React, { Component } from 'react';
import './HomeScreen.css';
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
        document.getElementById("summaryToggle").style.visibility = "hidden";
    }
    displaySummaryButton = () =>{
        document.getElementById("summaryToggle").style.visibility = "visible";
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
                                <Tab onClick={this.displaySummaryButton}>Results</Tab>
                                <Tab onClick={this.unloadBatch}>View</Tab>
                            </TabList>

                            <TabPanel>
                                <Generate/>
                            </TabPanel>
                            <TabPanel>
                                <BatchLinks loadBatch={this.loadBatch.bind(this)} batches={batches} />
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
                    <div>
                        {this.state.activeBatch &&
                            <div className="grey lighten-4" style={containerStyle}>
                                <Summary unloadBatch={this.unloadBatch} batch={this.state.activeBatch}/>
                            </div>  
                        }
                        {!this.state.activeBatch &&
                            <Map className="col s6 m9 offset-s6 offset-m3"></Map>
                        }
                        <div id="summaryToggle">
                            <a className="blue lighten-2 waves-effect waves-light btn modal-trigger" href="#modal1" onClick = {this.loadBatch}>
                                <i className="material-icons">insert_chart</i>
                            </a>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}


export default HomeScreen;
