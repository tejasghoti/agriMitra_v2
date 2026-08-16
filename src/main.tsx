import React from 'react'
import ReactDOM from 'react-dom/client'
import './i18n';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DashboardLayout } from './components/DashboardLayout'
import Landing from './pages/Landing'
import Market from './pages/Market'
import Weather from './pages/Weather'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/app/market" replace />} />
          <Route path="market" element={<Market />} />
          <Route path="weather" element={<Weather />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
