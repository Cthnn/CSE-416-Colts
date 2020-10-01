import React from 'react';
import Chart from "chart.js";
class Plot extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }
    componentDidMount() {
        this.myChart = new Chart(this.chartRef.current, {
          type: 'bar',
          data: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [{
                label: 'My data',
                data: [10, 20, 30, 40],
                backgroundColor: '#112233'
            }]
          }
        });
      }
    render() {
      return <canvas ref={this.chartRef}/>
    }
}
export default Plot;