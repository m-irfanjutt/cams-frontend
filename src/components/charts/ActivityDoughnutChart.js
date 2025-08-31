// src/components/charts/ActivityDoughnutChart.js
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const formatActivityName = (apiName) => apiName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const ActivityDoughnutChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => formatActivityName(d.activity_type)),
    datasets: [{
      label: 'Activity Breakdown',
      data: data.map(d => d.count),
      backgroundColor: ['#8A2BE2', '#5DADE2', '#48C9B0', '#F4D03F', '#E74C3C', '#34495E'],
      borderWidth: 1,
    }],
  };

  return <Doughnut data={chartData} />;
};

export default ActivityDoughnutChart;