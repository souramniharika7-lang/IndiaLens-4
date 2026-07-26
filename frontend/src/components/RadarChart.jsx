import React from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import ChartWrapper from './ChartWrapper';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'top' } },
  scales: { r: { beginAtZero: true, grid: { color: 'rgba(128,128,128,0.15)' }, pointLabels: { font: { size: 11 } } } }
};

const RadarChart = ({ data, options = {}, title, height = 350 }) => (
  <ChartWrapper title={title} height={height}>
    <Radar data={data} options={{ ...defaultOptions, ...options }} />
  </ChartWrapper>
);

export default RadarChart;
