import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const VendorBarChart = () => {
  const data = {
    labels: ['Dell', 'HP', 'Lenovo', 'Canon', 'Samsung'],
    datasets: [{
      label: 'Efficiency %',
      data: [90, 80, 70, 60, 50],
      backgroundColor: ['#316bf3', '#10b981', '#f59e0b', '#a855f7', '#ef4444'],
      borderRadius: 6,
      barThickness: 16
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: undefined,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: '#f3f4f6', drawBorder: false },
        ticks: { callback: (value) => value + '%', font: { family: 'Inter', size: 11 } }
      },
      x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 } } }
    }
  };

  return <Bar data={data} options={options} height={250} />;
};

export default VendorBarChart;