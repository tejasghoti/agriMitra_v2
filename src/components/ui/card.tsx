import React from 'react';

interface WithClass { children?: React.ReactNode; className?: string }

export function Card({ children, className = '' }: WithClass) {
  return <div className={`rounded-xl border border-slate-200 bg-white p-3 shadow-sm ${className}`}>{children}</div>;
}
export function CardHeader({ children, className = '' }: WithClass) {
  return <div className={`mb-1 ${className}`}>{children}</div>;
}
export function CardTitle({ children, className = '' }: WithClass) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
export function CardContent({ children, className = '' }: WithClass) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
