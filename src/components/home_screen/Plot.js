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
      let districtAmount = this.props.summary.length; //If just enacted districting
      let names = [];
      for(let i = 1; i <= districtAmount; i++){
        names[i-1]='District ' + i;
      }
      return names;
    }
    generateScatter() {
      var dataset = []
      var averageData = []
      var extremeMinData = []
      var enactedData = []
      for(var i = 0; i < this.props.summary.length; i++){
        let point = {
          x: i*10,
          y: this.props.summary[i][2]
        }
        let minPoint = {
          x: i*10,
          y:this.props.summary[i][0]
        }
        let enactedPoint = {
          x: i*10,
          y:this.props.summary[i][4]
        }
        averageData.push(point);
        extremeMinData.push(minPoint);
        enactedData.push(enactedPoint);
      }
      dataset.push(averageData);
      dataset.push(extremeMinData);
      dataset.push(enactedData);
      return dataset;
    }
    componentDidMount() {
      let districtNames = this.generateDistrictNames();
      let tempScatter = this.generateScatter();
      this.myChart = new Chart(this.chartRef.current, {
        data:{
          datasets:[ {
              type:'scatter',
              label: Constants.BoxPlotLabels.AVG,
              data: tempScatter[0],
              backgroundColor: '#df9554',
            },{
              type:'scatter',
              label: Constants.BoxPlotLabels.EX,
              data: tempScatter[1],
              backgroundColor: '#dfda54',
            },{
              type:'scatter',
              label: Constants.BoxPlotLabels.ENACTED,
              data: tempScatter[2],
              backgroundColor: '#d354df',
            },{
              type:'boxplot',
              label: 'Generated Districtings',
              data: this.props.summary,
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
              },
              ticks:{
                suggestedMax: .5
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
      return <canvas ref={this.chartRef}/>
    }
}
export default Plot;