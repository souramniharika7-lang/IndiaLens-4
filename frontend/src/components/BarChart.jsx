import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartWrapper from './ChartWrapper';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' }, tooltip: { mode: 'index' } },
  scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(128,128,128,0.1)' } } }
};

const BarChart = ({ data, options = {}, title, height = 300 }) => (
  <ChartWrapper title={title} height={height}>
    <Bar data={data} options={{ ...defaultOptions, ...options }} />
  </ChartWrapper>
);

export default BarChart;
