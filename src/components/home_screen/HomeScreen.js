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
        summaryJob: null,
        summary: [],
        showSummary: false,
        jobs: [],
        map: null,
        average: false,
        extreme: false,
        interval: null
    }
    componentDidMount(){
        if(this.state.interval === null){
            console.log("Interval Created...");
            let statusInterval = setInterval(this.getStatuses, 30000);
            this.setState({interval: statusInterval})
        }
    }
    componentWillUnmount(){
        if(this.interval !== null){
            console.log("Interval Cleared...");
            clearInterval(this.interval)
        }
    }
    getJob(id){
        for(let job in this.state.jobs){
            if(this.state.jobs[job].jobId == id)
                return this.state.jobs[job];
        }
        return null;
    }
    getStatuses = () => {
        if(this.state.jobs.length !== 0){
            // let temp = [];
            // for(var i = 0; i < this.state.jobs.length; i++){
            //     temp.push(this.state.jobs[i].jobId);
            // }
            
            // let params = JSON.stringify(temp);
            fetch('http://localhost:8080/History', {
                headers: { "Content-Type": "application/json" },
                method: 'GET'
            })
            .then(response => response.text())
            .then(res => {
                // console.log('New Statuses:', JSON.parse(res));
                let newJobs = JSON.parse(res);
                for(let newJobId in newJobs){
                    let newJob = newJobs[newJobId]
                    let oldJob = this.getJob(newJob.jobId);
                    console.log(oldJob);
                    if(oldJob == null || oldJob.status != newJob.status){
                        this.setState({jobs: JSON.parse(res)});
                        break;
                    }
                }
            }).catch(error => { console.error('Error:', error); });
        }
        
    }
    handleGetBoxPlot = (job) => {
        console.log('Loading...')
        var params = JSON.stringify(job.jobId)
        fetch('http://localhost:8080/getBoxPlot', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: params
        })
            .then(response => response.text())
            .then(result => {
                let boxPlotData = JSON.parse(result);
                //console.log(boxPlotData);
                this.setState({ 'summary': boxPlotData });
                
            }).catch(error => { console.error('Error:', error); });
    }
    
    loadJob = (job) => {
        if(this.state.activeJob === null || (this.state.activeJob !== null && this.state.activeJob.jobId !== job.jobId)){
            if(this.state.activeJob !== null){
                let oldAvgButton = document.getElementById("avg"+this.state.activeJob.jobId);
                let oldExButton = document.getElementById("ex"+this.state.activeJob.jobId);
                if(oldAvgButton !== null && oldExButton !== null){
                    oldAvgButton.checked=false;
                    oldExButton.checked=false;
                }
            }
            let state = Constants.StateIdKeys[job.state.stateId];
            this.state.map._controls[2].setState(state, this.state.map);
            document.getElementById('state-selection').value = Constants.States[state];
            document.getElementById('select-state-generation').selectedIndex = Object.keys(Constants.States).indexOf(state);

            let center  = Constants.StateCenters[state];
            // if(this.state.showSummary)
            //     center[0] += 4;
            this.state.map.flyTo({
                center: center,
                zoom: 6
            })
            this.state.map._controls[2].changeLayer(this.state.map);
            this.state.map._controls[2].removeAllDistrictingLayers();
        }
        this.setState({ activeJob: job }, () => {
            this.state.map._controls[2].setJob(this.state.activeJob);
        });
    }

    unloadJob = () => {
        this.setState({ activeJob: null });
        // this.state.map._controls[2].removeAllDistrictingLayers(this.state.map);
        this.state.map._controls[2].setJob(null);
        this.state.map._controls[2].removeAllDistrictingLayers();
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
                
                this.setState({ jobs: JSON.parse(result) }, () => {
                    // console.log('History: ');
                    // console.log(JSON.parse(result));
                })


            }).catch(error => { console.error('Error:', error); });
    }
    handleDistrictingClick = (value, type) => {
        
    }
    displaySummaryButton = () => {
        document.getElementById("summaryToggle").style.visibility = "visible";
    }
    
    toggleSummary = (job) => {
        if(job != this.state.summaryJob){
            this.handleGetBoxPlot(job);
            this.setState({ showSummary: true, summaryJob: job });
            document.getElementById("summaryDiv").style.display = "block";
        }else{
            this.setState({summary: [], showSummary: false, summaryJob: null});
            document.getElementById("summaryDiv").style.display = "none";
        }
        this.state.map.resize();
        // if(document.getElementById("summaryDiv").style.display == "block"){
        //     console.log(document.getElementById("summaryDiv").style.display );
        //     this.state.map.resize();
        // }
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
                    <div className="col s5 m2 white user_input" style={containerStyle}>

                        <Tabs>
                            <TabList>
                                <Tab style={{width: "50%"}} onClick={this.unloadJob}>Generate</Tab>
                                <Tab style={{width: "50%"}} onClick={this.getHistory}>Results</Tab>
                            </TabList>

                            <TabPanel forceRender>
                                <Generator jobs={jobs} />
                            </TabPanel>
                            <TabPanel>
                                <JobLinks map={this.state.map} handleDistrictingClick={this.handleDistrictingClick} loadJob={this.loadJob.bind(this)} unloadJob={this.unloadJob} deleteJob={this.deleteJob} jobs={jobs} avg={this.state.average} ex={this.state.extreme} toggle={this.toggleSummary}/>
                            </TabPanel>
                        </Tabs>
                    </div>
                    <div>
                        <div id="summaryDiv" style={{display:"none"}}>
                            <Summary avg={this.state.average} ex={this.state.extreme} unloadJob={this.unloadJob} job={this.state.summaryJob} summary={this.state.summary} toggle={this.toggleSummary}/>
                        </div>
                        <Map forceRender passMap={this.getMapObject} className="col s6 m9 offset-s6 offset-m3"></Map>
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
