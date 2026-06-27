import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// 🚀 FIXED: Accepting vendorPerformance array safely passed down from dashboard parent state
const VendorBarChart = ({ performanceData = [] }) => {
  const hasData = Array.isArray(performanceData) && performanceData.length > 0;

  // 🚀 FIXED: Dynamic array metrics mapping extraction
  const chartLabels = hasData ? performanceData.map(item => item.vendorName || '—') : ['No Data'];
  const chartValues = hasData ? performanceData.map(item => item.totalAmount || 0) : [0];

  const data = {
    labels: chartLabels,
   datasets: [{
    label: 'Total Purchase Amount',
    data: chartValues,
    backgroundColor: hasData
        ? ['#316bf3', '#10b981', '#f59e0b', '#a855f7', '#ef4444']
        : ['#e2e8f0'],
    borderRadius: 6,

    barThickness: 30,
    categoryPercentage: 0.7,
    barPercentage: 0.8
}]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: undefined,
    plugins: { 
      legend: { display: false },
      // 🚀 FIXED: Formatting tooltips layout securely inside Indian Rupees
      tooltip: {
        backgroundColor: '#0f172a',
        layout: {
    padding: {
        right: 80
    }
},
        padding: 10,
        cornerRadius: 8,
        bodyFont: { weight: 'bold' },
        callbacks: {
          label: (context) => {
            const rawValue = context.raw || 0;
            return `Total Purchase: ₹${parseFloat(rawValue).toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        // max attribute deleted to automatically calculate scale bounds according to largest amount
        grid: { color: '#f3f4f6', drawBorder: false },
        ticks: { 
          // 🚀 FIXED: Formatting values in Indian Rupees on Y-Axis ticks frame
          callback: (value) => '₹' + parseFloat(value).toLocaleString('en-IN'), 
          font: { family: 'Inter', size: 11 } 
        }
      },
      x: {
    offset: false,
    grid: {
        display: false
    },
    ticks: {
        font: {
            family: 'Inter',
            size: 11
        }
    }
}
    }
  };

  // 🚀 FIXED: Using structural composite string key prevents Chart.js caching error logs
  const dynamicChartKey = hasData ? performanceData.map(p => `${p.vendorName}-${p.totalAmount}`).join(',') : 'empty';

  return <Bar key={dynamicChartKey} data={data} options={options} height={250} />;
};

export default VendorBarChart;