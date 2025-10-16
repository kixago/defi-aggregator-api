
// src/components/Chart.tsx
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './Chart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export type ChartType = 'bar' | 'line' | 'pie';

interface ChartProps {
  type?: ChartType;
  data: any;
  options?: any;
  className?: string;
}

/**
 * Reusable Chart component for Docusaurus pages.
 * Supports Bar, Line, and Pie charts.
 */
const Chart: React.FC<ChartProps> = ({
  type = 'bar',
  data,
  options = {},
  className = '',
}) => {
  const chartComponents: Record<ChartType, JSX.Element> = {
    bar: <Bar data={data} options={options} className={className} />,
    line: <Line data={data} options={options} className={className} />,
    pie: <Pie data={data} options={options} className={className} />,
  };

  return <div className={`${styles.chartWrapper} ${className}`}>{chartComponents[type]}</div>;
};

export default Chart;
