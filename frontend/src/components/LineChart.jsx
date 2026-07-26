import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import ChartWrapper from './ChartWrapper';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(128,128,128,0.1)' }, reverse: false }
  },
  elements: { line: { tension: 0.4 }, point: { radius: 5, hoverRadius: 7 } }
};

const LineChart = ({ data, options = {}, title, height = 300 }) => (
  <ChartWrapper title={title} height={height}>
    <Line data={data} options={{ ...defaultOptions, ...options }} />
  </ChartWrapper>
);

export default LineChart;
