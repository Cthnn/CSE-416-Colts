import React from 'react';
import Chart from "chart.js";
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';
import * as Constants from './MapConstants.js';

class Plot extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }
    generateDistrictNames(){
      let districtAmount = this.props.summary.summaryData.length; //If just enacted districting
      let names = [];
      for(let i = 1; i <= districtAmount; i++){
        names[i-1]='District ' + i;
      }
      return names;
    }

    createChart() {
      let districtNames = this.generateDistrictNames();

      this.myChart = new Chart(this.chartRef.current, {
        data:{
          datasets:[ {
              type:'scatter',
              label: Constants.BoxPlotLabels.AVG,
              data: this.props.summary.averageData,
              backgroundColor: '#0000ff',
            },{
              type:'scatter',
              label: Constants.BoxPlotLabels.EX,
              data: this.props.summary.extremeData,
              backgroundColor: '#248f24',
            },{
              type:'scatter',
              label: Constants.BoxPlotLabels.ENACTED,
              data: this.props.summary.enactedData,
              backgroundColor: '#000000',
            },{
              type:'boxplot',
              label: 'Generated Districtings',
              data: this.props.summary.summaryData,
              outlierColor: '#999999',
              backgroundColor: '#f2f2f2',
              borderColor: 'black',
              borderWidth: 1
            }
          ],
          labels: districtNames
        },
        
        options:{
          animation: false,
          maintainAspectRatio: false,
          legend:{
            labels: {
              usePointStyle: true
            }
          },
          tooltips:{
            callbacks:{
              label: function(tooltipsItem, data){
                let index = tooltipsItem.index;
                let averageScatterData = data.datasets[0].data
                let extremeMinData = data.datasets[1].data
                let enactedData = data.datasets[2].data
                let boxPlotData = data.datasets[3].data[index].sort();



                let string = ['Min: '+ boxPlotData[0]]
                string.push('Q1:  '+ boxPlotData[Math.floor(0.25 * boxPlotData.length)]);
                string.push('Median:  '+ boxPlotData[Math.floor(0.5 * boxPlotData.length)]);
                string.push('Q3:  '+ boxPlotData[Math.floor(0.75 * boxPlotData.length)]);
                string.push('Max: '+ boxPlotData[boxPlotData.length-1]);
                string.push('Enacted: ' + enactedData[index])
                string.push('Average: ' + averageScatterData[index])
                string.push('Extreme: ' + extremeMinData[index])
                return string;
                return [];
              }
            }
          },
          scales:{
            x: {
              type: 'linear',
              position: 'bottom'
            },
            yAxes:[{
              scaleLabel:{
                display:true,
                labelString: 'Voting Age Population %'
              }
            }],
            xAxes:[{
              scaleLabel:{
                display:true,
                labelString: 'Districts'
              },
              offset: true
            }]
          }
        }
      });
    }
    render() {
      if(this.myChart)
        this.myChart.destroy();
      if(this.props.summary != null && this.props.summary.summaryData != undefined && this.props.summary.summaryData.length > 0){
        this.createChart();
      }
      return <canvas style = {{height: "600px"}}id = "chartCanvas" ref={this.chartRef}/>

    }
}
export default Plot;