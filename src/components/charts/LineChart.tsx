import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export interface LineChartProps {
  labels: string[];
  series: { label: string; data: number[]; color?: string }[];
  height?: number;
}

export function LineChart({ labels, series, height = 260 }: LineChartProps) {
  const data = {
    labels,
    datasets: series.map((s) => ({
      label: s.label,
      data: s.data,
      borderColor: s.color || '#22c55e',
      backgroundColor: s.color || '#22c55e',
      fill: false,
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    scales: {
      x: { ticks: { color: '#94a3b8' } },
      y: { ticks: { color: '#94a3b8' } },
    },
  } as const;

  return (
    <div style={{ height }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default LineChart;
