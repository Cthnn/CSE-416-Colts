import React, { Component } from 'react';
import './HomeScreen.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Generator from './Generator';
import JobLinks from './JobLinks';
import Map from './Map';
import Summary from './Summary'
import JobCard from './JobCard';
import M from 'materialize-css';
import { Modal } from 'react-materialize';
import * as Constants from './MapConstants.js';

class HomeScreen extends Component {
    state = {
        activeJob: null,
        summary: [],
        showMap: true,
        jobs: [],
        map: null,
        average: false,
        extreme: false
    }

    loadJob = (job) => {
        this.setState({ activeJob: job });
        this.displaySummaryButton();
        // fetch('http://localhost:8080/jobGeo', {
        //     headers: { "Content-Type": "application/json" },
        //     method: 'POST',
        //     body: JSON.stringify({
        //         'jobId': job.jobId,
        //         'DistrictingType': 'AVERAGE'
        //     })
        // })
        //     .then(response => response.text())
        //     .then(result => {
        //         // console.log('Job Geo:', result); 
        //     }).catch(error => { console.error('Error:', error); });

        var params = JSON.stringify(job.jobId)
        fetch('http://localhost:8080/getBoxPlot', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: params
        })
            .then(response => response.text())
            .then(result => {
                // console.log('Summary:', JSON.parse(result));
                this.setState({ 'summary': JSON.parse(result) })
            }).catch(error => { console.error('Error:', error); });
    }

    unloadJob = () => {
        this.setState({ activeJob: null });
        document.getElementById("summaryToggle").style.visibility = "hidden";

        for(let type in Constants.DistrictingTypeLayers){
            if(this.state.map.getLayer(Constants.DistrictingTypeLayers[type]) !== undefined){
                this.state.map.removeLayer(Constants.DistrictingTypeLayers[type]);
                this.state.map.removeSource(Constants.DistrictingTypeLayers[type]);
            }
        }
    }

    deleteJob = (job) => {
        const id = job.jobId;
        this.setState({ jobs: [...this.state.jobs.filter(job => job.jobId != id)] })
        fetch('http://localhost:8080/cancel', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(id)
        })
            .then(response => response.text())
            .then(result => {
                console.log('Success:', result);
                M.Modal.getInstance(document.getElementById("modal2")).open();
            }).catch(error => { console.error('Error:', error); });
    }

    getHistory = () => {
        fetch('http://localhost:8080/History', {
            headers: { "Content-Type": "application/json" },
            method: 'GET'
        })
            .then(response => response.text())
            .then(result => {
                // console.log('History:', JSON.parse(result));
                // console.log(this.state.jobs);
                this.setState({ jobs: JSON.parse(result) })
            }).catch(error => { console.error('Error:', error); });
    }
    handleDistrictingClick = (value, type) => {
        console.log(value + " " + type);
        if(type === Constants.DistrictingType.AVG){
            this.setState({average: value});
        }
        if(type === Constants.DistrictingType.EX){
            this.setState({extreme: value});
        }
        if(this.state.showMap){ //Can move to loadJob(better logically)
            let state = document.getElementById('state-selection').value;
            let job = this.state.activeJob;
            if(job.status === Constants.Completed && value
                && Constants.StateNames[state].toUpperCase() === job.state){
                let params = JSON.stringify({jobId: job.jobId, districtingType: type.toUpperCase()});
                fetch('http://localhost:8080/jobGeo', {
                    headers: { "Content-Type": "application/json" },
                    method: 'POST',
                    body: params
                })
                .then(response => response.text())
                .then(result => {
                    console.log("recieved districting geojson");
                    console.log(JSON.parse(result));
                }).catch(error => { console.error('Error:', error); });
            }
        }
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

    getMapObject = (data) => {
        this.setState({ map: data}, () => {
            // console.log(this.state.map);
        })
    }

    render() {
        const containerStyle = {
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
        }

        const jobs = this.state.jobs;

        return (
            <div className="HomeComponentComponents">
                <div className="row white" onKeyDown={this.handleKeyDown}>
                    <div className="col s6 m3 white user_input" style={containerStyle}>

                        <Tabs>
                            <TabList>
                                <Tab onClick={this.unloadJob}>Generate</Tab>
                                <Tab onClick={this.getHistory}>Results</Tab>
                            </TabList>

                            <TabPanel forceRender>
                                <Generator jobs={jobs} />
                            </TabPanel>
                            <TabPanel>
                                <JobLinks handleDistrictingClick={this.handleDistrictingClick} loadJob={this.loadJob.bind(this)} unloadJob={this.unloadJob} deleteJob={this.deleteJob} jobs={jobs} />
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div>
                        {(this.state.activeJob && !this.state.showMap) &&
                            <div className="grey lighten-4" style={containerStyle}>
                                <Summary avg={this.state.average} ex={this.state.extreme}unloadJob={this.unloadJob} job={this.state.activeJob} summary={this.state.summary} />
                            </div>
                        }
                        {(!this.state.activeJob || this.state.showMap) &&
                            <Map forceRender passMap={this.getMapObject} className="col s6 m9 offset-s6 offset-m3"></Map>

                        }
                        <div id="summaryToggle" style={{ top: "100px" }}>
                            <a className="blue lighten-2 waves-effect waves-light btn" onClick={this.toggleShowMap}>
                                <i className="material-icons">{this.state.showMap ? "insert_chart" : "map"}</i>
                            </a>
                        </div>
                    </div>
                </div>
                <Modal id="modal2" className="modal">
                    <div className="modal-content center-align">
                        <h4>Job Deleted</h4>
                    </div>
                </Modal>
            </div>
        )
    }
}


export default HomeScreen;
