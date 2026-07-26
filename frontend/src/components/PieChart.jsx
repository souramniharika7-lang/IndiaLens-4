import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartWrapper from './ChartWrapper';

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'right' } }
};

const PieChart = ({ data, options = {}, title, height = 300 }) => (
  <ChartWrapper title={title} height={height}>
    <Pie data={data} options={{ ...defaultOptions, ...options }} />
  </ChartWrapper>
);

export default PieChart;
