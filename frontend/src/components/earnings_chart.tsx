import { NextPage } from "next";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";

const EarningsChart: React.FC = () => {
  // Mock data for earnings over months
  const earningsData = [1200, 1500, 1700, 1400, 2000, 2300, 2500, 3000, 2700, 2900, 3100, 3600, 400];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Chart options
  const options = {
    chart: {
      type: 'line',
      height: '400px',
    },
    title: {
      text: 'Monthly Earnings',
    },
    xAxis: {
      categories: months,
      title: {
        text: 'Months',
      },
    },
    yAxis: {
      title: {
        text: 'Earnings ($)',
      },
    },
    series: [
      {
        name: 'Earnings',
        data: earningsData,
        color: '#00FF00'
      },
    ],
    tooltip: {
      shared: true,
      valueSuffix: ' $',
    },
  };

  return (
    <div className="chart-container">
      <div id="earnings-chart">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </div>
  );
}

export default EarningsChart;