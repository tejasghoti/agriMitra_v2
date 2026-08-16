import { Link, useLocation } from 'react-i18next';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { ChatWidget } from './chat/ChatWidget';
import { useEffect, useState } from 'react';
import { getJSON } from '@/lib/api';

export function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const [lastRefresh, setLastRefresh] = useState('');

  useEffect(() => {
    getJSON<{last_refresh: string}>('/meta/last-refresh')
      .then(res => setLastRefresh(new Date(res.last_refresh).toLocaleString()))
      .catch(() => setLastRefresh('Offline fallback'));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <RouterLink to="/" className="text-xl font-black tracking-tight text-green-700">
              AGRIMITRA
            </RouterLink>
            <nav className="hidden md:flex gap-4">
              <RouterLink to="/app/market" className="text-sm font-medium text-slate-600 hover:text-green-600">{t('market')}</RouterLink>
              <RouterLink to="/app/weather" className="text-sm font-medium text-slate-600 hover:text-green-600">{t('weather')}</RouterLink>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={i18n.language} 
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="text-sm border-slate-200 rounded-md bg-slate-50 py-1"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="mr">MR</option>
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-6 flex justify-end">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-500 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {t('as_of')}: {lastRefresh}
          </span>
        </div>
        <Outlet />
      </main>

      <ChatWidget />
    </div>
  );
}
