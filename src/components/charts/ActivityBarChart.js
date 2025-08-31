// src/components/charts/ActivityBarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ActivityBarChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.course__course_code),
    datasets: [{
      label: 'Total Activities per Course',
      data: data.map(d => d.count),
      backgroundColor: '#5DADE2',
    }],
  };
  
  const options = {
    indexAxis: 'y', // To make it a horizontal bar chart
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return <Bar options={options} data={chartData} />;
};

export default ActivityBarChart;