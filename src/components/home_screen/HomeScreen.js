import React, { Component } from 'react';
import './HomeScreen.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Generate from './Generate';
import BatchLinks from './BatchLinks';
import Map from './Map';
import Summary from './Summary'
import BatchCard from './BatchCard';

class HomeScreen extends Component {
    state = {
        // activeBatch: { id: '1', title: 'Batch 1', content: 'blah blah blah' }
        activeBatch: null,
        showMap: true,
        batches: [
            BatchCard.createBatch(0, '', 0, 0, 0, '0', ''),
            BatchCard.createBatch(1, 'Texas', 2000, 10, 0.5, 'Asian', 'Complete'),
            BatchCard.createBatch(2, 'Texas', 4000, 10, 0.4, 'Black', 'Complete'),
            BatchCard.createBatch(3, 'Alabama', 5000, 80, 1, 'Black', 'InProgress'),
            BatchCard.createBatch(4, 'Florida', 400, 30, 0.2, 'Hispanic', 'Aborted'),
        ]
    }

    loadBatch = (batch) => {
        this.setState({activeBatch: batch});
        this.displaySummaryButton();
        //this.unshowMap();
    }

    unloadBatch = () => {
        this.setState({activeBatch: null});
        document.getElementById("summaryToggle").style.visibility = "hidden";
    }

    displaySummaryButton = () =>{
        document.getElementById("summaryToggle").style.visibility = "visible";
    }

    toggleShowMap = () => {
        this.setState({showMap: !this.state.showMap})
    }

    unshowMap = () => {
        this.setState({showMap: false})
    }

    render() {
        const containerStyle = {
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
        }

        const batches = this.state.batches;

        return (
            <div className="HomeComponentComponents">
                <div className="row white" onKeyDown={this.handleKeyDown}>
                    <div className="col s6 m3 white user_input" style={containerStyle}>

                        <Tabs>
                            <TabList>
                                <Tab onClick={this.unloadBatch}>Generate</Tab>
                                <Tab>Results</Tab>
                            </TabList>

                            <TabPanel forceRender>
                                <Generate batches={batches}/>
                            </TabPanel>
                            <TabPanel>
                                <BatchLinks loadBatch={this.loadBatch.bind(this)} unloadBatch={this.unloadBatch} batches={batches} />
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div>
                        {(this.state.activeBatch && !this.state.showMap)&&
                            <div className="grey lighten-4" style={containerStyle}>
                                <Summary unloadBatch={this.unloadBatch} batch={this.state.activeBatch}/>
                            </div>  
                        }
                        {(!this.state.activeBatch || this.state.showMap) &&
                            <Map className="col s6 m9 offset-s6 offset-m3"></Map>
                        }
                        <div id="summaryToggle">
                            <a className="blue lighten-2 waves-effect waves-light btn"  onClick = {this.toggleShowMap}>
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
