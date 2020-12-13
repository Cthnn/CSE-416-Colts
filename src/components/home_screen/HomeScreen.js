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
import MapPopUp from './MapPopUp';

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
        if(this.state.activeJob !== null && this.state.activeJob.jobId !== job.jobId){
            let oldAvgButton = document.getElementById("avg"+this.state.activeJob.jobId);
            let oldExButton = document.getElementById("ex"+this.state.activeJob.jobId);
            oldAvgButton.checked=false;
            oldExButton.checked=false;
            this.state.map._controls[2].changeLayer(this.state.map);
        }
        this.setState({ activeJob: job }, () => {
            this.state.map._controls[2].setJob(this.state.activeJob);
        });
        console.log('Loading...')
        var params = JSON.stringify(job.jobId)
        fetch('http://localhost:8080/getBoxPlot', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: params
        })
            .then(response => response.text())
            .then(result => {
                this.setState({ 'summary': JSON.parse(result) })
            }).catch(error => { console.error('Error:', error); });
        
    }

    unloadJob = () => {
        this.setState({ activeJob: null });
        this.state.map._controls[2].removeAllDistrictingLayers(this.state.map);
        this.state.map._controls[2].setJob(null);
        this.state.map._controls[2].changeLayer(this.state.map);
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
    addDistrictingSource = (data, key) => {
        this.state.map.addSource(Constants.DistrictingSource[key], {
            'type': 'geojson',
            'data': data
        });
    }

    addDistrictingLayer = (layer, key) => {
        this.state.map.addLayer({
            'id': layer,
            'type': 'fill',
            'source': Constants.DistrictingSource[key],
            'paint': {
              'fill-color': Constants.DistrictingTypeColors[key],
              'fill-outline-color': Constants.DistrictingOutlineColors[key]
            }
        });
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
                                <JobLinks map={this.state.map} handleDistrictingClick={this.handleDistrictingClick} loadJob={this.loadJob.bind(this)} unloadJob={this.unloadJob} deleteJob={this.deleteJob} jobs={jobs} avg={this.state.average} ex={this.state.extreme} summary={this.state.summary}/>
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div>
                        {/* {(this.state.activeJob && !this.state.showMap) &&
                            <div className="grey lighten-4" style={containerStyle}>
                                <Summary avg={this.state.average} ex={this.state.extreme} unloadJob={this.unloadJob} job={this.state.activeJob} summary={this.state.summary} />
                            </div>
                        } */}
                      
                            <Map forceRender passMap={this.getMapObject} className="col s6 m9 offset-s6 offset-m3"></Map>

                        {/* <div id="summaryToggle" style={{ top: "100px" }}>
                            <a className="blue lighten-2 waves-effect waves-light btn" onClick={this.toggleShowMap}>
                                <i className="material-icons">{this.state.showMap ? "insert_chart" : "map"}</i>
                            </a>
                        </div> */}
                    </div>
                    <div className = 'map-overlay' id='heatmap-legend'></div>

                    <div className = 'map-overlay' id='districting-legend'></div>
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
