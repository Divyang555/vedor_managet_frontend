import React, { useRef, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const OutlayChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (chartRef.current && chartRef.current.ctx) {
      const ctx = chartRef.current.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
      gradient.addColorStop(0, 'rgba(49, 107, 243, 0.2)');
      gradient.addColorStop(1, 'rgba(49, 107, 243, 0.0)');
      
      setChartData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Spend (₹k)',
          data: [35, 42, 55, 76, 48, 52, 46, 56, 54, 62, 68, 80],
          borderColor: '#316bf3',
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true,
          backgroundColor: gradient
        }]
      });
    }
  }, []);

  const data = chartData || {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Spend (₹k)',
      data: [35, 42, 55, 76, 48, 52, 46, 56, 54, 62, 68, 80],
      borderColor: '#316bf3',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(49, 107, 243, 0.1)'
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false, mode: 'index' },
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6', drawBorder: false },
        ticks: { callback: (value) => '₹' + value + 'k', font: { family: 'Inter', size: 11 } }
      },
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } }
    }
  };

  return <Line ref={chartRef} data={data} options={options} height={250} />;
};

export default OutlayChart;