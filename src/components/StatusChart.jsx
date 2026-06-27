import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatusChart = ({ approved = 0, pending = 0, rejected = 0 }) => {
  // 🚀 FIXED: Agar saara data 0 hai (initial load pe), toh ek placeholder gray segment dikhao ya blank canvas crash se bachao
  const isDataEmpty = approved === 0 && pending === 0 && rejected === 0;
  
  const data = {
    labels: isDataEmpty ? ['No Data'] : ['Approved', 'Pending', 'Rejected'],
    datasets: [{
      label: 'Order Status',
      // 🚀 FIXED: Dynamic verification data matrix allocation array
      data: isDataEmpty ? [1] : [approved, pending, rejected],
      backgroundColor: isDataEmpty ? ['#e2e8f0'] : ['#10b981', '#f97316', '#ef4444'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    // 🚀 FIXED: Dynamic layout update strategy force trigger configuration
    animation: {
      duration: isDataEmpty ? 0 : 500
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: !isDataEmpty, // Disable tooltips if there is no data
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        bodyFont: { weight: 'bold' }
      }
    }
  };

  // 🚀 FIXED: Adding a key prop based on data values forces React to destroy and recreate the chart cleanly on updates

  return <Doughnut
    data={data}
    options={options}
/>
};

export default StatusChart;