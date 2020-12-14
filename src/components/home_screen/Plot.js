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
              backgroundColor: '#df9554',
            },{
              type:'scatter',
              label: Constants.BoxPlotLabels.EX,
              data: this.props.summary.extremeData,
              backgroundColor: '#dfda54',
            },{
              type:'scatter',
              label: Constants.BoxPlotLabels.ENACTED,
              data: this.props.summary.enactedData,
              backgroundColor: '#d354df',
            },{
              type:'boxplot',
              label: 'Generated Districtings',
              data: this.props.summary.summaryData,
              outlierColor: '#999999',
              backgroundColor: '#5469DF',
              borderColor: 'black',
              borderWidth: 1
            }
          ],
          labels: districtNames
        },
        
        options:{
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
                let boxPlotData = data.datasets[3].data[index];

                let string = ['Min: '+ boxPlotData[0].toString()]
                string.push('Q1:  '+ boxPlotData[1].toString());
                string.push('Median:  '+ boxPlotData[2].toString());
                string.push('Q3:  '+ boxPlotData[3].toString());
                string.push('Max: '+ boxPlotData[4].toString());
                string.push('Generated Average: ' + enactedData[index].y)
                string.push('Generated Average: ' + averageScatterData[index].y)
                string.push('Generated Extreme Min: ' + extremeMinData[index].y)
                return string;
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
      console.log(this.props.summary);
      if(this.myChart)
        this.myChart.destroy();
      if(this.props.summary != null && this.props.summary.summaryData != undefined && this.props.summary.summaryData.length > 0)
        this.createChart();
      return <canvas style = {{height: "500px"}}id = "chartCanvas" ref={this.chartRef}/>

    }
}
export default Plot;