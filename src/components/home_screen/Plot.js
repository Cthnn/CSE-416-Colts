import React from 'react';
import Chart from "chart.js";
import 'chartjs-chart-box-and-violin-plot/build/Chart.BoxPlot.js';
class Plot extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }
    componentDidMount() {
      const boxplotData = {
        labels: ['District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 6', 'District 7','District 8','District 9','District 10'],
        datasets: [{
          label: 'Districts',
          backgroundColor: 'rgba(255,0,0,0.5)',
          borderColor: 'red',
          borderWidth: 1,
          outlierColor: '#999999',
          padding: 10,
          itemRadius: 0,
          // data: [
          //   Array.from({length:100}).map(() => Math.random()*(25)+0),
          //   Array.from({length:100}).map(() => Math.random()*(25)+15),
          //   Array.from({length:100}).map(() => Math.random()*(25)+30),
          //   Array.from({length:100}).map(() => Math.random()*(25)+45),
          //   Array.from({length:100}).map(() => Math.random()*(25)+60),
          //   Array.from({length:100}).map(() => Math.random()*(25)+75),
          //   Array.from({length:100}).map(() => Math.random()*(25)+90),
          //   Array.from({length:100}).map(() => Math.random()*(25)+105),
          //   Array.from({length:100}).map(() => Math.random()*(25)+120),
          //   Array.from({length:100}).map(() => Math.random()*(25)+135),
          // ]
          data: this.props.summary
        }]
      };
      console.log(boxplotData)
      this.myChart = new Chart(this.chartRef.current, {
        type: 'boxplot',
        data: boxplotData,
        options:{
          scales:{
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
              }
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