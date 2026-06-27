import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

// 🚀 FIXED: Accepting data prop safely passed down from dashboard parent state layer
const OutlayChart = ({ chartDataList = [] }) => {
  const chartRef = useRef(null);
  const [gradientBg, setGradientBg] = useState('rgba(49, 107, 243, 0.1)');

  const hasData = Array.isArray(chartDataList) && chartDataList.length > 0;

  // 🚀 FIXED: Generate dynamic labels and amounts arrays instantly
  const chartLabels = hasData ? chartDataList.map(item => item.month) : ['No Data'];
  const chartValues = hasData ? chartDataList.map(item => item.amount) : [0];

  // Dynamic canvas height lookup tracking to assign corporate blue gradient styling smoothly
  useEffect(() => {
    if (chartRef.current && chartRef.current.ctx) {
      const ctx = chartRef.current.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 250);
      gradient.addColorStop(0, 'rgba(49, 107, 243, 0.2)');
      gradient.addColorStop(1, 'rgba(49, 107, 243, 0.0)');
      setGradientBg(gradient);
    }
  }, [chartDataList]); // Re-compute if dataset shifts execution

  const data = {
    labels: chartLabels,
    datasets: [{
      label: 'Monthly Expense',
      data: chartValues,
      borderColor: '#316bf3',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
      backgroundColor: gradientBg
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: { 
      legend: { display: false },
      // 🚀 FIXED: Formatting tooltips cleanly inside Indian Rupees format (e.g., ₹2,96,800)
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 10,
        cornerRadius: 8,
        bodyFont: { weight: 'bold' },
        callbacks: {
          label: (context) => {
            const rawValue = context.raw || 0;
            return `Expense: ₹${parseFloat(rawValue).toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6', drawBorder: false },
        ticks: { 
          // 🚀 FIXED: Display values as standard raw Indian currency formatting on Y-Axis ticks frame
          callback: (value) => '₹' + parseFloat(value).toLocaleString('en-IN'), 
          font: { family: 'Inter', size: 11 } 
        }
      },
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } }
    }
  };

  // 🚀 FIXED: Remount rendering canvas dynamically to avoid any Chart.js internal drawing overlap loops
  const chartKey = hasData ? chartDataList.map(c => `${c.month}-${c.amount}`).join(',') : 'empty-expenses';

  return <Line key={chartKey} ref={chartRef} data={data} options={options} height={250} />;
};

export default OutlayChart;