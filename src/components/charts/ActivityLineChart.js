// src/components/charts/ActivityLineChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ActivityLineChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [{
      label: 'Activities Logged per Day',
      data: data.map(d => d.count),
      fill: false,
      borderColor: '#8A2BE2',
      tension: 0.1,
    }],
  };
  
  const options = { responsive: true, plugins: { legend: { position: 'top' } } };

  return <Line options={options} data={chartData} />;
};

export default ActivityLineChart;