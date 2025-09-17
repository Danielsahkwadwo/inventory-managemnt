import React from 'react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'emerald' | 'amber' | 'teal' | 'rose';
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color,
  alert = false
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div 
      className={clsx(
        "rounded-lg shadow-sm border p-5 transition-transform duration-200 hover:scale-105",
        {
          [colorClasses[color]]: true,
          'animate-pulse': alert,
        }
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-white p-2 rounded-lg shadow-sm">
            {icon}
          </div>
          <p className="ml-3 text-sm font-medium">{title}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;