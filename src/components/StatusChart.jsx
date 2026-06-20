import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusChart = () => {
  const data = {
    labels: ['Pending', 'Success', 'Transit', 'Done'],
    datasets: [{
      label: 'Order Status',
      data: [8, 17, 27, 40],
      backgroundColor: ['#f97316', '#10b981', '#316bf3', '#a855f7'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        bodyFont: { weight: 'bold' }
      }
    }
  };

  return <Doughnut data={data} options={options} height={250} />;
};

export default StatusChart;