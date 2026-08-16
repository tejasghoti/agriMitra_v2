import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart } from '@/components/charts/LineChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJSON } from '@/lib/api';
import { AdvisoryCard } from '@/components/ui/AdvisoryCard';

interface PricePoint { date: string; price: number }

export default function Market() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<PricePoint[]>([]);
  const [forecast, setForecast] = useState<PricePoint[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const h = await getJSON<PricePoint[]>('/prices/history');
        setHistory(h);
        const f = await getJSON<PricePoint[]>('/prices/forecast?horizon=7');
        setForecast(f);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const histLabels = history.map(p => new Date(p.date).toLocaleDateString());
  const histData = history.map(p => p.price);
  const fcLabels = forecast.map(p => new Date(p.date).toLocaleDateString());
  const fcData = forecast.map(p => p.price);

  return (
    <div className="space-y-6">
      <AdvisoryCard commodity="Tomato" market="Pune" />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('history')}</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart labels={histLabels} series={[{ label: 'Price', data: histData, color: '#8b5cf6' }]} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('forecast')}</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart labels={fcLabels} series={[{ label: 'Forecast', data: fcData, color: '#f59e0b' }]} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
