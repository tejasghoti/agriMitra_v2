import { PropsWithChildren } from 'react';

export function Card({ children }: PropsWithChildren) {
  return <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">{children}</div>;
}
export function CardHeader({ children }: PropsWithChildren) {
  return <div className="mb-1">{children}</div>;
}
export function CardTitle({ children }: PropsWithChildren) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}
export function CardContent({ children }: PropsWithChildren) {
  return <div className="mt-2">{children}</div>;
}
