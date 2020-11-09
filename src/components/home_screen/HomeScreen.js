import React, { Component } from 'react';
import './HomeScreen.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Generator from './Generator';
import BatchLinks from './BatchLinks';
import Map from './Map';
import Summary from './Summary'
import BatchCard from './BatchCard';

class HomeScreen extends Component {
    state = {
        // activeBatch: { id: '1', title: 'Batch 1', content: 'blah blah blah' }
        activeBatch: null,
        summary: [],
        showMap: true,
        // batches: [
        //     BatchCard.createBatch(0, '', 0, 0, 0, '0', ''),
        //     BatchCard.createBatch(1, 'Texas', 2000, 10, 0.5, 'Asian', 'Complete'),
        //     BatchCard.createBatch(2, 'Texas', 4000, 10, 0.4, 'Black', 'Complete'),
        //     BatchCard.createBatch(3, 'Alabama', 5000, 80, 1, 'Black', 'InProgress'),
        //     BatchCard.createBatch(4, 'Florida', 400, 30, 0.2, 'Hispanic', 'Aborted'),
        // ],
        batches: [{"jobId":1,"status":"COMPLETED","state":"ALABAMA","runs":1000,"populationDeviation":0.5,"compactness":50.0,"ethnicGroup":"ASIAN","precinctGeoJson":null},
        {"jobId":2,"status":"COMPLETED","state":"ALABAMA","runs":1000,"populationDeviation":0.5,"compactness":50.0,"ethnicGroup":"ASIAN","precinctGeoJson":null},
        {"jobId":3,"status":"COMPLETED","state":"ALABAMA","runs":1000,"populationDeviation":0.5,"compactness":50.0,"ethnicGroup":"ASIAN","precinctGeoJson":null}]
    }

    loadBatch = (batch) => {
        this.setState({ activeBatch: batch });
        this.displaySummaryButton();
        var params = JSON.stringify({
            'jobId': batch.id,
            'DistrictingType': 'AVERAGE'
        })
        fetch('http://localhost:8080/jobGeo', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params }).then(response => response.text())
        .then(result => { 
            console.log('Success:', result); 
        }).catch(error => { console.error('Error:', error); });

        var params = JSON.stringify({
            'jobId': batch.id,
        })
        fetch('http://localhost:8080/genSummary', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params }).then(response => response.text())
        .then(result => { 
            console.log('Success:', result);
            this.setState({'Summary' : result}); 
        }).catch(error => { console.error('Error:', error); });
    }

    unloadBatch = () => {
        this.setState({ activeBatch: null });
        document.getElementById("summaryToggle").style.visibility = "hidden";
    }

    deleteBatch = (batch) => {
        const id = batch.id;
        this.setState({ batches: [...this.state.batches.filter(batch => batch.id != id)] })
        var params = JSON.stringify(id)
        fetch('http://localhost:8080/cancel', { headers: { "Content-Type": "application/json" }, method: 'POST', body: params }).then(response => response.text()).then(result => { console.log('Success:', result); }).catch(error => { console.error('Error:', error); });
    }

    getHistory = () => {
        fetch('http://localhost:8080/History', { headers: { "Content-Type": "application/json" }, method: 'GET' }).then(response => response.text())
            .then(result => {
                // console.log('Success:', JSON.parse(result));
                // console.log(this.state.batches);
                this.setState({batches: JSON.parse(result)})
            }).catch(error => { console.error('Error:', error); });
    }

    displaySummaryButton = () => {
        document.getElementById("summaryToggle").style.visibility = "visible";
    }

    toggleShowMap = () => {
        this.setState({ showMap: !this.state.showMap })
    }

    unshowMap = () => {
        this.setState({ showMap: false })
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
                                <Tab onClick={this.getHistory}>Results</Tab>
                            </TabList>

                            <TabPanel forceRender>
                                <Generator batches={batches} />
                            </TabPanel>
                            <TabPanel>
                                <BatchLinks loadBatch={this.loadBatch.bind(this)} unloadBatch={this.unloadBatch} deleteBatch={this.deleteBatch} batches={batches} />
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div>
                        {(this.state.activeBatch && !this.state.showMap) &&
                            <div className="grey lighten-4" style={containerStyle}>
                                <Summary unloadBatch={this.unloadBatch} batch={this.state.activeBatch} />
                            </div>
                        }
                        {(!this.state.activeBatch || this.state.showMap) &&
                            <Map className="col s6 m9 offset-s6 offset-m3"></Map>
                        }
                        <div id="summaryToggle" style={{ top: "100px" }}>
                            <a className="blue lighten-2 waves-effect waves-light btn" onClick={this.toggleShowMap}>
                                <i className="material-icons">{this.state.showMap ? "insert_chart" : "map"}</i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default HomeScreen;
