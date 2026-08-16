import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getJSON } from '@/lib/api';
import { Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function AdvisoryCard({ commodity = "Tomato", market = "Pune" }) {
  const [advisory, setAdvisory] = useState<{recommendation: string, confidence: string} | null>(null);

  useEffect(() => {
    getJSON<any>(`/advisory/sell-or-hold?commodity=${commodity}&market=${market}`)
      .then(setAdvisory)
      .catch(console.error);
  }, [commodity, market]);

  if (!advisory) return null;

  const Icon = advisory.confidence === 'high' ? CheckCircle2 : 
               advisory.confidence === 'medium' ? Lightbulb : AlertTriangle;
               
  const color = advisory.confidence === 'high' ? 'text-green-500' : 
                advisory.confidence === 'medium' ? 'text-amber-500' : 'text-slate-500';

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Icon className={color} />
          Sell or Hold? ({commodity} - {market})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-green-800 font-medium">{advisory.recommendation}</p>
        <div className="mt-4 text-xs font-semibold text-green-600/70 uppercase tracking-wider">
          Confidence: {advisory.confidence}
        </div>
      </CardContent>
    </Card>
  );
}
