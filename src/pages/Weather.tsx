import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJSON } from '@/lib/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

interface WeatherPoint { date: string; temp: number; rain: number }

export default function Weather() {
  const [data, setData] = useState<WeatherPoint[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setData(await getJSON<WeatherPoint[]>('/weather/history'));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const labels = data.map(d => new Date(d.date).toLocaleDateString());
  const temps = data.map(d => d.temp);
  const rain = data.map(d => d.rain);

  const chartData: ChartData = {
    labels,
    datasets: [
      { type: 'line' as const, label: 'Temp (°C)', data: temps, borderColor: '#60a5fa', backgroundColor: '#60a5fa', tension: 0.3, yAxisID: 'y' },
      { type: 'bar' as const, label: 'Rain (mm)', data: rain, backgroundColor: '#34d399', yAxisID: 'y1' },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#64748b' } } },
    scales: {
      x: { ticks: { color: '#64748b' } },
      y: { ticks: { color: '#64748b' } },
      y1: { position: 'right' as const, grid: { drawOnChartArea: false }, ticks: { color: '#64748b' } },
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Temperature & Rainfall (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ height: 400 }}>
            <Chart type="bar" data={chartData} options={options} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
